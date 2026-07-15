import { type NextRequest, NextResponse } from "next/server";
import { isAgentAuthorized } from "@/lib/agentAuth";
import { getLastSuccessfulValeReport } from "@/lib/db";

export const runtime = "nodejs";

/**
 * Pull-only: returns Vale's latest cached HVN<->AMG activity report (generated on a
 * schedule by valeReportScheduler.ts), instantly -- no live agent call. Distinct from
 * POST /api/agent, which does live task delegation. Same auth as that endpoint (shared
 * AGENT_API_KEY).
 */
export async function GET(req: NextRequest) {
  if (!isAgentAuthorized(req.headers.get("x-agent-key"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const success = await getLastSuccessfulValeReport();
  if (success) {
    return NextResponse.json(success);
  }
  return NextResponse.json({ reportText: null, generatedAt: null, error: "no report generated yet" });
}
