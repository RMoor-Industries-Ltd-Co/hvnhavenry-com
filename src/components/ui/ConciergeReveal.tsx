"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useHavenStore } from "@/lib/store";
import { getProductsByCollection } from "@/lib/products";
import type { ValePromptKey } from "@/lib/vale";

// Vale — the HVN Havenry concierge. Summoned from the persistent lower-left launcher
// (present on every section, hidden only in the footer), he flies in from the left at
// half the viewport height with a golden aura, and hosts a dialogue box near his hand.
// He stays for a 15-second window (a countdown shows by his knee); touching him resets
// it, and at 0 he flies back out to the left.
//
// The dialogue copy + options change per section (S1/S2/S3/S4). The one button that
// talks to Vale ("Speak to Concierge", S3) sends only a fixed promptKey to /api/vale —
// no free-text input, preserving the public concierge's safety model (see AGENTS.md).
type ValeReply = { text: string; productLink?: string };
type MenuItem = { label: string; onClick: () => void };

const VISIBLE_SECONDS = 15;
const ACCOUNT_URL = "https://hvnhavenry.com/account";

export function ConciergeReveal() {
  const summoned = useHavenStore((s) => s.conciergeSummoned);
  const summon = useHavenStore((s) => s.summonConcierge);
  const dismiss = useHavenStore((s) => s.dismissConcierge);
  const inFooter = useHavenStore((s) => s.inFooter);
  const activeNavSection = useHavenStore((s) => s.activeNavSection);
  const scrollToSection = useHavenStore((s) => s.scrollToSection);
  const viewShowroom = useHavenStore((s) => s.viewShowroom);
  const openCart = useHavenStore((s) => s.openCart);
  const addRoomToCart = useHavenStore((s) => s.addRoomToCart);
  const activeCollection = useHavenStore((s) => s.activeCollection);

  const [reply, setReply] = useState<ValeReply | null>(null);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(VISIBLE_SECONDS);
  const deadlineRef = useRef(0);

  // Talk to Vale for a fixed prompt key (S3 only). No free-text ever reaches the model.
  function ask(key: ValePromptKey) {
    setLoading(true);
    setReply(null);
    fetch("/api/vale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ promptKey: key }),
    })
      .then((res) => res.json().then((data) => (res.ok ? data : { text: "Vale will be with you shortly." })))
      .catch(() => ({ text: "Vale will be with you shortly." }))
      .then(setReply)
      .finally(() => setLoading(false));
  }

  function acquireRoom() {
    addRoomToCart(getProductsByCollection(activeCollection).map((p) => p.id));
    openCart();
  }

  // Per-section copy + options. 0 = S1 (hero), 1 = S2 (story), 2 = S3 (showroom),
  // 3 = S4 (video).
  const SECTION: Record<number, { body: string; menu: MenuItem[] }> = {
    0: {
      body: "Welcome to the HVN Havenry. I am here to assist you through your visit. Please choose an option below.",
      menu: [
        { label: "View Showroom", onClick: viewShowroom },
        { label: "View Past Order", onClick: () => window.open(ACCOUNT_URL, "_blank", "noopener") },
      ],
    },
    1: {
      body: "Please continue to scroll to learn about the havenry.",
      menu: [{ label: "Learn More", onClick: () => scrollToSection?.("the-room") }],
    },
    2: {
      body: "Welcome to the HVN Havenry showroom.",
      menu: [
        { label: "Speak to Concierge", onClick: () => ask("speak_to_concierge") },
        { label: "View Cart", onClick: openCart },
        { label: "Acquire this room", onClick: acquireRoom },
      ],
    },
    3: {
      body: "To learn more about our offerings:",
      menu: [{ label: "Visit the Showroom", onClick: () => scrollToSection?.("the-room") }],
    },
  };
  const section = SECTION[activeNavSection] ?? SECTION[0];
  // Vale's replies only come from the S3 "Speak to Concierge" action; elsewhere show the
  // section's copy.
  const bodyText = loading ? "…" : activeNavSection === 2 && reply ? reply.text : section.body;

  const resetTimer = () => {
    deadlineRef.current = Date.now() + VISIBLE_SECONDS * 1000;
  };

  // Each summon runs the 15s window; when it elapses (untouched), he flies back out.
  useEffect(() => {
    if (!summoned) return;
    deadlineRef.current = Date.now() + VISIBLE_SECONDS * 1000;
    const iv = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setSeconds(remaining);
      if (remaining <= 0) {
        clearInterval(iv);
        dismiss();
      }
    }, 250);
    return () => clearInterval(iv);
  }, [summoned, dismiss]);

  return (
    <>
      {/* Persistent lower-left launcher — present on every section whenever Vale is off
          screen, hidden the moment he appears and while the footer is in view. */}
      {!summoned && !inFooter && (
        <button
          onClick={summon}
          className="fixed bottom-8 left-8 z-[55] bg-[#0d0b09]/95 backdrop-blur-md border border-[#c9a96e]/30 px-4 py-2 text-[10px] uppercase tracking-wider text-[#c9a96e] hover:bg-[#0d0b09] transition-colors cursor-pointer"
        >
          Speak to Concierge
        </button>
      )}

      <div
        aria-hidden={!summoned}
        onPointerDown={resetTimer}
        className={`fixed bottom-0 left-0 z-[60] transition-all duration-700 ease-out ${
          summoned ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative h-[50vh] w-[50vh]">
          <Image
            src="/assets/characters/vale/character__vale__concierge.png"
            alt="Vale, the HVN Havenry concierge, arriving to assist"
            fill
            priority
            sizes="50vh"
            className="object-contain object-bottom select-none pointer-events-none concierge-glow"
          />

          {/* Countdown — sits to the left of his knee, faint. */}
          <span className="absolute left-[20%] top-[76%] font-display text-2xl text-[#c9a96e] opacity-50 select-none pointer-events-none">
            {seconds}
          </span>

          {/* Dialogue box — copy only, near his outstretched hand. */}
          <div className="absolute left-[55%] top-[45%] w-72 max-w-[72vw] bg-[#0d0b09]/95 backdrop-blur-md border border-[#c9a96e]/30 px-5 py-4">
            <button
              onClick={dismiss}
              aria-label="Close concierge"
              className="absolute top-2 right-2 text-[#c9a96e] opacity-60 hover:opacity-100 transition-opacity text-[10px] uppercase tracking-wider cursor-pointer"
            >
              Close
            </button>

            <p className="font-display text-lg text-[#c9a96e] mb-2">Vale</p>
            <p className="text-xs text-[#e8dcc8] opacity-80 font-sans leading-relaxed min-h-[2.5rem]">
              {bodyText}
            </p>

            {activeNavSection === 2 && reply?.productLink && (
              <a
                href={reply.productLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-[10px] uppercase tracking-wider text-[#c9a96e] underline underline-offset-2"
              >
                Continue to checkout
              </a>
            )}

            <div className="mt-3 flex flex-col gap-1.5">
              {section.menu.map(({ label, onClick }) => (
                <button
                  key={label}
                  onClick={onClick}
                  disabled={loading}
                  className="text-left text-[11px] uppercase tracking-wider text-[#e8dcc8] opacity-70 hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-default disabled:opacity-30"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
