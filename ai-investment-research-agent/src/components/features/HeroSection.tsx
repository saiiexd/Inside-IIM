import { SearchBar } from "./SearchBar";

export function HeroSection() {
  return (
    <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center rounded-full border border-border/50 bg-secondary/50 px-3 py-1 text-sm font-medium text-secondary-foreground backdrop-blur-sm mb-4">
          <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          Agentic AI Research Platform
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground sm:text-5xl">
          Institutional Grade <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
            Investment Research
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
          Leverage LangGraph autonomous agents to perform deep financial analysis, evaluate risk, synthesize recent news, and generate actionable investment recommendations in seconds.
        </p>
        
        <SearchBar />
      </div>
    </section>
  );
}
