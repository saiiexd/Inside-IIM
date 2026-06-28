import { create } from "zustand";
import type { FinalReport } from "@/services/ai/state";

// ── Loading stage type ──────────────────────────────────────────────────────
export type LoadingStage =
  | "idle"
  | "validating"
  | "researching"
  | "financials"
  | "news"
  | "swot"
  | "risk"
  | "decision"
  | "report"
  | "complete"
  | "error";

// ── Store interface ─────────────────────────────────────────────────────────
interface ResearchStore {
  query: string;
  isAnalyzing: boolean;
  loadingStage: LoadingStage;
  error: string | null;
  report: FinalReport | null;

  analyzeCompany: (companyName: string) => Promise<void>;
  reset: () => void;
  cancelRequest: () => void;
}

// ── Stage progression (mirrors graph nodes) ─────────────────────────────────
const STAGES: LoadingStage[] = [
  "validating",
  "researching",
  "financials",
  "news",
  "swot",
  "risk",
  "decision",
  "report",
  "complete",
];

/** Module-level ref so abort works even after re-renders */
let _abortController: AbortController | null = null;
let _stageInterval: ReturnType<typeof setInterval> | null = null;

const clearStageInterval = () => {
  if (_stageInterval !== null) {
    clearInterval(_stageInterval);
    _stageInterval = null;
  }
};

// ── Store ────────────────────────────────────────────────────────────────────
export const useResearchStore = create<ResearchStore>((set, get) => ({
  query: "",
  isAnalyzing: false,
  loadingStage: "idle",
  error: null,
  report: null,

  cancelRequest: () => {
    _abortController?.abort();
    _abortController = null;
    clearStageInterval();
    set({ isAnalyzing: false, loadingStage: "idle" });
  },

  reset: () => {
    get().cancelRequest();
    set({ query: "", error: null, report: null, loadingStage: "idle" });
  },

  analyzeCompany: async (companyName: string) => {
    // Cancel any in-flight request before starting a new one
    get().cancelRequest();

    set({
      isAnalyzing: true,
      loadingStage: "validating",
      error: null,
      report: null,
      query: companyName,
    });

    _abortController = new AbortController();

    // Simulate progressive stage display (≈5s per node; real API takes 40–60s)
    let stageIndex = 0;
    _stageInterval = setInterval(() => {
      stageIndex += 1;
      // Stay one before 'complete' — final stage set on API return
      if (stageIndex < STAGES.length - 1) {
        set({ loadingStage: STAGES[stageIndex] });
      } else {
        clearStageInterval();
      }
    }, 5_000);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
        signal: _abortController.signal,
      });

      clearStageInterval();

      const data: unknown = await res.json();

      if (!res.ok) {
        const errData = data as { error?: string; details?: string[] };
        const message =
          errData.error ??
          (Array.isArray(errData.details) ? errData.details[0] : undefined) ??
          "Analysis failed. Please try again.";
        throw new Error(message);
      }

      set({
        report: data as FinalReport,
        loadingStage: "complete",
        isAnalyzing: false,
      });
    } catch (err: unknown) {
      clearStageInterval();

      // Silently handle user-initiated cancellations
      if (err instanceof Error && err.name === "AbortError") return;

      const message =
        err instanceof Error ? err.message : "Failed to connect to the server.";

      set({
        error: message,
        loadingStage: "error",
        isAnalyzing: false,
      });
    } finally {
      _abortController = null;
    }
  },
}));
