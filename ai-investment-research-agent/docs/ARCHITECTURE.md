# System Architecture

The AI Investment Research Agent leverages a robust and modern stack designed for sequential AI reasoning, strictly typed API boundaries, and real-time frontend rendering.

## High-Level Architecture

The platform operates as a monolithic full-stack application using **Next.js**. It exposes a backend REST API route that acts as the entry point for the LangGraph-orchestrated AI workflow.

```mermaid
graph TD
    Client[Next.js Client (React)] -->|POST /api/analyze| API[Next.js Route Handler]
    API -->|Invoke| Graph[LangGraph StateGraph]
    
    subgraph LangGraph Pipeline
        Graph -->|Init State| Validate[validateInputNode]
        Validate -->|Valid| Research[companyResearchNode]
        Research --> Financials[financialAnalysisNode]
        Financials --> News[newsAnalysisNode]
        News --> SWOT[swotAnalysisNode]
        SWOT --> Risk[riskAssessmentNode]
        Risk --> Decision[investmentDecisionNode]
        Decision --> Report[reportGenerationNode]
    end
    
    Research -.->|Tavily API| Web[(Web Search)]
    Financials -.->|LLM Search| Web
    News -.->|LLM Search| Web
    
    Graph -->|Return finalReport JSON| API
    API -->|Return HTTP 200| Client
```

---

## 1. Backend (Next.js API & LangGraph.js)

### 1.1 Next.js API Route (`src/app/api/analyze/route.ts`)
The server acts as the primary validation layer before invoking the expensive LLM graph.
- **Request Validation**: Verifies the presence of a non-empty `companyName` string.
- **Error Handling**: Uses `try/catch` to mask internal errors from the client while returning 400 (Bad Request), 422 (Unprocessable Entity for invalid companies), or 500 (Internal Server Error) status codes.
- **Thread Configuration**: Generates a random `thread_id` using `crypto.randomUUID()` to isolate concurrent runs.

### 1.2 LangGraph State Management (`src/services/ai/state.ts`)
LangGraph operates as a sequential state machine. We defined a shared `GraphState` object (typed with TypeScript) that acts as the memory context. Each agent in the pipeline receives the state, performs its task, and appends or mutates the state before passing it to the next agent.

### 1.3 The Multi-Agent Pipeline (`src/services/ai/graph.ts`)
The workflow operates sequentially to ensure that downstream synthesis agents (like the Decision and Report nodes) have access to the absolute final output of the upstream data-gathering nodes.

1. **`validateInputNode`**: Checks if the ticker/company is valid.
2. **`companyResearchNode`**: Pulls high-level company profile and operating metrics.
3. **`financialAnalysisNode`**: Analyzes historical revenue growth, margins, and debt structures.
4. **`newsAnalysisNode`**: Uses Tavily to pull recent catalyst articles and scores their sentiment.
5. **`swotAnalysisNode`**: Constructs the Strengths, Weaknesses, Opportunities, and Threats matrix.
6. **`riskAssessmentNode`**: Categorizes risks across 9 specific areas (macroeconomic, geopolitical, etc.).
7. **`investmentDecisionNode`**: Weighs the risks against the financials to output an absolute Invest/Hold/Pass decision.
8. **`reportGenerationNode`**: Synthesizes the entire graph state into the final Executive Summary.

### 1.4 Structured LLM Outputs
To guarantee the Next.js React client does not crash when attempting to render the report, we use Zod (`z`) schemas combined with LangChain's `.withStructuredOutput()`. This forces the LLM provider (e.g., OpenRouter / Llama) to respond with strictly validated JSON.

---

## 2. Frontend (Next.js React & Tailwind)

The frontend is a fully responsive Next.js application designed to instantly consume and render the complex JSON payloads returned by the LangGraph pipeline.

- **Component Architecture**: The UI is divided into modular React components (e.g., `FinancialMetrics`, `SwotAnalysis`, `RiskMatrix`).
- **State Handling**: Implements `useState` for managing loading states (`isAnalyzing`) and potential validation errors gracefully.
- **Resilience**: The frontend does not parse strings. It trusts the API boundary to deliver the exact Zod-defined schema, allowing it to safely map over arrays (like news articles or risks) without throwing `undefined` errors.
