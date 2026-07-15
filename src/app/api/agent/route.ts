import { type NextRequest, NextResponse } from "next/server";
import { isAgentAuthorized } from "@/lib/agentAuth";
import { runValeAgent } from "@/lib/vale";

export const runtime = "nodejs";

/**
 * Machine-to-machine delegation endpoint. Cappo (AMG) or ALLIE/ALLEN calls this with the
 * shared AGENT_API_KEY to ask Vale a one-off question about HVN showroom activity for
 * HVN<->AMG business coordination. Auth here is the key -- there is no other public
 * surface for this route (distinct from POST /api/vale, which is the public concierge
 * and never accepts free text).
 */
export async function POST(req: NextRequest) {
  if (!isAgentAuthorized(req.headers.get("x-agent-key"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: { task?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* ignore */
  }
  const task = (body.task ?? "").toString().trim();
  if (!task) return NextResponse.json({ error: "task required" }, { status: 400 });
  try {
    const reply = await runValeAgent(task);
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
