import { describe, it, expect } from "vitest";
import { investmentDecisionSchema, finalReportSchema } from "../schema";

describe("AI Output Schema Validation", () => {
  it("should validate a correct investment decision", () => {
    const validDecision = {
      recommendation: "Invest",
      investmentScore: 85,
      confidencePercentage: 90,
      bullCase: ["Strong growth"],
      bearCase: ["High valuation"],
      reasoning: "Solid fundamentals.",
    };
    
    const result = investmentDecisionSchema.safeParse(validDecision);
    expect(result.success).toBe(true);
  });

  it("should reject an investment score above 100", () => {
    const invalidDecision = {
      recommendation: "Invest",
      investmentScore: 105, // Invalid, max is 100
      confidencePercentage: 90,
      bullCase: ["Strong growth"],
      bearCase: ["High valuation"],
      reasoning: "Solid fundamentals.",
    };
    
    const result = investmentDecisionSchema.safeParse(invalidDecision);
    expect(result.success).toBe(false);
  });
  
  it("should reject invalid recommendation enums", () => {
    const invalidDecision = {
      recommendation: "Buy", // Invalid enum, must be Invest, Hold, Pass
      investmentScore: 85,
      confidencePercentage: 90,
      bullCase: ["Strong growth"],
      bearCase: ["High valuation"],
      reasoning: "Solid fundamentals.",
    };
    
    const result = investmentDecisionSchema.safeParse(invalidDecision);
    expect(result.success).toBe(false);
  });
});
