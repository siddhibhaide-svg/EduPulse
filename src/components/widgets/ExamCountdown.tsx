import { useState, type FormEvent } from 'react';
import { CalendarClock, Plus, Trash2, X } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import ErrorNotice from '@/components/layout/ErrorNotice';
import { useExams } from '@/hooks/useExams';
import { useNow } from '@/hooks/useNow';
import { formatDateLabel, getCountdownParts, parseDateKey, toDateKey } from '@/lib/dates';
import type { ExamEntry } from '@/types/study';

export default function ExamCountdown({ className = '' }: { className?: string }) {
  const { exams, isLoading, error, addExam, removeExam } = useExams();
  const now = useNow(1000);
  const todayKey = toDateKey(now);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState('');
  const [examDate, setExamDate] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !examDate) return;
    const saved = await addExam(trimmedName, examDate);
    if (saved) {
      setName('');
      setExamDate('');
      setIsFormOpen(false);
    }
  };

  return (
    <BentoCard
      title="Live Exam Countdown"
      icon={CalendarClock}
      className={`md:col-span-2 lg:col-span-12 ${className}`}
      action={
        <button
          type="button"
          onClick={() => setIsFormOpen(open => !open)}
          aria-expanded={isFormOpen}
          className="inline-flex items-center gap-2 rounded-xl border border-obsidian-border bg-obsidian-canvas px-3.5 py-2 text-sm font-semibold text-slate-200 transition hover:border-accent/60 hover:text-white"
        >
          {isFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isFormOpen ? 'Close' : 'Add exam'}
        </button>
      }
    >
      <ErrorNotice message={error} />

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid animate-fade-up gap-4 rounded-xl border border-obsidian-border bg-obsidian-canvas/60 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-end"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Exam name</span>
            <input
              type="text"
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="e.g. JEE Main, NEET, CET"
              maxLength={60}
              required
              className="field-input"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Exam date</span>
            <input
              type="date"
              value={examDate}
              min={todayKey}
              onChange={event => setExamDate(event.target.value)}
              required
              className="field-input sm:w-44"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]"
          >
            Save exam
          </button>
        </form>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading your exams...</p>
      ) : exams.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed border-obsidian-border px-5 py-8">
          <p className="font-semibold">No exams on the horizon yet</p>
          <p className="text-sm text-slate-400">
            Add your first exam to see a live countdown of days, hours, and minutes.
          </p>
        </div>
      ) : (
        <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-6 sm:px-6">
          {exams.map(exam => (
            <ExamTile key={exam.id} exam={exam} now={now} todayKey={todayKey} onRemove={removeExam} />
          ))}
        </div>
      )}
    </BentoCard>
  );
}

type ExamTileProps = {
  exam: ExamEntry;
  now: Date;
  todayKey: string;
  onRemove: (id: string) => void;
};

function ExamTile({ exam, now, todayKey, onRemove }: ExamTileProps) {
  const isToday = exam.exam_date === todayKey;
  const isPast = exam.exam_date < todayKey;
  const { days, hours, minutes } = getCountdownParts(parseDateKey(exam.exam_date), now);
  const units = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
  ];

  return (
    <article className="flex min-w-[280px] snap-start flex-col rounded-2xl border border-obsidian-border bg-obsidian-canvas p-5 transition hover:border-accent/60 sm:min-w-[320px]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{exam.name}</h3>
          <p className="mt-0.5 text-xs text-slate-400">{formatDateLabel(exam.exam_date)}</p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(exam.id)}
          aria-label={`Remove ${exam.name}`}
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-obsidian-raised hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {isToday || isPast ? (
        <p
          className={`mt-5 rounded-xl px-4 py-4 text-center text-sm font-semibold ${
            isToday ? 'bg-success/15 text-success' : 'bg-obsidian-surface text-slate-400'
          }`}
        >
          {isToday ? 'Exam day is today. Good luck!' : 'This exam date has passed.'}
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-3 gap-2">
          {units.map(unit => (
            <div key={unit.label} className="rounded-xl bg-obsidian-surface px-2 py-3 text-center">
              <p className="font-mono text-2xl font-semibold tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
