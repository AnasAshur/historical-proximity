'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { SEED_GAMES } from '@/lib/gameData';
import { Button } from '@/components/ui/Button';
import { ChevronRight } from 'lucide-react';

export default function ArchivePage() {
  const games = [...SEED_GAMES].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-xs uppercase tracking-widest mb-2"
            style={{ color: 'var(--muted-foreground)', letterSpacing: '0.15em' }}
          >
            Archive
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
          >
            Previous Puzzles
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Play any previous day at your own pace.
          </p>
        </div>

        {/* Game list */}
        <div className="rounded overflow-hidden" style={{ border: '1px solid var(--border)' }}>
          {games.map((game, i) => (
            <motion.div
              key={game.date}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/play?date=${game.date}`}
                className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-[var(--muted)] group"
                style={{
                  borderBottom: i < games.length - 1 ? '1px solid var(--border)' : 'none',
                  background: 'var(--card)',
                }}
              >
                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Day {game.dayNumber}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    {format(new Date(game.date + 'T12:00:00'), 'MMMM d, yyyy')}
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  style={{ color: 'var(--muted-foreground)' }}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
