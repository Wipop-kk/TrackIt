"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { formatDisplayDate, isToday, addDays, formatDateKey } from "@/lib/date-utils";
import { useTranslation } from "@/components/providers/LanguageProvider";

interface TopbarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onOpenPresetManager: () => void;
}

export function Topbar({
  selectedDate,
  onDateChange,
  onOpenPresetManager,
}: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useTranslation();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePrevDay = () => {
    onDateChange(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const handleDateClick = () => {
    dateInputRef.current?.showPicker();
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split("-").map(Number);
      onDateChange(new Date(year, month - 1, day));
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const showToday = !isToday(selectedDate);

  return (
    <header className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
        {/* Left: Logo + Preset Manager */}
        <div className="flex items-center gap-2">
          <h1 className="font-heading font-bold text-base text-primary tracking-tight">
            🏸 TrackIt
          </h1>
          <button
            id="preset-manager-trigger"
            onClick={onOpenPresetManager}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            title="Manage presets"
          >
            <Flame className="w-4 h-4 text-shuttlecock" />
          </button>
        </div>

        {/* Center: Date Navigation */}
        <div className="flex items-center gap-1">
          <button
            id="prev-day-btn"
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            id="date-picker-trigger"
            onClick={handleDateClick}
            className="flex flex-col items-center px-3 py-0.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            <span className="font-heading font-semibold text-sm whitespace-nowrap">
              {formatDisplayDate(selectedDate, locale)}
            </span>
            {isToday(selectedDate) && (
              <span className="text-[10px] font-medium text-primary uppercase tracking-wider">
                {t.today}
              </span>
            )}
          </button>

          {/* Hidden native date input */}
          <input
            ref={dateInputRef}
            type="date"
            value={formatDateKey(selectedDate)}
            onChange={handleDateInputChange}
            className="sr-only"
            tabIndex={-1}
          />

          <button
            id="next-day-btn"
            onClick={handleNextDay}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            aria-label="Next day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Today shortcut pill */}
          {showToday && (
            <button
              id="today-btn"
              onClick={handleToday}
              className="ml-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              {t.today}
            </button>
          )}
        </div>

        {/* Right: Lang + Theme Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setLocale(locale === "en" ? "th" : "en")}
            className="px-2 py-1.5 rounded-lg hover:bg-accent transition-colors text-xs font-semibold text-muted-foreground hover:text-foreground"
            aria-label="Toggle language"
          >
            {locale.toUpperCase()}
          </button>
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )
            ) : (
              <div className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
