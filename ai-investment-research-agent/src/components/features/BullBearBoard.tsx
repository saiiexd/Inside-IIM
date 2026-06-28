"use client";

import type { FinalReport } from "@/services/ai/state";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BullBearBoardProps {
  report: FinalReport;
}

export function BullBearBoard({ report }: BullBearBoardProps) {
  return (
    <div className="grid md:grid-cols-2 gap-5" role="list" aria-label="Bull and bear cases">
      {/* Bull Case */}
      <article
        role="listitem"
        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
        aria-label="Bull case"
      >
        <div className="bg-emerald-500/8 border-b border-emerald-500/15 px-6 py-4 flex items-center gap-3">
          <div className="bg-emerald-500/15 p-2 rounded-lg">
            <TrendingUp className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-emerald-500">The Bull Case</h3>
        </div>
        <ul className="p-6 space-y-4" aria-label="Arguments for investing">
          {report.bullCase.map((arg, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="text-emerald-500/80 mt-0.5 text-xs leading-5 font-bold"
              >
                ✓
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{arg}</p>
            </li>
          ))}
        </ul>
      </article>

      {/* Bear Case */}
      <article
        role="listitem"
        className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
        aria-label="Bear case"
      >
        <div className="bg-rose-500/8 border-b border-rose-500/15 px-6 py-4 flex items-center gap-3">
          <div className="bg-rose-500/15 p-2 rounded-lg">
            <TrendingDown className="w-4 h-4 text-rose-500" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-rose-500">The Bear Case</h3>
        </div>
        <ul className="p-6 space-y-4" aria-label="Arguments against investing">
          {report.bearCase.map((arg, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="text-rose-500/80 mt-0.5 text-xs leading-5 font-bold"
              >
                ✗
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{arg}</p>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
