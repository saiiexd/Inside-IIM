import { NextRequest, NextResponse } from "next/server";
import { investmentResearchGraph } from "@/services/ai/graph";

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

  // ── 2. Handle Mock Mode (Missing API Keys) ──────────────────────────────
  if (
    process.env.NODE_ENV !== "test" &&
    (!process.env.GROQ_API_KEY ||
      process.env.GROQ_API_KEY === "your_groq_api_key_here")
  ) {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 8000));
    
    return NextResponse.json({
      companyOverview: {
        companyName: companyName + " (Mock Data)",
        ticker: "MOCK",
        headquarters: "San Francisco, CA",
        ceo: "Jane Doe",
        foundingYear: 2010,
        industry: "Technology",
        sector: "Software",
        productsAndServices: ["Cloud Platform", "AI Solutions", "Enterprise Software"],
        businessModel: "B2B SaaS subscription model.",
        marketPosition: "Leading innovator in enterprise software.",
        competitiveAdvantages: ["Proprietary AI algorithms", "Strong brand recognition"],
        customerSegments: ["Enterprise", "Mid-market"],
        companyOverview: "This is a mocked response because real API keys were not provided in .env.local. Please add valid Gemini and Tavily keys to see real-time analysis."
      },
      financialSummary: {
        revenueGrowthTrends: "Consistent 20%+ YoY growth over the last 3 years.",
        profitability: "Strong operating margins and positive free cash flow.",
        operatingMargins: "25% operating margin.",
        cashFlowQuality: "High quality, driven by recurring SaaS revenue.",
        debtLevels: "Low debt-to-equity ratio.",
        valuationConcerns: "Trading at a premium multiple relative to peers.",
        marketCapitalization: "$50B+",
        earningsTrends: "Consistently beating consensus estimates.",
        overallFinancialStrength: "Robust financial profile with strong recurring revenue.",
        confidenceLevel: "High"
      },
      newsSummary: {
        positiveCatalysts: ["Recent product launch gained significant traction.", "Expansion into European markets."],
        negativeDevelopments: ["Increased competition from major tech players.", "Slight regulatory scrutiny regarding data privacy."],
        marketSentiment: "Positive",
        recentSummary: "Market sentiment remains bullish following a successful earnings report and strong forward guidance."
      },
      swotAnalysis: {
        strengths: ["Strong recurring revenue base", "High customer retention rate", "Innovative product pipeline"],
        weaknesses: ["High dependency on top 10 customers", "Premium pricing limits down-market penetration"],
        opportunities: ["Expansion into international markets", "Strategic acquisitions in AI space"],
        threats: ["Intense competition from well-funded rivals", "Macroeconomic headwinds impacting enterprise IT spend"]
      },
      riskAnalysis: {
        operationalRisk: { level: "Low", explanation: "Highly resilient cloud infrastructure with 99.99% uptime." },
        financialRisk: { level: "Low", explanation: "Strong balance sheet with significant cash reserves." },
        technologicalRisk: { level: "Medium", explanation: "Must continuously innovate to stay ahead of rapidly evolving AI landscape." },
        regulatoryRisk: { level: "Medium", explanation: "Navigating complex global data privacy regulations (GDPR, CCPA)." },
        competitiveRisk: { level: "High", explanation: "Fierce competition from trillion-dollar tech incumbents." },
        geopoliticalExposure: { level: "Low", explanation: "Primarily domestic revenue, minimal supply chain exposure." },
        executionRisk: { level: "Medium", explanation: "Ambitious product roadmap requires flawless execution." },
        valuationRisk: { level: "High", explanation: "Priced for perfection; any growth deceleration could trigger a multiple compression." },
        macroeconomicSensitivity: { level: "Medium", explanation: "Enterprise IT budgets are sensitive to broader economic conditions." }
      },
      investmentScore: 78,
      confidenceScore: 85,
      bullCase: [
        "Accelerating AI adoption drives sustained revenue growth.",
        "Margin expansion as early investments achieve economies of scale.",
        "Successful penetration of international markets unlocks new TAM."
      ],
      bearCase: [
        "Macroeconomic slowdown causes enterprises to delay software upgrades.",
        "Increased competition forces pricing pressure and compresses margins.",
        "Valuation multiple compresses if revenue growth dips below 20%."
      ],
      finalRecommendation: "Invest",
      executiveSummary: "Based on this mocked analysis, the company exhibits strong financial fundamentals, a solid competitive moat, and positive market sentiment. While valuation and competitive risks remain elevated, the robust recurring revenue and product innovation support a long-term investment thesis. Note: This is simulated data due to missing API keys.",
      disclaimer: "This is a mocked response. No actual financial advice or real data is provided.",
      processingMetadata: {
        timestamp: new Date().toISOString(),
        model: "mock-mode-offline"
      },
      sources: ["Mock Data API"]
    }, { status: 200 });
  }

  // ── 3. Execute the LangGraph workflow ────────────────────────────────────
  try {
    const config = { configurable: { thread_id: crypto.randomUUID() } };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalState = await (investmentResearchGraph as any).invoke(
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
