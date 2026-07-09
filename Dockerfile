# ── Stage 1: install deps ──────────────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# ── Stage 2: build ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: production runner ─────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# standalone output is self-contained
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Asset-pull entrypoint: fetches Drive assets into public/ at container start
# (dependency-free OAuth path; no-ops without creds). public/ must be writable
# by the runtime user so the pull can land files there.
COPY --from=builder /app/scripts/pull-assets.mjs ./scripts/pull-assets.mjs
COPY --from=builder /app/scripts/start.sh ./scripts/start.sh
COPY --from=builder /app/assets.manifest.json ./assets.manifest.json

# Optional: sharp powers the best-effort PNG/JPG -> WebP optimization in the pull
# step. Best-effort install — if it fails, the build still succeeds and the pull
# simply skips WebP (CSS image-set falls back to the original PNG).
RUN npm install --no-save --no-audit --no-fund sharp@^0.33 \
    || echo "[build] sharp unavailable; WebP optimization will be skipped at runtime"

RUN chown -R nextjs:nodejs /app/public /app/scripts

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["sh", "scripts/start.sh"]
