import { GraphState } from "../state";
import { getLLM } from "../llm";
import { riskAssessmentPrompt } from "../prompts";
import { riskAssessmentSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";

export const riskAssessmentNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  try {
    const llm = getLLM(0.3);
    const structuredLlm = llm.withStructuredOutput(riskAssessmentSchema, {
      name: "risk_assessment",
    });

    const context = `
      Company Research Data: ${JSON.stringify(state.researchData)}
      Financial Analysis Data: ${JSON.stringify(state.financialData)}
      News Analysis Data: ${JSON.stringify(state.newsData)}
    `;

    const response = await structuredLlm.invoke([
      new SystemMessage(riskAssessmentPrompt.replace("{companyName}", state.normalizedCompanyName || state.companyName)),
      { role: "user", content: context }
    ]);

    return {
      riskData: response,
    };
  } catch (error) {
    console.error("Error in riskAssessmentNode:", error);
    return {
      errors: [...(state.errors || []), "An error occurred during risk assessment."],
    };
  }
};
