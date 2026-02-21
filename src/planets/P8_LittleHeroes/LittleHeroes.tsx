import { useState } from 'react';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { PersonalityType } from '../../types';
import styles from './LittleHeroes.module.css';

interface PersonalityCard {
  type: PersonalityType;
  name: string;
  character: string;
  color: string;
  icon: string;
  traits: string;
  description: string;
  strengths: string;
}

interface QuizQuestion {
  question: string;
  options: { text: string; type: PersonalityType }[];
}

const PERSONALITIES: PersonalityCard[] = [
  {
    type: 'sangvinik',
    name: 'SANGVINIK',
    character: 'Mickey Mouse',
    color: '#facc15',
    icon: '\uD83D\uDC2D',
    traits: 'Vždy pozitivní, veselý, společenský, týmový.',
    description: 'Baví ostatní, rychle si dělá kamarády, má dobré nápady.',
    strengths: 'Komunikace, humor, energie, tvořivost',
  },
  {
    type: 'cholerik',
    name: 'CHOLERIK',
    character: 'Stitch',
    color: '#3b82f6',
    icon: '\uD83D\uDC7E',
    traits: 'Silný, rychlý, rozhodný.',
    description: 'Reaguje impulzivně, jde do akce, miluje výzvy. Někdy udělá dřív, než přemýšlí.',
    strengths: 'Odvaha, dynamika, vedení, výkon',
  },
  {
    type: 'flegmatik',
    name: 'FLEGMATIK',
    character: 'Sonic',
    color: '#06b6d4',
    icon: '\uD83E\uDD94',
    traits: 'Klidný, pohodový, vše pozoruje... ale když je potřeba, vystartuje.',
    description: 'Neleká se, nenechá se vyprovokovat, drží si nadhled.',
    strengths: 'Vyrovnanost, trpělivost, věrnost, rozvaha',
  },
  {
    type: 'melancholik',
    name: 'MELANCHOLIK',
    character: 'Wednesday Addams',
    color: '#a855f7',
    icon: '\uD83D\uDDA4',
    traits: 'Citlivá, přemýšlivá, introvertní, přesná.',
    description: 'Má ráda svůj svět, detaily, pořádek a věci dotažené do konce.',
    strengths: 'Kreativita, disciplína, schopnost soustředění',
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Když přijdeš na párty, co uděláš jako první?',
    options: [
      { text: 'Hned se dám do řeči se všemi!', type: 'sangvinik' },
      { text: 'Organizuji nějaký program nebo soutěž.', type: 'cholerik' },
      { text: 'Najdu si klidné místo a pozoruji.', type: 'flegmatik' },
      { text: 'Hledám jednoho dobrého kamaráda na povídání.', type: 'melancholik' },
    ],
  },
  {
    question: 'Ve škole dostaneš těžký úkol. Co uděláš?',
    options: [
      { text: 'Udělám z toho společný projekt se spolužáky!', type: 'sangvinik' },
      { text: 'Hned se do toho pustím, chci být první hotov.', type: 'cholerik' },
      { text: 'Klidně si to promyslím a postupně to udělám.', type: 'flegmatik' },
      { text: 'Pečlivě si vše promyslím a udělám to precizně.', type: 'melancholik' },
    ],
  },
  {
    question: 'Jaký film by sis vybral/a?',
    options: [
      { text: 'Komedii, kde se pořád smějeme.', type: 'sangvinik' },
      { text: 'Akční film s hrdinou, který zachrání svět.', type: 'cholerik' },
      { text: 'Dobrodružný film o cestování.', type: 'flegmatik' },
      { text: 'Tajemný příběh s hlubokým smyslem.', type: 'melancholik' },
    ],
  },
  {
    question: 'Tvůj kamarád je smutný. Co uděláš?',
    options: [
      { text: 'Rozveselím ho vtipem a navrhnu něco zábavného.', type: 'sangvinik' },
      { text: 'Řeknu mu, ať se sebere a pomůžu mu to vyřešit!', type: 'cholerik' },
      { text: 'Sednu si k němu a prostě tam budu.', type: 'flegmatik' },
      { text: 'Zeptám se, co se stalo, a pozorně poslouchám.', type: 'melancholik' },
    ],
  },
  {
    question: 'Máš volný víkend. Co uděláš?',
    options: [
      { text: 'Svolám všechny kamarády a uděláme velkou akci!', type: 'sangvinik' },
      { text: 'Zkusím něco nového - sport, výzvu, dobrodružství!', type: 'cholerik' },
      { text: 'Odpočinu si, přečtu knížku, užiji si klid.', type: 'flegmatik' },
      { text: 'Budu tvořit - malovat, psát, nebo vymyslet něco.', type: 'melancholik' },
    ],
  },
];

