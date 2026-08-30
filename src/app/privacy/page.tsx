// INTERNAL NOTE (not shown to visitors): this policy is a starting draft written to match
// the site's current behavior. Legal counsel review is REQUIRED before production launch,
// and legal-entity/jurisdiction specifics should be confirmed. Do not surface this note on
// the rendered page.
import type { Metadata } from "next";
import Link from "next/link";
import { ShopShell } from "@/components/checkout/ShopShell";

export const metadata: Metadata = {
  title: "Privacy Policy — HVN Havenry",
  description:
    "How HVN Havenry, operated by HVN Global LLC, handles your information: what we collect, what we don't, and your choices.",
};

const EFFECTIVE_DATE = "August 30, 2026";
const LAST_UPDATED = "August 30, 2026";
const CONTACT_EMAIL = "privacy@hvnglobalco.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="font-display text-xl text-[#c9a96e] mb-3 tracking-wide">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-[#e8dcc8]/80 font-sans">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <ShopShell>
      <h1 className="font-display text-4xl lg:text-5xl font-light mb-2">Privacy Policy</h1>
      <p className="text-xs uppercase tracking-[0.3em] text-[#e8dcc8]/50 font-sans mb-1">
        Effective {EFFECTIVE_DATE}
      </p>
      <p className="text-xs uppercase tracking-[0.3em] text-[#e8dcc8]/40 font-sans mb-10">
        Last updated {LAST_UPDATED}
      </p>

      <Section title="Who we are">
        <p>
          HVN Havenry is operated by <span className="text-[#e8dcc8]">HVN Global LLC</span> (&quot;HVN
          Global,&quot; &quot;we,&quot; &quot;us&quot;). HVN Havenry is our customer-facing brand and
          experience for atmosphere, ritual, and elevated-living goods. This policy explains what
          information we handle when you visit this site, and the choices you have.
        </p>
      </Section>

      <Section title="What we collect">
        <p>We keep data collection deliberately minimal:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="text-[#e8dcc8]">Browsing the public site.</span> No account or cookie is
            required to view the site, and ordinary visitors are not assigned a cookie. Our hosting
            provider processes standard technical request logs (such as IP address and browser type) to
            serve pages and keep the site secure.
          </li>
          <li>
            <span className="text-[#e8dcc8]">Marketing portal sign-in.</span> Our internal marketing
            dashboard is restricted to authorized team members and uses a passwordless &quot;magic
            link&quot; sent to a work email address. If you sign in, we process that email address to
            authenticate you. This is not a feature for general shoppers.
          </li>
          <li>
            <span className="text-[#e8dcc8]">Contacting us.</span> If you send us a message through a
            contact form, we use the details you provide (such as name, email, and message) to respond.
            Where a form is shown in preview mode, nothing is submitted or stored.
          </li>
          <li>
            <span className="text-[#e8dcc8]">Concierge interactions.</span> See the dedicated section
            below — the on-site concierge collects no free-text input and no personally identifiable
            information.
          </li>
        </ul>
      </Section>

      <Section title="The concierge (Vale)">
        <p>Our on-site concierge is designed to avoid collecting personal information:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <span className="text-[#e8dcc8]">Conversational input.</span> The concierge accepts only a
            fixed set of predefined prompt choices. There is no free-text field anywhere in the flow, so
            your own words are never sent to it or stored.
          </li>
          <li>
            <span className="text-[#e8dcc8]">Operational logs.</span> We record only aggregate,
            non-identifying counts — which type of prompt was chosen and which product it referred to.
            We do not record who you are.
          </li>
          <li>
            <span className="text-[#e8dcc8]">Analytics use.</span> These counts are used for internal
            operational reporting only — not for advertising, profiling, or cross-site tracking.
          </li>
          <li>
            <span className="text-[#e8dcc8]">Retention.</span> Concierge data is kept only in
            summarized/aggregate form.
          </li>
          <li>
            <span className="text-[#e8dcc8]">Personal information.</span> No personally identifiable
            information is intentionally collected or retained through the concierge.
          </li>
        </ul>
      </Section>

      <Section title="What we do not do">
        <ul className="list-disc pl-5 space-y-2">
          <li>The site currently does not use third-party analytics, advertising, or social-media tracking cookies or pixels.</li>
          <li>We do not currently track you across other websites, and we do not run a tag manager.</li>
          <li>We do not sell or rent your personal information.</li>
          <li>Web fonts are self-hosted, so viewing the site does not send a request to a font provider.</li>
        </ul>
      </Section>

      <Section title="Cookies">
        <p>
          The public site sets no cookies. The only cookie we use is a strictly-necessary session cookie
          for the internal marketing portal described above. For the full details, see our{" "}
          <Link href="/cookies" className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            Cookie Notice
          </Link>
          .
        </p>
      </Section>

      <Section title="Service providers">
        <p>
          We rely on a small number of trusted providers to run the site — for hosting, for storing brand
          and product media (Google Drive), and for the AI that powers the concierge (Anthropic), which
          processes a fixed set of prompts on our servers. These providers process information only to
          perform services for us.
        </p>
      </Section>

      <Section title="How long we keep information">
        <p>
          We keep information only as long as needed for the purpose it was collected — for example, a
          portal sign-in session lasts up to seven days, and aggregate concierge counts are retained in
          summarized form for operational reporting. Contact messages are kept as long as needed to
          handle your inquiry.
        </p>
      </Section>

      <Section title="Your choices and rights">
        <p>
          Depending on where you live, you may have rights to access, correct, or delete personal
          information we hold about you, or to object to certain processing. To make a request, contact us
          at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            {CONTACT_EMAIL}
          </a>{" "}
          and we will respond as required by applicable law.
        </p>
      </Section>

      <Section title="Children's privacy">
        <p>The site is intended for adults and is not directed to children, and we do not knowingly
          collect personal information from children.</p>
      </Section>

      <Section title="As our services grow">
        <p>
          We do not currently offer on-site checkout. When we introduce commerce, we will update this
          policy to cover the information that entails — including payment processors, order fulfillment,
          shipping information, fraud prevention, customer accounts, transactional communications, and the
          applicable service providers — before those features go live.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          If our data practices change — for example, if we add analytics, advertising, or a live checkout
          — we will update this policy and, where required, introduce appropriate cookie-consent controls.
          Material changes will be reflected in the effective and last-updated dates above.
        </p>
      </Section>

      <Section title="Contact us">
        <p>
          Questions about this policy or your information? Email{" "}
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
