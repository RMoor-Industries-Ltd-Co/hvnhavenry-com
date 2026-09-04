# Showroom / "The Impressions" — Architecture & Work Order

Founder direction (2026-09-03). This document records a coherent architecture decision
for S1 (nav/Vale) and S3 (product showroom) as one tranche, not a collection of
unrelated fixes — the interaction model and the asset taxonomy are being decided
together because the asset-generation workload only makes sense once the interaction
model is proven.

**Nothing in this document is built yet.** It is the plan, and the ordered work order
CC follows to build it — see "Work order" below. No code changes ship in the same PR
as this document.

## 1. Current state (as inspected 2026-09-03)

The Showroom Drive folder currently contains: several loose generated images with
generic Codex filenames, two older parent-state images (`HVN Daytime.png`,
`HVN Nighttime.png`), and existing folders `standard-line`, `hvn-living`,
`hvn-chamber`, `atmos-ritual`. This confirms the need for a showroom-specific asset
taxonomy before S3 grows further — see §6.

## 2. Organizing concept: "Impressions"

**"Impressions" is the new organizing concept for how customers experience HVN
products in context.** Product categories remain products (Atmos Chambers, Ember
Lines, Stem Sets, Ritual Instruments, Lucerns); **impressions** describe the
time + room + atmosphere in which those products live. This is the conceptual spine
for S3's rename and data model below.

## 3. S1 — navigation rails and Vale

### 3.1 Two navigation classes

- **Left rail** (under the HVN mark) — **product discovery**: Atmos Chambers, Ember
  Lines, Stem Sets, Appointment Offerings, Ritual Instruments, Lucerns.
- **Right rail** (beneath View Showroom) — **customer/service navigation**: View
  Showroom, Previous Order, Concierge.

**Concierge** calls the same Vale fly-in state (no separate navigation). **Previous
Order** is a direct account/order-history action — **not** mediated through Vale,
unless a future decision explicitly wants Vale to mediate it.

### 3.2 Vale panel — companion layout, not an overlay bubble

Vale's dialogue becomes a **two-column companion panel**, not a speech bubble sitting
on top of the character: Vale occupies one visual column, dialogue/actions occupy an
adjacent column with enough separation that his body stays legible. On narrower
screens, the dialogue column collapses above/below Vale rather than overlapping him.

### 3.3 Fly-in drawer scroll bug — functional regression, highest priority

**Currently blocks purchase behavior — fix and test before any interactive S3
hotspot work.** The drawer needs its own scroll context:

- The panel body independently supports vertical scrolling.
- Header/close control (and likely the bottom CTA) stay sticky.
- Hovering the panel must not lock wheel/touchpad events to the underlying page.
- "Acquire This" stays reachable even with tall product content.
- Test matrix: mouse wheel, trackpad, keyboard, touch, mobile.

## 4. S3 — "The Impressions" (renamed from "The Collections")

### 4.1 Room taxonomy

Five time-of-day parents, same room set under each:

- **Daytime** / **Mid-Day** / **Afternoon** / **Evening** / **Night**
  - Bathroom
  - Kitchen
  - Lounge
  - Office
  - Outdoor *(internal slug `yard` — see §4.3 on customer-facing naming)*
  - Library / Study

Eventually: **Balcony / Terrace** as its own room/environment option — do not force
those scenes under Outdoor/Yard; the founder specifically wants them distinct.

### 4.2 Navigation behavior

- **Desktop:** parent time-of-day labels expand on hover; a click can lock the
  submenu open.
- **Mobile/tablet:** tap opens the submenu (hover-only fails on touchscreens and is
  weaker for accessibility) — click/tap must work everywhere, hover is a desktop
  enhancement only, never the only path.

### 4.3 Customer-facing naming

"Yard" is understandable internally but reads residential/utilitarian next to Lounge
and Library/Study. Keep `yard` as the **internal slug** if useful, but present
**Outdoor** (or Patio/Grounds, scene-dependent) to the customer.

### 4.4 Manifest-driven data model

Do not load ~30 giant room images directly into the page. Each impression is a data
record:

```
timeOfDay → room → backgroundAsset → hotspots[] → productIds[]
```

This lets room images or product placement change without rewriting the page
component. See §7 for the fuller manifest schema (asset-tracking layer) this powers.

### 4.5 Product hotspots — three interaction states

- **Resting** — product visually integrated into the room, no obvious ecommerce UI.
- **Hover/focus** — subtle silhouette/edge illumination, slight elevation/scale,
  optionally a restrained atmospheric halo. Enough to reveal interactivity without
  making the room read as an AR demo.
- **Selected** — fly-in opens with product info + "Acquire This"; the room stays
  visible behind it so the user keeps spatial context.

**Hotspot geometry is explicit, not pixel-detection-based** — normalized coordinates
positioned over the image, so hit targets stay responsive across sizes.

