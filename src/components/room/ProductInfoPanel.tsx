"use client";

import { Product } from "@/lib/products";
import { BuyButton } from "@/components/ui/BuyButton";
import { useHavenStore } from "@/lib/store";

interface ProductInfoPanelProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductInfoPanel({ product, onClose }: ProductInfoPanelProps) {
  const openVideo = useHavenStore((s) => s.openVideo);
  const scrollToSection = useHavenStore((s) => s.scrollToSection);

  const handleWatchFilm = () => {
    if (!product) return;
    openVideo(product.id);
    scrollToSection?.("film-section");
  };

  return (
    <div
      className={`absolute top-0 right-0 h-full w-full sm:w-[420px] bg-[#0d0b09]/95 backdrop-blur-md border-l border-[#c9a96e]/20 flex flex-col transition-transform duration-500 ease-out ${
        product ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {product && (
        <>
          {/* Scrollable content — top padding keeps the details clear of the fixed
              top nav; scrolls independently of the close strip below. */}
          <div className="flex-1 overflow-y-auto px-8 pt-28 pb-6">
            <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-sans mb-4 opacity-70">
              {product.roomPosition}
            </p>
            <h3 className="font-display text-4xl font-light text-[#e8dcc8] leading-tight mb-2">
              {product.name}
            </h3>
            <p className="font-display italic text-lg text-[#c9a96e] mb-5 opacity-80">
              {product.tagline}
            </p>
            <p className="text-sm leading-relaxed text-[#e8dcc8] opacity-70 font-sans mb-6">
              {product.description}
            </p>
            <p className="font-display text-2xl text-[#c9a96e] mb-6 tracking-wide">
              {product.price}
            </p>

            <div className="flex flex-col gap-3 items-start">
              <BuyButton url={product.shopifyUrl} />
              {product.hasVideo && (
                <button
                  onClick={handleWatchFilm}
                  className="inline-flex items-center gap-3 border border-[#e8dcc8]/30 px-8 py-4 text-[#e8dcc8] font-display text-lg tracking-[0.2em] hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all duration-500"
                >
                  Watch the Film
                </button>
              )}
            </div>
          </div>

          {/* Persistent close strip — bottom-left, always visible, never scrolls away
              and clears the top-right View Cart button. */}
          <div className="shrink-0 border-t border-[#c9a96e]/20 bg-[#0d0b09]/95 px-8 py-4">
            <button
              onClick={onClose}
              className="text-[#c9a96e] opacity-70 hover:opacity-100 transition-opacity text-xs tracking-[0.25em] uppercase font-sans cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}
