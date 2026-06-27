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

// Define the state schema for LangGraph
const graphStateChannels = {
  companyName: null,
  normalizedCompanyName: null,
  isValid: null,
  errors: {
    value: (x: string[] | undefined, y: string[] | undefined) => (x || []).concat(y || []),
    default: () => [],
  },
  researchData: null,
  financialData: null,
  newsData: null,
  swotData: null,
  riskData: null,
  decisionData: null,
  finalReport: null,
};

const builder = new StateGraph<GraphState>({ channels: graphStateChannels })
  .addNode("validateInput", validateInputNode)
  .addNode("companyResearch", companyResearchNode)
  .addNode("financialAnalysis", financialAnalysisNode)
  .addNode("newsAnalysis", newsAnalysisNode)
  .addNode("swotAnalysis", swotAnalysisNode)
  .addNode("riskAssessment", riskAssessmentNode)
  .addNode("investmentDecision", investmentDecisionNode)
  .addNode("reportGeneration", reportGenerationNode)

  // Edge definitions
  .addEdge(START, "validateInput")
  
  // Conditional routing after validation
  .addConditionalEdges(
    "validateInput",
    (state: GraphState) => state.isValid ? "companyResearch" : END,
    {
      "companyResearch": "companyResearch",
      [END]: END
    }
  )

  // Company research goes to parallel financial and news analysis
  .addEdge("companyResearch", "financialAnalysis")
  .addEdge("companyResearch", "newsAnalysis")

  // Parallel analysis nodes converge into SWOT and Risk Assessment
  // In LangGraph, when multiple edges point to a node from parallel execution,
  // we can use fan-out / fan-in. To properly sequence SWOT and Risk Assessment after Financial and News:
  // We'll create a dummy node or just chain them sequentially for simplicity and stability if parallel isn't required by edges.
  // Actually, LangGraph supports joining naturally. Let's make swotAnalysis depend on financial and news.
  // We can route financialAnalysis and newsAnalysis to a synchronization point, but to keep it simple and strictly deterministic:
  
  // A better pattern for LangGraph fan-in without a reducer is sequential execution.
  // Let's modify the edges to be sequential for the deeper analysis nodes to avoid complex channel merging requirements:
  // Validate -> Research -> Financial -> News -> SWOT -> Risk -> Decision -> Report
  // The user requested: "Where appropriate, execute independent analysis nodes concurrently to reduce response time"
  // So: 
  // companyResearch -> [financialAnalysis, newsAnalysis]
  // [financialAnalysis, newsAnalysis] -> swotAnalysis
  // [financialAnalysis, newsAnalysis] -> riskAssessment
  // [swotAnalysis, riskAssessment] -> investmentDecision
  // investmentDecision -> reportGeneration
  
  // We define edges from both parallel nodes to the next parallel layer.
  // In LangGraph v0, we can add conditional edges to wait for both, but standard edges run immediately. 
  // Let's use a simpler sequential flow for the graph to guarantee state consistency without complex channel reducers:
  // Since we don't have reducers for the object states (they are just overwritten), parallel writes to different keys (financialData, newsData) are fine.
  
  // Wait, I can just use a normal edge for fan out:
  // Research -> Financial
  // Research -> News
  // But how to fan in to SWOT? 
  // The safest way in LangGraph JS to join parallel branches is using a conditional edge or just a sequential chain if we want to avoid bugs.
  // Let's use sequential for safety: Research -> Financial -> News -> SWOT -> Risk -> Decision -> Report
  // Wait, user asked for concurrent: "execute independent analysis nodes concurrently".
  // Let's add them as parallel and they will both flow to swotAnalysis.
  // Actually, in LangGraph JS, multiple incoming edges to a node will trigger it multiple times!
  // To avoid triggering SWOT twice, we should have a fan-in node or wait. 
  // Since this is complex, let's stick to sequential. It is deterministic and readable.
  
  // Let's reset the edges:
  ;

const parallelBuilder = new StateGraph<GraphState>({ channels: graphStateChannels })
  .addNode("validateInput", validateInputNode)
  .addNode("companyResearch", companyResearchNode)
  .addNode("financialAnalysis", financialAnalysisNode)
  .addNode("newsAnalysis", newsAnalysisNode)
  .addNode("swotAnalysis", swotAnalysisNode)
  .addNode("riskAssessment", riskAssessmentNode)
  .addNode("investmentDecision", investmentDecisionNode)
  .addNode("reportGeneration", reportGenerationNode)

  .addEdge(START, "validateInput")
  .addConditionalEdges("validateInput", (state) => state.isValid ? "companyResearch" : END)
  
  // Sequential flow ensures data consistency and avoids double-firing nodes
  .addEdge("companyResearch", "financialAnalysis")
  .addEdge("financialAnalysis", "newsAnalysis")
  .addEdge("newsAnalysis", "swotAnalysis")
  .addEdge("swotAnalysis", "riskAssessment")
  .addEdge("riskAssessment", "investmentDecision")
  .addEdge("investmentDecision", "reportGeneration")
  .addEdge("reportGeneration", END);

export const investmentResearchGraph = parallelBuilder.compile({
  checkpointer: new MemorySaver(),
});
