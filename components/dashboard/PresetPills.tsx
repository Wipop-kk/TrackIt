"use client";

import type { Preset } from "@/lib/types";

import { useTranslation } from "@/components/providers/LanguageProvider";
import { getTranslatedPresetName } from "@/lib/i18n/utils";

interface PresetPillsProps {
  presets: Preset[];
  activePresetId: string | null;
  onSelect: (presetId: string) => void;
}

/**
 * Row of pill buttons for selecting the active daily preset.
 */
export function PresetPills({ presets, activePresetId, onSelect }: PresetPillsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => {
        const isActive = preset.id === activePresetId;
        const displayName = getTranslatedPresetName(preset.name, t);
        return (
          <button
            key={preset.id}
            id={`preset-pill-${preset.id}`}
            onClick={() => onSelect(preset.id)}
            className={`
              px-3 py-1.5 rounded-full text-xs font-medium
              border transition-all duration-200
              ${
                isActive
                  ? "bg-success text-primary-foreground border-success shadow-sm"
                  : "bg-transparent text-foreground border-border hover:border-success hover:text-success"
              }
            `}
          >
            {displayName} ({preset.kcal_goal} {t.kcal})
          </button>
        );
      })}
    </div>
  );
}
