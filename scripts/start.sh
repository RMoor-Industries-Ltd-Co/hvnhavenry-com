#!/bin/sh
# Container entrypoint: pull fresh Drive assets into public/ (no-op when no
# credentials are present), then start the Next.js standalone server.
# Runtime env (Doppler-injected via docker-compose env_file) supplies the
# GDRIVE_* creds, so asset refresh is hands-free on every deploy/restart.
set -e

node scripts/pull-assets.mjs || echo "[start] asset pull skipped/failed — serving existing public/"

exec node server.js
