import { z } from "zod";
import { GraphState } from "../state";
import { getLLM } from "../llm";
import { PROMPTS } from "../prompts";
import { SystemMessage } from "@langchain/core/messages";

const validationSchema = z.object({
  isValid: z.boolean(),
  normalizedCompanyName: z.string().optional(),
  error: z.string().optional(),
});

export const validateInputNode = async (
  state: GraphState,
): Promise<Partial<GraphState>> => {
  const raw = state.companyName?.trim();
  if (!raw) {
    return { isValid: false, errors: ["Company name cannot be empty."] };
  }

  try {
    const structuredLlm = getLLM(0).withStructuredOutput(validationSchema, {
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
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[validateInputNode]", message);
    return {
      isValid: false,
      errors: [`Input validation failed: ${message}`],
    };
  }
};
