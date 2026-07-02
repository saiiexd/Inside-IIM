"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useResearchStore, type LoadingStage } from "@/store/useResearchStore";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

interface Stage {
  id: LoadingStage;
  label: string;
  description: string;
}

const STAGES: Stage[] = [
  {
    id: "validating",
    label: "Validating Input",
    description: "Verifying company identity and normalising the name.",
  },
  {
    id: "researching",
    label: "Company Research",
    description: "Fetching public profile, business model, and market position.",
  },
  {
    id: "financials",
    label: "Financial Analysis",
    description: "Evaluating revenue growth, margins, cash flow, and valuation.",
  },
  {
    id: "news",
    label: "News & Sentiment",
    description: "Synthesising recent catalysts, developments, and market mood.",
  },
  {
    id: "swot",
    label: "SWOT Analysis",
    description: "Identifying strengths, weaknesses, opportunities, and threats.",
  },
  {
    id: "risk",
    label: "Risk Assessment",
    description: "Scoring nine risk dimensions from operational to macro.",
  },
  {
    id: "decision",
    label: "Investment Decision",
    description: "Calculating investment score and synthesising recommendation.",
  },
  {
    id: "report",
    label: "Report Generation",
    description: "Assembling the final structured research report.",
  },
];

export function AnalysisTimeline() {
  const { loadingStage, query } = useResearchStore();
  const currentIndex = STAGES.findIndex((s) => s.id === loadingStage);

  return (
    <AnimatePresence>
      <motion.div
        key="timeline"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl mx-auto"
        role="status"
        aria-live="polite"
        aria-label={`Analyzing ${query || "company"}`}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mb-4 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/40">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" aria-hidden="true" />
            Research in progress
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Analysing{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary/90 to-primary/50">
              {query || "Company"}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Autonomous agents are executing the research pipeline. This typically takes 40–60 seconds.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-8 space-y-0">
          {/* Vertical line */}
          <div
            aria-hidden="true"
            className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-border to-transparent"
          />

          {STAGES.map((stage, idx) => {
            const isCompleted = currentIndex > idx;
            const isActive = currentIndex === idx;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.3 }}
                className="relative flex items-start gap-4 pb-6 last:pb-0"
              >
                {/* Node icon */}
                <div
                  aria-hidden="true"
                  className={`absolute left-[-1.4rem] flex items-center justify-center w-7 h-7 rounded-full border-2 bg-background transition-all duration-300 ${
                    isActive
                      ? "border-primary shadow-sm shadow-primary/20"
                      : isCompleted
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-border/50"
                  }`}
                >
                  {isActive ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  ) : isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-border" />
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? "bg-primary/5 border-primary/20 shadow-sm"
                      : isCompleted
                      ? "bg-emerald-500/5 border-emerald-500/10 opacity-70"
                      : "bg-transparent border-transparent opacity-30"
                  }`}
                >
                  <p
                    className={`font-semibold text-sm ${
                      isActive ? "text-primary" : isCompleted ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
                    }`}
                  >
                    {stage.label}
                    {isCompleted && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        — done
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stage.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
