"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateKey, addDays } from "@/lib/date-utils";
import { calculateAverage, getTrend, getTodayVsAvg } from "@/lib/calculations";
import { ROLLING_AVERAGE_DAYS } from "@/lib/constants";
import type { TrendDirection, TodayVsAvgStatus } from "@/lib/calculations";

export interface RollingAverageData {
  avgMorning: number | null;
  priorAvgMorning: number | null;
  trend: { direction: TrendDirection; diff: number | null };
  todayVsAvg: { status: TodayVsAvgStatus; diff: number | null };
  daysWithData: number;
}

/**
 * Hook to compute the 7-day rolling average for weight data.
 * Fetches the last 14 days of weight entries to compare current vs prior week.
 */
export function useRollingAverage(
  selectedDate: Date,
  todayMorningKg: number | null
) {
  const [data, setData] = useState<RollingAverageData>({
    avgMorning: null,
    priorAvgMorning: null,
    trend: { direction: "stable", diff: null },
    todayVsAvg: { status: "no-data", diff: null },
    daysWithData: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = useRef(createClient()).current;

  const compute = useCallback(async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch 14 days of weight data ending on selectedDate
    const endDate = formatDateKey(selectedDate);
    const startDate = formatDateKey(
      addDays(selectedDate, -(ROLLING_AVERAGE_DAYS * 2 - 1))
    );

    const { data: rows, error } = await supabase
      .from("daily_logs")
      .select(
        `
        log_date,
        weight_entries (
          morning_kg
        )
      `
      )
      .eq("user_id", user.id)
      .gte("log_date", startDate)
      .lte("log_date", endDate)
      .order("log_date", { ascending: true });

    if (error) {
      console.error("Error fetching rolling average data:", error);
      setLoading(false);
      return;
    }

    // Extract morning weights with their dates
    const weightsByDate: { date: string; morning_kg: number | null }[] = (
      rows ?? []
    ).map((row: Record<string, unknown>) => {
      const weightEntries = row.weight_entries as
        | { morning_kg: number | null }[]
        | { morning_kg: number | null }
        | null;
      const weightEntry = Array.isArray(weightEntries)
        ? weightEntries[0]
        : weightEntries;
      return {
        date: row.log_date as string,
        morning_kg: weightEntry?.morning_kg ?? null,
      };
    });

    // Split into current 7 days and prior 7 days
    const midpoint = formatDateKey(
      addDays(selectedDate, -ROLLING_AVERAGE_DAYS)
    );

    const currentWeek = weightsByDate
      .filter((w) => w.date > midpoint && w.date <= endDate)
      .map((w) => w.morning_kg);

    const priorWeek = weightsByDate
      .filter((w) => w.date <= midpoint)
      .map((w) => w.morning_kg);

    const avgMorning = calculateAverage(currentWeek);
    const priorAvgMorning = calculateAverage(priorWeek);
    const trend = getTrend(avgMorning, priorAvgMorning);
    const todayVsAvgResult = getTodayVsAvg(todayMorningKg, avgMorning);
    const daysWithData = currentWeek.filter((w) => w !== null).length;

    setData({
      avgMorning,
      priorAvgMorning,
      trend,
      todayVsAvg: todayVsAvgResult,
      daysWithData,
    });
    setLoading(false);
  }, [selectedDate, todayMorningKg]);

  useEffect(() => {
    compute();
  }, [compute]);

  return { ...data, loading, refetch: compute };
}
