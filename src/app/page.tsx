"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { NavBar } from "@/components/ui/NavBar";
import { GoldenDivider } from "@/components/ui/GoldenDivider";
import { ValeConcierge } from "@/components/ui/ValeConcierge";
import { ConciergeReveal } from "@/components/ui/ConciergeReveal";
import { HeroOverlay } from "@/components/parallax/HeroOverlay";
import { HeroBackground } from "@/components/parallax/HeroBackground";
import { ScrollStory } from "@/components/parallax/ScrollStory";
import { RoomTabs } from "@/components/room/RoomTabs";
import { VideoRevealSection } from "@/components/video/VideoRevealSection";
import { useHavenStore } from "@/lib/store";

const FOOTER_LINKS = {
  Shop: ["Atmos Ritual", "HVN Chamber", "HVN Living", "Standard Line"],
  Company: ["The Room", "Bespoke", "Contact", "Speak to Concierge"],
  Legal: ["Terms & Conditions", "Shipping", "Privacy"],
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Section boundaries for the stacked NavBar. Each boundary flips the active
// section forward as its element reaches the top of the viewport, and back to
// the previous one when scrolled above it again. The hero is section 0 by
// default (no trigger needed — the first boundary's leaveBack restores it).
const NAV_BOUNDARIES = [
  { id: "story", enter: 1, leaveBack: 0 },
  { id: "concierge", enter: 2, leaveBack: 1 },
  { id: "film-section", enter: 3, leaveBack: 2 },
];

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollToSection = useHavenStore((s) => s.setScrollToSection);
  const setActiveNavSection = useHavenStore((s) => s.setActiveNavSection);
  const scrollToSection = useHavenStore((s) => s.scrollToSection);
  const summonConcierge = useHavenStore((s) => s.summonConcierge);

  // "Speak to Concierge" (footer): glide the visitor to the showroom (S3), then —
  // once that scroll lands — Vale flies in from the left to greet them.
  const handleSpeakToConcierge = () => {
    scrollToSection?.("the-room", summonConcierge);
  };

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const rafId = requestAnimationFrame(raf);
    gsap.ticker.lagSmoothing(0);

    // Shared scroll-state flags. The custom snap must never fight a button-driven
    // (programmatic) scroll, or the user lands off-position (e.g. "Watch the Film").
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    let snapping = false;
    let programmaticScroll = false;

    // Nav clearance used when a section top-aligns under the fixed nav.
    const NAV_OFFSET = 80;
    // Sections whose content is a single vertically-centered card (S4 video):
    // these snap so the card sits centered in the viewport (matching the design),
    // instead of top-aligning under the nav — which would push the centered card
    // down and clip it.
    const CENTERED_IDS = new Set(["film-section"]);

    // The exact resting scroll position for a section — the single source of truth
    // shared by the buttons (programmatic scroll) and the settle-snap, so both
    // always land on the same spot.
    const targetYFor = (el: HTMLElement): number => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      if (CENTERED_IDS.has(el.id)) {
        return Math.max(0, top + rect.height / 2 - window.innerHeight / 2);
      }
      return Math.max(0, top - NAV_OFFSET);
    };

    setScrollToSection((id: string, onComplete?: () => void) => {
      const target = document.getElementById(id);
      if (!target) return;
      programmaticScroll = true;
      clearTimeout(settleTimer);
      lenis.scrollTo(targetYFor(target), {
        duration: 2.0,
        easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
        onComplete: () => {
          programmaticScroll = false;
          onComplete?.();
        },
      });
    });

    // Drive the stacked NavBar: each section takes over as it reaches the top,
    // and hands back to the previous one when scrolled above again.
    const navTriggers = NAV_BOUNDARIES.map(({ id, enter, leaveBack }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        // Activate as the section enters view (not only when it pins to the very top),
        // so the S3 nav row is present as the showroom arrives.
        start: "top 60%",
        onEnter: () => setActiveNavSection(enter),
        onLeaveBack: () => setActiveNavSection(leaveBack),
      });
    });
    // S3 arrival — Vale, the concierge, flies in from the left the first time the
    // showroom reaches view (no click needed). `once` keeps it a single greeting per
    // visit; the footer "Speak to Concierge" link can re-summon her afterwards.
    const roomEl = document.getElementById("the-room");
    const conciergeTrigger = roomEl
      ? ScrollTrigger.create({
          trigger: roomEl,
          start: "top 70%",
          once: true,
          onEnter: () => useHavenStore.getState().summonConcierge(),
        })
      : null;

    // Recompute positions after the pinned ScrollStory registers its own trigger.
    ScrollTrigger.refresh();

    // Snap the showroom (S3) and video (S4) into place once scrolling settles, using
    // the SAME resting position the nav buttons use (via targetYFor) so the spot matches
    // exactly (the "perfect position"): S3 top-aligns under the nav, S4 centers its card.
    // Only engages when already near one of them — the hero and pinned story scroll
    // freely, and this always resettles to the correct spot.
    const SNAP_IDS = ["the-room", "film-section"];
    const considerSnap = () => {
      if (snapping || programmaticScroll) return;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        let bestY: number | null = null;
        let bestDist = Infinity;
        for (const id of SNAP_IDS) {
          const el = document.getElementById(id);
          if (!el) continue;
          const targetY = targetYFor(el);
          const dist = Math.abs(targetY - y);
          if (dist < bestDist) {
            bestDist = dist;
            bestY = targetY;
          }
        }
        // Snap only when clearly near a section (within ~45% of the viewport), and not
        // already settled there.
        if (bestY !== null && bestDist > 2 && bestDist < vh * 0.45) {
          snapping = true;
          lenis.scrollTo(bestY, {
            duration: 0.8,
            onComplete: () => {
              snapping = false;
            },
          });
        }
      }, 140);
    };
    lenis.on("scroll", considerSnap);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(settleTimer);
      lenis.destroy();
      navTriggers.forEach((t) => t?.kill());
      conciergeTrigger?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [setScrollToSection, setActiveNavSection]);

  return (
    <main>
      <NavBar />
      <ValeConcierge />
      <ConciergeReveal />

      {/* Hero */}
      <section id="top" className="relative h-screen w-full overflow-hidden">
        <HeroBackground />
        <HeroOverlay />
      </section>

      <GoldenDivider />

      {/* Section 2: Scroll-pinned story */}
      <div id="story">
        <ScrollStory />
      </div>

      {/* Section 3: Interactive room tabs — the concierge / shopping destination.
          RoomTabs carries its own top + bottom dividers so they bound the section. */}
      <div id="concierge">
        <RoomTabs />
      </div>

      {/* Section 4: Video reveal (return is via the nav's "Return to Showroom") */}
      <VideoRevealSection />

      <GoldenDivider />

      {/* Section 5: Footer */}
      <footer className="border-t border-[#c9a96e]/10 pt-16 pb-10 px-8 lg:px-16 bg-[#0d0b09]">
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 pb-12">
          <div>
            <div className="font-display text-3xl tracking-[0.3em] text-[#c9a96e] mb-1">HVN</div>
            <p className="text-[#c9a96e] opacity-30 text-xs tracking-[0.5em] uppercase font-sans mb-4">
              Havenry
            </p>
            <p className="text-xs text-[#e8dcc8] opacity-40 font-sans tracking-wide max-w-xs">
              Curated great rooms for the discerning few.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-10">
            {Object.entries(FOOTER_LINKS).map(([column, links]) => (
              <div key={column} className="flex flex-col gap-3">
                <p className="text-[#c9a96e] text-xs tracking-[0.3em] uppercase font-sans opacity-60 mb-1">
                  {column}
                </p>
                {links.map((link) => {
                  const isConcierge = link === "Speak to Concierge";
                  return (
                    <a
                      key={link}
                      href="#"
                      onClick={
                        isConcierge
                          ? (e) => {
                              e.preventDefault();
                              handleSpeakToConcierge();
                            }
                          : undefined
                      }
                      className="text-xs text-[#e8dcc8] opacity-50 hover:opacity-90 hover:text-[#c9a96e] transition-all duration-300 font-sans tracking-wide"
                    >
                      {link}
                    </a>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-[#c9a96e]/10">
          <p className="text-xs text-[#c9a96e] opacity-30 font-sans">
            © {new Date().getFullYear()} HVN Havenry. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
