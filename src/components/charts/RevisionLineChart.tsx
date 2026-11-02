import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import BentoCard from '@/components/layout/BentoCard';
import ChartPlaceholder from '@/components/charts/ChartPlaceholder';
import { revisionTrend } from '@/lib/analytics';
import { CHART_COLORS, CHART_TICK, CHART_TOOLTIP_STYLE } from '@/lib/chartTheme';
import type { RevisionEvent } from '@/types/study';

type RevisionLineChartProps = {
  events: RevisionEvent[];
  isLoading: boolean;
};

const WINDOW_DAYS = 30;

export default function RevisionLineChart({ events, isLoading }: RevisionLineChartProps) {
  const trend = revisionTrend(events, WINDOW_DAYS, new Date());
  const latest = trend[trend.length - 1]?.total ?? 0;
  const gained = latest - (trend[0]?.total ?? 0);

  return (
    <BentoCard
      title="Revisions over time"
      icon={TrendingUp}
      className="lg:col-span-7"
      action={<span className="text-xs font-semibold text-slate-400">+{gained} in last {WINDOW_DAYS} days</span>}
    >
      {isLoading ? (
        <ChartPlaceholder />
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="revisionFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS.accent} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={CHART_COLORS.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={CHART_TICK}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis tick={CHART_TICK} tickLine={false} axisLine={false} width={44} allowDecimals={false} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                formatter={value => [`${value} revisions`, 'Total']}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke={CHART_COLORS.accentLight}
                strokeWidth={2.5}
                fill="url(#revisionFill)"
                activeDot={{ r: 5, fill: CHART_COLORS.accentLight, stroke: '#0D0E12', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </BentoCard>
  );
}
