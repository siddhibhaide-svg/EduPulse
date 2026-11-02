import type { FlashcardDeck } from '@/types/flashcards';
import { readJson, writeJson } from '@/lib/localStorageJson';

export const FLASHCARD_DECKS_KEY = 'edupulse.flashcard-decks';

export function appendFlashcardDeck(deck: FlashcardDeck): boolean {
  const decks = readJson<FlashcardDeck[]>(FLASHCARD_DECKS_KEY, []);
  return writeJson(FLASHCARD_DECKS_KEY, [deck, ...decks]);
}
