export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0d0b09]">
      {/* Blurred backdrop — a scaled, blurred cover-copy of the film that fills whatever the
          contained foreground doesn't, so the sides (or top/bottom on portrait) read as a soft
          haze instead of hard black bars. aria-hidden: purely decorative. */}
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

      {/* Hero film — object-contain so the ENTIRE frame is always shown, uncropped, on any
          viewport (this is what secures the aspect ratio; the backdrop above fills the rest).
          WebM first (smaller, VP9); MP4 (H.264) is the universal fallback for Safari/iOS. */}
      <video
        className="absolute inset-0 h-full w-full object-contain"
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
    </div>
  );
}
