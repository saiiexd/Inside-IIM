import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

/** Shared LLM factory – always server-side only. */
export const getLLM = (temperature = 0) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set.");
  return new ChatGoogleGenerativeAI({
    model: "gemini-1.5-pro",
    maxOutputTokens: 8192,
    temperature,
    apiKey,
  });
};
