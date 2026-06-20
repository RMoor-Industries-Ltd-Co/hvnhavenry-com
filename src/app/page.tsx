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
import { InfoSection } from "@/components/parallax/InfoSection";
import { ProductDetail } from "@/components/product/ProductDetail";
import { Newsletter } from "@/components/ui/Newsletter";
import { infoSections } from "@/lib/content";
import { PRODUCTS } from "@/lib/products";
import { useHavenStore } from "@/lib/store";

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

  const selectedHotspot = useHavenStore((s) => s.selectedHotspot);
  const setSelectedHotspot = useHavenStore((s) => s.setSelectedHotspot);
  const selectedProduct = selectedHotspot ? PRODUCTS[selectedHotspot] : null;

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

  // When a piece is selected the lower area swaps to the product view; glide
  // down to it. ScrollTrigger needs a refresh because the section set changed.
  useEffect(() => {
    if (!selectedHotspot || !lenisRef.current) return;
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const target = document.getElementById("product-detail");
      if (target && lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: -60, duration: 1.8 });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [selectedHotspot]);

  const handleBack = () => {
    setSelectedHotspot(null);
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      lenisRef.current?.scrollTo(0, { duration: 1.4 });
    });
  };

  // The room hotspots set `selectedHotspot` in the store directly; this is just
  // the prop both hero variants expect.
  const handleHotspotSelect = () => {};

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

      {selectedProduct ? (
        // A piece is selected: show only its details + the newsletter.
        <>
          <ProductDetail product={selectedProduct} onBack={handleBack} />
          <Newsletter />
        </>
      ) : (
        // Default: the five editorial sections.
        <>
          <div className="relative flex h-24 items-center justify-center bg-[#0d0b09]">
            <p className="font-sans text-xs uppercase tracking-[0.5em] text-[#c9a96e] opacity-30">
              The Havenry
            </p>
          </div>
          <section>
            {infoSections.map((section, index) => (
              <InfoSection key={section.id} section={section} index={index} />
            ))}
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="flex flex-col items-start justify-between gap-8 border-t border-[#c9a96e]/10 bg-[#0d0b09] px-8 py-16 md:flex-row md:items-center lg:px-16">
        <div>
          <div className="mb-1 font-display text-3xl tracking-[0.3em] text-[#c9a96e]">HVN</div>
          <p className="font-sans text-xs uppercase tracking-[0.5em] text-[#c9a96e] opacity-30">Havenry</p>
        </div>
        <div className="flex flex-col gap-2 text-right">
          <p className="font-sans text-xs tracking-wide text-[#e8dcc8] opacity-40">
            Curated great rooms for the discerning few.
          </p>
          <p className="font-sans text-xs text-[#c9a96e] opacity-30">
            © {new Date().getFullYear()} HVN Havenry. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
