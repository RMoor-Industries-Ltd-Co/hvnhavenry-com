"use client";

import { useHavenStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";

export function VideoRevealSection() {
  const isVideoOpen = useHavenStore((s) => s.isVideoOpen);
  const activeVideoProduct = useHavenStore((s) => s.activeVideoProduct);
  const closeVideo = useHavenStore((s) => s.closeVideo);
  const product = activeVideoProduct ? PRODUCTS[activeVideoProduct] : null;

  return (
    <section
      id="film-section"
      className="relative w-full overflow-hidden bg-[#0d0b09] transition-[max-height,opacity] duration-700 ease-out"
      style={{
        maxHeight: isVideoOpen ? "1400px" : "0px",
        opacity: isVideoOpen ? 1 : 0,
      }}
    >
      {product && (
        <div className="relative h-screen w-full flex items-center justify-center px-8">
          <button
            onClick={closeVideo}
            className="absolute top-8 right-8 z-10 text-[#c9a96e] opacity-70 hover:opacity-100 transition-opacity text-xs tracking-[0.3em] uppercase font-sans cursor-pointer"
          >
            Close
          </button>

          <div className="relative w-full max-w-5xl aspect-video border border-[#c9a96e]/20 bg-[#151210] flex items-center justify-center overflow-hidden">
            {/* Placeholder video frame — swap for a real <video src> or embed URL */}
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
          </div>
        </div>
      )}
    </section>
  );
}
