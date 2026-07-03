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
│   └── CHARACTERS/      Persona hero art, one subfolder per character (ADAM, EVE, …)
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
nothing under them should ever reach `public/`. `01_HERO/CHARACTERS` and `02_STORY/WORDING`
are in-progress additions — their own naming convention isn't formalized yet.

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
  `product`, `promo`, `reference`, `mark`. (Matches the top-level Drive folder it lives
  in.)
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
| `mark` | `seal`, `splash`, `stamp` |

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

Reads `assets.manifest.json`, downloads each file from Drive via a service account, and
writes it to `public/<destPath>`. **Silently no-ops (exit 0) if `GDRIVE_ASSETS_CREDENTIALS`
isn't set** — safe for local dev machines and any CI job that doesn't need fresh assets.

Pulled files are gitignored (see `.gitignore`) — `public/` on disk is a build artifact,
not a source file, for anything under `public/assets/` or in the brand-slot list above.
Never hand-commit a binary into one of those paths; add it to Drive and the manifest
instead.

### One-time setup required (not yet done)

The pull script needs a **Google Cloud service account** with read access to the
`HVN_HAVENRY_SITE` Drive folder:

1. Create a service account in the relevant GCP project, generate a JSON key.
2. Share the `HVN_HAVENRY_SITE` Drive folder with the service account's `client_email`
   as **Viewer**.
3. Store the JSON key contents as the `GDRIVE_ASSETS_CREDENTIALS` secret (Doppler for
   local/manual runs; a GitHub Actions secret if/when this gets wired into CI).

Until that secret exists, `npm run assets:pull` is a documented no-op — the manifest and
script are ready, but nothing will actually download.

### Wiring into CI/deploy (not yet done)

`npm run assets:pull` is **not** currently invoked automatically by `npm run build`, the
`Dockerfile`, or `.github/workflows/deploy.yml` — wiring it in is a deliberate follow-up
step, not done here, so that adding this pipeline can't silently break builds for anyone
who doesn't yet have `GDRIVE_ASSETS_CREDENTIALS` configured. Once the service account
above exists, add a step before the Docker build (or a Dockerfile build stage) that runs
`npm run assets:pull` with the secret injected.
