"use client";

import { FinalReport } from "@/services/ai/state";
import { CircularProgress } from "../ui/CircularProgress";
import { ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";

export function InvestmentVerdictCard({ report }: { report: FinalReport }) {
  const { finalRecommendation, investmentScore, confidenceScore, executiveSummary } = report;

  const isInvest = finalRecommendation === "Invest";
  const isHold = finalRecommendation === "Hold";
  
  const recommendationColor = isInvest 
    ? "text-green-500 bg-green-500/10 border-green-500/20" 
    : isHold 
    ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" 
    : "text-red-500 bg-red-500/10 border-red-500/20";

  const RecommendationIcon = isInvest ? TrendingUp : isHold ? ShieldCheck : AlertTriangle;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm p-8 flex flex-col md:flex-row gap-8 items-center">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
      
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold mb-2">Final Verdict</h2>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${recommendationColor}`}>
            <RecommendationIcon className="w-5 h-5" />
            <span className="text-xl font-bold tracking-tight">{finalRecommendation}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Executive Summary</h3>
          <p className="text-muted-foreground leading-relaxed">
            {executiveSummary}
          </p>
        </div>
      </div>

      <div className="flex gap-6 md:border-l md:border-border/50 md:pl-8">
        <CircularProgress 
          value={investmentScore} 
          label="Score" 
          color={isInvest ? "text-green-500" : isHold ? "text-yellow-500" : "text-red-500"} 
        />
        <CircularProgress 
          value={confidenceScore} 
          label="Confidence" 
          color="text-primary" 
        />
      </div>
    </div>
  );
}
