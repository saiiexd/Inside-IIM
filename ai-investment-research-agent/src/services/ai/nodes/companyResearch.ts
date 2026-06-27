import { GraphState } from "../state";
import { getLLM } from "../llm";
import { companyResearchPrompt } from "../prompts";
import { companyResearchSchema } from "../schema";
import { SystemMessage } from "@langchain/core/messages";
import { getTavilySearchTool } from "../tools/tavily";

export const companyResearchNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  try {
    const searchTool = getTavilySearchTool(3);
    const searchResult = await searchTool.invoke(`Comprehensive company overview and facts for ${state.normalizedCompanyName || state.companyName}`);

    const llm = getLLM(0.2);
    const structuredLlm = llm.withStructuredOutput(companyResearchSchema, {
      name: "company_research",
    });

    const response = await structuredLlm.invoke([
      new SystemMessage(companyResearchPrompt.replace("{companyName}", state.normalizedCompanyName || state.companyName)),
      { role: "user", content: `Search Data: ${searchResult}` }
    ]);

    return {
      researchData: response,
    };
  } catch (error) {
    console.error("Error in companyResearchNode:", error);
    return {
      errors: [...(state.errors || []), "An error occurred during company research."],
    };
  }
};
