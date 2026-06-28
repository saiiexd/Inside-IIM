"use client";

import type { NewsAnalysis } from "@/services/ai/state";
import { ThumbsUp, ThumbsDown, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsPanelProps {
  data: NewsAnalysis;
}

const SENTIMENT_STYLES = {
  Positive: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  Neutral: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  Negative: "text-rose-500 bg-rose-500/10 border-rose-500/20",
} as const;

export function NewsPanel({ data }: NewsPanelProps) {
  const sentimentStyle = SENTIMENT_STYLES[data.marketSentiment];

  return (
    <section aria-label="News and sentiment" className="space-y-5">
      {/* Summary banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-sm">
        <div className="flex items-start gap-3 min-w-0">
          <div className="p-2 bg-primary/8 rounded-lg text-primary flex-shrink-0">
            <Newspaper className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm mb-1">Recent Developments</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {data.recentSummary}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "self-start sm:self-center flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-semibold",
            sentimentStyle,
          )}
          aria-label={`Market sentiment: ${data.marketSentiment}`}
        >
          {data.marketSentiment} Sentiment
        </div>
      </div>

      {/* Catalysts grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Positive */}
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4 text-emerald-500">
            <ThumbsUp className="w-4 h-4" aria-hidden="true" />
            <h4 className="font-semibold text-sm">Positive Catalysts</h4>
          </div>
          <ul className="space-y-3" aria-label="Positive catalysts">
            {data.positiveCatalysts.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-emerald-500 mt-0.5 text-xs leading-5">✓</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Negative */}
        <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4 text-rose-500">
            <ThumbsDown className="w-4 h-4" aria-hidden="true" />
            <h4 className="font-semibold text-sm">Negative Developments</h4>
          </div>
          <ul className="space-y-3" aria-label="Negative developments">
            {data.negativeDevelopments.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="text-rose-500 mt-0.5 text-xs leading-5">✗</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
