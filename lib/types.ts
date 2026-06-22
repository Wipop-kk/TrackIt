// ============================================================
// TrackIt — TypeScript Interfaces
// Mirrors the Supabase database schema
// ============================================================

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface Preset {
  id: string;
  user_id: string;
  name: string;
  kcal_goal: number;
  protein_goal_g: number;
  carbs_goal_g: number;
  fat_goal_g: number;
  is_default: boolean;
  sort_order: number;
  created_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  log_date: string; // "YYYY-MM-DD"
  preset_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MealEntry {
  id: string;
  daily_log_id: string;
  name: string;
  amount_g: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  sugar_g: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface WeightEntry {
  id: string;
  daily_log_id: string;
  morning_kg: number | null;
  night_kg: number | null;
  created_at: string;
  updated_at: string;
}

// Aggregated data for a single day (what the page works with)
export interface DayData {
  log: DailyLog;
  meals: MealEntry[];
  weight: WeightEntry | null;
  preset: Preset | null;
}

// Form input types for creating/editing
export interface MealEntryInput {
  name: string;
  amount_g: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  sugar_g: number;
}

export interface WeightInput {
  morning_kg: number | null;
  night_kg: number | null;
}

export interface PresetInput {
  name: string;
  kcal_goal: number;
  protein_goal_g: number;
  carbs_goal_g: number;
  fat_goal_g: number;
  is_default: boolean;
}
