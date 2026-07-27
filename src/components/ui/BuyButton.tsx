"use client";

import { useHavenStore } from "@/lib/store";
import { acquireDeepLink } from "@/lib/checkout";

interface BuyButtonProps {
  /** Retained for compatibility; the acquire flow now hands off to the shop deep link. */
  url?: string;
  label?: string;
}

export function BuyButton({ label = "Acquire This Piece" }: BuyButtonProps) {
  const triggerValeMoment = useHavenStore((s) => s.triggerValeMoment);

  // "Acquire" hands the visitor off to the shop (shophvn.com) as though entering the
  // Shopify checkout experience — a fresh order id per click.
  const acquire = () => {
    triggerValeMoment("add-to-cart");
    window.location.assign(acquireDeepLink());
  };

  return (
    <button
      onClick={acquire}
      className="group inline-flex items-center gap-3 border border-[#c9a96e] px-8 py-4 text-[#c9a96e] font-display text-lg tracking-[0.2em] hover:bg-[#c9a96e] hover:text-[#0d0b09] transition-all duration-500 cursor-pointer"
    >
      <span>{label}</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </button>
  );
}
