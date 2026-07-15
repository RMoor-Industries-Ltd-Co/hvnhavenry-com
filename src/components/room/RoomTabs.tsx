"use client";

import { useHavenStore } from "@/lib/store";
import { COLLECTION_ORDER, getProductsByCollection, PRODUCTS } from "@/lib/products";
import { GoldenDivider } from "@/components/ui/GoldenDivider";
import { ProductInfoPanel } from "./ProductInfoPanel";
import { CartPanel } from "./CartPanel";

export function RoomTabs() {
  const activeCollection = useHavenStore((s) => s.activeCollection);
  const setActiveCollection = useHavenStore((s) => s.setActiveCollection);
  const activeTabItem = useHavenStore((s) => s.activeTabItem);
  const setActiveTabItem = useHavenStore((s) => s.setActiveTabItem);

  const items = getProductsByCollection(activeCollection);

  return (
    // The whole section is bounded by its own top + bottom dividers, sized so both
    // dividers, the collection links, and the room image sit together in one viewport
    // when the section snaps into place.
    <section id="the-room" className="relative w-full bg-[#0d0b09] flex flex-col">
      {/* Top divider — opens the section. */}
      <GoldenDivider py="py-6" />

      {/* Collection links — just above the image, the functional controls that drive
          which room is shown. */}
      <div className="flex flex-col items-center gap-2 pb-4">
        <span className="text-[0.65rem] tracking-[0.5em] uppercase text-[#c9a96e] opacity-50 font-sans">
          The Collection
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4">
          {COLLECTION_ORDER.map((collection) => (
            <button
              key={collection}
              onClick={() => setActiveCollection(collection)}
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

      {/* Room stage */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {/* Showroom background (placeholder: hero__great-room__day) — WebP w/ PNG fallback. */}
        <div className="absolute inset-0 bg-cover bg-center bg-asset-room-day" />

        {/* Soft edge vignette only — mostly transparent so the room reads clearly. */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_62%,rgba(13,11,9,0.5)_100%)]" />

        {/* Hotspots — rendered directly over the image (keyed for the fade on tab change) */}
        <div key={activeCollection} className="absolute inset-0 animate-fade-up">
          {items.map((product) => (
            <button
              key={product.id}
              onClick={() => setActiveTabItem(product.id)}
              className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${product.tabHotspot.x}%`, top: `${product.tabHotspot.y}%` }}
              aria-label={product.name}
            >
              <span className="relative flex items-center justify-center w-4 h-4">
                <span className="absolute inset-0 rounded-full bg-[#c9a96e] animate-hotspot-pulse" />
                <span className="absolute -inset-3 rounded-full border border-[#c9a96e] opacity-0 group-hover:opacity-70 transition-opacity duration-300 animate-hotspot-ring" />
                <span className="relative w-2 h-2 rounded-full bg-[#c9a96e] shadow-[0_0_12px_4px_rgba(201,169,110,0.6)] group-hover:shadow-[0_0_20px_8px_rgba(201,169,110,0.9)] transition-shadow duration-300" />
              </span>
              <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-[11px] tracking-[0.15em] uppercase font-sans text-[#c9a96e] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#0d0b09]/85 border border-[#c9a96e]/40 px-2 py-1">
                {product.name}
              </span>
            </button>
          ))}
        </div>

        <ProductInfoPanel
          product={activeTabItem ? PRODUCTS[activeTabItem] : null}
          onClose={() => setActiveTabItem(null)}
        />

        {/* Cart drawer — same size/position/close as the product panel, flies in from
            the right. */}
        <CartPanel />
      </div>

      {/* Bottom divider — closes the section. */}
      <GoldenDivider py="py-6" />
    </section>
  );
}
