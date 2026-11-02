import { useState, type FormEvent } from 'react';
import { Check, ListChecks, Trash2 } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import ErrorNotice from '@/components/layout/ErrorNotice';
import { useTopics } from '@/hooks/useTopics';

export default function TopicProgress({ className = '' }: { className?: string }) {
  const { topics, isLoading, error, addTopic, toggleTopic, removeTopic } = useTopics();
  const [title, setTitle] = useState('');
  const completedCount = topics.filter(topic => topic.completed).length;
  const pendingCount = topics.length - completedCount;
  const percent = topics.length === 0 ? 0 : Math.round((completedCount / topics.length) * 100);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const saved = await addTopic(trimmed);
    if (saved) setTitle('');
  };

  return (
    <BentoCard
      title="Topic Progress"
      icon={ListChecks}
      className={`lg:col-span-7 ${className}`}
    >
      <ErrorNotice message={error} />

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-36 w-36 shrink-0">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              strokeWidth="10"
              pathLength={100}
              className="stroke-obsidian-border"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={100 - percent}
              className="stroke-success transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-semibold tabular-nums">{percent}%</span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Complete
            </span>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3 sm:flex-1">
          <div className="rounded-xl border border-obsidian-border bg-obsidian-canvas/60 px-4 py-3">
            <p className="font-mono text-2xl font-semibold tabular-nums text-success">{completedCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed</p>
          </div>
          <div className="rounded-xl border border-obsidian-border bg-obsidian-canvas/60 px-4 py-3">
            <p className="font-mono text-2xl font-semibold tabular-nums text-warning">{pendingCount}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pending</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="mt-6 flex gap-2">
        <input
          type="text"
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Add a topic, e.g. Thermodynamics"
          aria-label="New topic title"
          maxLength={120}
          className="field-input"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="shrink-0 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="mt-5">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading your topics...</p>
        ) : topics.length === 0 ? (
          <p className="rounded-xl border border-dashed border-obsidian-border px-4 py-6 text-sm text-slate-400">
            No topics yet. Add the chapters you want to master.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {topics.map(topic => (
              <li
                key={topic.id}
                className="group flex items-center gap-3 rounded-xl border border-obsidian-border bg-obsidian-canvas/60 px-4 py-3 transition hover:border-accent/50"
              >
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={topic.completed}
                    onChange={() => toggleTopic(topic.id)}
                    className="peer sr-only"
                  />
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-slate-500 bg-obsidian-surface transition peer-checked:border-success peer-checked:bg-success peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                    {topic.completed && <Check className="h-3.5 w-3.5 text-obsidian-canvas" strokeWidth={3} />}
                  </span>
                  <span
                    className={`truncate text-sm font-medium transition ${
                      topic.completed ? 'text-slate-500 line-through' : 'text-slate-100'
                    }`}
                  >
                    {topic.title}
                  </span>
                </label>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    topic.completed ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'
                  }`}
                >
                  {topic.completed ? 'Completed' : 'Pending'}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${topic.title}`}
                  onClick={() => removeTopic(topic.id)}
                  className="rounded-lg p-1.5 text-slate-500 transition hover:bg-obsidian-raised hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </BentoCard>
  );
}
