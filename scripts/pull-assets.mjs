// Pulls production assets from the HVN_HAVENRY_SITE Google Drive folder into public/,
// per assets.manifest.json. See ASSETS.md for the naming convention and setup steps.
//
// Two credential paths (checked in this order):
//   1. GDRIVE_ASSETS_CREDENTIALS — a service-account JSON key (dedicated read-only identity).
//      Uses `googleapis` (dynamically imported only on this path).
//   2. GDRIVE_CLIENT_ID + GDRIVE_CLIENT_SECRET + GDRIVE_REFRESH_TOKEN — the same Google
//      OAuth credentials ALLEN / MyTubeScript / creator-os already use (allen-i-verse
//      Doppler). Dependency-free (built-in fetch), so it runs in the slim runtime image.
//
// No-ops (exit 0) when neither is configured, so it's safe to run in any environment —
// including at container start, where the deploy's Doppler-injected env supplies the creds.

import { createWriteStream, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const MANIFEST_PATH = join(ROOT, "assets.manifest.json");
const PUBLIC_DIR = join(ROOT, "public");
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_FILES = "https://www.googleapis.com/drive/v3/files";

// Exchange the long-lived refresh token for a short-lived access token.
async function oauthAccessToken({ clientId, clientSecret, refreshToken }) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    throw new Error(`token exchange failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()).access_token;
}

// Returns a downloader: (asset, destPath) -> writes the file. Null when unconfigured.
async function buildDownloader() {
  // 1. Service-account JSON key — uses googleapis (imported only here).
  const serviceAccountRaw = process.env.GDRIVE_ASSETS_CREDENTIALS;
  if (serviceAccountRaw) {
    const { google } = await import("googleapis");
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountRaw),
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    const drive = google.drive({ version: "v3", auth });
    return async (asset, destPath) => {
      const res = await drive.files.get(
        { fileId: asset.driveFileId, alt: "media" },
        { responseType: "stream" }
      );
      await new Promise((resolve, reject) => {
        const out = createWriteStream(destPath);
        res.data.on("error", reject).pipe(out).on("finish", resolve).on("error", reject);
      });
    };
  }

  // 2. OAuth credentials — dependency-free via fetch.
  const clientId = process.env.GDRIVE_CLIENT_ID;
  const clientSecret = process.env.GDRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GDRIVE_REFRESH_TOKEN;
  if (clientId && clientSecret && refreshToken) {
    const accessToken = await oauthAccessToken({ clientId, clientSecret, refreshToken });
    return async (asset, destPath) => {
      const res = await fetch(`${DRIVE_FILES}/${asset.driveFileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        throw new Error(`${res.status} ${res.statusText}: ${await res.text()}`);
      }
      await new Promise((resolve, reject) => {
        const out = createWriteStream(destPath);
        Readable.fromWeb(res.body).on("error", reject).pipe(out).on("finish", resolve).on("error", reject);
      });
    };
  }

  return null;
}

async function main() {
  let download;
  try {
    download = await buildDownloader();
  } catch (err) {
    console.error(`[assets:pull] credential setup failed: ${err.message}`);
    process.exitCode = 1;
    return;
  }

  if (!download) {
    console.warn(
      "[assets:pull] No Drive credentials configured — skipping asset pull. " +
        "Set GDRIVE_ASSETS_CREDENTIALS (service account) or " +
        "GDRIVE_CLIENT_ID + GDRIVE_CLIENT_SECRET + GDRIVE_REFRESH_TOKEN (OAuth). See ASSETS.md."
    );
    return;
  }

  const { assets } = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
  if (!assets?.length) {
    console.warn("[assets:pull] assets.manifest.json has no entries — nothing to pull.");
    return;
  }

  let failures = 0;
  for (const asset of assets) {
    const destPath = join(PUBLIC_DIR, asset.destPath);
    try {
      mkdirSync(dirname(destPath), { recursive: true });
      await download(asset, destPath);
      console.log(`[assets:pull] ${asset.name} -> public/${asset.destPath}`);
    } catch (err) {
      failures += 1;
      console.error(`[assets:pull] FAILED ${asset.name} (${asset.driveFileId}): ${err.message}`);
    }
  }

  if (failures > 0) {
    console.error(`[assets:pull] ${failures} of ${assets.length} asset(s) failed to pull.`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("[assets:pull] unexpected error:", err);
  process.exitCode = 1;
});
