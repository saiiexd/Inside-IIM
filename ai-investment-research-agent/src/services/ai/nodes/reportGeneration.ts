import { z } from "zod";
import { GraphState } from "../state";
import { getLLM } from "../llm";
import { PROMPTS } from "../prompts";
import { SystemMessage } from "@langchain/core/messages";

const executiveSummarySchema = z.object({
  executiveSummary: z.string().describe("A compelling executive summary (3 paragraphs) covering: company profile, financial position + key risks, and final investment thesis."),
});

export const reportGenerationNode = async (
  state: GraphState,
): Promise<Partial<GraphState>> => {
  const companyName = state.normalizedCompanyName ?? state.companyName;
  try {
    const structuredLlm = getLLM(0.2, "meta-llama/llama-3.3-70b-instruct:free").withStructuredOutput(executiveSummarySchema, {
      name: "executive_summary",
    });

    const context = [
      `Company Overview: ${JSON.stringify(state.researchData)}`,
      `Financial Analysis: ${JSON.stringify(state.financialData)}`,
      `News Analysis: ${JSON.stringify(state.newsData)}`,
      `SWOT Analysis: ${JSON.stringify(state.swotData)}`,
      `Risk Assessment: ${JSON.stringify(state.riskData)}`,
      `Investment Decision: ${JSON.stringify(state.decisionData)}`,
    ].join("\n\n");

    const response = await structuredLlm.invoke([
      new SystemMessage(PROMPTS.reportGeneration.replace("{companyName}", companyName)),
      { role: "user", content: context },
    ]);

    const finalReport = {
      companyOverview: state.researchData,
      financialSummary: state.financialData,
      newsSummary: state.newsData,
      swotAnalysis: state.swotData,
      riskAnalysis: state.riskData,
      investmentScore: state.decisionData?.investmentScore ?? 50,
      confidenceScore: state.decisionData?.confidencePercentage ?? 50,
      bullCase: state.decisionData?.bullCase ?? [],
      bearCase: state.decisionData?.bearCase ?? [],
      finalRecommendation: state.decisionData?.recommendation ?? "Hold",
      executiveSummary: response.executiveSummary,
      disclaimer: "Disclaimer: AI-generated analysis only. Not professional financial advice. Always consult a qualified advisor before investing.",
      processingMetadata: {
        timestamp: new Date().toISOString(),
        model: "llama-3.3-70b-instruct:free",
      },
      sources: [
        "Tavily Search API",
        "SEC Filings & Market Reports",
        "Financial News Feeds"
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { finalReport: finalReport as any };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[reportGenerationNode]", message);
    return {
      errors: [...(state.errors ?? []), `Report generation failed: ${message}`],
    };
  }
};
