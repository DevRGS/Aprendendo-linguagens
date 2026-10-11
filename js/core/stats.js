import { addDays } from './dates.js';
import { isMastered } from './srs.js';

function accuracyFor(state, prefix) {
  let seen = 0;
  let correct = 0;
  for (const [id, st] of Object.entries(state.questions)) {
    if (!id.startsWith(prefix)) continue;
    seen += st.seen;
    correct += st.correct;
  }
  return { seen, correct, rate: seen ? correct / seen : null };
}

export const languageAccuracy = (state, langId) => accuracyFor(state, `${langId}.`);
export const moduleAccuracy = (state, modKey) => accuracyFor(state, `${modKey}.`);

export function weakModules(state, moduleKeys, { minAnswers = 5, limit = 3 } = {}) {
  return moduleKeys
    .map((moduleKey) => ({ moduleKey, ...moduleAccuracy(state, moduleKey) }))
    .filter((m) => m.seen >= minAnswers && m.rate < 1)
    .sort((a, b) => a.rate - b.rate || b.seen - a.seen)
    .slice(0, limit);
}

export function weakestLesson(state, questions) {
  const wrongByLesson = new Map();
  for (const q of questions) {
    const st = state.questions[q.id];
    if (!st) continue;
    wrongByLesson.set(q.lesson, (wrongByLesson.get(q.lesson) ?? 0) + (st.seen - st.correct));
  }
  let best = null;
  let max = 0;
  for (const [lesson, wrong] of wrongByLesson) {
    if (wrong > max) { best = lesson; max = wrong; }
  }
  return best;
}

export function masteredCount(state, prefix = '') {
  return Object.entries(state.cards).filter(([id, card]) => id.startsWith(prefix) && isMastered(card)).length;
}

export function activityGrid(byDay, today, weeks = 12) {
  const days = weeks * 7;
  const start = addDays(today, -(days - 1));
  return Array.from({ length: days }, (_, i) => {
    const day = addDays(start, i);
    return { day, xp: byDay[day] ?? null };
  });
}

export function activityLevel(xp, goal) {
  if (xp === null || xp === undefined) return 0;
  if (xp <= 0) return 1;
  if (xp < goal / 2) return 2;
  if (xp < goal) return 3;
  return 4;
}

export function totals(state) {
  const acc = accuracyFor(state, '');
  return {
    answered: state.counters.answered,
    accuracy: acc.rate,
    cardReviews: state.counters.cardReviews,
    daysStudied: Object.keys(state.xp.byDay).length,
  };
}
