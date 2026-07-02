export type ProductId = "flask" | "combRail" | "bolster" | "emberLine" | "shadowChamber" | "columnChamber" | "atmosphereMist";

export interface Product {
  id: ProductId;
  name: string;
  collection: string;
  tagline: string;
  description: string;
  details: string[];
  price: string;
  shopifyUrl: string;
  accentColor: string;
  roomPosition: string;
  /** Position (percent, 0-100) of this item's hotspot within its collection's room tab */
  tabHotspot: { x: number; y: number };
  /** Whether this item has an accompanying film that opens in the video section */
  hasVideo?: boolean;
  videoLabel?: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  flask: {
    id: "flask",
    name: "Framing Mist Flask Sprayer",
    collection: "ATMOS RITUAL",
    tagline: "Atmosphere in your hand.",
    description:
      "The Flask Sprayer delivers fragrance with control and presence. Inspired by vintage apothecary flasks and old-world rituals, it is designed to be carried, refilled, and used with intention. Every detail is functional. Every detail is timeless.",
    details: [
      "Fine mist atomizer — smooth, even coverage",
      "Screw-top fill port for easy refills",
      "Weighted stainless steel, textured antique finish",
      "Secured cap — no loss, no leaks",
      "Available in Obsidian, Iron Frost, Antique Bronze",
    ],
    price: "$65",
    shopifyUrl: "https://hvnhavenry.com/products/framing-mist-flask-sprayer",
    accentColor: "#1a1510",
    roomPosition: "The side table",
    tabHotspot: { x: 72, y: 58 },
  },
  combRail: {
    id: "combRail",
    name: "Comb Rail Diffuser",
    collection: "ATMOS RITUAL",
    tagline: "Rhythm and structure. Scent in form.",
    description:
      "Parallel grooves run across the opening, creating rhythm and structure as fragrance diffuses through each blade. The Comb Rail sits as sculpture and function — a centrepiece that works quietly, continuously.",
    details: [
      "Parallel groove rail design for even diffusion",
      "Dark glass vessel, weighted base",
      "HVN-embossed brass rail fitting",
      "Available in Antique Brass, Black Iron, Dark Bronze, Brushed Steel",
      "Pairs with HVN Atmos Ritual fragrance oils",
    ],
    price: "From $85",
    shopifyUrl: "https://hvnhavenry.com/products/comb-rail-diffuser",
    accentColor: "#0f1215",
    roomPosition: "The coffee table",
    tabHotspot: { x: 34, y: 62 },
  },
  bolster: {
    id: "bolster",
    name: "Repose Cushion — Bolster",
    collection: "HVN LIVING",
    tagline: "Designed for repose. Crafted for life.",
    description:
      "A cylindrical bolster in dark linen with a concealed internal sleeve — a discreet pocket for a note, a memento, or a scent sachet. The HVN monogram is pressed into a brass plate at the end cap. Built to be placed. Built to be kept.",
    details: [
      "Premium dark charcoal linen exterior",
      "Concealed zipper with internal note sleeve",
      "Replaceable scent insert included",
      "HVN brass end-cap monogram",
      "Dry clean only",
    ],
    price: "From $120",
    shopifyUrl: "https://hvnhavenry.com/products/repose-cushion-bolster",
    accentColor: "#111214",
    roomPosition: "The sofa",
    tabHotspot: { x: 50, y: 60 },
  },
  emberLine: {
    id: "emberLine",
    name: "Ember Line — Fine Incense",
    collection: "STANDARD LINE",
    tagline: "One stick. One moment. Pure intention.",
    description:
      "The essential HVN experience. The Ember Line is slow-burn fine incense for atmosphere — low smoke, pure diffusion. Each stick carries the signature HVN blend: clean, even, consistent. Ritual in its purest form.",
    details: [
      "Signature HVN incense blend — no fillers",
      "Slow burn design — crafted for time, not volume",
      "Low smoke, clean atmosphere",
      "Natural core, matte incense coating",
      "12 sticks per box",
    ],
    price: "$38",
    shopifyUrl: "https://hvnhavenry.com/products/ember-line-incense",
    accentColor: "#0d0a07",
    roomPosition: "The shelving wall",
    tabHotspot: { x: 50, y: 55 },
  },
  shadowChamber: {
    id: "shadowChamber",
    name: "Shadow Chamber",
    collection: "HVN CHAMBER",
    tagline: "Light held. Shadow cast.",
    description:
      "The Shadow Chamber is HVN's statement candle. Deep channels cut through the volcanic composite exterior project shifting shadow patterns as the flame burns within. A sculptural object first — a candle second. It transforms any room at dusk.",
    details: [
      "Cut-channel architectural form",
      "Single-wick slow burn design",
      "HVN signature wax blend — low soot, clean throw",
      "Volcanic stone powder composite vessel",
      "60-hour burn time",
    ],
    price: "From $95",
    shopifyUrl: "https://hvnhavenry.com/products/shadow-chamber",
    accentColor: "#0f0d0b",
    roomPosition: "The coffee table",
    tabHotspot: { x: 36, y: 62 },
    hasVideo: true,
    videoLabel: "Light Held, Shadow Cast — The Film",
  },
  columnChamber: {
    id: "columnChamber",
    name: "Column Chamber",
    collection: "HVN CHAMBER",
    tagline: "Form before flame.",
    description:
      "Tall and commanding, the Column Chamber rises from the shelf as sculpture. Its smooth cylindrical form catches the room light before the wick is ever touched. When lit, the warm glow transforms the column from object to atmosphere.",
    details: [
      "Tall column form — 28cm height",
      "Matte exterior, smooth volcanic composite",
      "HVN fragrance-infused wax — two signature blends",
      "Brass base plate with HVN monogram",
      "80-hour burn time",
    ],
    price: "From $110",
    shopifyUrl: "https://hvnhavenry.com/products/column-chamber",
    accentColor: "#0d0a08",
    roomPosition: "The shelving wall",
    tabHotspot: { x: 66, y: 46 },
    hasVideo: true,
    videoLabel: "Form Before Flame — The Film",
  },
  atmosphereMist: {
    id: "atmosphereMist",
    name: "Atmosphere Mist",
    collection: "ATMOS RITUAL",
    tagline: "Room. Transformed.",
    description:
      "The Atmosphere Mist is HVN's large-format room spray — engineered for whole-room coverage and long-lingering presence. A single application settles softly across fabric, air, and surface to reshape the feel of any space.",
    details: [
      "250ml large-format bottle",
      "Fine atomiser spray head",
      "HVN Atmos Ritual signature blend",
      "Matte black glass vessel, brass-collared pump",
      "Long-hold formulation — 4–6 hour presence",
    ],
    price: "$78",
    shopifyUrl: "https://hvnhavenry.com/products/atmosphere-mist",
    accentColor: "#0a0d10",
    roomPosition: "The side table",
    tabHotspot: { x: 22, y: 48 },
  },
};

export const PRODUCT_ORDER: ProductId[] = [
  "combRail",
  "shadowChamber",
  "columnChamber",
  "atmosphereMist",
  "flask",
  "bolster",
  "emberLine",
];

/** Ordered list of collection tabs for the interactive room section */
export const COLLECTION_ORDER: string[] = [
  "ATMOS RITUAL",
  "HVN CHAMBER",
  "HVN LIVING",
  "STANDARD LINE",
];

export function getProductsByCollection(collection: string): Product[] {
  return PRODUCT_ORDER.map((id) => PRODUCTS[id]).filter(
    (p) => p.collection === collection
  );
}
