export type ProductId = "sofa" | "desk" | "bar" | "library";

export interface Product {
  id: ProductId;
  name: string;
  tagline: string;
  description: string;
  details: string[];
  price: string;
  shopifyUrl: string;
  accentColor: string;
  roomPosition: string;
}

export const PRODUCTS: Record<ProductId, Product> = {
  sofa: {
    id: "sofa",
    name: "The Meridian Chaise",
    tagline: "Where refinement meets repose",
    description:
      "Hand-tufted in Italian velvet with solid brass legs, the Meridian Chaise transforms any corner into a sanctuary of elegance. Each piece is individually numbered and signed by our master upholsterers.",
    details: [
      "Italian Loro Piana velvet — 12 colorways",
      "Solid brass hardware, hand-polished",
      "8-way hand-tied spring suspension",
      "Down-wrapped high-resiliency foam",
      "Lead time: 12–16 weeks",
    ],
    price: "From $8,400",
    shopifyUrl: "https://hvnhavenry.myshopify.com/products/meridian-chaise",
    accentColor: "#4a2d6e",
    roomPosition: "Center of the great room",
  },
  desk: {
    id: "desk",
    name: "The Obsidian Bureau",
    tagline: "Command your domain",
    description:
      "Sculpted from book-matched figured walnut with hand-stitched full-grain leather inlay, the Obsidian Bureau is the centrepiece of the executive suite. Six drawers, all fitted in cedar.",
    details: [
      "Book-matched figured black walnut",
      "Full-grain leather writing surface",
      "Six cedar-lined drawers with push-open hardware",
      "Integrated cable management, brass-finished",
      "Lead time: 10–14 weeks",
    ],
    price: "From $12,200",
    shopifyUrl: "https://hvnhavenry.myshopify.com/products/obsidian-bureau",
    accentColor: "#2a1810",
    roomPosition: "The study alcove",
  },
  bar: {
    id: "bar",
    name: "The Founders Bar",
    tagline: "Host with quiet authority",
    description:
      "A corner wet bar clad in Calacatta marble and book-matched Macassar ebony, the Founders Bar arrives complete with an integrated ice drawer, bottle wells, and smoked glass shelving for 24 bottles.",
    details: [
      "Calacatta marble counter — book-matched slab",
      "Macassar ebony cabinetry, French-polished",
      "Integrated ice drawer and three bottle wells",
      "Smoked glass shelving, brass framework",
      "Lead time: 16–20 weeks",
    ],
    price: "From $18,600",
    shopifyUrl: "https://hvnhavenry.myshopify.com/products/founders-bar",
    accentColor: "#1a2a1a",
    roomPosition: "The corner bar",
  },
  library: {
    id: "library",
    name: "The Grand Library Wall",
    tagline: "Knowledge, beautifully kept",
    description:
      "Floor-to-ceiling in hand-joined mahogany, the Grand Library Wall spans 12 feet and reaches 10 feet high. Rolling brass library ladders, adjustable shelving, integrated lighting, and a hidden secretary desk.",
    details: [
      "Solid mahogany, hand-jointed and French-polished",
      "Rolling brass library ladder included",
      "Integrated LED strip lighting, warm 2700K",
      "Hidden secretary desk folds flush when closed",
      "Lead time: 18–24 weeks",
    ],
    price: "From $34,000",
    shopifyUrl: "https://hvnhavenry.myshopify.com/products/grand-library-wall",
    accentColor: "#1a0e05",
    roomPosition: "The back wall",
  },
};

export const PRODUCT_ORDER: ProductId[] = ["sofa", "desk", "bar", "library"];
