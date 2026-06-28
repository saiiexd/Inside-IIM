import { GraphState } from "../state";
import { getLLM } from "../llm";
import { PROMPTS } from "../prompts";
import { financialAnalysisSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";
import { getTavilySearchTool } from "../tools/tavily";

export const financialAnalysisNode = async (
  state: GraphState,
): Promise<Partial<GraphState>> => {
  const companyName = state.normalizedCompanyName ?? state.companyName;
  try {
    const searchTool = getTavilySearchTool(5);
    const searchResult = await searchTool.invoke(
      `${companyName} financial results: revenue growth, earnings, profit margin, debt, free cash flow, market cap, valuation 2024`,
    );

    const structuredLlm = getLLM(0.1).withStructuredOutput(financialAnalysisSchema, {
      name: "financial_analysis",
    });

    const context = [
      `Company Overview: ${JSON.stringify(state.researchData)}`,
      `Financial Search Results: ${searchResult}`,
    ].join("\n\n");

    const response = await structuredLlm.invoke([
      new SystemMessage(PROMPTS.financialAnalysis.replace("{companyName}", companyName)),
      { role: "user", content: context },
    ]);

    return { financialData: response };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[financialAnalysisNode]", message);
    return {
      errors: [...(state.errors ?? []), `Financial analysis failed: ${message}`],
    };
  }
};
