import { levelForXp } from './gamification.js';
import { isMastered } from './srs.js';
import { isLanguageComplete } from './progress.js';

const masteredCount = (s) => Object.values(s.cards).filter(isMastered).length;
const languagesStudied = (s) => new Set(Object.keys(s.lessons).map((key) => key.split('.')[0])).size;
const finished = (ev) => Boolean(ev) && ev.type === 'quizFinished';
const studyHour = (c) => (c.event?.study ? c.now.getHours() : null);

export const ACHIEVEMENT_RULES = [
  { id: 'primeiros-passos', test: (s) => Object.keys(s.lessons).length >= 1 },
  { id: 'modulo-na-conta', test: (s) => Object.values(s.modules).some((m) => m.completedAt) },
  { id: 'formatura', test: (s, c) => (c.languages ?? []).some((l) => isLanguageComplete(s, l)) },
  { id: 'gabaritou', test: (s, c) => finished(c.event) && c.event.total >= 10 && c.event.correct === c.event.total },
  { id: 'centena', test: (s) => s.counters.answered >= 100 },
  { id: 'mil-respostas', test: (s) => s.counters.answered >= 1000 },
  { id: 'sequencia-7', test: (s) => s.streak.best >= 7 },
  { id: 'sequencia-30', test: (s) => s.streak.best >= 30 },
  { id: 'sequencia-100', test: (s) => s.streak.best >= 100 },
  { id: 'meta-7', test: (s) => s.counters.goalDays >= 7 },
  { id: 'poliglota', test: (s) => languagesStudied(s) >= 3 },
  { id: 'na-ponta-da-lingua', test: (s) => masteredCount(s) >= 1 },
  { id: 'memoria-de-elefante', test: (s) => masteredCount(s) >= 100 },
  { id: 'revisor', test: (s) => s.counters.cardReviews >= 500 },
  { id: 'persistente', test: (s) => s.counters.mistakesFixed >= 20 },
  {
    id: 'simulado-de-respeito',
    test: (s, c) => finished(c.event) && c.event.mode === 'simulado' && c.event.total >= 20 && c.event.correct / c.event.total >= 0.8,
  },
  { id: 'coruja', test: (s, c) => { const h = studyHour(c); return h !== null && h <= 4; } },
  { id: 'madrugador', test: (s, c) => { const h = studyHour(c); return h !== null && h >= 5 && h <= 6; } },
  { id: 'seguro-morreu-de-velho', test: (s) => Boolean(s.backup.lastExportAt || s.backup.autoFileEnabled) },
  { id: 'subindo-de-nivel', test: (s) => levelForXp(s.xp.total) >= 5 },
  { id: 'dois-digitos', test: (s) => levelForXp(s.xp.total) >= 10 },
];

export const ACHIEVEMENT_IDS = ACHIEVEMENT_RULES.map((r) => r.id);

export function checkAchievements(state, ctx) {
  return ACHIEVEMENT_RULES.filter((r) => !state.achievements[r.id] && r.test(state, ctx)).map((r) => r.id);
}
