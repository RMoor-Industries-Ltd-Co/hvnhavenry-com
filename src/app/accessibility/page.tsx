// INTERNAL NOTE (not shown to visitors): this statement frames WCAG 2.1 AA as a GOAL we are
// working toward, not a claim of full conformance — the site has not had a formal accessibility
// audit, and it is motion-/video-rich. A professional a11y audit is recommended before any
// conformance claim, and counsel review before production reliance. Do not surface this note on
// the rendered page.
import type { Metadata } from "next";
import Link from "next/link";
import { ShopShell } from "@/components/checkout/ShopShell";

export const metadata: Metadata = {
  title: "Accessibility — HVN Havenry",
  description:
    "HVN Havenry's commitment to digital accessibility. We aim to conform to WCAG 2.1 Level AA and welcome feedback on barriers you encounter.",
};

const EFFECTIVE_DATE = "August 31, 2026";
const LAST_UPDATED = "August 31, 2026";
const CONTACT_EMAIL = "accessibility@hvnglobalco.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-9">
      <h2 className="font-display text-xl text-[#c9a96e] mb-3 tracking-wide">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-[#e8dcc8]/80 font-sans">{children}</div>
    </section>
  );
}

export default function AccessibilityPage() {
  return (
    <ShopShell>
      <h1 className="font-display text-4xl lg:text-5xl font-light mb-2">Accessibility</h1>
      <p className="text-xs uppercase tracking-[0.3em] text-[#e8dcc8]/50 font-sans mb-1">
        Effective {EFFECTIVE_DATE}
      </p>
      <p className="text-xs uppercase tracking-[0.3em] text-[#e8dcc8]/40 font-sans mb-10">
        Last updated {LAST_UPDATED}
      </p>

      <Section title="Our commitment">
        <p>
          HVN Havenry, operated by <span className="text-[#e8dcc8]">HVN Global LLC</span>, is committed to
          making this site usable by as many people as possible, including people who rely on assistive
          technologies. We treat accessibility as an ongoing effort rather than a one-time task.
        </p>
      </Section>

      <Section title="Standard we aim for">
        <p>
          We are working toward conforming with the{" "}
          <span className="text-[#e8dcc8]">Web Content Accessibility Guidelines (WCAG) 2.1, Level AA</span>.
          This is a goal we are actively pursuing; it is not a claim that the entire site currently meets
          every criterion. As the site evolves, we intend to keep improving toward that standard.
        </p>
      </Section>

      <Section title="What we are doing">
        <p>Our ongoing efforts include:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>using semantic, structured markup so content is navigable by keyboard and assistive tech;</li>
          <li>providing meaningful text alternatives for imagery that conveys information;</li>
          <li>attending to color contrast and legibility within the site&apos;s dark palette;</li>
          <li>keeping interactive controls — including the concierge&apos;s fixed prompt options — reachable and operable.</li>
        </ul>
      </Section>

      <Section title="Areas we are still improving">
        <p>
          This is a visually rich experience that uses motion, animation, and background video. We are
          continuing to improve support for people who prefer reduced motion and for other assistive needs,
          and some third-party content or assets may not yet fully meet our target. If any part of the site
          creates a barrier for you, we want to hear about it so we can address it and, where needed, provide
          the same information or service through an alternative means.
        </p>
      </Section>

      <Section title="Feedback &amp; requesting assistance">
        <p>
          If you encounter an accessibility barrier, need assistance, or want information in an alternative
          format, please contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            {CONTACT_EMAIL}
          </a>{" "}
          or through our{" "}
          <Link href="/contact" className="text-[#c9a96e] underline underline-offset-4 hover:opacity-80">
            contact page
          </Link>
          . Please describe the issue and the page involved so we can respond effectively. We welcome your
          feedback and aim to respond promptly.
        </p>
      </Section>
    </ShopShell>
  );
}
