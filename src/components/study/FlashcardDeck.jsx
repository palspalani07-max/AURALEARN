import { useState } from 'react';
import { Layers, RotateCw, CheckCircle2, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import './FlashcardDeck.css';

const SAMPLE_CARDS = [
  { id: 1, front: 'What is First Normal Form (1NF)?', back: 'A relation is in 1NF if and only if all underlying domains contain atomic (indivisible) values only, with no repeating groups.' },
  { id: 2, front: 'Define Partial Dependency.', back: 'A dependency where a non-prime attribute depends on only a portion of a composite primary key.' },
  { id: 3, front: 'What is Third Normal Form (3NF)?', back: 'A relation is in 3NF if it is in 2NF and no non-prime attribute is transitively dependent on the primary key.' },
  { id: 4, front: 'What is Boyce-Codd Normal Form (BCNF)?', back: 'A stricter version of 3NF where for every functional dependency X → Y, X must be a super key.' },
];

export default function FlashcardDeck({ deckTitle = 'DBMS Normalization Cards' }) {
  const [cards, setCards] = useState(SAMPLE_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setFlipped(false);
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    setFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="card flashcard-container-card animate-scale-in">
      <div className="card-header">
        <div>
          <div className="badge badge-primary mb-1">Spaced Repetition Deck</div>
          <h2 className="card-title">{deckTitle}</h2>
          <p className="card-subtitle">Card {currentIndex + 1} of {cards.length}</p>
        </div>
      </div>

      {/* 3D Flip Card */}
      <div className="flashcard-scene mt-6" onClick={() => setFlipped(!flipped)}>
        <div className={`flashcard-inner ${flipped ? 'is-flipped' : ''}`}>
          <div className="flashcard-face flashcard-front">
            <span className="flashcard-badge">QUESTION</span>
            <div className="flashcard-text">{currentCard.front}</div>
            <span className="flashcard-hint"><RotateCw size={14} /> Click or tap to flip card</span>
          </div>

          <div className="flashcard-face flashcard-back">
            <span className="flashcard-badge flashcard-badge--accent">ANSWER</span>
            <div className="flashcard-text">{currentCard.back}</div>
            <span className="flashcard-hint"><RotateCw size={14} /> Click to flip back</span>
          </div>
        </div>
      </div>

      {/* Spaced Review Grade Buttons */}
      <div className="spaced-review-bar mt-8">
        <span className="text-xs font-semibold text-secondary w-full text-center mb-2 block">Rate Recall Difficulty (SM-2 Spaced Repetition):</span>
        <div className="flex gap-2 w-full">
          <button className="btn btn-secondary flex-1 border-danger text-danger" onClick={handleNext}>Again (1d)</button>
          <button className="btn btn-secondary flex-1 border-warning text-warning" onClick={handleNext}>Hard (3d)</button>
          <button className="btn btn-secondary flex-1 border-primary text-primary" onClick={handleNext}>Good (6d)</button>
          <button className="btn btn-primary flex-1" onClick={handleNext}>Easy (10d)</button>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button className="btn btn-ghost btn-sm" disabled={currentIndex === 0} onClick={handlePrev}>
          <ChevronLeft size={16} /> Previous
        </button>
        <button className="btn btn-ghost btn-sm" disabled={currentIndex === cards.length - 1} onClick={handleNext}>
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
