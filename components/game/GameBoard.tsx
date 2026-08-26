'use client';

import { AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { QuestionScreen } from './QuestionScreen';
import { RevealScreen } from './RevealScreen';
import { ResultsScreen } from './ResultsScreen';

export function GameBoard() {
  const { state } = useGame();

  // Key the reveal by answers.length (how many answers have been submitted).
  // This stays stable while the reveal is shown, even if currentQuestionIndex
  // increments when "Next Question" is pressed.
  const revealKey = `reveal-${state.answers.length}`;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {state.phase === 'question' && (
          <QuestionScreen key={`question-${state.currentQuestionIndex}`} />
        )}
        {state.phase === 'reveal' && (
          <RevealScreen key={revealKey} />
        )}
        {state.phase === 'results' && (
          <ResultsScreen key="results" />
        )}
      </AnimatePresence>
    </div>
  );
}
