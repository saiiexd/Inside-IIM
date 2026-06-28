import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { GraphState } from "./state";
import {
  validateInputNode,
  companyResearchNode,
  financialAnalysisNode,
  newsAnalysisNode,
  swotAnalysisNode,
  riskAssessmentNode,
  investmentDecisionNode,
  reportGenerationNode,
} from "./nodes";

/**
 * LangGraph state channel configuration.
 * The `errors` channel uses a concat reducer so parallel nodes can
 * each push errors without overwriting each other.
 */
const graphStateChannels = {
  companyName: { value: null, default: () => "" },
  normalizedCompanyName: { value: null },
  isValid: { value: null },
  errors: {
    value: (x: string[] | undefined, y: string[] | undefined) =>
      [...(x ?? []), ...(y ?? [])],
    default: () => [] as string[],
  },
  researchData: { value: null },
  financialData: { value: null },
  newsData: { value: null },
  swotData: { value: null },
  riskData: { value: null },
  decisionData: { value: null },
  finalReport: { value: null },
};

/**
 * AI Investment Research Agent — LangGraph workflow.
 *
 * Graph topology:
 *   START → validateInput
 *     ↓ (valid)
 *   companyResearch
 *     ↓
 *   financialAnalysis → newsAnalysis   (sequential; news uses financial context)
 *     ↓
 *   swotAnalysis → riskAssessment      (sequential; risk uses SWOT context)
 *     ↓
 *   investmentDecision
 *     ↓
 *   reportGeneration → END
 *
 * Note: Financial & News could run in parallel but news enriches from financial
 * context, so keeping sequential maintains quality. This is preferable over
 * artificially parallelising for marginal speed gains at the cost of report quality.
 */
const graph = new StateGraph<GraphState>({ channels: graphStateChannels })
  .addNode("validateInput", validateInputNode)
  .addNode("companyResearch", companyResearchNode)
  .addNode("financialAnalysis", financialAnalysisNode)
  .addNode("newsAnalysis", newsAnalysisNode)
  .addNode("swotAnalysis", swotAnalysisNode)
  .addNode("riskAssessment", riskAssessmentNode)
  .addNode("investmentDecision", investmentDecisionNode)
  .addNode("reportGeneration", reportGenerationNode)
  .addEdge(START, "validateInput")
  .addConditionalEdges(
    "validateInput",
    (state) => (state.isValid ? "companyResearch" : END),
  )
  .addEdge("companyResearch", "financialAnalysis")
  .addEdge("financialAnalysis", "newsAnalysis")
  .addEdge("newsAnalysis", "swotAnalysis")
  .addEdge("swotAnalysis", "riskAssessment")
  .addEdge("riskAssessment", "investmentDecision")
  .addEdge("investmentDecision", "reportGeneration")
  .addEdge("reportGeneration", END);

export const investmentResearchGraph = graph.compile({
  checkpointer: new MemorySaver(),
});
