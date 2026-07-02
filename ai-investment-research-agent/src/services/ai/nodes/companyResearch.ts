import { GraphState } from "../state";
import { getLLM } from "../llm";
import { PROMPTS } from "../prompts";
import { companyResearchSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";
import { getTavilySearchTool } from "../tools/tavily";

export const companyResearchNode = async (
  state: GraphState,
): Promise<Partial<GraphState>> => {
  const companyName = state.normalizedCompanyName ?? state.companyName;
  try {
    const searchTool = getTavilySearchTool(3);
    const searchResult = await searchTool.invoke(
      `${companyName} company overview: founded, CEO, headquarters, business model, products, revenue, industry sector`,
    );

    const structuredLlm = getLLM(0.1, "meta-llama/llama-3.3-70b-instruct:free").withStructuredOutput(companyResearchSchema, {
      name: "company_research",
    });

    const response = await structuredLlm.invoke([
      new SystemMessage(PROMPTS.companyResearch.replace("{companyName}", companyName)),
      { role: "user", content: `Web Search Results:\n${searchResult}` },
    ]);

    return { researchData: response };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[companyResearchNode]", message);
    return {
      errors: [...(state.errors ?? []), `Company research failed: ${message}`],
    };
  }
};
