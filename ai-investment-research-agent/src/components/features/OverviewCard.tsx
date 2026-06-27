"use client";

import { CompanyResearch } from "@/services/ai/state";
import { Building2, MapPin, Target, Users } from "lucide-react";

export function OverviewCard({ data }: { data: CompanyResearch }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">{data.companyName}</h3>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            {data.ticker && <span className="bg-secondary px-2 py-0.5 rounded text-xs font-mono">{data.ticker}</span>}
            {data.industry} • {data.sector}
          </p>
        </div>
      </div>
      
      <p className="text-sm leading-relaxed mb-6">{data.companyOverview}</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> HQ</span>
          <span className="text-sm font-medium">{data.headquarters}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Users className="w-3 h-3"/> CEO</span>
          <span className="text-sm font-medium">{data.ceo}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Target className="w-3 h-3"/> Business Model</span>
          <span className="text-sm font-medium line-clamp-2">{data.businessModel}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Building2 className="w-3 h-3"/> Founded</span>
          <span className="text-sm font-medium">{data.foundingYear}</span>
        </div>
      </div>
    </div>
  );
}
