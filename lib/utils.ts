import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Linear scoring: how close was the player's position to the correct position?
 * Both positions are 0–100 percentages along the timeline.
 * Score = max(0, 100 - |playerPos - correctPos|)  ... but we scale it so that
 * being off by the full width (100%) gives 0, and perfect gives 100.
 */
export function calculateScore(playerPosition: number, correctPosition: number): number {
  const distance = Math.abs(playerPosition - correctPosition);
  return Math.max(0, Math.round(100 - distance));
}

/**
 * Convert a year (CE positive, BCE negative) to a display string.
 * e.g. -69 → "69 BCE", 2007 → "2007 CE"
 */
export function yearToDisplay(year: number): string {
  if (year < 0) return `${Math.abs(year)} BCE`;
  if (year < 1000) return `${year} CE`;
  return `${year}`;
}

/**
 * Given a year and two endpoint years, return the proportional 0–100 position.
 * leftYear is the OLDER (smaller) date, rightYear is the NEWER (larger) date.
 */
export function yearToPosition(year: number, leftYear: number, rightYear: number): number {
  const total = rightYear - leftYear;
  if (total === 0) return 50;
  return Math.max(0, Math.min(100, ((year - leftYear) / total) * 100));
}

/**
 * Given a 0–100 position and two endpoint years, return the estimated year.
 */
export function positionToYear(position: number, leftYear: number, rightYear: number): number {
  return Math.round(leftYear + (position / 100) * (rightYear - leftYear));
}

/**
 * Format today's date as YYYY-MM-DD in Eastern Time.
 */
export function getTodayET(): string {
  const now = new Date();
  const etString = now.toLocaleString('en-US', { timeZone: 'America/New_York' });
  const etDate = new Date(etString);
  const y = etDate.getFullYear();
  const m = String(etDate.getMonth() + 1).padStart(2, '0');
  const d = String(etDate.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
