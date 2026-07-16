"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The Atmospheric Jurisdiction manifesto — delivered beat by beat over the brand
// background. Each beat's words gather from a soft blur + slight upward drift, hold long
// enough to read, then release upward as the next beat gathers. The closing beat is the
// philosophy itself, landing in gold.
interface Beat {
  text: string;
  final?: boolean;
}

const BEATS: Beat[] = [
  { text: "A Havenry is a destination built around the composition of private environments." },
  { text: "Here, furnishings, scent, light, surface, object, and atmosphere are considered together rather than separately." },
  { text: "The objective is not merely to fill a room with products, but to shape the atmosphere, character, and experience of the space itself." },
  { text: "A man should intentionally govern the environment he lives in, works in, rests in, and hosts from." },
  { text: "Atmospheric Jurisdiction is the philosophy that a space and its atmosphere should be intentionally governed.", final: true },
];

// Background brand splash (mark__hvn-havenry__splash_section02) is applied via the
// `.bg-asset-splash02` class (WebP with PNG fallback); a missing/not-yet-pulled file
// simply degrades to the ambient gradient rather than a broken image.

export function ScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Respect reduced-motion: keep the meaning (words still appear beat by beat) but
    // drop the smoke drift / blur / side-travel so it reads instantly and calmly.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${BEATS.length * 120 + 140}%`,
          pin: true,
          scrub: 1,
        },
      });

      // Background eases in, drifts in place, then fades out as the last
      // illusion before the threshold of the next section. Held below full so the
      // text carries the contrast (readability), not the image.
      if (bgRef.current) {
        tl.fromTo(
          bgRef.current,
          { opacity: 0, yPercent: -6, scale: 1.08 },
          { opacity: 0.72, yPercent: 6, scale: 1, ease: "none" },
          0
        );
      }

      BEATS.forEach((beat, i) => {
        const el = beatRefs.current[i];
        if (!el) return;
        const words = el.querySelectorAll<HTMLElement>("[data-word]");

        // Words condense out of the smoke: rising from just below, heavily blurred and
        // faintly scaled down, then resolving into place. Reduced-motion just fades them.
        tl.fromTo(
          words,
          reduce
            ? { opacity: 0 }
            : {
                opacity: 0,
                x: (idx: number) => (idx % 2 === 0 ? -20 : 20),
                y: 18,
                scale: 0.97,
                filter: "blur(10px)",
              },
          reduce
            ? { opacity: 1, duration: 0.6, stagger: 0.03 }
            : {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1,
                ease: "power2.out",
                stagger: 0.05,
              }
        );

        // Hold the assembled sentence long enough to read comfortably.
        tl.to({}, { duration: beat.final ? 1.4 : 1.0 });

        // Release — every beat but the last clears to make room for the next.
        if (!beat.final) {
          tl.to(el, {
            opacity: 0,
            y: -24,
            filter: "blur(6px)",
            duration: 0.6,
            ease: "power2.in",
          });
        }
      });

      // Fade the background away beneath the final statement.
      if (bgRef.current) {
        tl.to(bgRef.current, { opacity: 0, duration: 0.8, ease: "power1.in" }, ">-0.4");
      }

      if (continueRef.current) {
        tl.to(continueRef.current, { opacity: 1, duration: 0.6 }, "<");
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#0d0b09] flex items-center justify-center"
    >
      {/* Parallax brand background (fades before the next section) — WebP w/ PNG fallback */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center opacity-0 pointer-events-none bg-asset-splash02"
      />

      {/* Legibility scrims — a base wash, a center bloom that darkens right behind the
          words, and a feathered top/bottom so the background eases in and out cleanly. */}
      <div className="absolute inset-0 bg-[#0d0b09]/45 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60%_50%_at_50%_50%,rgba(13,11,9,0.55),transparent_75%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b09]/70 via-transparent to-[#0d0b09]/80 pointer-events-none" />

      <div className="relative w-full max-w-3xl px-8 text-center">
        {BEATS.map((beat, i) => (
          <div
            key={beat.text}
            ref={(el) => {
              beatRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <p
              className={`manifesto-line font-display leading-snug ${
                beat.final
                  ? "text-3xl lg:text-5xl tracking-wide text-[#c9a96e] font-normal"
                  : "text-2xl lg:text-4xl text-[#e8dcc8] font-light"
              }`}
            >
              {beat.text.split(" ").map((word, w) => (
                <span key={`${word}-${w}`} data-word className="inline-block mr-[0.28em] opacity-0">
                  {word}
                </span>
              ))}
            </p>
          </div>
        ))}
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
