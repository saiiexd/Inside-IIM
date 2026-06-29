import { ChatOpenAI } from "@langchain/openai";

export const getLLM = (temperature = 0) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === "your_openrouter_api_key_here") {
    throw new Error("Missing or invalid OpenRouter API Key. Please add your real key to .env.local");
  }
  return new ChatOpenAI({
    model: "meta-llama/llama-3.3-70b-instruct:free",
    temperature,
    apiKey,
    maxRetries: 10,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Investment Research Agent",
      },
    },
  });
};
