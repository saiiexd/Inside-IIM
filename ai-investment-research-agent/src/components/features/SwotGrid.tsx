"use client";

import { SwotAnalysis } from "@/services/ai/state";
import { Dumbbell, HeartCrack, Zap, ShieldAlert } from "lucide-react";

export function SwotGrid({ data }: { data: SwotAnalysis }) {
  const sections = [
    { title: "Strengths", items: data.strengths, icon: Dumbbell, color: "text-green-500", bg: "bg-green-500/5", border: "border-green-500/10" },
    { title: "Weaknesses", items: data.weaknesses, icon: HeartCrack, color: "text-red-500", bg: "bg-red-500/5", border: "border-red-500/10" },
    { title: "Opportunities", items: data.opportunities, icon: Zap, color: "text-blue-500", bg: "bg-blue-500/5", border: "border-blue-500/10" },
    { title: "Threats", items: data.threats, icon: ShieldAlert, color: "text-orange-500", bg: "bg-orange-500/5", border: "border-orange-500/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {sections.map((section, idx) => (
        <div key={idx} className={`${section.bg} border ${section.border} rounded-2xl p-5`}>
          <div className={`flex items-center gap-2 mb-4 ${section.color}`}>
            <section.icon className="w-5 h-5" />
            <h4 className="font-semibold">{section.title}</h4>
          </div>
          <ul className="space-y-3">
            {section.items.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed flex items-start gap-2">
                <span className={`${section.color} mt-1 opacity-70`}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
