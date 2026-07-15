"use client";

import { PRODUCTS } from "@/lib/products";
import { useHavenStore } from "@/lib/store";

// The cart drawer — mirrors ProductInfoPanel exactly in size, right-side fly-in, and
// close strip, so the two read as the same family of panel. Lists whatever the visitor
// has acquired (individually or via "Acquire this room"), each removable.
const CHECKOUT_URL = "https://hvnhavenry.com/cart";

export function CartPanel() {
  const cartOpen = useHavenStore((s) => s.cartOpen);
  const closeCart = useHavenStore((s) => s.closeCart);
  const cart = useHavenStore((s) => s.cart);
  const removeFromCart = useHavenStore((s) => s.removeFromCart);
  const clearCart = useHavenStore((s) => s.clearCart);

  const items = cart.map((id) => PRODUCTS[id]);

  return (
    <div
      className={`absolute top-0 right-0 h-full w-full sm:w-[420px] bg-[#0d0b09]/95 backdrop-blur-md border-l border-[#c9a96e]/20 flex flex-col transition-transform duration-500 ease-out ${
        cartOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Scrollable content — top padding clears the fixed top nav. */}
      <div className="flex-1 overflow-y-auto px-8 pt-28 pb-6">
        <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-sans mb-6 opacity-70">
          Your Selections
        </p>

        {items.length === 0 ? (
          <p className="text-sm leading-relaxed text-[#e8dcc8] opacity-60 font-sans">
            Your cart is empty. Choose a piece — or acquire the whole room — and it will
            gather here.
          </p>
        ) : (
          <ul className="flex flex-col gap-5">
            {items.map((product) => (
              <li
                key={product.id}
                className="flex items-start justify-between gap-4 border-b border-[#c9a96e]/10 pb-4"
              >
                <div>
                  <p className="text-[#c9a96e] text-[10px] tracking-[0.3em] uppercase font-sans mb-1 opacity-70">
                    {product.collection}
                  </p>
                  <h3 className="font-display text-xl font-light text-[#e8dcc8] leading-tight">
                    {product.name}
                  </h3>
                  <p className="font-display text-base text-[#c9a96e] mt-1 tracking-wide">
                    {product.price}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  aria-label={`Remove ${product.name}`}
                  className="shrink-0 text-[#c9a96e] opacity-50 hover:opacity-100 transition-opacity text-xs cursor-pointer"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="mt-8 flex flex-col gap-3 items-start">
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-[#c9a96e] px-8 py-4 text-[#c9a96e] font-display text-lg tracking-[0.2em] hover:bg-[#c9a96e] hover:text-[#0d0b09] transition-all duration-500"
            >
              Proceed to Checkout
            </a>
            <button
              onClick={clearCart}
              className="text-[#e8dcc8] opacity-50 hover:opacity-90 transition-opacity text-xs tracking-[0.2em] uppercase font-sans cursor-pointer"
            >
              Clear selections
            </button>
          </div>
        )}
      </div>

      {/* Persistent close strip — matches ProductInfoPanel. */}
      <div className="shrink-0 border-t border-[#c9a96e]/20 bg-[#0d0b09]/95 px-8 py-4">
        <button
          onClick={closeCart}
          className="text-[#c9a96e] opacity-70 hover:opacity-100 transition-opacity text-xs tracking-[0.25em] uppercase font-sans cursor-pointer"
        >
          ✕ Close
        </button>
      </div>
    </div>
  );
}
