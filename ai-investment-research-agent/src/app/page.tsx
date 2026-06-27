"use client";

import { useResearchStore } from "@/store/useResearchStore";
import { HeroSection } from "@/components/features/HeroSection";
import { AnalysisTimeline } from "@/components/features/AnalysisTimeline";
import { ReportDashboard } from "@/components/features/ReportDashboard";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Home() {
  const { isAnalyzing, report, error, reset, query } = useResearchStore();

  return (
    <div className="flex-1 w-full relative">
      {/* Dynamic Backgrounds based on state */}
      <div className={`absolute inset-0 -z-10 transition-opacity duration-1000 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background ${isAnalyzing || report ? 'opacity-0' : 'opacity-100'}`} />
      
      {!isAnalyzing && !report && !error && (
        <HeroSection />
      )}

      {isAnalyzing && (
        <div className="pt-24 px-4 min-h-[60vh]">
          <AnalysisTimeline />
        </div>
      )}

      {error && !isAnalyzing && (
        <div className="pt-32 px-4 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="bg-destructive/10 border border-destructive/20 p-8 rounded-3xl max-w-lg text-center space-y-6">
            <div className="bg-destructive/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-destructive">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-destructive mb-2">Analysis Failed</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <button 
              onClick={reset}
              className="inline-flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground h-10 px-6 rounded-lg transition-colors font-medium gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      )}

      {report && !isAnalyzing && (
        <div className="w-full relative">
          <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 w-full">
            <div className="container max-w-screen-2xl mx-auto flex items-center justify-between h-14 px-4 md:px-8">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Analysis for:</span>
                <span className="font-semibold">{query}</span>
              </div>
              <button 
                onClick={reset}
                className="text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                New Search
              </button>
            </div>
          </div>
          <ReportDashboard />
        </div>
      )}
    </div>
  );
}
