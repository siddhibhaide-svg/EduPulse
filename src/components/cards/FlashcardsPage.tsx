import { useState } from 'react';
import ErrorNotice from '@/components/layout/ErrorNotice';
import PageHeader from '@/components/layout/PageHeader';
import DeckEditor from '@/components/cards/DeckEditor';
import DeckList from '@/components/cards/DeckList';
import StudySession from '@/components/cards/StudySession';
import { useFlashcardDecks } from '@/hooks/useFlashcardDecks';

type CardsRoute = { name: 'list' } | { name: 'editor'; deckId: string } | { name: 'study'; deckId: string };

export default function FlashcardsPage() {
  const { decks, saveFailed, createDeck, deleteDeck, addCard, deleteCard } = useFlashcardDecks();
  const [route, setRoute] = useState<CardsRoute>({ name: 'list' });

  const activeDeck = route.name === 'list' ? null : decks.find(deck => deck.id === route.deckId) ?? null;
  const showList = route.name === 'list' || activeDeck === null;

  return (
    <div>
      <PageHeader
        title="Flashcards"
        description="Build a deck for each subject, then flip through cards until every answer feels automatic."
      />
      <ErrorNotice
        message={saveFailed ? 'Browser storage is full or unavailable, so recent changes may not be saved.' : null}
      />

      {showList && (
        <DeckList
          decks={decks}
          onCreate={createDeck}
          onOpen={deckId => setRoute({ name: 'editor', deckId })}
          onDelete={deleteDeck}
        />
      )}

      {!showList && activeDeck && route.name === 'editor' && (
        <DeckEditor
          deck={activeDeck}
          onBack={() => setRoute({ name: 'list' })}
          onAddCard={(question, answer) => addCard(activeDeck.id, question, answer)}
          onDeleteCard={cardId => deleteCard(activeDeck.id, cardId)}
          onStudy={() => setRoute({ name: 'study', deckId: activeDeck.id })}
        />
      )}

      {!showList && activeDeck && route.name === 'study' && (
        <StudySession
          key={activeDeck.id}
          deck={activeDeck}
          onExit={() => setRoute({ name: 'editor', deckId: activeDeck.id })}
        />
      )}
    </div>
  );
}
