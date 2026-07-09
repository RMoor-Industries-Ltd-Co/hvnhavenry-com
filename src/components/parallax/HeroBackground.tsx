export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0d0b09]">
      {/* Hero photograph (hero__hvn-havenry__section01) — WebP with PNG fallback. */}
      <div className="absolute inset-0 bg-cover bg-center bg-asset-hero01" />

      {/* Bottom scrim only — keeps the hero copy legible without hazing the image. */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b09]/85 via-[#0d0b09]/15 to-transparent" />

      {/* Soft edge vignette to frame the photograph. */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_62%,rgba(13,11,9,0.55)_100%)]" />
    </div>
  );
}
