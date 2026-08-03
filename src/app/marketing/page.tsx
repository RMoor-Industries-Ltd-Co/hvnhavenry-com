import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/marketing/auth";
import { SignOutButton } from "./SignOutButton";
import {
  type Metric,
  siteMetrics,
  shopKpis,
  trafficSeries,
  inventory,
  vendors,
  integrations,
} from "@/lib/marketing/mock";

export const runtime = "nodejs";
// This dashboard is a gated internal view — never cache or prerender it statically.
export const dynamic = "force-dynamic";

const GOLD = "#c9a96e";

function Delta({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <span className={`text-[11px] font-sans ${up ? "text-emerald-400/80" : "text-red-400/80"}`}>
      {up ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function MetricCard({ m }: { m: Metric }) {
  return (
    <div className="border border-[#c9a96e]/20 bg-[#c9a96e]/[0.03] px-5 py-4">
      <p className="text-[10px] uppercase tracking-[0.25em] text-[#e8dcc8]/50 font-sans mb-2">{m.label}</p>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-display text-2xl text-[#e8dcc8]">{m.value}</span>
        <Delta pct={m.deltaPct} />
      </div>
      <p className="text-[10px] text-[#e8dcc8]/40 font-sans mt-1">{m.hint}</p>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="mb-5 border-b border-[#c9a96e]/15 pb-2">
        <h2 className="font-display text-xl text-[#c9a96e] tracking-wide">{title}</h2>
        {subtitle && <p className="text-xs text-[#e8dcc8]/50 font-sans mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

// A dependency-free CSS bar chart — visits vs organic per month.
function TrafficChart() {
  const max = Math.max(...trafficSeries.map((p) => p.visits));
  return (
    <div className="border border-[#c9a96e]/20 bg-[#c9a96e]/[0.03] px-6 py-6">
      <div className="flex items-end justify-between gap-3 h-48">
        {trafficSeries.map((p) => (
          <div key={p.label} className="flex flex-1 flex-col items-center justify-end gap-1 h-full">
            <div className="flex items-end gap-1 w-full justify-center h-full">
              <div
                className="w-1/3 bg-[#c9a96e]/40"
                style={{ height: `${(p.visits / max) * 100}%` }}
                title={`${p.visits.toLocaleString()} visits`}
              />
              <div
                className="w-1/3 bg-[#c9a96e]"
                style={{ height: `${(p.organic / max) * 100}%` }}
                title={`${p.organic.toLocaleString()} organic`}
              />
            </div>
            <span className="text-[10px] text-[#e8dcc8]/50 font-sans">{p.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-5 mt-5 text-[10px] text-[#e8dcc8]/50 font-sans">
        <span className="flex items-center gap-2"><span className="inline-block h-2 w-3 bg-[#c9a96e]/40" /> Total visits</span>
        <span className="flex items-center gap-2"><span className="inline-block h-2 w-3 bg-[#c9a96e]" /> Organic</span>
      </div>
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  healthy: "text-emerald-400/80",
  low: "text-amber-400/80",
  out: "text-red-400/80",
  active: "text-emerald-400/80",
  onboarding: "text-amber-400/80",
  paused: "text-[#e8dcc8]/40",
  connected: "text-emerald-400/80",
  not_connected: "text-[#e8dcc8]/40",
  mock: "text-amber-400/80",
};

function statusLabel(s: string): string {
  return s.replace(/_/g, " ");
}

export default async function MarketingDashboard() {
  // Gate: a valid, unexpired session cookie is required. `cookies()` is async in this
  // Next version.
  const store = await cookies();
  const email = verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!email) redirect("/marketing/sign-in");

  return (
    <main className="min-h-screen bg-[#0d0b09] text-[#e8dcc8]">
      <header className="border-b border-[#c9a96e]/15 px-6 lg:px-12 py-5 flex items-center justify-between">
        <div>
          <div className="font-display text-2xl tracking-[0.3em] text-[#c9a96e]">HVN</div>
          <p className="text-[9px] tracking-[0.5em] uppercase text-[#c9a96e]/40 font-sans">Marketing Portal</p>
        </div>
        <div className="flex items-center gap-5">
          <span className="hidden sm:block text-[11px] text-[#e8dcc8]/50 font-sans">{email}</span>
          <SignOutButton />
        </div>
      </header>

      <div className="px-6 lg:px-12 py-10 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-3xl lg:text-4xl font-light mb-1" style={{ color: GOLD }}>
            Marketing Dashboard
          </h1>
          <p className="text-sm text-[#e8dcc8]/60 font-sans">
            Vale&apos;s command surface for HVN Havenry — traffic, storefront performance, inventory, and vendors.
          </p>
          <div className="mt-4 inline-block border border-[#c9a96e]/30 bg-[#c9a96e]/5 px-4 py-2 text-[11px] tracking-wide text-[#c9a96e] font-sans">
            Preview Mode — figures are mock data. Live GA &amp; Shopify sources wire in via the Integration Hub below.
          </div>
        </div>

        <Section title="Site Metrics" subtitle="Web traffic and engagement — Google Analytics (GA4)">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {siteMetrics.map((m) => (
              <MetricCard key={m.label} m={m} />
            ))}
          </div>
          <TrafficChart />
        </Section>

        <Section title="Store KPIs" subtitle="Shopify storefront performance — Admin API">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {shopKpis.map((m) => (
              <MetricCard key={m.label} m={m} />
            ))}
          </div>
        </Section>

        <Section title="Inventory" subtitle="Stock levels and reorder thresholds — Shopify products">
          <div className="overflow-x-auto border border-[#c9a96e]/20">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-[#e8dcc8]/50 border-b border-[#c9a96e]/15">
                  <th className="px-4 py-3 font-normal">SKU</th>
                  <th className="px-4 py-3 font-normal">Product</th>
                  <th className="px-4 py-3 font-normal text-right">On hand</th>
                  <th className="px-4 py-3 font-normal text-right">Reorder at</th>
                  <th className="px-4 py-3 font-normal text-right">Price</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((row) => (
                  <tr key={row.sku} className="border-b border-[#c9a96e]/10 last:border-0">
                    <td className="px-4 py-3 text-[#e8dcc8]/60 font-mono text-xs">{row.sku}</td>
                    <td className="px-4 py-3 text-[#e8dcc8]">{row.product}</td>
                    <td className="px-4 py-3 text-right text-[#e8dcc8]/80">{row.onHand}</td>
                    <td className="px-4 py-3 text-right text-[#e8dcc8]/50">{row.reorderAt}</td>
                    <td className="px-4 py-3 text-right text-[#e8dcc8]/80">{row.price}</td>
                    <td className={`px-4 py-3 uppercase text-[11px] tracking-wider ${STATUS_STYLE[row.status]}`}>
                      {statusLabel(row.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Vendors" subtitle="Supplier list and lead times">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((v) => (
              <div key={v.name} className="border border-[#c9a96e]/20 bg-[#c9a96e]/[0.03] px-5 py-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-display text-lg text-[#e8dcc8]">{v.name}</p>
                  <span className={`uppercase text-[10px] tracking-wider ${STATUS_STYLE[v.status]}`}>
                    {statusLabel(v.status)}
                  </span>
                </div>
                <p className="text-xs text-[#e8dcc8]/50 font-sans">{v.category}</p>
                <p className="text-[11px] text-[#e8dcc8]/40 font-sans mt-2">Lead time — {v.leadTimeDays} days</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Integration Hub" subtitle="Connect live data sources — each swaps its mock block for real data">
          <div className="grid gap-4 sm:grid-cols-2">
            {integrations.map((i) => (
              <div key={i.name} className="border border-[#c9a96e]/20 bg-[#c9a96e]/[0.03] px-5 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg text-[#e8dcc8]">{i.name}</p>
                  <p className="text-xs text-[#e8dcc8]/50 font-sans mt-0.5">{i.purpose}</p>
                  <p className="text-[10px] text-[#e8dcc8]/35 font-mono mt-2">{i.envKey}</p>
                </div>
                <span className={`shrink-0 uppercase text-[10px] tracking-wider ${STATUS_STYLE[i.status]}`}>
                  {statusLabel(i.status)}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </main>
  );
}
