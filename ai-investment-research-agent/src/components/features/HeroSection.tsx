"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SearchBar, EXAMPLE_COMPANIES } from "./SearchBar";
import { Sparkles, BarChart3, FileText, TrendingUp } from "lucide-react";

const FEATURES = [
  { icon: BarChart3, label: "Financial Analysis" },
  { icon: FileText, label: "SWOT Breakdown" },
  { icon: TrendingUp, label: "Risk Assessment" },
  { icon: Sparkles, label: "AI Verdict" },
];

export function HeroSection() {
  const [prefillQuery, setPrefillQuery] = useState("");

  const handleExampleClick = (company: string) => {
    setPrefillQuery(company);
  };

  return (
    <section
      aria-label="AI Investment Research Agent"
      className="relative w-full py-20 md:py-36 flex flex-col items-center justify-center text-center px-4 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/4 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm"
        >
          <span
            aria-hidden="true"
            className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
          />
          Powered by LangGraph · Gemini 1.5 Pro · Tavily Search
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight"
        >
          Institutional-Grade{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/80 to-muted-foreground">
            Investment Research
          </span>
          <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/80 to-primary/50">
            in Seconds
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed"
        >
          Enter any company name and watch autonomous AI agents perform deep financial analysis,
          SWOT evaluation, risk assessment, news synthesis, and generate an actionable
          investment recommendation — all in a single structured report.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-2 justify-center"
          aria-label="Features"
        >
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/60 border border-border/40 text-xs font-medium text-muted-foreground"
            >
              <f.icon className="w-3.5 h-3.5" aria-hidden="true" />
              {f.label}
            </div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full"
        >
          <SearchBar initialQuery={prefillQuery} onQueryChange={setPrefillQuery} />
        </motion.div>

        {/* Example companies */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-xs text-muted-foreground/70 uppercase tracking-widest font-medium">
            Try an example
          </p>
          <div className="flex flex-wrap gap-2 justify-center" role="list" aria-label="Example companies">
            {EXAMPLE_COMPANIES.map((company) => (
              <button
                key={company}
                role="listitem"
                onClick={() => handleExampleClick(company)}
                className="px-3 py-1.5 text-sm rounded-full border border-border/50 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground transition-all duration-150 cursor-pointer"
              >
                {company}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
