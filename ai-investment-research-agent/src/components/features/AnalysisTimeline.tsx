"use client";

import { motion } from "framer-motion";
import { useResearchStore, LoadingStage } from "@/store/useResearchStore";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const STAGES: { id: LoadingStage; label: string; description: string }[] = [
  { id: "validating", label: "Validating Input", description: "Verifying company identity and ticker." },
  { id: "researching", label: "Company Research", description: "Gathering profile, model, and overview." },
  { id: "financials", label: "Financial Analysis", description: "Evaluating revenue, margins, and valuation." },
  { id: "news", label: "News Analysis", description: "Synthesizing recent catalysts and sentiment." },
  { id: "swot", label: "SWOT Analysis", description: "Identifying Strengths, Weaknesses, Opportunities, Threats." },
  { id: "risk", label: "Risk Assessment", description: "Evaluating operational, financial, and macro risks." },
  { id: "decision", label: "Investment Decision", description: "Calculating score and synthesizing recommendation." },
  { id: "report", label: "Report Generation", description: "Assembling final JSON report payload." },
];

export function AnalysisTimeline() {
  const { loadingStage, query } = useResearchStore();

  const getCurrentIndex = () => {
    return STAGES.findIndex(s => s.id === loadingStage);
  };

  const currentIndex = getCurrentIndex();

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-card border border-border shadow-sm">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold tracking-tight">
          Analyzing {query || "Company"}...
        </h3>
        <p className="text-muted-foreground mt-2">
          Autonomous agents are currently executing the research workflow.
        </p>
      </div>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {STAGES.map((stage, idx) => {
          const isCompleted = currentIndex > idx;
          const isActive = currentIndex === idx;
          const isPending = currentIndex < idx;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Icon */}
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full border-2 bg-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-colors duration-300 ${
                  isActive ? "border-primary text-primary" : 
                  isCompleted ? "border-green-500 text-green-500" : "border-border text-muted-foreground"
                }`}
              >
                {isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>

              {/* Content Box */}
              <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-all duration-300 ${
                isActive ? "bg-primary/5 border-primary/20 shadow-md" : 
                isCompleted ? "bg-card border-border/50 opacity-80" : "bg-transparent border-transparent opacity-40"
              }`}>
                <div className="flex flex-col">
                  <span className={`font-semibold text-sm ${isActive ? "text-primary" : "text-foreground"}`}>
                    {stage.label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {stage.description}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
