export const getTavilySearchTool = (maxResults = 5) => {
  return {
    invoke: async (query: string): Promise<string> => {
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) {
        throw new Error("TAVILY_API_KEY is not set.");
      }
      
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          query: query,
          search_depth: "basic",
          include_answer: false,
          include_images: false,
          include_raw_content: false,
          max_results: maxResults,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return JSON.stringify(data.results || data);
    }
  };
};
