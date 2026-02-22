import { useState, useEffect, useRef, useCallback } from 'react';
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

const ACCELERATION = 0.3;
const FRICTION = 0.95;
const MAX_SPEED = 6;
const STOP_THRESHOLD = 0.05;
const LAND_DISTANCE = 75;
const PLANET_SIZE = 64;
const STORAGE_KEY = 'planetky_rocketPos';
const JOYSTICK_RADIUS = 50;

const ROCKET_COLORS: Record<string, string> = {
  'rocket-girl': '#ff6eb4',
  'rocket-boy': '#22d3ee',
  'rocket-star': '#fbbf24',
  'rocket-cosmic': '#a78bfa',
};

function saveRocketPos(x: number, y: number, angle: number, w: number, h: number) {
  if (w <= 0 || h <= 0) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ fx: x / w, fy: y / h, angle }));
}

function loadRocketPos(w: number, h: number): { x: number; y: number; angle: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const { fx, fy, angle } = JSON.parse(raw);
      return {
        x: Math.max(20, Math.min(w - 20, fx * w)),
        y: Math.max(20, Math.min(h - 20, fy * h)),
        angle: angle ?? -45,
      };
    }
  } catch { /* ignore */ }
  return { x: w / 2, y: h / 2, angle: -45 };
}

