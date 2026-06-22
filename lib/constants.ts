// ============================================================
// TrackIt — Constants
// ============================================================

import type { PresetInput } from "./types";

// Macro calorie multipliers
export const PROTEIN_KCAL_PER_GRAM = 4;
export const CARBS_KCAL_PER_GRAM = 4;
export const FAT_KCAL_PER_GRAM = 9;

// Macro validation tolerance (kcal)
export const MACRO_VALIDATION_TOLERANCE = 1;

// Weight comparison buffer (kg)
export const WEIGHT_NORMAL_RANGE_BUFFER = 0.2;

// Rolling average window (days)
export const ROLLING_AVERAGE_DAYS = 7;

// Default presets seeded on first login
export const DEFAULT_PRESETS: PresetInput[] = [
  {
    name: "Standard",
    kcal_goal: 2200,
    protein_goal_g: 165,
    carbs_goal_g: 220,
    fat_goal_g: 78,
    is_default: true,
  },
  {
    name: "Workout Day",
    kcal_goal: 2500,
    protein_goal_g: 188,
    carbs_goal_g: 275,
    fat_goal_g: 69,
    is_default: false,
  },
  {
    name: "Rest Day",
    kcal_goal: 2000,
    protein_goal_g: 150,
    carbs_goal_g: 200,
    fat_goal_g: 67,
    is_default: false,
  },
  {
    name: "Low Carb",
    kcal_goal: 1900,
    protein_goal_g: 190,
    carbs_goal_g: 95,
    fat_goal_g: 106,
    is_default: false,
  },
];
