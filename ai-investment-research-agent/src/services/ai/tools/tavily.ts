import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

export const getTavilySearchTool = (maxResults = 5) => {
  return new TavilySearchResults({
    maxResults,
    apiKey: process.env.TAVILY_API_KEY,
  });
};
