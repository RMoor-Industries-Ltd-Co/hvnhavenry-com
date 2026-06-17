"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useHavenStore } from "@/lib/store";

export function HeroOverlay() {
  const { isRoomReady } = useHavenStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRoomReady || !overlayRef.current) return;
    gsap.from(overlayRef.current.querySelectorAll("[data-anim]"), {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.3,
    });
  }, [isRoomReady]);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end pb-16 px-8 lg:px-16"
    >
      {/* Bottom-left copy */}
      <div className="max-w-md">
        <p data-anim className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-sans mb-3 opacity-70">
          The Great Room Experience
        </p>
        <h1 data-anim className="font-display text-6xl lg:text-7xl font-light text-[#e8dcc8] leading-[1.05] mb-4">
          Rooms only<br />
          <span className="italic text-[#c9a96e]">one can dream of</span>
        </h1>
        <p data-anim className="text-sm text-[#e8dcc8] opacity-50 font-sans leading-relaxed max-w-sm">
          Explore the great room. Click any piece to discover its story.
        </p>
      </div>

      {/* Bottom-right scroll cue */}
      <div data-anim className="absolute bottom-16 right-8 lg:right-16 flex flex-col items-center gap-2">
        <span className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase font-sans opacity-50 rotate-90 origin-center mb-2">
          Scroll
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[#c9a96e] to-transparent opacity-30" />
      </div>
    </div>
  );
}
