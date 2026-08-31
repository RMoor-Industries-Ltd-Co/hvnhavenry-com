# nginx/conf.d — per-site vhosts loaded via `include`

`nginx.conf` loads `*.enabled.conf` from this directory (`include
/etc/nginx/conf.d/*.enabled.conf;`). A `.conf` file that does **not** end in
`.enabled.conf` (e.g. `*.disabled.conf`) is never loaded — that's the mechanism, not a
naming suggestion. Use it to ship config that isn't safe to activate yet (most often:
references a TLS certificate that doesn't exist on the server yet) without ever risking
an `nginx -s reload`/container start failure.

**Why this matters:** this nginx container serves `hvnhavenry.com` too. If any loaded
config block references a certificate file that isn't present, nginx fails to start
*entirely* — taking the live Havenry site down along with whatever new site you were
trying to add. Never let a `git push`/deploy alone be able to cause that.

## Current files

| File | Loaded? | Purpose |
|---|---|---|
| `preview-global.enabled.conf` | Yes | HVN Global preview (`preview.hvnglobalco.com`), port 80 only, serves content directly — safe by construction, no cert dependency |
| `preview-global-https.disabled.conf` | No | The TLS version of the above, ready to activate once a cert exists |

## Activating SSL for `preview.hvnglobalco.com` (manual, one-time)

This step needs someone with SSH access to the Linode (`66.228.57.116`) — it is
**not** automated by CI, deliberately: obtaining a certificate is a good moment for a
human to actually look at what's happening, and automating it risked guessing wrong
about how this server's existing `hvnhavenry.com` certificate was originally obtained
(this repo's own history doesn't show that step — it predates the tracked config).

1. Confirm DNS: `dig preview.hvnglobalco.com` should resolve to `66.228.57.116`.
2. Obtain the certificate. The most likely to work without any nginx config gymnastics,
   given this box's nginx runs in a container that already owns ports 80/443:
   ```bash
   cd /path/to/hvnhavenry-com   # wherever this repo is checked out on the server
   docker compose stop nginx
   sudo certbot certonly --standalone -d preview.hvnglobalco.com
   docker compose start nginx
   ```
   (Briefly stopping the `nginx` container frees ports 80/443 for certbot's own
   temporary listener — `hvnhavenry.com` will be unreachable for the ~seconds this
   takes. Do this at a quiet time, or adapt to whatever method was actually used for
   this server's existing cert if you know it — e.g. a webroot volume — since that's
   proven to already work here and this doc's author didn't have access to check.)
3. Confirm the cert landed: `sudo ls /etc/letsencrypt/live/preview.hvnglobalco.com/`
   should show `fullchain.pem` and `privkey.pem`.
4. Activate, per `preview-global-https.disabled.conf`'s own header comment:
   - Replace `preview-global.enabled.conf`'s contents with the port-80
     redirect block from the top of `preview-global-https.disabled.conf`.
   - `mv preview-global-https.disabled.conf preview-global-https.enabled.conf`
   - `docker compose up -d --force-recreate nginx`
5. Verify both sites: `curl -I https://hvnhavenry.com` and
   `curl -I https://preview.hvnglobalco.com` should both return successfully.
6. Set a renewal hook/cron for this cert the same way the existing `hvnhavenry.com`
   one is renewed, if that isn't already handled by a system-wide certbot timer
   covering all certs on the box.
