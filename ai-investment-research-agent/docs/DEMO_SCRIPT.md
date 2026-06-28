# Live Demo Script (3-5 Minutes)

This script is designed for a concise, impactful live presentation to a technical hiring manager or product team.

---

### **0:00 - 0:30: Introduction & Hook**
**Visual:** Show the Landing Page (Hero Section).
**Talking Points:**
- "Hi, this is my submission for the AI Product Development Engineer role. This is the AI Investment Research Agent."
- "The goal of this project was to move beyond the typical 'chat window' UI and build a deterministic, agentic workflow that feels like a premium SaaS product."
- "Instead of a single brittle prompt, the backend uses **LangGraph** to orchestrate a pipeline of autonomous AI agents, outputting strictly typed data via Zod, which is then rendered by this Next.js dashboard."

### **0:30 - 1:30: The Workflow Execution**
**Action:** Click the "NVIDIA" example chip on the landing page.
**Visual:** The UI transitions into the `AnalysisTimeline`.
**Talking Points:**
- "As soon as I hit search, we trigger the `/api/analyze` endpoint. Notice how the UI immediately transitions to this progressive timeline."
- "On the backend, LangGraph is executing a StateGraph. We start by validating the company. If it's valid, we proceed sequentially through Research, Financials, News, SWOT, and Risk."
- "I chose a **sequential** execution graph rather than parallel. Why? Because the News node needs to know what the Financials node discovered to look for the right catalysts. The Risk node needs to evaluate the specific threats identified by the SWOT node. This pipeline ensures deep coherence."
- "Behind the scenes, we're using Gemini 1.5 Pro via LangChain, utilizing `withStructuredOutput` to guarantee the LLM returns exactly the JSON schemas my UI expects."

### **1:30 - 3:00: The Results & Frontend Engineering**
**Action:** The analysis completes, and the `ReportDashboard` fades in. Slowly scroll through the report.
**Visual:** Investment Verdict Card → Overview → Financials → News → SWOT → Risk.
**Talking Points:**
- "Here is the final report. Notice the premium UI—I focused heavily on aesthetic details using Tailwind and Framer Motion."
- "At the top, we have the **Investment Verdict**. The styling here is dynamic. Because the AI selected 'Invest', the card glows green. If it were 'Hold' or 'Pass', the entire component would re-theme to amber or red."
- *(Scroll to Financial Metrics Grid)* "Because the LLM is forced to return strict JSON, I can map the data directly to these discrete UI cards with Lucide icons, rather than parsing a massive markdown string."
- *(Scroll to News Panel)* "The News node actually utilized the **Tavily Search API** as a tool to pull real-time catalysts, which the LLM then synthesized into Positive and Negative developments."
- "From an engineering perspective, this entire frontend is heavily optimized. I used `Zustand` for state management, meaning if I were to hit 'New Search' right now, the `AbortController` would cleanly terminate the current API request without race conditions."

### **3:00 - 3:30: Codebase & Architecture Highlights**
**Action:** Open the IDE, specifically showing `src/services/ai/graph.ts` and `src/app/api/analyze/route.ts`.
**Talking Points:**
- "If we look at the code, I want to highlight the error handling. In the LangGraph workflow, if any node fails—say the Tavily API times out—it catches the error, appends it to an `errors` state channel, and gracefully returns."
- "In the Next.js API route, all internal stack traces are masked. The client only ever receives a clean HTTP 500 or 422 with a generic message, which is a critical security practice for production applications."
- "All prompts are centralized in one file (`prompts/index.ts`) for easy tuning, and the entire graph is heavily typed."

### **3:30 - 4:00: Conclusion & Future Work**
**Action:** Return to the UI, hover over some interactive elements to show the focus rings and smooth states.
**Talking Points:**
- "To scale this to a full production SaaS, my next steps would be replacing the in-memory checkpointer with Postgres to save user histories, and converting the REST endpoint to Server-Sent Events (SSE) so the UI updates node-by-node in true real-time."
- "Thank you. I’m happy to dive into any specific part of the code or answer questions about the architectural tradeoffs."
