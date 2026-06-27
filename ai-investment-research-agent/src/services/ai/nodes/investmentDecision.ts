import { GraphState } from "../state";
import { getLLM } from "../llm";
import { investmentDecisionPrompt } from "../prompts";
import { investmentDecisionSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";

export const investmentDecisionNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  try {
    const llm = getLLM(0.4);
    const structuredLlm = llm.withStructuredOutput(investmentDecisionSchema, {
      name: "investment_decision",
    });

    const context = `
      Company Research Data: ${JSON.stringify(state.researchData)}
      Financial Analysis Data: ${JSON.stringify(state.financialData)}
      News Analysis Data: ${JSON.stringify(state.newsData)}
      SWOT Analysis Data: ${JSON.stringify(state.swotData)}
      Risk Assessment Data: ${JSON.stringify(state.riskData)}
    `;

    const response = await structuredLlm.invoke([
      new SystemMessage(
        investmentDecisionPrompt
          .replace("{companyName}", state.normalizedCompanyName || state.companyName)
          .replace("{financialAnalysis}", JSON.stringify(state.financialData))
          .replace("{swotAnalysis}", JSON.stringify(state.swotData))
          .replace("{riskAssessment}", JSON.stringify(state.riskData))
          .replace("{newsAnalysis}", JSON.stringify(state.newsData))
      ),
      { role: "user", content: context }
    ]);

    return {
      decisionData: response,
    };
  } catch (error) {
    console.error("Error in investmentDecisionNode:", error);
    return {
      errors: [...(state.errors || []), "An error occurred during investment decision."],
    };
  }
};
