"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Preset, PresetInput } from "@/lib/types";
import { DEFAULT_PRESETS } from "@/lib/constants";

/**
 * Hook to manage user presets (CRUD).
 * On first load, if user has no presets, seeds the default ones.
 */
export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useRef(createClient()).current;

  // ── Fetch all presets for the current user ──────────────
  const fetchPresets = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("presets")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching presets:", error);
      return;
    }

    // Seed default presets on first use
    if (!data || data.length === 0) {
      await seedDefaults(user.id);
      return;
    }

    setPresets(data);
    setLoading(false);
  }, []);

  // ── Seed default presets ────────────────────────────────
  const seedDefaults = async (userId: string) => {
    const rows = DEFAULT_PRESETS.map((p, i) => ({
      user_id: userId,
      name: p.name,
      kcal_goal: p.kcal_goal,
      protein_goal_g: p.protein_goal_g,
      carbs_goal_g: p.carbs_goal_g,
      fat_goal_g: p.fat_goal_g,
      is_default: p.is_default,
      sort_order: i,
    }));

    const { error } = await supabase.from("presets").insert(rows);
    if (error) {
      console.error("Error seeding presets:", error);
      return;
    }
    // Re-fetch after seeding
    await fetchPresets();
  };

  // ── Add a new preset ───────────────────────────────────
  const addPreset = async (input: PresetInput) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // If this is the new default, unset existing defaults
    if (input.is_default) {
      await supabase
        .from("presets")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { error } = await supabase.from("presets").insert({
      user_id: user.id,
      ...input,
      sort_order: presets.length,
    });

    if (error) {
      console.error("Error adding preset:", error);
      return;
    }
    await fetchPresets();
  };

  // ── Update an existing preset ──────────────────────────
  const updatePreset = async (id: string, input: Partial<PresetInput>) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // If setting as default, unset others first
    if (input.is_default) {
      await supabase
        .from("presets")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { error } = await supabase
      .from("presets")
      .update(input)
      .eq("id", id);

    if (error) {
      console.error("Error updating preset:", error);
      return;
    }
    await fetchPresets();
  };

  // ── Delete a preset ────────────────────────────────────
  const deletePreset = async (id: string) => {
    const { error } = await supabase.from("presets").delete().eq("id", id);
    if (error) {
      console.error("Error deleting preset:", error);
      return;
    }
    await fetchPresets();
  };

  // ── Get the default preset ─────────────────────────────
  const getDefaultPreset = (): Preset | null => {
    return presets.find((p) => p.is_default) ?? presets[0] ?? null;
  };

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  return {
    presets,
    loading,
    addPreset,
    updatePreset,
    deletePreset,
    getDefaultPreset,
    refetch: fetchPresets,
  };
}
