import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  formatDateKey,
  parseDateKey,
  isToday,
  addDays,
  getToday,
  getDateRange,
} from "../date-utils";

describe("date-utils", () => {
  describe("formatDateKey", () => {
    it("should format date to YYYY-MM-DD", () => {
      const date = new Date(2026, 5, 15); // June 15, 2026
      expect(formatDateKey(date)).toBe("2026-06-15");
    });
  });

  describe("parseDateKey", () => {
    it("should parse YYYY-MM-DD to Date object", () => {
      const date = parseDateKey("2026-06-15");
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(5); // 0-indexed
      expect(date.getDate()).toBe(15);
    });
  });

  describe("isToday", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 15)); // June 15, 2026
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return true for today", () => {
      expect(isToday(new Date(2026, 5, 15))).toBe(true);
    });

    it("should return false for other days", () => {
      expect(isToday(new Date(2026, 5, 14))).toBe(false);
      expect(isToday(new Date(2026, 5, 16))).toBe(false);
    });
  });

  describe("addDays", () => {
    it("should add days correctly", () => {
      const date = new Date(2026, 5, 15);
      const nextDay = addDays(date, 1);
      expect(formatDateKey(nextDay)).toBe("2026-06-16");

      const prevDay = addDays(date, -1);
      expect(formatDateKey(prevDay)).toBe("2026-06-14");
    });
  });

  describe("getDateRange", () => {
    it("should return correct array of date strings ending on endDate", () => {
      const endDate = new Date(2026, 5, 15); // June 15
      const range = getDateRange(endDate, 3);
      expect(range).toEqual(["2026-06-13", "2026-06-14", "2026-06-15"]);
    });
  });
});
