'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TimelineSlider } from './TimelineSlider';
import { Button } from '@/components/ui/Button';
import { useGame } from '@/context/GameContext';
import { positionToYear } from '@/lib/utils';

function playRing() {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch {
    // silent fail
  }
}

export function QuestionScreen() {
  const { game, state, submitAnswer } = useGame();
  const [position, setPosition] = useState(50);
  const submittedRef = useRef(false); // use ref to prevent double-submit

  if (!game) return null;

  // Snapshot the index at mount so it can't drift during this component's lifetime
  const questionIndex = state.currentQuestionIndex;
  const q = game.questions[questionIndex];
  const questionNumber = questionIndex + 1;

  const handleSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const estimatedYear = positionToYear(position, q.leftEndpoint.year, q.rightEndpoint.year);
    playRing();
    submitAnswer(position, estimatedYear);
  };

  return (
    <motion.div
      key={`question-${questionIndex}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full"
    >
      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-8">
        {game.questions.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i <= questionIndex ? 'var(--foreground)' : 'var(--border)',
              opacity: i <= questionIndex ? 1 : 0.4,
            }}
          />
        ))}
      </div>

      {/* Question number + text */}
      <div className="mb-10 md:text-left text-center">
        <p
          className="text-xs uppercase tracking-widest mb-3"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.15em' }}
        >
          Question {questionNumber} of {game.questions.length}
        </p>
        <h2
          className="text-2xl md:text-3xl font-bold leading-snug"
          style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
        >
          {q.text}
        </h2>
      </div>

      {/* Slider — full width */}
      <div className="w-full mb-10">
        <TimelineSlider
          leftEndpoint={q.leftEndpoint}
          rightEndpoint={q.rightEndpoint}
          value={position}
          onChange={setPosition}
          disabled={submittedRef.current}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleSubmit}
          className="min-w-[180px]"
        >
          Submit
        </Button>
      </div>
    </motion.div>
  );
}
