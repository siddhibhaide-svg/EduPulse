import { Target } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import BentoCard from '@/components/layout/BentoCard';
import ChartPlaceholder from '@/components/charts/ChartPlaceholder';
import { focusMinutesBySubject } from '@/lib/analytics';
import { CHART_TOOLTIP_STYLE, SUBJECT_PALETTE } from '@/lib/chartTheme';
import type { FocusSession, StudySubject } from '@/types/study';

type SubjectDonutChartProps = {
  sessions: FocusSession[];
  subjects: StudySubject[];
  isLoading: boolean;
};

export default function SubjectDonutChart({ sessions, subjects, isLoading }: SubjectDonutChartProps) {
  const slices = focusMinutesBySubject(sessions, subjects);
  const totalMinutes = slices.reduce((sum, slice) => sum + slice.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const colorFor = (index: number) => SUBJECT_PALETTE[index % SUBJECT_PALETTE.length];

  return (
    <BentoCard title="Study time by subject" icon={Target} className="lg:col-span-5">
      {isLoading ? (
        <ChartPlaceholder />
      ) : (
        <div className="grid items-center gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="relative mx-auto h-52 w-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="minutes"
                  nameKey="name"
                  innerRadius="68%"
                  outerRadius="100%"
                  paddingAngle={3}
                  stroke="none"
                >
                  {slices.map((slice, index) => (
                    <Cell key={slice.id} fill={colorFor(index)} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={CHART_TOOLTIP_STYLE}
                  formatter={value => [`${Math.round(Number(value))} min`, 'Study time']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold tabular-nums text-white">{totalHours} h</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Total</span>
            </div>
          </div>
          <ul className="flex flex-col gap-3">
            {slices.map((slice, index) => {
              const percent = totalMinutes === 0 ? 0 : Math.round((slice.minutes / totalMinutes) * 100);
              return (
                <li key={slice.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: colorFor(index) }}
                    />
                    <span className="truncate text-slate-200">{slice.name}</span>
                  </span>
                  <span className="shrink-0 font-mono tabular-nums text-slate-400">{percent}%</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </BentoCard>
  );
}
