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

Distinct from `rmg-piaar-system`'s VALE.md governance contract and from Cappo/Constance's
backend-only executive-report agents elsewhere in PIAAR — this is the live, user-facing
half. Falls back to static on-brand copy (`FALLBACK_REPLIES` in `vale.ts`) whenever
`ANTHROPIC_API_KEY` isn't configured, so the concierge widget is never broken for a
visitor even before the AI is wired up.
<!-- END:nextjs-agent-rules -->
