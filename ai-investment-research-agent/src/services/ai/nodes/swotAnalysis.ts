import { GraphState } from "../state";
import { getLLM } from "../llm";
import { swotAnalysisPrompt } from "../prompts";
import { swotAnalysisSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";

export const swotAnalysisNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  try {
    const llm = getLLM(0.3);
    const structuredLlm = llm.withStructuredOutput(swotAnalysisSchema, {
      name: "swot_analysis",
    });

    const context = `
      Company Research Data: ${JSON.stringify(state.researchData)}
      Financial Analysis Data: ${JSON.stringify(state.financialData)}
      News Analysis Data: ${JSON.stringify(state.newsData)}
    `;

    const response = await structuredLlm.invoke([
      new SystemMessage(swotAnalysisPrompt.replace("{companyName}", state.normalizedCompanyName || state.companyName)),
      { role: "user", content: context }
    ]);

    return {
      swotData: response,
    };
  } catch (error) {
    console.error("Error in swotAnalysisNode:", error);
    return {
      errors: [...(state.errors || []), "An error occurred during SWOT analysis."],
    };
  }
};
