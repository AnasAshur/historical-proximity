'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGame } from '@/context/GameContext';
import { GameBoard } from '@/components/game/GameBoard';
import { DailyGame } from '@/lib/types';
import { getTodayET } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Suspense } from 'react';

function PlayContent() {
  const { setGame, game } = useGame();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const date = searchParams.get('date') ?? getTodayET();

    fetch(`/api/game?date=${date}`)
      .then((res) => {
        if (!res.ok) throw new Error('Game not found');
        return res.json() as Promise<DailyGame>;
      })
      .then((data) => {
        setGame(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Failed to load game';
        setError(msg);
        setLoading(false);
      });
  }, [setGame, searchParams]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{
              borderColor: 'var(--border)',
              borderTopColor: 'var(--foreground)',
            }}
          />
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Loading today&apos;s puzzle…
          </p>
        </motion.div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p
          className="text-lg font-medium"
          style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
        >
          No puzzle available for this date.
        </p>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          A new puzzle drops every day at midnight Eastern Time.
        </p>
        <div className="flex gap-3">
          <Link href="/">
            <Button variant="outline" size="md">
              Home
            </Button>
          </Link>
          <Link href="/archive">
            <Button variant="ghost" size="md">
              Archive
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-8 md:py-12">
      <GameBoard />
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--foreground)' }}
          />
        </div>
      }
    >
      <PlayContent />
    </Suspense>
  );
}
