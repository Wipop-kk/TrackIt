"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MealEntry, MealEntryInput } from "@/lib/types";

/**
 * Hook to manage meal entries for a given daily_log_id.
 */
export function useMealEntries(dailyLogId: string | null) {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useRef(createClient()).current;

  // ── Fetch all meals for this daily log ─────────────────
  const fetchMeals = useCallback(async () => {
    if (!dailyLogId) {
      setMeals([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("meal_entries")
      .select("*")
      .eq("daily_log_id", dailyLogId)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching meals:", error);
      setLoading(false);
      return;
    }

    setMeals(data ?? []);
    setLoading(false);
  }, [dailyLogId]);

  // ── Add a new meal ─────────────────────────────────────
  const addMeal = async (input: MealEntryInput) => {
    if (!dailyLogId) return;

    const { error } = await supabase.from("meal_entries").insert({
      daily_log_id: dailyLogId,
      name: input.name,
      amount_g: input.amount_g,
      kcal: input.kcal,
      protein_g: input.protein_g,
      carbs_g: input.carbs_g,
      fat_g: input.fat_g,
      sugar_g: input.sugar_g,
      sort_order: meals.length,
    });

    if (error) {
      console.error("Error adding meal:", error);
      return;
    }

    await fetchMeals();
  };

  // ── Update an existing meal ────────────────────────────
  const updateMeal = async (id: string, input: Partial<MealEntryInput>) => {
    const { error } = await supabase
      .from("meal_entries")
      .update(input)
      .eq("id", id);

    if (error) {
      console.error("Error updating meal:", error);
      return;
    }

    await fetchMeals();
  };

  // ── Delete a meal ──────────────────────────────────────
  const deleteMeal = async (id: string) => {
    const { error } = await supabase
      .from("meal_entries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting meal:", error);
      return;
    }

    await fetchMeals();
  };

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  return {
    meals,
    loading,
    addMeal,
    updateMeal,
    deleteMeal,
    refetch: fetchMeals,
  };
}
