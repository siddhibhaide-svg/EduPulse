import type { LucideIcon } from 'lucide-react';
import { Clock, Flame, ListChecks, RefreshCw } from 'lucide-react';
import { getActiveStreak, getLongestStreak, sumFocusMinutes } from '@/lib/analytics';
import type { StudyInsights } from '@/types/study';

type StatCardsProps = {
  insights: StudyInsights;
};

export default function StatCards({ insights }: StatCardsProps) {
  const { isLoading, focusSessions, streak, checkInDates, topics, subjects } = insights;
  const now = new Date();

  const focusHours = sumFocusMinutes(focusSessions) / 60;
  const { currentStreak } = getActiveStreak(streak, now);
  const longestStreak = getLongestStreak(checkInDates);
  const completedTopics = topics.filter(topic => topic.completed).length;
  const topicsPercent = topics.length === 0 ? 0 : Math.round((completedTopics / topics.length) * 100);
  const totalRevisions = subjects.reduce((sum, subject) => sum + subject.revision_count, 0);

  const placeholder = '—';

  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6" aria-label="Summary">
      <StatCard
        icon={Clock}
        label="Total focus"
        value={isLoading ? placeholder : `${focusHours.toFixed(1)} h`}
        detail={`${focusSessions.length} focus blocks logged`}
        tone="accent"
      />
      <StatCard
        icon={Flame}
        label="Streak"
        value={isLoading ? placeholder : `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'}`}
        detail={`Longest run: ${longestStreak} ${longestStreak === 1 ? 'day' : 'days'}`}
        tone="success"
      />
      <StatCard
        icon={ListChecks}
        label="Topics done"
        value={isLoading ? placeholder : `${topicsPercent}%`}
        detail={`${completedTopics} of ${topics.length} topics completed`}
        tone="success"
      />
      <StatCard
        icon={RefreshCw}
        label="Total revisions"
        value={isLoading ? placeholder : totalRevisions.toLocaleString('en-US')}
        detail={`Across ${subjects.length} ${subjects.length === 1 ? 'subject' : 'subjects'}`}
        tone="accent"
      />
    </section>
  );
}

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  tone: 'accent' | 'success';
};

const TONE_STYLES = {
  accent: {
    surface: 'from-accent/25 via-obsidian-surface to-obsidian-surface',
    badge: 'from-accent/40 to-accent/10 text-accent-light ring-accent/30',
    glow: 'hover:shadow-[0_24px_56px_-24px_rgba(79,70,229,0.6)]',
    line: 'via-accent-light/70',
  },
  success: {
    surface: 'from-success/20 via-obsidian-surface to-obsidian-surface',
    badge: 'from-success/35 to-success/10 text-success ring-success/30',
    glow: 'hover:shadow-[0_24px_56px_-24px_rgba(34,197,94,0.45)]',
    line: 'via-success/70',
  },
} as const;

function StatCard({ icon: Icon, label, value, detail, tone }: StatCardProps) {
  const styles = TONE_STYLES[tone];
  return (
    <article
      className={`animate-fade-up group relative overflow-hidden rounded-2xl border border-obsidian-border bg-gradient-to-br p-5 shadow-card transition duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 sm:p-6 ${styles.surface} ${styles.glow}`}
    >
      <span
        className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent ${styles.line} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
        aria-hidden="true"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ${styles.badge}`}>
          <Icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tabular-nums tracking-tight text-white sm:text-3xl">{value}</p>
      <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">{detail}</p>
    </article>
  );
}
