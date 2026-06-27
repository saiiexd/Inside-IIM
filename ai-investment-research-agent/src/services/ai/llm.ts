import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const getLLM = (temperature = 0) => {
  return new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-pro",
    maxOutputTokens: 8192,
    temperature,
    apiKey: process.env.GEMINI_API_KEY,
  });
};
