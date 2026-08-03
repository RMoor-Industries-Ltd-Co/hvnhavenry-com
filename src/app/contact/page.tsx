"use client";

import { useState } from "react";
import { ShopShell } from "@/components/checkout/ShopShell";

// "Speak to Management" — a mock contact page: a contact form (preview only), a customer
// service phone line, and a service email.
const PHONE_DISPLAY = "888-HVN-CARE";
const PHONE_TEL = "tel:+18884862273"; // HVN=486, CARE=2273
const EMAIL = "service@shophvn.com";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <ShopShell>
      <div className="mb-6 border border-[#c9a96e]/30 bg-[#c9a96e]/5 px-4 py-2 text-[11px] tracking-wide text-[#c9a96e] font-sans">
        Preview Mode — mock contact form. Nothing is sent and no message is stored.
      </div>

      <h1 className="font-display text-4xl lg:text-5xl font-light mb-2">Speak to Management</h1>
      <p className="text-sm text-[#e8dcc8]/70 font-sans mb-10 max-w-xl">
        However you prefer to reach us — a note, a call, or an email — a member of the HVN Havenry team will see it
        through.
      </p>

      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
        {/* Contact form */}
        <div>
          {sent ? (
            <div className="border border-[#c9a96e]/30 bg-[#c9a96e]/5 px-5 py-6">
              <p className="font-display text-xl text-[#c9a96e] mb-1">Thank you.</p>
              <p className="text-sm text-[#e8dcc8]/80 font-sans">
                A member of the HVN Havenry team will respond within one business day.
                <span className="block text-[#e8dcc8]/50 mt-1">(Preview — nothing was actually sent.)</span>
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="flex flex-col gap-4"
            >
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "email", label: "Email", type: "email" },
                { id: "order", label: "Order number (optional)", type: "text" },
              ].map((f) => (
                <label key={f.id} className="block">
                  <span className="block text-[10px] uppercase tracking-[0.3em] text-[#e8dcc8]/60 font-sans mb-1">{f.label}</span>
                  <input
                    type={f.type}
                    required={f.id !== "order"}
                    className="w-full bg-transparent border border-[#c9a96e]/30 px-3 py-2 text-sm text-[#e8dcc8] font-sans focus:border-[#c9a96e] outline-none"
                  />
                </label>
              ))}
              <label className="block">
                <span className="block text-[10px] uppercase tracking-[0.3em] text-[#e8dcc8]/60 font-sans mb-1">Message</span>
                <textarea
                  required
                  rows={5}
                  className="w-full bg-transparent border border-[#c9a96e]/30 px-3 py-2 text-sm text-[#e8dcc8] font-sans focus:border-[#c9a96e] outline-none resize-y"
                />
              </label>
              <button
                type="submit"
                className="self-start bg-[#c9a96e] px-8 py-3 text-[12px] uppercase tracking-[0.2em] text-[#0d0b09] font-sans hover:bg-[#d8bd86] transition-colors cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Direct contact */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]/70 font-sans mb-1">Customer Service</p>
            <a href={PHONE_TEL} className="font-display text-2xl text-[#c9a96e] hover:opacity-80 transition-opacity">
              {PHONE_DISPLAY}
            </a>
            <p className="text-xs text-[#e8dcc8]/50 font-sans mt-1">Mon–Fri, 9am–6pm ET</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]/70 font-sans mb-1">Email</p>
            <a href={`mailto:${EMAIL}`} className="text-sm text-[#e8dcc8] font-sans underline underline-offset-4 decoration-[#c9a96e]/40 hover:text-[#c9a96e] transition-colors">
              {EMAIL}
            </a>
          </div>
          <div className="border-t border-[#c9a96e]/10 pt-6">
            <p className="text-xs text-[#e8dcc8]/50 font-sans leading-relaxed">
              For order-specific questions, include your order number so we can attend to it directly.
            </p>
          </div>
        </div>
      </div>
    </ShopShell>
  );
}
