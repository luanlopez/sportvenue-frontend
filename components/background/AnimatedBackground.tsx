'use client';

import { useEffect, useState } from 'react';

interface Bubble {
  id: number;
  size: string;
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
  opacity: string;
}

export function AnimatedBackground() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles: Bubble[] = [];
      for (let i = 0; i < 15; i++) {
        newBubbles.push({
          id: i,
          size: getRandomSize(),
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${20 + Math.random() * 20}s`,
          animationDelay: `${Math.random() * -20}s`,
          opacity: `${0.03 + Math.random() * 0.07}`,
        });
      }
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-primary-600 to-primary-400">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.2)_100%)]" />
      <div className="absolute w-full h-full">
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className={`
              absolute rounded-full
              animate-float-${bubble.id % 3}
              backdrop-blur-sm
              ${bubble.size}
            `}
            style={{
              left: bubble.left,
              top: bubble.top,
              animationDelay: bubble.animationDelay,
              animationDuration: bubble.animationDuration,
              backgroundColor: `rgba(255, 255, 255, ${bubble.opacity})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function getRandomSize() {
  const sizes = [
    'w-16 h-16',
    'w-24 h-24',
    'w-32 h-32',
    'w-40 h-40',
    'w-48 h-48'
  ];
  return sizes[Math.floor(Math.random() * sizes.length)];
} 