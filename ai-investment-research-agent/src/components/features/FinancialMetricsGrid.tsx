"use client";

import type { FinancialAnalysis } from "@/services/ai/state";
import {
  TrendingUp,
  DollarSign,
  Activity,
  Briefcase,
  CreditCard,
  BarChart3,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5 hover:border-border transition-colors duration-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary/8 rounded-lg text-primary flex-shrink-0">
          <Icon className="w-4 h-4" aria-hidden="true" />
        </div>
        <h4 className="font-semibold text-sm">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{value}</p>
    </div>
  );
}

interface FinancialMetricsGridProps {
  data: FinancialAnalysis;
}

export function FinancialMetricsGrid({ data }: FinancialMetricsGridProps) {
  const metrics: MetricCardProps[] = [
    { title: "Revenue Growth", value: data.revenueGrowthTrends, icon: TrendingUp },
    { title: "Profitability", value: data.profitability, icon: DollarSign },
    { title: "Operating Margins", value: data.operatingMargins, icon: Activity },
    { title: "Cash Flow Quality", value: data.cashFlowQuality, icon: Briefcase },
    { title: "Debt Levels", value: data.debtLevels, icon: CreditCard },
    { title: "Earnings Trends", value: data.earningsTrends, icon: BarChart3 },
  ];

  const confidenceColor = {
    High: "text-emerald-500",
    Medium: "text-amber-500",
    Low: "text-rose-500",
  }[data.confidenceLevel];

  const ConfidenceIcon = data.confidenceLevel === "High" ? CheckCircle2 : AlertCircle;

  return (
    <div className="space-y-4">
      {/* Overall strength summary */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          <strong className="text-foreground">Financial Strength:</strong>{" "}
          {data.overallFinancialStrength}
        </p>
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs font-semibold flex-shrink-0",
            confidenceColor,
          )}
          title={`Analyst confidence: ${data.confidenceLevel}`}
        >
          <ConfidenceIcon className="w-4 h-4" aria-hidden="true" />
          {data.confidenceLevel} Confidence
        </div>
      </div>

      {/* Metric cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Financial metrics">
        {metrics.map((m) => (
          <div key={m.title} role="listitem">
            <MetricCard {...m} />
          </div>
        ))}
        {data.valuationConcerns && (
          <div role="listitem">
            <MetricCard title="Valuation" value={data.valuationConcerns} icon={AlertCircle} />
          </div>
        )}
      </div>
    </div>
  );
}
