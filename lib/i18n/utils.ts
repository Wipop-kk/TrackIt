import type { Dictionary } from "./index";

/**
 * Translate default preset names to the current locale.
 * Custom (user-created) preset names are returned as-is.
 */
const PRESET_NAME_KEYS: Record<string, keyof Dictionary> = {
  Standard: "presetStandard",
  "Workout Day": "presetWorkout",
  "Rest Day": "presetRest",
  "Low Carb": "presetLowCarb",
};

export function getTranslatedPresetName(name: string, t: Dictionary): string {
  const key = PRESET_NAME_KEYS[name];
  return key ? t[key] : name;
}
