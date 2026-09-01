import FlashcardDeck from '../components/study/FlashcardDeck';

export default function FlashcardsPage() {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Flashcard Decks</h1>
        <p className="page-subtitle">Spaced repetition decks with 3D flip card animations.</p>
      </div>
      <FlashcardDeck />
    </div>
  );
}
