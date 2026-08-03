import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_S,
  createSessionToken,
  isEmailAllowed,
  verifyMagicToken,
} from "@/lib/marketing/auth";

export const runtime = "nodejs";

/**
 * Consume a magic-link token: verify it, mint a session cookie, and redirect into the
 * dashboard. An invalid/expired token (or one for an email no longer allowlisted) bounces
 * back to the sign-in page with an error flag rather than exposing why.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const email = verifyMagicToken(token);

  if (!email || !isEmailAllowed(email)) {
    return NextResponse.redirect(new URL("/marketing/sign-in?error=invalid", req.nextUrl.origin));
  }

  const res = NextResponse.redirect(new URL("/marketing", req.nextUrl.origin));
  res.cookies.set(SESSION_COOKIE, createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
  return res;
}
