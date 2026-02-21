import { useState, useEffect, useRef } from 'react';
import PlanetHeader from '../../components/common/PlanetHeader';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { AFFIRMATIONS, JOY_CARDS } from '../../data/planets';
import styles from './AntiStress.module.css';

/* -------------------------------------------------------
   Types
   ------------------------------------------------------- */

type SubPlanet = 'meditace' | 'dychani' | 'afirmace' | 'radost' | 'talisman';

interface Talisman {
  id: string;
  shape: 'circle' | 'star' | 'heart' | 'diamond';
  color: string;
  emoji: string;
  text: string;
  createdAt: string;
}

const SUB_PLANETS: { key: SubPlanet; label: string; color: string; emoji: string }[] = [
  { key: 'meditace', label: 'Meditace', color: '#7b68ee', emoji: '\uD83E\uDDD8' },
  { key: 'dychani', label: 'Dychani', color: '#48d1cc', emoji: '\uD83C\uDF2C\uFE0F' },
  { key: 'afirmace', label: 'Afirmace', color: '#ff69b4', emoji: '\uD83D\uDCAB' },
  { key: 'radost', label: 'Radostne karticky', color: '#ffd700', emoji: '\uD83C\uDF1E' },
  { key: 'talisman', label: 'Talisman', color: '#ff6b6b', emoji: '\uD83D\uDD2E' },
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* -------------------------------------------------------
   Main Component
   ------------------------------------------------------- */

export default function AntiStress() {
  const [activeSection, setActiveSection] = useState<SubPlanet | null>(null);

  return (
    <div className={styles.container}>
      <PlanetHeader name="Antistresova planeta" icon="\uD83E\uDDD8" color="#98FB98" />

      <div className={styles.content}>
        {!activeSection ? (
          <SubPlanetMenu onSelect={setActiveSection} />
        ) : (
          <div className={styles.sectionWrapper}>
            <button
              className={styles.sectionBack}
              onClick={() => setActiveSection(null)}
            >
              {'\u2190'} Zpet
            </button>
            {activeSection === 'meditace' && <Meditace />}
            {activeSection === 'dychani' && <Dychani />}
            {activeSection === 'afirmace' && <AfirmaceSection />}
            {activeSection === 'radost' && <RadostSection />}
            {activeSection === 'talisman' && <TalismanSection />}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   Sub-Planet Menu
   ------------------------------------------------------- */

function SubPlanetMenu({ onSelect }: { onSelect: (s: SubPlanet) => void }) {
  return (
    <div className={styles.menuWrapper}>
      <p className={styles.menuIntro}>
        Vyber si svou antistresovou aktivitu
      </p>
      <div className={styles.moonGrid}>
        {SUB_PLANETS.map((sp, i) => (
          <button
            key={sp.key}
            className={styles.moonButton}
            style={{
              '--moon-color': sp.color,
              animationDelay: `${i * 0.1}s`,
            } as React.CSSProperties}
            onClick={() => onSelect(sp.key)}
          >
            <div
              className={styles.moonOrb}
              style={{ background: `radial-gradient(circle at 35% 35%, ${sp.color}, ${sp.color}88, ${sp.color}44)` }}
            >
              <span className={styles.moonEmoji}>{sp.emoji}</span>
            </div>
            <span className={styles.moonLabel}>{sp.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   1. Meditace (Meditation)
   ------------------------------------------------------- */

function Meditace() {
  const TIMER_OPTIONS = [
    { label: '1 min', seconds: 60 },
    { label: '2 min', seconds: 120 },
    { label: '3 min', seconds: 180 },
    { label: '5 min', seconds: 300 },
  ];

  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = (seconds: number) => {
    setSelectedTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setSelectedTime(null);
    setTimeLeft(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft > 0]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = selectedTime ? 1 - timeLeft / selectedTime : 0;

  return (
    <div className={styles.meditace}>
      <h2 className={styles.sectionTitle}>{'\uD83E\uDDD8'} Meditace</h2>

      {!isRunning && timeLeft === 0 ? (
        <>
          <p className={styles.sectionDesc}>
            Zavri oci, dychej a poslouchej...
          </p>
          <div className={styles.timerOptions}>
            {TIMER_OPTIONS.map((opt) => (
              <button
                key={opt.seconds}
                className={styles.timerOptionBtn}
                onClick={() => startTimer(opt.seconds)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      ) : timeLeft === 0 && !isRunning ? (
        <div className={styles.meditaceDone}>
          <span className={styles.doneEmoji}>{'\u2728'}</span>
          <p className={styles.doneText}>Skvele! Meditace je u konce.</p>
          <button className={styles.resetBtn} onClick={stopTimer}>
            Znovu
          </button>
        </div>
      ) : (
        <div className={styles.meditaceActive}>
          <div className={styles.breathCircleWrapper}>
            <div
              className={styles.meditaceCircle}
              style={{
                transform: `scale(${0.6 + progress * 0.4})`,
                opacity: 0.5 + progress * 0.5,
              }}
            />
          </div>
          <p className={styles.timerText}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
          <p className={styles.meditaceHint}>Zavri oci a dychej klidne...</p>
          <button className={styles.stopBtn} onClick={stopTimer}>
            Ukoncit
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   2. Dychani (Breathing)
   ------------------------------------------------------- */

function Dychani() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);
  const phaseRef = useRef<'inhale' | 'exhale'>('inhale');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    phaseRef.current = 'inhale';
    setIsActive(true);
    setPhase('inhale');
    setCountdown(4);
    setCycles(0);
  };

  const stop = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(4);
    phaseRef.current = 'inhale';
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (!isActive) return;

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Switch phase
          const currentPhase = phaseRef.current;
          if (currentPhase === 'inhale') {
            phaseRef.current = 'exhale';
            setPhase('exhale');
            return 6; // exhale duration
          } else {
            phaseRef.current = 'inhale';
            setPhase('inhale');
            setCycles((c) => c + 1);
            return 4; // inhale duration
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  return (
    <div className={styles.dychani}>
      <h2 className={styles.sectionTitle}>{'\uD83C\uDF2C\uFE0F'} Dychani</h2>

      {!isActive ? (
        <>
          <p className={styles.sectionDesc}>
            Dychej se mnou: 4 sekundy nadech, 6 sekund vydech
          </p>
          <button className={styles.startBreathBtn} onClick={start}>
            Zacit dychat
          </button>
        </>
      ) : (
        <div className={styles.breathActive}>
          <div className={styles.breathCircleWrapper}>
            <div
              className={`${styles.breathCircle} ${
                phase === 'inhale' ? styles.breathInhale : styles.breathExhale
              }`}
            />
            <span className={styles.breathCountdown}>{countdown}</span>
          </div>
          <p className={styles.breathPhaseText}>
            {phase === 'inhale' ? 'Nadech nosem...' : 'Vydech nosem...'}
          </p>
          <p className={styles.breathCycles}>
            Dokonceno cyklu: {cycles}
          </p>
          <button className={styles.stopBtn} onClick={stop}>
            Ukoncit
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   3. Afirmace (Affirmations)
   ------------------------------------------------------- */

function AfirmaceSection() {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * AFFIRMATIONS.length)
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const nextAffirmation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      let newIndex: number;
      do {
        newIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
      } while (newIndex === currentIndex && AFFIRMATIONS.length > 1);
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={styles.afirmace}>
      <h2 className={styles.sectionTitle}>{'\uD83D\uDCAB'} Afirmace</h2>
      <p className={styles.sectionDesc}>Precti si a opakuj si v duchu:</p>

      <div className={`${styles.affirmationCard} ${isAnimating ? styles.affirmationOut : ''}`}>
        <p className={styles.affirmationText}>{AFFIRMATIONS[currentIndex]}</p>
      </div>

      <button className={styles.nextCardBtn} onClick={nextAffirmation}>
        Dalsi afirmace
      </button>
    </div>
  );
}

/* -------------------------------------------------------
   4. Radostne karticky (Joy Cards)
   ------------------------------------------------------- */

function RadostSection() {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * JOY_CARDS.length)
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const nextCard = () => {
    setIsAnimating(true);
    setTimeout(() => {
      let newIndex: number;
      do {
        newIndex = Math.floor(Math.random() * JOY_CARDS.length);
      } while (newIndex === currentIndex && JOY_CARDS.length > 1);
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={styles.radost}>
      <h2 className={styles.sectionTitle}>{'\uD83C\uDF1E'} Radostne karticky</h2>
      <p className={styles.sectionDesc}>Otevri si karticky plne radosti:</p>

      <div className={`${styles.joyCard} ${isAnimating ? styles.joyCardOut : ''}`}>
        <p className={styles.joyCardText}>{JOY_CARDS[currentIndex]}</p>
      </div>

      <button className={styles.nextCardBtn} onClick={nextCard}>
        Dalsi karticka
      </button>
    </div>
  );
}

/* -------------------------------------------------------
   5. Talisman
   ------------------------------------------------------- */

const TALISMAN_SHAPES: { key: Talisman['shape']; label: string; emoji: string }[] = [
  { key: 'circle', label: 'Kruh', emoji: '\u2B55' },
  { key: 'star', label: 'Hvezda', emoji: '\u2B50' },
  { key: 'heart', label: 'Srdce', emoji: '\u2764\uFE0F' },
  { key: 'diamond', label: 'Diamant', emoji: '\uD83D\uDD37' },
];

const TALISMAN_COLORS = [
  '#ff6b6b', '#ffd700', '#48d1cc', '#7b68ee',
  '#ff69b4', '#98fb98', '#ff8c00', '#87ceeb',
  '#dda0dd', '#ffffff',
];

const TALISMAN_EMOJIS = [
  '\u2B50', '\u2764\uFE0F', '\uD83C\uDF1F', '\uD83D\uDD25',
  '\uD83C\uDF08', '\uD83E\uDD8B', '\uD83C\uDF3B', '\uD83D\uDE80',
  '\uD83D\uDC8E', '\uD83C\uDF40', '\u2728', '\uD83C\uDF19',
];

function TalismanSection() {
  const [talismans, setTalismans] = useLocalStorage<Talisman[]>('antistress_talismans', []);
  const [shape, setShape] = useState<Talisman['shape']>('circle');
  const [color, setColor] = useState('#ffd700');
  const [emoji, setEmoji] = useState('\u2B50');
  const [text, setText] = useState('');
  const [showSaved, setShowSaved] = useState(false);

  const saveTalisman = () => {
    const newTalisman: Talisman = {
      id: generateId(),
      shape,
      color,
      emoji,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setTalismans((prev) => [newTalisman, ...prev]);
    setText('');
  };

  const deleteTalisman = (id: string) => {
    setTalismans((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className={styles.talisman}>
      <h2 className={styles.sectionTitle}>{'\uD83D\uDD2E'} Talisman</h2>
      <p className={styles.sectionDesc}>
        Vytvor si talisman pro stesti!
      </p>

      {!showSaved ? (
        <>
          {/* Preview */}
          <div className={styles.talismanPreview}>
            <div
              className={`${styles.talismanShape} ${styles[`shape_${shape}`]}`}
              style={{
                borderColor: color,
                boxShadow: `0 0 30px ${color}66, 0 0 60px ${color}33`,
              }}
            >
              <span className={styles.talismanEmoji}>{emoji}</span>
              {text && <span className={styles.talismanText} style={{ color }}>{text}</span>}
            </div>
          </div>

          {/* Shape selector */}
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>Tvar</label>
            <div className={styles.optionRow}>
              {TALISMAN_SHAPES.map((s) => (
                <button
                  key={s.key}
                  className={`${styles.optionBtn} ${shape === s.key ? styles.optionActive : ''}`}
                  onClick={() => setShape(s.key)}
                  type="button"
                >
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color selector */}
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>Barva</label>
            <div className={styles.colorRow}>
              {TALISMAN_COLORS.map((c) => (
                <button
                  key={c}
                  className={`${styles.colorBtn} ${color === c ? styles.colorActive : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  type="button"
                  aria-label={c}
                />
              ))}
            </div>
          </div>

          {/* Emoji selector */}
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>Symbol</label>
            <div className={styles.optionRow}>
              {TALISMAN_EMOJIS.map((e) => (
                <button
                  key={e}
                  className={`${styles.emojiBtn} ${emoji === e ? styles.emojiBtnActive : ''}`}
                  onClick={() => setEmoji(e)}
                  type="button"
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Text input */}
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>Text / slovo</label>
            <input
              className={styles.talismanInput}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tvoje magicke slovo..."
              maxLength={20}
            />
          </div>

          <div className={styles.talismanActions}>
            <button className={styles.saveTalismanBtn} onClick={saveTalisman}>
              Ulozit talisman
            </button>
            {talismans.length > 0 && (
              <button
                className={styles.showSavedBtn}
                onClick={() => setShowSaved(true)}
              >
                Moje talismany ({talismans.length})
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <button
            className={styles.backToCreatorBtn}
            onClick={() => setShowSaved(false)}
          >
            {'\u2190'} Zpet na tvorbu
          </button>
          <div className={styles.savedGrid}>
            {talismans.map((t) => (
              <div key={t.id} className={styles.savedTalisman}>
                <div
                  className={`${styles.talismanShapeSmall} ${styles[`shape_${t.shape}`]}`}
                  style={{
                    borderColor: t.color,
                    boxShadow: `0 0 16px ${t.color}44`,
                  }}
                >
                  <span className={styles.talismanEmojiSmall}>{t.emoji}</span>
                  {t.text && (
                    <span className={styles.talismanTextSmall} style={{ color: t.color }}>
                      {t.text}
                    </span>
                  )}
                </div>
                <button
                  className={styles.deleteTalismanBtn}
                  onClick={() => deleteTalisman(t.id)}
                  aria-label="Smazat"
                >
                  {'\u2715'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
