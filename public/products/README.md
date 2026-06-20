# Product images

Drop product photos here. Each file is referenced from `src/lib/products.ts`
via the `image` field, using the product **id** as the filename:

| Product id       | Expected file                      |
| ---------------- | ---------------------------------- |
| `flask`          | `public/products/flask.webp`          |
| `combRail`       | `public/products/combRail.webp`       |
| `bolster`        | `public/products/bolster.webp`        |
| `emberLine`      | `public/products/emberLine.webp`      |
| `shadowChamber`  | `public/products/shadowChamber.webp`  |
| `columnChamber`  | `public/products/columnChamber.webp`  |
| `atmosphereMist` | `public/products/atmosphereMist.webp` |

Until a file exists, the product detail shows a tasteful "HVN — image coming
soon" placeholder instead of a broken image, so partial sets are safe to ship.

**Format:** `.webp` preferred (smaller). If you must use another extension,
update the matching `image` path in `src/lib/products.ts`.
Images render with `object-contain`, so transparent or dark backgrounds that
match the site (`#0d0b09`) look best.
