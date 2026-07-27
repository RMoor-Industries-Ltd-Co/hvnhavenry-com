"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useHavenStore } from "@/lib/store";

export function NavBar() {
  const cart = useHavenStore((state) => state.cart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const itemCount = mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5 mix-blend-normal">
      {/* Logo */}
      <Link href="/" className="font-display text-2xl tracking-[0.3em] text-[#c9a96e]">
        HVN
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8">
        {["The Room", "Collections", "Bespoke", "Contact"].map((item) => (
          <button
            key={item}
            className="text-xs tracking-[0.25em] uppercase text-[#e8dcc8] opacity-60 hover:opacity-100 transition-opacity duration-300 font-sans"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-6">
        {/* CTA */}
        <div className="hidden sm:block text-xs tracking-[0.2em] uppercase text-[#c9a96e] opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer font-sans">
          Book a Consultation
        </div>

        {/* Cart */}
        <Link href="/cart" className="relative flex items-center text-[#c9a96e] opacity-80 hover:opacity-100 transition-opacity duration-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 8V6a6 6 0 1 1 12 0v2M4 8h16l-1.2 12.2A2 2 0 0 1 16.8 22H7.2a2 2 0 0 1-2-1.8L4 8Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#c9a96e] text-[#0d0b09] text-[10px] font-sans w-4 h-4 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
