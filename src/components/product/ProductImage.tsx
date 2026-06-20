"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
}

/**
 * Product image with a graceful monogram placeholder. The team drops files in
 * at `public/products/<id>.webp`; until one exists the path 404s, `onError`
 * fires, and we fall back to an elegant HVN placeholder instead of a broken
 * image icon. Once the file lands the real image takes over with no code change.
 */
export function ProductImage({ src, alt }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#15120e] to-[#0a0807]">
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain object-center"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="font-display text-6xl tracking-[0.3em] text-[#c9a96e]/40">
            HVN
          </span>
          <span className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#c9a96e]/30">
            Image coming soon
          </span>
        </div>
      )}
    </div>
  );
}
