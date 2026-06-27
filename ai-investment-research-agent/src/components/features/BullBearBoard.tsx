"use client";

import { FinalReport } from "@/services/ai/state";
import { TrendingUp, TrendingDown } from "lucide-react";

export function BullBearBoard({ report }: { report: FinalReport }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Bull Case */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-green-500/10 border-b border-green-500/20 px-6 py-4 flex items-center gap-3">
          <div className="bg-green-500/20 p-2 rounded-lg text-green-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-green-500">The Bull Case</h3>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {report.bullCase.map((arg, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-green-500 mt-1 opacity-80">✓</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{arg}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bear Case */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-4 flex items-center gap-3">
          <div className="bg-red-500/20 p-2 rounded-lg text-red-500">
            <TrendingDown className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-red-500">The Bear Case</h3>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {report.bearCase.map((arg, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-red-500 mt-1 opacity-80">✕</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{arg}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
