import { addDays, diffDays } from './dates.js';
import { XP_DAYS_KEPT } from './state.js';

export const XP = Object.freeze({ lesson: 20, perDifficulty: 5, card: 2, module: 50, exam: 200 });
const TITLES = [[20, 'Referência'], [15, 'Especialista'], [10, 'Praticante'], [5, 'Aprendiz'], [1, 'Iniciante']];

export const xpForLevel = (level) => 50 * level * (level - 1);

export function levelForXp(total) {
  let level = Math.max(1, Math.floor((1 + Math.sqrt(1 + 0.08 * Math.max(0, total))) / 2));
  while (xpForLevel(level + 1) <= total) level += 1;
  while (level > 1 && xpForLevel(level) > total) level -= 1;
  return level;
}

export const titleForLevel = (level) => TITLES.find(([min]) => level >= min)[1];

export function levelInfo(total) {
  const level = levelForXp(total);
  const current = total - xpForLevel(level);
  const needed = 100 * level;
  return { level, title: titleForLevel(level), current, needed, progress: current / needed };
}

export function updateStreak(streak, today) {
  if (streak.lastDay === today) return streak;
  const current = streak.lastDay && diffDays(streak.lastDay, today) === 1 ? streak.current + 1 : 1;
  return { current, best: Math.max(streak.best, current), lastDay: today };
}

export function displayStreak(streak, today) {
  if (!streak.lastDay) return 0;
  return diffDays(streak.lastDay, today) <= 1 ? streak.current : 0;
}

export function addXp(xp, amount, today) {
  const byDay = { ...xp.byDay, [today]: (xp.byDay[today] ?? 0) + amount };
  const oldest = addDays(today, -(XP_DAYS_KEPT - 1));
  for (const day of Object.keys(byDay)) if (day < oldest) delete byDay[day];
  return { total: xp.total + amount, byDay };
}

export function crossedGoal(xpBefore, xpAfter, goal, today) {
  return (xpBefore.byDay[today] ?? 0) < goal && (xpAfter.byDay[today] ?? 0) >= goal;
}
