import { addDays } from './dates.js';
import { displayStreak, updateStreak } from './gamification.js';
import { XP_DAYS_KEPT } from './state.js';

// As ações trabalham sobre uma cópia do estado. Congelar a meta antes do primeiro crédito
// permite distinguir dias novos de dias que já tinham atividade em um backup antigo.
export function startGoalDay(state, today) {
  const days = state.intensiva.days;
  if (days[today]) return;
  days[today] = {
    goal: state.profile?.dailyGoal ?? 50,
    reached: false,
    legacy: Object.hasOwn(state.xp.byDay, today),
  };
  const oldest = addDays(today, 1 - XP_DAYS_KEPT);
  for (const date of Object.keys(days)) if (date < oldest) delete days[date];
}

export function markGoal(state, today) {
  const record = state.intensiva.days[today];
  if (!record || record.reached || (state.xp.byDay[today] ?? 0) < record.goal) return false;
  record.reached = true;
  if (!record.legacy) state.counters.goalDays++;
  Object.assign(state.intensiva, updateStreak(state.intensiva, today));
  return true;
}

export function resumoIntensiva(state, today) {
  const week = state.intensiva ?? { days: {}, best: 0, current: 0, lastDay: null };
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);
    const record = week.days[date];
    const xp = state.xp.byDay[date] ?? 0;
    let status = 'empty';
    if (record) status = record.reached ? 'goal' : 'studied';
    else if (Object.hasOwn(state.xp.byDay, date)) status = 'unknown';
    return { date, status, xp, goal: record?.goal ?? null };
  });
  return { current: displayStreak(week, today), best: week.best, goal: week.days[today]?.goal ?? state.profile?.dailyGoal ?? 50, days };
}
