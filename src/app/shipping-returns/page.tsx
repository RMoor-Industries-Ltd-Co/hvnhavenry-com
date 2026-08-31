// INTERNAL NOTE (not shown to visitors): this is a deliberate INTERIM page. The site is not
// selling or shipping yet, and the fulfillment/returns model (carriers, processing/delivery
// windows, return eligibility, refund timing, damaged-item handling, final-sale rules) is not
// established — so nothing operational is asserted here. Replace this with the concrete Shipping
// & Returns policy once that model exists. Counsel review required before production reliance.
// Do not surface this note on the rendered page.
import type { Metadata } from "next";
import Link from "next/link";
import { ShopShell } from "@/components/checkout/ShopShell";

export const metadata: Metadata = {
  title: "Shipping & Returns — HVN Havenry",
  description:
    "HVN Havenry is not yet selling or shipping through this site. Full shipping and returns terms will be published before checkout goes live.",
};

const EFFECTIVE_DATE = "August 31, 2026";
const LAST_UPDATED = "August 31, 2026";
const CONTACT_EMAIL = "legal@hvnglobalco.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="font-display text-xl text-[#c9a96e] mb-3 tracking-wide">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-[#e8dcc8]/80 font-sans">{children}</div>
    </section>
  );
}

export default function ShippingReturnsPage() {
  return (
    <ShopShell>
      <h1 className="font-display text-4xl lg:text-5xl font-light mb-2">Shipping &amp; Returns</h1>
      <p className="text-xs uppercase tracking-[0.3em] text-[#e8dcc8]/50 font-sans mb-1">
        Effective {EFFECTIVE_DATE}
      </p>
      <p className="text-xs uppercase tracking-[0.3em] text-[#e8dcc8]/40 font-sans mb-10">
        Last updated {LAST_UPDATED}
      </p>

      <Section title="Where things stand">
        <p>
          HVN Havenry, operated by <span className="text-[#e8dcc8]">HVN Global LLC</span>, is not
          currently selling or shipping products through this site. There is no live checkout yet, so we
          have not published shipping or return terms.
        </p>
      </Section>

      <Section title="What this means today">
        <p>
          No orders are being accepted or fulfilled at this time. Any purchase-style flow you may see on
          the site is illustrative only and does not create an order or a contract of sale, consistent
          with our{" "}
          <Link href="/terms" className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            Terms &amp; Conditions
          </Link>
          .
        </p>
      </Section>

      <Section title="Before we begin selling">
        <p>
          We will publish complete Shipping &amp; Returns terms <span className="text-[#e8dcc8]">before</span>{" "}
          checkout goes live. Those terms will address, among other things:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>the regions we serve and the carriers we use;</li>
          <li>order processing and delivery timeframes;</li>
          <li>shipping costs and how they are calculated;</li>
          <li>return eligibility and the return window;</li>
          <li>how refunds are issued and when;</li>
          <li>handling of damaged, lost, or delayed shipments;</li>
          <li>any items sold as final sale.</li>
        </ul>
        <p className="text-[#e8dcc8]/60">
          Until those terms are published, none of the above should be assumed — they will be defined
          when we begin selling.
        </p>
      </Section>

      <Section title="Questions">
        <p>
          In the meantime, you can reach us through our{" "}
          <Link href="/contact" className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            contact page
          </Link>{" "}
          or by email at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </ShopShell>
  );
}
