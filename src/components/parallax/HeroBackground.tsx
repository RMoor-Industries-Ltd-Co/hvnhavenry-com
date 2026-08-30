"use client";

import { useEffect, useState } from "react";
import { HeroFitHUD } from "./HeroFitHUD";

// TEMPORARY S1 framing rig. Default behavior (no URL params) is unchanged: a full-bleed
// object-cover hero video, exactly as before. URL params let us compare fits live while we
// decide the target aspect ratio + safe framing for the regenerated hero video:
//   ?fit=cover|contain|blur   (default cover)
//   ?pos=center|top|bottom|"50% 30%"   (object-position, cover only; default center)
//   ?guides=16:9,21:9,4:3     (overlay centered aspect-guide frames)
//   ?herotest=1               (force the HUD readout on without changing fit)
// Any of these also switches on the HUD. Remove this rig once the target aspect is locked.

type Fit = "cover" | "contain" | "blur";

interface HeroParams {
  fit: Fit;
  pos: string;
  guides: string[];
  hud: boolean;
}

const DEFAULT_PARAMS: HeroParams = { fit: "cover", pos: "center", guides: [], hud: false };

function readParams(): HeroParams {
  const sp = new URLSearchParams(window.location.search);
  const rawFit = sp.get("fit");
  const fit: Fit = rawFit === "contain" || rawFit === "blur" ? rawFit : "cover";
  const pos = sp.get("pos")?.trim() || "center";
  const guides = (sp.get("guides") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const hud = sp.has("herotest") || sp.has("fit") || sp.has("pos") || sp.has("guides");
  return { fit, pos, guides, hud };
}

export function HeroBackground() {
  // SSR + first client paint use the default (cover) so there's no hydration mismatch;
  // the effect then applies any URL params on the client.
  const [params, setParams] = useState<HeroParams>(DEFAULT_PARAMS);

  useEffect(() => {
    // Defer the first setState out of the synchronous effect body (params come from
    // window.location, a client-only source) so it doesn't trip react-hooks/set-state-in-effect
    // and stays a clean SSR-default → client-params transition.
    const id = setTimeout(() => setParams(readParams()), 0);
    return () => clearTimeout(id);
  }, []);

  const { fit, pos, guides, hud } = params;

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0d0b09]">
      {/* Blurred backdrop fill (blur mode only): a scaled, blurred cover-copy behind the
          contained video so the sides are filled softly instead of hard black bars. */}
      {fit === "blur" && (
        <video
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src="/assets/hero/hero__hvn-havenry__section01.webm" type="video/webm" />
          <source src="/assets/hero/hero__hvn-havenry__section01.mp4" type="video/mp4" />
        </video>
      )}

      {/* Hero background film. WebM first (smaller, VP9); MP4 (H.264) is the universal
          fallback for Safari/iOS. Fit + object-position are param-driven for the framing rig;
          the default is the original full-bleed object-cover. */}
      <video
        className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
        style={fit === "cover" ? { objectPosition: pos } : undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/assets/hero/hero__hvn-havenry__section01.webm" type="video/webm" />
        <source src="/assets/hero/hero__hvn-havenry__section01.mp4" type="video/mp4" />
      </video>

      {/* Bottom scrim only — keeps the hero copy legible without hazing the film. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09]/85 via-[#0d0b09]/15 to-transparent" />

      {/* Soft edge vignette to frame the film. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_62%,rgba(13,11,9,0.55)_100%)]" />

      {hud && <HeroFitHUD fit={fit} pos={pos} guides={guides} />}
    </div>
  );
}
