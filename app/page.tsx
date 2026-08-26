'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const today = format(new Date(), 'MMMM d, yyyy');

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Decorative rule */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12" style={{ background: 'var(--border)' }} />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: 'var(--muted-foreground)', letterSpacing: '0.2em' }}
          >
            Daily Puzzle
          </span>
          <div className="h-px w-12" style={{ background: 'var(--border)' }} />
        </div>

        {/* Title */}
        <h1
          className="text-5xl md:text-7xl font-bold mb-10 leading-none"
          style={{
            fontFamily: 'Georgia, serif',
            color: 'var(--foreground)',
            letterSpacing: '-0.02em',
          }}
        >
          Historical
          <br />
          Proximity
        </h1>

        {/* Play button — bigger padding, pill shape from Button component */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link href="/play">
            <Button
              size="lg"
              className="text-lg tracking-wide"
              style={{ letterSpacing: '0.08em', paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '0.5rem', paddingBottom: '0.5rem' }}
            >
              Play
            </Button>
          </Link>
        </motion.div>

        {/* Date */}
        <p
          className="mt-6 text-sm"
          style={{ color: 'var(--muted-foreground)' }}
        >
          {today}
        </p>
      </motion.div>
    </div>
  );
}
