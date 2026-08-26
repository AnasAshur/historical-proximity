'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { GameState, PlayerAnswer, DailyGame } from '@/lib/types';
import { calculateScore, yearToPosition } from '@/lib/utils';

interface GameContextValue {
  game: DailyGame | null;
  state: GameState;
  setGame: (game: DailyGame) => void;
  submitAnswer: (position: number, estimatedYear: number) => void;
  nextQuestion: () => void;
  goToResults: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  currentQuestionIndex: 0,
  phase: 'question',
  answers: [],
  finalScore: null,
};

const GameContext = createContext<GameContextValue>({
  game: null,
  state: initialState,
  setGame: () => {},
  submitAnswer: () => {},
  nextQuestion: () => {},
  goToResults: () => {},
  resetGame: () => {},
});

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [game, setGameData] = useState<DailyGame | null>(null);
  const [state, setState] = useState<GameState>(initialState);

  // Keep a ref to game so callbacks always see the current value
  const gameRef = useRef<DailyGame | null>(null);

  const setGame = useCallback((g: DailyGame) => {
    gameRef.current = g;
    setGameData(g);
    setState(initialState);
  }, []);

  const submitAnswer = useCallback(
    (position: number, estimatedYear: number) => {
      const currentGame = gameRef.current;
      if (!currentGame) return;

      setState((prev) => {
        const q = currentGame.questions[prev.currentQuestionIndex];
        const correctPosition = yearToPosition(
          q.answerYear,
          q.leftEndpoint.year,
          q.rightEndpoint.year
        );
        const score = calculateScore(position, correctPosition);

        const answer: PlayerAnswer = {
          questionId: q.id,
          position,
          estimatedYear,
          score,
        };

        return {
          ...prev,
          phase: 'reveal',
          answers: [...prev.answers, answer],
        };
      });
    },
    []
  );

  const nextQuestion = useCallback(() => {
    const currentGame = gameRef.current;
    if (!currentGame) return;
    const totalQuestions = currentGame.questions.length;

    setState((prev) => {
      const next = prev.currentQuestionIndex + 1;
      if (next >= totalQuestions) {
        // Should not happen — goToResults handles this — but guard anyway
        return prev;
      }
      return {
        ...prev,
        currentQuestionIndex: next,
        phase: 'question',
      };
    });
  }, []);

  const goToResults = useCallback(() => {
    setState((prev) => {
      const total = prev.answers.reduce((sum, a) => sum + a.score, 0);
      const finalScore = prev.answers.length > 0
        ? Math.round(total / prev.answers.length)
        : 0;
      return { ...prev, phase: 'results', finalScore };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <GameContext.Provider
      value={{ game, state, setGame, submitAnswer, nextQuestion, goToResults, resetGame }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
