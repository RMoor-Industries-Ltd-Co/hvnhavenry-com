"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { NavBar } from "@/components/ui/NavBar";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { HeroOverlay } from "@/components/parallax/HeroOverlay";
import { HeroRoom } from "@/components/parallax/HeroRoom";
import { ProductSection } from "@/components/parallax/ProductSection";
import { PRODUCTS, PRODUCT_ORDER } from "@/lib/products";

// Load the 3D scene client-side only (no SSR)
const RoomScene = dynamic(
  () => import("@/components/3d/RoomScene").then((m) => m.RoomScene),
  { ssr: false }
);

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);
  // Photographic hero by default; the live 3D room is opt-in (kept as a
  // richer, heavier fallback for capable devices / curious visitors).
  const [heroMode, setHeroMode] = useState<"photo" | "live">("photo");

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

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleHotspotSelect = (id: string) => {
    const target = document.getElementById(id);
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

      {/* Hero: photographic plate by default, live 3D room on demand */}
      <section className="relative h-screen w-full overflow-hidden">
        {heroMode === "photo" ? (
          <HeroRoom
            onHotspotSelect={handleHotspotSelect}
            onEnterLiveRoom={() => setHeroMode("live")}
          />
        ) : (
          <>
            <RoomScene onHotspotSelect={handleHotspotSelect} />
            <HeroOverlay />
            <button
              onClick={() => setHeroMode("photo")}
              className="absolute bottom-16 right-8 z-30 flex items-center gap-2 border border-[#c9a96e]/30 bg-[#0d0b09]/40 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.3em] text-[#c9a96e] opacity-70 backdrop-blur-sm transition-all duration-300 hover:border-[#c9a96e]/70 hover:opacity-100 lg:right-16"
            >
              <span aria-hidden className="text-sm leading-none">↩</span>
              Back to photo
            </button>
          </>
        )}
      </section>

      {/* Transition band */}
      <div className="relative h-24 bg-[#0d0b09] flex items-center justify-center">
        <p className="text-[#c9a96e] opacity-30 text-xs tracking-[0.5em] uppercase font-sans">
          The Collection
        </p>
      </div>

      {/* Parallax product sections */}
      <section>
        {PRODUCT_ORDER.map((id, index) => (
          <ProductSection key={id} product={PRODUCTS[id]} index={index} />
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#c9a96e]/10 py-16 px-8 lg:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-[#0d0b09]">
        <div>
          <div className="font-display text-3xl tracking-[0.3em] text-[#c9a96e] mb-1">HVN</div>
          <p className="text-[#c9a96e] opacity-30 text-xs tracking-[0.5em] uppercase font-sans">Havenry</p>
        </div>
        <div className="flex flex-col gap-2 text-right">
          <p className="text-xs text-[#e8dcc8] opacity-40 font-sans tracking-wide">
            Curated great rooms for the discerning few.
          </p>
          <p className="text-xs text-[#c9a96e] opacity-30 font-sans">
            © {new Date().getFullYear()} HVN Havenry. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
