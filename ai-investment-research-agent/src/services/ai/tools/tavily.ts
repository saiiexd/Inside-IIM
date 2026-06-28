/** Structured Tavily search – native fetch, no @langchain/community dependency. */

interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

interface TavilyResponse {
  results?: TavilyResult[];
}

export const getTavilySearchTool = (maxResults = 5) => {
  return {
    invoke: async (query: string): Promise<string> => {
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) {
        throw new Error("TAVILY_API_KEY environment variable is not set.");
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000); // 15s timeout

      try {
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: apiKey,
            query,
            search_depth: "basic",
            include_answer: false,
            include_images: false,
            include_raw_content: false,
            max_results: maxResults,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Tavily API returned ${response.status}: ${response.statusText}`);
        }

        const data = (await response.json()) as TavilyResponse;
        return JSON.stringify(data.results ?? []);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          throw new Error("Tavily search timed out after 15 seconds.");
        }
        throw err;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
};
