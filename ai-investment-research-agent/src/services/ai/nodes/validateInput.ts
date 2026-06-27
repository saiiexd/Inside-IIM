import { z } from "zod";
import { GraphState } from "../state";
import { getLLM } from "../llm";
import { validateInputPrompt } from "../prompts";
import { SystemMessage } from "@langchain/core/messages";

const validationSchema = z.object({
  isValid: z.boolean(),
  normalizedCompanyName: z.string().optional(),
  error: z.string().optional(),
});

export const validateInputNode = async (state: GraphState): Promise<Partial<GraphState>> => {
  try {
    if (!state.companyName || state.companyName.trim() === "") {
      return {
        isValid: false,
        errors: ["Company name cannot be empty"],
      };
    }

    const llm = getLLM(0);
    const structuredLlm = llm.withStructuredOutput(validationSchema, {
      name: "validate_company",
    });

    const response = await structuredLlm.invoke([
      new SystemMessage(validateInputPrompt),
      { role: "user", content: `Company Input: ${state.companyName}` }
    ]);

    if (!response.isValid) {
      return {
        isValid: false,
        errors: [response.error || "Invalid company name provided."],
      };
    }

    return {
      isValid: true,
      normalizedCompanyName: response.normalizedCompanyName || state.companyName,
    };
  } catch (error) {
    console.error("Error in validateInputNode:", error);
    return {
      isValid: false,
      errors: ["An error occurred during input validation."],
    };
  }
};
