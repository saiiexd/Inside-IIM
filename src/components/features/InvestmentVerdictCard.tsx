"use client";

import { motion } from "framer-motion";
import type { FinalReport } from "@/services/ai/state";
import { CircularProgress } from "../ui/CircularProgress";
import { TrendingUp, ShieldCheck, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvestmentVerdictCardProps {
  report: FinalReport;
}

const VERDICT_CONFIG = {
  Invest: {
    label: "Invest",
    icon: TrendingUp,
    badge: "text-emerald-500 bg-emerald-500/10 border-emerald-500/25",
    scoreColor: "text-emerald-500",
    glow: "from-emerald-500/10 to-transparent",
    bar: "bg-emerald-500",
  },
  Hold: {
    label: "Hold",
    icon: ShieldCheck,
    badge: "text-amber-500 bg-amber-500/10 border-amber-500/25",
    scoreColor: "text-amber-500",
    glow: "from-amber-500/10 to-transparent",
    bar: "bg-amber-500",
  },
  Pass: {
    label: "Pass",
    icon: TrendingDown,
    badge: "text-rose-500 bg-rose-500/10 border-rose-500/25",
    scoreColor: "text-rose-500",
    glow: "from-rose-500/10 to-transparent",
    bar: "bg-rose-500",
  },
} as const;

export function InvestmentVerdictCard({ report }: InvestmentVerdictCardProps) {
  const {
    finalRecommendation,
    investmentScore,
    confidenceScore,
    executiveSummary,
    disclaimer,
  } = report;

  const config = VERDICT_CONFIG[finalRecommendation];
  const Icon = config.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      aria-label={`Investment verdict: ${finalRecommendation}`}
      className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
    >
      {/* Ambient gradient overlay keyed to verdict */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-40 pointer-events-none",
          config.glow,
        )}
      />

      {/* Top accent line */}
      <div
        aria-hidden="true"
        className={cn("h-1 w-full", config.bar)}
      />

      <div className="relative p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
        {/* Left column: verdict + summary */}
        <div className="flex-1 space-y-5 min-w-0">
          {/* Label */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
              Final Verdict
            </p>
            <div
              className={cn(
                "inline-flex items-center gap-2.5 px-4 py-2 rounded-full border font-bold text-lg",
                config.badge,
              )}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              {config.label}
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Executive Summary
            </h3>
            <p className="text-sm leading-relaxed text-foreground/90 line-clamp-6 md:line-clamp-none">
              {executiveSummary}
            </p>
          </div>

          {/* Disclaimer */}
          {disclaimer && (
            <p className="text-xs text-muted-foreground/60 italic border-t border-border/40 pt-4">
              {disclaimer}
            </p>
          )}
        </div>

        {/* Right column: circular scores */}
        <div
          className="flex gap-6 md:border-l md:border-border/40 md:pl-8 flex-shrink-0"
          aria-label="Scores"
        >
          <div className="flex flex-col items-center gap-2">
            <CircularProgress
              value={investmentScore}
              label="Score"
              color={config.scoreColor}
              size={120}
            />
            <p className="text-xs text-muted-foreground">Investment Score</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircularProgress
              value={confidenceScore}
              label="Confidence"
              color="text-primary"
              size={120}
            />
            <p className="text-xs text-muted-foreground">Confidence</p>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
