'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { TimelineSlider } from './TimelineSlider';
import { ScoreCounter } from './ScoreCounter';
import { Button } from '@/components/ui/Button';
import { useGame } from '@/context/GameContext';
import { yearToPosition, yearToDisplay } from '@/lib/utils';

export function RevealScreen() {
  const { game, state, nextQuestion, goToResults } = useGame();

  // Snapshot the question index the moment this component mounts.
  // This prevents the reveal from reading the updated index after
  // "Next Question" is pressed and the index increments during exit animation.
  const snapshotIndex = useRef(state.currentQuestionIndex).current;

  if (!game) return null;

  const q = game.questions[snapshotIndex];
  const latestAnswer = state.answers[snapshotIndex];

  if (!q || !latestAnswer) return null;

  const correctPosition = yearToPosition(
    q.answerYear,
    q.leftEndpoint.year,
    q.rightEndpoint.year
  );

  const isLastQuestion = snapshotIndex === game.questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      goToResults();
    } else {
      nextQuestion();
    }
  };

  return (
    <motion.div
      key={`reveal-${snapshotIndex}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full"
    >
      {/* Score */}
      <div className="flex flex-col items-center mb-8">
        <p
          className="text-xs uppercase tracking-widest mb-4"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.15em' }}
        >
          Your Score
        </p>
        <ScoreCounter score={latestAnswer.score} size="md" />

        {/* Accuracy bar */}
        <motion.div
          className="mt-4 w-full max-w-xs h-1.5 rounded-full overflow-hidden"
          style={{ background: 'var(--border)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                latestAnswer.score >= 80
                  ? '#16a34a'
                  : latestAnswer.score >= 50
                  ? '#ca8a04'
                  : '#dc2626',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${latestAnswer.score}%` }}
            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
          />
        </motion.div>
        <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          {latestAnswer.score >= 90
            ? 'Outstanding!'
            : latestAnswer.score >= 70
            ? 'Well done!'
            : latestAnswer.score >= 50
            ? 'Not bad!'
            : 'Keep going!'}
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px my-6" style={{ background: 'var(--border)' }} />

      {/* Correct answer callout */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p
          className="text-xs uppercase tracking-widest mb-1"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.15em' }}
        >
          Correct Answer
        </p>
        <p
          className="text-3xl font-bold"
          style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
        >
          {yearToDisplay(q.answerYear)}
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
          You guessed{' '}
          <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>
            {yearToDisplay(latestAnswer.estimatedYear)}
          </span>
        </p>
      </motion.div>

      {/* Slider (locked) */}
      <div className="mb-8">
        <TimelineSlider
          leftEndpoint={q.leftEndpoint}
          rightEndpoint={q.rightEndpoint}
          value={latestAnswer.position}
          onChange={() => {}}
          disabled={true}
          correctPosition={correctPosition}
          playerPosition={latestAnswer.position}
        />
      </div>

      {/* Fun fact */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.12em' }}
        >
          Did You Know?
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
          {q.funFact}
        </p>
      </motion.div>

      {/* Next / Results button */}
      <div className="flex justify-center">
        <Button size="lg" onClick={handleNext} className="min-w-[180px]">
          {isLastQuestion ? 'See Final Results' : 'Next Question →'}
        </Button>
      </div>
    </motion.div>
  );
}
