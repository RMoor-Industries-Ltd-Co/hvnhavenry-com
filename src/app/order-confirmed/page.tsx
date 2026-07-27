"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useHavenStore } from "@/lib/store";
import { getCartLines, formatCurrency, estimatedDeliveryRange } from "@/lib/checkout";
import { ProductSwatch } from "@/components/checkout/ProductSwatch";
import { PreviewBanner } from "@/components/checkout/PreviewBanner";

export default function OrderConfirmedPage() {
  const lastOrder = useHavenStore((state) => state.lastOrder);
  const [delivery, setDelivery] = useState("");

  useEffect(() => {
    if (lastOrder) setDelivery(estimatedDeliveryRange(new Date(lastOrder.placedAt)));
  }, [lastOrder]);

  if (!lastOrder) {
    return (
      <main className="min-h-screen bg-[#0d0b09] text-[#e8dcc8]">
        <PreviewBanner />
        <div className="max-w-xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-3xl mb-4">No recent order found</h1>
          <p className="text-[#e8dcc8]/50 font-sans text-sm mb-8">
            Place a mock order first to see the confirmation page.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 border border-[#c9a96e] px-8 py-4 text-[#c9a96e] font-display text-lg tracking-[0.2em] hover:bg-[#c9a96e] hover:text-[#0d0b09] transition-all duration-500"
          >
            Return to the Room
          </Link>
        </div>
      </main>
    );
  }

  const lines = getCartLines(lastOrder.items);

  return (
    <main className="min-h-screen bg-[#0d0b09] text-[#e8dcc8]">
      <PreviewBanner />

      <header className="flex items-center justify-between px-8 py-6 border-b border-[#c9a96e]/10">
        <Link href="/" className="font-display text-2xl tracking-[0.3em] text-[#c9a96e]">
          HVN
        </Link>
        <p className="text-xs tracking-[0.35em] uppercase text-[#e8dcc8]/50 font-sans">Order Confirmed</p>
      </header>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        {/* Confirmation mark */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="w-14 h-14 rounded-full border border-[#c9a96e] flex items-center justify-center mb-6">
            <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
              <path d="M3 8.5l3 3 7-7" stroke="#c9a96e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase font-sans mb-3 opacity-80">
            Thank you, {lastOrder.customerName}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light mb-4">
            Your order is <span className="italic text-[#c9a96e]">confirmed</span>
          </h1>
          <p className="text-sm text-[#e8dcc8]/50 font-sans max-w-md">
            A confirmation has been sent to {lastOrder.email}. This is a design preview —
            no real charge was made and no physical order was placed.
          </p>
        </div>

        {/* Order meta */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12 text-center border-y border-[#c9a96e]/10 py-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#e8dcc8]/40 font-sans mb-1">Order number</p>
            <p className="font-display text-lg text-[#c9a96e]">{lastOrder.orderNumber}</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#e8dcc8]/40 font-sans mb-1">Order date</p>
            <p className="font-display text-lg">
              {new Date(lastOrder.placedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#e8dcc8]/40 font-sans mb-1">Estimated arrival</p>
            <p className="font-display text-lg">{delivery}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-10">
          <h2 className="font-display text-xl mb-5">Items in this order</h2>
          <div className="divide-y divide-[#c9a96e]/10 border-y border-[#c9a96e]/10">
            {lines.map((line) => (
              <div key={line.productId} className="flex items-center gap-5 py-5">
                <ProductSwatch accentColor={line.accentColor} initials="HVN" size={56} />
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg leading-snug">{line.name}</p>
                  <p className="text-xs text-[#e8dcc8]/40 font-sans">Qty {line.quantity}</p>
                </div>
                <p className="font-sans text-sm text-[#c9a96e]">{formatCurrency(line.lineTotal)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-display text-xl text-[#c9a96e] pt-5">
            <span>Total paid</span>
            <span>{formatCurrency(lastOrder.total)}</span>
          </div>
        </div>

        {/* Shipping address */}
        <div className="mb-14">
          <h2 className="font-display text-xl mb-3">Shipping to</h2>
          <p className="text-sm text-[#e8dcc8]/60 font-sans">{lastOrder.customerName}</p>
          <p className="text-sm text-[#e8dcc8]/60 font-sans">{lastOrder.address}</p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-3 border border-[#c9a96e] px-8 py-4 text-[#c9a96e] font-display text-lg tracking-[0.2em] hover:bg-[#c9a96e] hover:text-[#0d0b09] transition-all duration-500"
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    </main>
  );
}
