export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0d0b09]">
      {/* Hero background film (hero__hvn-havenry__section01.mp4). Autoplaying, muted, and
          looping so it behaves like a moving backdrop — muted + playsInline are what let
          it autoplay on mobile (same pattern as the loader + S4 reveal videos). The dark
          base color shows through until the first frame paints. */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        {/* WebM first (smaller, VP9) — browsers pick the first supported type;
            MP4 (H.264) is the universal fallback for Safari/iOS. */}
        <source src="/assets/hero/hero__hvn-havenry__section01.webm" type="video/webm" />
        <source src="/assets/hero/hero__hvn-havenry__section01.mp4" type="video/mp4" />
      </video>

      {/* Bottom scrim only — keeps the hero copy legible without hazing the film. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09]/85 via-[#0d0b09]/15 to-transparent" />

      {/* Soft edge vignette to frame the film. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_62%,rgba(13,11,9,0.55)_100%)]" />
    </div>
  );
}
