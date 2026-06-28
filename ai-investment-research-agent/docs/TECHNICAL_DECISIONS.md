# Technical Decisions

This document outlines the core architectural and engineering decisions made during the development of the AI Investment Research Agent.

## 1. LangGraph vs. Standard LangChain Sequences
**Decision:** Orchestrate the AI workflow using LangGraph rather than a simple LangChain `RunnableSequence`.
**Rationale:** Standard chains are stateless and strictly linear. LangGraph introduces a stateful, cyclical graph model (via `StateGraph`). This provides:
- A centralized memory object (`GraphState`) that accumulates data step-by-step.
- The ability to conditionally route execution (e.g., terminating early if `validateInput` fails).
- The foundation for future multi-agent loops (e.g., adding an "Evaluate" node that sends the report back to "Research" if quality is poor).

## 2. Sequential vs. Parallel Graph Execution
**Decision:** Execute the core analytical nodes (Financials, News, SWOT, Risk) sequentially rather than in parallel.
**Alternatives Considered:** Parallel execution using a fan-out/fan-in graph topology to reduce latency.
**Rationale:** While parallel execution would reduce the total TTFB (Time To First Byte), it sacrifices analytical coherence. By running sequentially, the News node can query recent events specifically related to the Financial node's findings, and the Risk node can evaluate the exact threats identified in the SWOT node. Quality and depth of synthesis were prioritized over raw speed.

## 3. Strict Zod Schema Outputs
**Decision:** Force the LLM to output strictly typed JSON matching Zod schemas using `.withStructuredOutput()`.
**Rationale:** Frontend UI components require deterministic data structures. Relying on raw markdown generation creates brittle UIs requiring complex regex parsing. Zod guarantees that if the LLM responds successfully, the frontend receives exact object keys (like `revenueGrowthTrends` or `marketSentiment`), enabling discrete UI components like circular progress bars and colored badges.

## 4. Zustand for Frontend State Management
**Decision:** Use `Zustand` instead of React Context or Redux for global state.
**Rationale:** Zustand provides a minimal, boilerplate-free API. Crucially, it allows for managing the `AbortController` outside of the React render cycle, ensuring that network requests can be reliably cancelled if a user clicks a new company before the previous analysis completes.

## 5. Centralized Prompt Management
**Decision:** Move all LLM prompt templates to a single `prompts/index.ts` file instead of defining them inline within the LangGraph nodes.
**Rationale:** Prompts are the configuration layer of an AI application. Centralizing them makes it trivial to review, tune, and version-control the AI's persona and instructions without digging through routing logic.

## 6. Granular Error Handling & Masking
**Decision:** Nodes catch internal exceptions, append them to a state `errors` array, and the Next.js API route returns generic 500s to the client while logging specifics to the server console.
**Rationale:** Leaking API keys, rate limit warnings, or internal Tavily exceptions to the client is a security risk. The `errors` channel allows the graph to gracefully degrade or report exactly where it failed, while the client receives a safe, generic failure message.
