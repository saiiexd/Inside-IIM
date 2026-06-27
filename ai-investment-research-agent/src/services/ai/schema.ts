import { z } from "zod";

export const companyResearchSchema = z.object({
  companyName: z.string().describe("The official name of the company"),
  ticker: z.string().optional().describe("The stock ticker symbol if available"),
  headquarters: z.string().describe("Headquarters location"),
  ceo: z.string().describe("Current CEO"),
  foundingYear: z.number().describe("Year the company was founded"),
  industry: z.string().describe("Primary industry"),
  sector: z.string().describe("Primary sector"),
  productsAndServices: z.array(z.string()).describe("Key products and services"),
  businessModel: z.string().describe("Brief description of how the company makes money"),
  marketPosition: z.string().describe("Current position in the market"),
  competitiveAdvantages: z.array(z.string()).describe("Main competitive advantages"),
  customerSegments: z.array(z.string()).describe("Primary customer segments"),
  companyOverview: z.string().describe("A concise 1-2 paragraph overview of the company"),
});

export const financialAnalysisSchema = z.object({
  revenueGrowthTrends: z.string().describe("Assessment of revenue growth over time"),
  profitability: z.string().describe("Assessment of current profitability"),
  operatingMargins: z.string().describe("Analysis of operating margins"),
  cashFlowQuality: z.string().describe("Assessment of cash flow stability and quality"),
  debtLevels: z.string().describe("Analysis of debt and leverage"),
  valuationConcerns: z.string().describe("Any concerns regarding current valuation"),
  marketCapitalization: z.string().optional().describe("Estimated market capitalization"),
  earningsTrends: z.string().describe("Recent earnings trends and surprises"),
  overallFinancialStrength: z.string().describe("Summary of overall financial health"),
  confidenceLevel: z.enum(["High", "Medium", "Low"]).describe("Confidence in the financial assessment"),
});

export const newsAnalysisSchema = z.object({
  positiveCatalysts: z.array(z.string()).describe("Recent positive news or events"),
  negativeDevelopments: z.array(z.string()).describe("Recent negative news or events"),
  marketSentiment: z.enum(["Positive", "Neutral", "Negative"]).describe("Overall market sentiment based on news"),
  recentSummary: z.string().describe("A concise summary of recent developments (product launches, lawsuits, earnings, etc.)"),
});

export const swotAnalysisSchema = z.object({
  strengths: z.array(z.string()).describe("Internal strengths (bullet points with reasoning)"),
  weaknesses: z.array(z.string()).describe("Internal weaknesses (bullet points with reasoning)"),
  opportunities: z.array(z.string()).describe("External opportunities (bullet points with reasoning)"),
  threats: z.array(z.string()).describe("External threats (bullet points with reasoning)"),
});

export const riskAssessmentSchema = z.object({
  operationalRisk: z.object({ level: z.enum(["Low", "Medium", "High"]), explanation: z.string() }),
  financialRisk: z.object({ level: z.enum(["Low", "Medium", "High"]), explanation: z.string() }),
  technologicalRisk: z.object({ level: z.enum(["Low", "Medium", "High"]), explanation: z.string() }),
  regulatoryRisk: z.object({ level: z.enum(["Low", "Medium", "High"]), explanation: z.string() }),
  competitiveRisk: z.object({ level: z.enum(["Low", "Medium", "High"]), explanation: z.string() }),
  geopoliticalExposure: z.object({ level: z.enum(["Low", "Medium", "High"]), explanation: z.string() }),
  executionRisk: z.object({ level: z.enum(["Low", "Medium", "High"]), explanation: z.string() }),
  valuationRisk: z.object({ level: z.enum(["Low", "Medium", "High"]), explanation: z.string() }),
  macroeconomicSensitivity: z.object({ level: z.enum(["Low", "Medium", "High"]), explanation: z.string() }),
});

export const investmentDecisionSchema = z.object({
  recommendation: z.enum(["Invest", "Hold", "Pass"]).describe("The final recommendation"),
  investmentScore: z.number().min(0).max(100).describe("Score between 0 and 100"),
  confidencePercentage: z.number().min(0).max(100).describe("Confidence in the recommendation"),
  bullCase: z.array(z.string()).describe("Arguments for investing"),
  bearCase: z.array(z.string()).describe("Arguments against investing"),
  reasoning: z.string().describe("Detailed reasoning referencing previous analytical stages"),
});

export const finalReportSchema = z.object({
  companyOverview: companyResearchSchema,
  financialSummary: financialAnalysisSchema,
  newsSummary: newsAnalysisSchema,
  swotAnalysis: swotAnalysisSchema,
  riskAnalysis: riskAssessmentSchema,
  investmentScore: z.number().min(0).max(100),
  confidenceScore: z.number().min(0).max(100),
  bullCase: z.array(z.string()),
  bearCase: z.array(z.string()),
  finalRecommendation: z.enum(["Invest", "Hold", "Pass"]),
  executiveSummary: z.string(),
  disclaimer: z.string(),
  processingMetadata: z.object({
    timestamp: z.string(),
    model: z.string(),
  }),
  sources: z.array(z.string()).describe("List of sources used during the analysis"),
});
