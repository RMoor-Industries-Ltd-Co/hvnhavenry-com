"use client";

import { useHavenStore } from "@/lib/store";

// Each section owns its own contextual center row, page-centered. As the active
// section advances, earlier rows bump up and out while later rows rise into place.
// (-translate-x-1/2 keeps every row centered on the page; translate-y drives the bump.)
function rowState(rowSection: number, active: number): string {
  if (rowSection === active) return "opacity-100 translate-y-0 pointer-events-auto";
  if (rowSection < active) return "opacity-0 -translate-y-6 pointer-events-none";
  return "opacity-0 translate-y-6 pointer-events-none";
}

export function NavBar() {
  const activeNavSection = useHavenStore((s) => s.activeNavSection);
  const scrollToSection = useHavenStore((s) => s.scrollToSection);
  const resetVideo = useHavenStore((s) => s.resetVideo);
  const openCart = useHavenStore((s) => s.openCart);
  const viewShowroom = useHavenStore((s) => s.viewShowroom);
  const navigate = useHavenStore((s) => s.navigate);

  // Loader-backed jump — covers the parallax during the move (used for every
  // section-to-section navigation, e.g. the HVN logo shooting back up to S1).
  const goLoader = (id: string) => () => navigate(id);

  const linkClass =
    "text-xs tracking-[0.25em] uppercase text-[#e8dcc8] opacity-60 hover:opacity-100 transition-opacity duration-300 font-sans cursor-pointer";
  const edge = "py-[5px] px-[1%]"; // 5px top/bottom, 1% left/right off the page edge
  const rowBase =
    "absolute left-1/2 top-[5px] -translate-x-1/2 whitespace-nowrap transition-all duration-500 ease-out";

  // Section 2 hides the flanking logo + CTA; the center controls carry navigation there.
  const flanksHidden = activeNavSection === 1;

  return (
    <nav className="fixed top-0 inset-x-0 z-40 h-16 mix-blend-normal">
      {/* Logo — hidden in S2, returns in S3. Padded off the top-left edge. */}
      <button
        onClick={goLoader("top")}
        className={`absolute top-0 left-0 ${edge} font-display text-2xl tracking-[0.3em] text-[#c9a96e] cursor-pointer hover:opacity-80 transition-all duration-500 ${
          flanksHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="HVN Havenry — back to top"
      >
        HVN
      </button>

      {/* Page-centered contextual rows */}
      <div className="hidden md:block">
        {/* S1 — slogan only */}
        <div className={`${rowBase} flex items-center justify-center ${rowState(0, activeNavSection)}`}>
          <span className="gold-shimmer text-[0.7rem] tracking-[0.35em] uppercase font-sans">
            Not a store, a Havenry
          </span>
        </div>

        {/* S2 — page controls */}
        <div className={`${rowBase} flex items-center justify-center gap-8 ${rowState(1, activeNavSection)}`}>
          <button onClick={goLoader("top")} className={linkClass}>
            Back to Home
          </button>
          <button onClick={goLoader("the-room")} className={linkClass}>
            View Showroom
          </button>
        </div>

        {/* S3 — the collection links now live in-section (just above the room image),
            so the nav only carries the ambient section label here. */}
        <div className={`${rowBase} flex items-center justify-center ${rowState(2, activeNavSection)}`}>
          <span className="text-[0.65rem] tracking-[0.5em] uppercase text-[#c9a96e] opacity-50 font-sans">
            The Showroom
          </span>
        </div>

        {/* S4 (video) — the collection nav is pushed away; only a return control remains */}
        <div className={`${rowBase} flex items-center justify-center ${rowState(3, activeNavSection)}`}>
          <button
            onClick={() => {
              resetVideo();
              navigate("the-room");
            }}
            className="text-xs tracking-[0.3em] uppercase text-[#c9a96e] opacity-80 hover:opacity-100 transition-opacity duration-300 font-sans cursor-pointer"
          >
            ← Return to Showroom
          </button>
        </div>
      </div>

      {/* Right CTA — Speak to Concierge (S1) / hidden (S2) / View Cart (S3). Padded off edge. */}
      <div
        className={`absolute top-0 right-0 ${edge} transition-opacity duration-500 ${
          flanksHidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {activeNavSection >= 2 ? (
          <button
            onClick={() => {
              scrollToSection?.("the-room");
              openCart();
            }}
            className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer font-sans whitespace-nowrap"
          >
            View Cart
          </button>
        ) : (
          <button
            onClick={viewShowroom}
            className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer font-sans whitespace-nowrap"
          >
            View Showroom
          </button>
        )}
      </div>
    </nav>
  );
}
