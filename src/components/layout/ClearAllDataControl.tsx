import { useEffect, useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

type ClearAllDataControlProps = {
  onClear: () => Promise<void>;
  disabled: boolean;
};

export default function ClearAllDataControl({ onClear, disabled }: ClearAllDataControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isClearing) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, isClearing]);

  const openDialog = () => {
    setError(null);
    setIsOpen(true);
  };

  const confirmClear = async () => {
    setIsClearing(true);
    setError(null);
    try {
      await onClear();
    } catch (clearError) {
      console.error(clearError);
      setError('Could not clear your data. Please try again.');
      setIsClearing(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        disabled={disabled}
        className="inline-flex items-center gap-2 rounded-full border border-obsidian-border bg-obsidian-surface px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-danger/60 hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" />
        Clear all data
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-up">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-all-title"
            className="w-full max-w-md rounded-2xl border border-obsidian-border bg-obsidian-surface p-6 shadow-card"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger/15 text-danger">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 id="clear-all-title" className="text-lg font-bold text-white">
                  Clear all data?
                </h2>
                <p className="text-sm leading-relaxed text-slate-400">
                  This permanently deletes every focus session, subject, revision, topic, exam, check-in,
                  flashcard deck, and note. The app will start empty. This cannot be undone.
                </p>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-4 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isClearing}
                className="rounded-full border border-obsidian-border px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-accent/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmClear}
                disabled={isClearing}
                className="rounded-full bg-danger px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isClearing ? 'Clearing...' : 'Yes, clear everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
