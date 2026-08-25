'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreCounterProps {
  score: number;
  size?: 'md' | 'lg';
}

export function ScoreCounter({ score, size = 'md' }: ScoreCounterProps) {
  const [displayed, setDisplayed] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = 0;
    const end = score;
    const duration = 1000; // ms
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + eased * (end - start)));
      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      }
    };

    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [score]);

  const isLarge = size === 'lg';

  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <span
        className={isLarge ? 'text-7xl font-bold' : 'text-5xl font-bold'}
        style={{
          fontFamily: 'Georgia, serif',
          color: 'var(--foreground)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {displayed}
      </span>
      <span
        className={isLarge ? 'text-xl mt-1' : 'text-sm mt-0.5'}
        style={{ color: 'var(--muted-foreground)' }}
      >
        / 100
      </span>
    </motion.div>
  );
}
