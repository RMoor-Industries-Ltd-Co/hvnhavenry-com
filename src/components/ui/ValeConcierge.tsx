"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useHavenStore } from "@/lib/store";

const MOMENT_COPY: Record<"add-to-cart" | "cart-checkout", { title: string; body: string; image: string }> = {
  "add-to-cart": {
    title: "Vale has noted your selection",
    body: "This piece has been set aside for you. Continue exploring, or proceed when ready.",
    image: "/assets/characters/vale/character__vale__add-to-cart.png",
  },
  "cart-checkout": {
    title: "Vale will see you through",
    body: "Your selections are ready for checkout whenever you are.",
    image: "/assets/characters/vale/character__vale__cart-checkout.png",
  },
};

const AUTO_DISMISS_MS = 5000;

export function ValeConcierge() {
  const valeMoment = useHavenStore((s) => s.valeMoment);
  const dismissValeMoment = useHavenStore((s) => s.dismissValeMoment);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!valeMoment) return;
    timeoutRef.current = setTimeout(dismissValeMoment, AUTO_DISMISS_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [valeMoment, dismissValeMoment]);

  const copy = valeMoment ? MOMENT_COPY[valeMoment] : null;

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 flex items-end gap-4 max-w-sm transition-all duration-500 ease-out ${
        copy ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {copy && (
        <>
          <div className="relative w-16 h-24 shrink-0 overflow-hidden">
            <Image
              src={copy.image}
              alt="Vale, the HVN Havenry concierge"
              fill
              className="object-cover object-top"
              sizes="64px"
            />
          </div>
          <div className="relative bg-[#0d0b09]/95 backdrop-blur-md border border-[#c9a96e]/30 px-5 py-4 flex-1">
            <button
              onClick={dismissValeMoment}
              className="absolute top-2 right-2 text-[#c9a96e] opacity-50 hover:opacity-100 transition-opacity text-xs cursor-pointer"
              aria-label="Dismiss"
            >
              ✕
            </button>
            <p className="font-display text-lg text-[#c9a96e] mb-1">{copy.title}</p>
            <p className="text-xs text-[#e8dcc8] opacity-70 font-sans leading-relaxed">{copy.body}</p>
          </div>
        </>
      )}
    </div>
  );
}
