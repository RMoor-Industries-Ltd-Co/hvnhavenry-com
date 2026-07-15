import { timingSafeEqual } from "node:crypto";

// Constant-time string compare -- a plain `===`/`!==` on a secret leaks timing
// information proportional to how many leading characters match, which an attacker
// can use to brute-force the key character-by-character. Same pattern used across
// every other PIAAR M2M endpoint this session (Cappo_Meridian, connection-circle,
// axis-tekhen's hmac.compare_digest) -- built in from day one here rather than
// retrofitted after the fact.
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Validates the x-agent-key header against AGENT_API_KEY (ALLIE/Cappo's shared M2M
 * secret). This is the ONLY way into /api/agent* -- there is no other public surface. */
export function isAgentAuthorized(key: string | null): boolean {
  const expected = process.env.AGENT_API_KEY;
  if (!expected || !key) return false;
  return safeEqual(key, expected);
}
