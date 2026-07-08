"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function HeroOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    gsap.from(overlayRef.current.querySelectorAll("[data-anim]"), {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.3,
    });
  }, []);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end pb-16 px-8 lg:px-16"
    >
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
