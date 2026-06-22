import { describe, it, expect } from "vitest";
import {
  calculateMacroKcal,
  validateMacros,
  calculateWeightDiff,
  getWeightDiffStatus,
  calculateAverage,
  getTrend,
  getTodayVsAvg,
} from "../calculations";
import { WEIGHT_NORMAL_RANGE_BUFFER } from "../constants";

describe("calculations", () => {
  describe("calculateMacroKcal", () => {
    it("should calculate correct kcal based on macros", () => {
      // 10g protein (40) + 20g carbs (80) + 5g fat (45) = 165
      expect(calculateMacroKcal(10, 20, 5)).toBe(165);
    });

    it("should handle zeros", () => {
      expect(calculateMacroKcal(0, 0, 0)).toBe(0);
    });
  });

  describe("validateMacros", () => {
    it("should return isValid=true if entered kcal >= calculated kcal", () => {
      // calculated = 165
      const result = validateMacros({
        name: "Test",
        amount_g: 100,
        kcal: 165,
        protein_g: 10,
        carbs_g: 20,
        fat_g: 5,
        sugar_g: 0,
      });
      expect(result.isValid).toBe(true);
      expect(result.calculatedKcal).toBe(165);
      expect(result.enteredKcal).toBe(165);
    });

    it("should return isValid=false if calculated kcal > entered kcal + tolerance", () => {
      // calculated = 165, entered = 150
      const result = validateMacros({
        name: "Test",
        amount_g: 100,
        kcal: 150,
        protein_g: 10,
        carbs_g: 20,
        fat_g: 5,
        sugar_g: 0,
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe("calculateWeightDiff", () => {
    it("should return difference between night and morning", () => {
      expect(calculateWeightDiff(70, 71.5)).toBe(1.5);
      expect(calculateWeightDiff(70, 69.8)).toBe(-0.2);
    });

    it("should return null if either is null", () => {
      expect(calculateWeightDiff(null, 70)).toBeNull();
      expect(calculateWeightDiff(70, null)).toBeNull();
      expect(calculateWeightDiff(null, null)).toBeNull();
    });
  });

  describe("getWeightDiffStatus", () => {
    it("should return neutral for null", () => {
      expect(getWeightDiffStatus(null)).toBe("neutral");
    });
    it("should return loss for negative diff", () => {
      expect(getWeightDiffStatus(-0.5)).toBe("loss");
    });
    it("should return gain for positive diff", () => {
      expect(getWeightDiffStatus(0.5)).toBe("gain");
    });
    it("should return neutral for zero", () => {
      expect(getWeightDiffStatus(0)).toBe("neutral");
    });
  });

  describe("calculateAverage", () => {
    it("should calculate average ignoring nulls", () => {
      expect(calculateAverage([70, null, 72, 74])).toBe(72);
    });
    it("should return null for empty or all-null arrays", () => {
      expect(calculateAverage([])).toBeNull();
      expect(calculateAverage([null, null])).toBeNull();
    });
  });

  describe("getTrend", () => {
    it("should return up when current > previous", () => {
      const result = getTrend(71.5, 70);
      expect(result).toEqual({ direction: "up", diff: 1.5 });
    });
    it("should return down when current < previous", () => {
      const result = getTrend(69.5, 70);
      expect(result).toEqual({ direction: "down", diff: -0.5 });
    });
    it("should return stable when current == previous", () => {
      const result = getTrend(70, 70);
      expect(result).toEqual({ direction: "stable", diff: 0 });
    });
    it("should return stable and null diff if either is null", () => {
      expect(getTrend(null, 70)).toEqual({ direction: "stable", diff: null });
      expect(getTrend(70, null)).toEqual({ direction: "stable", diff: null });
    });
  });

  describe("getTodayVsAvg", () => {
    it("should return no-data if either is null", () => {
      expect(getTodayVsAvg(null, 70)).toEqual({ status: "no-data", diff: null });
    });

    it("should return normal if difference is within buffer", () => {
      // buffer is usually 0.2
      const buffer = WEIGHT_NORMAL_RANGE_BUFFER;
      expect(getTodayVsAvg(70 + buffer, 70)).toEqual({ status: "normal", diff: buffer });
      expect(getTodayVsAvg(70 - buffer, 70)).toEqual({ status: "normal", diff: -buffer });
    });

    it("should return above if diff > buffer", () => {
      expect(getTodayVsAvg(70.5, 70)).toEqual({ status: "above", diff: 0.5 });
    });

    it("should return below if diff < -buffer", () => {
      expect(getTodayVsAvg(69.5, 70)).toEqual({ status: "below", diff: -0.5 });
    });
  });
});
