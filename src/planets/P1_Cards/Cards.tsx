import { useState, useCallback } from 'react';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { MORNING_CARDS, EVENING_CARDS } from '../../data/planets';
import styles from './Cards.module.css';

type DeckType = 'morning' | 'evening';

interface DrawnCard {
  text: string;
  deck: DeckType;
}

export default function Cards() {
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [lastMorningIndex, setLastMorningIndex] = useLocalStorage<number>('cards_lastMorning', -1);
  const [lastEveningIndex, setLastEveningIndex] = useLocalStorage<number>('cards_lastEvening', -1);

  const drawCard = useCallback((deck: DeckType) => {
    const cards = deck === 'morning' ? MORNING_CARDS : EVENING_CARDS;
    const lastIndex = deck === 'morning' ? lastMorningIndex : lastEveningIndex;

    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * cards.length);
    } while (randomIndex === lastIndex && cards.length > 1);

    if (deck === 'morning') {
      setLastMorningIndex(randomIndex);
    } else {
      setLastEveningIndex(randomIndex);
    }

    setIsFlipping(true);
    setIsFlipped(false);
    setDrawnCard({ text: cards[randomIndex], deck });

    setTimeout(() => {
      setIsFlipped(true);
      setIsFlipping(false);
    }, 600);
  }, [lastMorningIndex, lastEveningIndex, setLastMorningIndex, setLastEveningIndex]);

  const resetCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setDrawnCard(null);
    }, 400);
  };

  return (
    <div className={styles.container}>
      <PlanetHeader name="Karticky" icon="&#x1F0CF;" color="#FFD700" />

      <div className={styles.content}>
        {!drawnCard ? (
          <>
            <p className={styles.intro}>
              Vyber si balicek a vytahni si svou karticky!
            </p>
            <div className={styles.decksRow}>
              {/* Morning Deck */}
              <button
                className={`${styles.deckStack} ${styles.morningDeck}`}
                onClick={() => drawCard('morning')}
                aria-label="Ranni karticky"
              >
                <div className={styles.deckCard3} />
                <div className={styles.deckCard2} />
                <div className={styles.deckCard1}>
                  <div className={styles.deckFace}>
                    <span className={styles.deckEmoji}>&#x2600;&#xFE0F;</span>
                    <span className={styles.deckStar1}>&#x2B50;</span>
                    <span className={styles.deckStar2}>&#x2B50;</span>
                  </div>
                </div>
                <span className={styles.deckLabel}>Ranni karticky</span>
              </button>

              {/* Evening Deck */}
              <button
                className={`${styles.deckStack} ${styles.eveningDeck}`}
                onClick={() => drawCard('evening')}
                aria-label="Vecerni karticky"
              >
                <div className={styles.deckCard3} />
                <div className={styles.deckCard2} />
                <div className={styles.deckCard1}>
                  <div className={styles.deckFace}>
                    <span className={styles.deckEmoji}>&#x1F319;</span>
                    <span className={styles.deckStar1}>&#x2B50;</span>
                    <span className={styles.deckStar2}>&#x2B50;</span>
                  </div>
                </div>
                <span className={styles.deckLabel}>Vecerni karticky</span>
              </button>
            </div>
          </>
        ) : (
          <div className={styles.drawnArea}>
            <div
              className={`${styles.cardWrapper} ${isFlipping ? styles.flipping : ''} ${isFlipped ? styles.flipped : ''}`}
            >
              {/* Card Back */}
              <div
                className={`${styles.cardSide} ${styles.cardBack} ${
                  drawnCard.deck === 'morning' ? styles.morningBack : styles.eveningBack
                }`}
              >
                <div className={styles.cardBackPattern}>
                  <span className={styles.cardBackEmoji}>
                    {drawnCard.deck === 'morning' ? '\u2600\uFE0F' : '\uD83C\uDF19'}
                  </span>
                </div>
              </div>

              {/* Card Front */}
              <div
                className={`${styles.cardSide} ${styles.cardFront} ${
                  drawnCard.deck === 'morning' ? styles.morningFront : styles.eveningFront
                }`}
              >
                <div className={styles.cardContent}>
                  <span className={styles.cardIcon}>
                    {drawnCard.deck === 'morning' ? '\u2600\uFE0F' : '\u2B50'}
                  </span>
                  <p className={styles.cardText}>{drawnCard.text}</p>
                  <span className={styles.cardIcon}>
                    {drawnCard.deck === 'morning' ? '\uD83C\uDF3B' : '\uD83C\uDF19'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.actionButton} ${
                  drawnCard.deck === 'morning' ? styles.morningButton : styles.eveningButton
                }`}
                onClick={() => {
                  resetCard();
                  setTimeout(() => drawCard(drawnCard.deck), 500);
                }}
              >
                Dalsi karticka
              </button>
              <button
                className={styles.backToDeckButton}
                onClick={resetCard}
              >
                Zpet na balicky
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
