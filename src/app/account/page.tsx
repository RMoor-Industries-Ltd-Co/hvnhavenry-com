"use client";

import Link from "next/link";
import { useState } from "react";
import { ShopShell } from "@/components/checkout/ShopShell";

// Mock "previous orders" / order-lookup page. No real account system — a sample past
// order is shown, and the lookup form is a preview (surfaces the sample on submit).
const SAMPLE = {
  id: "o_48213307",
  placed: "March 14, 2026",
  status: "Delivered",
  items: [
    { name: "Transitional Ember Line — Dim the Lights", qty: 1, price: 99 },
    { name: "Ember Line Drift Sanctum", qty: 1, price: 50 },
  ],
};

export default function AccountOrdersPage() {
  const [orderNo, setOrderNo] = useState("");
  const [email, setEmail] = useState("");
  const [looked, setLooked] = useState(false);

  const total = SAMPLE.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <ShopShell>
      <div className="mb-6 border border-[#c9a96e]/30 bg-[#c9a96e]/5 px-4 py-2 text-[11px] tracking-wide text-[#c9a96e] font-sans">
        Preview Mode — mock order history for design review. No account system is connected.
      </div>

      <h1 className="font-display text-4xl lg:text-5xl font-light mb-2">Your Orders</h1>
      <p className="text-sm text-[#e8dcc8]/70 font-sans mb-8">
        Look up a previous order by number and email, or review your recent order below.
      </p>

      {/* Lookup */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLooked(true);
        }}
        className="mb-10 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
      >
        <label className="block">
          <span className="block text-[10px] uppercase tracking-[0.3em] text-[#e8dcc8]/60 font-sans mb-1">Order number</span>
          <input
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            placeholder="o_XXXXXXXX"
            className="w-full bg-transparent border border-[#c9a96e]/30 px-3 py-2 text-sm text-[#e8dcc8] font-sans focus:border-[#c9a96e] outline-none"
          />
        </label>
        <label className="block">
          <span className="block text-[10px] uppercase tracking-[0.3em] text-[#e8dcc8]/60 font-sans mb-1">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent border border-[#c9a96e]/30 px-3 py-2 text-sm text-[#e8dcc8] font-sans focus:border-[#c9a96e] outline-none"
          />
        </label>
        <button
          type="submit"
          className="bg-[#c9a96e] px-6 py-2 text-[12px] uppercase tracking-[0.2em] text-[#0d0b09] font-sans hover:bg-[#d8bd86] transition-colors cursor-pointer"
        >
          Find Order
        </button>
      </form>
      {looked && (
        <p className="-mt-6 mb-8 text-xs text-[#c9a96e] font-sans">
          Showing your most recent order (preview — lookup is not connected).
        </p>
      )}

      {/* Sample order */}
      <div className="border border-[#c9a96e]/20">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c9a96e]/10 px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#e8dcc8]/50 font-sans">Order {SAMPLE.id}</p>
            <p className="text-sm text-[#e8dcc8] font-sans">Placed {SAMPLE.placed}</p>
          </div>
          <span className="border border-[#c9a96e]/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#c9a96e] font-sans">
            {SAMPLE.status}
          </span>
        </div>

        <ul className="divide-y divide-[#c9a96e]/10">
          {SAMPLE.items.map((it) => (
            <li key={it.name} className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-[#e8dcc8] font-sans">
                {it.name} <span className="text-[#e8dcc8]/40">× {it.qty}</span>
              </span>
              <span className="font-display text-[#c9a96e]">${it.price}.00</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-[#c9a96e]/10 px-5 py-4">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#e8dcc8]/60 font-sans">Total</span>
          <span className="font-display text-xl text-[#c9a96e]">${total}.00</span>
        </div>

        <div className="flex flex-wrap gap-3 px-5 py-4">
          <button className="border border-[#c9a96e] px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-[#c9a96e] font-sans hover:bg-[#c9a96e] hover:text-[#0d0b09] transition-all cursor-pointer">
            Track Shipment
          </button>
          <button className="border border-[#e8dcc8]/20 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-[#e8dcc8]/80 font-sans hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all cursor-pointer">
            Reorder
          </button>
          <Link
            href="/contact"
            className="border border-[#e8dcc8]/20 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-[#e8dcc8]/80 font-sans hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all"
          >
            Contact About This Order
          </Link>
        </div>
      </div>
    </ShopShell>
  );
}
