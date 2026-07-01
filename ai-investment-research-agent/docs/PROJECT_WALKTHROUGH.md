# Project Walkthrough

This document serves as a guided tour of the AI Investment Research Agent platform. It is written from the perspective of a developer presenting the system during a technical architecture interview.

## 1. User Interaction & Frontend Request (React)

The journey begins in the browser. A user navigates to the React interface and is presented with a search input. 
They type a company name (e.g., "Nvidia" or "NVDA") and click the "Analyze" button.

Immediately, the Next.js frontend transitions into a loading state to provide visual feedback. A `POST` request is dispatched to the backend: `http://localhost:3000/api/analyze` with the JSON payload `{"companyName": "NVDA"}`.

## 2. API Gateway & Validation (Next.js API Route)

The request hits our Next.js Route Handler at `src/app/api/analyze/route.ts`. 
- **Type Checking**: The endpoint verifies the body contains a valid string for `companyName`. If missing, it immediately rejects the request with a `400 Bad Request`.
- **Thread Initialization**: If valid, the API generates a unique `thread_id`. This allows the LangGraph state machine to track this specific execution separately from any concurrent user requests.

## 3. The LangGraph Execution Pipeline (LangGraph.js)

The API invokes the `investmentResearchGraph` defined in `src/services/ai/graph.ts`. 

### Step A: Input Validation (`validateInputNode`)
Before launching expensive research queries, the first agent node verifies if the company exists and is a valid target. If the user typed gibberish, the node sets `isValid=false` and the graph immediately terminates, saving API credits.

### Step B: Core Research (`companyResearchNode` & `financialAnalysisNode`)
The graph state flows to the research nodes. These agents utilize the Tavily API (specifically built for LLMs) to pull deep context on the company. They extract structural data, margins, historical growth, and debt ratios. The data is appended to the shared `GraphState`.

### Step C: Contextual & Risk Analysis (`newsAnalysisNode`, `swotAnalysisNode`, `riskAssessmentNode`)
The agents shift focus from quantitative to qualitative analysis:
- The News Agent scans for recent catalyst events and regulatory news.
- The SWOT Agent generates a highly structured Strengths, Weaknesses, Opportunities, and Threats layout.
- The Risk Agent evaluates 9 specific categories (e.g., macroeconomic, geopolitical, operational) and scores them.

### Step D: The Decision & Report Generation (`investmentDecisionNode`, `reportGenerationNode`)
Finally, with all quantitative and qualitative data gathered in the state object:
- The Decision node weighs the Bull Case against the Bear Case and assigns a quantitative score (0-100), outputting an absolute verdict: Invest, Hold, or Pass.
- The Report node compiles the final Executive Summary.

## 4. Returning the Verdict (API Response)

Once the `reportGenerationNode` completes, the LangGraph execution finishes. The Next.js API intercepts the final state.
If the pipeline completed successfully, it returns the `finalReport` object (strictly validated against our Zod schema) as a `200 OK` JSON response.

## 5. Rendering the Results (React UI)

Back in the browser, the React application receives the fully populated JSON object. 
Because we utilized LangChain's `.withStructuredOutput()`, the frontend TypeScript interfaces match the API response 1:1. 

The UI safely maps over the data, rendering the premium layout:
- **Verdict Banner**: Prominently displays "Invest", "Hold", or "Pass".
- **Financial Grids**: Renders revenue growth, operating margins, and debt ratios.
- **SWOT & Risks**: Displays dynamic cards highlighting the most critical threats and opportunities discovered by the AI.

## Summary
By combining the seamless full-stack capabilities of Next.js with the deterministic sequential reasoning of LangGraph.js, this application operates securely, predictably, and efficiently, entirely abstracting the complexity of LLM hallucinations away from the end user.
