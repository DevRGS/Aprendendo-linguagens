import { newCard, rateCard } from './srs.js';
import { XP, addXp, updateStreak, crossedGoal, levelForXp } from './gamification.js';
import { checkAchievements } from './achievements.js';
import { lessonKey, moduleKey, isModuleComplete, EXAM_PASS } from './progress.js';
import { createInitialState, HISTORY_LIMIT } from './state.js';

const noEvents = () => ({ xpGained: 0, achievements: [], levelUp: null, moduleCompleted: null, examPassed: false });

function gainXp(s, amount, today) {
  const goal = s.profile?.dailyGoal ?? 50;
  const next = addXp(s.xp, amount, today);
  if (crossedGoal(s.xp, next, goal, today)) s.counters.goalDays += 1;
  s.xp = next;
}

// Dia com estudo de verdade: atualiza a sequência e marca o dia no calendário.
function touchStudy(s, today) {
  s.streak = updateStreak(s.streak, today);
  if (!(today in s.xp.byDay)) s.xp = addXp(s.xp, 0, today);
}

function unlockCards(s, cards, today) {
  for (const card of cards) if (!s.cards[card.id]) s.cards[card.id] = newCard(today);
}

function checkModuleCompletion(s, language, moduleId, today) {
  const module = language.modules.find((m) => m.id === moduleId);
  const key = moduleKey(language.id, moduleId);
  const entry = s.modules[key] ?? {};
  if (!module || entry.completedAt || !isModuleComplete(s, language, module)) return null;
  s.modules[key] = { ...entry, completedAt: today };
  gainXp(s, XP.module, today);
  return key;
}

function finalize(prev, s, ctx, extra = {}) {
  const unlocked = checkAchievements(s, ctx);
  for (const id of unlocked) s.achievements[id] = ctx.today;
  const before = levelForXp(prev.xp.total);
  const after = levelForXp(s.xp.total);
  return {
    state: s,
    events: { ...noEvents(), ...extra, xpGained: s.xp.total - prev.xp.total, achievements: unlocked, levelUp: after > before ? after : null },
  };
}

export function setProfile(state, { name, avatar, dailyGoal }, ctx) {
  const s = structuredClone(state);
  s.profile = {
    name: String(name).trim().slice(0, 60),
    avatar,
    dailyGoal,
    createdAt: state.profile?.createdAt ?? ctx.now.toISOString(),
  };
  return { state: s, events: noEvents() };
}

export function openLesson(state, { key }) {
  if (state.lastLesson === key) return { state, events: noEvents() };
  return { state: { ...state, lastLesson: key }, events: noEvents() };
}

export function completeLesson(state, { language, moduleId, lessonId, cards }, ctx) {
  const key = lessonKey(language.id, moduleId, lessonId);
  if (state.lessons[key]) return { state, events: noEvents() };
  const s = structuredClone(state);
  s.lessons[key] = { doneAt: ctx.today };
  unlockCards(s, cards.filter((c) => c.lesson === lessonId), ctx.today);
  touchStudy(s, ctx.today);
  gainXp(s, XP.lesson, ctx.today);
  const moduleCompleted = checkModuleCompletion(s, language, moduleId, ctx.today);
  return finalize(state, s, { ...ctx, event: { type: 'lessonCompleted', study: true } }, { moduleCompleted });
}

export function activateModuleCards(state, { language, moduleId, cards }, ctx) {
  const s = structuredClone(state);
  const key = moduleKey(language.id, moduleId);
  s.modules[key] = { ...(s.modules[key] ?? {}), cardsActivated: true };
  unlockCards(s, cards, ctx.today);
  return { state: s, events: noEvents() };
}

