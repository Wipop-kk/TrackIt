"use client";

import { useTranslation } from "@/components/providers/LanguageProvider";

interface MacroValidationProps {
  calculatedKcal: number;
  enteredKcal: number;
  onAddAnyway: () => void;
  onDismiss: () => void;
}

/**
 * Inline warning banner shown when macro-derived kcal exceeds entered kcal.
 */
export function MacroValidation({
  calculatedKcal,
  enteredKcal,
  onAddAnyway,
  onDismiss,
}: MacroValidationProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 animate-fade-in">
      <p className="text-xs text-destructive leading-relaxed">
        ⚠️ {t.warning}: {t.calculated} (P×4 + C×4 + F×9 ={" "}
        <span className="font-numeric font-semibold">
          {Math.round(calculatedKcal)} kcal
        </span>
        ) {t.difference} {t.entered} (
        <span className="font-numeric font-semibold">
          {Math.round(enteredKcal)} kcal
        </span>
        ). {t.macroMismatchDesc}
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={onAddAnyway}
          className="px-3 py-1 text-[11px] font-medium rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
        >
          {t.addAnyway}
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-1 text-[11px] font-medium rounded-md bg-background border border-border text-foreground hover:bg-accent transition-colors"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}
