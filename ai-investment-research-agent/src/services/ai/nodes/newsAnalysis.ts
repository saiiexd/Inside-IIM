import { GraphState } from "../state";
import { getLLM } from "../llm";
import { newsAnalysisPrompt } from "../prompts";
import { newsAnalysisSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";
import { getTavilySearchTool } from "../tools/tavily";

export const newsAnalysisNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  try {
    const searchTool = getTavilySearchTool(4);
    const searchResult = await searchTool.invoke(`Recent news, developments, and press releases for ${state.normalizedCompanyName || state.companyName} within the last 3 months`);

    const llm = getLLM(0.1);
    const structuredLlm = llm.withStructuredOutput(newsAnalysisSchema, {
      name: "news_analysis",
    });

    const context = `
      Company Research Data: ${JSON.stringify(state.researchData)}
      Recent News Data: ${searchResult}
    `;

    const response = await structuredLlm.invoke([
      new SystemMessage(newsAnalysisPrompt.replace("{companyName}", state.normalizedCompanyName || state.companyName)),
      { role: "user", content: context }
    ]);

    return {
      newsData: response,
    };
  } catch (error) {
    console.error("Error in newsAnalysisNode:", error);
    return {
      errors: [...(state.errors || []), "An error occurred during news analysis."],
    };
  }
};
