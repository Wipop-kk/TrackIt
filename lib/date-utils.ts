// ============================================================
// TrackIt — Date Utilities
// Thai locale formatting and date arithmetic
// ============================================================

/**
 * Format a date in the given locale for the topbar display.
 * e.g. "จ. 15 มิ.ย." or "Mon, Jun 15"
 */
export function formatDisplayDate(date: Date, locale: "en" | "th" = "th"): string {
  if (locale === "en") {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }
  return date.toLocaleDateString("th-TH", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Format a date in Thai locale with full month and year.
 * e.g. "15 มิถุนายน 2569"
 */
export function formatThaiDateFull(date: Date): string {
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format a date as "YYYY-MM-DD" for Supabase queries and localStorage keys.
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse a "YYYY-MM-DD" string back into a Date object.
 * Returns the date at midnight local time.
 */
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Check if a date is today.
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return formatDateKey(date) === formatDateKey(today);
}

/**
 * Add days to a date (negative to subtract).
 * Returns a new Date object.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get today's date at midnight local time.
 */
export function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Get a range of date keys for the last N days ending on the given date.
 * Useful for rolling average queries.
 * e.g. getDateRange(today, 7) → ["2026-06-16", "2026-06-17", ..., "2026-06-22"]
 */
export function getDateRange(endDate: Date, days: number): string[] {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    dates.push(formatDateKey(addDays(endDate, -i)));
  }
  return dates;
}
