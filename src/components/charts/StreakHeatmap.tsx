import { CalendarDays } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import ChartPlaceholder from '@/components/charts/ChartPlaceholder';
import { heatmapCells } from '@/lib/analytics';

type StreakHeatmapProps = {
  checkInDates: string[];
  isLoading: boolean;
};

const WEEKS = 12;
const DAYS = WEEKS * 7;

export default function StreakHeatmap({ checkInDates, isLoading }: StreakHeatmapProps) {
  const cells = heatmapCells(checkInDates, DAYS, new Date());
  const checkedCount = cells.filter(cell => cell.checked).length;

  return (
    <BentoCard
      title="Check-in heatmap"
      icon={CalendarDays}
      className="lg:col-span-5"
      action={<span className="text-xs font-semibold text-slate-400">{WEEKS} weeks</span>}
    >
      {isLoading ? (
        <ChartPlaceholder />
      ) : (
        <div className="flex flex-1 flex-col justify-between gap-5">
          <div className="grid grid-flow-col grid-rows-7 auto-cols-fr gap-1.5">
            {cells.map(cell => (
              <span
                key={cell.key}
                title={`${cell.label}: ${cell.checked ? 'Checked in' : 'No check-in'}`}
                className={`aspect-square w-full rounded-[5px] transition-transform duration-200 hover:scale-110 ${
                  cell.checked
                    ? 'bg-gradient-to-br from-success to-success/70 shadow-[0_0_10px_-2px_rgba(34,197,94,0.7)]'
                    : 'bg-obsidian-raised'
                } ${cell.isToday ? 'ring-1 ring-accent-light ring-offset-1 ring-offset-obsidian-surface' : ''}`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
            <span className="tabular-nums">
              {checkedCount} of {DAYS} days checked in
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-obsidian-raised" />
              Missed
              <span className="h-2.5 w-2.5 rounded-[3px] bg-success" />
              Checked in
            </span>
          </div>
        </div>
      )}
    </BentoCard>
  );
}
