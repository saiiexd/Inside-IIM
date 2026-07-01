# Architectural Brainstorming with AI

During the initial design phase of the AI Investment Research Agent, AI served as a critical sparring partner for architectural decisions.

## Key Decisions Assisted by AI

### 1. LangGraph vs. LangChain SequentialChains
**Initial Thought**: I originally planned to use a simple `SequentialChain` from LangChain to run the research agents one after another.
**AI Input**: The AI pair programmer highlighted that a `SequentialChain` lacks robust state management, making error recovery (e.g., if the web scraper fails) incredibly difficult. The AI strongly recommended **LangGraph**, demonstrating how a StateMachine architecture (`StateGraph`) allows for conditional edges, strict state typing via TypeScript, and deterministic error handling.
**Outcome**: I adopted LangGraph. This proved essential, as the `validateInputNode` can now cleanly terminate the graph via a conditional edge (`END`) if a company is not found, saving API credits.

### 2. Next.js App Router API vs. Express.js
**Initial Thought**: I considered building a separate Python FastAPI or Node.js Express backend to house the LangGraph logic, while keeping Next.js purely for the frontend.
**AI Input**: The AI pointed out that Next.js Route Handlers (`src/app/api`) are perfectly capable of executing Long-Running Serverless Functions if configured correctly (e.g., `export const maxDuration = 60`). The AI provided the blueprint for running LangGraph natively within a Next.js API route.
**Outcome**: A monolithic Next.js architecture was chosen. This eliminated CORS issues, simplified deployment to Vercel, and allowed me to share TypeScript interfaces (`GraphState`) seamlessly between the frontend and backend.

### 3. Zod for Structured Output
**Initial Thought**: I was going to ask the LLM to return a JSON string and `JSON.parse()` it manually.
**AI Input**: The AI warned that Llama 3 models occasionally prepend markdown (e.g., ````json`) or inject conversational text ("Here is your report:"). The AI suggested utilizing LangChain's `.withStructuredOutput()` method combined with strict `Zod` schemas.
**Outcome**: I implemented Zod schemas for every single node. The backend now guarantees that the Next.js frontend will never crash due to a malformed property, drastically improving runtime stability.
