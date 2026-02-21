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
    traits: 'Vzdy pozitivni, vesely, spolecensky, tymovy.',
    description: 'Bavi ostatni, rychle si dela kamarady, ma dobre napady.',
    strengths: 'Komunikace, humor, energie, tvorivost',
  },
  {
    type: 'cholerik',
    name: 'CHOLERIK',
    character: 'Stitch',
    color: '#3b82f6',
    icon: '\uD83D\uDC7E',
    traits: 'Silny, rychly, rozhodny.',
    description: 'Reaguje impulzivne, jde do akce, miluje vyzvy. Nekdy udela driv, nez premysli.',
    strengths: 'Odvaha, dynamika, vedeni, vykon',
  },
  {
    type: 'flegmatik',
    name: 'FLEGMATIK',
    character: 'Sonic',
    color: '#06b6d4',
    icon: '\uD83E\uDD94',
    traits: 'Klidny, pohodovy, vse pozoruje... ale kdyz je potreba, vystartuje.',
    description: 'Neleka se, nenecha se vyprovokovat, drzi si nadhled.',
    strengths: 'Vyrovnanost, trpelivost, vernost, rozvaha',
  },
  {
    type: 'melancholik',
    name: 'MELANCHOLIK',
    character: 'Wednesday Addams',
    color: '#a855f7',
    icon: '\uD83D\uDDA4',
    traits: 'Citliva, premysliva, introvertni, presna.',
    description: 'Ma rada svuj svet, detail, poradek a veci dotazene do konce.',
    strengths: 'Kreativita, disciplina, schopnost soustredeni',
  },
];

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'Kdyz prijdes na party, co udelás jako prvni?',
    options: [
      { text: 'Hned se dám do reci se vsemi!', type: 'sangvinik' },
      { text: 'Organizuji nejaky program nebo soutez.', type: 'cholerik' },
      { text: 'Najdu si klidne misto a pozoruji.', type: 'flegmatik' },
      { text: 'Hledam jednoho dobreho kamarada na povidani.', type: 'melancholik' },
    ],
  },
  {
    question: 'Ve skole dostanes tezky ukol. Co udelás?',
    options: [
      { text: 'Udelam z toho spolecny projekt se spoluzaky!', type: 'sangvinik' },
      { text: 'Hned se do toho pustim, chci byt prvni hotov.', type: 'cholerik' },
      { text: 'Klidne si to promyslim a postupne to udelam.', type: 'flegmatik' },
      { text: 'Pecelive si vse napromyslim a udelam to precizne.', type: 'melancholik' },
    ],
  },
  {
    question: 'Jaky film by sis vybral/a?',
    options: [
      { text: 'Komedii, kde se porad smejeme.', type: 'sangvinik' },
      { text: 'Akcni film s hrdinou, ktery zachrani svet.', type: 'cholerik' },
      { text: 'Dobrodruzi film o cestovani.', type: 'flegmatik' },
      { text: 'Tajemny pribeh s hlubokym smyslem.', type: 'melancholik' },
    ],
  },
  {
    question: 'Tvuj kamarad je smutny. Co udelás?',
    options: [
      { text: 'Rozveselim ho vtipem a navrhnu neco zabavneho.', type: 'sangvinik' },
      { text: 'Reknu mu, at se sebere a pomůžu mu to vyresit!', type: 'cholerik' },
      { text: 'Sednu si k nemu a proste tam budu.', type: 'flegmatik' },
      { text: 'Zeptam se, co se stalo, a pozorne posloucham.', type: 'melancholik' },
    ],
  },
  {
    question: 'Mas volny vikend. Co udelás?',
    options: [
      { text: 'Svolam vsechny kamarady a udelame velkou akci!', type: 'sangvinik' },
      { text: 'Zkusim neco noveho - sport, vyzvu, dobroduzstvi!', type: 'cholerik' },
      { text: 'Odpocinu si, prectu knizku, uziji si klid.', type: 'flegmatik' },
      { text: 'Budu tvorit - malovat, psat, nebo vymyslet neco.', type: 'melancholik' },
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
      <PlanetHeader name="Mali Hrdinove" icon="🦸" color="#10b981" />

      <div className={styles.content}>
        {/* Intro */}
        <div className={styles.intro}>
          <h2 className={styles.introTitle}>Mali Hrdinove - Kdo jsi ty?</h2>
          <p className={styles.introText}>
            Kazdy z nas ma vsechny ctyri postavicky. A vsechny jsou v poradku! Ale jedna nebo dve vzdy prevazuji - u tebe i u tvych kamaradu, rodicu, ucitelu. A je fajn to vedet.
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
                      Silne stranky:
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
                {expandedCard === p.type ? 'Klikni pro zavreni' : 'Klikni pro vice'}
              </span>
            </div>
          ))}
        </div>

        {/* Quiz section */}
        <div className={styles.quizSection}>
          {!showQuiz && !quizResult && (
            <button className={styles.startQuizBtn} onClick={startQuiz}>
              &#127919; Ktery hrdina jsi ty? Zjisti to!
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
                  Tvuj hrdina: {resultPersonality.character}
                </p>
                <p className={styles.resultTraits}>{resultPersonality.traits}</p>
                <p className={styles.resultDescription}>{resultPersonality.description}</p>
                <div className={styles.resultStrengths}>
                  <span
                    className={styles.strengthsLabel}
                    style={{ color: resultPersonality.color }}
                  >
                    Tve superschopnosti:
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
