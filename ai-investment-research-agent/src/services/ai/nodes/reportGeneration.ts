import { GraphState } from "../state";
import { getLLM } from "../llm";
import { reportGenerationPrompt } from "../prompts";
import { finalReportSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";

export const reportGenerationNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  try {
    const llm = getLLM(0.3);
    const structuredLlm = llm.withStructuredOutput(finalReportSchema, {
      name: "final_report",
    });

    const context = `
      Company Research Data: ${JSON.stringify(state.researchData)}
      Financial Analysis Data: ${JSON.stringify(state.financialData)}
      News Analysis Data: ${JSON.stringify(state.newsData)}
      SWOT Analysis Data: ${JSON.stringify(state.swotData)}
      Risk Assessment Data: ${JSON.stringify(state.riskData)}
      Investment Decision Data: ${JSON.stringify(state.decisionData)}
    `;

    const response = await structuredLlm.invoke([
      new SystemMessage(reportGenerationPrompt.replace("{companyName}", state.normalizedCompanyName || state.companyName)),
      { role: "user", content: context }
    ]);

    return {
      finalReport: response,
    };
  } catch (error) {
    console.error("Error in reportGenerationNode:", error);
    return {
      errors: [...(state.errors || []), "An error occurred during report generation."],
    };
  }
};
