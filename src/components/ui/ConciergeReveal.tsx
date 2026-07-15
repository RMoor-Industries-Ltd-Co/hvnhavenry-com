"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useHavenStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import type { ValePromptKey } from "@/lib/vale";

// After "Speak to Concierge" (footer) or arriving in the showroom (S3), Vale — the HVN
// Havenry concierge — flies in from the left at half the viewport height, wrapped in a
// golden aura, and brings his dialogue box with him. He is the ONLY on-screen Vale; the
// old right-side portrait panel is retired.
//
// The dialogue box carries the copy only (no portrait inside it). Its buttons are the
// SAME fixed prompt keys enforced server-side in /api/vale — there is no free-text input
// here, preserving the public concierge's safety model (see AGENTS.md).
const SUGGESTED_PROMPTS: { key: ValePromptKey; label: string }[] = [
  { key: "speak_to_concierge", label: "Speak to Concierge" },
  { key: "view_cart", label: "View Cart" },
  { key: "acquire_this", label: "Acquire this..." },
];

type ValeReply = { text: string; productLink?: string };

export function ConciergeReveal() {
  const summoned = useHavenStore((s) => s.conciergeSummoned);
  const dismiss = useHavenStore((s) => s.dismissConcierge);
  const activeTabItem = useHavenStore((s) => s.activeTabItem);
  const activeProduct = activeTabItem ? PRODUCTS[activeTabItem] : null;

  const [reply, setReply] = useState<ValeReply | null>(null);
  const [loading, setLoading] = useState(false);
  const greetedRef = useRef(false);

  // Fetch Vale's reply for one of the fixed suggested prompts. `activeTabItem` is read
  // fresh from the store, so "Acquire this" always targets whatever's active.
  function ask(key: ValePromptKey) {
    setLoading(true);
    setReply(null);
    const body: { promptKey: ValePromptKey; productId?: string } = { promptKey: key };
    if (key === "acquire_this" && activeTabItem) body.productId = activeTabItem;
    fetch("/api/vale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json().then((data) => (res.ok ? data : { text: "Vale will be with you shortly." })))
      .catch(() => ({ text: "Vale will be with you shortly." }))
      .then(setReply)
      .finally(() => setLoading(false));
  }

  // Greet once, the first time he's summoned.
  useEffect(() => {
    if (summoned && !greetedRef.current) {
      greetedRef.current = true;
      ask("welcome");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summoned]);

  return (
    <div
      aria-hidden={!summoned}
      className={`fixed bottom-0 left-0 z-[60] flex items-end gap-6 transition-all duration-700 ease-out ${
        summoned ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Vale — half the viewport height, golden aura tracing his silhouette. */}
      <div className="relative h-[50vh] w-[50vh] shrink-0">
        <Image
          src="/assets/characters/vale/character__vale__concierge.png"
          alt="Vale, the HVN Havenry concierge, arriving to assist"
          fill
          priority
          sizes="50vh"
          className="object-contain object-bottom select-none pointer-events-none concierge-glow"
        />
      </div>

      {/* Dialogue box — copy only, at his side. */}
      <div className="relative mb-12 w-72 max-w-[80vw] bg-[#0d0b09]/95 backdrop-blur-md border border-[#c9a96e]/30 px-5 py-4">
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
          {SUGGESTED_PROMPTS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => ask(key)}
              disabled={loading}
              className="text-left text-[11px] uppercase tracking-wider text-[#e8dcc8] opacity-70 hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-default disabled:opacity-30"
            >
              {key === "acquire_this" && activeProduct ? `Acquire this — ${activeProduct.name}` : label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
