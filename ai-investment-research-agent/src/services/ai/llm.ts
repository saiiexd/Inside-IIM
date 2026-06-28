import { ChatGroq } from "@langchain/groq";

/** Shared LLM factory – always server-side only. */
export const getLLM = (temperature = 0) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    throw new Error("Missing or invalid Groq API Key. Please add your real key to .env.local");
  }
  return new ChatGroq({
    model: "llama-3.3-70b-versatile",
    maxTokens: 8192,
    temperature,
    apiKey,
  });
};
