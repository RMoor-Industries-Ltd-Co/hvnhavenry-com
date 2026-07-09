"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Snap from "lenis/snap";
import { NavBar } from "@/components/ui/NavBar";
import { ValeConcierge } from "@/components/ui/ValeConcierge";
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
];

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollToSection = useHavenStore((s) => s.setScrollToSection);
  const setActiveNavSection = useHavenStore((s) => s.setActiveNavSection);

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

    setScrollToSection((id: string) => {
      const target = document.getElementById(id);
      if (!target) return;
      lenis.scrollTo(target, {
        offset: -80,
        duration: 2.0,
        easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
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
    // Recompute positions after the pinned ScrollStory registers its own trigger.
    ScrollTrigger.refresh();

    // Real snapping (CSS scroll-snap doesn't work under Lenis). Snap only to the
    // showroom (S3) and video (S4) so users settle on them; hero + pinned story are
    // left free. Registered after refresh so element offsets are correct.
    const snap = new Snap(lenis, { type: "proximity", lerp: 0.1 });
    ["the-room", "film-section"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) snap.addElement(el, { align: "start" });
    });

    return () => {
      cancelAnimationFrame(rafId);
      snap.destroy();
      lenis.destroy();
      navTriggers.forEach((t) => t?.kill());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [setScrollToSection, setActiveNavSection]);

  return (
    <main>
      <NavBar />
      <ValeConcierge />

      {/* Hero */}
      <section id="top" className="relative h-screen w-full overflow-hidden">
        <HeroBackground />
        <HeroOverlay />
      </section>

      {/* Section 2: Scroll-pinned story */}
      <div id="story">
        <ScrollStory />
      </div>

      {/* Section 3: Interactive room tabs — the concierge / shopping destination */}
      <div id="concierge">
        <RoomTabs />
      </div>

      {/* Golden section divider — marks the seam from the showroom (S3) into the
          video (S4): a fading gold line with a small diamond at center. */}
      <div className="w-full bg-[#0d0b09] py-14 flex items-center justify-center">
        <div className="flex items-center gap-4 w-full max-w-xl px-8">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a96e]/60" />
          <span className="w-2 h-2 rotate-45 border border-[#c9a96e]/70 bg-[#c9a96e]/20" />
          <span className="h-px flex-1 bg-gradient-to-r from-[#c9a96e]/60 to-transparent" />
        </div>
      </div>

      {/* Section 4: Collapsible video reveal */}
      <VideoRevealSection />

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
                {links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-xs text-[#e8dcc8] opacity-50 hover:opacity-90 hover:text-[#c9a96e] transition-all duration-300 font-sans tracking-wide"
                  >
                    {link}
                  </a>
                ))}
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
