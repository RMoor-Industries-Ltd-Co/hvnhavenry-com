// Horizontal golden section divider — a fading gold line with a small diamond at
// center. Used between the main sections to define their boundaries.
export function GoldenDivider({ className = "", py = "py-14" }: { className?: string; py?: string }) {
  return (
    <div className={`w-full bg-[#0d0b09] ${py} flex items-center justify-center ${className}`}>
      <div className="flex items-center gap-4 w-full max-w-xl px-8">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#c9a96e]/60" />
        <span className="w-2 h-2 rotate-45 border border-[#c9a96e]/70 bg-[#c9a96e]/20" />
        <span className="h-px flex-1 bg-gradient-to-r from-[#c9a96e]/60 to-transparent" />
      </div>
    </div>
  );
}
