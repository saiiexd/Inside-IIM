"use client";

import { NewsAnalysis } from "@/services/ai/state";
import { ThumbsUp, ThumbsDown, Newspaper } from "lucide-react";

export function NewsPanel({ data }: { data: NewsAnalysis }) {
  const isPositive = data.marketSentiment === "Positive";
  const isNeutral = data.marketSentiment === "Neutral";
  
  const sentimentColor = isPositive 
    ? "text-green-500 bg-green-500/10 border-green-500/20" 
    : isNeutral 
    ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" 
    : "text-red-500 bg-red-500/10 border-red-500/20";

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold">Recent Developments</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{data.recentSummary}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${sentimentColor}`}>
          {data.marketSentiment} Sentiment
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-green-500">
            <ThumbsUp className="w-5 h-5" />
            <h4 className="font-semibold">Positive Catalysts</h4>
          </div>
          <ul className="space-y-3">
            {data.positiveCatalysts.map((item, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <ThumbsDown className="w-5 h-5" />
            <h4 className="font-semibold">Negative Developments</h4>
          </div>
          <ul className="space-y-3">
            {data.negativeDevelopments.map((item, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
