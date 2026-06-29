AI Investment Research Agent
Overview — What it does
The AI Investment Research Agent is an autonomous, multi-agent financial analyst built to synthesize deep, institutional-grade research on any publicly traded company. By chaining together specialized LangGraph agents, it mimics the workflow of a human investment committee: it pulls real-time web data, evaluates financial health, scans recent news, generates a SWOT analysis, assesses multidimensional risks, and finally outputs a definitive investment recommendation (Invest, Hold, or Pass) alongside a comprehensive executive report.

How to run it — Setup and Run Steps
Prerequisites
Node.js 18+ installed.
Two free API Keys:
OpenRouter API Key (for Llama 3.3 LLM inference) — Get it at https://openrouter.ai/keys
Tavily Search API Key (for real-time web scraping) — Get it at https://app.tavily.com
Installation
Clone the repository and install the dependencies:
npm install
Copy the example environment file:
cp .env.example .env.local
Open .env.local and paste your API keys:
OPENROUTER_API_KEY=your_openrouter_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
Running the Application
Start the development server:

npm run dev
Navigate to http://localhost:3000 in your browser. Enter a company name or ticker (e.g., "Apple" or "AAPL") and click "Analyze" to watch the agents execute in real-time.

How it works — Approach and Architecture
System Architecture

LangGraph Workflow
The core engine is built using LangGraph, representing a sequential, stateful pipeline of AI nodes.


State Management: As the workflow progresses, a shared GraphState object (typed with TypeScript) accumulates data from each agent.
Sequential Multi-Agent Pipeline:
validateInputNode: Ensures the company name is valid and API keys are present.
companyResearchNode: Fetches basic company profile data using Tavily search and structures it.
financialAnalysisNode: Analyzes operating margins, revenue growth, and debt using search results.
newsAnalysisNode: Scans recent articles for catalysts and negative developments.
swotAnalysisNode: Generates a structured Strengths, Weaknesses, Opportunities, and Threats matrix.
riskAssessmentNode: Evaluates 9 specific risk categories (e.g., operational, regulatory, macroeconomic).
investmentDecisionNode: Quantitatively scores the company and synthesizes the Bull/Bear cases.
reportGenerationNode: Reads the entire accumulated state and writes the final Executive Summary.
Structured Output: I used Zod schemas combined with LangChain's .withStructuredOutput() to force the LLM to return strictly typed JSON, ensuring the Next.js frontend always receives predictable data to render the premium UI.
Key decisions & trade-offs — What I chose and why
Sequential Pipeline over Parallel Execution: I chose to run the agents sequentially rather than in parallel. While parallel execution would have been faster, running them sequentially allows downstream agents (like the Decision Node) to read the exact output of upstream agents (like Financials and News), resulting in a much more cohesive and logically sound final thesis.
OpenRouter (Llama 3.3 70B) over OpenAI/Gemini: To make this highly accessible without requiring paid credits, I integrated OpenRouter to tap into the free tier of the massive Llama 3.3 70B model. To handle free-tier rate limits, I implemented a robust maxRetries: 10 configuration so the application gracefully waits rather than crashing.
Tavily over Standard Search: I used Tavily instead of standard Google Search APIs because Tavily is explicitly designed for LLMs, returning scraped and cleaned markdown content rather than just a list of URLs, which saves massive amounts of context tokens.
What I left out: I intentionally left out a database (like PostgreSQL/Prisma). Storing past reports would be nice, but it adds unnecessary friction to the setup process for an assignment that focuses on the AI agent architecture.
Example runs — Output on a few companies
NVIDIA (NVDA)

Verdict: Invest (Score: 88)
Bull Case: Unprecedented demand for Hopper/Blackwell GPUs; impenetrable CUDA software moat.
Bear Case: Geopolitical risk restricting sales to China; extremely high valuation multiples priced for perfection.
Agent Behavior: The financial agent correctly identified hyper-growth margins, while the risk agent heavily flagged Geopolitical and Valuation risks.
Intel (INTC)

Verdict: Pass (Score: 35)
Bull Case: Strategic importance to US domestic semiconductor manufacturing (CHIPS Act).
Bear Case: Continuous loss of market share to AMD; struggles with foundry node transitions.
Agent Behavior: The news agent accurately pulled recent restructuring and layoff news, causing the Decision agent to downgrade the confidence and investment score significantly.
What I would improve with more time
RAG for SEC Filings: I would implement a vector database (like Pinecone) to ingest 10-K and 10-Q filings, allowing the financial agent to query exact historical metrics rather than relying solely on surface-level web searches.
Streaming UI: I would implement LangChain's streaming API to stream the JSON tokens to the frontend in real-time, so the user can see the report building itself dynamically instead of waiting for a single loading spinner.
Interactive Chat: After the report is generated, I would add a chat interface allowing the user to ask the agent follow-up questions (e.g., "Why did you rate the regulatory risk so high?").
Bonus Requirement Note: The complete LLM conversation transcript logs created during the development of this project have been exported and are available in the root directory as LLM_CHAT_TRANSCRIPT.jsonl.

Outline
