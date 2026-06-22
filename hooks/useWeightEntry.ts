"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WeightEntry, WeightInput } from "@/lib/types";

/**
 * Hook to manage the weight entry for a given daily_log_id.
 * 1:1 relationship — each daily log has at most one weight entry.
 */
export function useWeightEntry(dailyLogId: string | null) {
  const [weight, setWeight] = useState<WeightEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useRef(createClient()).current;

  // ── Fetch weight entry ─────────────────────────────────
  const fetchWeight = useCallback(async () => {
    if (!dailyLogId) {
      setWeight(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("weight_entries")
      .select("*")
      .eq("daily_log_id", dailyLogId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching weight:", error);
      setLoading(false);
      return;
    }

    setWeight(data);
    setLoading(false);
  }, [dailyLogId]);

  // ── Upsert weight entry ────────────────────────────────
  // Creates if not exists, updates if exists
  const upsertWeight = async (input: WeightInput) => {
    if (!dailyLogId) return;

    if (weight) {
      // Update existing
      const { data, error } = await supabase
        .from("weight_entries")
        .update({
          morning_kg: input.morning_kg,
          night_kg: input.night_kg,
        })
        .eq("id", weight.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating weight:", error);
        return;
      }
      setWeight(data);
    } else {
      // Insert new
      const { data, error } = await supabase
        .from("weight_entries")
        .insert({
          daily_log_id: dailyLogId,
          morning_kg: input.morning_kg,
          night_kg: input.night_kg,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating weight:", error);
        return;
      }
      setWeight(data);
    }
  };

  useEffect(() => {
    fetchWeight();
  }, [fetchWeight]);

  return {
    weight,
    loading,
    upsertWeight,
    refetch: fetchWeight,
  };
}
