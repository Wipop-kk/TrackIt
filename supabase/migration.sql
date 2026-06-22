-- ============================================================
-- TrackIt Database Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- PROFILES: extends auth.users with app-specific fields
-- Auto-created on signup via trigger
-- ============================================================
CREATE TABLE profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email       TEXT,
  full_name   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- PRESETS: activity-based calorie/macro profiles
-- ============================================================
CREATE TABLE presets (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  kcal_goal   INTEGER NOT NULL,
  protein_goal_g NUMERIC(6,1) NOT NULL,
  carbs_goal_g   NUMERIC(6,1) NOT NULL,
  fat_goal_g     NUMERIC(6,1) NOT NULL,
  is_default  BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- DAILY_LOGS: one row per calendar day per user (anchor table)
-- ============================================================
CREATE TABLE daily_logs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  log_date    DATE NOT NULL,
  preset_id   UUID REFERENCES presets(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, log_date)
);

-- ============================================================
-- MEAL_ENTRIES: individual food items within a daily log
-- ============================================================
CREATE TABLE meal_entries (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_log_id   UUID REFERENCES daily_logs(id) ON DELETE CASCADE NOT NULL,
  name           TEXT NOT NULL,
  amount_g       NUMERIC(8,1) NOT NULL DEFAULT 0,
  kcal           NUMERIC(8,1) NOT NULL DEFAULT 0,
  protein_g      NUMERIC(6,1) NOT NULL DEFAULT 0,
  carbs_g        NUMERIC(6,1) NOT NULL DEFAULT 0,
  fat_g          NUMERIC(6,1) NOT NULL DEFAULT 0,
  sugar_g        NUMERIC(6,1) NOT NULL DEFAULT 0,
  sort_order     INTEGER DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- WEIGHT_ENTRIES: one-to-one with daily_logs
-- ============================================================
CREATE TABLE weight_entries (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  daily_log_id   UUID REFERENCES daily_logs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  morning_kg     NUMERIC(5,1),
  night_kg       NUMERIC(5,1),
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- AUTO-TOUCH updated_at ON ROW UPDATE
-- ============================================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON daily_logs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON meal_entries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON weight_entries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users manage own profile"
  ON profiles FOR ALL
  USING (auth.uid() = id);

-- Presets: users manage their own
CREATE POLICY "Users manage own presets"
  ON presets FOR ALL
  USING (auth.uid() = user_id);

-- Daily logs: users manage their own
CREATE POLICY "Users manage own daily_logs"
  ON daily_logs FOR ALL
  USING (auth.uid() = user_id);

-- Meal entries: users manage entries in their own daily logs
CREATE POLICY "Users manage own meal_entries"
  ON meal_entries FOR ALL
  USING (
    daily_log_id IN (
      SELECT id FROM daily_logs WHERE user_id = auth.uid()
    )
  );

-- Weight entries: users manage entries in their own daily logs
CREATE POLICY "Users manage own weight_entries"
  ON weight_entries FOR ALL
  USING (
    daily_log_id IN (
      SELECT id FROM daily_logs WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_daily_logs_user_date ON daily_logs(user_id, log_date);
CREATE INDEX idx_meal_entries_log ON meal_entries(daily_log_id);
CREATE INDEX idx_weight_entries_log ON weight_entries(daily_log_id);
CREATE INDEX idx_presets_user ON presets(user_id);
