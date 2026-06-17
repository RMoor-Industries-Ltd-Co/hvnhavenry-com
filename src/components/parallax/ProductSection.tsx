"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Product } from "@/lib/products";
import { BuyButton } from "@/components/ui/BuyButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductSectionProps {
  product: Product;
  index: number;
}

export function ProductSection({ product, index }: ProductSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  const isEven = index % 2 === 0;

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Parallax background layer
      gsap.to(bgRef.current, {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Content fade + slide in
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      // Decorative line
      if (decorRef.current) {
        gsap.from(decorRef.current, {
          scaleX: 0,
          transformOrigin: isEven ? "left center" : "right center",
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isEven]);

  return (
    <section
      ref={sectionRef}
      id={product.id}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Parallax background layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 -top-[20%] -bottom-[20%]"
        style={{ backgroundColor: product.accentColor }}
      >
        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(201,169,110,0.03) 2px,
                rgba(201,169,110,0.03) 4px
              )
            `,
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0b09] via-transparent to-[#0d0b09] opacity-60" />
        <div
          className={`absolute inset-0 bg-gradient-to-${isEven ? "l" : "r"} from-[#0d0b09] via-transparent to-transparent opacity-80`}
        />
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-16 py-20 flex ${isEven ? "justify-start" : "justify-end"}`}>
        <div ref={contentRef} className="max-w-lg">
          {/* Room position badge */}
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-sans mb-4 opacity-70">
            {product.roomPosition}
          </p>

          {/* Decorative line */}
          <div ref={decorRef} className="h-px w-16 bg-[#c9a96e] mb-6 opacity-60" />

          {/* Product name */}
          <h2 className="font-display text-5xl lg:text-6xl font-light text-[#e8dcc8] leading-[1.1] mb-3">
            {product.name}
          </h2>

          {/* Tagline */}
          <p className="font-display italic text-xl text-[#c9a96e] mb-6 opacity-80">
            {product.tagline}
          </p>

          {/* Description */}
          <p className="text-sm leading-relaxed text-[#e8dcc8] opacity-70 font-sans mb-8">
            {product.description}
          </p>

          {/* Details list */}
          <ul className="mb-8 space-y-2">
            {product.details.map((detail) => (
              <li key={detail} className="flex items-start gap-3 text-sm text-[#e8dcc8] opacity-60 font-sans">
                <span className="text-[#c9a96e] mt-0.5 shrink-0">—</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>

          {/* Price */}
          <p className="font-display text-2xl text-[#c9a96e] mb-8 tracking-wide">
            {product.price}
          </p>

          <BuyButton url={product.shopifyUrl} />
        </div>
      </div>

      {/* Section number */}
      <div
        className={`absolute bottom-8 ${isEven ? "right-8" : "left-8"} font-display text-[8rem] leading-none text-[#c9a96e] opacity-[0.04] select-none`}
      >
        0{index + 1}
      </div>
    </section>
  );
}
