"use client";

import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResearchStore } from "@/store/useResearchStore";
import { HeroSection } from "@/components/features/HeroSection";
import { AnalysisTimeline } from "@/components/features/AnalysisTimeline";
import { ReportDashboard } from "@/components/features/ReportDashboard";
import { AlertCircle, RefreshCw } from "lucide-react";

const ErrorState = memo(function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[50vh] px-4 pt-20"
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-destructive/8 border border-destructive/20 p-8 rounded-3xl max-w-md w-full text-center space-y-5">
        <div className="bg-destructive/15 w-14 h-14 rounded-full flex items-center justify-center mx-auto text-destructive">
          <AlertCircle className="w-7 h-7" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-destructive mb-1">Analysis Failed</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground h-10 px-6 rounded-lg transition-colors font-medium gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          Try Again
        </button>
      </div>
    </motion.div>
  );
});

export default function Home() {
  const { isAnalyzing, report, error, reset, query } = useResearchStore();

  return (
    <div className="flex-1 w-full relative">
      {/* Hero ambient background — fades when results are visible */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-opacity duration-1000 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,theme(colors.primary/8%),transparent)] pointer-events-none ${
          isAnalyzing || report ? "opacity-0" : "opacity-100"
        }`}
      />

      <AnimatePresence mode="wait">
        {/* ── Idle: Landing ── */}
        {!isAnalyzing && !report && !error && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HeroSection />
          </motion.div>
        )}

        {/* ── Loading: Timeline ── */}
        {isAnalyzing && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="pt-20 pb-12 px-4 min-h-[70vh] flex items-start justify-center"
          >
            <AnalysisTimeline />
          </motion.div>
        )}

        {/* ── Error ── */}
        {error && !isAnalyzing && (
          <motion.div key="error">
            <ErrorState error={error} onRetry={reset} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Success: Report ── (not in AnimatePresence to preserve scroll) */}
      {report && !isAnalyzing && (
        <div className="w-full">
          {/* Sticky report header */}
          <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-md border-b border-border/40 w-full">
            <div className="max-w-6xl mx-auto flex items-center justify-between h-13 px-4 md:px-6 py-2">
              <div className="flex items-center gap-2 text-sm min-w-0">
                <span className="text-muted-foreground flex-shrink-0">Report for</span>
                <span className="font-semibold truncate">{query}</span>
              </div>
              <button
                onClick={reset}
                className="text-sm font-medium text-primary hover:text-primary/80 hover:underline underline-offset-4 transition-colors flex-shrink-0 ml-4"
                aria-label="Start a new company analysis"
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
