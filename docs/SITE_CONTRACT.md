# HVN Havenry — Site Contract

> **Governed document.** This is the canonical spec for the HVN Havenry marketing site's
> **sections, navigation, actions, positions, and theme**. Copy updates and scaled
> enhancements must preserve the contracts below. Cross-project governance lives in
> [`rmg-piaar-system`](https://github.com/RMoor-Industries-Ltd-Co/rmg-piaar-system); that
> repo will point here as the site-level authority for HVN Havenry.
>
> Companion docs: [`ASSETS.md`](../ASSETS.md) (asset pipeline & naming),
> [`AGENTS.md`](../AGENTS.md) (repo conventions).

## 1. Page model

A single long-scroll page (`src/app/page.tsx`) composed of five sections separated by a
`GoldenDivider` on every boundary. Smooth scroll is **Lenis**; pin/reveal animation is
**GSAP ScrollTrigger**. Every section carries a stable **anchor id** — these ids are the
public contract for navigation and must not change without updating every reference.

| # | Section | Component | Anchor id | Nav state (`activeNavSection`) |
|---|---|---|---|---|
| S1 | Hero | `HeroBackground` + `HeroOverlay` | `top` | 0 |
| S2 | Manifesto (scroll-story) | `ScrollStory` (pinned) | `story` | 1 |
| S3 | Showroom (room tabs) | `RoomTabs` (`id="the-room"`, wrapped in `id="concierge"`) | `concierge` / `the-room` | 2 |
| S4 | Video / promo player | `VideoRevealSection` | `film-section` | 3 |
| — | Footer | inline in `page.tsx` | — | (stays 3) |

`GoldenDivider` (`src/components/ui/GoldenDivider.tsx`) is the only section separator — a
fading gold line with a center diamond. Use it for any new boundary.

## 2. Navigation contract (`src/components/ui/NavBar.tsx`)

One **fixed** top bar, always pinned. It has three fixed slots — **logo (left)**,
**center row**, **right CTA** — and the center row + CTA **swap by `activeNavSection`**.
Rows crossfade in place (page-centered via `absolute left-1/2 -translate-x-1/2`).

| Section | Logo (left) | Center | Right CTA |
|---|---|---|---|
| S1 (0) | HVN → `top` | Slogan: **"Not a store, a Havenry"** (gold shimmer) | **Speak to Concierge** → `concierge` |
| S2 (1) | **hidden** | Back to Home → `top` · Speak to Concierge → `concierge` | **hidden** |
| S3 (2) | HVN → `top` | **The Collection** + functional links (Atmos Ritual / HVN Chamber / HVN Living / Standard Line) | **View Cart** → cart |
| S4 (3) | HVN → `top` | **← Return to Showroom** → `the-room` (only) | **View Cart** → cart |

Rules:
- The logo + right CTA are hidden **only** in S2 (`flanksHidden = activeNavSection === 1`).
- **View Cart** shows in S3 and S4 (`activeNavSection >= 2`); Speak to Concierge otherwise.
- S3 collection links are **functional**: they call `setActiveCollection(collection)` and
  `scrollToSection("the-room")`. They are the single source of collection nav (RoomTabs has
  **no** duplicate header — do not reintroduce one).
- Section tracking: `NAV_BOUNDARIES` in `page.tsx` (ScrollTrigger `start: "top 60%"`,
  `onEnter`→enter, `onLeaveBack`→previous). Adding a section = add its id + boundary here.

## 3. Action contract

All in-page navigation goes through the shared `scrollToSection(id)` (Lenis `scrollTo`,
**`offset: -80`** to clear the fixed nav, `duration: 2.0`). Never hard-jump or use a
different offset — the `-80` is the agreed resting position and the snap depends on it.

| Trigger | Action |
|---|---|
| HVN logo | `scrollToSection("top")` |
| Speak to Concierge (S1/S2) | `scrollToSection("concierge")` |
| Collection link (S3) | `setActiveCollection(c)` + `scrollToSection("the-room")` |
| View Cart (S3/S4) | link to `CART_URL` (`https://hvnhavenry.com/cart`) |
| Room hotspot (orb) | `setActiveTabItem(productId)` → opens `ProductInfoPanel` |
| **Acquire This Piece** | `BuyButton` → `product.shopifyUrl` (+ Vale add-to-cart moment) |
| **Watch the Film** | `openVideo(id)` + close card + `scrollToSection("film-section")` |
| Return to Showroom (S4) | `resetVideo()` + `scrollToSection("the-room")` |

**Product card (`ProductInfoPanel`)**: slides in from the right; scrollable body with
top padding (`pt-28`) so details clear the fixed nav; **Close** lives in a persistent
bottom-left strip (never top-right — it must not collide with View Cart). Only products
with `hasVideo` show **Watch the Film**.

## 4. Snap & scroll contract (`page.tsx`)

CSS scroll-snap does **not** work under Lenis — do not use it. Snapping is a custom
scroll-settle handler that, 140 ms after scrolling stops, snaps to the nearest of
`the-room` / `film-section`. Both the snap and the button-driven scrolls resolve their
resting position through the **same `targetYFor(el)` helper**, so they always land on the
identical spot:

- `the-room` (S3) **top-aligns** under the fixed nav (`-80` offset).
- `film-section` (S4) is **centered** in the viewport (its id is in `CENTERED_IDS`) —
  because its content is a single vertically-centered card, top-aligning would push the
  card down and clip it. Centering rests it with the nav above and symmetric margins.

Guards: it never fires during a `snapping` glide or a `programmaticScroll` (button-driven)
scroll — this is what keeps "Watch the Film" and other buttons landing on-position. Only
S3/S4 snap; the hero and pinned story scroll freely. To make a new centered section, add
its id to `CENTERED_IDS`; otherwise it top-aligns with the `-80` offset.

## 5. Video (S4) contract (`VideoRevealSection`)

Always-present promo player. Default = a **two-part promo playlist**
(`video__promo__default__01` then `__02`): part 1 plays **once**, then on `ended` the player
advances to part 2, which **loops** forever (`loop` is set only on the last clip). Both are
lazy-loaded (`preload="none"`) and played only when in view via IntersectionObserver; adding
a third clip is just another `PROMO_SRCS` entry (the last one always loops). A product's
**Watch the Film** sets `activeVideoProduct` to swap in that film. **No ✕/close control on
the player** — the only exit is the nav's **Return to Showroom** (it reads as "leave the
video", not "dismiss it"). Return resets to the promo.

## 6. Theme contract

Defined in `src/app/globals.css` (`@theme inline`) + `layout.tsx` fonts. Use these tokens,
never new ad-hoc colors:

- **Gold** `#c9a96e` (primary accent) · **Cream** `#e8dcc8` (body text) ·
  **Dark** `#0d0b09` (background) · Mahogany `#2a1810` · Velvet `#1a1035`.
- **Fonts**: Cormorant Garamond (`font-display` / serif, italic display) · Inter
  (`font-sans`, labels/body). Uppercase + wide `tracking` for labels/nav.
- Motion: gold-shimmer sweep is **8s** (calm); hotspots pulse; keep transitions subtle.

## 7. Assets contract

All imagery/video is pulled from Google Drive by `scripts/pull-assets.mjs` per
`assets.manifest.json`; naming + folders are governed by [`ASSETS.md`](../ASSETS.md). CSS
backgrounds use the `.bg-asset-*` classes with **`image-set()` (WebP preferred, PNG
fallback)** — the pull step auto-generates WebP. To change an image: replace it in Drive
under the **same manifest name**; no code change needed.

## 8. Change guidance (keep the contract intact)

- **Copy-only updates** (slogan, manifesto beats, product text, labels): edit the string in
  place; do **not** move it out of its section, change anchor ids, or alter the nav
  state/CTA mapping in §2–§3.
- **Add a product**: add to `src/lib/products.ts` (with `tabHotspot`, `shopifyUrl`,
  optional `hasVideo`/`videoLabel`); it appears as a hotspot in its `collection`. Drop its
  imagery in Drive + manifest.
- **Add a collection**: extend `COLLECTION_ORDER`; the S3 nav + room tabs pick it up
  automatically. Keep the label consistent with `products.ts`.
- **Add a section**: give it a stable anchor id, add a `NAV_BOUNDARIES` entry + a NavBar
  center row, wrap it with `GoldenDivider`s, and (if it's a shopping/return target) add it
  to the snap `SNAP_IDS`. Reuse `scrollToSection` with the `-80` offset.
- **Invariants** (must not break): the `-80` scroll offset; stable anchor ids; one fixed
  nav that swaps by section; Close bottom-left; return via nav not ✕; gold/cream/dark theme
  tokens; assets via the Drive manifest.

_Revision: this document is the source of truth for the above. Update it in the same PR as
any change to sections, nav, actions, or theme._
