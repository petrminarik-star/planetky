import { useState, useCallback } from 'react';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import styles from './Cards.module.css';

type DeckType = 'morning' | 'evening';

const CARD_COUNT = 18;

interface DrawnCard {
  imageUrl: string;
  deck: DeckType;
}

export default function Cards() {
  const [drawnCard, setDrawnCard] = useState<DrawnCard | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [lastMorningIndex, setLastMorningIndex] = useLocalStorage<number>('cards_lastMorning', -1);
  const [lastEveningIndex, setLastEveningIndex] = useLocalStorage<number>('cards_lastEvening', -1);

  const drawCard = useCallback((deck: DeckType) => {
    const lastIndex = deck === 'morning' ? lastMorningIndex : lastEveningIndex;

    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * CARD_COUNT);
    } while (randomIndex === lastIndex && CARD_COUNT > 1);

    if (deck === 'morning') {
      setLastMorningIndex(randomIndex);
    } else {
      setLastEveningIndex(randomIndex);
    }

    const folder = deck === 'morning' ? 'morning' : 'evening';
    const imageUrl = `/assets/cards/${folder}/${randomIndex + 1}.png`;

    setIsFlipping(true);
    setIsFlipped(false);
    setDrawnCard({ imageUrl, deck });

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
      <PlanetHeader name="Kartičky" icon="&#x1F0CF;" color="#FFD700" />

      <div className={styles.content}>
        {!drawnCard ? (
          <>
            <p className={styles.intro}>
              Vyber si balíček a vytáhni si svou kartičku!
            </p>
            <div className={styles.decksRow}>
              {/* Morning Deck – Jang */}
              <button
                className={`${styles.deckStack} ${styles.morningDeck}`}
                onClick={() => drawCard('morning')}
                aria-label="Jang – ranní kartičky"
              >
                <div className={styles.deckCard3} />
                <div className={styles.deckCard2} />
                <div className={styles.deckCard1}>
                  <div className={styles.deckFace}>
                    <span className={styles.deckEmoji}>&#x2600;&#xFE0F;</span>
                    <span className={styles.deckName}>Jang</span>
                    <span className={styles.deckStar1}>&#x2B50;</span>
                    <span className={styles.deckStar2}>&#x2B50;</span>
                  </div>
                </div>
                <span className={styles.deckLabel}>Jang – ranní</span>
              </button>

              {/* Evening Deck – Jin */}
              <button
                className={`${styles.deckStack} ${styles.eveningDeck}`}
                onClick={() => drawCard('evening')}
                aria-label="Jin – večerní kartičky"
              >
                <div className={styles.deckCard3} />
                <div className={styles.deckCard2} />
                <div className={styles.deckCard1}>
                  <div className={styles.deckFace}>
                    <span className={styles.deckEmoji}>&#x1F319;</span>
                    <span className={styles.deckName}>Jin</span>
                    <span className={styles.deckStar1}>&#x2B50;</span>
                    <span className={styles.deckStar2}>&#x2B50;</span>
                  </div>
                </div>
                <span className={styles.deckLabel}>Jin – večerní</span>
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
                className={`${styles.cardSide} ${styles.cardFront}`}
              >
                <img
                  src={drawnCard.imageUrl}
                  alt="Kartička"
                  className={styles.cardImage}
                />
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
                Další kartička
              </button>
              <button
                className={styles.backToDeckButton}
                onClick={resetCard}
              >
                Zpět na balíčky
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
