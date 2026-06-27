"use client";

import { FinancialAnalysis } from "@/services/ai/state";
import { DollarSign, LineChart, Activity, Briefcase } from "lucide-react";

export function FinancialMetricsGrid({ data }: { data: FinancialAnalysis }) {
  const metrics = [
    { title: "Revenue Growth", value: data.revenueGrowthTrends, icon: TrendingUpIcon },
    { title: "Profitability", value: data.profitability, icon: DollarSign },
    { title: "Operating Margins", value: data.operatingMargins, icon: Activity },
    { title: "Debt Levels", value: data.debtLevels, icon: Briefcase },
    { title: "Cash Flow", value: data.cashFlowQuality, icon: LineChart },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-card border border-border/50 rounded-xl p-5 hover:border-border transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <metric.icon className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm">{metric.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {metric.value}
          </p>
        </div>
      ))}
      <div className="bg-card border border-border/50 rounded-xl p-5 hover:border-border transition-colors">
         <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-sm">Overall Strength</h4>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {data.overallFinancialStrength}
          </p>
      </div>
    </div>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
