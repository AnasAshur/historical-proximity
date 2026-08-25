import { DailyGame } from './types';

/**
 * Day 1 — the first official game.
 * All years: CE = positive integer, BCE = negative integer.
 *
 * Great Pyramid of Giza: ~2560 BCE → -2560
 * Cleopatra born: 69 BCE → -69
 * iPhone invention: 2007 CE → 2007
 *
 * Battle of Marathon: 490 BCE → -490
 * Fall of Western Roman Empire: 476 CE → 476
 * First Moon Landing: 1969 CE → 1969
 *
 * Birth of Muhammad: 570 CE → 570
 * Columbus reaches Americas: 1492 CE → 1492
 * First powered flight (Wright Brothers): 1903 CE → 1903
 */

export const DAY_1_GAME: DailyGame = {
  date: '2026-08-25',
  dayNumber: 1,
  questions: [
    {
      id: 1,
      text: 'When was Cleopatra born?',
      answerYear: -69,
      leftEndpoint: {
        label: 'Invention of the iPhone',
        year: 2007,
      },
      rightEndpoint: {
        label: 'Construction of the Great Pyramid of Giza',
        year: -2560,
      },
      funFact:
        'Cleopatra (69 BCE) lived closer to the invention of the iPhone (2007 CE) than to the construction of the Great Pyramid (2560 BCE). The pyramid is about 2,491 years before Cleopatra, while the iPhone is only 2,076 years after her.',
    },
    {
      id: 2,
      text: 'When did the Battle of Marathon take place?',
      answerYear: -490,
      leftEndpoint: {
        label: 'First Moon Landing',
        year: 1969,
      },
      rightEndpoint: {
        label: 'Fall of Western Roman Empire',
        year: 476,
      },
      funFact:
        'The Battle of Marathon (490 BCE) was fought nearly a millennium before the Western Roman Empire fell (476 CE). It\'s also the origin of the modern marathon race — a messenger supposedly ran ~25 miles from Marathon to Athens to announce the Greek victory.',
    },
    {
      id: 3,
      text: 'When was Muhammad born?',
      answerYear: 570,
      leftEndpoint: {
        label: 'Columbus reaches the Americas',
        year: 1492,
      },
      rightEndpoint: {
        label: 'First Powered Flight by Wright Brothers',
        year: 1903,
      },
      funFact:
        'Muhammad was born around 570 CE — nearly 900 years before Columbus reached the Americas in 1492. The Wright Brothers\' first flight in 1903 came over 1,330 years after his birth, yet both Columbus\'s voyage and the Wright flight feel like they belong to completely different eras from each other.',
    },
  ],
};

/**
 * In production, games would come from the database.
 * This seed data is used for the first day and as fallback.
 */
export const SEED_GAMES: DailyGame[] = [DAY_1_GAME];

/**
 * Get game data for a specific date string (YYYY-MM-DD).
 * Falls back to the seed games if no database record exists.
 */
export function getGameForDate(date: string): DailyGame | null {
  return SEED_GAMES.find((g) => g.date === date) ?? null;
}
