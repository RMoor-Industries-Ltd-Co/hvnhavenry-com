"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StoryLine {
  text: string;
  from: "left" | "right";
}

const STORY_LINES: StoryLine[] = [
  { text: "Every room tells a story.", from: "left" },
  { text: "Every object, a chapter.", from: "right" },
  { text: "Every ritual, a return to yourself.", from: "left" },
];

const FINAL_LINE = "This is HVN Havenry.";

export function ScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${STORY_LINES.length * 100 + 120}%`,
          pin: true,
          scrub: 1,
        },
      });

      STORY_LINES.forEach((line, i) => {
        const el = lineRefs.current[i];
        if (!el) return;
        const offset = line.from === "left" ? -60 : 60;

        tl.fromTo(
          el,
          { opacity: 0, xPercent: offset },
          { opacity: 1, xPercent: 0, duration: 1, ease: "power2.out" }
        ).to(
          el,
          { opacity: 0, xPercent: -offset, duration: 1, ease: "power2.in" },
          "+=0.4"
        );
      });

      if (finalRef.current) {
        tl.fromTo(
          finalRef.current,
          { opacity: 0, yPercent: -100 },
          { opacity: 1, yPercent: 0, duration: 1.2, ease: "power3.out" }
        );
      }

      if (continueRef.current) {
        tl.to(continueRef.current, { opacity: 1, duration: 0.8 }, "+=0.3");
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#0d0b09] flex items-center justify-center"
    >
      {/* Ambient vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b09] via-transparent to-[#0d0b09] opacity-70 pointer-events-none" />

      <div className="relative w-full max-w-4xl px-8 text-center">
        {STORY_LINES.map((line, i) => (
          <div
            key={line.text}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center opacity-0"
          >
            <p className="font-display text-4xl lg:text-6xl font-light italic text-[#e8dcc8] leading-snug">
              {line.text}
            </p>
          </div>
        ))}

        <div
          ref={finalRef}
          className="absolute inset-0 flex items-center justify-center opacity-0"
        >
          <h2 className="font-display text-5xl lg:text-7xl font-light tracking-wide text-[#c9a96e]">
            {FINAL_LINE}
          </h2>
        </div>
      </div>

      <div
        ref={continueRef}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-sans opacity-70">
          Continue scrolling
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[#c9a96e] to-transparent opacity-40" />
      </div>
    </section>
  );
}
