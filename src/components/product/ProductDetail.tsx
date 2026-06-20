"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Product } from "@/lib/products";
import { BuyButton } from "@/components/ui/BuyButton";
import { ProductImage } from "@/components/product/ProductImage";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

/**
 * The single "Product details" section shown when a piece is selected from the
 * room. Replaces the default editorial sections. Copy flies in from the bottom;
 * the Buy Now link goes off-site to Shopify. `onBack` returns to the room view.
 */
export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Re-run the fly-in each time the selected product changes.
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-fly-up]", {
        opacity: 0,
        y: 70,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from("[data-fly-image]", {
        opacity: 0,
        scale: 1.04,
        duration: 1.2,
        ease: "power3.out",
      });
    }, rootRef);
    return () => ctx.revert();
  }, [product.id]);

  return (
    <section
      ref={rootRef}
      id="product-detail"
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: product.accentColor }}
    >
      {/* Back to the room */}
      <button
        onClick={onBack}
        className="absolute left-8 top-28 z-20 flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.3em] text-[#c9a96e] opacity-70 transition-opacity duration-300 hover:opacity-100 lg:left-16"
      >
        <span aria-hidden className="text-sm leading-none">↩</span>
        Back to the room
      </button>

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-8 py-32 lg:grid-cols-2 lg:px-16">
        {/* Image */}
        <div
          data-fly-image
          className="relative order-1 aspect-[4/5] w-full lg:order-none"
        >
          <ProductImage src={product.image} alt={product.imageAlt} />
        </div>

        {/* Copy */}
        <div className="order-2 max-w-lg lg:order-none">
          <p
            data-fly-up
            className="mb-4 font-sans text-xs uppercase tracking-[0.4em] text-[#c9a96e] opacity-70"
          >
            {product.collection}
          </p>
          <div data-fly-up className="mb-6 h-px w-16 bg-[#c9a96e] opacity-60" />
          <h2
            data-fly-up
            className="mb-3 font-display text-5xl font-light leading-[1.1] text-[#e8dcc8] lg:text-6xl"
          >
            {product.name}
          </h2>
          <p
            data-fly-up
            className="mb-6 font-display text-xl italic text-[#c9a96e] opacity-80"
          >
            {product.tagline}
          </p>
          <p
            data-fly-up
            className="mb-8 font-sans text-sm leading-relaxed text-[#e8dcc8] opacity-70"
          >
            {product.description}
          </p>
          <ul data-fly-up className="mb-8 space-y-2">
            {product.details.map((detail) => (
              <li
                key={detail}
                className="flex items-start gap-3 font-sans text-sm text-[#e8dcc8] opacity-60"
              >
                <span className="mt-0.5 shrink-0 text-[#c9a96e]">—</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
          <p
            data-fly-up
            className="mb-8 font-display text-2xl tracking-wide text-[#c9a96e]"
          >
            {product.price}
          </p>
          <div data-fly-up>
            <BuyButton url={product.shopifyUrl} label="Buy Now" />
          </div>
        </div>
      </div>
    </section>
  );
}
