// Pulls production assets from the HVN_HAVENRY_SITE Google Drive folder into public/,
// per assets.manifest.json. See ASSETS.md for the naming convention and setup steps.
//
// No-ops (exit 0) when GDRIVE_ASSETS_CREDENTIALS isn't set, so this is safe to leave
// out of every environment until the service account described in ASSETS.md exists.

import { createWriteStream, mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const MANIFEST_PATH = join(ROOT, "assets.manifest.json");
const PUBLIC_DIR = join(ROOT, "public");

async function main() {
  const credentialsRaw = process.env.GDRIVE_ASSETS_CREDENTIALS;
  if (!credentialsRaw) {
    console.warn(
      "[assets:pull] GDRIVE_ASSETS_CREDENTIALS is not set — skipping asset pull. " +
        "See ASSETS.md for one-time service-account setup."
    );
    return;
  }

  const { assets } = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
  if (!assets?.length) {
    console.warn("[assets:pull] assets.manifest.json has no entries — nothing to pull.");
    return;
  }

  const { google } = await import("googleapis");
  const credentials = JSON.parse(credentialsRaw);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
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
