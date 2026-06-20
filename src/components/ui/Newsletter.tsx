"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { newsletterContent } from "@/lib/content";

/**
 * "Join our newsletter" block shown beneath the product detail, above the
 * footer. Copy flies in from the bottom. Submit is a placeholder (no backend
 * wired yet) — it just acknowledges locally.
 */
export function Newsletter() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-fly-up]", {
        opacity: 0,
        y: 60,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section
      ref={rootRef}
      id="newsletter"
      className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-t border-[#c9a96e]/10 bg-[#0d0b09] px-8 py-24 lg:px-16"
    >
      <div className="w-full max-w-xl text-center">
        <p
          data-fly-up
          className="mb-4 font-sans text-xs uppercase tracking-[0.4em] text-[#c9a96e] opacity-70"
        >
          {newsletterContent.eyebrow}
        </p>
        <h2
          data-fly-up
          className="mb-5 font-display text-4xl font-light leading-[1.12] text-[#e8dcc8] lg:text-5xl"
        >
          {newsletterContent.title}
        </h2>
        <p
          data-fly-up
          className="mx-auto mb-10 max-w-md font-sans text-sm leading-relaxed text-[#e8dcc8] opacity-70"
        >
          {newsletterContent.body}
        </p>

        {submitted ? (
          <p
            data-fly-up
            className="font-display text-xl italic text-[#c9a96e]"
          >
            Thank you — you&apos;re on the list.
          </p>
        ) : (
          <form
            data-fly-up
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-md flex-col items-stretch gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={newsletterContent.placeholder}
              className="flex-1 border border-[#c9a96e]/30 bg-transparent px-5 py-3.5 font-sans text-sm text-[#e8dcc8] placeholder:text-[#e8dcc8]/40 transition-colors duration-300 focus:border-[#c9a96e]/70 focus:outline-none"
            />
            <button
              type="submit"
              className="border border-[#c9a96e] px-7 py-3.5 font-display text-base tracking-[0.2em] text-[#c9a96e] transition-all duration-500 hover:bg-[#c9a96e] hover:text-[#0d0b09]"
            >
              {newsletterContent.cta}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
