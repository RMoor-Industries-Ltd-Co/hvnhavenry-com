"use client";

import Link from "next/link";
import { useState } from "react";

// Footer links that resolve to real mock pages.
const FOOTER_HREFS: Record<string, string> = {
  Contact: "/contact",
  "Track Order": "/account",
};

// A mock Shopify-style product/checkout page for the Transitional Ember Line — served at
// the shophvn.com deep link a visitor reaches from "Acquire This Piece". No real payment
// is processed; ADD TO CART / BUY IT NOW surface a preview confirmation. Lexicon: the
// product is an "Ember Line" (never "incense") and the companion tray is the
// "Ember Line Drift Sanctum".
const PRICE = 99;
const UPSELL_PRICE = 50;

const PAYMENTS = ["VISA", "MC", "AMEX", "DISCOVER", "Apple Pay", "G Pay"];
const TRUST = [
  { t: "Clean Ingredients", d: "Made with natural resins, woods & oils." },
  { t: "Pure Atmosphere", d: "No fillers, no synthetic fragrance." },
  { t: "Secure Checkout", d: "Your information is safe and protected." },
  { t: "Fast Shipping", d: "Carefully packed & shipped with care." },
];
const FOOTER = {
  Shop: ["All Products", "Ember Line", "Drift Sanctums", "Bundles"],
  Collections: ["Relax", "Focus", "Restore", "Lounge"],
  About: ["Our Story", "Ingredients", "Sustainability", "Careers"],
  Concierge: ["Contact", "FAQs", "Shipping & Returns", "Track Order"],
};

// Dark placeholder tile standing in for product photography until real shots are dropped in.
function Shot({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1510] via-[#0d0b09] to-[#000] ${className}`}
    >
      <span className="font-display text-2xl tracking-[0.3em] text-[#c9a96e]/40">HVN</span>
      <span className="absolute bottom-2 left-0 right-0 text-center text-[9px] uppercase tracking-[0.3em] text-[#c9a96e]/30 font-sans">
        {label}
      </span>
    </div>
  );
}

