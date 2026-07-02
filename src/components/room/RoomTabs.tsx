"use client";

import { useHavenStore } from "@/lib/store";
import { COLLECTION_ORDER, getProductsByCollection, PRODUCTS } from "@/lib/products";
import { ProductInfoPanel } from "./ProductInfoPanel";

export function RoomTabs() {
  const activeCollection = useHavenStore((s) => s.activeCollection);
  const setActiveCollection = useHavenStore((s) => s.setActiveCollection);
  const activeTabItem = useHavenStore((s) => s.activeTabItem);
  const setActiveTabItem = useHavenStore((s) => s.setActiveTabItem);

  const items = getProductsByCollection(activeCollection);
  const gradientColors = items.length > 0 ? items.map((p) => p.accentColor) : ["#0d0b09", "#1a1510"];

  return (
    <section id="the-room" className="relative w-full bg-[#0d0b09]">
      {/* Eyebrow */}
      <div className="pt-24 pb-8 flex justify-center">
        <p className="text-[#c9a96e] opacity-40 text-xs tracking-[0.5em] uppercase font-sans">
          The Collection
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 px-8 pb-10">
        {COLLECTION_ORDER.map((collection) => (
          <button
            key={collection}
            onClick={() => setActiveCollection(collection)}
            className={`relative text-xs md:text-sm tracking-[0.25em] uppercase font-sans pb-3 transition-colors duration-300 cursor-pointer ${
              activeCollection === collection
                ? "text-[#c9a96e]"
                : "text-[#e8dcc8] opacity-40 hover:opacity-70"
            }`}
          >
            {collection}
            <span
              className={`absolute left-0 right-0 -bottom-px h-px bg-[#c9a96e] transition-transform duration-500 origin-center ${
                activeCollection === collection ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Room stage */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div
          key={activeCollection}
          className="absolute inset-0 animate-fade-up"
          style={{ background: `linear-gradient(135deg, ${gradientColors.join(", ")})` }}
        >
          {/* Texture overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(201,169,110,0.03) 2px, rgba(201,169,110,0.03) 4px)`,
            }}
          />
          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b09] via-transparent to-[#0d0b09] opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0d0b09_95%)] opacity-60" />

          {/* Hotspots */}
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
      </div>
    </section>
  );
}
