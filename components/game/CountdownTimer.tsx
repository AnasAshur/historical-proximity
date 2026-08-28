'use client';

import { useEffect, useState } from 'react';

function getSecondsUntilMidnightET(): number {
  const now = new Date();
  // Get current time string in ET
  const etStr = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const etNow = new Date(etStr);

  // Next midnight ET
  const midnight = new Date(etNow);
  midnight.setHours(24, 0, 0, 0);

  return Math.max(0, Math.floor((midnight.getTime() - etNow.getTime()) / 1000));
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function CountdownTimer() {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    // Init on client only (avoids SSR mismatch)
    setSeconds(getSecondsUntilMidnightET());

    const interval = setInterval(() => {
      setSeconds(getSecondsUntilMidnightET());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (seconds === null) return null;

  return (
    <div className="text-center">
      <p
        className="text-xs uppercase tracking-widest mb-1"
        style={{ color: 'var(--muted-foreground)', letterSpacing: '0.15em' }}
      >
        Next Puzzle In
      </p>
      <p
        className="text-2xl font-bold tabular-nums"
        style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
      >
        {formatTime(seconds)}
      </p>
    </div>
  );
}
