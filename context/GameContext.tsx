'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
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

  const setGame = useCallback((g: DailyGame) => {
    setGameData(g);
    setState(initialState);
  }, []);

  const submitAnswer = useCallback(
    (position: number, estimatedYear: number) => {
      if (!game) return;
      const q = game.questions[state.currentQuestionIndex];
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

      setState((prev) => ({
        ...prev,
        phase: 'reveal',
        answers: [...prev.answers, answer],
      }));
    },
    [game, state.currentQuestionIndex]
  );

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const next = prev.currentQuestionIndex + 1;
      if (!game || next >= game.questions.length) {
        return prev;
      }
      return {
        ...prev,
        currentQuestionIndex: next,
        phase: 'question',
      };
    });
  }, [game]);

  const goToResults = useCallback(() => {
    setState((prev) => {
      const total = prev.answers.reduce((sum, a) => sum + a.score, 0);
      const finalScore = Math.round(total / prev.answers.length);
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
