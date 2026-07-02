"use client";

import type { SwotAnalysis } from "@/services/ai/state";
import { Dumbbell, HeartCrack, Zap, ShieldAlert } from "lucide-react";

interface SwotSectionConfig {
  title: keyof SwotAnalysis;
  label: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

const SWOT_SECTIONS: SwotSectionConfig[] = [
  {
    title: "strengths",
    label: "Strengths",
    icon: Dumbbell,
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500/5",
    borderClass: "border-emerald-500/15",
  },
  {
    title: "weaknesses",
    label: "Weaknesses",
    icon: HeartCrack,
    colorClass: "text-rose-500",
    bgClass: "bg-rose-500/5",
    borderClass: "border-rose-500/15",
  },
  {
    title: "opportunities",
    label: "Opportunities",
    icon: Zap,
    colorClass: "text-blue-500",
    bgClass: "bg-blue-500/5",
    borderClass: "border-blue-500/15",
  },
  {
    title: "threats",
    label: "Threats",
    icon: ShieldAlert,
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500/5",
    borderClass: "border-orange-500/15",
  },
];

interface SwotGridProps {
  data: SwotAnalysis;
}

export function SwotGrid({ data }: SwotGridProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      role="list"
      aria-label="SWOT analysis"
    >
      {SWOT_SECTIONS.map((section) => {
        const items = data[section.title] as string[];
        const Icon = section.icon;
        return (
          <div
            key={section.title}
            role="listitem"
            aria-label={section.label}
            className={`${section.bgClass} border ${section.borderClass} rounded-2xl p-5`}
          >
            <div className={`flex items-center gap-2 mb-4 ${section.colorClass}`}>
              <Icon className="w-4 h-4" aria-hidden="true" />
              <h4 className="font-semibold text-sm">{section.label}</h4>
            </div>
            <ul className="space-y-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span
                    aria-hidden="true"
                    className={`${section.colorClass} opacity-60 mt-0.5 text-xs leading-5`}
                  >
                    •
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
