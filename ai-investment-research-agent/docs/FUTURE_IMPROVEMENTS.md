# Future Improvements

While this AI Investment Research Agent is functionally complete and demonstrates a robust architecture, several enhancements would be required to transition it from a proof-of-concept into an enterprise-grade SaaS platform. These improvements were intentionally left out of the initial assignment scope to focus on core AI behavior and architecture.

## 1. RAG (Retrieval-Augmented Generation) for SEC Filings
**Current Limitation**: The agent relies on the Tavily Search API to scrape the public web for financial metrics. This can occasionally result in slight discrepancies depending on the source (e.g., Yahoo Finance vs. Bloomberg).
**Improvement**: Implement a Vector Database (such as Pinecone or Qdrant) integrated with LangChain. We would ingest the official 10-K and 10-Q SEC filings for the analyzed company. The `financialAnalysisNode` would perform semantic similarity searches against these definitive documents to guarantee 100% accuracy on trailing twelve-month (TTM) margins, debt ratios, and revenue growth.

## 2. Server-Sent Events (SSE) & UI Streaming
**Current Limitation**: The Next.js API waits for the entire LangGraph pipeline to execute (which can take 15-30 seconds) before returning a single monolithic JSON payload.
**Improvement**: Utilize LangChain's `.streamEvents()` API combined with Next.js Edge Runtime Server-Sent Events. The UI would receive incremental JSON patches, allowing the dashboard to literally type itself out in front of the user (similar to ChatGPT or Perplexity), drastically improving the perceived performance.

## 3. Persistent Database & User Authentication
**Current Limitation**: Reports exist entirely in browser memory. Once you refresh, the analysis is gone.
**Improvement**: Integrate **NextAuth (Auth.js)** for OAuth login (Google/GitHub) and **PostgreSQL (via Prisma or Drizzle ORM)**. Upon completion, the `reportGenerationNode` would push the final JSON state to the database, allowing users to view historical analyses and track how a company's "Invest" score changes quarter over quarter.

## 4. Parallel Graph Execution
**Current Limitation**: The LangGraph pipeline operates strictly sequentially (e.g., News Analysis waits for Financial Analysis to finish).
**Improvement**: LangGraph supports parallel fan-out nodes. We could execute `financialAnalysisNode`, `newsAnalysisNode`, and `swotAnalysisNode` simultaneously immediately after validation, and then fan-in to the `riskAssessmentNode`. This would cut the total time-to-first-byte (TTFB) in half.

## 5. Background Workers & Serverless Limits
**Current Limitation**: Vercel's hobby tier imposes a strict 10-60 second timeout on API routes. Complex LangGraph multi-agent chains often exceed this limit if the LLM provider experiences latency.
**Improvement**: Decouple the execution using a background worker (e.g., Inngest or Upstash QStash). The Next.js API would simply return a `jobId`, and the React frontend would poll or listen via WebSockets for the final result, entirely avoiding Vercel serverless timeouts.
