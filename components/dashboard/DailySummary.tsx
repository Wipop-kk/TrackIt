"use client";

import { CalorieGauge } from "./CalorieGauge";
import { MacroBar } from "./MacroBar";
import { PresetPills } from "./PresetPills";
import { useTranslation } from "@/components/providers/LanguageProvider";
import type { Preset } from "@/lib/types";
import type { MealTotals } from "@/lib/calculations";

interface DailySummaryProps {
  preset: Preset | null;
  presets: Preset[];
  totals: MealTotals;
  onPresetChange: (presetId: string) => void;
  activeDayPresetId: string | null;
}

/**
 * Daily Summary card — shuttlecock gauge, calorie stats, macro bars, and preset pills.
 */
export function DailySummary({
  preset,
  presets,
  totals,
  onPresetChange,
  activeDayPresetId,
}: DailySummaryProps) {
  const { t } = useTranslation();
  
  const goal = preset?.kcal_goal ?? 2200;
  const consumed = totals.kcal;
  const remaining = Math.max(0, goal - consumed);

  const proteinTarget = preset?.protein_goal_g ?? 165;
  const carbsTarget = preset?.carbs_goal_g ?? 220;
  const fatTarget = preset?.fat_goal_g ?? 78;

  return (
    <section
      id="daily-summary"
      className="bg-card rounded-xl p-5 shadow-sm animate-fade-in"
    >
      {/* Section Label */}
      <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {t.dailySummary}
      </h2>

      {/* Preset Pills */}
      <div className="mb-1">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {t.todaysTarget}
        </p>
        <PresetPills
          presets={presets}
          activePresetId={activeDayPresetId}
          onSelect={onPresetChange}
        />
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-12 md:items-center mt-5">
        {/* Gauge + Stats Row */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Shuttlecock Gauge */}
          <CalorieGauge consumed={consumed} goal={goal} />

          {/* Stats */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">{t.goal}</span>
              <span className="font-numeric text-sm font-semibold text-primary">
                {goal} {t.kcal}
              </span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">{t.consumed}</span>
              <span
                className={`font-numeric text-sm font-semibold ${
                  consumed > goal ? "text-over-limit" : "text-foreground"
                }`}
              >
                {Math.round(consumed)} {t.kcal}
              </span>
            </div>
            <div className="flex justify-between items-baseline gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">{t.remaining}</span>
              <span
                className={`font-numeric text-sm font-semibold ${
                  consumed > goal ? "text-over-limit" : "text-success"
                }`}
              >
                {consumed > goal
                  ? `-${Math.round(consumed - goal)}`
                  : Math.round(remaining)}{" "}
                {t.kcal}
              </span>
            </div>
          </div>
        </div>

        {/* Macro Progress Bars */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-col gap-4 mt-6 md:mt-0">
          <MacroBar
            label={t.protein}
            current={totals.protein_g}
            target={proteinTarget}
          />
          <MacroBar
            label={t.carbs}
            current={totals.carbs_g}
            target={carbsTarget}
          />
          <MacroBar
            label={t.fat}
            current={totals.fat_g}
            target={fatTarget}
          />
        </div>
      </div>
    </section>
  );
}
