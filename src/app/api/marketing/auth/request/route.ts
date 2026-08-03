import { NextRequest, NextResponse } from "next/server";
import { createMagicToken, isEmailAllowed, normalizeEmail } from "@/lib/marketing/auth";

export const runtime = "nodejs";

/**
 * Request a marketing-portal magic link. Accepts `{ email }`, and — because email
 * delivery isn't wired yet ("mock now, wire later") — returns the sign-in link directly
 * in the response for the sign-in page to display. When a mailer is added, send the link
 * by email instead and stop returning it here.
 *
 * Always responds 200 with `{ ok: true }` even for a disallowed email, so the endpoint
 * never reveals which addresses are on the allowlist (only allowed emails get a `link`).
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  if (!isEmailAllowed(email)) {
    // Do not disclose allowlist membership — same shape as the success path, no link.
    return NextResponse.json({ ok: true });
  }

  const token = createMagicToken(email);
  const origin = req.nextUrl.origin;
  const link = `${origin}/api/marketing/auth/verify?token=${encodeURIComponent(token)}`;

  // `link` is returned only until a real mailer is wired (see route doc above).
  return NextResponse.json({ ok: true, link, mock: true });
}
