@AGENTS.md

## Server & Deploy Layout

| Thing | Value |
|---|---|
| **Deploy host** | `$LINODE_HOST` (GitHub Actions secret) |
| **Deploy path** | `/srv/hvnhavenry/` |
| **docker-compose** | `docker-compose.yml` (repo root) |

### Container Names (compose project = `hvnhavenry`)

| Service | Notes |
|---|---|
| `app` | Next.js app, port 3000 (internal) |
| `nginx` | Reverse proxy, ports 80/443, TLS via Let's Encrypt (`/etc/letsencrypt`) |

### Manual Restart
```bash
cd /srv/hvnhavenry && docker compose up -d
```

Secrets are loaded from `.env.local` on the server (not Doppler).
