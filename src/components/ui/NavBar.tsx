"use client";

import { useHavenStore } from "@/lib/store";
import { COLLECTION_ORDER } from "@/lib/products";

// Shopify cart (the section-3 shopping CTA).
const CART_URL = "https://hvnhavenry.com/cart";

// Each section owns its own contextual center row. As the active section
// advances, earlier rows bump up and out while later rows rise into place.
function rowPosition(rowSection: number, active: number): string {
  if (rowSection === active) return "opacity-100 translate-y-0 pointer-events-auto";
  if (rowSection < active) return "opacity-0 -translate-y-6 pointer-events-none";
  return "opacity-0 translate-y-6 pointer-events-none";
}

export function NavBar() {
  const activeNavSection = useHavenStore((s) => s.activeNavSection);
  const scrollToSection = useHavenStore((s) => s.scrollToSection);
  const activeCollection = useHavenStore((s) => s.activeCollection);
  const setActiveCollection = useHavenStore((s) => s.setActiveCollection);

  const go = (id: string) => () => scrollToSection?.(id);

  const linkClass =
    "text-xs tracking-[0.25em] uppercase text-[#e8dcc8] opacity-60 hover:opacity-100 transition-opacity duration-300 font-sans cursor-pointer";
  const ctaClass =
    "text-xs tracking-[0.2em] uppercase text-[#c9a96e] opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer font-sans whitespace-nowrap py-[2px] px-[1%]";

  // Section 2 hides the flanking logo + CTA; the center controls carry navigation there.
  const flanksHidden = activeNavSection === 1;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-start justify-between pl-10 pr-8 pt-8 pb-4 mix-blend-normal">
      {/* Logo — hidden in section 2, returns in section 3. Clickable back to top. */}
      <button
        onClick={go("top")}
        className={`font-display text-2xl tracking-[0.3em] text-[#c9a96e] cursor-pointer hover:opacity-80 transition-all duration-500 ${
          flanksHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="HVN Havenry — back to top"
      >
        HVN
      </button>

      {/* Stacked contextual center rows — one per section, crossfading in place */}
      <div className="hidden md:block relative flex-1 mx-8 h-12">
        {/* Section 1 — slogan only (placeholder links removed) */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out ${rowPosition(
            0,
            activeNavSection
          )}`}
        >
          <span className="gold-shimmer text-[0.7rem] tracking-[0.35em] uppercase font-sans">
            It&apos;s not a store. It is a Havenry.
          </span>
        </div>

        {/* Section 2 — page controls */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-8 transition-all duration-500 ease-out ${rowPosition(
            1,
            activeNavSection
          )}`}
        >
          <button onClick={go("top")} className={linkClass}>
            Back to Home
          </button>
          <button onClick={go("concierge")} className={linkClass}>
            Speak to Concierge
          </button>
        </div>

        {/* Section 3 — the collection (functional; drives the room) */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-start gap-2 transition-all duration-500 ease-out ${rowPosition(
            2,
            activeNavSection
          )}`}
        >
          <span className="text-[0.65rem] tracking-[0.5em] uppercase text-[#c9a96e] opacity-50 font-sans">
            The Collection
          </span>
          <div className="flex items-center gap-6">
            {COLLECTION_ORDER.map((collection) => (
              <button
                key={collection}
                onClick={() => {
                  setActiveCollection(collection);
                  scrollToSection?.("the-room");
                }}
                className={`text-xs tracking-[0.25em] uppercase transition-opacity duration-300 font-sans cursor-pointer ${
                  activeCollection === collection
                    ? "text-[#c9a96e] opacity-100"
                    : "text-[#e8dcc8] opacity-50 hover:opacity-90"
                }`}
              >
                {collection}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right CTA — Speak to Concierge (S1) / hidden (S2) / View Cart (S3) */}
      <div className={`transition-opacity duration-500 ${flanksHidden ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        {activeNavSection === 2 ? (
          <a href={CART_URL} className={ctaClass}>
            View Cart
          </a>
        ) : (
          <button onClick={go("concierge")} className={ctaClass}>
            Speak to Concierge
          </button>
        )}
      </div>
    </nav>
  );
}
