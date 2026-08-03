/**
 * Mock marketing data for the HVN Havenry marketing dashboard.
 *
 * "Mock now, wire later": every figure below is a plausible placeholder so the dashboard
 * renders fully before real integrations exist. Each block is shaped like the eventual
 * live source so swapping in real data is a source change, not a UI change:
 *   - `siteMetrics` / `trafficSeries`  → Google Analytics (GA4 Data API)
 *   - `shopKpis` / `inventory`         → Shopify Admin API
 *   - `vendors`                        → Shopify vendors / internal vendor list
 *   - `integrations`                   → live connection status of each hub
 *
 * Deterministic (no Date.now()/random) so the dashboard is stable across renders and SSR.
 */

export interface Metric {
  label: string;
  value: string;
  /** Period-over-period change, e.g. +12.4 or -3.1 (percent). */
  deltaPct: number;
  hint: string;
}

export interface TrafficPoint {
  label: string; // month label
  visits: number;
  organic: number;
}

export interface InventoryRow {
  sku: string;
  product: string;
  onHand: number;
  reorderAt: number;
  price: string;
  status: "healthy" | "low" | "out";
}

export interface Vendor {
  name: string;
  category: string;
  leadTimeDays: number;
  status: "active" | "onboarding" | "paused";
}

export interface Integration {
  name: string;
  purpose: string;
  status: "connected" | "not_connected" | "mock";
  envKey: string;
}

// ── Site metrics (GA-shaped) ─────────────────────────────────────────────────
export const siteMetrics: Metric[] = [
  { label: "Page Views", value: "48,912", deltaPct: 12.4, hint: "Last 30 days" },
  { label: "Organic Visits", value: "19,204", deltaPct: 8.1, hint: "From search" },
  { label: "Link Clicks", value: "6,730", deltaPct: -3.2, hint: "Outbound + CTA" },
  { label: "Avg. Session", value: "2m 41s", deltaPct: 5.6, hint: "Engaged time" },
];

export const trafficSeries: TrafficPoint[] = [
  { label: "Feb", visits: 21400, organic: 9200 },
  { label: "Mar", visits: 24800, organic: 10600 },
  { label: "Apr", visits: 23100, organic: 10100 },
  { label: "May", visits: 28900, organic: 12800 },
  { label: "Jun", visits: 33400, organic: 15100 },
  { label: "Jul", visits: 39200, organic: 18300 },
  { label: "Aug", visits: 48912, organic: 19204 },
];

// ── Shopify store KPIs (Admin-API-shaped) ────────────────────────────────────
export const shopKpis: Metric[] = [
  { label: "Revenue", value: "$82,140", deltaPct: 14.9, hint: "Last 30 days" },
  { label: "Orders", value: "612", deltaPct: 9.7, hint: "Paid orders" },
  { label: "Conversion Rate", value: "2.3%", deltaPct: 0.4, hint: "Visit → order" },
  { label: "Avg. Order Value", value: "$134.21", deltaPct: 4.8, hint: "AOV" },
  { label: "Cart Abandonment", value: "68.2%", deltaPct: -2.1, hint: "Lower is better" },
  { label: "Returning Customers", value: "31%", deltaPct: 3.3, hint: "Repeat buyers" },
];

// ── Inventory (Shopify products/variants-shaped) ─────────────────────────────
export const inventory: InventoryRow[] = [
  { sku: "HVN-EMBR-001", product: "Ember Line", onHand: 128, reorderAt: 40, price: "$99", status: "healthy" },
  { sku: "HVN-EMBR-SNC", product: "Ember Line Drift Sanctum", onHand: 34, reorderAt: 40, price: "$50", status: "low" },
  { sku: "HVN-SHDW-CHM", product: "Shadow Chamber", onHand: 12, reorderAt: 15, price: "$240", status: "low" },
  { sku: "HVN-COL-CHM", product: "Column Chamber", onHand: 0, reorderAt: 10, price: "$310", status: "out" },
  { sku: "HVN-ATM-MST", product: "Atmosphere Mist", onHand: 210, reorderAt: 50, price: "$45", status: "healthy" },
  { sku: "HVN-BOLSTER", product: "Bolster", onHand: 76, reorderAt: 25, price: "$120", status: "healthy" },
];

// ── Vendors ──────────────────────────────────────────────────────────────────
export const vendors: Vendor[] = [
  { name: "Atelier Noir", category: "Ceramics & vessels", leadTimeDays: 21, status: "active" },
  { name: "Meridian Wax Co.", category: "Ember line / wax", leadTimeDays: 14, status: "active" },
  { name: "Draper & Hale", category: "Textiles", leadTimeDays: 30, status: "active" },
  { name: "Lumen Foundry", category: "Metal fixtures", leadTimeDays: 45, status: "onboarding" },
  { name: "Verdant Supply", category: "Botanicals", leadTimeDays: 10, status: "paused" },
];

// ── Integration hub ──────────────────────────────────────────────────────────
export const integrations: Integration[] = [
  { name: "Shopify Admin API", purpose: "Orders, products, inventory, customers", status: "not_connected", envKey: "SHOPIFY_ADMIN_TOKEN" },
  { name: "Google Analytics (GA4)", purpose: "Traffic, sessions, acquisition", status: "not_connected", envKey: "GA4_PROPERTY_ID" },
  { name: "Shopify Storefront API", purpose: "Cart / checkout embedding", status: "mock", envKey: "NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN" },
  { name: "Vale Activity Report", purpose: "HVN↔AMG concierge rollup", status: "connected", envKey: "AGENT_API_KEY" },
];
