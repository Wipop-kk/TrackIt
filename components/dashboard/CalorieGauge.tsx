"use client";

import { useTranslation } from "@/components/providers/LanguageProvider";

interface CalorieGaugeProps {
  consumed: number;
  goal: number;
}

/**
 * SVG circular gauge shaped like a shuttlecock viewed from above.
 * Ring fills yellow toward goal, turns coral red if exceeded.
 */
export function CalorieGauge({ consumed, goal }: CalorieGaugeProps) {
  const { t } = useTranslation();
  const remaining = Math.max(0, goal - consumed);
  const percentage = goal > 0 ? consumed / goal : 0;
  const isOver = consumed > goal;

  // SVG circle parameters
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(percentage, 1); // Cap visual at 100%
  const offset = circumference - progress * circumference;

  return (
    <div className="relative w-[130px] h-[130px] flex-shrink-0">
      <svg viewBox="0 0 110 110" className="w-full h-full -rotate-90">
        {/* Background track */}
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Progress ring */}
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke={isOver ? "hsl(var(--over-limit))" : "hsl(var(--shuttlecock))"}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
          style={{ "--gauge-offset": offset } as React.CSSProperties}
        />
      </svg>

      {/* Center text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-numeric text-2xl font-bold leading-none ${
            isOver ? "text-over-limit" : "text-foreground"
          }`}
        >
          {isOver ? `+${Math.round(consumed - goal)}` : Math.round(remaining)}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">
          {isOver ? t.kcalOver : t.kcalLeft}
        </span>
      </div>
    </div>
  );
}
