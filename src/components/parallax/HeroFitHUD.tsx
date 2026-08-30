"use client";

import { useEffect, useState } from "react";

// TEMPORARY framing rig for S1. This HUD + the aspect guides exist only to help us
// choose the target aspect ratio + safe framing for the regenerated hero video. It
// renders only when a ?herotest / ?fit / ?pos / ?guides param is present, so ordinary
// visitors never see it. Remove this component (and the param wiring in HeroBackground)
// once the target aspect is locked in.

const VIDEO_W = 1112;
const VIDEO_H = 834; // current source is 4:3

// Common aspect ratios we might target, for the readout's nearest-label.
const NAMED_RATIOS: { label: string; value: number }[] = [
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:10", value: 16 / 10 },
  { label: "16:9", value: 16 / 9 },
  { label: "1.85:1", value: 1.85 },
  { label: "2:1", value: 2 / 1 },
  { label: "21:9", value: 21 / 9 },
];

function nearestLabel(ratio: number): string {
  let best = NAMED_RATIOS[0];
  let bestDist = Infinity;
  for (const r of NAMED_RATIOS) {
    const d = Math.abs(r.value - ratio);
    if (d < bestDist) {
      bestDist = d;
      best = r;
    }
  }
  return best.label;
}

function parseRatio(token: string): { label: string; value: number } | null {
  const t = token.trim();
  if (!t) return null;
  const m = t.match(/^(\d+(?:\.\d+)?)[:x/](\d+(?:\.\d+)?)$/i);
  if (m) {
    const w = parseFloat(m[1]);
    const h = parseFloat(m[2]);
    if (w > 0 && h > 0) return { label: t, value: w / h };
  }
  const n = parseFloat(t);
  if (!Number.isNaN(n) && n > 0) return { label: t, value: n };
  return null;
}

interface HeroFitHUDProps {
  fit: string;
  pos: string;
  guides: string[]; // e.g. ["16:9","21:9","4:3"]
}

/** Live viewport readout + centered aspect-guide frames for tuning the S1 hero framing. */
export function HeroFitHUD({ fit, pos, guides }: HeroFitHUDProps) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!size) return null;

  const vpRatio = size.w / size.h;
  const guideRatios = guides.map(parseRatio).filter((r): r is { label: string; value: number } => r !== null);

  return (
    <>
      {/* Centered aspect-guide frames — each shows where a candidate target aspect sits
          within the current viewport, so the regenerated video can keep key elements inside. */}
      {guideRatios.map(({ label, value }) => {
        // Fit the guide inside the viewport, matching the requested aspect.
        let w = size.w;
        let h = w / value;
        if (h > size.h) {
          h = size.h;
          w = h * value;
        }
        return (
          <div
            key={label}
            className="pointer-events-none fixed left-1/2 top-1/2 z-[95] -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-[#c9a96e]/70"
            style={{ width: `${w}px`, height: `${h}px` }}
          >
            <span className="absolute left-1 top-1 bg-[#0d0b09]/80 px-1.5 py-0.5 font-mono text-[10px] text-[#c9a96e]">
              {label}
            </span>
          </div>
        );
      })}

      {/* Readout panel */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-[96] rounded border border-[#c9a96e]/40 bg-[#0d0b09]/90 px-4 py-3 font-mono text-[11px] leading-relaxed text-[#e8dcc8] backdrop-blur-md">
        <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">S1 framing rig</p>
        <p>viewport: {size.w} × {size.h}</p>
        <p>aspect: {vpRatio.toFixed(3)}:1 (≈{nearestLabel(vpRatio)})</p>
        <p>video src: {VIDEO_W} × {VIDEO_H} (1.333:1 · 4:3)</p>
        <p>fit: <span className="text-[#c9a96e]">{fit}</span>{fit === "cover" ? ` · pos: ${pos}` : ""}</p>
        {guideRatios.length > 0 && (
          <p>guides: {guideRatios.map((g) => g.label).join(", ")}</p>
        )}
      </div>
    </>
  );
}
