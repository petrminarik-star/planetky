import { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  animationDelay: string;
  animationDuration: string;
}

interface StarFieldProps {
  starCount?: number;
}

export default function StarField({ starCount = 200 }: StarFieldProps) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 3 + 1.5}s`,
    }));
  }, [starCount]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            opacity: star.opacity,
            animation: `twinkle ${star.animationDuration} ease-in-out ${star.animationDelay} infinite alternate`,
            boxShadow: `0 0 ${star.size * 2}px ${star.size * 0.5}px rgba(255, 255, 255, 0.3)`,
          }}
        />
      ))}
    </div>
  );
}
