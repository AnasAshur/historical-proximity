'use client';

import { AnimatePresence } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import { QuestionScreen } from './QuestionScreen';
import { RevealScreen } from './RevealScreen';
import { ResultsScreen } from './ResultsScreen';

export function GameBoard() {
  const { state } = useGame();

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {state.phase === 'question' && <QuestionScreen key={`q-${state.currentQuestionIndex}`} />}
        {state.phase === 'reveal' && <RevealScreen key={`r-${state.currentQuestionIndex}`} />}
        {state.phase === 'results' && <ResultsScreen key="results" />}
      </AnimatePresence>
    </div>
  );
}
