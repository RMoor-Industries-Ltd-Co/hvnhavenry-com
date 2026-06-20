"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { InfoSectionContent } from "@/lib/content";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface InfoSectionProps {
  section: InfoSectionContent;
  index: number;
}

/**
 * One of the five default editorial sections. Its text + link fly in from the
 * bottom as the section scrolls into view. Content is placeholder lorem today;
 * it gets hydrated from Notion later without touching this component.
 */
export function InfoSection({ section, index }: InfoSectionProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-fly-up]", {
        opacity: 0,
        y: 80,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id={section.id}
      className="relative flex min-h-[80vh] items-center overflow-hidden border-t border-[#c9a96e]/10 bg-[#0d0b09]"
    >
      <div
        className={`mx-auto flex w-full max-w-5xl px-8 py-24 lg:px-16 ${
          isEven ? "justify-start" : "justify-end"
        }`}
      >
        <div className={`max-w-xl ${isEven ? "text-left" : "text-right"}`}>
          <p
            data-fly-up
            className="mb-4 font-sans text-xs uppercase tracking-[0.4em] text-[#c9a96e] opacity-70"
          >
            {section.eyebrow}
          </p>
          <h2
            data-fly-up
            className="mb-6 font-display text-4xl font-light leading-[1.12] text-[#e8dcc8] lg:text-5xl"
          >
            {section.title}
          </h2>
          <p
            data-fly-up
            className="mb-8 font-sans text-sm leading-relaxed text-[#e8dcc8] opacity-70"
          >
            {section.body}
          </p>
          <button
            data-fly-up
            className={`group inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[0.3em] text-[#c9a96e] opacity-80 transition-opacity duration-300 hover:opacity-100 ${
              isEven ? "" : "flex-row-reverse"
            }`}
          >
            {section.linkLabel}
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </div>
      </div>

      {/* Section number */}
      <div
        className={`pointer-events-none absolute bottom-8 select-none font-display text-[8rem] leading-none text-[#c9a96e] opacity-[0.04] ${
          isEven ? "right-8" : "left-8"
        }`}
      >
        0{index + 1}
      </div>
    </section>
  );
}