export function MockCheckout({ order }: { order: string }) {
  const [qty, setQty] = useState(1);
  const [addSanctum, setAddSanctum] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const total = PRICE * qty + (addSanctum ? UPSELL_PRICE : 0);

  return (
    <div className="min-h-screen bg-[#0d0b09] text-[#e8dcc8]">
      {/* Announcement */}
      <div className="border-b border-[#c9a96e]/10 py-3 text-center text-[10px] uppercase tracking-[0.35em] text-[#c9a96e] font-sans">
        Complimentary Shipping on Orders $75+
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 lg:px-10">
        <span className="text-lg text-[#c9a96e]">☰</span>
        <div className="text-center">
          <div className="font-display text-2xl tracking-[0.35em] text-[#c9a96e] leading-none">HVN</div>
          <div className="font-display text-[0.6rem] tracking-[0.5em] text-[#c9a96e] opacity-70">HAVENRY</div>
        </div>
        <div className="flex items-center gap-4 text-[#c9a96e]">
          <span>⌕</span>
          <span>▢</span>
        </div>
      </header>
      <nav className="hidden md:flex items-center justify-center gap-10 border-t border-[#c9a96e]/10 py-3 text-[11px] uppercase tracking-[0.25em] text-[#e8dcc8]/70 font-sans">
        {["Home", "Shop", "Collections", "Rituals", "About", "Concierge"].map((n) => (
          <span key={n} className="hover:text-[#c9a96e] transition-colors cursor-pointer">{n}</span>
        ))}
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
        {/* Preview banner */}
        <div className="mb-6 border border-[#c9a96e]/30 bg-[#c9a96e]/5 px-4 py-2 text-[11px] tracking-wide text-[#c9a96e] font-sans">
          Preview Mode — mock checkout for design review. No payment is processed and no real order is placed.
          <span className="opacity-60"> · Order {order}</span>
        </div>

        {/* Breadcrumb */}
        <p className="mb-6 text-[11px] uppercase tracking-[0.2em] text-[#e8dcc8]/50 font-sans">
          Home / Shop / Ember Line / <span className="text-[#c9a96e]">Dim the Lights</span>
        </p>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <Shot label="Transitional Ember Line" className="aspect-square w-full" />
            <div className="mt-3 grid grid-cols-4 gap-3">
              {["Box", "Line", "Detail", "Set"].map((l) => (
                <Shot key={l} label={l} className="aspect-square" />
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#c9a96e] opacity-70 mb-2">Ember Line</p>
            <h1 className="font-display text-4xl lg:text-5xl font-light leading-tight">Transitional Ember Line</h1>
            <p className="font-display text-2xl text-[#c9a96e] mb-4">Dim the Lights</p>
            <p className="text-sm leading-relaxed text-[#e8dcc8]/80 font-sans mb-6">
              A transitional ember line that shifts from warmth to depth, guiding the atmosphere from light to
              shadow.
            </p>

            <p className="font-display text-3xl text-[#c9a96e] mb-2">${PRICE}.00</p>
            <p className="text-xs text-[#e8dcc8]/70 font-sans mb-6">◍ In stock and ready to ship</p>

            <label className="block text-[10px] uppercase tracking-[0.3em] text-[#e8dcc8]/60 font-sans mb-2">
              Scent Variation
            </label>
            <div className="mb-6 flex items-center justify-between border border-[#c9a96e]/30 px-4 py-3">
              <div>
                <p className="text-sm text-[#e8dcc8]">Dim the Lights</p>
                <p className="text-[11px] text-[#e8dcc8]/50 font-sans">Warm glow to deep calm.</p>
              </div>
              <span className="text-[#c9a96e]">⌄</span>
            </div>

            <label className="block text-[10px] uppercase tracking-[0.3em] text-[#e8dcc8]/60 font-sans mb-2">
              Quantity
            </label>
            <div className="mb-6 inline-flex items-center border border-[#c9a96e]/30">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-[#c9a96e] cursor-pointer"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-12 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-2 text-[#c9a96e] cursor-pointer"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setConfirmed(true)}
                className="w-full bg-[#c9a96e] py-4 text-[13px] uppercase tracking-[0.25em] text-[#0d0b09] font-sans hover:bg-[#d8bd86] transition-colors cursor-pointer"
              >
                Add to Cart
              </button>
              <button
                onClick={() => setConfirmed(true)}
                className="w-full bg-black py-4 text-[13px] uppercase tracking-[0.25em] text-[#e8dcc8] font-sans border border-[#e8dcc8]/20 hover:border-[#c9a96e] transition-colors cursor-pointer"
              >
                Buy It Now
              </button>
            </div>

            {confirmed && (
              <p className="mt-4 border border-[#c9a96e]/30 bg-[#c9a96e]/5 px-4 py-3 text-xs text-[#c9a96e] font-sans">
                Added (preview) — {qty} × Ember Line{addSanctum ? " + Ember Line Drift Sanctum" : ""} · ${total}.00.
                No payment processed.
              </p>
            )}

            <p className="mt-5 text-[11px] text-[#e8dcc8]/60 font-sans mb-2">🔒 Secure checkout guaranteed</p>
            <div className="flex flex-wrap gap-2">
              {PAYMENTS.map((p) => (
                <span
                  key={p}
                  className="rounded border border-[#e8dcc8]/15 bg-[#e8dcc8]/5 px-2 py-1 text-[9px] uppercase tracking-wider text-[#e8dcc8]/70 font-sans"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Complete the ritual — upsell */}
        <section className="mt-12 bg-[#e8dcc8] text-[#0d0b09] p-6 lg:p-8">
          <p className="text-center text-[11px] uppercase tracking-[0.4em] mb-6">— Complete the Ritual —</p>
          <div className="grid gap-6 md:grid-cols-[200px_1fr_auto] md:items-center">
            <Shot label="Drift Sanctum" className="aspect-[3/1] md:aspect-square rounded" />
            <div>
              <h3 className="font-display text-2xl">Ember Line Drift Sanctum</h3>
              <p className="text-sm text-[#0d0b09]/70 font-sans my-1">
                The perfect companion for your Ember Line. Designed to hold the line and catch its drift, elevating
                your space.
              </p>
              <p className="font-display text-xl">${UPSELL_PRICE}.00</p>
            </div>
            <label className="flex items-start gap-3 bg-black/5 p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={addSanctum}
                onChange={(e) => setAddSanctum(e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm font-sans">
                Yes, add the Ember Line Drift Sanctum to my order
                <span className="block text-[#0d0b09]/60">${UPSELL_PRICE}.00</span>
              </span>
            </label>
          </div>
        </section>

        {/* Trust badges */}
        <section className="mt-10 grid grid-cols-2 gap-6 border-t border-[#c9a96e]/10 pt-8 md:grid-cols-4">
          {TRUST.map(({ t, d }) => (
            <div key={t}>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#c9a96e] mb-1 font-sans">{t}</p>
              <p className="text-xs text-[#e8dcc8]/60 font-sans leading-relaxed">{d}</p>
            </div>
          ))}
        </section>

        <p className="mt-10 text-center font-display text-lg text-[#e8dcc8]">
          Satisfaction Guaranteed <span className="text-[#c9a96e]">·</span> 30-Day Returns
        </p>
        <p className="text-center text-sm text-[#e8dcc8]/50 font-sans">Love your experience or let us know.</p>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-[#c9a96e]/10 bg-[#0d0b09] px-6 py-12 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <div className="font-display text-2xl tracking-[0.3em] text-[#c9a96e]">HVN</div>
            <p className="font-display text-[0.6rem] tracking-[0.5em] text-[#c9a96e] opacity-70 mb-3">HAVENRY</p>
            <p className="text-xs text-[#e8dcc8]/50 font-sans max-w-xs">A haven for ambiance, ritual, and elevated living.</p>
          </div>
          {Object.entries(FOOTER).map(([col, links]) => (
            <div key={col}>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#c9a96e] opacity-70 mb-3 font-sans">{col}</p>
              <ul className="flex flex-col gap-2">
                {links.map((l) =>
                  FOOTER_HREFS[l] ? (
                    <li key={l}>
                      <Link href={FOOTER_HREFS[l]} className="text-xs text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors font-sans">
                        {l}
                      </Link>
                    </li>
                  ) : (
                    <li key={l} className="text-xs text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors cursor-pointer font-sans">
                      {l}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-6xl text-[11px] text-[#e8dcc8]/40 font-sans">
          © 2026 HVN Havenry. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
