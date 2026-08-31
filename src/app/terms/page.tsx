// INTERNAL NOTE (not shown to visitors): starting draft written to match the site's current
// capabilities (no live checkout/payments today). Legal counsel review is REQUIRED before
// production reliance, and the governing-law jurisdiction + venue must be finalized with counsel
// (currently phrased generally as "the state in which HVN Global LLC is organized"). Do not
// surface this note on the rendered page.
import type { Metadata } from "next";
import Link from "next/link";
import { ShopShell } from "@/components/checkout/ShopShell";

export const metadata: Metadata = {
  title: "Terms & Conditions — HVN Havenry",
  description:
    "The terms governing your use of the HVN Havenry site, operated by HVN Global LLC. Written to reflect the site's current capabilities.",
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

export default function TermsPage() {
  return (
    <ShopShell>
      <h1 className="font-display text-4xl lg:text-5xl font-light mb-2">Terms &amp; Conditions</h1>
      <p className="text-xs uppercase tracking-[0.3em] text-[#e8dcc8]/50 font-sans mb-1">
        Effective {EFFECTIVE_DATE}
      </p>
      <p className="text-xs uppercase tracking-[0.3em] text-[#e8dcc8]/40 font-sans mb-10">
        Last updated {LAST_UPDATED}
      </p>

      <Section title="Agreement to these terms">
        <p>
          This website is operated by <span className="text-[#e8dcc8]">HVN Global LLC</span> (&quot;HVN
          Global,&quot; &quot;we,&quot; &quot;us&quot;); HVN Havenry is our brand and experience. By
          accessing or using this site, you agree to these Terms &amp; Conditions and our{" "}
          <Link href="/privacy" className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            Privacy Policy
          </Link>
          . If you do not agree, please do not use the site.
        </p>
      </Section>

      <Section title="Permitted use of the site">
        <p>You may use the site for lawful, personal, non-commercial purposes. You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>use the site in any way that violates applicable law or infringes another&apos;s rights;</li>
          <li>scrape, harvest, or systematically extract data, or interfere with the site&apos;s operation or security;</li>
          <li>misuse the concierge, or attempt to submit content to it outside its provided options;</li>
          <li>attempt to access any non-public area, including the internal team portal, without authorization.</li>
        </ul>
      </Section>

      <Section title="Intellectual property">
        <p>
          The site and its content — including text, imagery, video, design, the HVN brand and marks, and
          the HVN lexicon — are owned by HVN Global LLC or its licensors and are protected by intellectual
          property laws. You are granted a limited, personal, non-exclusive license to view the site. You
          may not copy, reproduce, distribute, or create derivative works from our content without our prior
          written permission.
        </p>
      </Section>

      <Section title="Product and pricing information">
        <p>
          Product descriptions, imagery, availability, and prices are presented for general information and
          may change without notice, and may occasionally contain errors. The site does{" "}
          <span className="text-[#e8dcc8]">not currently offer live purchase or checkout</span>; any
          purchase-style flow shown is illustrative only. Nothing on the site is an offer to sell, and no
          contract of sale is formed through it at this time.
        </p>
      </Section>

      <Section title="Portal access">
        <p>
          The internal marketing portal is restricted to authorized team members and is not a shopper
          feature. If you are granted access, you are responsible for keeping your sign-in link and access
          confidential, for all activity under your access, and for not sharing or misusing it.
        </p>
      </Section>

      <Section title="The concierge (Vale)">
        <p>
          The on-site concierge provides general, informational responses drawn from a fixed set of prompt
          options — there is no free-text input. Its responses are for convenience only and are{" "}
          <span className="text-[#e8dcc8]">not professional, legal, medical, or financial advice</span>.
          Do not rely on the concierge as a substitute for professional judgment, and verify anything
          important independently.
        </p>
      </Section>

      <Section title="Third-party services">
        <p>
          The site relies on third-party providers — including hosting, media storage (Google Drive), and
          the AI that powers the concierge (Anthropic). Their services are governed by their own terms and
          policies, and we are not responsible for third-party services, content, or systems outside our
          reasonable control.
        </p>
      </Section>

      <Section title="Disclaimers">
        <p>
          The site and the concierge are provided on an &quot;as is&quot; and &quot;as available&quot;
          basis. To the fullest extent permitted by law, HVN Global LLC disclaims all warranties, express
          or implied, including merchantability, fitness for a particular purpose, and non-infringement, and
          does not warrant that the site will be uninterrupted, error-free, or secure.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, HVN Global LLC and its owners, officers, employees, and
          service providers will not be liable for any indirect, incidental, special, consequential, or
          punitive damages, or for lost profits or data, arising out of or relating to your use of (or
          inability to use) the site or concierge, even if advised of the possibility of such damages.
        </p>
      </Section>

      <Section title="Indemnification">
        <p>
          You agree to indemnify and hold harmless HVN Global LLC and its owners, officers, employees, and
          service providers from any claims, losses, liabilities, and expenses (including reasonable legal
          fees) arising out of your misuse of the site or your violation of these terms or applicable law.
        </p>
      </Section>

      <Section title="Governing law">
        <p>
          These terms are governed by the laws of the state in which HVN Global LLC is organized, without
          regard to its conflict-of-laws rules, and you agree to the exclusive jurisdiction and venue of the
          courts located there for any dispute arising from these terms or your use of the site, to the
          extent permitted by law.
        </p>
      </Section>

      <Section title="Changes to these terms">
        <p>
          We may update these terms from time to time. Changes take effect when posted, and your continued
          use of the site after a change means you accept the updated terms. Material changes will be
          reflected in the effective and last-updated dates above. When we introduce commerce — checkout,
          payments, shipping, and returns — we will add the corresponding purchase terms before those
          features go live.
        </p>
      </Section>

      <Section title="Contact us">
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            {CONTACT_EMAIL}
          </a>{" "}
          or reach us through our{" "}
          <Link href="/contact" className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            contact page
          </Link>
          .
        </p>
      </Section>
    </ShopShell>
  );
}
