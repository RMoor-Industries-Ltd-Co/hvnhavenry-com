> **Cross-project contracts and architecture** live in [`rmg-piaar-system`](https://github.com/RMoor-Industries-Ltd-Co/rmg-piaar-system). Read that first for the full system picture — it governs standing rules and cross-repo decisions for the whole PIAAR ecosystem.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Vale — the public concierge

`src/lib/vale.ts` + `POST /api/vale` + `src/components/ui/ValeConcierge.tsx`. Vale is
**fully public, no login** — safe specifically because the client can only ever send a
fixed `promptKey` (`welcome` | `speak_to_concierge` | `view_cart` | `acquire_this`) plus,
optionally, a real `ProductId` from `src/lib/products.ts`. There is no free-text input
anywhere in this flow, client or server — the API route rejects anything outside those
enums before Vale's system prompt is ever built. Do not add a chat box or any field that
lets a visitor's own words reach the model; that's the whole safety model for a public,
unauthenticated AI surface with no rate-limited API key.

Distinct from `rmg-piaar-system`'s `contracts/24-vale-hvn-concierge.md` governance contract and from Cappo/Constance's
backend-only executive-report agents elsewhere in PIAAR — this is the live, user-facing
half. Falls back to static on-brand copy (`FALLBACK_REPLIES` in `vale.ts`) whenever
`ANTHROPIC_API_KEY` isn't configured, so the concierge widget is never broken for a
visitor even before the AI is wired up.

## Vale's HVN<->AMG backend channel (pull-ready for Cappo/ALLIE/ALLEN)

Every `POST /api/vale` call best-effort logs `{promptKey, productId}` (never visitor
identity — none is ever collected) to Postgres via `src/lib/db.ts`'s `logValeInteraction`.
`src/lib/valeReportScheduler.ts`, started from `src/instrumentation.ts` at boot — same
in-process hourly-check pattern as Cappo_Meridian's `cappoReportScheduler.ts` /
connection-circle's `constanceReportScheduler.ts` (state in Postgres' `vale_reports`,
survives restarts), regenerates every ≥6h. Aggregate-only, matching Constance's privacy
pattern: counts by prompt type and top-asked-about products, never a raw interaction record.

- **Pull the cached report**: `GET /api/agent/report` with header `x-agent-key:
  $AGENT_API_KEY` — returns instantly, never triggers a live call. This is what Cappo
  (AMG's operations AI, for HVN<->AMG business coordination) and ALLIE/ALLEN (via her
  rollup) read instead of triggering live work just to check HVN showroom activity.
- **Live delegation**: `POST /api/agent` with `{"task": "..."}`, same auth — for a
  one-off question Cappo or ALLEN needs answered now. Distinct from `POST /api/vale`:
  this route accepts a free-text task because the caller is a trusted, keyed internal
  agent, not an anonymous visitor — the public concierge's no-free-text rule doesn't
  apply here.
- Both routes use `src/lib/agentAuth.ts`'s constant-time `isAgentAuthorized` from day
  one (not retrofitted) — the same pattern used across every other PIAAR M2M endpoint.
- `DATABASE_URL`/`AGENT_API_KEY` unset means logging/reporting silently no-op — the
  public concierge itself keeps working either way.
<!-- END:nextjs-agent-rules -->
