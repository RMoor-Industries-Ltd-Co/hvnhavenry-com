"use client";

import { useHavenStore } from "@/lib/store";

const PLACEHOLDER_LINKS = ["The Room", "Collections", "Bespoke", "Contact"];
const COLLECTION_LINKS = ["Atmos Ritual", "HVN Chamber", "HVN Living", "Standard Line"];

// Each section owns its own contextual center row. As the active section
// advances, earlier rows bump up and out while later rows rise into place.
function rowPosition(rowSection: number, active: number): string {
  if (rowSection === active) return "opacity-100 translate-y-0 pointer-events-auto";
  if (rowSection < active) return "opacity-0 -translate-y-6 pointer-events-none";
  return "opacity-0 translate-y-6 pointer-events-none";
}

export function NavBar() {
  const activeNavSection = useHavenStore((s) => s.activeNavSection);
  const scrollToSection = useHavenStore((s) => s.scrollToSection);

  const go = (id: string) => () => scrollToSection?.(id);

  const linkClass =
    "text-xs tracking-[0.25em] uppercase text-[#e8dcc8] opacity-60 hover:opacity-100 transition-opacity duration-300 font-sans cursor-pointer";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-start justify-between pl-10 pr-8 pt-8 pb-4 mix-blend-normal">
      {/* Logo — padded off the edge, clickable back to top of home */}
      <button
        onClick={go("top")}
        className="font-display text-2xl tracking-[0.3em] text-[#c9a96e] cursor-pointer hover:opacity-80 transition-opacity duration-300"
        aria-label="HVN Havenry — back to top"
      >
        HVN
      </button>

      {/* Stacked contextual center rows — one per section, crossfading in place */}
      <div className="hidden md:block relative flex-1 mx-8 h-12">
        {/* Section 1 — reserved placeholder links + animated brand sub-row */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-start gap-2 transition-all duration-500 ease-out ${rowPosition(
            0,
            activeNavSection
          )}`}
        >
          <div className="flex items-center gap-8">
            {PLACEHOLDER_LINKS.map((item) => (
              <span key={item} className={linkClass}>
                {item}
              </span>
            ))}
          </div>
          <span
            className={`gold-shimmer text-[0.65rem] tracking-[0.35em] uppercase font-sans transition-opacity duration-700 ${
              activeNavSection === 0 ? "opacity-100" : "opacity-0"
            }`}
          >
            It&apos;s not a store. It is a Havenry.
          </span>
        </div>

        {/* Section 2 — page controls */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-8 transition-all duration-500 ease-out ${rowPosition(
            1,
            activeNavSection
          )}`}
        >
          <button onClick={go("top")} className={linkClass}>
            Back to Home
          </button>
          <button onClick={go("concierge")} className={linkClass}>
            Speak to Concierge
          </button>
        </div>

        {/* Section 3 — the collection */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-start gap-2 transition-all duration-500 ease-out ${rowPosition(
            2,
            activeNavSection
          )}`}
        >
          <span className="text-[0.65rem] tracking-[0.5em] uppercase text-[#c9a96e] opacity-50 font-sans">
            The Collection
          </span>
          <div className="flex items-center gap-6">
            {COLLECTION_LINKS.map((item) => (
              <span key={item} className={linkClass}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Persistent concierge CTA — far right, every section */}
      <button
        onClick={go("concierge")}
        className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer font-sans whitespace-nowrap"
      >
        Speak to Concierge
      </button>
    </nav>
  );
}
