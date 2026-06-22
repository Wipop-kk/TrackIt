"use client";

import { FoodRow } from "./FoodRow";
import { useTranslation } from "@/components/providers/LanguageProvider";
import type { MealEntry, MealEntryInput } from "@/lib/types";
import { calculateMealTotals } from "@/lib/calculations";

interface FoodTableProps {
  meals: MealEntry[];
  onUpdate: (id: string, input: Partial<MealEntryInput>) => void;
  onDelete: (id: string) => void;
}

/**
 * Table of all food entries with a totals row pinned at the bottom.
 */
export function FoodTable({ meals, onUpdate, onDelete }: FoodTableProps) {
  const { t } = useTranslation();
  const totals = calculateMealTotals(meals);

  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-left" id="food-table">
        <thead>
          <tr className="border-b border-border">
            <th className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
              {t.food}
            </th>
            <th className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right whitespace-nowrap">
              {t.amountG}
            </th>
            <th className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right whitespace-nowrap">
              {t.kcal}
            </th>
            <th className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right whitespace-nowrap">
              {t.proteinG}
            </th>
            <th className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right whitespace-nowrap">
              {t.carbsG}
            </th>
            <th className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right whitespace-nowrap">
              {t.fatG}
            </th>
            <th className="px-2 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right whitespace-nowrap">
              {t.sugarG}
            </th>
            <th className="px-2 py-2 w-16"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {meals.map((meal) => (
            <FoodRow
              key={meal.id}
              meal={meal}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </tbody>
        {meals.length > 0 && (
          <tfoot>
            <tr className="border-t-2 border-border font-semibold">
              <td className="px-2 py-2 text-xs uppercase tracking-wider text-muted-foreground">
                {t.total}
              </td>
              <td className="px-2 py-2"></td>
              <td className="px-2 py-2 text-xs font-numeric text-right text-shuttlecock">
                {Math.round(totals.kcal)}
              </td>
              <td className="px-2 py-2 text-xs font-numeric text-right">
                {Number(totals.protein_g.toFixed(1))}
              </td>
              <td className="px-2 py-2 text-xs font-numeric text-right">
                {Number(totals.carbs_g.toFixed(1))}
              </td>
              <td className="px-2 py-2 text-xs font-numeric text-right">
                {Number(totals.fat_g.toFixed(1))}
              </td>
              <td className="px-2 py-2 text-xs font-numeric text-right">
                {Number(totals.sugar_g.toFixed(1))}
              </td>
              <td className="px-2 py-2"></td>
            </tr>
          </tfoot>
        )}
      </table>

      {meals.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {t.noMealsLogged}
        </div>
      )}
    </div>
  );
}
