import { GraphState } from "../state";
import { getLLM } from "../llm";
import { PROMPTS } from "../prompts";
import { finalReportSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";

export const reportGenerationNode = async (
  state: GraphState,
): Promise<Partial<GraphState>> => {
  const companyName = state.normalizedCompanyName ?? state.companyName;
  try {
    const structuredLlm = getLLM(0.2).withStructuredOutput(finalReportSchema, {
      name: "final_report",
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

    return { finalReport: response };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[reportGenerationNode]", message);
    return {
      errors: [...(state.errors ?? []), `Report generation failed: ${message}`],
    };
  }
};
