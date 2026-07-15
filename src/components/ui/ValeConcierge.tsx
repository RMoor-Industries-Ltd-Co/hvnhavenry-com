"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useHavenStore } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";
import type { ValePromptKey } from "@/lib/vale";

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

// The ONLY things a visitor can ever ask Vale for -- no free-form input anywhere in this
// component. See src/app/api/vale/route.ts for the matching server-side enforcement.
const SUGGESTED_PROMPTS: { key: ValePromptKey; label: string }[] = [
  { key: "speak_to_concierge", label: "Speak to Concierge" },
  { key: "view_cart", label: "View Cart" },
  { key: "acquire_this", label: "Acquire this..." },
];

type ValeReply = { text: string; productLink?: string };

function ConciergePanel({
  onClose,
  reply,
  loading,
  ask,
}: {
  onClose: () => void;
  reply: ValeReply | null;
  loading: boolean;
  ask: (key: ValePromptKey) => void;
}) {
  const activeTabItem = useHavenStore((s) => s.activeTabItem);
  const activeProduct = activeTabItem ? PRODUCTS[activeTabItem] : null;

  return (
    <div className="relative flex items-end gap-4 bg-[#0d0b09]/95 backdrop-blur-md border border-[#c9a96e]/30 px-5 py-4">
      <div className="relative w-72 shrink-0">
        <button
          onClick={onClose}
          className="absolute -top-1 -right-1 z-10 text-[#c9a96e] opacity-50 hover:opacity-100 transition-opacity text-xs cursor-pointer"
          aria-label="Close"
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
      {/* Right-side portrait -- at least 75% of the viewport height, per spec. */}
      <div className="relative h-[75vh] w-[min(32vw,320px)] shrink-0 overflow-hidden">
        <Image
          src="/assets/characters/vale/character__vale__concierge.png"
          alt="Vale, the HVN Havenry concierge"
          fill
          className="object-cover object-top"
          sizes="320px"
          priority
        />
      </div>
    </div>
  );
}

export function ValeConcierge() {
  const valeMoment = useHavenStore((s) => s.valeMoment);
  const dismissValeMoment = useHavenStore((s) => s.dismissValeMoment);
  const activeTabItem = useHavenStore((s) => s.activeTabItem);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [reply, setReply] = useState<ValeReply | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!valeMoment) return;
    timeoutRef.current = setTimeout(dismissValeMoment, AUTO_DISMISS_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [valeMoment, dismissValeMoment]);

  // A real event handler (button click), never an effect -- fetches Vale's reply for
  // one of the fixed suggested prompts. `activeTabItem` is read fresh from the store at
  // call time via the hook above, so "Acquire this" always targets whatever's active.
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

  const copy = valeMoment ? MOMENT_COPY[valeMoment] : null;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3">
      {panelOpen && (
        <ConciergePanel
          onClose={() => setPanelOpen(false)}
          reply={reply}
          loading={loading}
          ask={ask}
        />
      )}

      {!panelOpen && (
        <button
          onClick={() => {
            setPanelOpen(true);
            ask("welcome");
          }}
          className="flex items-center gap-2 bg-[#0d0b09]/95 backdrop-blur-md border border-[#c9a96e]/30 px-4 py-2 text-[10px] uppercase tracking-wider text-[#c9a96e] hover:bg-[#0d0b09] transition-colors cursor-pointer"
          aria-label="Speak to Concierge"
        >
          Speak to Concierge
        </button>
      )}

      <div
        className={`flex items-end gap-4 max-w-sm transition-all duration-500 ease-out ${
          copy && !panelOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none absolute"
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
    </div>
  );
}
