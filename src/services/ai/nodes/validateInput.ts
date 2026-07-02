import { z } from "zod";
import { GraphState } from "../state";
import { getLLM } from "../llm";
import { PROMPTS } from "../prompts";
import { SystemMessage } from "@langchain/core/messages";

const validationSchema = z.object({
  isValid: z.boolean(),
  normalizedCompanyName: z.string().nullable().optional(),
  error: z.string().nullable().optional(),
});

export const validateInputNode = async (
  state: GraphState,
): Promise<Partial<GraphState>> => {
  const raw = state.companyName?.trim();
  if (!raw) {
    return { isValid: false, errors: ["Company name cannot be empty."] };
  }

  try {
    const structuredLlm = getLLM(0, "meta-llama/llama-3.3-70b-instruct:free").withStructuredOutput(validationSchema, {
      name: "validate_company",
    });

    const response = await structuredLlm.invoke([
      new SystemMessage(PROMPTS.validateInput),
      { role: "user", content: `Company Input: ${raw}` },
    ]);

    if (!response.isValid) {
      return {
        isValid: false,
        errors: [response.error ?? "The provided company name could not be recognized."],
      };
    }

    return {
      isValid: true,
      normalizedCompanyName: response.normalizedCompanyName ?? raw,
    };
  } catch (err: unknown) {
    let message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("401") || message.includes("invalid_api_key")) {
      message = "OpenRouter API Error: The provided API key is invalid or incorrect.";
    } else if (message.includes("429")) {
      message = "OpenRouter API Error: Rate limit exceeded. Please check your OpenRouter dashboard limits.";
    }
    console.error("[validateInputNode]", message);
    return {
      isValid: false,
      errors: [`Input validation failed: ${message}`],
    };
  }
};
