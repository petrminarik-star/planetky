import { useState, useCallback } from 'react';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import styles from './Cards.module.css';

type DeckType = 'morning' | 'evening';

const MORNING_CARDS = [
  'Zkus dnes udělat něco, co je těžké, jako by to udělal tvůj oblíbený superhrdina.',
  'Zkus dnes někomu pomoci, třeba mamince, tatínkovi, paní učitelce nebo někomu jinému.',
  'Na co se dnes nejvíc těšíš?',
  'Co se chceš dnes naučit nového?',
  'Když se bojíš, pomysli na něco, co máš rád/a, co tě uklidní, nebo vytvoř s rodiči něco, co tě uklidní a nos to s sebou.',
  'Na co se chceš někoho zeptat, ale možná se bojíš?',
  'Co máš dnes chuť udělat jinak?',
  'Udělej dnes něco samostatně bez pomoci maminky, tatínka nebo paní učitelky.',
  'Kdyby tvůj den začínal jako dobrodružství, co by bylo prvním krokem na cestě?',
  'Poděkuj dnes někomu, kdo si to zaslouží.',
  'Představ si, že máš kouzelný štětec, kterým můžeš malovat svůj den. Jaké barvy bys použil/a? Co bys namaloval/a?',
  'Jakou věc, kterou dnes uděláš, bys chtěl/a ukázat svému budoucímu já?',
  'Představ si, že jsi malé semínko, které roste. Co dnes potřebuješ, abys mohl/a vyrůst?',
  'Kdybych ti mohl/a dát kouzlo, které ti pomůže na něco se dnes soustředit, co by to bylo?',
  'Co můžeš dnes udělat, aby se tvůj svět stal krásnějším?',
  'Najdi jednu věc kolem sebe, která tě překvapí. Co jsi objevil/a?',
  'Co by tvé nejoblíbenější zvíře udělalo na tvém místě?',
  'Kdybys měl/a napsat dopis slunci, co bys mu chtěl/a říct?',
];

const EVENING_CARDS = [
  'Představ si, že tvůj sen je jako pohádka – co by se v něm mohlo stát, jaký hrdina by v něm byl a jaký úkol by měl splnit?',
  'Co se ti dnes líbilo?',
  'Co se ti dnes nelíbilo?',
  'Podívej se z okna a najdi hvězdu, která svítí jen pro tebe a vždy tě ochrání, takže se nemáš čeho bát.',
  'Co bylo dnes nejtěžší?',
  'Pusť si dnes s maminkou nebo tatínkem relaxační hudbu před spaním.',
  'Co bys dnes udělal/a jinak?',
  'Co by sis přál/a, aby se zítra stalo – měj to v srdíčku a mysli na to.',
  'Zavři oči a představ si, že pluješ na lodce snů. Kam by ses chtěl/a vydat?',
  'Představ si, že se každý hezký okamžik z dneška proměnil v hvězdu na noční obloze. Kolik jich vidíš?',
  'Kdybys mohl/a dnešku poděkovat za jednu věc, co by to bylo?',
  'Představ si, že všechny myšlenky, které ti dneska běžely hlavou, usínají s tebou. Co bys jim popřál/a na dobrou noc?',
  'Kdyby se tvůj sen mohl proměnit ve skutečnost, co by sis přál/a, aby se stalo?',
  'Co jsi dnes objevil/a o sobě, co tě potěšilo?',
  'Zkus zavřít oči a poslat jeden hezký pocit někomu, koho máš rád/a. Co bys mu řekl/a?',
  'Představ si, že se každá tvoje dnešní myšlenka promění v lístek do kouzelného lesa. Jaké by ten les měl barvy?',
  'Kdybys mohl/a snít o čemkoli, co by to bylo?',
  'Kdybys měl/a napsat o dnešku jednu větu do kouzelné knihy, co by to bylo?',
];

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
    const lastIndex = deck === 'morning' ? lastMorningIndex : lastEveningIndex;
    const cards = deck === 'morning' ? MORNING_CARDS : EVENING_CARDS;

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
                className={`${styles.cardSide} ${styles.cardFront} ${
                  drawnCard.deck === 'morning' ? styles.morningFront : styles.eveningFront
                }`}
              >
                <div className={styles.cardFrontContent}>
                  <span className={styles.cardTitle}>
                    {drawnCard.deck === 'morning' ? 'Jang' : 'Jin'}
                  </span>
                  <p className={styles.cardText}>{drawnCard.text}</p>
                </div>
                {drawnCard.deck === 'morning' ? (
                  <div className={styles.morningSparkles} />
                ) : (
                  <>
                    <div className={styles.eveningMoon}>&#127769;</div>
                    <div className={styles.eveningClouds}>&#9729;&#65039;</div>
                  </>
                )}
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
