import { useApp } from '../../context/AppContext';
import { PLANETS } from '../../data/planets';
import type { Planet } from '../../types';
import StarField from './StarField';
import styles from './Universe.module.css';

/** Scale factor applied to orbit radii so the solar system fits on small screens. */
const ORBIT_SCALE = 0.55;

/** Minimum touch-target size in px (accessibility). */
const MIN_TOUCH_SIZE = 44;

function PlanetNode({ planet }: { planet: Planet }) {
  const { startTravel } = useApp();

  const orbitDiameter = planet.orbitRadius * 2 * ORBIT_SCALE;
  const orbitDuration = `${planet.speed > 0 ? 1 / planet.speed : 60}s`;
  const planetSize = Math.max(planet.size * ORBIT_SCALE, MIN_TOUCH_SIZE);

  // Random initial rotation so planets don't all start at the top
  const initialRotation = Math.floor(Math.random() * 360);

  return (
    <>
      {/* Dashed orbit ring */}
      <div
        className={styles.orbitRing}
        style={{
          width: orbitDiameter,
          height: orbitDiameter,
          top: `calc(50% - ${orbitDiameter / 2}px)`,
          left: `calc(50% - ${orbitDiameter / 2}px)`,
        }}
      />

      {/* Rotating orbit wrapper */}
      <div
        className={styles.orbit}
        style={{
          width: orbitDiameter,
          height: orbitDiameter,
          top: `calc(50% - ${orbitDiameter / 2}px)`,
          left: `calc(50% - ${orbitDiameter / 2}px)`,
          animationDuration: orbitDuration,
          transform: `rotate(${initialRotation}deg)`,
        }}
      >
        {/* The planet itself, placed at the top of the orbit */}
        <button
          className={styles.planet}
          onClick={() => startTravel(planet.id)}
          aria-label={`${planet.name} - ${planet.description}`}
          style={{
            width: planetSize,
            height: planetSize,
            marginLeft: -(planetSize / 2),
            marginTop: -(planetSize / 2),
            background: `radial-gradient(circle at 35% 35%, ${lighten(planet.color, 40)}, ${planet.color} 60%, ${darken(planet.color, 30)})`,
            boxShadow: `0 0 ${planetSize * 0.4}px ${planetSize * 0.15}px ${planet.color}44`,
            animationDuration: orbitDuration,
          }}
        >
          {/* Hover glow */}
          <div
            className={styles.planetGlow}
            style={{
              boxShadow: `0 0 ${planetSize * 0.6}px ${planetSize * 0.25}px ${planet.color}88`,
            }}
          />

          {/* Emoji icon */}
          <span role="img" aria-hidden="true">
            {planet.icon}
          </span>

          {/* Tooltip */}
          <span className={styles.planetTooltip}>{planet.name}</span>
        </button>
      </div>
    </>
  );
}

export default function Universe() {
  const { state } = useApp();

  const travelTarget = state.travelingTo
    ? PLANETS.find((p) => p.id === state.travelingTo)
    : null;

  return (
    <div className={styles.universe}>
      <StarField starCount={180} />

      {/* Title */}
      <div className={styles.title}>
        <h1 className={styles.titleText}>Planetky</h1>
        {state.profile && (
          <p className={styles.subtitle}>
            Ahoj, {state.profile.name}! Vyber si planetu.
          </p>
        )}
      </div>

      {/* Solar system */}
      <div className={styles.solarSystem}>
        <div className={styles.sun} aria-label="Slunce" />
        {PLANETS.map((planet) => (
          <PlanetNode key={planet.id} planet={planet} />
        ))}
      </div>

      {/* Traveling overlay */}
      {state.travelingTo && travelTarget && (
        <div className={styles.travelOverlay}>
          <span className={styles.travelRocket} role="img" aria-label="Raketa">
            🚀
          </span>
          <span className={styles.travelText}>
            Letíme na {travelTarget.name}...
          </span>
        </div>
      )}
    </div>
  );
}

/* ---- Colour helpers (avoid external deps) ---- */

function lighten(hex: string, percent: number): string {
  return adjustColor(hex, percent);
}

function darken(hex: string, percent: number): string {
  return adjustColor(hex, -percent);
}

function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + Math.round(2.55 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + Math.round(2.55 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0xff) + Math.round(2.55 * percent)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
