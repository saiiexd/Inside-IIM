"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CircularProgressProps {
  /** Value between 0 and 100 */
  value: number;
  /** Display size in px */
  size?: number;
  strokeWidth?: number;
  /** Tailwind colour class e.g. "text-emerald-500" */
  color?: string;
  label?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  color = "text-primary",
  label,
}: CircularProgressProps) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    // Delay so the animation is visible after mount
    const t = setTimeout(() => setAnimated(Math.min(100, Math.max(0, value))), 250);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <figure
      aria-label={`${label ?? "Score"}: ${value}`}
      className="relative inline-flex flex-col items-center justify-center"
    >
      <svg
        width={size}
        height={size}
        aria-hidden="true"
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted opacity-15"
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className={color}
        />
      </svg>

      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-bold tabular-nums leading-none">
          {Math.round(animated)}
        </span>
        {label && (
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mt-1">
            {label}
          </span>
        )}
      </div>
    </figure>
  );
}
