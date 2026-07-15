import { Pool } from "pg";

/**
 * Postgres access for hvnhavenry-com. Nothing on this marketing site is stateful except
 * Vale's concierge activity log + her scheduled HVN<->AMG report cache (valeReportScheduler.ts).
 *
 * Uses a single pooled connection (DATABASE_URL), schema created lazily and idempotently
 * on first use -- no separate migration runner. When DATABASE_URL is unset (local dev,
 * PR previews), everything degrades to a null pool and callers no-op rather than error,
 * matching npm run assets:pull's existing "silently no-op without config" convention.
 */

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  }
  return pool;
}

async function ensureSchema(p: Pool): Promise<void> {
  if (!schemaReady) {
    schemaReady = p
      .query(`
        CREATE TABLE IF NOT EXISTS vale_interactions (
          id           BIGSERIAL PRIMARY KEY,
          prompt_key   TEXT NOT NULL,
          product_id   TEXT,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_vale_interactions_created_at
          ON vale_interactions(created_at);

        CREATE TABLE IF NOT EXISTS vale_reports (
          id            BIGSERIAL PRIMARY KEY,
          report_text   TEXT,
          generated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
          error         TEXT
        );

        -- Site-fault log -- ALLEN/ALLIE's window into "is anything broken on the site."
        -- Populated by generateValeReply's own failure path (an AI call erroring means
        -- something's actually wrong, not just an unconfigured key) and available for any
        -- other part of the app to log into later (a client-side error boundary, a broken
        -- asset pull, etc.) via logSiteFault.
        CREATE TABLE IF NOT EXISTS site_faults (
          id           BIGSERIAL PRIMARY KEY,
          source       TEXT NOT NULL,
          message      TEXT NOT NULL,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_site_faults_created_at
          ON site_faults(created_at);
      `)
      .then(() => undefined)
      .catch((e) => {
        schemaReady = null;
        throw e;
      });
  }
  return schemaReady;
}

// Best-effort: a failure here should never break a visitor's concierge reply, so callers
// wrap this in try/catch and swallow errors (see api/vale/route.ts).
export async function logValeInteraction(promptKey: string, productId?: string): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensureSchema(p);
  await p.query(`INSERT INTO vale_interactions (prompt_key, product_id) VALUES ($1, $2)`, [
    promptKey,
    productId ?? null
  ]);
}

// Best-effort, same reasoning as logValeInteraction -- never let logging itself become
// a second failure. Source identifies where the fault was observed (e.g. "vale_reply",
// "vale_report", or a future client-side reporter).
export async function logSiteFault(source: string, message: string): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensureSchema(p);
  await p.query(`INSERT INTO site_faults (source, message) VALUES ($1, $2)`, [source, message.slice(0, 2000)]);
}

export type SiteFaultSummary = { totalFaults: number; recent: { source: string; message: string; createdAt: string }[] };

export async function getSiteFaultSummary(sinceHours: number): Promise<SiteFaultSummary> {
  const p = getPool();
  if (!p) return { totalFaults: 0, recent: [] };
  await ensureSchema(p);
  const since = `now() - interval '${Math.max(1, Math.floor(sinceHours))} hours'`;
  const [total, recent] = await Promise.all([
    p.query<{ count: string }>(`SELECT count(*) AS count FROM site_faults WHERE created_at >= ${since}`),
    p.query<{ source: string; message: string; created_at: string }>(
      `SELECT source, message, created_at::text FROM site_faults WHERE created_at >= ${since} ORDER BY created_at DESC LIMIT 10`
    )
  ]);
  return {
    totalFaults: Number(total.rows[0]?.count ?? 0),
    recent: recent.rows.map((r) => ({ source: r.source, message: r.message, createdAt: r.created_at }))
  };
}

export type InteractionCounts = { promptKey: string; count: number }[];
export type ProductInterestCounts = { productId: string; count: number }[];

// Aggregate-only, matching the same shape every other PIAAR domain-agent report uses --
// counts, not raw visitor records. There's no PII collected here in the first place
// (no visitor identity, no free text), but keep this pattern consistent regardless.
export async function getInteractionSummary(sinceHours: number): Promise<{
  totalInteractions: number;
  byPromptKey: InteractionCounts;
  topProducts: ProductInterestCounts;
}> {
  const p = getPool();
  if (!p) return { totalInteractions: 0, byPromptKey: [], topProducts: [] };
  await ensureSchema(p);

  const since = `now() - interval '${Math.max(1, Math.floor(sinceHours))} hours'`;
  const [total, byKey, byProduct] = await Promise.all([
    p.query<{ count: string }>(`SELECT count(*) AS count FROM vale_interactions WHERE created_at >= ${since}`),
    p.query<{ prompt_key: string; count: string }>(
      `SELECT prompt_key, count(*) AS count FROM vale_interactions WHERE created_at >= ${since} GROUP BY prompt_key ORDER BY count DESC`
    ),
    p.query<{ product_id: string; count: string }>(
      `SELECT product_id, count(*) AS count FROM vale_interactions WHERE created_at >= ${since} AND product_id IS NOT NULL GROUP BY product_id ORDER BY count DESC LIMIT 10`
    )
  ]);

  return {
    totalInteractions: Number(total.rows[0]?.count ?? 0),
    byPromptKey: byKey.rows.map((r) => ({ promptKey: r.prompt_key, count: Number(r.count) })),
    topProducts: byProduct.rows.map((r) => ({ productId: r.product_id, count: Number(r.count) }))
  };
}

export type ValeReport = { reportText: string | null; generatedAt: string; error: string | null };

export async function saveValeReport(reportText: string | null, error?: string): Promise<void> {
  const p = getPool();
  if (!p) return;
  await ensureSchema(p);
  await p.query(`INSERT INTO vale_reports (report_text, error) VALUES ($1, $2)`, [reportText, error ?? null]);
}

export async function getLastValeReport(): Promise<ValeReport | undefined> {
  const p = getPool();
  if (!p) return undefined;
  await ensureSchema(p);
  const result = await p.query<{ report_text: string | null; generated_at: string; error: string | null }>(
    `SELECT report_text, generated_at::text, error FROM vale_reports ORDER BY id DESC LIMIT 1`
  );
  const row = result.rows[0];
  if (!row) return undefined;
  return { reportText: row.report_text, generatedAt: row.generated_at, error: row.error };
}

// Mirrors Cappo_Meridian's getLastSuccessfulCappoReport fix -- a failed scheduled
// generation inserts a row with report_text = null, and the pull endpoint should keep
// serving the last USABLE report through a transient outage instead of collapsing to
// "no report generated yet."
export async function getLastSuccessfulValeReport(): Promise<ValeReport | undefined> {
  const p = getPool();
  if (!p) return undefined;
  await ensureSchema(p);
  const result = await p.query<{ report_text: string | null; generated_at: string; error: string | null }>(
    `SELECT report_text, generated_at::text, error FROM vale_reports WHERE report_text IS NOT NULL ORDER BY id DESC LIMIT 1`
  );
  const row = result.rows[0];
  if (!row) return undefined;
  return { reportText: row.report_text, generatedAt: row.generated_at, error: row.error };
}
