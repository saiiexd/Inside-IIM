import { GraphState } from "../state";
import { getLLM } from "../llm";
import { financialAnalysisPrompt } from "../prompts";
import { financialAnalysisSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";
import { getTavilySearchTool } from "../tools/tavily";

export const financialAnalysisNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  try {
    const searchTool = getTavilySearchTool(3);
    const searchResult = await searchTool.invoke(`Financial health, earnings, revenue, and valuation for ${state.normalizedCompanyName || state.companyName}`);

    const llm = getLLM(0.2);
    const structuredLlm = llm.withStructuredOutput(financialAnalysisSchema, {
      name: "financial_analysis",
    });

    const context = `
      Company Research Data: ${JSON.stringify(state.researchData)}
      Additional Financial Search Data: ${searchResult}
    `;

    const response = await structuredLlm.invoke([
      new SystemMessage(financialAnalysisPrompt.replace("{companyName}", state.normalizedCompanyName || state.companyName)),
      { role: "user", content: context }
    ]);

    return {
      financialData: response,
    };
  } catch (error) {
    console.error("Error in financialAnalysisNode:", error);
    return {
      errors: [...(state.errors || []), "An error occurred during financial analysis."],
    };
  }
};
