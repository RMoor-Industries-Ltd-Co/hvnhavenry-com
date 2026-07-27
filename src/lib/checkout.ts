// The origin the "Acquire This Piece" flow hands off to. Empty string = same origin
// (hvnhavenry.com), so the mock checkout deep link resolves right now without any DNS.
// When shophvn.com is pointed at the store, set this to "https://www.shophvn.com" — a
// one-line swap and the whole flow retargets.
export const SHOP_ORIGIN = "";

// A mock order/session id, generated fresh per hand-off (client-side).
export function newOrderId(): string {
  return "o_" + Math.floor(10000000 + Math.random() * 90000000).toString();
}

// The deep link a visitor is sent to when they acquire the Transitional Ember Line.
export function acquireDeepLink(): string {
  return `${SHOP_ORIGIN}/transitional-ember-line/dim-the-lights/${newOrderId()}`;
}
