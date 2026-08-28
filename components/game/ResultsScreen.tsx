'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScoreCounter } from './ScoreCounter';
import { CountdownTimer } from './CountdownTimer';
import { Button } from '@/components/ui/Button';
import { useGame } from '@/context/GameContext';
import { yearToDisplay } from '@/lib/utils';
import { getPercentile, getStreak, saveGameResult } from '@/lib/supabase';
import { Flame, Trophy, Users } from 'lucide-react';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem('hp-session-id');
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('hp-session-id', id);
  }
  return id;
}

export function ResultsScreen() {
  const { game, state } = useGame();
  const [percentile, setPercentile] = useState<number | null>(null);
  const [streak, setStreak] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const finalScore = state.finalScore ?? 0;

  useEffect(() => {
    if (!game || saved) return;
    const sessionId = getSessionId();

    const save = saveGameResult({
      user_session_id: sessionId,
      game_date: game.date,
      scores: state.answers.map((a) => a.score),
      final_score: finalScore,
    });

    save.then(async () => {
      setSaved(true);
      const [pct, str] = await Promise.all([
        getPercentile(sessionId, game.date),
        getStreak(sessionId),
      ]);
      setPercentile(pct);
      setStreak(str);
    }).catch(() => {
      // Supabase not configured — show defaults
      setPercentile(1);   // Top 99%
      setStreak(1);
      setSaved(true);
    });
  }, [game, saved, state.answers, finalScore]);

  if (!game) return null;

  const scoreLabel =
    finalScore >= 90 ? 'Brilliant!'
    : finalScore >= 75 ? 'Impressive!'
    : finalScore >= 55 ? 'Well played!'
    : finalScore >= 35 ? 'Good effort!'
    : 'Keep learning!';

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    const text = `I scored ${finalScore}/100 on Historical Proximity! Can you beat me? 🏛️\n${url}`;
    if (navigator.share) {
      navigator.share({ title: 'Historical Proximity', text, url });
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  return (
    <motion.div
      key="results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.15em' }}
        >
          Day {game.dayNumber}
        </p>
        <h2
          className="text-3xl font-bold mb-1"
          style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
        >
          Final Results
        </h2>
        <p
          className="text-lg mt-1"
          style={{ color: 'var(--muted-foreground)', fontFamily: 'Georgia, serif' }}
        >
          {scoreLabel}
        </p>
      </div>

      {/* Final score */}
      <div className="flex justify-center mb-8">
        <ScoreCounter score={finalScore} size="lg" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <motion.div
          className="flex flex-col items-center rounded-2xl p-5"
          style={{ background: 'var(--muted)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Users size={18} className="mb-2" style={{ color: 'var(--muted-foreground)' }} />
          <span
            className="text-xl font-bold"
            style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
          >
            {percentile !== null ? `Top ${100 - percentile}%` : '—'}
          </span>
          <span className="text-xs mt-1 text-center" style={{ color: 'var(--muted-foreground)' }}>
            Percentile
          </span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center rounded-2xl p-5"
          style={{ background: 'var(--muted)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Flame size={18} className="mb-2" style={{ color: 'var(--muted-foreground)' }} />
          <span
            className="text-xl font-bold"
            style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
          >
            {streak !== null ? streak : '—'}
          </span>
          <span className="text-xs mt-1 text-center" style={{ color: 'var(--muted-foreground)' }}>
            Day Streak
          </span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center rounded-2xl p-5"
          style={{ background: 'var(--muted)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Trophy size={18} className="mb-2" style={{ color: 'var(--muted-foreground)' }} />
          <span
            className="text-xl font-bold"
            style={{ fontFamily: 'Georgia, serif', color: 'var(--foreground)' }}
          >
            {finalScore}
          </span>
          <span className="text-xs mt-1 text-center" style={{ color: 'var(--muted-foreground)' }}>
            Avg Score
          </span>
        </motion.div>
      </div>

      {/* Per-question breakdown — increased padding */}
      <div className="rounded-2xl overflow-hidden mb-8" style={{ border: '1px solid var(--border)' }}>
        {game.questions.map((q, i) => {
          const answer = state.answers[i];
          return (
            <motion.div
              key={q.id}
              className="flex items-center justify-between px-8 py-6"
              style={{
                borderBottom: i < game.questions.length - 1 ? '1px solid var(--border)' : 'none',
                background: 'var(--card)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                  {q.text}
                </p>
                <p className="text-xs mt-1.5" style={{ color: 'var(--muted-foreground)' }}>
                  {answer
                    ? `You: ${yearToDisplay(answer.estimatedYear)} · Correct: ${yearToDisplay(q.answerYear)}`
                    : 'Not answered'}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <span
                  className="text-xl font-bold"
                  style={{
                    fontFamily: 'Georgia, serif',
                    color:
                      (answer?.score ?? 0) >= 80 ? '#16a34a'
                      : (answer?.score ?? 0) >= 50 ? '#ca8a04'
                      : '#dc2626',
                  }}
                >
                  {answer?.score ?? 0}
                </span>
                <span className="text-xs ml-0.5" style={{ color: 'var(--muted-foreground)' }}>
                  /100
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Countdown timer */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <CountdownTimer />
      </motion.div>

      {/* Share */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          variant="outline"
          size="lg"
          style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
          onClick={handleShare}
        >
          Share Result
        </Button>
      </motion.div>
    </motion.div>
  );
}