## 5. Showroom Drive structure

A new dedicated `impressions` hierarchy, not a repurposing of the existing
`hvn-living` / `hvn-chamber` / `atmos-ritual` / `standard-line` folders — those may
represent an earlier product organization and stay intact until it's known whether
anything still depends on them.

```
Showroom/
├── impressions/
│   ├── daytime/
│   │   ├── bathroom/
│   │   ├── kitchen/
│   │   ├── lounge/
│   │   ├── office/
│   │   ├── yard/
│   │   └── library-study/
│   ├── mid-day/
│   │   ├── bathroom/
│   │   ├── kitchen/
│   │   ├── lounge/
│   │   ├── office/
│   │   ├── yard/
│   │   └── library-study/
│   ├── afternoon/
│   ├── evening/
│   └── night/
├── products/
│   ├── atmos-chambers/
│   ├── ember-lines/
│   ├── stem-sets/
│   ├── ritual-instruments/
│   ├── lucerns/
│   └── future/
│       └── floor-sculptures/
├── staging/
│   ├── generated/
│   ├── approved/
│   └── rejected/
└── archive/
```

`Appointment Offerings` is **not** an asset folder — it's a service/navigation
concept (§3.1), not a visual product family.

## 6. Filenames

### 6.1 Impression (background) assets

```
hvn-impression-{time}-{room}-{location}-{angle}-{variant}-{nn}.png
```

Examples:

```
hvn-impression-daytime-kitchen-marrakech-counter-v01-01.png
hvn-impression-evening-library-london-low-angle-v01-01.png
hvn-impression-night-lounge-atlanta-corner-v02-01.png
hvn-impression-afternoon-balcony-cape-town-outward-v01-01.png
```

### 6.2 Product-layer assets

```
hvn-product-{family}-{product}-{view}-{variant}.png
```

Examples:

```
hvn-product-atmos-chamber-naked-front-v01.png
hvn-product-stem-set-standard-three-quarter-v02.png
hvn-product-prime-anchor-front-v01.png
hvn-product-lucern-adam-three-quarter-v01.png
```

### 6.3 Composite vs. clean backgrounds

If a background already has products composited into it:

```
hvn-impression-evening-library-paris-corner-composite-v01.png
```

If deliberately product-free (useful once products are layered as independently
clickable renders over room photography):

```
hvn-impression-evening-library-paris-corner-clean-v01.png
```

## 7. Asset manifest (repo-tracked, not filenames-only)

Filenames alone shouldn't carry all the intelligence. A per-asset record:

```
impressionId
timeOfDay
room
location
cameraAngle
backgroundAsset
backgroundType: clean | composite
products[]
status: placeholder | candidate | approved | production
driveFileId
notes
```

Becomes essential once there are 30+ rooms with multiple product placements each —
this is the data model §4.4's `timeOfDay → room → backgroundAsset → hotspots[] →
productIds[]` reads from at runtime.

## 8. Work order

Ordered by the founder's own priority — bug fixes first (functional regression
blocking purchase), then structure, then a single proof-of-concept room before any
mass image generation:

1. Repair Vale dialogue placement (§3.2).
2. Repair fly-in scrolling and CTA reachability (§3.3), tested across mouse wheel,
   trackpad, keyboard, touch, and mobile.
3. Add S1 left/right navigation rails; wire Concierge → Vale (§3.1).
4. Rename S3 "The Collections" → "The Impressions"; implement the
   expandable time-of-day → room navigation model (§4.1–§4.3).
5. Establish the manifest/hotspot data model (§4.4, §7) — without yet attempting
   every room.
6. Reorganize/rename the Showroom Drive assets (§5) and import a small approved
   placeholder set.
7. Build **one** end-to-end S3 impression prototype — **Evening → Library/Study** —
   with a background and 2–3 interactive products (Atmos Chambers, Ember Lines,
   Stem Sets, or a Lucern all fit naturally here; the evening darkness also lets the
   hotspot glow be tested without it becoming a gimmick).
8. Validate the full hover/focus/glow → select → fly-in → Acquire This experience
   before mass-producing images.

**Do not generate 30 room environments before step 8 is validated.** Prove one room
end-to-end first — once the interaction actually feels luxurious and usable, the
image-generation workload becomes justified instead of building a large asset library
for an interaction model that might still change.

## 9. Explicit non-goals right now

- Do not attempt all 8 work-order steps in one PR — each is its own reviewable change.
- Do not generate room imagery before step 8's prototype is validated.
- Do not repurpose or delete the existing `hvn-living` / `hvn-chamber` /
  `atmos-ritual` / `standard-line` Drive folders — leave them intact pending a
  separate decision on whether anything still depends on them.
- Do not route "Previous Order" through Vale unless explicitly decided otherwise.
- Do not ship the Vale panel redesign or the scroll-bug fix without testing the full
  input matrix in §3.3.
