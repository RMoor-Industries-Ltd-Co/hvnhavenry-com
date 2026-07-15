"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useHavenStore } from "@/lib/store";

// After "Speak to Concierge" scrolls the visitor to the showroom (S3), Vale — the
// HVN Havenry concierge — flies in from the left of the screen to greet them. The
// arrival is a single transform/opacity transition (GPU-friendly); she rests at the
// lower-left, then eases back off-screen on dismiss or after a quiet auto-timeout.
const AUTO_DISMISS_MS = 9000;

export function ConciergeReveal() {
  const summoned = useHavenStore((s) => s.conciergeSummoned);
  const dismiss = useHavenStore((s) => s.dismissConcierge);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!summoned) return;
    timeoutRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [summoned, dismiss]);

  return (
    <div
      aria-hidden={!summoned}
      className={`fixed bottom-0 left-0 z-[60] flex items-end transition-all duration-700 ease-out ${
        summoned
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative h-[50vh] w-[50vh]">
        <Image
          src="/assets/characters/vale/character__vale__concierge.png"
          alt="Vale, the HVN Havenry concierge, arriving to assist"
          fill
          priority
          sizes="50vh"
          className="object-contain object-bottom select-none pointer-events-none"
        />
      </div>

      <button
        onClick={dismiss}
        aria-label="Dismiss concierge"
        className="mb-8 -ml-2 text-[#c9a96e] opacity-50 hover:opacity-100 transition-opacity text-sm cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}
