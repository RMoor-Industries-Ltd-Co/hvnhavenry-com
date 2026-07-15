import { getLastValeReport, saveValeReport } from "./db";
import { generateValeReport } from "./vale";

// Same single-container-deploy pattern as every other PIAAR scheduled report this
// session (Cappo_Meridian's cappoReportScheduler.ts, connection-circle's
// constanceReportScheduler.ts): check hourly, but only actually regenerate once at
// least CHECK_GAP_MS has passed since the last report (tracked in Postgres, so it
// survives restarts/redeploys without duplicating work).
const CHECK_INTERVAL_MS = 60 * 60 * 1000;
const MIN_GAP_MS = 6 * 60 * 60 * 1000;
const INITIAL_DELAY_MS = 45 * 1000;

let started = false;

async function maybeGenerate(): Promise<void> {
  try {
    const last = await getLastValeReport();
    const sinceLast = last ? Date.now() - new Date(last.generatedAt).getTime() : Infinity;
    if (sinceLast < MIN_GAP_MS) return;

    const report = await generateValeReport(24);
    await saveValeReport(report);
    console.log("[vale-report] generated and cached");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[vale-report] failed:", message);
    await saveValeReport(null, message).catch(() => {});
  }
}

/** Starts the periodic HVN<->AMG report generation. Safe to call once per server instance.
 * No-ops if DATABASE_URL isn't configured (local dev, PR previews). */
export function startValeReportScheduler(): void {
  if (started || !process.env.DATABASE_URL) return;
  started = true;
  setTimeout(() => void maybeGenerate(), INITIAL_DELAY_MS);
  setInterval(() => void maybeGenerate(), CHECK_INTERVAL_MS);
}
