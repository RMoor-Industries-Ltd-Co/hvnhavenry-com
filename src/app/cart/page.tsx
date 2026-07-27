"use client";

import Link from "next/link";
import { useHavenStore } from "@/lib/store";
import { getCartLines, getCartTotals, formatCurrency } from "@/lib/checkout";
import { ProductSwatch } from "@/components/checkout/ProductSwatch";
import { PreviewBanner } from "@/components/checkout/PreviewBanner";

export default function CartPage() {
  const cart = useHavenStore((state) => state.cart);
  const updateCartQuantity = useHavenStore((state) => state.updateCartQuantity);
  const removeFromCart = useHavenStore((state) => state.removeFromCart);

  const lines = getCartLines(cart);
  const totals = getCartTotals(cart);

  return (
    <main className="min-h-screen bg-[#0d0b09] text-[#e8dcc8]">
      <PreviewBanner />

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#c9a96e]/10">
        <Link href="/" className="font-display text-2xl tracking-[0.3em] text-[#c9a96e]">
          HVN
        </Link>
        <p className="text-xs tracking-[0.35em] uppercase text-[#e8dcc8]/50 font-sans">Your Cart</p>
      </header>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-16">
        <h1 className="font-display text-4xl lg:text-5xl font-light mb-10">
          Your <span className="italic text-[#c9a96e]">Selection</span>
        </h1>

        {lines.length === 0 ? (
          <div className="border border-[#c9a96e]/15 py-24 flex flex-col items-center gap-6 text-center">
            <p className="text-[#e8dcc8]/50 font-sans text-sm tracking-wide">
              Your cart is currently empty.
            </p>
            <Link
              href="/#combRail"
              className="inline-flex items-center gap-3 border border-[#c9a96e] px-8 py-4 text-[#c9a96e] font-display text-lg tracking-[0.2em] hover:bg-[#c9a96e] hover:text-[#0d0b09] transition-all duration-500"
            >
              Return to the Room
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-12">
            {/* Line items */}
            <div className="divide-y divide-[#c9a96e]/10 border-y border-[#c9a96e]/10">
              {lines.map((line) => (
                <div key={line.productId} className="flex items-start gap-5 py-6">
                  <ProductSwatch accentColor={line.accentColor} initials="HVN" />

                  <div className="flex-1 min-w-0">
                    <p className="text-[#c9a96e] text-[10px] tracking-[0.3em] uppercase font-sans mb-1 opacity-70">
                      {line.collection}
                    </p>
                    <h2 className="font-display text-xl leading-snug mb-2">{line.name}</h2>
                    <p className="text-sm text-[#e8dcc8]/60 font-sans">{line.priceLabel}</p>

                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-[#c9a96e]/25">
                        <button
                          aria-label="Decrease quantity"
                          onClick={() => updateCartQuantity(line.productId, line.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors font-sans"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-sans">{line.quantity}</span>
                        <button
                          aria-label="Increase quantity"
                          onClick={() => updateCartQuantity(line.productId, line.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors font-sans"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(line.productId)}
                        className="text-xs tracking-[0.2em] uppercase text-[#e8dcc8]/40 hover:text-[#e8dcc8] transition-colors font-sans"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="font-display text-lg text-[#c9a96e] whitespace-nowrap">
                    {formatCurrency(line.lineTotal)}
                  </p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="glass-card p-8 h-fit lg:sticky lg:top-8">
              <h2 className="font-display text-xl mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Subtotal ({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Estimated shipping</span>
                  <span>{formatCurrency(totals.shipping)}</span>
                </div>
                <div className="flex justify-between text-[#e8dcc8]/70">
                  <span>Estimated tax</span>
                  <span>{formatCurrency(totals.tax)}</span>
                </div>
              </div>
              <div className="h-px bg-[#c9a96e]/15 my-5" />
              <div className="flex justify-between font-display text-xl text-[#c9a96e] mb-8">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
              <Link
                href="/checkout"
                className="block text-center border border-[#c9a96e] bg-[#c9a96e] text-[#0d0b09] py-4 font-display text-lg tracking-[0.2em] hover:bg-transparent hover:text-[#c9a96e] transition-all duration-500"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/"
                className="block text-center mt-4 text-xs tracking-[0.2em] uppercase text-[#e8dcc8]/40 hover:text-[#e8dcc8] transition-colors font-sans"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
