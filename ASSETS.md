# Asset Pipeline — HVN Havenry

Google Drive is the **source of truth** for every image/video asset on this site — brand
assets, hero/section imagery, product photography, and promotional creative. Nothing
binary gets hand-committed to git; assets are pulled from Drive into `public/` at
build/deploy time by `scripts/pull-assets.mjs`, driven by `assets.manifest.json`.

This keeps the git history free of binary churn and gives every asset one predictable
name, in one predictable place, regardless of who dropped it in Drive or when.

## Drive folder

Root: **`HVN_HAVENRY_SITE`** — <https://drive.google.com/drive/folders/1OUtfCNCeA7jxjY0-XULL6me_M0gW7GkL>

```
HVN_HAVENRY_SITE/
├── 00_BRAND/            Singleton brand assets — favicon, logo, social preview
│   └── MARKS/           Recurring brand seals/stamps (see `mark` category below)
├── 01_HERO/             Section 1 (hero) imagery
│   └── CHARACTERS/      Cast photography, one subfolder per character (VALE, EVE, …)
├── 02_STORY/            Section 2 (scroll-story) imagery, if ever needed
│   └── WORDING/         Story copy/text reference — convention TBD
├── 03_ROOM/
│   ├── atmos-ritual/    Section 3 room-tab imagery, one subfolder per collection
│   ├── hvn-chamber/
│   ├── hvn-living/
│   └── standard-line/
├── 04_VIDEO/            Section 4 (video reveal) posters/films
├── 05_FOOTER/           Footer imagery, if ever needed
├── PRODUCTS/
│   └── <product-slug>/  One subfolder per product (hero/detail/lifestyle shots)
├── PROMOTIONS/
│   └── <campaign-slug>/ One subfolder per campaign (banners, social creative)
├── _REFERENCE/          Mood boards, material swatches — never pulled to production
├── _INBOX/              Untriaged raw drops — rename + file before moving out
└── _ARCHIVE/            Retired/superseded assets — never pulled to production
```

`_REFERENCE`, `_INBOX`, and `_ARCHIVE` are excluded from the pull script by convention —
nothing under them should ever reach `public/`. `01_HERO/CHARACTERS` now follows the
`character` category convention below. `02_STORY/WORDING` is still an in-progress
addition — its own naming convention isn't formalized yet.

## Naming convention

Two asset kinds, two rules.

### 1. Brand slot assets — fixed canonical filenames

One file per purpose, living in `00_BRAND/`. The filename **is** the identity — no slug,
no variant, no sequence number. Drive's own version history covers "what changed when."

| Filename | Purpose | Destination |
|---|---|---|
| `favicon.svg` | Browser tab icon (vector) | `public/favicon.svg` |
| `favicon-512.png` | Fallback/apple-touch raster icon | `public/favicon-512.png` |
| `logo-mark.svg` | Icon-only mark (no wordmark) | `public/logo-mark.svg` |
| `logo-wordmark.svg` | Full wordmark lockup | `public/logo-wordmark.svg` |
| `og-image.png` | Social share preview (1200×630) | `public/og-image.png` |

Adding a new brand slot asset later (e.g. `apple-touch-icon.png`) means: pick a fixed
name, drop it in `00_BRAND/`, add one line to `assets.manifest.json`. That's it.

### 2. Scalable assets — structured, field-based filenames

Everything else (hero variants, room tabs, product photography, promo creative) uses:

```
<category>__<slug>__<variant>[__<seq>].<ext>
```

- **`category`** — fixed vocabulary: `hero`, `story`, `room`, `video`, `footer`,
  `product`, `promo`, `reference`, `mark`, `character`. (Matches the top-level Drive
  folder it lives in.)
- **`slug`** — kebab-case identifier: a product id, a collection id, a campaign id.
  Matches the ids already used in code (`src/lib/products.ts` `ProductId`,
  `COLLECTION_ORDER`) wherever one exists — don't invent a second name for the same thing.
- **`variant`** — kebab-case, controlled per category (see table below). Use `default`
  if there's genuinely only one look.
- **`seq`** — 2-digit zero-padded (`01`, `02`, …). **Omit** it entirely when there's only
  one file for that `category__slug__variant` combination; add it the moment a second
  one shows up. (Mirrors the zero-padded, fixed-width numbering already used for Ad Index
  codes system-wide — see `rmg-piaar-system/CLAUDE.md`.)
- **`ext`** — `webp` for photography (preferred over `png`/`jpg` for size), `svg` for
  vector, `png` when transparency is required, `mp4`/`webm` for video.
- Fields are joined with a **double underscore** (`__`) — slugs may contain single
  hyphens, so `__` stays unambiguous to split on.

