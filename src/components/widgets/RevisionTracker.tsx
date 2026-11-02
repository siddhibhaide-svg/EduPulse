import { useState, type FormEvent } from 'react';
import { BookOpen, Minus, Plus, Trash2 } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import ErrorNotice from '@/components/layout/ErrorNotice';
import { useSubjects } from '@/hooks/useSubjects';

export default function RevisionTracker({ className = '' }: { className?: string }) {
  const { subjects, isLoading, error, addSubject, adjustRevisions, removeSubject } = useSubjects();
  const [name, setName] = useState('');
  const totalRevisions = subjects.reduce((sum, subject) => sum + subject.revision_count, 0);

  const handleAdd = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const saved = await addSubject(trimmed);
    if (saved) setName('');
  };

  return (
    <BentoCard
      title="Revision Tracker"
      icon={BookOpen}
      className={`lg:col-span-5 ${className}`}
      action={
        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent-light">
          {totalRevisions} total
        </span>
      }
    >
      <ErrorNotice message={error} />

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading your subjects...</p>
      ) : subjects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-obsidian-border px-4 py-6 text-sm text-slate-400">
          Add a subject below to start counting your revisions.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-obsidian-border">
          {subjects.map(subject => (
            <li key={subject.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <p className="min-w-0 flex-1 truncate text-sm font-semibold">{subject.name}</p>
              <div className="flex items-center gap-1 rounded-xl border border-obsidian-border bg-obsidian-canvas p-1">
                <button
                  type="button"
                  aria-label={`Decrease revisions for ${subject.name}`}
                  disabled={subject.revision_count === 0}
                  onClick={() => adjustRevisions(subject.id, -1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-obsidian-raised hover:text-white active:scale-90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span
                  key={subject.revision_count}
                  className="w-9 animate-pop-in text-center font-mono text-base font-semibold tabular-nums"
                  aria-label={`${subject.revision_count} revisions`}
                >
                  {subject.revision_count}
                </span>
                <button
                  type="button"
                  aria-label={`Increase revisions for ${subject.name}`}
                  onClick={() => adjustRevisions(subject.id, 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-obsidian-raised hover:text-white active:scale-90"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                aria-label={`Remove ${subject.name}`}
                onClick={() => removeSubject(subject.id)}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-obsidian-raised hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="mt-6 flex gap-2">
        <input
          type="text"
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="Add a subject, e.g. Physics"
          aria-label="New subject name"
          maxLength={60}
          className="field-input"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="shrink-0 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </BentoCard>
  );
}
