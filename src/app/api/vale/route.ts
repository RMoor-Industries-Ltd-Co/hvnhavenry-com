import { NextRequest, NextResponse } from "next/server";
import { generateValeReply, isValePromptKey } from "@/lib/vale";
import { PRODUCTS, type ProductId } from "@/lib/products";
import { logValeInteraction } from "@/lib/db";

export const runtime = "nodejs";

function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && value in PRODUCTS;
}

// Best-effort in-memory sliding-window rate limit, keyed by IP. Resets on redeploy --
// acceptable for a low-traffic marketing site's concierge widget. This is defense in
// depth, not the primary safety mechanism: the real guarantee is that promptKey/productId
// are the ONLY inputs accepted below, both validated against fixed enums, so there is no
// free-form text path into the model regardless of rate limit state.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 30;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const promptKey = body.promptKey;
  if (!isValePromptKey(promptKey)) {
    return NextResponse.json({ error: "invalid_prompt_key" }, { status: 400 });
  }

  const rawProductId = body.productId;
  let productId: ProductId | undefined;
  if (rawProductId !== undefined) {
    if (!isProductId(rawProductId)) {
      return NextResponse.json({ error: "invalid_product_id" }, { status: 400 });
    }
    productId = rawProductId;
  }

  const result = await generateValeReply(promptKey, productId);

  // Best-effort: never let a logging hiccup break a visitor's reply.
  logValeInteraction(promptKey, productId).catch(() => {});

  return NextResponse.json(result);
}
