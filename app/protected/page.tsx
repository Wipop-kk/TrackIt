"use client";

import { useState, useMemo } from "react";
import { Topbar } from "@/components/topbar/Topbar";
import { DailySummary } from "@/components/dashboard/DailySummary";
import { FoodLog } from "@/components/food-log/FoodLog";
import { WeighIn } from "@/components/weigh-in/WeighIn";
import { PresetManager } from "@/components/preset-manager/PresetManager";
import { usePresets } from "@/hooks/usePresets";
import { useDailyLog } from "@/hooks/useDailyLog";
import { useMealEntries } from "@/hooks/useMealEntries";
import { useWeightEntry } from "@/hooks/useWeightEntry";
import { formatDateKey, getToday } from "@/lib/date-utils";
import { calculateMealTotals } from "@/lib/calculations";

export default function TrackerPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(getToday());
  const [presetManagerOpen, setPresetManagerOpen] = useState(false);

  const dateKey = formatDateKey(selectedDate);

  // ── Data hooks ─────────────────────────────────────────
  const { presets, loading: presetsLoading, getDefaultPreset, ...presetActions } = usePresets();

  const defaultPreset = getDefaultPreset();

  const { dailyLog, loading: logLoading, updatePreset: updateDayPreset } = useDailyLog(
    dateKey,
    defaultPreset?.id ?? null
  );

  const { meals, loading: mealsLoading, addMeal, updateMeal, deleteMeal } = useMealEntries(
    dailyLog?.id ?? null
  );

  const { weight, loading: weightLoading, upsertWeight } = useWeightEntry(
    dailyLog?.id ?? null
  );

  // ── Derived state ──────────────────────────────────────
  const activePreset = useMemo(
    () => presets.find((p) => p.id === dailyLog?.preset_id) ?? defaultPreset,
    [presets, dailyLog?.preset_id, defaultPreset]
  );
  const totals = useMemo(() => calculateMealTotals(meals), [meals]);
  const isLoading = presetsLoading || logLoading;

  return (
    <>
      <Topbar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onOpenPresetManager={() => setPresetManagerOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 md:col-span-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Daily Summary — Gauge + Stats + Macros + Presets */}
            <div className="md:col-span-12">
              <DailySummary
                preset={activePreset}
                presets={presets}
                totals={totals}
                onPresetChange={updateDayPreset}
                activeDayPresetId={dailyLog?.preset_id ?? null}
              />
            </div>

            {/* Court line divider */}
            <div className="court-divider md:col-span-12" />

            {/* Food Log — Table + Quick Add */}
            <div className="md:col-span-7 lg:col-span-7">
              <FoodLog
                meals={meals}
                loading={mealsLoading}
                onAddMeal={addMeal}
                onUpdateMeal={updateMeal}
                onDeleteMeal={deleteMeal}
              />
            </div>

            {/* Court line divider */}
            <div className="court-divider md:hidden" />

            {/* Weigh-In — Inputs + Rolling Average */}
            <div className="md:col-span-5 lg:col-span-5 h-fit">
              <WeighIn
                weight={weight}
                loading={weightLoading}
                onUpsertWeight={upsertWeight}
                selectedDate={selectedDate}
              />
            </div>
          </>
        )}
      </main>

      {/* Preset Manager Modal */}
      {presetManagerOpen && (
        <PresetManager
          presets={presets}
          onClose={() => setPresetManagerOpen(false)}
          onAdd={presetActions.addPreset}
          onUpdate={presetActions.updatePreset}
          onDelete={presetActions.deletePreset}
        />
      )}
    </>
  );
}
