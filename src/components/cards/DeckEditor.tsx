import { useState, type FormEvent } from 'react';
import { ArrowLeft, GraduationCap, Trash2 } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import type { FlashcardDeck } from '@/types/flashcards';

type DeckEditorProps = {
  deck: FlashcardDeck;
  onBack: () => void;
  onAddCard: (question: string, answer: string) => void;
  onDeleteCard: (cardId: string) => void;
  onStudy: () => void;
};

export default function DeckEditor({ deck, onBack, onAddCard, onDeleteCard, onStudy }: DeckEditorProps) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();
    if (!trimmedQuestion || !trimmedAnswer) return;
    onAddCard(trimmedQuestion, trimmedAnswer);
    setQuestion('');
    setAnswer('');
  };

  const hasCards = deck.cards.length > 0;

  return (
    <div className="flex flex-col gap-5 lg:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-obsidian-raised hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          All decks
        </button>
        <button
          type="button"
          onClick={onStudy}
          disabled={!hasCards}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_8px_24px_-10px_rgba(34,197,94,0.8)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98]"
        >
          <GraduationCap className="h-4 w-4" />
          Study {deck.subject}
        </button>
      </div>

      <BentoCard title={`${deck.subject}: add a card`} icon={GraduationCap}>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Question (front)</span>
            <textarea
              value={question}
              onChange={event => setQuestion(event.target.value)}
              rows={3}
              maxLength={300}
              placeholder="What is Newton's second law?"
              className="field-input resize-none"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-400">Answer (back)</span>
            <textarea
              value={answer}
              onChange={event => setAnswer(event.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Force equals mass times acceleration (F = ma)."
              className="field-input resize-none"
            />
          </label>
          <button
            type="submit"
            disabled={!question.trim() || !answer.trim()}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.98] md:col-span-2 md:w-fit"
          >
            Add card
          </button>
        </form>
      </BentoCard>

      <BentoCard title="Cards in this deck" icon={GraduationCap}>
        {!hasCards ? (
          <p className="text-sm text-slate-400">No cards yet. Add your first question above.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {deck.cards.map((card, index) => (
              <li
                key={card.id}
                className="flex items-start gap-4 rounded-xl border border-obsidian-border bg-obsidian-canvas/70 p-4"
              >
                <span className="font-mono text-xs font-semibold text-slate-500">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-100">{card.question}</p>
                  <p className="mt-1.5 text-sm text-slate-400">{card.answer}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteCard(card.id)}
                  aria-label={`Delete card: ${card.question}`}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-obsidian-raised hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </BentoCard>
    </div>
  );
}
