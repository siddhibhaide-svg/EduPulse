import { useState, type FormEvent } from 'react';
import { ArrowRight, FolderPlus, Layers, Trash2 } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import type { FlashcardDeck } from '@/types/flashcards';

type DeckListProps = {
  decks: FlashcardDeck[];
  onCreate: (subject: string) => void;
  onOpen: (deckId: string) => void;
  onDelete: (deckId: string) => void;
};

export default function DeckList({ decks, onCreate, onOpen, onDelete }: DeckListProps) {
  const [subject, setSubject] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = subject.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setSubject('');
  };

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <BentoCard title="New subject deck" icon={FolderPlus}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={subject}
            onChange={event => setSubject(event.target.value)}
            placeholder="e.g. Physics, Organic Chemistry, Calculus"
            maxLength={60}
            aria-label="Subject name"
            className="field-input"
          />
          <button
            type="submit"
            disabled={!subject.trim()}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
          >
            Create deck
          </button>
        </form>
      </BentoCard>

      {decks.length === 0 ? (
        <div className="flex flex-col items-start gap-2 rounded-2xl border border-dashed border-obsidian-border px-6 py-10">
          <p className="font-semibold">No decks yet</p>
          <p className="text-sm text-slate-400">Create a deck for a subject, then add question and answer cards.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {decks.map(deck => (
            <article
              key={deck.id}
              className="animate-fade-up flex flex-col gap-5 rounded-2xl border border-obsidian-border bg-gradient-to-br from-[#1A1C24] via-obsidian-surface to-[#121318] p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-accent/40"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/30 to-accent/10 text-accent-light ring-1 ring-accent/20">
                  <Layers className="h-5 w-5" />
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(deck.id)}
                  aria-label={`Delete ${deck.subject} deck`}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-obsidian-raised hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div>
                <h3 className="truncate text-lg font-semibold">{deck.subject}</h3>
                <p className="mt-1 text-sm text-slate-400">
                  {deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpen(deck.id)}
                className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-obsidian-border bg-obsidian-canvas px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-accent/60 hover:text-white"
              >
                Open deck
                <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