Variant vocab by category (extend the list here before inventing a new word):

| Category | Variants in use |
|---|---|
| `hero` | `day`, `night` |
| `room` | `day`, `night` |
| `product` | `hero`, `detail`, `lifestyle` |
| `promo` | `banner`, `social`, `concept` |
| `video` | `poster`, `film` |
| `mark` | `seal`, `splash`, `stamp`, `loading` |
| `character` | `stance`, `add-to-cart`, `cart-checkout`, `quiz-welcome`, `concierge` |

**`mark` — brand seals** (new): recurring brand-identity visuals — a phrase, stamp, or
seal meant to represent HVN generally and close out promotions, distinct from `promo`
(one-off campaign creative) and the fixed `00_BRAND/` slot files (favicon/logo/og-image).
Lives in `00_BRAND/MARKS/`. The `slug` is drawn from the phrase/concept itself (e.g. the
line "Atmospheric Jurisdiction" → `atmospheric-jurisdiction`), not a generic "brand" or
"hvn" slug — each distinct phrase gets its own slug so the collection can grow. Variant
describes how it's used:

- `seal` — a badge/stamp-style close (the default treatment)
- `splash` — a full-bleed screen treatment
- `stamp` — a small inline mark

**`character` — cast photography** (new): named persona/cast members who appear across
HVN products (site, quizzes, future surfaces), distinct from one-off `promo` concept art.
Lives in `01_HERO/CHARACTERS/<CHARACTER-NAME>/`. The `slug` is the character's name (e.g.
`vale`), so a given character's whole photo set stays together regardless of which
product ends up using a given pose. Variant names the concrete usage moment, not an
abstract pose — this reads more clearly than a generic pose taxonomy once a character is
tied to specific product touchpoints:

- `stance` — full-body, neutral/authoritative (e.g. arms folded) — used as a persistent
  companion image (e.g. pinned during a quiz flow)
- `add-to-cart` — confirms an item was added
- `cart-checkout` — guides toward checkout
- `quiz-welcome` — introduces a quiz/training flow
- `concierge` — full-height greeting pose; flies in from the left of the screen when a
  visitor picks "Speak to Concierge" and lands in the showroom (S3)

Add new variants the same way as new poses come in — name them for the moment they
serve, not a generic pose label.

**Cast:**

| Character | Role |
|---|---|
| Vale | HVN Havenry's concierge — assists patrons while shopping, confirms cart adds; also hosts/congratulates on the Lexicon Training quiz (Cappo Meridian) |

**Examples:**

```
hero__great-room__day.png
hero__great-room__night.png
room__hvn-chamber__night.png
product__shadow-chamber__hero.webp
product__shadow-chamber__detail__01.webp
product__shadow-chamber__detail__02.webp
promo__summer-launch-2026__banner__01.webp
video__shadow-chamber__poster.webp
video__shadow-chamber__film.mp4
mark__atmospheric-jurisdiction__seal.png
character__vale__stance.png
character__vale__add-to-cart.png
```

## `assets.manifest.json`

Maps every asset the site actually pulls to its Drive file id and its destination under
`public/`. This file is the explicit, reviewable contract between "what's in Drive" and
"what the site serves" — the pull script does no folder-scanning magic at pull time, it
just resolves each manifest entry.

```json
{
  "assets": [
    {
      "driveFileId": "1wz-lDYv9U8qhqa8Pb-3l9ya8_75Nw8Kv",
      "name": "hero__great-room__day.png",
      "destPath": "assets/hero/hero__great-room__day.png"
    }
  ]
}
```

To add an asset: drop the correctly-named file in the right Drive folder, copy its file
id (right-click → "Copy link", the id is the segment between `/d/` and `/view`), add an
entry to `assets.manifest.json`. Run `npm run assets:pull` to verify it resolves.

## Pulling assets

```bash
npm run assets:pull
```

Reads `assets.manifest.json`, downloads each file from Drive, and writes it to
`public/<destPath>`. **Silently no-ops (exit 0) if no Drive credentials are set** — safe
for local dev machines and any CI job that doesn't need fresh assets.

Pulled files are gitignored (see `.gitignore`) — `public/` on disk is a build artifact,
not a source file, for anything under `public/assets/` or in the brand-slot list above.
Never hand-commit a binary into one of those paths; add it to Drive and the manifest
instead.

**Exception, temporary:** the `character__vale__*.png` files under
`public/assets/characters/vale/` are hand-committed as a deliberate one-time bridge —
`GDRIVE_ASSETS_CREDENTIALS` doesn't exist yet, so the automated pull can't run, and these
were needed live before that setup work was done. They're explicitly un-ignored in
`.gitignore`. Once the service account exists, remove them from git and let
`npm run assets:pull` own them like everything else — they're already in
`assets.manifest.json` pointing at the same Drive files, so the pull will overwrite them
with identical content.

