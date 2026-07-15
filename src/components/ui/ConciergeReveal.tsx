"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useHavenStore } from "@/lib/store";
import { getProductsByCollection } from "@/lib/products";
import type { ValePromptKey } from "@/lib/vale";

// After "Speak to Concierge" (footer) or arriving in the showroom (S3), Vale — the HVN
// Havenry concierge — flies in from the left at half the viewport height, wrapped in a
// golden aura, and brings his dialogue box with him. He is the ONLY on-screen Vale.
//
// The dialogue box sits near his outstretched hand (its top-left corner meets his hand,
// roughly mid-figure). It carries copy only — no portrait inside it. Its buttons are
// fixed actions; the one that talks to Vale ("Speak to Concierge") sends only the fixed
// promptKey to /api/vale — no free-text input, preserving the public concierge's safety
// model (see AGENTS.md).
type ValeReply = { text: string; productLink?: string };

export function ConciergeReveal() {
  const summoned = useHavenStore((s) => s.conciergeSummoned);
  const dismiss = useHavenStore((s) => s.dismissConcierge);
  const activeCollection = useHavenStore((s) => s.activeCollection);
  const addRoomToCart = useHavenStore((s) => s.addRoomToCart);
  const openCart = useHavenStore((s) => s.openCart);

  const [reply, setReply] = useState<ValeReply | null>(null);
  const [loading, setLoading] = useState(false);
  const greetedRef = useRef(false);

  // Talk to Vale for one of the fixed prompt keys (currently only the greeting and
  // "Speak to Concierge"). No free-text ever reaches the model.
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

  // "Acquire this room" — place every product offered on the active collection's page
  // into the cart, then open the cart so the visitor sees what Vale gathered.
  function acquireRoom() {
    addRoomToCart(getProductsByCollection(activeCollection).map((p) => p.id));
    openCart();
  }

  // Greet once, the first time he's summoned.
  useEffect(() => {
    if (summoned && !greetedRef.current) {
      greetedRef.current = true;
      ask("welcome");
    }
  }, [summoned]);

  const menu: { label: string; onClick: () => void }[] = [
    { label: "Speak to Concierge", onClick: () => ask("speak_to_concierge") },
    { label: "View Cart", onClick: openCart },
    { label: "Acquire this room", onClick: acquireRoom },
  ];

  return (
    <div
      aria-hidden={!summoned}
      className={`fixed bottom-0 left-0 z-[60] transition-all duration-700 ease-out ${
        summoned ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Vale — half the viewport height, golden aura tracing his silhouette. */}
      <div className="relative h-[50vh] w-[50vh]">
        <Image
          src="/assets/characters/vale/character__vale__concierge.png"
          alt="Vale, the HVN Havenry concierge, arriving to assist"
          fill
          priority
          sizes="50vh"
          className="object-contain object-bottom select-none pointer-events-none concierge-glow"
        />

        {/* Dialogue box — copy only, its top-left corner meeting his outstretched hand. */}
        <div className="absolute left-[46%] top-[47%] w-72 max-w-[72vw] bg-[#0d0b09]/95 backdrop-blur-md border border-[#c9a96e]/30 px-5 py-4">
          <button
            onClick={dismiss}
            aria-label="Dismiss concierge"
            className="absolute top-2 right-2 text-[#c9a96e] opacity-50 hover:opacity-100 transition-opacity text-xs cursor-pointer"
          >
            ✕
          </button>

          <p className="font-display text-lg text-[#c9a96e] mb-2">Vale</p>
          <p className="text-xs text-[#e8dcc8] opacity-80 font-sans leading-relaxed min-h-[2.5rem]">
            {loading ? "…" : reply?.text ?? "Welcome to the HVN Havenry showroom."}
          </p>

          {reply?.productLink && (
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
            {menu.map(({ label, onClick }) => (
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
  );
}
