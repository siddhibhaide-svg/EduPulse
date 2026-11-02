import { useState } from 'react';
import { ArrowLeft, Check, Shuffle, Sparkles, Undo2 } from 'lucide-react';
import BentoCard from '@/components/layout/BentoCard';
import FlipCard from '@/components/cards/FlipCard';
import { shuffleItems } from '@/lib/shuffleItems';
import type { Flashcard, FlashcardDeck } from '@/types/flashcards';

type StudySessionProps = {
  deck: FlashcardDeck;
  onExit: () => void;
};

export default function StudySession({ deck, onExit }: StudySessionProps) {
  const [total] = useState(deck.cards.length);
  const [queue, setQueue] = useState<Flashcard[]>(deck.cards);
  const [gotCount, setGotCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = queue[0];
  const isFinished = queue.length === 0;
  const progress = total === 0 ? 0 : Math.round((gotCount / total) * 100);

  const grade = (gotIt: boolean) => {
    setIsFlipped(false);
    if (gotIt) setGotCount(count => count + 1);
    setQueue(current => (gotIt ? current.slice(1) : [...current.slice(1), current[0]]));
  };

  const restart = () => {
    setQueue(deck.cards);
    setGotCount(0);
    setIsFlipped(false);
  };

  const shuffle = () => {
    setIsFlipped(false);
    setQueue(current => shuffleItems(current));
  };

  return (
    <BentoCard title={deck.subject} icon={Sparkles} active={!isFinished} className="w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-400 transition hover:bg-obsidian-raised hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to deck
        </button>
        <button
          type="button"
          onClick={shuffle}
          disabled={isFinished || queue.length < 2}
          className="inline-flex items-center gap-2 rounded-xl border border-obsidian-border bg-obsidian-canvas px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-accent/60 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Shuffle className="h-4 w-4" />
          Shuffle
        </button>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-slate-200">
            {gotCount} of {total} mastered
          </span>
          <span className="text-slate-400">{queue.length} left this round</span>
        </div>
        <div
          role="progressbar"
          aria-label="Session progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-2.5 w-full overflow-hidden rounded-full bg-obsidian-canvas"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-success transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isFinished ? (
        <div className="flex animate-fade-up flex-col items-center gap-4 rounded-2xl border border-success/30 bg-success/10 px-6 py-12 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-slate-950">
            <Check className="h-7 w-7" strokeWidth={3} />
          </span>
          <h3 className="text-xl font-semibold">Round complete</h3>
          <p className="text-sm text-slate-300">Every card in this deck is marked as got it.</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={restart}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]"
            >
              Study again
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-xl border border-obsidian-border px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-accent/60"
            >
              Back to deck
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <FlipCard
            question={currentCard.question}
            answer={currentCard.answer}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(flipped => !flipped)}
          />
          {isFlipped ? (
            <div className="grid animate-fade-up gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => grade(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-5 py-3 text-sm font-semibold text-warning transition hover:bg-warning/20 active:scale-[0.98]"
              >
                <Undo2 className="h-4 w-4" />
                Review again
              </button>
              <button
                type="button"
                onClick={() => grade(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_8px_24px_-10px_rgba(34,197,94,0.8)] transition hover:brightness-110 active:scale-[0.98]"
              >
                <Check className="h-4 w-4" strokeWidth={3} />
                Got it
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover active:scale-[0.98]"
            >
              Show answer
            </button>
          )}
        </div>
      )}
    </BentoCard>
  );
}