export function recordAnswer(state, { question, correct }, ctx) {
  const s = structuredClone(state);
  const { today } = ctx;
  const prev = s.questions[question.id] ?? { seen: 0, correct: 0, lastDay: null, lastOk: null, xpDay: null };
  const stat = { ...prev, seen: prev.seen + 1, correct: prev.correct + (correct ? 1 : 0), lastDay: today, lastOk: correct };
  s.counters.answered += 1;
  touchStudy(s, today);
  if (correct) {
    const idx = s.mistakes.indexOf(question.id);
    if (idx >= 0) {
      s.mistakes.splice(idx, 1);
      s.counters.mistakesFixed += 1;
    }
    if (prev.xpDay !== today) {
      gainXp(s, XP.perDifficulty * question.difficulty, today);
      stat.xpDay = today;
    }
  } else if (!s.mistakes.includes(question.id)) {
    s.mistakes.push(question.id);
  }
  s.questions[question.id] = stat;
  return finalize(state, s, { ...ctx, event: { type: 'answer', study: true } });
}

export function finishQuiz(state, payload, ctx) {
  const { kind, mode, scopeLabel, moduleKeys, questionIds, wrongIds, total, correct, durationSec, language, moduleId } = payload;
  const s = structuredClone(state);
  const { today } = ctx;
  const extra = {};
  s.counters.quizzes += 1;
  s.history.unshift({
    id: `q${s.counters.quizzes}`, at: ctx.now.toISOString(), kind, mode, scopeLabel, moduleKeys, total, correct, durationSec, wrongIds,
  });
  s.history = s.history.slice(0, HISTORY_LIMIT);
  s.lastQuizIds = questionIds;
  const rate = total ? correct / total : 0;
  if (kind === 'practice') {
    const key = moduleKey(language.id, moduleId);
    const entry = s.modules[key] ?? {};
    s.modules[key] = { ...entry, bestPractice: Math.max(entry.bestPractice ?? 0, rate) };
    extra.moduleCompleted = checkModuleCompletion(s, language, moduleId, today);
  }
  if (kind === 'exam') {
    const entry = s.exams[language.id] ?? {};
    const next = { ...entry, best: Math.max(entry.best ?? 0, rate) };
    if (rate >= EXAM_PASS && !entry.passedAt) {
      next.passedAt = today;
      gainXp(s, XP.exam, today);
      extra.examPassed = true;
    }
    s.exams[language.id] = next;
  }
  return finalize(state, s, { ...ctx, event: { type: 'quizFinished', kind, mode, total, correct } }, extra);
}

export function reviewCard(state, { cardId, rating }, ctx) {
  const card = state.cards[cardId];
  if (!card) return { state, events: noEvents() };
  const s = structuredClone(state);
  const firstToday = card.xpDay !== ctx.today;
  s.cards[cardId] = { ...rateCard(card, rating, ctx.today), xpDay: ctx.today };
  s.counters.cardReviews += 1;
  touchStudy(s, ctx.today);
  if (firstToday) gainXp(s, XP.card, ctx.today);
  return finalize(state, s, { ...ctx, event: { type: 'cardReviewed', study: true } });
}

export function updateBackupMeta(state, patch, ctx) {
  const s = structuredClone(state);
  s.backup = { ...s.backup, ...patch };
  return finalize(state, s, { ...ctx, event: { type: 'backup' } });
}

// Cartas e erros cujo conteúdo foi removido não podem ficar contando como pendentes para sempre.
export function pruneOrphans(state, { cardIds, questionIds }) {
  const staleCards = Object.keys(state.cards).filter((id) => !cardIds.has(id));
  const staleMistakes = state.mistakes.filter((id) => !questionIds.has(id));
  if (!staleCards.length && !staleMistakes.length) return { state, events: noEvents() };
  const s = structuredClone(state);
  for (const id of staleCards) delete s.cards[id];
  s.mistakes = s.mistakes.filter((id) => questionIds.has(id));
  return { state: s, events: noEvents() };
}

export function replaceState(_state, { state }) {
  return { state, events: noEvents() };
}

export function resetProgress() {
  return { state: createInitialState(), events: noEvents() };
}
