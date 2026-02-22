import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PLANETS } from '../../data/planets';
import type { PlanetId } from '../../types';
import StarField from './StarField';
import styles from './Universe.module.css';

/** Static planet positions as fractions of the viewport (0..1). */
const PLANET_POSITIONS: { id: PlanetId; x: number; y: number }[] = [
  { id: 'cards',       x: 0.14, y: 0.18 },
  { id: 'dreamboard',  x: 0.80, y: 0.13 },
  { id: 'subject',     x: 0.09, y: 0.52 },
  { id: 'antistress',  x: 0.50, y: 0.25 },
  { id: 'future-self', x: 0.87, y: 0.48 },
  { id: 'inventions',  x: 0.22, y: 0.78 },
  { id: 'giving',      x: 0.70, y: 0.72 },
  { id: 'heroes',      x: 0.46, y: 0.90 },
];

const ROCKET_SPEED = 4;
const LAND_DISTANCE = 75;
const PLANET_SIZE = 64;

const ROCKET_COLORS: Record<string, string> = {
  'rocket-girl': '#ff6eb4',
  'rocket-boy': '#22d3ee',
  'rocket-star': '#fbbf24',
  'rocket-cosmic': '#a78bfa',
};

export default function Universe() {
  const { state, navigateTo } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const rocketElRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef(new Set<string>());
  const posRef = useRef({ x: 0, y: 0 });
  const angleRef = useRef(-45);
  const nearRef = useRef<PlanetId | null>(null);
  const navigateRef = useRef(navigateTo);
  navigateRef.current = navigateTo;

  const [nearPlanet, setNearPlanet] = useState<PlanetId | null>(null);
  const animRef = useRef(0);

  const rocketColor = ROCKET_COLORS[state.profile?.rocketType ?? 'rocket-boy'];

  // Initialize rocket position at center
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    posRef.current = { x: c.clientWidth / 2, y: c.clientHeight / 2 };
    const el = rocketElRef.current;
    if (el) {
      el.style.left = `${posRef.current.x}px`;
      el.style.top = `${posRef.current.y}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${angleRef.current}deg)`;
    }
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const k = e.key;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(k)) {
        e.preventDefault();
        keysRef.current.add(k);
      }
      if ((k === 'Enter' || k === ' ') && nearRef.current) {
        e.preventDefault();
        navigateRef.current(nearRef.current);
      }
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const tick = () => {
      const c = containerRef.current;
      if (!c) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }

      const keys = keysRef.current;
      let dx = 0, dy = 0;
      if (keys.has('ArrowLeft') || keys.has('a')) dx -= 1;
      if (keys.has('ArrowRight') || keys.has('d')) dx += 1;
      if (keys.has('ArrowUp') || keys.has('w')) dy -= 1;
      if (keys.has('ArrowDown') || keys.has('s')) dy += 1;

      // Move rocket
      if (dx !== 0 || dy !== 0) {
        const len = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / len) * ROCKET_SPEED;
        dy = (dy / len) * ROCKET_SPEED;

        const w = c.clientWidth;
        const h = c.clientHeight;
        posRef.current.x = Math.max(20, Math.min(w - 20, posRef.current.x + dx));
        posRef.current.y = Math.max(20, Math.min(h - 20, posRef.current.y + dy));
        angleRef.current = Math.atan2(dy, dx) * (180 / Math.PI) + 45;

        const el = rocketElRef.current;
        if (el) {
          el.style.left = `${posRef.current.x}px`;
          el.style.top = `${posRef.current.y}px`;
          el.style.transform = `translate(-50%, -50%) rotate(${angleRef.current}deg)`;
        }
      }

      // Proximity check
      const w = c.clientWidth;
      const h = c.clientHeight;
      let closest: PlanetId | null = null;
      let closestDist = Infinity;
      for (const p of PLANET_POSITIONS) {
        const px = p.x * w;
        const py = p.y * h;
        const dist = Math.hypot(posRef.current.x - px, posRef.current.y - py);
        if (dist < LAND_DISTANCE && dist < closestDist) {
          closest = p.id;
          closestDist = dist;
        }
      }
      if (closest !== nearRef.current) {
        nearRef.current = closest;
        setNearPlanet(closest);
      }

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const nearData = nearPlanet ? PLANETS.find((p) => p.id === nearPlanet) : null;
  const nearLayout = nearPlanet
    ? PLANET_POSITIONS.find((p) => p.id === nearPlanet)
    : null;

  return (
    <div className={styles.universe} ref={containerRef}>
      <StarField starCount={180} />

      {/* Title */}
      <div className={styles.title}>
        <h1 className={styles.titleText}>Planetky</h1>
        {state.profile && (
          <p className={styles.subtitle}>
            Ahoj, {state.profile.name}! Leť šipkami k planetám.
          </p>
        )}
      </div>

      {/* Static planets */}
      {PLANET_POSITIONS.map((layout, i) => {
        const planet = PLANETS.find((p) => p.id === layout.id)!;
        const isNear = nearPlanet === planet.id;

        return (
          <div
            key={planet.id}
            className={`${styles.planet} ${isNear ? styles.planetNear : ''}`}
            style={{
              left: `${layout.x * 100}%`,
              top: `${layout.y * 100}%`,
              width: PLANET_SIZE,
              height: PLANET_SIZE,
              background: `radial-gradient(circle at 35% 35%, ${lighten(planet.color, 40)}, ${planet.color} 60%, ${darken(planet.color, 30)})`,
              boxShadow: isNear
                ? `0 0 30px 12px ${planet.color}88, 0 0 60px 20px ${planet.color}44`
                : `0 0 ${PLANET_SIZE * 0.4}px ${PLANET_SIZE * 0.15}px ${planet.color}44`,
              animationDelay: `${i * 0.6}s`,
            }}
          >
            <span className={styles.planetIcon} role="img" aria-hidden="true">
              {planet.icon}
            </span>
            <span className={styles.planetLabel}>{planet.name}</span>
          </div>
        );
      })}

      {/* Rocket */}
      <div
        ref={rocketElRef}
        className={styles.rocket}
        style={{
          filter: `drop-shadow(0 0 8px ${rocketColor}) drop-shadow(0 0 20px ${rocketColor}88)`,
        }}
      >
        🚀
      </div>

      {/* Landing button */}
      {nearPlanet && nearData && nearLayout && (
        <button
          className={styles.landButton}
          onClick={() => navigateTo(nearPlanet)}
          style={{
            left: `${nearLayout.x * 100}%`,
            top: `calc(${nearLayout.y * 100}% - ${PLANET_SIZE / 2 + 18}px)`,
            borderColor: nearData.color,
            boxShadow: `0 0 15px ${nearData.color}66`,
          }}
        >
          Přistát na {nearData.name}
        </button>
      )}

      {/* Controls hint */}
      <div className={styles.hint}>
        ← ↑ → ↓ létat &nbsp;·&nbsp; Enter = přistát
      </div>
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
