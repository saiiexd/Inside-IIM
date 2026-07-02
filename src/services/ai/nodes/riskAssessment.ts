import { GraphState } from "../state";
import { getLLM } from "../llm";
import { PROMPTS } from "../prompts";
import { riskAssessmentSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";

export const riskAssessmentNode = async (
  state: GraphState,
): Promise<Partial<GraphState>> => {
  const companyName = state.normalizedCompanyName ?? state.companyName;
  try {
    const structuredLlm = getLLM(0.1, "google/gemini-2.0-flash-lite-preview-02-05:free").withStructuredOutput(riskAssessmentSchema, {
      name: "risk_assessment",
    });

    const context = [
      `Company Overview: ${JSON.stringify(state.researchData)}`,
      `Financial Analysis: ${JSON.stringify(state.financialData)}`,
      `News Analysis: ${JSON.stringify(state.newsData)}`,
    ].join("\n\n");

    const response = await structuredLlm.invoke([
      new SystemMessage(PROMPTS.riskAssessment.replace("{companyName}", companyName)),
      { role: "user", content: context },
    ]);

    return { riskData: response };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[riskAssessmentNode]", message);
    return {
      errors: [...(state.errors ?? []), `Risk assessment failed: ${message}`],
    };
  }
};
