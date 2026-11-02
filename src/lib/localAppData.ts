import { FLASHCARD_DECKS_KEY } from '@/lib/flashcardStore';

export const NOTE_DOCUMENT_KEY = 'edupulse.note-document';
export const DATA_CLEARED_KEY = 'edupulse.data-cleared';

const APP_STORAGE_KEYS = [FLASHCARD_DECKS_KEY, NOTE_DOCUMENT_KEY, DATA_CLEARED_KEY];

export function clearLocalAppData() {
  for (const key of APP_STORAGE_KEYS) {
    window.localStorage.removeItem(key);
  }
}
