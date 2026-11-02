import type { FlashcardDeck } from '@/types/flashcards';
import type { OnePageNotes } from '@/types/notes';

export function notesToFlashcardDeck(title: string, notes: OnePageNotes): FlashcardDeck {
  const cards = [
    ...notes.definitions.map(definition => ({
      question: `What is ${definition.term}?`,
      answer: definition.meaning,
    })),
    ...notes.formulas.map(formula => ({
      question: 'Recall this formula',
      answer: formula,
    })),
    ...notes.questions.map(item => ({
      question: item.question,
      answer: item.source,
    })),
  ].map(card => ({ id: crypto.randomUUID(), ...card }));

  return {
    id: crypto.randomUUID(),
    subject: title,
    cards,
    createdAt: new Date().toISOString(),
  };
}
