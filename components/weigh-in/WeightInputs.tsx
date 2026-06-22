'use client';

import { useState, useEffect } from 'react';
import { calculateWeightDiff, getWeightDiffStatus } from '@/lib/calculations';
import { useTranslation } from '@/components/providers/LanguageProvider';
import type { WeightEntry, WeightInput } from '@/lib/types';

interface WeightInputsProps {
  weight: WeightEntry | null;
  onUpsert: (input: WeightInput) => void;
}

/**
 * Morning/night weight inputs with auto-calculated difference.
 */
export function WeightInputs({ weight, onUpsert }: WeightInputsProps) {
  const { t } = useTranslation();
  const [morning, setMorning] = useState<string>('');
  const [night, setNight] = useState<string>('');

  // Sync state when weight data loads
  useEffect(() => {
    setMorning(weight?.morning_kg != null ? String(weight.morning_kg) : '');
    setNight(weight?.night_kg != null ? String(weight.night_kg) : '');
  }, [weight]);

  const morningNum = morning ? parseFloat(morning) : null;
  const nightNum = night ? parseFloat(night) : null;
  const diff = calculateWeightDiff(morningNum, nightNum);
  const diffStatus = getWeightDiffStatus(diff);

  const handleBlur = () => {
    const morningKg = morning ? parseFloat(morning) : null;
    const nightKg = night ? parseFloat(night) : null;

    // Only save if there's actually a value
    if (morningKg !== null || nightKg !== null) {
      onUpsert({ morning_kg: morningKg, night_kg: nightKg });
    }
  };

  const diffColor =
    diffStatus === 'loss'
      ? 'text-success'
      : diffStatus === 'gain'
        ? 'text-muted-foreground'
        : 'text-foreground';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5">
      {/* Morning */}
      <div>
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
          {t.morningKg}
        </label>
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            step="0.1"
            value={morning}
            onChange={(e) => setMorning(e.target.value)}
            onBlur={handleBlur}
            placeholder="—"
            className="w-20 bg-transparent font-numeric text-2xl font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
            id="weight-morning"
          />
          <span className="text-xs text-muted-foreground">kg</span>
        </div>
      </div>

      {/* Night */}
      <div>
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
          {t.nightKg}
        </label>
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            step="0.1"
            value={night}
            onChange={(e) => setNight(e.target.value)}
            onBlur={handleBlur}
            placeholder="—"
            className="w-20 bg-transparent font-numeric text-2xl font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
            id="weight-night"
          />
          <span className="text-xs text-muted-foreground">kg</span>
        </div>
      </div>

      {/* Difference */}
      <div className="col-span-2 sm:col-span-1">
        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
          {t.differenceLabel}
        </label>
        {diff !== null ? (
          <div>
            <span className={`font-numeric text-2xl font-bold ${diffColor}`}>
              {diff > 0 ? '+' : ''}
              {diff}
            </span>
            <span className="text-xs text-muted-foreground ml-1">kg</span>
            <p className={`text-[10px] mt-0.5 ${diffColor}`}>
              {t.nightVsMorning}
            </p>
          </div>
        ) : (
          <span className="font-numeric text-2xl font-bold text-muted-foreground/30">
            —
          </span>
        )}
      </div>
    </div>
  );
}
