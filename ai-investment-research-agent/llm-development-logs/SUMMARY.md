# AI Assistance in Development

This document summarizes how Large Language Models (LLMs) were utilized as an engineering assistant during the development of the AI Investment Research Agent, addressing the bonus point requirement for the InsideIIM assignment.

## Complete Transcript

The complete, unedited conversation logs of my development sessions with the LLM are available in this directory:
- [transcript.jsonl](./transcript.jsonl)

## Role of the AI Assistant

During this project, I employed the AI as a "Pair Programmer" and "Research Assistant," rather than relying on it as a fully autonomous code generator. I retained full architectural control and utilized the AI to accelerate specific tasks.

### 1. Architectural Brainstorming
- **Initial Graph Design**: I used the AI to brainstorm the optimal node structure for LangGraph.js. While I proposed a basic linear flow, the AI suggested adding a dedicated "Risk Assessment Node" before the final decision generation to ensure the agent actively searches for bear-case scenarios. I adopted this into the final architecture.
- **Technology Stack Validation**: I verified my decision to use Next.js API routes vs. a standalone Express server by discussing the trade-offs of Vercel serverless function timeouts with the AI.

### 2. Boilerplate & Schema Generation
- **Zod Schema Generation**: The backend relies heavily on Zod models to strictly enforce JSON outputs from LangChain. The AI was utilized to rapidly write out these complex Zod schemas for the financial data, SWOT matrices, and risk assessments, saving hours of manual typing and ensuring absolute type safety across the API boundary.

### 3. Prompt Engineering & Refinement
- **Agent Instructions**: Writing robust system prompts for the agents (especially the Decision and Report nodes) requires significant trial and error. I used an LLM to evaluate and "red-team" my initial prompts, asking it to find loopholes where an agent might hallucinate or ignore constraints.
- **Structured Output Constraints**: The AI helped refine the prompt instructions required to guarantee the model strictly adhered to LangChain's `withStructuredOutput()` requirements without appending conversational filler like "Here is the JSON you requested."

### 4. Debugging & Error Resolution
- **React Hydration Issues**: The AI assisted in debugging a React hydration error on the frontend caused by mismatched server/client states during the initial rendering of the Bento UI components.
- **LangGraph State Merging**: I encountered an issue where array states in LangGraph were overwriting each other instead of appending. I used the AI to quickly identify the proper reducer function required in LangGraph.js to concatenate arrays across nodes.

## Conclusion

The use of AI dramatically accelerated the development timeline from concept to production. However, all core logic—specifically the Next.js API boundary, LangGraph state management, UI component layout, and error handling—was deeply understood, reviewed, and manually integrated by me. The AI acted as a force multiplier, proving the value of AI fluency in modern software engineering.
