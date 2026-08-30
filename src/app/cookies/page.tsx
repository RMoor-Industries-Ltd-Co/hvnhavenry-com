import type { Metadata } from "next";
import Link from "next/link";
import { ShopShell } from "@/components/checkout/ShopShell";

export const metadata: Metadata = {
  title: "Cookie Notice — HVN Havenry",
  description:
    "The only cookie HVN Havenry uses is a strictly-necessary session cookie for the internal team portal. No analytics, advertising, or third-party cookies.",
};

const EFFECTIVE_DATE = "August 30, 2026";
const CONTACT_EMAIL = "service@shophvn.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="font-display text-xl text-[#c9a96e] mb-3 tracking-wide">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-[#e8dcc8]/80 font-sans">{children}</div>
    </section>
  );
}

export default function CookieNoticePage() {
  return (
    <ShopShell>
      <div className="mb-6 border border-[#c9a96e]/30 bg-[#c9a96e]/5 px-4 py-2 text-[11px] tracking-wide text-[#c9a96e] font-sans">
        Starting draft — please have this reviewed by counsel before relying on it. It is not legal advice.
      </div>

      <h1 className="font-display text-4xl lg:text-5xl font-light mb-2">Cookie Notice</h1>
      <p className="text-xs uppercase tracking-[0.3em] text-[#e8dcc8]/50 font-sans mb-10">
        Effective {EFFECTIVE_DATE}
      </p>

      <Section title="What cookies are">
        <p>
          Cookies are small text files a website can store in your browser. They are commonly used to keep you
          signed in, remember preferences, or measure traffic. This notice explains which cookies HVN Havenry
          uses and why.
        </p>
      </Section>

      <Section title="Ordinary visitors receive no cookies">
        <p>
          Browsing the public HVN Havenry site does not set any cookie. We use no analytics, advertising, or
          social-media cookies, and no third-party tracking pixels or tag managers. Our web fonts are
          self-hosted, so viewing a page does not send a request to a font provider.
        </p>
      </Section>

      <Section title="The one cookie we use">
        <p>
          A single strictly-necessary cookie is set only if you sign in to our internal marketing portal (a
          team-only tool, not a shopper feature):
        </p>
        <div className="overflow-x-auto border border-[#c9a96e]/20 mt-2">
          <table className="w-full text-sm font-sans">
            <tbody className="[&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_th]:px-4 [&_th]:py-3">
              <tr className="border-b border-[#c9a96e]/10">
                <th className="text-left font-normal text-[#e8dcc8]/50 w-40">Name</th>
                <td className="font-mono text-xs text-[#e8dcc8]">mkt_session</td>
              </tr>
              <tr className="border-b border-[#c9a96e]/10">
                <th className="text-left font-normal text-[#e8dcc8]/50">Purpose</th>
                <td className="text-[#e8dcc8]/80">Keeps an authorized team member signed in to the internal marketing portal.</td>
              </tr>
              <tr className="border-b border-[#c9a96e]/10">
                <th className="text-left font-normal text-[#e8dcc8]/50">Type</th>
                <td className="text-[#e8dcc8]/80">Strictly necessary (functional). Not used for analytics or advertising.</td>
              </tr>
              <tr className="border-b border-[#c9a96e]/10">
                <th className="text-left font-normal text-[#e8dcc8]/50">Attributes</th>
                <td className="text-[#e8dcc8]/80">HttpOnly, Secure (in production), SameSite=Lax. First-party only.</td>
              </tr>
              <tr>
                <th className="text-left font-normal text-[#e8dcc8]/50">Duration</th>
                <td className="text-[#e8dcc8]/80">Up to 7 days, or until you sign out.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Because this cookie is strictly necessary to provide a service you have expressly requested (signing
          in), it does not require consent under common cookie rules.
        </p>
      </Section>

      <Section title="Controlling cookies">
        <p>
          You can block or delete cookies through your browser settings. Since the public site sets no cookie,
          this has no effect on ordinary browsing; blocking the one functional cookie would only prevent signing
          in to the internal portal.
        </p>
      </Section>

      <Section title="If this changes">
        <p>
          If we later add measurement (such as website analytics) or a live checkout that introduces
          non-essential cookies, we will update this notice and add appropriate consent controls before those
          cookies are used.
        </p>
      </Section>

      <Section title="Questions">
        <p>
          See our{" "}
          <Link href="/privacy" className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            Privacy Policy
          </Link>{" "}
          for how we handle information generally, or email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </Section>
    </ShopShell>
  );
}
