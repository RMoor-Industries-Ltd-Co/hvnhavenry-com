// Pulls production assets from the HVN_HAVENRY_SITE Google Drive folder into public/,
// per assets.manifest.json. See ASSETS.md for the naming convention and setup steps.
//
// Two credential paths (checked in this order):
//   1. GDRIVE_ASSETS_CREDENTIALS — a service-account JSON key (dedicated read-only identity).
//   2. GDRIVE_CLIENT_ID + GDRIVE_CLIENT_SECRET + GDRIVE_REFRESH_TOKEN — the same Google
//      OAuth credentials ALLEN / MyTubeScript / creator-os already use (allen-i-verse
//      Doppler). Lets this site reuse existing creds with no new GCP setup.
//
// No-ops (exit 0) when neither is configured, so it's safe to leave out of any environment.

import { createWriteStream, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const MANIFEST_PATH = join(ROOT, "assets.manifest.json");
const PUBLIC_DIR = join(ROOT, "public");

const DRIVE_SCOPES = ["https://www.googleapis.com/auth/drive.readonly"];

async function buildAuth(google) {
  // 1. Service-account JSON key.
  const serviceAccountRaw = process.env.GDRIVE_ASSETS_CREDENTIALS;
  if (serviceAccountRaw) {
    return new google.auth.GoogleAuth({
      credentials: JSON.parse(serviceAccountRaw),
      scopes: DRIVE_SCOPES,
    });
  }

  // 2. OAuth credentials (same set ALLEN / MyTubeScript / creator-os use).
  const clientId = process.env.GDRIVE_CLIENT_ID;
  const clientSecret = process.env.GDRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GDRIVE_REFRESH_TOKEN;
  if (clientId && clientSecret && refreshToken) {
    const oauth = new google.auth.OAuth2(clientId, clientSecret);
    oauth.setCredentials({ refresh_token: refreshToken });
    return oauth;
  }

  return null;
}

async function main() {
  const { google } = await import("googleapis");
  const auth = await buildAuth(google);
  if (!auth) {
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

  const drive = google.drive({ version: "v3", auth });

  let failures = 0;
  for (const asset of assets) {
    const destPath = join(PUBLIC_DIR, asset.destPath);
    try {
      mkdirSync(dirname(destPath), { recursive: true });
      const res = await drive.files.get(
        { fileId: asset.driveFileId, alt: "media" },
        { responseType: "stream" }
      );
      await new Promise((resolve, reject) => {
        const out = createWriteStream(destPath);
        res.data.on("error", reject).pipe(out).on("finish", resolve).on("error", reject);
      });
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
