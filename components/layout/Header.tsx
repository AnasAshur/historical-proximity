'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Archive } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-[var(--border)] bg-[var(--background)]">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-[var(--foreground)] tracking-tight text-sm uppercase letter-spacing-widest hover:opacity-70 transition-opacity"
          style={{ letterSpacing: '0.12em' }}
        >
          Historical Proximity
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/archive"
            className="p-2 rounded-full transition-colors hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            aria-label="Game archive"
          >
            <Archive size={18} strokeWidth={1.5} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
