import { addDays } from './dates.js';

export const INTERVALS = [0, 1, 3, 7, 14, 30, 60];
export const MAX_BOX = INTERVALS.length - 1;
export const MASTERED_BOX = 5;
export const RATING = Object.freeze({ AGAIN: 1, HARD: 2, EASY: 3 });

export function newCard(today) {
  return { box: 0, due: today, reviews: 0, lapses: 0, xpDay: null };
}

export function rateCard(card, rating, today) {
  const reviews = card.reviews + 1;
  if (rating === RATING.AGAIN) {
    return { ...card, box: 0, due: today, reviews, lapses: card.lapses + 1 };
  }
  if (rating === RATING.HARD) {
    const wait = Math.max(1, Math.floor(INTERVALS[card.box] / 2));
    return { ...card, due: addDays(today, wait), reviews };
  }
  if (rating === RATING.EASY) {
    const box = Math.min(MAX_BOX, card.box + 1);
    return { ...card, box, due: addDays(today, INTERVALS[box]), reviews };
  }
  throw new Error(`Avaliação inválida: ${rating}`);
}

export const isDue = (card, today) => card.due <= today;
export const isMastered = (card) => card.box >= MASTERED_BOX;
