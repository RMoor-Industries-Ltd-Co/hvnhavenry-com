export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0d0b09]">
      {/* Base gradient — mahogany to near-black, evoking the great room at dusk */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,#2a1810_0%,#0d0b09_55%),linear-gradient(160deg,#1a1035_0%,#0d0b09_60%)] opacity-90" />

      {/* Warm ambient glows — floor lamps / candlelight */}
      <div className="absolute left-[18%] bottom-[15%] w-72 h-72 rounded-full bg-[#c9a96e] blur-[120px] opacity-20 animate-ambient-glow" />
      <div
        className="absolute right-[15%] bottom-[25%] w-96 h-96 rounded-full bg-[#c9a96e] blur-[140px] opacity-15 animate-ambient-glow"
        style={{ animationDelay: "3s" }}
      />

      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(201,169,110,0.03) 2px, rgba(201,169,110,0.03) 4px)`,
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,#0d0b09_100%)]" />
    </div>
  );
}
