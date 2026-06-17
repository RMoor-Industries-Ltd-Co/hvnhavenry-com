"use client";

export function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-5 mix-blend-normal">
      {/* Logo */}
      <div className="font-display text-2xl tracking-[0.3em] text-[#c9a96e]">
        HVN
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8">
        {["The Room", "Collections", "Bespoke", "Contact"].map((item) => (
          <button
            key={item}
            className="text-xs tracking-[0.25em] uppercase text-[#e8dcc8] opacity-60 hover:opacity-100 transition-opacity duration-300 font-sans"
          >
            {item}
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="text-xs tracking-[0.2em] uppercase text-[#c9a96e] opacity-70 hover:opacity-100 transition-opacity duration-300 cursor-pointer font-sans">
        Book a Consultation
      </div>
    </nav>
  );
}
