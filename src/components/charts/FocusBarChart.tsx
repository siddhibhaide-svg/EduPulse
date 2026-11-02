import { Clock } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import BentoCard from '@/components/layout/BentoCard';
import { focusMinutesByDay } from '@/lib/analytics';
import { CHART_COLORS, CHART_TICK, CHART_TOOLTIP_STYLE } from '@/lib/chartTheme';
import type { FocusSession } from '@/types/study';
import ChartPlaceholder from '@/components/charts/ChartPlaceholder';

type FocusBarChartProps = {
  sessions: FocusSession[];
  isLoading: boolean;
};

export default function FocusBarChart({ sessions, isLoading }: FocusBarChartProps) {
  const now = new Date();
  const days = focusMinutesByDay(sessions, 7, now);
  const minutesThisWeek = days.reduce((sum, day) => sum + day.minutes, 0);

  return (
    <BentoCard
      title="Focus minutes, last 7 days"
      icon={Clock}
      className="lg:col-span-7"
      action={<span className="text-xs font-semibold text-slate-400">{minutesThisWeek} min total</span>}
    >
      {isLoading ? (
        <ChartPlaceholder />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={CHART_TICK} tickLine={false} axisLine={false} />
              <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} width={44} />
              <Tooltip
                cursor={{ fill: 'rgba(79, 70, 229, 0.08)' }}
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={value => [`${value} min`, 'Focus']}
              />
              <Bar dataKey="minutes" fill={CHART_COLORS.accent} radius={[8, 8, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </BentoCard>
  );
}
