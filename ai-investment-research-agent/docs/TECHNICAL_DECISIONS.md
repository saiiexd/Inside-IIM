# Technical Decisions & Trade-offs

This document outlines the core engineering decisions made while building the AI Investment Research Agent, justifying the technology stack against alternative options, and acknowledging the trade-offs made given the constraints of the assignment.

## 1. Why Next.js Full Stack?

**Decision**: Build both the frontend and backend within Next.js (App Router API Routes) instead of splitting into a separate Python (FastAPI/Flask) or Express backend.

**Rationale**:
The assignment specifically requested a "Node.js or Next.js (back end)". Utilizing Next.js for the entire stack simplifies the deployment architecture significantly (e.g., a one-click deploy to Vercel). It allows the frontend and backend to share TypeScript types and Zod schemas seamlessly, preventing type mismatch errors at the API boundary.

## 2. Why LangGraph.js over LangChain Chains?

**Decision**: Use LangGraph.js for agent orchestration instead of simple LangChain.js `RunnableSequences` or raw LLM API calls.

**Rationale**:
Financial research requires deep sequential reasoning and accumulation of data. A single massive prompt often leads to context degradation and hallucinations. 
LangGraph allows us to model the workflow as a state machine. 
- **Separation of Concerns**: The News Agent doesn't need to know how to calculate financial margins; it just focuses on sentiment.
- **State Persistence**: The `GraphState` acts as a shared memory bus. We can inspect the state exactly as it was *before* it reached the Decision Node, making debugging AI behaviors significantly easier.
- **Cyclic Graphs (Future-Proofing)**: While our current graph is mostly sequential, LangGraph easily allows for cycles (e.g., if a node determines it needs more information, it can route back to the web search node automatically).

## 3. Why Structured JSON Outputs (Zod)?

**Decision**: Force the LLM to output strictly validated JSON matching a Zod schema, rather than parsing markdown text.

**Rationale**:
The biggest failure point of GenAI applications is unpredictable UI rendering. If an LLM returns a string, we have to parse it with Regex, which breaks easily. 
By using LangChain's `.withStructuredOutput()` bound to a Zod schema on the backend, we guarantee API contract safety. The React components can confidently map over the data without throwing `undefined` errors.

## 4. OpenRouter (Llama 3.3) over Direct OpenAI

**Decision**: Default configuration uses OpenRouter to access Llama 3.3 70B instead of requiring an expensive OpenAI GPT-4 API key.

**Rationale**:
To make the assignment highly accessible and easy to run without requiring paid credits, I integrated OpenRouter to tap into the free tier of the massive Llama 3.3 70B model. To handle free-tier rate limits, robust retry logic was implemented.

## 5. Trade-offs & Compromises

Given the scope and time constraints of the assignment, several intentional trade-offs were made:

1. **No Persistent Database**
   - *Ideal*: Use PostgreSQL/Prisma to store user sessions and historical reports.
   - *Compromise*: We omitted a database to reduce setup friction for the reviewer. The application currently functions entirely in-memory per request.

2. **Sequential vs. Parallel Execution**
   - *Ideal*: Run the Financial Node, News Node, and SWOT node entirely asynchronously in parallel to cut response time in half.
   - *Compromise*: Currently, they run sequentially in the graph for simplicity of state management. LangGraph supports parallel node execution, which would be a Day 2 optimization.

3. **No UI Streaming (Server-Sent Events)**
   - *Ideal*: Stream the LLM tokens to the UI in real-time, significantly improving perceived performance.
   - *Compromise*: We currently wait for the entire graph to execute before returning the final JSON. While slower, it guarantees the final report is strictly validated before the user sees anything.

## 6. Scalability Considerations for Production

If this were deployed to production for thousands of users:
- **Serverless Timeouts**: Next.js API routes on Vercel's free tier time out after 10-60 seconds. A LangGraph pipeline can easily exceed this. In production, we would offload the LangGraph execution to a background worker (e.g., Inngest or AWS SQS) and have the frontend poll for the result.
- **LangSmith Tracing**: We would enable LangSmith tracing to monitor token usage, latency per node, and LLM output quality across production runs.
