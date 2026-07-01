import { NextRequest, NextResponse } from "next/server";
import { investmentResearchGraph } from "@/services/ai/graph";

export const maxDuration = 60; // Extend Vercel hobby tier timeout to max

export async function POST(req: NextRequest) {
  // ── 1. Parse & validate request body ─────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Malformed JSON in request body." },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("companyName" in body) ||
    typeof (body as Record<string, unknown>).companyName !== "string"
  ) {
    return NextResponse.json(
      { error: "Request body must include a non-empty string field: companyName." },
      { status: 400 },
    );
  }

  const companyName = ((body as Record<string, unknown>).companyName as string).trim();
  if (!companyName) {
    return NextResponse.json(
      { error: "companyName must not be empty." },
      { status: 400 },
    );
  }

  // ── 2. Execute the LangGraph workflow ────────────────────────────────────
  try {
    const config = { configurable: { thread_id: crypto.randomUUID() } };
    
    // Execute the compiled state graph with strict typing
    const finalState = await investmentResearchGraph.invoke(
      { companyName, errors: [] },
      config,
    ) as import("@/services/ai/state").GraphState;

    // ── 3. Handle validation failure (unrecognised company) ─────────────────
    if (!finalState.isValid) {
      return NextResponse.json(
        {
          error: "Company validation failed.",
          details: Array.isArray(finalState.errors) ? finalState.errors : [],
        },
        { status: 422 },
      );
    }

    // ── 4. Handle partial / incomplete report ────────────────────────────────
    if (!finalState.finalReport) {
      const errors = Array.isArray(finalState.errors) ? finalState.errors : [];
      console.warn("[/api/analyze] Graph completed without a final report.", errors);
      return NextResponse.json(
        {
          error: "The analysis pipeline could not produce a complete report.",
          details: errors,
        },
        { status: 500 },
      );
    }

    // ── 5. Success ────────────────────────────────────────────────────────────
    return NextResponse.json(finalState.finalReport, { status: 200 });
  } catch (err: unknown) {
    // Mask internal details — only log server-side
    console.error("[/api/analyze] Unhandled error:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
