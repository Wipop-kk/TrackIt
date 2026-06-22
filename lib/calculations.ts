// ============================================================
// TrackIt — Calculation Utilities
// Pure functions, no side effects
// ============================================================

import type { MealEntry, MealEntryInput } from "./types";
import {
  PROTEIN_KCAL_PER_GRAM,
  CARBS_KCAL_PER_GRAM,
  FAT_KCAL_PER_GRAM,
  MACRO_VALIDATION_TOLERANCE,
  WEIGHT_NORMAL_RANGE_BUFFER,
} from "./constants";

// ── Macro Validation ──────────────────────────────────────────

/**
 * Calculate kcal from macros: (P×4) + (C×4) + (F×9)
 */
export function calculateMacroKcal(
  protein_g: number,
  carbs_g: number,
  fat_g: number
): number {
  return (
    protein_g * PROTEIN_KCAL_PER_GRAM +
    carbs_g * CARBS_KCAL_PER_GRAM +
    fat_g * FAT_KCAL_PER_GRAM
  );
}

/**
 * Check if macro-derived kcal exceeds the entered kcal value.
 * Returns { isValid, calculatedKcal, enteredKcal }
 */
export function validateMacros(entry: MealEntryInput): {
  isValid: boolean;
  calculatedKcal: number;
  enteredKcal: number;
} {
  const calculatedKcal = calculateMacroKcal(
    entry.protein_g,
    entry.carbs_g,
    entry.fat_g
  );
  const isValid =
    calculatedKcal <= entry.kcal + MACRO_VALIDATION_TOLERANCE;

  return { isValid, calculatedKcal, enteredKcal: entry.kcal };
}

// ── Meal Totals ───────────────────────────────────────────────

export interface MealTotals {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  sugar_g: number;
}

/**
 * Sum up all nutritional values from a list of meal entries.
 */
export function calculateMealTotals(meals: MealEntry[]): MealTotals {
  return meals.reduce(
    (totals, meal) => ({
      kcal: totals.kcal + Number(meal.kcal),
      protein_g: totals.protein_g + Number(meal.protein_g),
      carbs_g: totals.carbs_g + Number(meal.carbs_g),
      fat_g: totals.fat_g + Number(meal.fat_g),
      sugar_g: totals.sugar_g + Number(meal.sugar_g),
    }),
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sugar_g: 0 }
  );
}

// ── Weight Calculations ───────────────────────────────────────

/**
 * Calculate the difference between night and morning weight.
 * Positive = gained during the day, negative = lost.
 */
export function calculateWeightDiff(
  morning_kg: number | null,
  night_kg: number | null
): number | null {
  if (morning_kg === null || night_kg === null) return null;
  return Number((night_kg - morning_kg).toFixed(1));
}

export type WeightDiffStatus = "neutral" | "gain" | "loss";

/**
 * Determine display status for weight difference.
 */
export function getWeightDiffStatus(diff: number | null): WeightDiffStatus {
  if (diff === null) return "neutral";
  if (diff < 0) return "loss"; // night < morning = green
  if (diff > 0) return "gain"; // night > morning = muted
  return "neutral";
}

// ── Rolling Average ───────────────────────────────────────────

/**
 * Calculate the mean of an array of numbers (ignoring nulls).
 */
export function calculateAverage(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return null;
  return Number((valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1));
}

export type TrendDirection = "up" | "down" | "stable";

/**
 * Compare two averages and determine the trend.
 */
export function getTrend(
  current: number | null,
  previous: number | null
): { direction: TrendDirection; diff: number | null } {
  if (current === null || previous === null) {
    return { direction: "stable", diff: null };
  }
  const diff = Number((current - previous).toFixed(1));
  if (diff > 0) return { direction: "up", diff };
  if (diff < 0) return { direction: "down", diff };
  return { direction: "stable", diff: 0 };
}

export type TodayVsAvgStatus = "above" | "below" | "normal" | "no-data";

/**
 * Compare today's weight against the rolling average.
 * Uses WEIGHT_NORMAL_RANGE_BUFFER (±0.2 kg) before flagging.
 */
export function getTodayVsAvg(
  todayMorning: number | null,
  avg: number | null
): { status: TodayVsAvgStatus; diff: number | null } {
  if (todayMorning === null || avg === null) {
    return { status: "no-data", diff: null };
  }
  const diff = Number((todayMorning - avg).toFixed(1));
  if (Math.abs(diff) <= WEIGHT_NORMAL_RANGE_BUFFER) {
    return { status: "normal", diff };
  }
  return { status: diff > 0 ? "above" : "below", diff };
}
