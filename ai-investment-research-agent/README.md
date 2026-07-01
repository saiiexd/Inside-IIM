# AI Investment Research Agent

![Dashboard View](./public/placeholder_dashboard.png) *(Note to Candidate: Replace this placeholder image with an actual screenshot of your Next.js application UI before final submission)*

**Live Deployment URL**: [https://your-vercel-deployment-url.vercel.app](https://your-vercel-deployment-url.vercel.app) *(Note to Candidate: Update this URL after deploying to Vercel)*

## Problem Statement
Conducting institutional-grade investment research is an incredibly time-consuming process. Human analysts spend days pulling financial data, reading news articles, performing SWOT analysis, and mapping risks before forming a thesis. This project automates that entire process using an Agentic AI workflow, proving that specialized LLMs can autonomously synthesize disparate data sources into a highly structured, coherent, and actionable investment recommendation in less than 30 seconds.

## Overview — What it does
The AI Investment Research Agent is an autonomous, multi-agent financial analyst built to synthesize deep research on any publicly traded company. By chaining together specialized LangGraph agents, it mimics the workflow of a human investment committee: it pulls real-time web data, evaluates financial health, scans recent news, generates a SWOT analysis, assesses multidimensional risks, and finally outputs a definitive investment recommendation (Invest, Hold, or Pass) alongside a comprehensive executive report.

## How to run it — Setup and Run Steps

### Prerequisites
- Node.js 18+ installed.
- Two free API Keys:
  1. **OpenRouter API Key** (for Llama 3.3 LLM inference) — Get it at [https://openrouter.ai/keys](https://openrouter.ai/keys)
  2. **Tavily Search API Key** (for real-time web scraping) — Get it at [https://app.tavily.com](https://app.tavily.com)

### Installation
1. Clone the repository and install the dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and paste your API keys:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   TAVILY_API_KEY=your_tavily_api_key_here
   ```

### Running the Application Locally
Start the development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser. Enter a company name or ticker (e.g., "Apple" or "AAPL") and click "Analyze" to watch the agents execute in real-time.

## Troubleshooting Guidance
- **Build Errors (Turbopack/Webpack)**: The `next.config.ts` has been heavily optimized using `serverExternalPackages` to fix a known Next.js/LangChain bundling issue. If you encounter missing module errors (`zod/v4`), ensure you have not modified this configuration block.
- **API Timeout/Rate Limit**: OpenRouter's free tier can be slow. The application is configured with retry logic (`maxRetries: 10`). If the frontend stalls for more than 60 seconds, simply refresh and try again.
- **Empty Reports**: If the output is empty or errors instantly, verify your `TAVILY_API_KEY` is valid and has sufficient credits.

## How it works — Approach and Architecture

### System Architecture
Please see [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for a deep dive into the technology stack (Next.js, LangGraph, Zod) and a full diagram of the workflow. For a step-by-step walkthrough of the codebase, see [docs/PROJECT_WALKTHROUGH.md](./docs/PROJECT_WALKTHROUGH.md).

### LangGraph Workflow
The core engine is built using **LangGraph**, representing a sequential, stateful pipeline of AI nodes. 
1. **State Management**: As the workflow progresses, a shared `GraphState` object accumulates data from each agent.
2. **Sequential Pipeline**: It moves strictly from Validation -> Research -> Financials -> News -> SWOT -> Risk -> Decision -> Final Report.
3. **Structured Output**: I used Zod schemas to force the LLM to return strictly typed JSON, ensuring the Next.js frontend always receives predictable data.

## Key decisions & trade-offs
For a detailed explanation of why I chose sequential execution over parallel fan-out, and why I utilized OpenRouter over OpenAI, please read [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md).

## Example runs — Output on a few companies
I have generated complete, structured JSON outputs demonstrating the system's schema compliance across three diverse scenarios. You can view the raw files in the `examples/` directory:
- [NVIDIA (Invest)](./examples/nvidia_nvda_report.json)
- [Intel (Pass)](./examples/intel_intc_report.json)
- [Reliance Industries (Hold)](./examples/reliance_ril_report.json)

## What I would improve with more time
While this assignment is functionally complete, a true enterprise version would require Vector Databases, Server-Sent Events, and parallel graph execution. Please see [docs/FUTURE_IMPROVEMENTS.md](./docs/FUTURE_IMPROVEMENTS.md) for my comprehensive roadmap.

## Limitations
- **Data Latency**: The system relies on the Tavily Search API for real-time data. Occasionally, search engines may return slightly outdated trailing-twelve-month (TTM) figures compared to a direct Bloomberg Terminal feed.
- **Vercel Hobby Tier**: The deployment is currently configured for Vercel's Hobby Tier, which has a strict 60-second execution limit. Extremely obscure companies may cause the LLM to take longer than 60 seconds to process, resulting in a server timeout.
- **Hallucination Risk**: While Zod schemas strictly enforce output formatting, the underlying LLM (Llama 3.3) may still occasionally hallucinate qualitative narratives if the search context is sparse.

## Acknowledgements
- **LangChain & LangGraph**: For providing the incredible open-source framework that powers the state-machine orchestration.
- **OpenRouter**: For democratizing access to massive frontier models like Llama 3.3 70B.
- **Tavily**: For building an API explicitly designed to feed clean, structured context into LLMs.
- **InsideIIM / Altuni AI Labs**: For providing a rigorous, challenging, and highly practical assignment prompt that pushed the boundaries of my AI engineering capabilities.

---

> **Bonus Requirement Note**: The complete LLM conversation transcript logs created during the development of this project, along with a summary of how AI was utilized, have been exported and are available in the [llm-development-logs/](./llm-development-logs) directory.
