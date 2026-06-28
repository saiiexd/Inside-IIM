import { GraphState } from "../state";
import { getLLM } from "../llm";
import { PROMPTS } from "../prompts";
import { newsAnalysisSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";
import { getTavilySearchTool } from "../tools/tavily";

export const newsAnalysisNode = async (
  state: GraphState,
): Promise<Partial<GraphState>> => {
  const companyName = state.normalizedCompanyName ?? state.companyName;
  try {
    const searchTool = getTavilySearchTool(6);
    const searchResult = await searchTool.invoke(
      `${companyName} latest news 2024 2025: earnings, product launch, layoffs, regulation, lawsuit, leadership, acquisition`,
    );

    const structuredLlm = getLLM(0.1).withStructuredOutput(newsAnalysisSchema, {
      name: "news_analysis",
    });

    const context = [
      `Company Overview: ${JSON.stringify(state.researchData)}`,
      `News Search Results: ${searchResult}`,
    ].join("\n\n");

    const response = await structuredLlm.invoke([
      new SystemMessage(PROMPTS.newsAnalysis.replace("{companyName}", companyName)),
      { role: "user", content: context },
    ]);

    return { newsData: response };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[newsAnalysisNode]", message);
    return {
      errors: [...(state.errors ?? []), `News analysis failed: ${message}`],
    };
  }
};
