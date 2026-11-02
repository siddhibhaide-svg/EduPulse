import { useCallback } from 'react';
import { FLASHCARD_DECKS_KEY } from '@/lib/flashcardStore';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import type { FlashcardDeck } from '@/types/flashcards';

export function useFlashcardDecks() {
  const { value: decks, setValue: setDecks, saveFailed } = useLocalStorageState<FlashcardDeck[]>(
    FLASHCARD_DECKS_KEY,
    [],
  );

  const createDeck = useCallback(
    (subject: string) => {
      setDecks(current => [
        { id: crypto.randomUUID(), subject, cards: [], createdAt: new Date().toISOString() },
        ...current,
      ]);
    },
    [setDecks],
  );

  const deleteDeck = useCallback(
    (deckId: string) => setDecks(current => current.filter(deck => deck.id !== deckId)),
    [setDecks],
  );

  const addCard = useCallback(
    (deckId: string, question: string, answer: string) => {
      setDecks(current =>
        current.map(deck =>
          deck.id === deckId
            ? { ...deck, cards: [...deck.cards, { id: crypto.randomUUID(), question, answer }] }
            : deck,
        ),
      );
    },
    [setDecks],
  );

  const deleteCard = useCallback(
    (deckId: string, cardId: string) => {
      setDecks(current =>
        current.map(deck =>
          deck.id === deckId ? { ...deck, cards: deck.cards.filter(card => card.id !== cardId) } : deck,
        ),
      );
    },
    [setDecks],
  );

  return { decks, saveFailed, createDeck, deleteDeck, addCard, deleteCard };
}
