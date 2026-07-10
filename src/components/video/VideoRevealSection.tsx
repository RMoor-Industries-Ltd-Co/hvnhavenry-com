"use client";

import { useEffect, useRef, useState } from "react";
import { useHavenStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";

// Default promo — a two-part playlist pulled via the asset pipeline
// (video__promo__default__01 / __02). Part 1 plays once, then part 2 plays and
// loops. A missing/not-yet-pulled file degrades to the empty frame rather than a
// broken tag.
const PROMO_SRCS = [
  "/assets/video/video__promo__default__01.mp4",
  "/assets/video/video__promo__default__02.mp4",
];

export function VideoRevealSection() {
  const activeVideoProduct = useHavenStore((s) => s.activeVideoProduct);
  const product = activeVideoProduct ? PRODUCTS[activeVideoProduct] : null;

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Which clip of the promo playlist is showing. Part 1 (index 0) plays once and,
  // on `ended`, advances to part 2 (the last), which loops forever.
  const [promoIndex, setPromoIndex] = useState(0);
  const isLastPromo = promoIndex === PROMO_SRCS.length - 1;

  // Perf: the promo is heavy (preload="none"). Only load + play once the section
  // scrolls into view; pause when it leaves. Re-attaches when the promo remounts.
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [activeVideoProduct]);

  // When part 1 finishes and we advance the playlist, the <video> src changes —
  // load the new clip and continue playing straight into it (we're already in view).
  useEffect(() => {
    if (promoIndex === 0) return; // first clip is started by the IntersectionObserver
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [promoIndex]);

  return (
    <section
      ref={sectionRef}
      id="film-section"
      className="relative w-full min-h-screen bg-[#0d0b09] flex items-center justify-center overflow-hidden px-8 py-24"
    >
      {/* Return from the film lives in the top nav ("Return to Showroom") — no ✕ here,
          which could be mistaken for closing/dismissing the player. */}
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
          /* Default promo reel — lazy-loaded, plays only in view. */
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              src={PROMO_SRCS[promoIndex]}
              preload="none"
              muted
              loop={isLastPromo}
              playsInline
              controls
              onEnded={() => {
                if (!isLastPromo) setPromoIndex((i) => i + 1);
              }}
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
