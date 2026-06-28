import { GraphState } from "../state";
import { getLLM } from "../llm";
import { PROMPTS } from "../prompts";
import { investmentDecisionSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";

export const investmentDecisionNode = async (
  state: GraphState,
): Promise<Partial<GraphState>> => {
  const companyName = state.normalizedCompanyName ?? state.companyName;
  try {
    const structuredLlm = getLLM(0.3).withStructuredOutput(investmentDecisionSchema, {
      name: "investment_decision",
    });

    const systemPrompt = PROMPTS.investmentDecision
      .replace("{companyName}", companyName)
      .replace("{financialAnalysis}", JSON.stringify(state.financialData))
      .replace("{swotAnalysis}", JSON.stringify(state.swotData))
      .replace("{riskAssessment}", JSON.stringify(state.riskData))
      .replace("{newsAnalysis}", JSON.stringify(state.newsData));

    const context = [
      `Company Overview: ${JSON.stringify(state.researchData)}`,
      `Financial Analysis: ${JSON.stringify(state.financialData)}`,
      `News Analysis: ${JSON.stringify(state.newsData)}`,
      `SWOT Analysis: ${JSON.stringify(state.swotData)}`,
      `Risk Assessment: ${JSON.stringify(state.riskData)}`,
    ].join("\n\n");

    const response = await structuredLlm.invoke([
      new SystemMessage(systemPrompt),
      { role: "user", content: context },
    ]);

    return { decisionData: response };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[investmentDecisionNode]", message);
    return {
      errors: [...(state.errors ?? []), `Investment decision failed: ${message}`],
    };
  }
};
