"use client";

import { FoodTable } from "./FoodTable";
import { QuickAdd } from "./QuickAdd";
import { useTranslation } from "@/components/providers/LanguageProvider";
import type { MealEntry, MealEntryInput } from "@/lib/types";

interface FoodLogProps {
  meals: MealEntry[];
  loading: boolean;
  onAddMeal: (input: MealEntryInput) => void;
  onUpdateMeal: (id: string, input: Partial<MealEntryInput>) => void;
  onDeleteMeal: (id: string) => void;
}

/**
 * Food Log card — table of meals + quick add row.
 */
export function FoodLog({
  meals,
  loading,
  onAddMeal,
  onUpdateMeal,
  onDeleteMeal,
}: FoodLogProps) {
  const { t } = useTranslation();

  return (
    <section
      id="food-log"
      className="bg-card rounded-xl p-5 shadow-sm animate-fade-in"
    >
      <h2 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {t.dailyLog}
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <>
          <FoodTable
            meals={meals}
            onUpdate={onUpdateMeal}
            onDelete={onDeleteMeal}
          />
          <QuickAdd onAdd={onAddMeal} />
        </>
      )}
    </section>
  );
}
