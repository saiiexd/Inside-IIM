"use client";

import { Search, Loader2, ArrowRight, X } from "lucide-react";
import { useCallback, useRef, KeyboardEvent, useState, useEffect } from "react";
import { useResearchStore } from "@/store/useResearchStore";

const EXAMPLE_COMPANIES = [
  "NVIDIA",
  "Apple",
  "Tesla",
  "Reliance Industries",
  "Zomato",
  "Microsoft",
  "Amazon",
  "Infosys",
];

interface SearchBarProps {
  /** Optionally pre-fill the query (e.g., from example company click) */
  initialQuery?: string;
  onQueryChange?: (q: string) => void;
}

export function SearchBar({ initialQuery = "", onQueryChange }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);
  const { analyzeCompany, isAnalyzing, reset } = useResearchStore();

  // Sync when parent changes initialQuery (e.g., example chip click)
  useEffect(() => {
    setQuery(initialQuery);
    if (initialQuery) inputRef.current?.focus();
  }, [initialQuery]);

  const handleChange = (val: string) => {
    setQuery(val);
    onQueryChange?.(val);
  };

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed || isAnalyzing) return;
    analyzeCompany(trimmed);
  }, [query, isAnalyzing, analyzeCompany]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") handleChange("");
  };

  const handleClear = () => {
    handleChange("");
    reset();
    inputRef.current?.focus();
  };

  return (
    <div
      className="relative group w-full max-w-2xl mx-auto"
      role="search"
      aria-label="Company search"
    >
      {/* Glow effect */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-primary/15 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 group-focus-within:opacity-80 transition-opacity duration-500 pointer-events-none"
      />

      <div className="relative flex w-full items-center bg-card border border-border/60 rounded-2xl p-2 shadow-sm transition-all duration-200 focus-within:shadow-lg focus-within:border-primary/50">
        <Search className="ml-3 h-5 w-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />

        <input
          ref={inputRef}
          id="company-search"
          type="text"
          role="searchbox"
          aria-label="Enter company name"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAnalyzing}
          placeholder="Search a company (e.g., NVIDIA, Apple, Reliance)…"
          autoComplete="off"
          className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-foreground placeholder:text-muted-foreground/60 disabled:opacity-50 text-base sm:text-lg min-w-0"
        />

        {query && !isAnalyzing && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="mr-2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={!query.trim() || isAnalyzing}
          aria-label={isAnalyzing ? "Analyzing…" : "Analyze company"}
          className="flex items-center justify-center bg-primary text-primary-foreground h-11 w-11 rounded-xl transition-all duration-150 hover:opacity-90 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed flex-shrink-0"
        >
          {isAnalyzing ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}

export { EXAMPLE_COMPANIES };
