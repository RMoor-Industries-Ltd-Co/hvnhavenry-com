import { CartItem } from "./store";
import { PRODUCTS } from "./products";

/**
 * Mock checkout helpers.
 *
 * NOTE: This entire module supports a *demo* checkout experience only.
 * No real payment is processed and no real order is placed — see the
 * "Preview Mode" banner on /checkout for the user-facing disclosure.
 */

/** Extracts a usable numeric price from strings like "$65" or "From $85". */
export function parsePrice(priceLabel: string): number {
  const match = priceLabel.replace(/,/g, "").match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export interface CartLine {
  productId: CartItem["productId"];
  name: string;
  collection: string;
  price: number;
  priceLabel: string;
  accentColor: string;
  quantity: number;
  lineTotal: number;
}

export function getCartLines(cart: CartItem[]): CartLine[] {
  return cart.map((item) => {
    const product = PRODUCTS[item.productId];
    const price = parsePrice(product.price);
    return {
      productId: item.productId,
      name: product.name,
      collection: product.collection,
      price,
      priceLabel: product.price,
      accentColor: product.accentColor,
      quantity: item.quantity,
      lineTotal: price * item.quantity,
    };
  });
}

export const SHIPPING_FLAT_RATE = 12;
export const TAX_RATE = 0.0725; // mock estimated sales tax

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export function getCartTotals(cart: CartItem[], shippingOverride?: number): CartTotals {
  const lines = getCartLines(cart);
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = itemCount === 0 ? 0 : shippingOverride ?? SHIPPING_FLAT_RATE;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total, itemCount };
}

export const SHIPPING_METHODS = [
  { id: "standard", label: "Standard Shipping", eta: "5–9 business days", rate: SHIPPING_FLAT_RATE },
  { id: "express", label: "Express Shipping", eta: "2–3 business days", rate: 28 },
] as const;

export function generateOrderNumber(): string {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return `HVN-${digits}`;
}

export function estimatedDeliveryRange(fromDate: Date = new Date()): string {
  const start = new Date(fromDate);
  start.setDate(start.getDate() + 5);
  const end = new Date(fromDate);
  end.setDate(end.getDate() + 9);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}
