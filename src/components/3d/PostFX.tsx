"use client";

import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/**
 * Cinematic post-processing for the penthouse-at-dusk room.
 *
 * The scene is rendered with the renderer's own ACES Filmic tone mapping +
 * exposure (set on the Canvas), so the composer runs in LDR and inherits that
 * grade — these effects sit on top of it rather than replacing it.
 *
 * Bloom does the heavy lifting: the candle flames, ember tip, city-light dots
 * and shelf LED strips all carry bright emissive values that, post-tonemap,
 * clamp toward white and bleed into a soft glow. Vignette + grain add the
 * "shot on film" luxury feel.
 */
export function PostFX() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        mipmapBlur
        intensity={0.9}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.32}
        radius={0.72}
      />
      <Vignette
        eskil={false}
        offset={0.28}
        darkness={0.82}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.18} />
    </EffectComposer>
  );
}
