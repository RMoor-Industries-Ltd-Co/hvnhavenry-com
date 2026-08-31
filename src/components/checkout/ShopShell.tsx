import Link from "next/link";
import type { ReactNode } from "react";

// Shared chrome for the shop-side mock pages (previous orders, contact). Header + nav +
// footer in the HVN dark palette, matching the mock checkout. Footer wires the
// order-lookup and contact routes.
const FOOTER = {
  Shop: ["All Products", "Ember Line", "Drift Sanctums", "Bundles"],
  Collections: ["Relax", "Focus", "Restore", "Lounge"],
  About: ["Our Story", "Ingredients", "Sustainability", "Careers"],
};

export function ShopShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0b09] text-[#e8dcc8]">
      <div className="border-b border-[#c9a96e]/10 py-3 text-center text-[10px] uppercase tracking-[0.35em] text-[#c9a96e] font-sans">
        Complimentary Shipping on Orders $75+
      </div>

      <header className="flex items-center justify-between px-6 py-5 lg:px-10">
        <span className="text-lg text-[#c9a96e]">☰</span>
        <Link href="/" className="text-center">
          <div className="font-display text-2xl tracking-[0.35em] text-[#c9a96e] leading-none">HVN</div>
          <div className="font-display text-[0.6rem] tracking-[0.5em] text-[#c9a96e] opacity-70">HAVENRY</div>
        </Link>
        <div className="flex items-center gap-4 text-[#c9a96e]">
          <span>⌕</span>
          <span>▢</span>
        </div>
      </header>
      <nav className="hidden md:flex items-center justify-center gap-10 border-t border-[#c9a96e]/10 py-3 text-[11px] uppercase tracking-[0.25em] text-[#e8dcc8]/70 font-sans">
        {["Home", "Shop", "Collections", "Rituals", "About", "Concierge"].map((n) => (
          <span key={n} className="hover:text-[#c9a96e] transition-colors cursor-pointer">{n}</span>
        ))}
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-10 lg:px-10">{children}</main>

      <footer className="mt-12 border-t border-[#c9a96e]/10 bg-[#0d0b09] px-6 py-12 lg:px-10">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <div className="font-display text-2xl tracking-[0.3em] text-[#c9a96e]">HVN</div>
            <p className="font-display text-[0.6rem] tracking-[0.5em] text-[#c9a96e] opacity-70 mb-3">HAVENRY</p>
            <p className="text-xs text-[#e8dcc8]/50 font-sans max-w-xs">A haven for ambiance, ritual, and elevated living.</p>
          </div>
          {Object.entries(FOOTER).map(([col, links]) => (
            <div key={col}>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#c9a96e] opacity-70 mb-3 font-sans">{col}</p>
              <ul className="flex flex-col gap-2">
                {links.map((l) => (
                  <li key={l} className="text-xs text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors cursor-pointer font-sans">{l}</li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#c9a96e] opacity-70 mb-3 font-sans">Concierge</p>
            <ul className="flex flex-col gap-2 text-xs font-sans">
              <li><Link href="/contact" className="text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors">Contact</Link></li>
              <li><Link href="/contact" className="text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors">Speak to Management</Link></li>
              <li><Link href="/account" className="text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors">Track Order</Link></li>
              <li><Link href="/account" className="text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors">Previous Orders</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-3 border-t border-[#c9a96e]/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#e8dcc8]/40 font-sans">© 2026 HVN Havenry. All rights reserved.</p>
          <div className="flex gap-5 text-[11px] font-sans">
            <Link href="/terms" className="text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors">Terms &amp; Conditions</Link>
            <Link href="/shipping-returns" className="text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors">Shipping &amp; Returns</Link>
            <Link href="/privacy" className="text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="text-[#e8dcc8]/50 hover:text-[#c9a96e] transition-colors">Cookie Notice</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
