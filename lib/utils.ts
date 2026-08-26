import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Linear scoring.
 * correctPosition is snapped to the nearest integer (the closest draggable position
 * to the true answer) so that a player CAN achieve 100 by landing on that position.
 * Score = max(0, 100 - |playerPos - round(correctPos)|)
 */
export function calculateScore(playerPosition: number, correctPosition: number): number {
  const snappedCorrect = Math.round(correctPosition);
  const distance = Math.abs(playerPosition - snappedCorrect);
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
 * The slider always flows older (left) → newer (right).
 * leftYear MUST be the smaller (older) year, rightYear the larger (newer) year.
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
