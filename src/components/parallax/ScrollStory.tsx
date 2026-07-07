"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The Atmospheric Jurisdiction manifesto — delivered beat by beat. Each beat
// assembles from individual words that drift in from alternating sides, settle
// together, hold, then release as the next beat gathers. The closing beat is
// the philosophy itself, and lands in gold as the section's final statement.
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

// Background brand splash — pulled from Drive via the asset pipeline
// (mark__hvn-havenry__splash_section02). Rendered as a CSS background so a
// missing/not-yet-pulled file degrades to the ambient gradient rather than a broken img.
const BG_SRC = "/assets/marks/mark__hvn-havenry__splash_section02.png";

export function ScrollStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

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
      // illusion before the threshold of the next section.
      if (bgRef.current) {
        tl.fromTo(
          bgRef.current,
          { opacity: 0, yPercent: -6, scale: 1.08 },
          { opacity: 0.4, yPercent: 6, scale: 1, ease: "none" },
          0
        );
      }

      BEATS.forEach((beat, i) => {
        const el = beatRefs.current[i];
        if (!el) return;
        const words = el.querySelectorAll<HTMLElement>("[data-word]");

        // Words gather from alternating sides with a soft focus-in.
        tl.fromTo(
          words,
          {
            opacity: 0,
            x: (idx: number) => (idx % 2 === 0 ? -50 : 50),
            y: 12,
            filter: "blur(8px)",
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power2.out",
            stagger: 0.06,
          }
        );

        // Hold the assembled sentence so it can be read.
        tl.to({}, { duration: beat.final ? 0.9 : 0.6 });

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
      {/* Parallax brand background (fades before the next section) */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center opacity-0 pointer-events-none"
        style={{ backgroundImage: `url(${BG_SRC})` }}
      />

      {/* Ambient vignette — always present, so the section reads even with no image */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b09] via-[#0d0b09]/40 to-[#0d0b09] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(201,169,110,0.06),_transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-4xl px-8 text-center">
        {BEATS.map((beat, i) => (
          <div
            key={beat.text}
            ref={(el) => {
              beatRefs.current[i] = el;
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <p
              className={`font-display font-light leading-snug ${
                beat.final
                  ? "text-3xl lg:text-5xl tracking-wide text-[#c9a96e]"
                  : "text-2xl lg:text-4xl italic text-[#e8dcc8]"
              }`}
            >
              {beat.text.split(" ").map((word, w) => (
                <span key={`${word}-${w}`} data-word className="inline-block mr-[0.28em]">
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
