import { NextRequest, NextResponse } from "next/server";
import { investmentResearchGraph } from "@/services/ai/graph";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName } = body;

    if (!companyName || typeof companyName !== "string" || companyName.trim() === "") {
      return NextResponse.json(
        { error: "Invalid or missing companyName in request body." },
        { status: 400 }
      );
    }

    const threadId = crypto.randomUUID();
    const config = { configurable: { thread_id: threadId } };

    // Initial state
    const initialState = {
      companyName: companyName.trim(),
      errors: [],
    };

    const finalState = await investmentResearchGraph.invoke(initialState, config);

    if (!finalState.isValid) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: finalState.errors 
        },
        { status: 422 }
      );
    }

    if (Array.isArray(finalState.errors) && finalState.errors.length > 0) {
      console.warn("Graph executed with errors:", finalState.errors);
      // Return 207 Multi-Status or 200 with error details if we got a partial report
      if (!finalState.finalReport) {
         return NextResponse.json(
          { error: "Analysis failed to complete.", details: finalState.errors },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(finalState.finalReport, { status: 200 });

  } catch (error: any) {
    console.error("API /analyze error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
