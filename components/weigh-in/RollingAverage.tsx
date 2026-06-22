'use client';

import { useRollingAverage } from '@/hooks/useRollingAverage';
import { ArrowUp, ArrowDown, ArrowRight, Minus } from 'lucide-react';
import { useTranslation } from '@/components/providers/LanguageProvider';

interface RollingAverageProps {
  selectedDate: Date;
  todayMorningKg: number | null;
}

/**
 * 7-day rolling average section with three stat tiles:
 * 1. Avg morning weight
 * 2. vs prior 7 days (trend)
 * 3. Today vs avg
 */
export function RollingAverage({
  selectedDate,
  todayMorningKg,
}: RollingAverageProps) {
  const { t } = useTranslation();
  const { avgMorning, trend, todayVsAvg, daysWithData, loading } =
    useRollingAverage(selectedDate, todayMorningKg);

  const trendIcon =
    trend.direction === 'up' ? (
      <ArrowUp className="w-3.5 h-3.5" />
    ) : trend.direction === 'down' ? (
      <ArrowDown className="w-3.5 h-3.5" />
    ) : (
      <ArrowRight className="w-3.5 h-3.5" />
    );

  const trendColor =
    trend.direction === 'down'
      ? 'text-success'
      : trend.direction === 'up'
        ? 'text-over-limit'
        : 'text-muted-foreground';

  const trendLabel =
    trend.direction === 'up'
      ? t.trendingUp
      : trend.direction === 'down'
        ? t.trendingDown
        : t.stable;

  const todayVsAvgColor =
    todayVsAvg.status === 'below'
      ? 'text-success'
      : todayVsAvg.status === 'above'
        ? 'text-over-limit'
        : todayVsAvg.status === 'normal'
          ? 'text-foreground'
          : 'text-muted-foreground';

  const todayVsAvgLabel =
    todayVsAvg.status === 'below'
      ? t.belowYourAverage
      : todayVsAvg.status === 'above'
        ? t.aboveYourAverage
        : todayVsAvg.status === 'normal'
          ? t.withinNormalRange
          : t.notEnoughData;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {t.sevenDayTrend}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Tile 1: Avg Morning Weight */}
        <div className="bg-accent/50 rounded-lg p-3">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {t.avgMorningWeight}
          </p>
          <p className="font-numeric text-lg font-bold text-foreground">
            {avgMorning !== null ? `${avgMorning} kg` : '—'}
          </p>
          <p className="text-[9px] text-muted-foreground mt-0.5">
            {t.lastDaysWithData.replace("{days}", String(daysWithData))}
          </p>
        </div>

        {/* Tile 2: vs Prior 7 Days */}
        <div className="bg-accent/50 rounded-lg p-3">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {t.vsPrior7Days}
          </p>
          {trend.diff !== null ? (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              {trendIcon}
              <span className="font-numeric text-lg font-bold">
                {trend.diff > 0 ? '+' : ''}
                {trend.diff} kg
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Minus className="w-3.5 h-3.5" />
              <span className="font-numeric text-lg font-bold">—</span>
            </div>
          )}
          <p className={`text-[9px] mt-0.5 ${trendColor}`}>
            {trend.diff !== null ? trendLabel : t.notEnoughHistory}
          </p>
        </div>

        {/* Tile 3: Today vs Avg */}
        <div className="col-span-2 bg-accent/50 rounded-lg p-3">
          <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {t.todayVsAvg}
          </p>
          <p className={`font-numeric text-lg font-bold ${todayVsAvgColor}`}>
            {todayVsAvg.diff !== null
              ? `${todayVsAvg.diff > 0 ? '+' : ''}${todayVsAvg.diff} kg`
              : '—'}
          </p>
          <p className={`text-[9px] mt-0.5 ${todayVsAvgColor}`}>
            {todayVsAvgLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
