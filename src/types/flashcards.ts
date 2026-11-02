export type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export type FlashcardDeck = {
  id: string;
  subject: string;
  cards: Flashcard[];
  createdAt: string;
};
