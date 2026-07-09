// Ambient rising smoke wisp (incense-style). Purely decorative — a column of
// staggered CSS puffs that read as one continuous stream. `className` positions/
// sizes the column where it's placed.
const PUFF_COUNT = 6;
const CYCLE = 7; // seconds — must match the smoke-rise animation duration in globals.css

export function SmokeStream({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none overflow-visible ${className}`} aria-hidden="true">
      {Array.from({ length: PUFF_COUNT }).map((_, i) => (
        <span
          key={i}
          className="smoke-puff"
          style={{ animationDelay: `${(i * CYCLE) / PUFF_COUNT}s` }}
        />
      ))}
    </div>
  );
}
