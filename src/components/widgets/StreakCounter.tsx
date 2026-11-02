import { Check, Flame } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import ErrorNotice from '@/components/layout/ErrorNotice';
import { useStreak } from '@/hooks/useStreak';

export default function StreakCounter({ className = '' }: { className?: string }) {
  const { streak, currentStreak, checkedInToday, isLoading, error, checkIn } = useStreak();

  let statusText = 'Check in today to start your streak.';
  if (checkedInToday) {
    statusText = 'You showed up today. Come back tomorrow to keep it going.';
  } else if (currentStreak > 0) {
    statusText = 'Check in today to keep your streak alive.';
  }

  return (
    <BentoCard title="Daily Streak" icon={Flame} className={`lg:col-span-5 ${className}`}>
      <ErrorNotice message={error} />

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <defs>
            <linearGradient id="flame-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="45%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative flex h-40 w-40 items-center justify-center">
          <span
            aria-hidden="true"
            className="absolute inset-6 rounded-full bg-warning/30 blur-2xl animate-flicker"
          />
          <Flame
            key={currentStreak}
            className="relative h-24 w-24 animate-flicker drop-shadow-[0_0_18px_rgba(249,115,22,0.55)]"
            fill="url(#flame-gradient)"
            stroke="#F97316"
            strokeWidth={1.25}
            aria-hidden="true"
          />
        </div>

        <p
          key={`count-${currentStreak}`}
          className="mt-4 animate-pop-in font-mono text-5xl font-bold tabular-nums"
        >
          {isLoading ? '-' : currentStreak}
        </p>
        <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
          Day streak
        </p>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">{statusText}</p>

        <button
          type="button"
          onClick={checkIn}
          disabled={!streak || checkedInToday || isLoading}
          className="mt-6 flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-success px-5 py-3 font-semibold text-obsidian-canvas transition hover:bg-success-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-obsidian-raised disabled:text-slate-400"
        >
          {checkedInToday ? (
            <>
              <Check className="h-4 w-4" strokeWidth={3} />
              Checked in today
            </>
          ) : (
            'Check in for today'
          )}
        </button>
      </div>
    </BentoCard>
  );
}
