export interface Endpoint {
  label: string;   // e.g. "Invention of the iPhone"
  year: number;    // actual year (BCE = negative)
}

export interface Question {
  id: number;
  text: string;           // e.g. "When was Cleopatra born?"
  answerYear: number;     // the correct answer year
  leftEndpoint: Endpoint;
  rightEndpoint: Endpoint;
  funFact: string;        // shown on reveal screen
}

export interface DailyGame {
  date: string;           // YYYY-MM-DD
  dayNumber: number;
  questions: Question[];
}

export interface PlayerAnswer {
  questionId: number;
  position: number;       // 0–100 slider position
  estimatedYear: number;
  score: number;          // 0–100
}

export interface GameState {
  currentQuestionIndex: number;   // 0, 1, 2
  phase: 'question' | 'reveal' | 'results';
  answers: PlayerAnswer[];
  finalScore: number | null;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  date: string;
}
