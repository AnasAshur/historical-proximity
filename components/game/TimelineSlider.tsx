'use client';

import { useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { positionToYear, yearToDisplay } from '@/lib/utils';
import { Endpoint } from '@/lib/types';

interface TimelineSliderProps {
  leftEndpoint: Endpoint;
  rightEndpoint: Endpoint;
  value: number;
  onChange: (pos: number) => void;
  disabled?: boolean;
  correctPosition?: number;
  playerPosition?: number;
}

export function TimelineSlider({
  leftEndpoint,
  rightEndpoint,
  value,
  onChange,
  disabled = false,
  correctPosition,
  playerPosition,
}: TimelineSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const currentYear = positionToYear(value, leftEndpoint.year, rightEndpoint.year);
  const clampedValue = Math.max(0, Math.min(100, value));

  const getPositionFromEvent = useCallback(
    (clientX: number): number => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const raw = ((clientX - rect.left) / rect.width) * 100;
      return Math.max(0, Math.min(100, Math.round(raw)));
    },
    [value]
  );

  // Prevent page scroll / pull-to-refresh on mobile while dragging
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const preventScroll = (e: TouchEvent) => {
      if (isDragging.current) {
        e.preventDefault();
      }
    };

    // passive: false required to call preventDefault on touchmove
    track.addEventListener('touchmove', preventScroll, { passive: false });
    return () => track.removeEventListener('touchmove', preventScroll);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      isDragging.current = true;
      // Capture keeps all pointer events coming to this element even if cursor leaves
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onChange(getPositionFromEvent(e.clientX));
    },
    [disabled, onChange, getPositionFromEvent]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current || disabled) return;
      onChange(getPositionFromEvent(e.clientX));
    },
    [disabled, onChange, getPositionFromEvent]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'ArrowLeft') onChange(Math.max(0, value - 1));
      if (e.key === 'ArrowRight') onChange(Math.min(100, value + 1));
    },
    [disabled, value, onChange]
  );

  return (
    // touch-none stops the browser from intercepting touch as scroll
    <div className="w-full select-none touch-none">
      {/* Endpoint labels */}
      <div className="flex justify-between mb-2 text-xs text-[var(--muted-foreground)] font-medium">
        <span className="max-w-[45%] text-left leading-tight">{leftEndpoint.label}</span>
        <span className="max-w-[45%] text-right leading-tight">{rightEndpoint.label}</span>
      </div>

      {/* Endpoint years */}
      <div className="flex justify-between mb-3 text-xs text-[var(--muted-foreground)]">
        <span>{yearToDisplay(leftEndpoint.year)}</span>
        <span>{yearToDisplay(rightEndpoint.year)}</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-2 rounded-full cursor-pointer"
        style={{ background: 'var(--border)' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clampedValue)}
        aria-label="Timeline position"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {/* Filled track */}
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ background: 'var(--foreground)', width: `${clampedValue}%` }}
        />

        {/* Player marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${clampedValue}%` }}
        >
          <div
            className="w-7 h-7 rounded-full border-2 shadow-md flex items-center justify-center"
            style={{
              background: 'var(--background)',
              borderColor: 'var(--foreground)',
              cursor: disabled ? 'default' : 'grab',
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--foreground)' }} />
          </div>
        </div>

        {/* Correct position marker */}
        {correctPosition !== undefined && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
            style={{ left: `${correctPosition}%` }}
          >
            <div
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-md"
              style={{ background: '#16a34a', borderColor: '#15803d' }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Year readout */}
      <div className="mt-5 text-center">
        <span
          className="text-3xl font-bold tracking-tight"
          style={{ color: 'var(--foreground)', fontFamily: 'Georgia, serif' }}
        >
          {yearToDisplay(currentYear)}
        </span>
      </div>

      {/* Reveal legend */}
      {correctPosition !== undefined && (
        <motion.div
          className="mt-4 flex justify-center gap-6 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full border"
              style={{ background: 'var(--background)', borderColor: 'var(--foreground)' }}
            />
            <span className="text-[var(--muted-foreground)]">Your answer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#16a34a' }} />
            <span className="text-[var(--muted-foreground)]">Correct answer</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
