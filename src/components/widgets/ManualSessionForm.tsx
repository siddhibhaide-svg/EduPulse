import { useState, type FormEvent } from 'react';
import { Plus } from 'lucide-react';
import ErrorNotice from '@/components/layout/ErrorNotice';
import { SAVE_ERROR_MESSAGE } from '@/lib/errors';
import { recordFocusSession } from '@/lib/studyLog';
import type { StudySubject } from '@/types/study';

const MIN_MINUTES = 1;
const MAX_MINUTES = 240;
const INVALID_MINUTES_MESSAGE = `Enter a whole number of minutes from ${MIN_MINUTES} to ${MAX_MINUTES}.`;

type ManualSessionFormProps = {
  subjects: StudySubject[];
};

export default function ManualSessionForm({ subjects }: ManualSessionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [subjectId, setSubjectId] = useState('');
  const [minutesInput, setMinutesInput] = useState('25');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSubjectId = subjects.some(subject => subject.id === subjectId)
    ? subjectId
    : (subjects[0]?.id ?? '');

  const close = () => {
    setIsOpen(false);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const minutes = Number(minutesInput);
    if (!selectedSubjectId) {
      setError('Add a subject in Revision Tracker first.');
      return;
    }
    if (!Number.isInteger(minutes) || minutes < MIN_MINUTES || minutes > MAX_MINUTES) {
      setError(INVALID_MINUTES_MESSAGE);
      return;
    }

    setIsSaving(true);
    setError(null);
    const saved = await recordFocusSession(minutes, selectedSubjectId);
    setIsSaving(false);
    if (!saved) {
      setError(SAVE_ERROR_MESSAGE);
      return;
    }
    setMinutesInput('25');
    setIsOpen(false);
  };

  return (
    <div className="mt-6 border-t border-obsidian-border pt-5">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        className="inline-flex items-center gap-2 rounded-full border border-obsidian-border px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-accent/60 hover:text-white"
      >
        <Plus className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
        Add study session
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 animate-fade-up">
          <ErrorNotice message={error} />
          <div className="grid gap-4 sm:grid-cols-[1fr_8rem_auto] sm:items-end">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Subject</span>
            <select
              className="field-input"
              value={selectedSubjectId}
              disabled={subjects.length === 0 || isSaving}
              onChange={event => setSubjectId(event.target.value)}
              required
            >
              {subjects.length === 0 && <option value="">Add a subject first</option>}
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Minutes</span>
            <input
              type="number"
              inputMode="numeric"
              min={MIN_MINUTES}
              max={MAX_MINUTES}
              step={1}
              className="field-input font-mono tabular-nums"
              value={minutesInput}
              disabled={isSaving}
              onChange={event => setMinutesInput(event.target.value)}
              required
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={close}
              disabled={isSaving}
              className="rounded-full border border-obsidian-border px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || subjects.length === 0}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save session'}
            </button>
          </div>
          </div>
        </form>
      )}
    </div>
  );
}
