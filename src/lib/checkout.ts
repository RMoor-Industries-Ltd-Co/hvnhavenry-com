// The shop domain the "Acquire This Piece" flow hands off to. Right now this serves the
// mock Shopify-style page (this same app, once shophvn.com points here); later it will
// point at the real Shopify storefront. Keeping the origin in one place makes that swap
// a one-line change.
export const SHOP_ORIGIN = "https://www.shophvn.com";

// A mock order/session id, generated fresh per hand-off (client-side).
export function newOrderId(): string {
  return "o_" + Math.floor(10000000 + Math.random() * 90000000).toString();
}

// The deep link a visitor is sent to when they acquire the Transitional Ember Line.
export function acquireDeepLink(): string {
  return `${SHOP_ORIGIN}/transitional-ember-line/dim-the-lights/${newOrderId()}`;
}
