import { create } from 'zustand';
import { FinalReport } from '@/services/ai/state';

export type LoadingStage = 
  | 'idle'
  | 'validating'
  | 'researching'
  | 'financials'
  | 'news'
  | 'swot'
  | 'risk'
  | 'decision'
  | 'report'
  | 'complete'
  | 'error';

interface ResearchState {
  query: string;
  setQuery: (query: string) => void;
  
  isAnalyzing: boolean;
  loadingStage: LoadingStage;
  error: string | null;
  report: FinalReport | null;
  
  analyzeCompany: (companyName: string) => Promise<void>;
  reset: () => void;
  cancelRequest: () => void;
}

// Global abort controller to handle cancellations
let abortController: AbortController | null = null;

const stages: LoadingStage[] = [
  'validating',
  'researching',
  'financials',
  'news',
  'swot',
  'risk',
  'decision',
  'report',
  'complete'
];

export const useResearchStore = create<ResearchState>((set, get) => ({
  query: '',
  setQuery: (query: string) => set({ query }),
  
  isAnalyzing: false,
  loadingStage: 'idle',
  error: null,
  report: null,
  
  cancelRequest: () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    set({ isAnalyzing: false, loadingStage: 'idle' });
  },

  reset: () => {
    get().cancelRequest();
    set({ query: '', error: null, report: null, loadingStage: 'idle' });
  },
  
  analyzeCompany: async (companyName: string) => {
    // Cancel previous request if any
    get().cancelRequest();
    
    set({ 
      isAnalyzing: true, 
      loadingStage: 'validating', 
      error: null, 
      report: null,
      query: companyName 
    });
    
    abortController = new AbortController();

    // Setup a simulated timeline progression to give user feedback
    // In a real WebSocket setup this would be event-driven.
    // For HTTP, we fake the timeline based on time elapsed.
    let currentStageIndex = 0;
    const stageInterval = setInterval(() => {
      currentStageIndex++;
      if (currentStageIndex < stages.length - 1) { // Don't reach 'complete' via interval
        set({ loadingStage: stages[currentStageIndex] });
      } else {
        clearInterval(stageInterval);
      }
    }, 4500); // Progress every 4.5s
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyName }),
        signal: abortController.signal,
      });
      
      clearInterval(stageInterval);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.details?.[0] || 'An error occurred during analysis.');
      }
      
      set({ 
        report: data as FinalReport, 
        loadingStage: 'complete', 
        isAnalyzing: false 
      });
      
    } catch (error: any) {
      clearInterval(stageInterval);
      if (error.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }
      set({ 
        error: error.message || 'Failed to connect to the server.',
        loadingStage: 'error',
        isAnalyzing: false 
      });
    } finally {
      abortController = null;
    }
  },
}));
