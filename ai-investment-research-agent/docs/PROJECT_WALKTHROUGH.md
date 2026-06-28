# Project Walkthrough

This document provides a guided tour of the AI Investment Research Agent, designed to serve as a talking track for a technical interview.

## 1. Introduction & Overview

"Welcome. This project is an institutional-grade AI Investment Research Agent. Unlike typical chatbots that use a single prompt to generate a text wall, this application uses a multi-agent orchestration framework (LangGraph) to perform a sequential, stateful research workflow. The result is a strictly typed JSON response that populates a highly polished, interactive Next.js dashboard."

## 2. The Frontend Architecture (Next.js)

"The frontend is built using Next.js with the App Router.
- **State Management:** I used `Zustand` (`src/store/useResearchStore.ts`) for global state. It handles the API call, simulates the node-by-node loading timeline, and manages an `AbortController` to cleanly cancel in-flight requests if the user navigates away or starts a new search.
- **UI/UX Polish:** The UI uses Tailwind CSS, Framer Motion, and Lucide icons. I focused heavily on a premium aesthetic—glassmorphism, staggered entrance animations, and dynamic color theming. For example, the `InvestmentVerdictCard` dynamically shifts its gradients and badges based on whether the AI recommends Invest, Hold, or Pass.
- **Accessibility:** Semantic HTML tags (`<article>`, `<dl>`) and full `aria-labels` are implemented across the board. The `AnalysisTimeline` uses `aria-live="polite"` to announce progress to screen readers."

## 3. The Backend API & Validation

"The entry point is `src/app/api/analyze/route.ts`.
- **Validation:** It strictly validates the incoming JSON body.
- **Execution:** It invokes the compiled LangGraph workflow, passing a unique thread ID for checkpointing.
- **Error Masking:** The endpoint catches unexpected errors and masks them from the client to prevent leaking stack traces or internal API structures, returning clean HTTP 500 or 422 codes."

## 4. The AI Orchestration (LangGraph)

"The core of the application lives in `src/services/ai/graph.ts`. 
- **Graph State:** The state is defined in `schema.ts` using Zod schemas. This is critical because it forces the LLMs to output structured, parsable data rather than raw markdown.
- **Sequential Flow:** The graph starts at `validateInput`. If the company is valid, it proceeds to `companyResearch`, then `financialAnalysis`, `newsAnalysis`, `swotAnalysis`, `riskAssessment`, and `investmentDecision`. 
- **Why Sequential?** While some nodes could run in parallel, running them sequentially allows downstream nodes (like Risk) to use the exact outputs of upstream nodes (like SWOT and Financials), drastically improving the depth and coherence of the final decision.
- **LLM Configuration:** `src/services/ai/llm.ts` configures Google Gemini 1.5 Pro via Langchain. It includes environment variable guards that fail fast during initialization if keys are missing.
- **Tooling:** `src/services/ai/tools/tavily.ts` provides the agents with web search capabilities. I wrapped the Tavily API in a custom fetch implementation with a 15-second `AbortController` timeout to ensure the graph never hangs indefinitely if the search API goes down."

## 5. Prompt Engineering Strategy

"In `src/services/ai/prompts/index.ts`, all prompts are centralized. 
- Every prompt assigns a specific persona (e.g., 'Chief Risk Officer').
- Every prompt includes explicit anti-hallucination instructions ('If data is unavailable, state it clearly').
- Prompts are dynamically injected with the context of previous nodes (e.g., injecting the Financial and News context into the SWOT node)."

## 6. Testing & Production Readiness

"Finally, the application is production-ready.
- **Testing:** I implemented `vitest` in `src/__tests__/api.test.ts` to mock the LangGraph execution and verify API route behavior across success, failure, and malformed input scenarios.
- **Security:** `next.config.ts` includes strict HTTP security headers (CSP, X-Frame-Options) and strips `console.log` from the production client bundle."
