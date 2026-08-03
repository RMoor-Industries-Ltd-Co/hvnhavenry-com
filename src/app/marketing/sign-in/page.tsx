"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

// Marketing-portal sign-in: request a magic link by email. Email delivery isn't wired
// yet ("mock now, wire later"), so the returned link is shown on-screen to follow.
function SignInForm() {
  const params = useSearchParams();
  const initialError = params.get("error") === "invalid" ? "That sign-in link was invalid or expired. Request a new one." : "";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState(initialError);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    setLink(null);
    try {
      const res = await fetch("/api/marketing/auth/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Please enter a valid email address.");
        setStatus("idle");
        return;
      }
      setLink(typeof data.link === "string" ? data.link : null);
      setStatus("sent");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0b09] text-[#e8dcc8] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="font-display text-3xl tracking-[0.3em] text-[#c9a96e]">HVN</div>
          <p className="text-[#c9a96e] opacity-40 text-[10px] tracking-[0.5em] uppercase font-sans mt-1">
            Marketing Portal
          </p>
        </div>

        {status === "sent" ? (
          <div className="border border-[#c9a96e]/30 bg-[#c9a96e]/5 px-6 py-8">
            <p className="font-display text-xl text-[#c9a96e] mb-2">Check your inbox</p>
            <p className="text-sm text-[#e8dcc8]/70 font-sans leading-relaxed">
              If <span className="text-[#e8dcc8]">{email}</span> is authorized, a sign-in link is on its way.
            </p>
            {link && (
              <div className="mt-5 border-t border-[#c9a96e]/15 pt-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]/70 font-sans mb-2">
                  Preview mode — email not wired
                </p>
                <a
                  href={link}
                  className="block break-all text-xs text-[#c9a96e] underline underline-offset-4 font-sans hover:opacity-80"
                >
                  {link}
                </a>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <label className="block">
              <span className="block text-[10px] uppercase tracking-[0.3em] text-[#e8dcc8]/60 font-sans mb-2">
                Work email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@rmasters.group"
                className="w-full bg-transparent border border-[#c9a96e]/30 px-3 py-3 text-sm text-[#e8dcc8] font-sans focus:border-[#c9a96e] outline-none"
              />
            </label>
            {error && <p className="text-xs text-red-400/80 font-sans">{error}</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-[#c9a96e] px-8 py-3 text-[12px] uppercase tracking-[0.2em] text-[#0d0b09] font-sans hover:bg-[#d8bd86] transition-colors cursor-pointer disabled:opacity-50"
            >
              {status === "loading" ? "Sending…" : "Send sign-in link"}
            </button>
            <p className="text-[11px] text-[#e8dcc8]/40 font-sans leading-relaxed mt-2">
              Access is limited to authorized HVN Havenry team members.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

export default function MarketingSignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
