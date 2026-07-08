"use client";

import { useState } from "react";
import { useHavenStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";

// Default promo reel — pulled via the asset pipeline (video__promo__default).
// A missing/not-yet-pulled file degrades to the empty frame rather than a broken tag.
const PROMO_SRC = "/assets/video/video__promo__default.mp4";

export function VideoRevealSection() {
  const activeVideoProduct = useHavenStore((s) => s.activeVideoProduct);
  const resetVideo = useHavenStore((s) => s.resetVideo);
  const scrollToSection = useHavenStore((s) => s.scrollToSection);
  const product = activeVideoProduct ? PRODUCTS[activeVideoProduct] : null;

  // Two-state exit control: ✕ returns to the promo, then "Back to Showroom" scrolls up.
  // A requested product film always shows the ✕ (the return label is promo-only).
  const [showBack, setShowBack] = useState(false);

  const handleExit = () => {
    resetVideo();
    setShowBack(true);
  };
  const handleBackToShowroom = () => {
    scrollToSection?.("the-room");
    setShowBack(false);
  };

  return (
    <section
      id="film-section"
      className="relative w-full min-h-screen bg-[#0d0b09] flex items-center justify-center overflow-hidden px-8 py-24"
    >
      {/* Exit / return control — always visible, top-right */}
      <div className="absolute top-8 right-8 z-10">
        {showBack && !product ? (
          <button
            onClick={handleBackToShowroom}
            className="text-[#c9a96e] opacity-80 hover:opacity-100 transition-opacity text-xs tracking-[0.3em] uppercase font-sans cursor-pointer"
          >
            ← Back to Showroom
          </button>
        ) : (
          <button
            onClick={handleExit}
            aria-label="Exit film"
            className="text-[#c9a96e] opacity-70 hover:opacity-100 transition-opacity text-lg font-sans cursor-pointer leading-none"
          >
            ✕
          </button>
        )}
      </div>

      <div className="relative w-full max-w-5xl aspect-video border border-[#c9a96e]/20 bg-[#151210] flex items-center justify-center overflow-hidden">
        {product ? (
          /* Requested product film (real per-product films wire in later). */
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1510] via-[#0d0b09] to-[#0a0705]" />
            <button
              aria-label="Play film"
              className="relative z-10 w-20 h-20 rounded-full border border-[#c9a96e] flex items-center justify-center hover:bg-[#c9a96e]/10 transition-colors duration-300 cursor-pointer"
            >
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                <path d="M4 2.5v11l10-5.5-10-5.5z" fill="#c9a96e" />
              </svg>
            </button>
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#c9a96e] opacity-50 text-xs tracking-[0.3em] uppercase font-sans">
              {product.videoLabel ?? `${product.name} — The Film`}
            </p>
          </>
        ) : (
          /* Default promo reel. */
          <>
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={PROMO_SRC}
              autoPlay
              muted
              loop
              playsInline
              controls
            />
            <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[#c9a96e] opacity-50 text-xs tracking-[0.3em] uppercase font-sans">
              HVN Havenry — Featured
            </p>
          </>
        )}
      </div>
    </section>
  );
}
