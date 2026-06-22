"use client";

import { useState } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { MacroValidation } from "./MacroValidation";
import { validateMacros } from "@/lib/calculations";
import { useTranslation } from "@/components/providers/LanguageProvider";
import type { MealEntryInput } from "@/lib/types";

interface QuickAddProps {
  onAdd: (input: MealEntryInput) => void;
}

const emptyInput = {
  name: "",
  amount_g: "" as unknown as number,
  kcal: "" as unknown as number,
  protein_g: "" as unknown as number,
  carbs_g: "" as unknown as number,
  fat_g: "" as unknown as number,
  sugar_g: "" as unknown as number,
};

/**
 * Quick add row — horizontal inputs for adding a new meal entry.
 * Validates macros vs kcal before adding.
 */
export function QuickAdd({ onAdd }: QuickAddProps) {
  const { t } = useTranslation();
  const [values, setValues] = useState<MealEntryInput>({ ...emptyInput });
  const [showWarning, setShowWarning] = useState(false);

  // Validate on every change to macros or kcal
  const validation = validateMacros(values);
  const hasValidationIssue = !validation.isValid && values.kcal > 0;

  const handleChange = (field: keyof MealEntryInput, value: string) => {
    setShowWarning(false);
    if (field === "name") {
      setValues((prev) => ({ ...prev, name: value }));
    } else {
      setValues((prev) => ({
        ...prev,
        [field]: value === "" ? ("" as unknown as number) : parseFloat(value),
      }));
    }
  };

  const handleSubmit = () => {
    if (!values.name.trim()) return;

    // If macro validation fails, show warning instead of adding
    if (hasValidationIssue && !showWarning) {
      setShowWarning(true);
      return;
    }

    doAdd();
  };

  const doAdd = () => {
    onAdd(values);
    setValues({ ...emptyInput });
    setShowWarning(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div>
      <div
        className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border"
        onKeyDown={handleKeyDown}
      >
        <input
          type="text"
          placeholder={t.foodNamePlaceholder}
          value={values.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full md:w-auto md:flex-1 min-w-[120px] bg-background border border-border rounded-md px-2 py-1.5 text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          id="quick-add-name"
        />
        <input
          type="number"
          placeholder={t.amountG}
          value={values.amount_g}
          onChange={(e) => handleChange("amount_g", e.target.value)}
          className="flex-1 md:flex-none md:w-12 min-w-[50px] bg-background border border-border rounded-md px-1.5 py-1.5 text-xs font-numeric text-right placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          id="quick-add-amount"
        />
        <input
          type="number"
          placeholder={t.kcal}
          value={values.kcal}
          onChange={(e) => handleChange("kcal", e.target.value)}
          className="flex-1 md:flex-none md:w-14 min-w-[60px] bg-background border border-border rounded-md px-1.5 py-1.5 text-xs font-numeric text-right placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          id="quick-add-kcal"
        />
        <input
          type="number"
          placeholder={t.proteinG}
          value={values.protein_g}
          onChange={(e) => handleChange("protein_g", e.target.value)}
          className="flex-1 md:flex-none md:w-12 min-w-[50px] bg-background border border-border rounded-md px-1.5 py-1.5 text-xs font-numeric text-right placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          id="quick-add-protein"
        />
        <input
          type="number"
          placeholder={t.carbs}
          value={values.carbs_g}
          onChange={(e) => handleChange("carbs_g", e.target.value)}
          className="flex-1 md:flex-none md:w-12 min-w-[50px] bg-background border border-border rounded-md px-1.5 py-1.5 text-xs font-numeric text-right placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          id="quick-add-carbs"
        />
        <input
          type="number"
          placeholder={t.fat}
          value={values.fat_g}
          onChange={(e) => handleChange("fat_g", e.target.value)}
          className="flex-1 md:flex-none md:w-12 min-w-[50px] bg-background border border-border rounded-md px-1.5 py-1.5 text-xs font-numeric text-right placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          id="quick-add-fat"
        />
        <input
          type="number"
          placeholder={t.sugarG}
          value={values.sugar_g}
          onChange={(e) => handleChange("sugar_g", e.target.value)}
          className="flex-1 md:flex-none md:w-12 min-w-[50px] bg-background border border-border rounded-md px-1.5 py-1.5 text-xs font-numeric text-right placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          id="quick-add-sugar"
        />
        <button
          onClick={handleSubmit}
          disabled={!values.name.trim()}
          className={`p-2 w-full md:w-auto md:p-1.5 flex justify-center rounded-lg transition-colors flex-shrink-0 ${
            hasValidationIssue
              ? "bg-destructive text-destructive-foreground hover:opacity-90"
              : "bg-primary text-primary-foreground hover:opacity-90"
          } disabled:opacity-40 disabled:cursor-not-allowed`}
          title={hasValidationIssue ? t.macroMismatch : t.addMeal}
          id="quick-add-btn"
        >
          {hasValidationIssue ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Macro Validation Warning */}
      {showWarning && hasValidationIssue && (
        <MacroValidation
          calculatedKcal={validation.calculatedKcal}
          enteredKcal={validation.enteredKcal}
          onAddAnyway={doAdd}
          onDismiss={() => setShowWarning(false)}
        />
      )}
    </div>
  );
}
