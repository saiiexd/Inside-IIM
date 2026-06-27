import { z } from "zod";
import {
  companyResearchSchema,
  financialAnalysisSchema,
  newsAnalysisSchema,
  swotAnalysisSchema,
  riskAssessmentSchema,
  investmentDecisionSchema,
  finalReportSchema,
} from "./schema";

export type CompanyResearch = z.infer<typeof companyResearchSchema>;
export type FinancialAnalysis = z.infer<typeof financialAnalysisSchema>;
export type NewsAnalysis = z.infer<typeof newsAnalysisSchema>;
export type SwotAnalysis = z.infer<typeof swotAnalysisSchema>;
export type RiskAssessment = z.infer<typeof riskAssessmentSchema>;
export type InvestmentDecision = z.infer<typeof investmentDecisionSchema>;
export type FinalReport = z.infer<typeof finalReportSchema>;

export interface GraphState {
  companyName: string;
  normalizedCompanyName?: string;
  isValid?: boolean;
  errors?: string[];
  
  researchData?: CompanyResearch;
  financialData?: FinancialAnalysis;
  newsData?: NewsAnalysis;
  swotData?: SwotAnalysis;
  riskData?: RiskAssessment;
  decisionData?: InvestmentDecision;
  
  finalReport?: FinalReport;
}

// Optional helper to create initial state
export const createInitialState = (companyName: string): GraphState => ({
  companyName,
  errors: [],
});
