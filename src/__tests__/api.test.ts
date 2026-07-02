import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks ────────────────────────────────────────────────────────────────────
vi.mock("@/services/ai/graph", () => ({
  investmentResearchGraph: {
    invoke: vi.fn(),
  },
}));

// ── Helpers ──────────────────────────────────────────────────────────────────
import { investmentResearchGraph } from "@/services/ai/graph";

const MOCK_REPORT = {
  companyOverview: {
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    headquarters: "Santa Clara, CA",
    ceo: "Jensen Huang",
    foundingYear: 1993,
    industry: "Semiconductors",
    sector: "Technology",
    productsAndServices: ["GPUs", "AI chips"],
    businessModel: "Fabless semiconductor manufacturer",
    marketPosition: "Global leader in AI accelerators",
    competitiveAdvantages: ["CUDA ecosystem", "AI dominance"],
    customerSegments: ["Data centers", "Gaming", "Automotive"],
    companyOverview: "NVIDIA is the world's leading AI chip maker.",
  },
  financialSummary: {
    revenueGrowthTrends: "Explosive growth driven by AI demand.",
    profitability: "Best-in-class margins.",
    operatingMargins: "~50% operating margin.",
    cashFlowQuality: "Strong free cash flow.",
    debtLevels: "Minimal debt.",
    valuationConcerns: "High valuation premium.",
    marketCapitalization: "$3T+",
    earningsTrends: "Consecutive earnings beats.",
    overallFinancialStrength: "Exceptionally strong.",
    confidenceLevel: "High" as const,
  },
  newsSummary: {
    positiveCatalysts: ["Blackwell chip launch"],
    negativeDevelopments: ["Export restrictions"],
    marketSentiment: "Positive" as const,
    recentSummary: "NVIDIA continues to dominate the AI accelerator market.",
  },
  swotAnalysis: {
    strengths: ["CUDA moat"],
    weaknesses: ["Concentration risk"],
    opportunities: ["Sovereign AI"],
    threats: ["AMD competition"],
  },
  riskAnalysis: {
    operationalRisk: { level: "Low" as const, explanation: "Solid ops." },
    financialRisk: { level: "Low" as const, explanation: "Strong balance sheet." },
    technologicalRisk: { level: "Medium" as const, explanation: "Rapid iteration required." },
    regulatoryRisk: { level: "High" as const, explanation: "US export controls." },
    competitiveRisk: { level: "Medium" as const, explanation: "AMD gaining." },
    geopoliticalExposure: { level: "High" as const, explanation: "China exposure." },
    executionRisk: { level: "Low" as const, explanation: "Strong management." },
    valuationRisk: { level: "High" as const, explanation: "Premium valuation." },
    macroeconomicSensitivity: { level: "Medium" as const, explanation: "Enterprise spending." },
  },
  investmentScore: 82,
  confidenceScore: 78,
  bullCase: ["AI capex supercycle"],
  bearCase: ["Valuation risk"],
  finalRecommendation: "Invest" as const,
  executiveSummary: "NVIDIA is the definitive AI infrastructure play.",
  disclaimer: "For informational purposes only.",
  processingMetadata: {
    timestamp: new Date().toISOString(),
    model: "gemini-1.5-pro",
  },
  sources: ["Web search", "Financial data"],
};

// ── Tests ────────────────────────────────────────────────────────────────────
describe("POST /api/analyze", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 400 for missing companyName", async () => {
    const { POST } = await import("@/app/api/analyze/route");
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  it("returns 422 when validation fails", async () => {
    vi.mocked(investmentResearchGraph.invoke).mockResolvedValue({
      isValid: false,
      errors: ["Company not found: ASDASD123"],
      companyName: "ASDASD123",
    });

    const { POST } = await import("@/app/api/analyze/route");
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ companyName: "ASDASD123" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body).toHaveProperty("error");
  });

  it("returns 200 with full report for valid company", async () => {
    vi.mocked(investmentResearchGraph.invoke).mockResolvedValue({
      isValid: true,
      normalizedCompanyName: "NVIDIA Corporation",
      errors: [],
      finalReport: MOCK_REPORT,
    });

    const { POST } = await import("@/app/api/analyze/route");
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ companyName: "NVIDIA" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("finalRecommendation");
    expect(body).toHaveProperty("investmentScore");
    expect(body.companyOverview.companyName).toBe("NVIDIA Corporation");
  });

  it("returns 400 for malformed JSON", async () => {
    const { POST } = await import("@/app/api/analyze/route");
    const req = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: "this is not json",
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(400);
  });
});
