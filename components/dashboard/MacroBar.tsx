"use client";

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  unit?: string;
}

/**
 * Horizontal progress bar for a single macro (Protein, Carbs, Fat).
 * Turns red when exceeded.
 */
export function MacroBar({ label, current, target, unit = "g" }: MacroBarProps) {
  const percentage = target > 0 ? (current / target) * 100 : 0;
  const isOver = current > target;
  const displayCurrent = Number(current.toFixed(1));
  const displayTarget = Number(target.toFixed(0));

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="font-numeric text-xs">
          <span className={isOver ? "text-over-limit font-semibold" : "text-foreground"}>
            {displayCurrent}
          </span>
          <span className="text-muted-foreground"> / {displayTarget} {unit}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-600 ease-out ${
            isOver ? "bg-over-limit" : "bg-success"
          }`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
            "--bar-width": `${Math.min(percentage, 100)}%`,
          } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
