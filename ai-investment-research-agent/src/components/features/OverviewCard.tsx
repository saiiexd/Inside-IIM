"use client";

import type { CompanyResearch } from "@/services/ai/state";
import { MapPin, User, Target, Calendar, Globe, Tag } from "lucide-react";

interface OverviewCardProps {
  data: CompanyResearch;
}

export function OverviewCard({ data }: OverviewCardProps) {
  const meta = [
    { icon: MapPin, label: "HQ", value: data.headquarters },
    { icon: User, label: "CEO", value: data.ceo },
    { icon: Calendar, label: "Founded", value: String(data.foundingYear) },
    { icon: Target, label: "Business Model", value: data.businessModel },
  ];

  return (
    <article className="bg-card border border-border rounded-2xl p-6 shadow-sm" aria-label="Company overview">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-3 mb-5">
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold tracking-tight truncate">{data.companyName}</h3>
          <p className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-sm">
            {data.ticker && (
              <span className="bg-secondary border border-border/50 px-2 py-0.5 rounded font-mono text-xs font-semibold">
                {data.ticker}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" aria-hidden="true" />
              {data.industry}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" aria-hidden="true" />
              {data.sector}
            </span>
          </p>
        </div>
      </div>

      {/* Overview paragraph */}
      <p className="text-sm leading-relaxed text-foreground/85 mb-6">
        {data.companyOverview}
      </p>

      {/* Metadata grid */}
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-border/50">
        {meta.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="text-xs text-muted-foreground flex items-center gap-1 font-medium uppercase tracking-wide">
              <Icon className="w-3 h-3" aria-hidden="true" />
              {label}
            </dt>
            <dd className="text-sm font-semibold leading-snug">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Products */}
      {data.productsAndServices?.length > 0 && (
        <div className="mt-5 pt-5 border-t border-border/40">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
            Key Products &amp; Services
          </p>
          <div className="flex flex-wrap gap-2">
            {data.productsAndServices.slice(0, 8).map((p) => (
              <span
                key={p}
                className="px-2.5 py-1 text-xs rounded-full bg-secondary/70 border border-border/40 text-secondary-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
