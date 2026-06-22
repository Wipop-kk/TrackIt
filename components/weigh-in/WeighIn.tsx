"use client";

import { WeightInputs } from "./WeightInputs";
import { RollingAverage } from "./RollingAverage";
import { useTranslation } from "@/components/providers/LanguageProvider";
import type { WeightEntry, WeightInput } from "@/lib/types";

interface WeighInProps {
  weight: WeightEntry | null;
  loading: boolean;
  onUpsertWeight: (input: WeightInput) => void;
  selectedDate: Date;
}

/**
 * Weigh-In card — morning/night inputs + rolling average section.
 */
export function WeighIn({
  weight,
  loading,
  onUpsertWeight,
  selectedDate,
}: WeighInProps) {
  const { t } = useTranslation();
  const morningKg = weight?.morning_kg != null ? Number(weight.morning_kg) : null;

  return (
    <section
      id="weigh-in"
      className="bg-card rounded-xl px-5 py-4 shadow-sm animate-fade-in"
    >
      <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {t.weighIn}
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <WeightInputs weight={weight} onUpsert={onUpsertWeight} />

          <div className="court-divider mt-5" />

          <RollingAverage
            selectedDate={selectedDate}
            todayMorningKg={morningKg}
          />
        </>
      )}
    </section>
  );
}
