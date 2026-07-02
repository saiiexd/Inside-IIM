"use client";

import type { RiskAssessment } from "@/services/ai/state";
import { ShieldAlert, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type RiskLevel = "Low" | "Medium" | "High";

interface RiskEntry {
  label: string;
  level: RiskLevel;
  explanation: string;
}

const LEVEL_CONFIG: Record<
  RiskLevel,
  { badge: string; icon: React.ElementType }
> = {
  High: {
    badge: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    icon: ShieldAlert,
  },
  Medium: {
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    icon: AlertTriangle,
  },
  Low: {
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: Info,
  },
};

interface RiskPanelProps {
  data: RiskAssessment;
}

export function RiskPanel({ data }: RiskPanelProps) {
  const risks: RiskEntry[] = [
    { label: "Operational", ...data.operationalRisk },
    { label: "Financial", ...data.financialRisk },
    { label: "Technological", ...data.technologicalRisk },
    { label: "Regulatory", ...data.regulatoryRisk },
    { label: "Competitive", ...data.competitiveRisk },
    { label: "Geopolitical", ...data.geopoliticalExposure },
    { label: "Execution", ...data.executionRisk },
    { label: "Valuation", ...data.valuationRisk },
    { label: "Macroeconomic", ...data.macroeconomicSensitivity },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      role="list"
      aria-label="Risk assessment"
    >
      {risks.map(({ label, level, explanation }) => {
        const { badge, icon: Icon } = LEVEL_CONFIG[level];
        return (
          <div
            key={label}
            role="listitem"
            className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors duration-150"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">{label} Risk</h4>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border",
                  badge,
                )}
                aria-label={`${label} risk level: ${level}`}
              >
                <Icon className="w-3 h-3" aria-hidden="true" />
                {level}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {explanation}
            </p>
          </div>
        );
      })}
    </div>
  );
}
