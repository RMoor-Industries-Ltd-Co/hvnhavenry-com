"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { navLinks, type NavLinkContent } from "@/lib/content";

export function NavBar() {
  const [active, setActive] = useState<NavLinkContent | null>(null);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-8 py-5">
        {/* Logo */}
        <button
          onClick={() => setActive(null)}
          className="font-display text-2xl tracking-[0.3em] text-[#c9a96e]"
        >
          HVN
        </button>

        {/* Nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item)}
              className={`font-sans text-xs uppercase tracking-[0.25em] text-[#e8dcc8] transition-opacity duration-300 hover:opacity-100 ${
                active?.id === item.id ? "opacity-100" : "opacity-60"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button className="cursor-pointer font-sans text-xs uppercase tracking-[0.2em] text-[#c9a96e] opacity-70 transition-opacity duration-300 hover:opacity-100">
          Book a Consultation
        </button>
      </nav>

      <NavPanel link={active} onClose={() => setActive(null)} />
    </>
  );
}

/**
 * Full-screen overlay shown when a top-nav link is selected. Its copy flies in
 * from the right. This stands in for the dedicated page flow each nav link gets
 * in a later pass — swap the lorem body for routed pages then.
 */
function NavPanel({
  link,
  onClose,
}: {
  link: NavLinkContent | null;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!link || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );
      gsap.from("[data-fly-right]", {
        opacity: 0,
        x: 140,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });
    }, rootRef);
    return () => ctx.revert();
  }, [link]);

  // Close on Escape.
  useEffect(() => {
    if (!link) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [link, onClose]);

  if (!link) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-30 flex items-center bg-[#0d0b09]/95 backdrop-blur-sm"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-8 top-6 font-sans text-2xl text-[#c9a96e] opacity-70 transition-opacity duration-300 hover:opacity-100 lg:right-16"
      >
        ✕
      </button>

      <div className="mx-auto flex w-full max-w-5xl justify-end px-8 lg:px-16">
        <div className="max-w-xl text-right">
          <p
            data-fly-right
            className="mb-4 font-sans text-xs uppercase tracking-[0.4em] text-[#c9a96e] opacity-70"
          >
            HVN Havenry
          </p>
          <h2
            data-fly-right
            className="mb-6 font-display text-5xl font-light leading-[1.1] text-[#e8dcc8] lg:text-7xl"
          >
            {link.title}
          </h2>
          <p
            data-fly-right
            className="ml-auto max-w-md font-sans text-sm leading-relaxed text-[#e8dcc8] opacity-70"
          >
            {link.body}
          </p>
        </div>
      </div>
    </div>
  );
}