export default function Universe() {
  const { state, navigateTo } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const rocketElRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef(new Set<string>());
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const angleRef = useRef(-45);
  const dimsRef = useRef({ w: 0, h: 0 });
  const nearRef = useRef<PlanetId | null>(null);
  const navigateRef = useRef(navigateTo);
  navigateRef.current = navigateTo;

  const [nearPlanet, setNearPlanet] = useState<PlanetId | null>(null);
  const animRef = useRef(0);

  // Touch joystick state
  const touchRef = useRef({ ax: 0, ay: 0 }); // normalized acceleration from joystick
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickKnobRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);
  const touchOriginRef = useRef({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);

  const rocketColor = ROCKET_COLORS[state.profile?.rocketType ?? 'rocket-boy'];

  const handleNavigate = (planetId: PlanetId) => {
    const c = containerRef.current;
    if (c) saveRocketPos(posRef.current.x, posRef.current.y, angleRef.current, c.clientWidth, c.clientHeight);
    navigateRef.current(planetId);
  };

  // Initialize rocket position (restore from localStorage or center)
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    const { x, y, angle } = loadRocketPos(c.clientWidth, c.clientHeight);
    posRef.current = { x, y };
    angleRef.current = angle;
    velRef.current = { vx: 0, vy: 0 };
    const el = rocketElRef.current;
    if (el) {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
    }
  }, []);

  // Save on unmount
  useEffect(() => {
    return () => {
      const { w, h } = dimsRef.current;
      if (w > 0) saveRocketPos(posRef.current.x, posRef.current.y, angleRef.current, w, h);
    };
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
        handleNavigate(nearRef.current);
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

  // Detect touch device
  useEffect(() => {
    const onTouch = () => { setIsTouch(true); };
    window.addEventListener('touchstart', onTouch, { once: true });
    return () => window.removeEventListener('touchstart', onTouch);
  }, []);

  // Touch joystick handlers
  const handleJoystickStart = useCallback((e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.touches[0];
    touchIdRef.current = touch.identifier;
    const rect = joystickBaseRef.current?.getBoundingClientRect();
    if (rect) {
      touchOriginRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    touchRef.current = { ax: 0, ay: 0 };
    if (joystickKnobRef.current) {
      joystickKnobRef.current.style.transform = 'translate(-50%, -50%)';
    }
  }, []);

  const handleJoystickMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const id = touchIdRef.current;
    if (id === null) return;
    let touch: React.Touch | undefined;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === id) { touch = e.touches[i]; break; }
    }
    if (!touch) return;

    const dx = touch.clientX - touchOriginRef.current.x;
    const dy = touch.clientY - touchOriginRef.current.y;
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(dist, JOYSTICK_RADIUS);
    const angle = Math.atan2(dy, dx);

    // Normalize to -1..1 range
    const norm = clamped / JOYSTICK_RADIUS;
    touchRef.current = {
      ax: Math.cos(angle) * norm,
      ay: Math.sin(angle) * norm,
    };

    // Move knob visual
    if (joystickKnobRef.current) {
      const knobX = Math.cos(angle) * clamped;
      const knobY = Math.sin(angle) * clamped;
      joystickKnobRef.current.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
    }
  }, []);

  const handleJoystickEnd = useCallback((e: React.TouchEvent) => {
    const id = touchIdRef.current;
    if (id === null) return;
    let still = false;
    for (let i = 0; i < e.touches.length; i++) {
      if (e.touches[i].identifier === id) { still = true; break; }
    }
    if (!still) {
      touchIdRef.current = null;
      touchRef.current = { ax: 0, ay: 0 };
      if (joystickKnobRef.current) {
        joystickKnobRef.current.style.transform = 'translate(-50%, -50%)';
      }
    }
  }, []);

  // Game loop with momentum physics
  useEffect(() => {
    const tick = () => {
      const c = containerRef.current;
      if (!c) {
        animRef.current = requestAnimationFrame(tick);
        return;
      }

      const w = c.clientWidth;
      const h = c.clientHeight;
      dimsRef.current = { w, h };

      // Input → acceleration (keyboard + touch joystick)
      const keys = keysRef.current;
      let ax = 0, ay = 0;
      if (keys.has('ArrowLeft') || keys.has('a')) ax -= 1;
      if (keys.has('ArrowRight') || keys.has('d')) ax += 1;
      if (keys.has('ArrowUp') || keys.has('w')) ay -= 1;
      if (keys.has('ArrowDown') || keys.has('s')) ay += 1;

      // Merge touch joystick input
      const tj = touchRef.current;
      if (tj.ax !== 0 || tj.ay !== 0) {
        ax += tj.ax;
        ay += tj.ay;
      }

      if (ax !== 0 || ay !== 0) {
        const len = Math.sqrt(ax * ax + ay * ay);
        ax = (ax / len) * ACCELERATION;
        ay = (ay / len) * ACCELERATION;
      }

      const vel = velRef.current;
      vel.vx = (vel.vx + ax) * FRICTION;
      vel.vy = (vel.vy + ay) * FRICTION;

      // Clamp to max speed
      const speed = Math.hypot(vel.vx, vel.vy);
      if (speed > MAX_SPEED) {
        vel.vx = (vel.vx / speed) * MAX_SPEED;
        vel.vy = (vel.vy / speed) * MAX_SPEED;
      }

      // Dead zone — stop completely
      if (speed < STOP_THRESHOLD) {
        vel.vx = 0;
        vel.vy = 0;
      }

      // Update position
      if (vel.vx !== 0 || vel.vy !== 0) {
        const pos = posRef.current;
        const newX = Math.max(20, Math.min(w - 20, pos.x + vel.vx));
        const newY = Math.max(20, Math.min(h - 20, pos.y + vel.vy));

        // Kill velocity at boundaries
        if (newX === 20 || newX === w - 20) vel.vx = 0;
        if (newY === 20 || newY === h - 20) vel.vy = 0;

        pos.x = newX;
        pos.y = newY;

        angleRef.current = Math.atan2(vel.vy, vel.vx) * (180 / Math.PI) + 45;

        const el = rocketElRef.current;
        if (el) {
          el.style.left = `${newX}px`;
          el.style.top = `${newY}px`;
          el.style.transform = `translate(-50%, -50%) rotate(${angleRef.current}deg)`;
        }
      }

      // Proximity check
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
          onClick={() => handleNavigate(nearPlanet)}
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

      {/* Touch joystick (mobile only) */}
      {isTouch && (
        <div
          ref={joystickBaseRef}
          className={styles.joystickBase}
          onTouchStart={handleJoystickStart}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
          onTouchCancel={handleJoystickEnd}
        >
          <div ref={joystickKnobRef} className={styles.joystickKnob} />
        </div>
      )}

      {/* Controls hint */}
      <div className={styles.hint}>
        {isTouch ? 'Táhni joystickem a leť k planetám' : '← ↑ → ↓ létat \u00a0·\u00a0 Enter = přistát'}
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
