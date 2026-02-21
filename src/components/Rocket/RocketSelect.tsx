import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { RocketType } from '../../types';
import StarField from '../Universe/StarField';
import styles from './RocketSelect.module.css';

interface RocketOption {
  type: RocketType;
  name: string;
  subtitle: string;
  icon: string;
  colorClass: string;
}

const ROCKETS: RocketOption[] = [
  {
    type: 'rocket-girl',
    name: 'Hvězdná',
    subtitle: 'Hvězdná raketa',
    icon: '🚀',
    colorClass: styles.colorPink,
  },
  {
    type: 'rocket-boy',
    name: 'Kosmická',
    subtitle: 'Kosmická raketa',
    icon: '🚀',
    colorClass: styles.colorBlue,
  },
  {
    type: 'rocket-star',
    name: 'Sluneční',
    subtitle: 'Sluneční raketa',
    icon: '🚀',
    colorClass: styles.colorOrange,
  },
  {
    type: 'rocket-cosmic',
    name: 'Galaxie',
    subtitle: 'Galaktická raketa',
    icon: '🚀',
    colorClass: styles.colorPurple,
  },
];

export default function RocketSelect() {
  const { setProfile, navigateTo } = useApp();
  const [selected, setSelected] = useState<RocketType | null>(null);
  const [playerName, setPlayerName] = useState('');

  const handleConfirm = () => {
    if (selected) {
      setProfile({
        name: playerName.trim() || 'Astronaut',
        rocketType: selected,
        createdAt: new Date().toISOString(),
      });
      navigateTo('universe');
    }
  };

  return (
    <div className={styles.container}>
      <StarField starCount={100} />

      <h1 className={styles.heading}>Vítej ve vesmíru!</h1>
      <p className={styles.subheading}>Jak se jmenuješ, astronaute?</p>

      <input
        className={styles.nameInput}
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Tvoje jméno..."
        maxLength={30}
      />

      <p className={styles.subheading}>Vyber si svou raketu</p>

      <div className={styles.grid}>
        {ROCKETS.map((rocket) => {
          const isSelected = selected === rocket.type;

          return (
            <button
              key={rocket.type}
              className={`${styles.card} ${rocket.colorClass} ${isSelected ? styles.cardSelected : ''}`}
              onClick={() => setSelected(rocket.type)}
              aria-pressed={isSelected}
              aria-label={`${rocket.name} - ${rocket.subtitle}`}
            >
              <span className={styles.rocketIcon} role="img" aria-hidden="true">
                {rocket.icon}
              </span>
              <span className={styles.rocketName}>{rocket.name}</span>
              <span className={styles.rocketSub}>{rocket.subtitle}</span>
            </button>
          );
        })}
      </div>

      <button
        className={styles.confirmBtn}
        disabled={!selected}
        onClick={handleConfirm}
      >
        Vstoupit do vesmíru
      </button>
    </div>
  );
}
