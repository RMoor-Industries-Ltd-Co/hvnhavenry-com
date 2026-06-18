"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useHavenStore } from "@/lib/store";
import { PRODUCTS, type ProductId } from "@/lib/products";
import { heroContent } from "@/lib/content";

const BLUR_DATA_URL =
  "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoQAAkAA4BaJYwCdAEPAmz44AD+93pbVmOE7CTFWtkTJBTTtjjNpDpbBcvNUAAA";

/**
 * Product hotspots positioned over the photographic hero plate (Option 2).
 * Coordinates are percentages of the image box; they sit roughly over the
 * lit candle, incense smoke, diffuser and shelf pieces in the render.
 */
const HOTSPOTS: { id: ProductId; x: number; y: number }[] = [
  { id: "shadowChamber", x: 50, y: 60 },   // central lit candle
  { id: "emberLine", x: 51, y: 45 },       // rising incense smoke
  { id: "combRail", x: 61, y: 64 },        // reed diffuser, right of table
  { id: "atmosphereMist", x: 39, y: 65 },  // bottles, left of table
  { id: "flask", x: 44, y: 71 },           // small vessel, front-left
  { id: "columnChamber", x: 28, y: 41 },   // tall piece on the left shelf
  { id: "bolster", x: 82, y: 80 },         // cushion on the sofa
];

interface HeroRoomProps {
  onHotspotSelect: (id: string) => void;
  onEnterLiveRoom: () => void;
}

export function HeroRoom({ onHotspotSelect, onEnterLiveRoom }: HeroRoomProps) {
  const { setLoading, setLoadProgress, setRoomReady, setSelectedHotspot } = useHavenStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  // The photo hero has no 3D load to wait on — release the loading screen
  // ourselves and mark the room ready so the overlay copy animates in.
  useEffect(() => {
    setLoadProgress(100);
    const t = setTimeout(() => {
      setLoading(false);
      setRoomReady(true);
    }, 400);
    return () => clearTimeout(t);
  }, [setLoading, setLoadProgress, setRoomReady]);

  useEffect(() => {
    if (!overlayRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-anim]", {
        opacity: 0,
        y: 28,
        stagger: 0.14,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.5,
      });
      gsap.from("[data-hero-spot]", {
        opacity: 0,
        scale: 0.4,
        stagger: 0.08,
        duration: 0.8,
        ease: "back.out(2)",
        delay: 1.1,
      });
    }, overlayRef);
    return () => ctx.revert();
  }, []);

  const handleSpot = (id: ProductId) => {
    setSelectedHotspot(id);
    onHotspotSelect(id);
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Photographic plate */}
      <Image
        src="/hero/lounge.webp"
        alt="HVN great room — a candlelit penthouse lounge at dusk"
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover object-center"
      />

      {/* Cinematic grade: vignette + edge falloff for text legibility */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 40%, rgba(13,11,9,0) 35%, rgba(13,11,9,0.55) 100%)",
        }}
      />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0d0b09]/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0d0b09] via-[#0d0b09]/50 to-transparent" />

      {/* Hotspots */}
      {HOTSPOTS.map((h) => {
        const product = PRODUCTS[h.id];
        return (
          <button
            key={h.id}
            data-hero-spot
            onClick={() => handleSpot(h.id)}
            aria-label={`View ${product.name}`}
            className="group absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
          >
            {/* Expanding ring */}
            <span
              className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a96e]"
              style={{ animation: "hotspot-ring 2.4s ease-out infinite" }}
            />
            {/* Core orb */}
            <span
              className="block h-3 w-3 rounded-full bg-[#c9a96e] shadow-[0_0_12px_3px_rgba(201,169,110,0.6)]"
              style={{ animation: "hotspot-pulse 2.4s ease-in-out infinite" }}
            />
            {/* Label */}
            <span className="pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-sm border border-[#c9a96e]/50 bg-[#0d0b09]/85 px-2.5 py-1 font-display text-[13px] tracking-[0.1em] text-[#c9a96e] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              {product.name}
            </span>
          </button>
        );
      })}

      {/* Branding overlay */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end px-8 pb-16 lg:px-16"
      >
        <div className="max-w-2xl">
          <p
            data-hero-anim
            className="mb-4 font-sans text-xs uppercase tracking-[0.45em] text-[#c9a96e] opacity-70"
          >
            {heroContent.eyebrow}
          </p>
          <h1
            data-hero-anim
            className="mb-5 font-display text-5xl font-light leading-[1.02] text-[#e8dcc8] lg:text-7xl"
          >
            {heroContent.headingLines[0]}<br />
            <span className="italic text-[#c9a96e]">{heroContent.headingLines[1]}</span>
          </h1>
          <p
            data-hero-anim
            className="mb-7 max-w-md font-sans text-sm leading-relaxed text-[#e8dcc8] opacity-50"
          >
            {heroContent.body}
          </p>

          {/* Brand pillars */}
          {heroContent.pillars.length > 0 && (
            <div
              data-hero-anim
              className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-[11px] uppercase tracking-[0.35em] text-[#c9a96e] opacity-60"
            >
              {heroContent.pillars.map((pillar, i) => (
                <span key={pillar} className="flex items-center gap-5">
                  {i > 0 && <span className="text-[#c9a96e]/40">·</span>}
                  {pillar}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Enter the live 3D room */}
        <button
          data-hero-anim
          onClick={onEnterLiveRoom}
          className="pointer-events-auto absolute bottom-16 right-8 flex items-center gap-2 border border-[#c9a96e]/30 px-4 py-2.5 font-sans text-[11px] uppercase tracking-[0.3em] text-[#c9a96e] opacity-70 transition-all duration-300 hover:border-[#c9a96e]/70 hover:opacity-100 lg:right-16"
        >
          {heroContent.enterLabel}
          <span aria-hidden className="text-sm leading-none">↗</span>
        </button>
      </div>
    </div>
  );
}