### Credentials — two options (checked in this order)

1. **OAuth — reuse existing creds, no GCP setup (recommended).** Set `GDRIVE_CLIENT_ID`,
   `GDRIVE_CLIENT_SECRET`, and `GDRIVE_REFRESH_TOKEN` — the **same** Google OAuth values
   ALLEN / MyTubeScript / creator-os already use (they live in the `allen-i-verse` Doppler
   project, `prd` config). Copy those three into this project's environment. The only
   requirement is that that OAuth identity (rahm@rmasters.group) has read access to
   `HVN_HAVENRY_SITE` — which it does, since the folder lives in that workspace.
2. **Service account — dedicated read-only identity (optional).** Set
   `GDRIVE_ASSETS_CREDENTIALS` to a service-account JSON key. Cleaner separation, but needs
   the one-time GCP setup below:
   1. Create a service account in the relevant GCP project, generate a JSON key.
   2. Share the `HVN_HAVENRY_SITE` Drive folder with the service account's `client_email`
      as **Viewer**.
   3. Store the JSON key contents as the `GDRIVE_ASSETS_CREDENTIALS` secret.

Until one of these is set, `npm run assets:pull` is a documented no-op — the manifest and
script are ready, but nothing will actually download.

### Wiring into deploy (done — hands-free)

The pull runs automatically at **container start**, before the Next.js server boots
(`scripts/start.sh`, wired as the image `CMD` in the `Dockerfile`). It reads the runtime
environment — the same Doppler-injected `env_file: .env.local` docker-compose already
loads — so on every deploy/restart the container fetches fresh Drive assets into `public/`
with no manual step. It **no-ops safely** when no `GDRIVE_*` creds are present (local dev,
PR/CI, or any environment without them), so it can never block a build or boot.

The OAuth path is dependency-free (built-in `fetch`), so it runs in the slim standalone
runtime image without bundling `googleapis`. To activate live asset pulling, just ensure
`GDRIVE_CLIENT_ID` / `GDRIVE_CLIENT_SECRET` / `GDRIVE_REFRESH_TOKEN` are in the deploy
environment (Doppler) — nothing else to change.

### Automatic WebP optimization (fallback)

After pulling, `scripts/pull-assets.mjs` best-effort transcodes each pulled PNG/JPG to a
`.webp` sibling (via `sharp`, installed in the runtime image). CSS backgrounds reference the
image via `image-set()` (`.bg-asset-*` classes in `globals.css`) which prefers the WebP and
falls back to the original PNG — so the site works whether or not the WebP was generated.
This means an unoptimized image dropped in Drive is still served small automatically. If you
provide already-optimized files under the same names, that's the primary path and the WebP
step just mirrors them. `sharp` install and each encode are best-effort: any failure is
skipped and the original is served.

## Video optimization (once, in CI — not per boot)

Videos are heavy, so — unlike images — they are **not** transcoded at container start
(that would add minutes to every deploy). Instead they're optimized **once in Drive** by a
manually-run GitHub Action, **Optimize videos**
(`.github/workflows/optimize-videos.yml` → `scripts/optimize-videos.mjs`, also
`npm run videos:optimize`):

1. Downloads each `.mp4` master listed in `assets.manifest.json` from Drive.
2. Re-encodes to web-optimized H.264 — width capped at `MAX_WIDTH` (default 1920, never
   upscales), `CRF` (default 24), AAC audio, and **`+faststart`** so playback can begin
   before the file fully downloads.
3. Uploads the smaller file back to the **same Drive file id** (in place), so
   `assets.manifest.json` needs no change and Drive's **revision history keeps the original
   master**. A file is only replaced when the re-encode is ≥5% smaller (`MIN_SAVING`).

Run it from the Actions tab (**Optimize videos** → *Run workflow*) after dropping a new or
updated video in Drive; tick **dry_run** first to see the size savings without writing. The
deploy-time `assets:pull` then fetches the already-small files with **zero per-boot encoding
cost**.

> **Scope note:** writing back needs the OAuth token to carry a **writable** Drive scope
> (`drive` or `drive.file`) — the same `GDRIVE_CLIENT_ID` / `GDRIVE_CLIENT_SECRET` /
> `GDRIVE_REFRESH_TOKEN` used for pulling. A read-only token 403s on upload; the script
> reports this clearly and leaves the master untouched (re-consent with a writable scope to
> enable in-place replacement).
