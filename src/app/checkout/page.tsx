"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useHavenStore } from "@/lib/store";
import {
  getCartLines,
  getCartTotals,
  formatCurrency,
  generateOrderNumber,
  SHIPPING_METHODS,
} from "@/lib/checkout";
import { ProductSwatch } from "@/components/checkout/ProductSwatch";
import { PreviewBanner } from "@/components/checkout/PreviewBanner";

const inputClass =
  "w-full bg-transparent border-b border-[#c9a96e]/25 focus:border-[#c9a96e] text-sm py-2.5 outline-none font-sans placeholder-[#e8dcc8]/25 transition-colors";
const labelClass = "text-[10px] tracking-[0.25em] uppercase text-[#e8dcc8]/50 font-sans mb-1.5 block";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useHavenStore((state) => state.cart);
  const clearCart = useHavenStore((state) => state.clearCart);
  const setLastOrder = useHavenStore((state) => state.setLastOrder);

  const lines = useMemo(() => getCartLines(cart), [cart]);
  const [shippingMethod, setShippingMethod] = useState<(typeof SHIPPING_METHODS)[number]["id"]>("standard");
  const shippingRate = SHIPPING_METHODS.find((m) => m.id === shippingMethod)!.rate;
  const totals = useMemo(() => getCartTotals(cart, shippingRate), [cart, shippingRate]);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apt: "",
    city: "",
    state: "",
    zip: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0 || submitting) return;
    setSubmitting(true);

    // Mock "payment processing" delay for realism — nothing is actually charged.
    setTimeout(() => {
      setLastOrder({
        orderNumber: generateOrderNumber(),
        items: cart,
        customerName: `${form.firstName} ${form.lastName}`.trim() || "Guest",
        email: form.email || "guest@example.com",
        address: [form.address, form.apt, `${form.city}, ${form.state} ${form.zip}`]
          .filter(Boolean)
          .join(", "),
        total: totals.total,
        placedAt: new Date().toISOString(),
      });
      clearCart();
      router.push("/order-confirmed");
    }, 900);
  };

  if (lines.length === 0) {
    return (
      <main className="min-h-screen bg-[#0d0b09] text-[#e8dcc8]">
        <PreviewBanner />
        <div className="max-w-xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
          <p className="text-[#e8dcc8]/50 font-sans text-sm mb-8">
            Add a piece from the collection before checking out.
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

  return (
    <main className="min-h-screen bg-[#0d0b09] text-[#e8dcc8]">
      <PreviewBanner />

      <header className="flex items-center justify-between px-8 py-6 border-b border-[#c9a96e]/10">
        <Link href="/" className="font-display text-2xl tracking-[0.3em] text-[#c9a96e]">
          HVN
        </Link>
        <p className="text-xs tracking-[0.35em] uppercase text-[#e8dcc8]/50 font-sans">
          <Link href="/cart" className="hover:text-[#e8dcc8] transition-colors">Cart</Link>
          <span className="mx-2 opacity-30">/</span>
          <span className="text-[#c9a96e]">Checkout</span>
        </p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 lg:px-8 py-14 grid lg:grid-cols-[1fr_400px] gap-16">
        {/* Left: forms */}
        <div className="space-y-12 order-2 lg:order-1">
          {/* Contact */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl">Contact</h2>
              <Link href="/" className="text-xs text-[#c9a96e]/70 hover:text-[#c9a96e] font-sans tracking-wide">
                Sign in
              </Link>
            </div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className={inputClass}
              value={form.email}
              onChange={update("email")}
            />
          </section>

          {/* Shipping address */}
          <section>
            <h2 className="font-display text-2xl mb-4">Delivery</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>First name</label>
                <input required placeholder="Jordan" className={inputClass} value={form.firstName} onChange={update("firstName")} />
              </div>
              <div>
                <label className={labelClass}>Last name</label>
                <input required placeholder="Ashford" className={inputClass} value={form.lastName} onChange={update("lastName")} />
              </div>
            </div>
            <div className="mb-4">
              <label className={labelClass}>Address</label>
              <input required placeholder="1200 Bellevue Ave" className={inputClass} value={form.address} onChange={update("address")} />
            </div>
            <div className="mb-4">
              <label className={labelClass}>Apartment, suite, etc. (optional)</label>
              <input placeholder="" className={inputClass} value={form.apt} onChange={update("apt")} />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className={labelClass}>City</label>
                <input required placeholder="Newport" className={inputClass} value={form.city} onChange={update("city")} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input required placeholder="RI" className={inputClass} value={form.state} onChange={update("state")} />
              </div>
              <div>
                <label className={labelClass}>ZIP</label>
                <input required placeholder="02840" className={inputClass} value={form.zip} onChange={update("zip")} />
              </div>
            </div>

            {/* Shipping method */}
            <label className={labelClass}>Shipping method</label>
            <div className="space-y-2">
              {SHIPPING_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between border px-4 py-3 cursor-pointer transition-colors ${
                    shippingMethod === method.id ? "border-[#c9a96e] bg-[#c9a96e]/5" : "border-[#c9a96e]/20"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === method.id}
                      onChange={() => setShippingMethod(method.id)}
                      className="accent-[#c9a96e]"
                    />
                    <span className="font-sans text-sm">
                      {method.label}
                      <span className="block text-xs text-[#e8dcc8]/40">{method.eta}</span>
                    </span>
                  </span>
                  <span className="font-sans text-sm text-[#c9a96e]">{formatCurrency(method.rate)}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Payment */}
          <section>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-2xl">Payment</h2>
              <span className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[#e8dcc8]/40 font-sans">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
                  <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1" />
                </svg>
                Secure
              </span>
            </div>
            <p className="text-xs text-[#e8dcc8]/40 font-sans mb-5">All transactions are simulated for this preview.</p>

            <div className="border border-[#c9a96e]/25 p-5">
              <div className="mb-4">
                <label className={labelClass}>Card number</label>
                <input
                  required
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className={inputClass}
                  value={form.cardNumber}
                  onChange={update("cardNumber")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Expiry (MM / YY)</label>
                  <input required placeholder="08 / 29" className={inputClass} value={form.cardExpiry} onChange={update("cardExpiry")} />
                </div>
                <div>
                  <label className={labelClass}>Security code</label>
                  <input required placeholder="123" maxLength={4} className={inputClass} value={form.cardCvc} onChange={update("cardCvc")} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Name on card</label>
                <input required placeholder="Jordan Ashford" className={inputClass} value={form.cardName} onChange={update("cardName")} />
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={submitting}
            className="w-full border border-[#c9a96e] bg-[#c9a96e] text-[#0d0b09] py-4 font-display text-lg tracking-[0.2em] hover:bg-transparent hover:text-[#c9a96e] transition-all duration-500 disabled:opacity-50 disabled:cursor-wait"
          >
            {submitting ? "Processing…" : `Pay ${formatCurrency(totals.total)}`}
          </button>
        </div>

        {/* Right: order summary */}
        <div className="order-1 lg:order-2 h-fit lg:sticky lg:top-8">
          <div className="glass-card p-8">
            <h2 className="font-display text-xl mb-6">Order Summary</h2>
            <div className="space-y-5 mb-6 max-h-72 overflow-y-auto pr-1">
              {lines.map((line) => (
                <div key={line.productId} className="flex items-center gap-4">
                  <div className="relative">
                    <ProductSwatch accentColor={line.accentColor} initials="HVN" size={52} />
                    <span className="absolute -top-2 -right-2 bg-[#c9a96e] text-[#0d0b09] text-[10px] font-sans w-5 h-5 rounded-full flex items-center justify-center">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans leading-snug truncate">{line.name}</p>
                    <p className="text-xs text-[#e8dcc8]/40 font-sans">{line.collection}</p>
                  </div>
                  <p className="text-sm font-sans text-[#c9a96e] whitespace-nowrap">{formatCurrency(line.lineTotal)}</p>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#c9a96e]/15 mb-5" />

            <div className="space-y-3 text-sm font-sans">
              <div className="flex justify-between text-[#e8dcc8]/70">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#e8dcc8]/70">
                <span>Shipping</span>
                <span>{formatCurrency(totals.shipping)}</span>
              </div>
              <div className="flex justify-between text-[#e8dcc8]/70">
                <span>Estimated tax</span>
                <span>{formatCurrency(totals.tax)}</span>
              </div>
            </div>
            <div className="h-px bg-[#c9a96e]/15 my-5" />
            <div className="flex justify-between font-display text-xl text-[#c9a96e]">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
