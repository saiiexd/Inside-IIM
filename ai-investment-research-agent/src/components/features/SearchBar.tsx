"use client";

import { Search, Loader2, ArrowRight } from "lucide-react";
import { useState, KeyboardEvent } from "react";
import { useResearchStore } from "@/store/useResearchStore";

export function SearchBar() {
  const [localQuery, setLocalQuery] = useState("");
  const { analyzeCompany, isAnalyzing } = useResearchStore();

  const handleSearch = () => {
    if (!localQuery.trim() || isAnalyzing) return;
    analyzeCompany(localQuery.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative group w-full max-w-2xl mx-auto flex items-center mt-8">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex w-full items-center bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-2 shadow-sm transition-all focus-within:shadow-md focus-within:border-primary/50">
        <Search className="ml-3 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAnalyzing}
          placeholder="Enter a company name (e.g., NVIDIA, Apple, Reliance)..."
          className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-foreground placeholder:text-muted-foreground disabled:opacity-50 text-lg"
        />
        <button
          onClick={handleSearch}
          disabled={!localQuery.trim() || isAnalyzing}
          className="flex items-center justify-center bg-primary text-primary-foreground h-12 w-12 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          aria-label="Analyze Company"
        >
          {isAnalyzing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ArrowRight className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
