import { GraphState } from "../state";
import { getLLM } from "../llm";
import { PROMPTS } from "../prompts";
import { swotAnalysisSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";

export const swotAnalysisNode = async (
  state: GraphState,
): Promise<Partial<GraphState>> => {
  const companyName = state.normalizedCompanyName ?? state.companyName;
  try {
    const structuredLlm = getLLM(0.1, "qwen/qwen-2.5-72b-instruct:free").withStructuredOutput(swotAnalysisSchema, {
      name: "swot_analysis",
    });

    const context = [
      `Company Overview: ${JSON.stringify(state.researchData)}`,
      `Financial Analysis: ${JSON.stringify(state.financialData)}`,
      `News Analysis: ${JSON.stringify(state.newsData)}`,
    ].join("\n\n");

    const response = await structuredLlm.invoke([
      new SystemMessage(PROMPTS.swotAnalysis.replace("{companyName}", companyName)),
      { role: "user", content: context },
    ]);

    return { swotData: response };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[swotAnalysisNode]", message);
    return {
      errors: [...(state.errors ?? []), `SWOT analysis failed: ${message}`],
    };
  }
};
