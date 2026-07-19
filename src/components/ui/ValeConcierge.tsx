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

// Vale withdraws after ten seconds without interaction.
const AUTO_DISMISS_MS = 10000;

// The ONLY things a visitor can ever ask Vale for — fixed prompt keys, no free-form
// input anywhere (client or server). See src/lib/vale.ts + src/app/api/vale/route.ts.
const WELCOME_OPTIONS: { key: ValePromptKey; label: string }[] = [
  { key: "view_cart", label: "View cart items" },
  { key: "store_info", label: "Store information" },
  { key: "product_details", label: "Product details" },
];

type ValeReply = { text: string; productLink?: string };

/**
 * Vale, the HVN Havenry concierge. He only ever flies in from the LEFT edge,
 * standing at 50% of the viewport height, his dialogue presented as a
 * rectangular speech caption immediately to his right (both on the left of the
 * screen — never the right). Summoned by the S3 arrival / footer "Speak to
 * Concierge", he greets with suggested options and withdraws after 10s of no
 * interaction. Buying a piece surfaces a brief left-hand confirmation.
 */
export function ValeConcierge() {
  const summoned = useHavenStore((s) => s.conciergeSummoned);
  const dismissConcierge = useHavenStore((s) => s.dismissConcierge);
  const valeMoment = useHavenStore((s) => s.valeMoment);
  const dismissValeMoment = useHavenStore((s) => s.dismissValeMoment);
  const activeTabItem = useHavenStore((s) => s.activeTabItem);
  const activeProduct = activeTabItem ? PRODUCTS[activeTabItem] : null;

  const [reply, setReply] = useState<ValeReply | null>(null);
  const [loading, setLoading] = useState(false);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const momentRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restart the 10s idle timer on summon and on any interaction.
  const armIdle = () => {
    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => dismissConcierge(), AUTO_DISMISS_MS);
  };

  // A real event handler (never an effect) — fetches Vale's reply for one of the
  // fixed suggested prompts. Only "product_details" carries the active product.
  const ask = (key: ValePromptKey) => {
    armIdle();
    setLoading(true);
    setReply(null);
    const body: { promptKey: ValePromptKey; productId?: string } = { promptKey: key };
    if (key === "product_details" && activeTabItem) body.productId = activeTabItem;
    fetch("/api/vale", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json().then((data) => (res.ok ? data : { text: "Vale will be with you shortly." })))
      .catch(() => ({ text: "Vale will be with you shortly." }))
      .then(setReply)
      .finally(() => setLoading(false));
  };

  // Greet when summoned; the cleanup clears the idle timer when he withdraws.
  // (ask("welcome") resets `reply` on the next summon, so no clear is needed here.)
  useEffect(() => {
    if (!summoned) return;
    // Defer the greeting out of the synchronous effect body (it triggers state).
    const greet = setTimeout(() => ask("welcome"), 0);
    armIdle();
    return () => {
      clearTimeout(greet);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summoned]);

  // Brief cart confirmations also auto-dismiss after the idle window.
  useEffect(() => {
    if (!valeMoment) return;
    momentRef.current = setTimeout(() => dismissValeMoment(), AUTO_DISMISS_MS);
    return () => {
      if (momentRef.current) clearTimeout(momentRef.current);
    };
  }, [valeMoment, dismissValeMoment]);

  const moment = valeMoment ? MOMENT_COPY[valeMoment] : null;

  return (
    <>
      {/* Concierge greeting — flies in from the LEFT, standing at 50% viewport height */}
      <div
        onClick={armIdle}
        aria-hidden={!summoned}
        className={`fixed bottom-0 left-0 z-[60] flex items-end transition-all duration-700 ease-out ${
          summoned ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative h-[50vh] w-[33vh] shrink-0">
          <Image
            src="/assets/characters/vale/character__vale__concierge.png"
            alt="Vale, the HVN Havenry concierge"
            fill
            priority
            sizes="33vh"
            className="pointer-events-none select-none object-contain object-bottom"
          />
        </div>

        {/* His dialogue — a rectangular caption to his right, on the left of the screen */}
        <div className="relative mb-[10vh] w-72 max-w-[80vw] bg-[#0d0b09]/95 px-5 py-4 backdrop-blur-md border border-[#c9a96e]/30">
          <span className="absolute -left-2 top-6 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-[#c9a96e]/30" />
          <button
            onClick={dismissConcierge}
            className="absolute right-2 top-2 cursor-pointer text-xs text-[#c9a96e] opacity-50 transition-opacity hover:opacity-100"
            aria-label="Dismiss Vale"
          >
            ✕
          </button>
          <p className="mb-2 font-display text-lg text-[#c9a96e]">Vale</p>
          <p className="mb-3 min-h-[2.5rem] font-sans text-xs leading-relaxed text-[#e8dcc8] opacity-80">
            {loading ? "…" : reply?.text ?? "Welcome to the HVN Havenry showroom."}
          </p>
          {reply?.productLink && (
            <a
              href={reply.productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 inline-block text-[10px] uppercase tracking-wider text-[#c9a96e] underline underline-offset-2"
            >
              Continue to checkout
            </a>
          )}
          <div className="flex flex-col gap-1.5">
            {WELCOME_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => ask(key)}
                disabled={loading}
                className="border border-[#c9a96e]/30 px-3 py-2 text-left font-sans text-[11px] uppercase tracking-wider text-[#e8dcc8] opacity-80 transition-all hover:border-[#c9a96e] hover:bg-[#c9a96e] hover:text-[#0d0b09] hover:opacity-100 disabled:cursor-default disabled:opacity-30"
              >
                {key === "product_details" && activeProduct ? `Product details — ${activeProduct.name}` : label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cart confirmation — a brief note, also from the LEFT */}
      <div
        className={`fixed bottom-8 left-8 z-50 flex max-w-sm items-end gap-4 transition-all duration-500 ease-out ${
          moment ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0 pointer-events-none"
        }`}
      >
        {moment && (
          <>
            <div className="relative h-24 w-16 shrink-0 overflow-hidden">
              <Image
                src={moment.image}
                alt="Vale, the HVN Havenry concierge"
                fill
                className="object-cover object-top"
                sizes="64px"
              />
            </div>
            <div className="relative flex-1 bg-[#0d0b09]/95 px-5 py-4 backdrop-blur-md border border-[#c9a96e]/30">
              <button
                onClick={dismissValeMoment}
                className="absolute right-2 top-2 cursor-pointer text-xs text-[#c9a96e] opacity-50 transition-opacity hover:opacity-100"
                aria-label="Dismiss"
              >
                ✕
              </button>
              <p className="mb-1 font-display text-lg text-[#c9a96e]">{moment.title}</p>
              <p className="font-sans text-xs leading-relaxed text-[#e8dcc8] opacity-70">{moment.body}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