export default function LittleHeroes() {
  const [expandedCard, setExpandedCard] = useState<PersonalityType | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<PersonalityType[]>([]);
  const [quizResult, setQuizResult] = useLocalStorage<PersonalityType | null>('heroes_quizResult', null);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleCardClick = (type: PersonalityType) => {
    setExpandedCard(expandedCard === type ? null : type);
  };

  const startQuiz = () => {
    setShowQuiz(true);
    setQuizStep(0);
    setQuizAnswers([]);
    setQuizResult(null);
    setShowCelebration(false);
  };

  const handleQuizAnswer = (type: PersonalityType) => {
    const newAnswers = [...quizAnswers, type];
    setQuizAnswers(newAnswers);

    if (quizStep < QUIZ_QUESTIONS.length - 1) {
      setQuizStep(prev => prev + 1);
    } else {
      // Calculate result
      const counts: Record<PersonalityType, number> = {
        sangvinik: 0,
        cholerik: 0,
        flegmatik: 0,
        melancholik: 0,
      };
      newAnswers.forEach(a => counts[a]++);
      const result = (Object.entries(counts) as [PersonalityType, number][])
        .sort((a, b) => b[1] - a[1])[0][0];
      setQuizResult(result);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 4000);
    }
  };

  const resultPersonality = PERSONALITIES.find(p => p.type === quizResult);

  return (
    <div className={styles.container}>
      <PlanetHeader name="Malí Hrdinové" icon="🦸" color="#10b981" />

      <div className={styles.content}>
        {/* Intro */}
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>Malí Hrdinové - Kdo jsi ty?</h2>
          <p className={styles.introText}>
            Každý z nás má všechny čtyři postavičky. A všechny jsou v pořádku! Ale jedna nebo dvě vždy převažují - u tebe i u tvých kamarádů, rodičů, učitelů. A je fajn to vědět.
          </p>
        </div>

        {/* Personality Cards */}
        <div className={styles.cardsGrid}>
          {PERSONALITIES.map(p => (
            <div
              key={p.type}
              className={`${styles.personalityCard} ${expandedCard === p.type ? styles.personalityCardExpanded : ''}`}
              style={{
                borderColor: expandedCard === p.type ? p.color : `${p.color}40`,
                boxShadow: expandedCard === p.type ? `0 0 30px ${p.color}30` : 'none',
              }}
              onClick={() => handleCardClick(p.type)}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>{p.icon}</span>
                <div>
                  <h3 className={styles.cardName} style={{ color: p.color }}>{p.name}</h3>
                  <span className={styles.cardCharacter}>{p.character}</span>
                </div>
              </div>

              <p className={styles.cardTraits}>{p.traits}</p>

              {expandedCard === p.type && (
                <div className={styles.cardExpanded}>
                  <div className={styles.cardDivider} style={{ backgroundColor: p.color }} />
                  <p className={styles.cardDescription}>{p.description}</p>
                  <div className={styles.cardStrengths}>
                    <span className={styles.strengthsLabel} style={{ color: p.color }}>
                      Silné stránky:
                    </span>
                    <div className={styles.strengthTags}>
                      {p.strengths.split(', ').map(s => (
                        <span
                          key={s}
                          className={styles.strengthTag}
                          style={{ borderColor: `${p.color}60`, color: p.color }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <span className={styles.expandHint}>
                {expandedCard === p.type ? 'Klikni pro zavření' : 'Klikni pro více'}
              </span>
            </div>
          ))}
        </div>

        {/* Quiz section */}
        <div className={styles.quizSection}>
          {!showQuiz && !quizResult && (
            <button className={styles.startQuizBtn} onClick={startQuiz}>
              &#127919; Který hrdina jsi ty? Zjisti to!
            </button>
          )}

          {showQuiz && !quizResult && (
            <div className={styles.quizCard}>
              <div className={styles.quizProgress}>
                <div className={styles.quizProgressBar}>
                  <div
                    className={styles.quizProgressFill}
                    style={{ width: `${((quizStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>
                <span className={styles.quizProgressText}>
                  {quizStep + 1} / {QUIZ_QUESTIONS.length}
                </span>
              </div>

              <h3 className={styles.quizQuestion}>
                {QUIZ_QUESTIONS[quizStep].question}
              </h3>

              <div className={styles.quizOptions}>
                {QUIZ_QUESTIONS[quizStep].options.map((option, i) => (
                  <button
                    key={i}
                    className={styles.quizOption}
                    onClick={() => handleQuizAnswer(option.type)}
                  >
                    <span className={styles.optionLetter}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizResult && resultPersonality && (
            <div className={styles.resultSection}>
              {showCelebration && (
                <div className={styles.celebration}>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span
                      key={i}
                      className={styles.confetti}
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${2 + Math.random() * 2}s`,
                        backgroundColor: ['#facc15', '#3b82f6', '#06b6d4', '#a855f7', '#ef4444', '#10b981'][Math.floor(Math.random() * 6)],
                      }}
                    />
                  ))}
                  <div className={styles.celebrationStars}>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span
                        key={i}
                        className={styles.celebStar}
                        style={{
                          left: `${10 + Math.random() * 80}%`,
                          top: `${10 + Math.random() * 80}%`,
                          animationDelay: `${Math.random() * 1.5}s`,
                          fontSize: `${1.5 + Math.random() * 2}rem`,
                        }}
                      >
                        &#10022;
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={styles.resultCard}
                style={{
                  borderColor: resultPersonality.color,
                  boxShadow: `0 0 40px ${resultPersonality.color}30`,
                }}
              >
                <span className={styles.resultIcon}>{resultPersonality.icon}</span>
                <h2 className={styles.resultTitle} style={{ color: resultPersonality.color }}>
                  Jsi {resultPersonality.name}!
                </h2>
                <p className={styles.resultCharacter}>
                  Tvůj hrdina: {resultPersonality.character}
                </p>
                <p className={styles.resultTraits}>{resultPersonality.traits}</p>
                <p className={styles.resultDescription}>{resultPersonality.description}</p>
                <div className={styles.resultStrengths}>
                  <span
                    className={styles.strengthsLabel}
                    style={{ color: resultPersonality.color }}
                  >
                    Tvé superschopnosti:
                  </span>
                  <div className={styles.strengthTags}>
                    {resultPersonality.strengths.split(', ').map(s => (
                      <span
                        key={s}
                        className={styles.strengthTag}
                        style={{
                          borderColor: `${resultPersonality.color}60`,
                          color: resultPersonality.color,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button className={styles.retakeBtn} onClick={startQuiz}>
                &#128260; Zkusit znovu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
