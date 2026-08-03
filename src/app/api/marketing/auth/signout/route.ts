import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/marketing/auth";

export const runtime = "nodejs";

/** Clear the marketing session cookie and return to the sign-in page. */
export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/marketing/sign-in", req.nextUrl.origin), { status: 303 });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
