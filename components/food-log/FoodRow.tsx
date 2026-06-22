"use client";

import { useState } from "react";
import { Pencil, X, Check } from "lucide-react";
import type { MealEntry, MealEntryInput } from "@/lib/types";

interface FoodRowProps {
  meal: MealEntry;
  onUpdate: (id: string, input: Partial<MealEntryInput>) => void;
  onDelete: (id: string) => void;
}

/**
 * Single food row with view/edit toggle.
 * View mode: display values + edit/delete icons
 * Edit mode: inline inputs, Enter to save, Escape to cancel
 */
export function FoodRow({ meal, onUpdate, onDelete }: FoodRowProps) {
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState<MealEntryInput>({
    name: meal.name,
    amount_g: Number(meal.amount_g),
    kcal: Number(meal.kcal),
    protein_g: Number(meal.protein_g),
    carbs_g: Number(meal.carbs_g),
    fat_g: Number(meal.fat_g),
    sugar_g: Number(meal.sugar_g),
  });

  const startEdit = () => {
    setEditValues({
      name: meal.name,
      amount_g: Number(meal.amount_g),
      kcal: Number(meal.kcal),
      protein_g: Number(meal.protein_g),
      carbs_g: Number(meal.carbs_g),
      fat_g: Number(meal.fat_g),
      sugar_g: Number(meal.sugar_g),
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
  };

  const saveEdit = () => {
    onUpdate(meal.id, editValues);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const handleChange = (field: keyof MealEntryInput, value: string) => {
    if (field === "name") {
      setEditValues((prev) => ({ ...prev, name: value }));
    } else {
      setEditValues((prev) => ({
        ...prev,
        [field]: value === "" ? 0 : parseFloat(value),
      }));
    }
  };

  if (editing) {
    return (
      <tr className="bg-accent/50" onKeyDown={handleKeyDown}>
        <td className="px-2 py-1.5">
          <input
            type="text"
            value={editValues.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full bg-background border border-border rounded px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
        </td>
        <td className="px-2 py-1.5">
          <input
            type="number"
            value={editValues.amount_g || ""}
            onChange={(e) => handleChange("amount_g", e.target.value)}
            className="w-14 bg-background border border-border rounded px-1.5 py-0.5 text-xs font-numeric text-right focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </td>
        <td className="px-2 py-1.5">
          <input
            type="number"
            value={editValues.kcal || ""}
            onChange={(e) => handleChange("kcal", e.target.value)}
            className="w-14 bg-background border border-border rounded px-1.5 py-0.5 text-xs font-numeric text-right focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </td>
        <td className="px-2 py-1.5">
          <input
            type="number"
            value={editValues.protein_g || ""}
            onChange={(e) => handleChange("protein_g", e.target.value)}
            className="w-12 bg-background border border-border rounded px-1.5 py-0.5 text-xs font-numeric text-right focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </td>
        <td className="px-2 py-1.5">
          <input
            type="number"
            value={editValues.carbs_g || ""}
            onChange={(e) => handleChange("carbs_g", e.target.value)}
            className="w-12 bg-background border border-border rounded px-1.5 py-0.5 text-xs font-numeric text-right focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </td>
        <td className="px-2 py-1.5">
          <input
            type="number"
            value={editValues.fat_g || ""}
            onChange={(e) => handleChange("fat_g", e.target.value)}
            className="w-12 bg-background border border-border rounded px-1.5 py-0.5 text-xs font-numeric text-right focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </td>
        <td className="px-2 py-1.5">
          <input
            type="number"
            value={editValues.sugar_g || ""}
            onChange={(e) => handleChange("sugar_g", e.target.value)}
            className="w-12 bg-background border border-border rounded px-1.5 py-0.5 text-xs font-numeric text-right focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </td>
        <td className="px-2 py-1.5">
          <div className="flex gap-1">
            <button
              onClick={saveEdit}
              className="p-1 rounded hover:bg-success/20 text-success transition-colors"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={cancelEdit}
              className="p-1 rounded hover:bg-destructive/20 text-muted-foreground transition-colors"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-accent/30 transition-colors">
      <td className="px-2 py-1.5 text-xs">{meal.name}</td>
      <td className="px-2 py-1.5 text-xs font-numeric text-right">
        {Number(meal.amount_g)}
      </td>
      <td className="px-2 py-1.5 text-xs font-numeric text-right font-semibold text-shuttlecock">
        {Number(meal.kcal)}
      </td>
      <td className="px-2 py-1.5 text-xs font-numeric text-right">
        {Number(meal.protein_g)}
      </td>
      <td className="px-2 py-1.5 text-xs font-numeric text-right">
        {Number(meal.carbs_g)}
      </td>
      <td className="px-2 py-1.5 text-xs font-numeric text-right">
        {Number(meal.fat_g)}
      </td>
      <td className="px-2 py-1.5 text-xs font-numeric text-right">
        {Number(meal.sugar_g)}
      </td>
      <td className="px-2 py-1.5">
        <div className="flex gap-1">
          <button
            onClick={startEdit}
            className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
            title="Edit"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(meal.id)}
            className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
