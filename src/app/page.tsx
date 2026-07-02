"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { NavBar } from "@/components/ui/NavBar";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { HeroOverlay } from "@/components/parallax/HeroOverlay";
import { ScrollStory } from "@/components/parallax/ScrollStory";
import { RoomTabs } from "@/components/room/RoomTabs";
import { VideoRevealSection } from "@/components/video/VideoRevealSection";
import { useHavenStore } from "@/lib/store";
import { PRODUCTS, ProductId } from "@/lib/products";

// Load the 3D scene client-side only (no SSR)
const RoomScene = dynamic(
  () => import("@/components/3d/RoomScene").then((m) => m.RoomScene),
  { ssr: false }
);

const FOOTER_LINKS = {
  Shop: ["Atmos Ritual", "HVN Chamber", "HVN Living", "Standard Line"],
  Company: ["The Room", "Bespoke", "Contact", "Book a Consultation"],
  Legal: ["Terms & Conditions", "Shipping", "Privacy"],
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);
  const setScrollToSection = useHavenStore((s) => s.setScrollToSection);
  const setActiveCollection = useHavenStore((s) => s.setActiveCollection);
  const setActiveTabItem = useHavenStore((s) => s.setActiveTabItem);

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

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [setScrollToSection]);

  const handleHotspotSelect = (id: string) => {
    const product = PRODUCTS[id as ProductId];
    if (!product) return;
    setActiveCollection(product.collection);
    setActiveTabItem(product.id);

    const target = document.getElementById("the-room");
    if (!target || !lenisRef.current) return;
    lenisRef.current.scrollTo(target, {
      offset: -80,
      duration: 2.0,
      easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    });
  };

  return (
    <main>
      <LoadingScreen />
      <NavBar />

      {/* Hero: Full-screen 3D room */}
      <section className="relative h-screen w-full overflow-hidden">
        <RoomScene onHotspotSelect={handleHotspotSelect} />
        <HeroOverlay />
      </section>

      {/* Section 2: Scroll-pinned story */}
      <ScrollStory />

      {/* Section 3: Interactive room tabs */}
      <RoomTabs />

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
