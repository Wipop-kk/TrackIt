"use client";

import { useState } from "react";
import { X, Plus, Pencil, Trash2, Check, Star } from "lucide-react";
import type { Preset, PresetInput } from "@/lib/types";
import { useTranslation } from "@/components/providers/LanguageProvider";
import { getTranslatedPresetName } from "@/lib/i18n/utils";

interface PresetManagerProps {
  presets: Preset[];
  onClose: () => void;
  onAdd: (input: PresetInput) => void;
  onUpdate: (id: string, input: Partial<PresetInput>) => void;
  onDelete: (id: string) => void;
}

const emptyPreset: PresetInput = {
  name: "",
  kcal_goal: 2000,
  protein_goal_g: 150,
  carbs_goal_g: 200,
  fat_goal_g: 67,
  is_default: false,
};

/**
 * Preset Manager modal — CRUD interface for activity presets.
 */
export function PresetManager({
  presets,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
}: PresetManagerProps) {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<PresetInput>({ ...emptyPreset });
  const [isAdding, setIsAdding] = useState(false);
  const [newValues, setNewValues] = useState<PresetInput>({ ...emptyPreset });

  const startEdit = (preset: Preset) => {
    setEditingId(preset.id);
    setEditValues({
      name: preset.name,
      kcal_goal: preset.kcal_goal,
      protein_goal_g: Number(preset.protein_goal_g),
      carbs_goal_g: Number(preset.carbs_goal_g),
      fat_goal_g: Number(preset.fat_goal_g),
      is_default: preset.is_default,
    });
    setIsAdding(false);
  };

  const saveEdit = () => {
    if (!editingId || !editValues.name.trim()) return;
    onUpdate(editingId, editValues);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newValues.name.trim()) return;
    onAdd(newValues);
    setNewValues({ ...emptyPreset });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this preset? Daily logs using it will keep their data but lose the preset reference.")) {
      onDelete(id);
      if (editingId === id) setEditingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-heading font-bold text-lg">{t.editPresets}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-3">
          {presets.map((preset) => {
            const isEditing = editingId === preset.id;
            const displayName = getTranslatedPresetName(preset.name, t);

            if (isEditing) {
              return (
                <div
                  key={preset.id}
                  className="bg-accent/50 rounded-xl p-4 space-y-3 border border-primary/20"
                >
                  <input
                    type="text"
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder={t.presetName}
                    autoFocus
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {t.kcal}
                      </label>
                      <input
                        type="number"
                        value={editValues.kcal_goal || ""}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            kcal_goal: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-numeric focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {t.proteinG}
                      </label>
                      <input
                        type="number"
                        value={editValues.protein_goal_g || ""}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            protein_goal_g: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-numeric focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {t.carbsG}
                      </label>
                      <input
                        type="number"
                        value={editValues.carbs_goal_g || ""}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            carbs_goal_g: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-numeric focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {t.fatG}
                      </label>
                      <input
                        type="number"
                        value={editValues.fat_goal_g || ""}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            fat_goal_g: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-numeric focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editValues.is_default}
                      onChange={(e) =>
                        setEditValues((prev) => ({
                          ...prev,
                          is_default: e.target.checked,
                        }))
                      }
                      className="rounded border-border"
                    />
                    <span className="text-xs text-muted-foreground">
                      {t.setAsDefaultPreset}
                    </span>
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={saveEdit}
                      className="flex-1 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {t.save}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 py-1.5 bg-background border border-border text-foreground text-xs font-medium rounded-lg hover:bg-accent transition-colors"
                    >
                      {t.cancel}
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={preset.id}
                className="flex items-center justify-between bg-accent/30 rounded-xl px-4 py-3 hover:bg-accent/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{displayName}</span>
                    {preset.is_default && (
                      <Star className="w-3 h-3 text-shuttlecock fill-shuttlecock" />
                    )}
                  </div>
                  <span className="text-[11px] font-numeric text-muted-foreground">
                    {preset.kcal_goal} {t.kcal} · P{Number(preset.protein_goal_g)}g · C
                    {Number(preset.carbs_goal_g)}g · F{Number(preset.fat_goal_g)}g
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(preset)}
                    className="p-1.5 rounded-lg hover:bg-background text-muted-foreground hover:text-primary transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(preset.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add New Preset */}
          {isAdding ? (
            <div className="bg-accent/50 rounded-xl p-4 space-y-3 border border-dashed border-primary/30">
              <input
                type="text"
                value={newValues.name}
                onChange={(e) =>
                  setNewValues((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder={t.newPresetName}
                autoFocus
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Kcal
                  </label>
                  <input
                    type="number"
                    value={newValues.kcal_goal || ""}
                    onChange={(e) =>
                      setNewValues((prev) => ({
                        ...prev,
                        kcal_goal: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-numeric focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    value={newValues.protein_goal_g || ""}
                    onChange={(e) =>
                      setNewValues((prev) => ({
                        ...prev,
                        protein_goal_g: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-numeric focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    value={newValues.carbs_goal_g || ""}
                    onChange={(e) =>
                      setNewValues((prev) => ({
                        ...prev,
                        carbs_goal_g: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-numeric focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    value={newValues.fat_goal_g || ""}
                    onChange={(e) =>
                      setNewValues((prev) => ({
                        ...prev,
                        fat_goal_g: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-sm font-numeric focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleAdd}
                  disabled={!newValues.name.trim()}
                  className="flex-1 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t.addPreset}
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewValues({ ...emptyPreset });
                  }}
                  className="flex-1 py-1.5 bg-background border border-border text-foreground text-xs font-medium rounded-lg hover:bg-accent transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsAdding(true);
                setEditingId(null);
              }}
              className="w-full py-3 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t.addNewPreset}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
