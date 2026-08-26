import { DailyGame } from './types';

/**
 * Year encoding: CE = positive, BCE = negative.
 *
 * CRITICAL RULE: leftEndpoint.year MUST always be less than rightEndpoint.year
 * (older date on the left, newer date on the right).
 * The answer year MUST fall between the two endpoints.
 *
 * Scoring: the correct position is Math.round(yearToPosition(answerYear, left, right))
 * so the player can always land on it and score 100.
 */

export const DAY_1_GAME: DailyGame = {
  date: '2026-08-25',
  dayNumber: 1,
  questions: [
    {
      id: 1,
      // Answer: -69 BCE. Range: -2560 to 2007. -69 is inside ✓
      text: 'When was Cleopatra born?',
      answerYear: -69,
      leftEndpoint: {
        label: 'Construction of the Great Pyramid of Giza',
        year: -2560,
      },
      rightEndpoint: {
        label: 'Invention of the iPhone',
        year: 2007,
      },
      funFact:
        'Cleopatra (69 BCE) lived closer to the invention of the iPhone (2007 CE) than to the construction of the Great Pyramid (2560 BCE). The pyramid is about 2,491 years before Cleopatra, while the iPhone is only 2,076 years after her.',
    },
    {
      id: 2,
      // Answer: -490 BCE. Range: -490 must be inside the endpoints.
      // Original endpoints 476 and 1969 — answer -490 is OUTSIDE (before both). Fixed:
      // Left: 500 BCE → -500, Right: 1969
      // Position of -490: (-490 - (-500)) / (1969 - (-500)) * 100 = 10/2469*100 = 0.405 → 0
      // Too close to edge. Better: Left: -600, Right: 1969
      // Position: (-490+600)/(1969+600)*100 = 110/2569*100 = 4.28 → 4. Too far left.
      // Use Left: -600, Right: 500 CE → 500
      // Position: (-490+600)/(500+600)*100 = 110/1100*100 = 10 ✓ year at 10 = -600+110=-490 ✓ PERFECT
      text: 'When did the Battle of Marathon take place?',
      answerYear: -490,
      leftEndpoint: {
        label: '600 BCE',
        year: -600,
      },
      rightEndpoint: {
        label: '500 CE',
        year: 500,
      },
      funFact:
        'The Battle of Marathon (490 BCE) is the origin of the modern marathon race — a messenger supposedly ran ~25 miles from Marathon to Athens to announce the Greek victory over the Persians.',
    },
    {
      id: 3,
      // Answer: 570 CE. Original endpoints 1492 and 1903 — answer 570 is OUTSIDE. Fixed:
      // Left: 500 CE, Right: 1500 CE
      // Position: (570-500)/(1500-500)*100 = 70/1000*100 = 7 ✓ year at 7 = 500+70=570 ✓ PERFECT
      text: 'When was Muhammad born?',
      answerYear: 570,
      leftEndpoint: {
        label: '500 CE',
        year: 500,
      },
      rightEndpoint: {
        label: '1500 CE',
        year: 1500,
      },
      funFact:
        'Muhammad was born around 570 CE in Mecca. His life and teachings gave rise to Islam, one of the world\'s largest religions, within just a few decades of his birth.',
    },
  ],
};

export const DAY_2_GAME: DailyGame = {
  date: '2026-08-26',
  dayNumber: 2,
  questions: [
    {
      id: 1,
      // Answer: -1650. Left: -2500 (Sphinx), Right: 1912 (Titanic)
      // -1650 is between -2500 and 1912 ✓
      // Position: (-1650+2500)/(1912+2500)*100 = 850/4412*100 = 19.267 → snaps to 19
      // Year at 19: -2500 + (19/100)*4412 = -2500+838.28 = -1661.72 → -1662
      // Player lands on pos 19 → score 100 ✓
      text: 'When did the woolly mammoth go extinct?',
      answerYear: -1650,
      leftEndpoint: {
        label: 'Construction of the Sphinx of Giza',
        year: -2500,
      },
      rightEndpoint: {
        label: 'Sinking of the Titanic',
        year: 1912,
      },
      funFact:
        'The last woolly mammoths survived until around 1650 BCE on Wrangel Island in the Arctic — long after the pyramids of Giza were built. They were still alive when ancient Egyptians were flourishing.',
    },
    {
      id: 2,
      // Answer: 1069. Left: 800 (Charlemagne), Right: 1998 (Google)
      // 1069 is between 800 and 1998 ✓
      // Position: (1069-800)/(1998-800)*100 = 269/1198*100 = 22.454 → snaps to 22
      // Year at 22: 800+(22/100)*1198 = 800+263.56 = 1063.56 → 1064
      // Player lands on pos 22 → score 100 ✓
      text: 'When was Oxford University founded?',
      answerYear: 1069,
      leftEndpoint: {
        label: 'Charlemagne is crowned Emperor',
        year: 800,
      },
      rightEndpoint: {
        label: 'Founding of Google',
        year: 1998,
      },
      funFact:
        'Oxford University is the oldest university in the English-speaking world, with teaching dating back to the late 11th century. It predates the Aztec Empire, the printing press, and the Renaissance.',
    },
    {
      id: 3,
      // Answer: 1452. Left: 1066 (Norman Conquest), Right: 1789 (French Revolution)
      // 1452 is between 1066 and 1789 ✓
      // Position: (1452-1066)/(1789-1066)*100 = 386/723*100 = 53.388 → snaps to 53
      // Year at 53: 1066+(53/100)*723 = 1066+383.19 = 1449.19 → 1449
      // Player lands on pos 53 → score 100 ✓
      text: 'When was Leonardo da Vinci born?',
      answerYear: 1452,
      leftEndpoint: {
        label: 'Norman Conquest of England',
        year: 1066,
      },
      rightEndpoint: {
        label: 'The French Revolution',
        year: 1789,
      },
      funFact:
        'Leonardo da Vinci was born in 1452 in Vinci, Italy. In his notebooks he designed flying machines, armored vehicles, and solar power concepts — all centuries before they became reality.',
    },
  ],
};

export const SEED_GAMES: DailyGame[] = [DAY_1_GAME, DAY_2_GAME];

export function getGameForDate(date: string): DailyGame | null {
  return SEED_GAMES.find((g) => g.date === date) ?? null;
}
