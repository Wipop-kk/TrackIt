"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DailyLog } from "@/lib/types";

/**
 * Hook to manage the daily_log anchor row for a given date.
 * Auto-creates the row if it doesn't exist, assigning the default preset.
 */
export function useDailyLog(dateKey: string, defaultPresetId: string | null) {
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useRef(createClient()).current;

  // ── Fetch or create the daily log ──────────────────────
  const fetchOrCreate = useCallback(async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Try to fetch existing log
    const { data: existing, error: fetchError } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .eq("log_date", dateKey)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching daily log:", fetchError);
      setLoading(false);
      return;
    }

    if (existing) {
      setDailyLog(existing);
      setLoading(false);
      return;
    }

    // Create new log for this date with default preset
    const { data: newLog, error: createError } = await supabase
      .from("daily_logs")
      .insert({
        user_id: user.id,
        log_date: dateKey,
        preset_id: defaultPresetId,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating daily log:", createError);
      setLoading(false);
      return;
    }

    setDailyLog(newLog);
    setLoading(false);
  }, [dateKey, defaultPresetId]);

  // ── Update the active preset for this day ──────────────
  const updatePreset = async (presetId: string | null) => {
    if (!dailyLog) return;

    const { error } = await supabase
      .from("daily_logs")
      .update({ preset_id: presetId })
      .eq("id", dailyLog.id);

    if (error) {
      console.error("Error updating daily log preset:", error);
      return;
    }

    setDailyLog((prev) => (prev ? { ...prev, preset_id: presetId } : null));
  };

  useEffect(() => {
    fetchOrCreate();
  }, [fetchOrCreate]);

  return {
    dailyLog,
    loading,
    updatePreset,
    refetch: fetchOrCreate,
  };
}
