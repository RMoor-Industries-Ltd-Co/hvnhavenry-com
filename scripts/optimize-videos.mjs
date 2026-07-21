// Optimizes the site's promo/film videos IN DRIVE, once, via CI.
//
// For every `.mp4` entry in assets.manifest.json this:
//   1. downloads the current master from Drive,
//   2. re-encodes it to a web-optimized H.264 MP4 (capped resolution, sane CRF,
//      AAC audio, +faststart so it streams before fully downloaded),
//   3. uploads the smaller file back to the SAME Drive file id (in place) — so the
//      manifest needs no change and Drive's revision history keeps the original master.
//
// It only replaces a file when the re-encode is meaningfully smaller, and it never
// touches images. Run it from the "Optimize videos" GitHub Action (workflow_dispatch);
// the deploy-time `assets:pull` then fetches the already-small files with no per-boot
// encoding cost.
//
// Credentials: the same OAuth trio used by pull-assets.mjs — GDRIVE_CLIENT_ID,
// GDRIVE_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN. Writing back requires the token to carry
// a writable Drive scope (drive or drive.file); a read-only token 403s on upload (the
// script reports this clearly and leaves the master untouched).
//
// Env knobs (all optional): DRY_RUN=1 (encode + compare, never upload),
// MAX_WIDTH (default 1920), CRF (default 24), FFMPEG_PRESET (default slow),
// MIN_SAVING (default 0.05 — require ≥5% smaller to replace).

import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { readFile, stat, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const MANIFEST_PATH = join(ROOT, "assets.manifest.json");
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_FILES = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";

const DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const MAX_WIDTH = Number(process.env.MAX_WIDTH || 1920);
const CRF = Number(process.env.CRF || 24);
const PRESET = process.env.FFMPEG_PRESET || "slow";
const MIN_SAVING = Number(process.env.MIN_SAVING || 0.05);

const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1) + " MB";

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
  if (!res.ok) throw new Error(`token exchange failed (${res.status}): ${await res.text()}`);
  return (await res.json()).access_token;
}

async function downloadTo(fileId, destPath, accessToken) {
  const res = await fetch(`${DRIVE_FILES}/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`download ${res.status} ${res.statusText}: ${await res.text()}`);
  const { createWriteStream } = await import("node:fs");
  await new Promise((resolve, reject) => {
    const out = createWriteStream(destPath);
    Readable.fromWeb(res.body).on("error", reject).pipe(out).on("finish", resolve).on("error", reject);
  });
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn("ffmpeg", args, { stdio: ["ignore", "ignore", "inherit"] });
    proc.on("error", reject);
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));
  });
}

// Replace a Drive file's content in place (same id) via a simple media upload.
async function uploadInPlace(fileId, srcPath, accessToken) {
  const { size } = await stat(srcPath);
  const res = await fetch(`${DRIVE_UPLOAD}/${fileId}?uploadType=media`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "video/mp4",
      "Content-Length": String(size),
    },
    body: Readable.toWeb(createReadStream(srcPath)),
    duplex: "half",
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 403) {
      throw new Error(
        `upload 403 (insufficient scope?): the OAuth token cannot write to Drive. ` +
          `Re-consent with a writable scope (drive or drive.file). Details: ${body}`
      );
    }
    throw new Error(`upload ${res.status} ${res.statusText}: ${body}`);
  }
}

async function main() {
  const clientId = process.env.GDRIVE_CLIENT_ID;
  const clientSecret = process.env.GDRIVE_CLIENT_SECRET;
  const refreshToken = process.env.GDRIVE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    console.error(
      "[optimize] No OAuth credentials — set GDRIVE_CLIENT_ID + GDRIVE_CLIENT_SECRET + " +
        "GDRIVE_REFRESH_TOKEN. Nothing to do."
    );
    process.exitCode = 1;
    return;
  }

  const { assets } = JSON.parse(await readFile(MANIFEST_PATH, "utf-8"));
  const videos = (assets || []).filter((a) => /\.mp4$/i.test(a.name || a.destPath || ""));
  if (videos.length === 0) {
    console.log("[optimize] No .mp4 assets in the manifest — nothing to optimize.");
    return;
  }

  const accessToken = await oauthAccessToken({ clientId, clientSecret, refreshToken });
  console.log(
    `[optimize] ${videos.length} video(s); MAX_WIDTH=${MAX_WIDTH} CRF=${CRF} preset=${PRESET}` +
      (DRY_RUN ? " (DRY RUN — no uploads)" : "")
  );

  const work = await mkdtemp(join(tmpdir(), "hvn-optimize-"));
  let replaced = 0;
  let failures = 0;
  try {
    for (const asset of videos) {
      const label = asset.name || asset.driveFileId;
      const inPath = join(work, `in-${asset.driveFileId}.mp4`);
      const outPath = join(work, `out-${asset.driveFileId}.mp4`);
      try {
        await downloadTo(asset.driveFileId, inPath, accessToken);
        const { size: inSize } = await stat(inPath);

        // Cap width to MAX_WIDTH (never upscale), keep aspect, force even dims for yuv420p.
        await ffmpeg([
          "-y",
          "-i", inPath,
          "-vf", `scale='min(${MAX_WIDTH},iw)':-2`,
          "-c:v", "libx264",
          "-preset", PRESET,
          "-crf", String(CRF),
          "-pix_fmt", "yuv420p",
          "-c:a", "aac",
          "-b:a", "128k",
          "-movflags", "+faststart",
          outPath,
        ]);
        const { size: outSize } = await stat(outPath);
        const saving = 1 - outSize / inSize;
        const pct = (saving * 100).toFixed(1);

        if (saving < MIN_SAVING) {
          console.log(
            `[optimize] SKIP ${label}: ${mb(inSize)} → ${mb(outSize)} (only ${pct}% smaller; ` +
              `already optimized). Master left untouched.`
          );
          continue;
        }
        if (DRY_RUN) {
          console.log(`[optimize] DRY ${label}: ${mb(inSize)} → ${mb(outSize)} (−${pct}%).`);
          continue;
        }
        await uploadInPlace(asset.driveFileId, outPath, accessToken);
        replaced += 1;
        console.log(`[optimize] ✓ ${label}: ${mb(inSize)} → ${mb(outSize)} (−${pct}%) written to Drive.`);
      } catch (err) {
        failures += 1;
        console.error(`[optimize] FAILED ${label} (${asset.driveFileId}): ${err.message}`);
      }
    }
  } finally {
    await rm(work, { recursive: true, force: true });
  }

  console.log(`[optimize] Done. ${replaced} replaced, ${failures} failed, ${videos.length} total.`);
  if (failures > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error("[optimize] unexpected error:", err);
  process.exitCode = 1;
});
