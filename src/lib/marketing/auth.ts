import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Marketing-portal auth — a self-contained, stateless magic-link + session scheme.
 *
 * Unlike the public Vale surface (fixed-enum, no login), the marketing dashboard is a
 * gated, internal tool, so an authenticated email session is appropriate here — this
 * does NOT relax Vale's no-free-text rule, which governs the public concierge only.
 *
 * Both the magic-link token and the session cookie are HMAC-signed payloads (no DB rows
 * needed): the server can verify authenticity and expiry from the token alone. Email
 * delivery isn't wired yet ("mock now, wire later"), so `POST /api/marketing/auth/request`
 * returns the link on-screen for now; swapping in a mailer later touches only that route.
 *
 * Secret: MARKETING_SESSION_SECRET. When unset we fall back to a fixed dev secret so the
 * flow still works locally / in previews — tokens minted under the dev secret are, by
 * design, only valid against the dev secret, so this is safe to leave unset off-prod.
 */

export const SESSION_COOKIE = "mkt_session";

const MAGIC_TTL_MS = 15 * 60 * 1000; // magic link valid 15 minutes
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // session valid 7 days

// Two independent purposes so a magic-link token can never be replayed as a session
// cookie or vice-versa (the purpose string is part of the signed payload).
type Purpose = "magic" | "session";

function secret(): string {
  return process.env.MARKETING_SESSION_SECRET || "hvn-marketing-dev-secret-not-for-prod";
}

function b64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function unb64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Mint a signed token of the form `<b64url(json)>.<hmac>`. */
function mint(purpose: Purpose, email: string, ttlMs: number): string {
  const payload = b64url(JSON.stringify({ p: purpose, e: email, x: Date.now() + ttlMs }));
  return `${payload}.${sign(payload)}`;
}

/** Verify a signed token; returns the email if valid, unexpired, and of the right purpose. */
function verify(purpose: Purpose, token: string | undefined | null): string | null {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot < 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!safeEqual(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(unb64url(payload)) as { p?: string; e?: string; x?: number };
    if (data.p !== purpose) return null;
    if (typeof data.e !== "string") return null;
    if (typeof data.x !== "number" || data.x < Date.now()) return null;
    return data.e;
  } catch {
    return null;
  }
}

/**
 * Access control. MARKETING_ALLOWLIST is a comma-separated list of permitted emails
 * (case-insensitive). When empty/unset — the mock default — any well-formed email is
 * allowed, so the portal is testable before the real allowlist is configured.
 */
export function isEmailAllowed(email: string): boolean {
  const raw = process.env.MARKETING_ALLOWLIST?.trim();
  if (!raw) return true;
  const allow = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allow.includes(email.toLowerCase());
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  return EMAIL_RE.test(email) ? email : null;
}

export function createMagicToken(email: string): string {
  return mint("magic", email, MAGIC_TTL_MS);
}

export function verifyMagicToken(token: string | null | undefined): string | null {
  return verify("magic", token);
}

export function createSessionToken(email: string): string {
  return mint("session", email, SESSION_TTL_MS);
}

export function verifySessionToken(token: string | null | undefined): string | null {
  return verify("session", token);
}

export const SESSION_MAX_AGE_S = Math.floor(SESSION_TTL_MS / 1000);
