# Prompt Engineering with AI

Developing the system prompts for the multi-agent LangGraph pipeline required extensive iteration. AI played a crucial role in helping me refine these prompts to ensure the final output was analytical, objective, and strictly formatted.

## Iteration 1: The Hallucination Problem
**Original Prompt**: "You are a financial analyst. Research the company and tell me if I should invest. Use the data provided."
**The Issue**: The LLM (Llama 3.3) was too conversational. It would start responses with "Sure, here is your analysis," which broke the JSON parsers. It also frequently hallucinated financial metrics if the Tavily search didn't return exact numbers.
**AI Assistance**: I asked my AI pair programmer how to force strict adherence to the provided context and eliminate conversational filler.
**The Fix**: The AI suggested using a deeply structured System Prompt focusing on constraints. It recommended the phrase: *"Do not include any conversational filler. Only output valid JSON. If a specific metric is not found in the provided context, output 'Data unavailable' rather than estimating."*

## Iteration 2: The "Overly Bullish" Bias
**Original Decision Node Prompt**: "Review the SWOT and Financials and make an investment decision."
**The Issue**: The LLM was overwhelmingly bullish. It would rate almost every company an 85+ and recommend "Invest," even for distressed assets, because PR-heavy news articles skewed the sentiment positive.
**AI Assistance**: I collaborated with the AI to inject a skeptical persona.
**The Fix**: We updated the System Prompt for the `investmentDecisionNode` to read: *"You are a ruthless, highly skeptical institutional short-seller and value investor. You must actively look for reasons NOT to invest. Weigh operational and valuation risks heavily."* This immediately resulted in much more balanced, critical reviews (e.g., accurately rating Intel as a 'Pass').

## Iteration 3: Zod Schema Injection
**The Final Polish**: The AI helped me dynamically inject the `Zod` schema descriptions directly into the prompt context. By utilizing LangChain's `zodToJsonSchema`, we were able to pass the exact expected JSON schema into the system prompt, guaranteeing that the LLM understood not just the context, but the precise shape of the required output.
