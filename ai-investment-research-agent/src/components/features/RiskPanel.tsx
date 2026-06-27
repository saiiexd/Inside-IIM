"use client";

import { RiskAssessment } from "@/services/ai/state";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";

export function RiskPanel({ data }: { data: RiskAssessment }) {
  const risks = [
    { name: "Operational", data: data.operationalRisk },
    { name: "Financial", data: data.financialRisk },
    { name: "Technological", data: data.technologicalRisk },
    { name: "Regulatory", data: data.regulatoryRisk },
    { name: "Competitive", data: data.competitiveRisk },
    { name: "Geopolitical", data: data.geopoliticalExposure },
    { name: "Execution", data: data.executionRisk },
    { name: "Valuation", data: data.valuationRisk },
    { name: "Macroeconomic", data: data.macroeconomicSensitivity },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {risks.map((risk, idx) => {
        const isHigh = risk.data.level === "High";
        const isMedium = risk.data.level === "Medium";
        const isLow = risk.data.level === "Low";

        const badgeColor = isHigh 
          ? "bg-red-500/10 text-red-500 border-red-500/20" 
          : isMedium 
          ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" 
          : "bg-green-500/10 text-green-500 border-green-500/20";
        
        const Icon = isHigh ? ShieldAlert : isMedium ? AlertTriangle : Info;

        return (
          <div key={idx} className="bg-card border border-border rounded-xl p-5 hover:border-border/80 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-sm">{risk.name} Risk</h4>
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border ${badgeColor}`}>
                <Icon className="w-3 h-3" />
                {risk.data.level}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
              {risk.data.explanation}
            </p>
          </div>
        );
      })}
    </div>
  );
}
