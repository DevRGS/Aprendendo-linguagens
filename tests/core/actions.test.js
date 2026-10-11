import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../../js/core/state.js';
import { RATING } from '../../js/core/srs.js';
import * as A from '../../js/core/actions.js';

const language = { id: 'java', modules: [{ id: 'fund', lessons: [{ id: 'a', minutes: 5 }, { id: 'b', minutes: 5 }] }] };
const cards = [{ id: 'java.fund.f01', lesson: 'a' }, { id: 'java.fund.f02', lesson: 'b' }];
const ctxAt = (today = '2026-10-11', hour = 12) => {
  const [y, m, d] = today.split('-').map(Number);
  return { today, now: new Date(y, m - 1, d, hour), languages: [language] };
};
const withProfile = () => A.setProfile(createInitialState(), { name: '  Rafa  ', avatar: '🦊', dailyGoal: 50 }, ctxAt()).state;
const q = (n, difficulty = 1) => ({ id: `java.fund.q0${n}`, difficulty });
const quiz = (extra) => ({ kind: 'quiz', mode: 'estudo', scopeLabel: 'x', moduleKeys: ['java.fund'], questionIds: [], wrongIds: [], total: 1, correct: 1, durationSec: 1, ...extra });

test('setProfile limpa o nome e preserva createdAt na edição', () => {
  const s = withProfile();
  assert.equal(s.profile.name, 'Rafa');
  const edited = A.setProfile(s, { name: 'Rafael', avatar: '🚀', dailyGoal: 100 }, ctxAt('2026-12-01')).state;
  assert.equal(edited.profile.createdAt, s.profile.createdAt);
  assert.equal(edited.profile.dailyGoal, 100);
});

test('openLesson guarda a última aula e não muda nada se for a mesma', () => {
  const s = A.openLesson(withProfile(), { key: 'java.fund.a' }).state;
  assert.equal(s.lastLesson, 'java.fund.a');
  assert.equal(A.openLesson(s, { key: 'java.fund.a' }).state, s);
});

test('completeLesson registra, libera só as cartas da aula, dá XP e inicia a sequência', () => {
  const { state, events } = A.completeLesson(withProfile(), { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt());
  assert.deepEqual(state.lessons['java.fund.a'], { doneAt: '2026-10-11' });
  assert.deepEqual(state.cards['java.fund.f01'], { box: 0, due: '2026-10-11', reviews: 0, lapses: 0, xpDay: null });
  assert.equal(state.cards['java.fund.f02'], undefined);
  assert.equal(state.xp.total, 20);
  assert.equal(state.streak.current, 1);
  assert.equal(events.xpGained, 20);
  assert.deepEqual(events.achievements, ['primeiros-passos']);
  assert.equal(state.achievements['primeiros-passos'], '2026-10-11');
});

test('completeLesson repetida não muda nada', () => {
  const s = A.completeLesson(withProfile(), { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state;
  assert.equal(A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state, s);
});

test('a última aula conclui o módulo quando a prática já passou', () => {
  let s = withProfile();
  s = A.finishQuiz(s, quiz({ kind: 'practice', total: 5, correct: 3, language, moduleId: 'fund' }), ctxAt()).state;
  s = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state;
  const r = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'b', cards }, ctxAt());
  assert.equal(r.events.moduleCompleted, 'java.fund');
  assert.equal(r.state.modules['java.fund'].completedAt, '2026-10-11');
  assert.equal(r.state.xp.total, 20 + 20 + 50);
  assert.ok(r.events.achievements.includes('modulo-na-conta'));
});

test('recordAnswer: erros, correção, XP uma vez por dia e dificuldade', () => {
  let s = withProfile();
  s = A.recordAnswer(s, { question: q(1, 2), correct: false }, ctxAt()).state;
  s = A.recordAnswer(s, { question: q(1, 2), correct: false }, ctxAt()).state;
  assert.deepEqual(s.mistakes, ['java.fund.q01']);
  assert.equal(s.xp.total, 0);
  s = A.recordAnswer(s, { question: q(1, 2), correct: true }, ctxAt()).state;
  assert.deepEqual(s.mistakes, []);
  assert.equal(s.counters.mistakesFixed, 1);
  assert.equal(s.xp.total, 10);
  s = A.recordAnswer(s, { question: q(1, 2), correct: true }, ctxAt()).state;
  assert.equal(s.xp.total, 10);
  s = A.recordAnswer(s, { question: q(1, 2), correct: true }, ctxAt('2026-10-12')).state;
  assert.equal(s.xp.total, 20);
  assert.deepEqual(s.questions['java.fund.q01'], { seen: 5, correct: 3, lastDay: '2026-10-12', lastOk: true, xpDay: '2026-10-12' });
  assert.equal(s.counters.answered, 5);
  assert.equal(s.streak.current, 2);
  assert.equal(s.xp.byDay['2026-10-11'], 10);
});

test('resposta errada também conta como dia de estudo', () => {
  const s = A.recordAnswer(withProfile(), { question: q(1), correct: false }, ctxAt()).state;
  assert.equal(s.streak.current, 1);
  assert.equal(s.xp.byDay['2026-10-11'], 0);
});

test('meta diária conta uma vez por dia', () => {
  let s = withProfile();
  s = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state;
  s = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'b', cards }, ctxAt()).state;
  assert.equal(s.counters.goalDays, 0);
  s = A.recordAnswer(s, { question: q(1, 3), correct: true }, ctxAt()).state;
  assert.equal(s.counters.goalDays, 1);
  s = A.recordAnswer(s, { question: q(2, 1), correct: true }, ctxAt()).state;
  assert.equal(s.counters.goalDays, 1);
});

test('finishQuiz guarda histórico (até 200), ids únicos e o último quiz', () => {
  let s = withProfile();
  for (let i = 0; i < 205; i++) s = A.finishQuiz(s, quiz({ questionIds: [`id${i}`] }), ctxAt()).state;
  assert.equal(s.history.length, 200);
  assert.deepEqual(s.lastQuizIds, ['id204']);
  assert.equal(new Set(s.history.map((h) => h.id)).size, 200);
  assert.equal(s.history[0].id, 'q205');
});

test('prova: aprovação na primeira vez dá 200 XP; depois só melhora a nota', () => {
  let r = A.finishQuiz(withProfile(), quiz({ kind: 'exam', mode: 'simulado', total: 10, correct: 6, language }), ctxAt());
  assert.equal(r.state.exams.java.best, 0.6);
  assert.equal(r.state.exams.java.passedAt, undefined);
  assert.equal(r.events.examPassed, false);
  r = A.finishQuiz(r.state, quiz({ kind: 'exam', mode: 'simulado', total: 10, correct: 8, language }), ctxAt('2026-10-12'));
  assert.equal(r.state.exams.java.passedAt, '2026-10-12');
  assert.equal(r.events.examPassed, true);
  assert.equal(r.state.xp.total, 200);
  const again = A.finishQuiz(r.state, quiz({ kind: 'exam', mode: 'simulado', total: 10, correct: 10, language }), ctxAt('2026-10-13'));
  assert.equal(again.state.exams.java.passedAt, '2026-10-12');
  assert.equal(again.state.exams.java.best, 1);
  assert.equal(again.state.xp.total, 200);
  assert.ok(again.events.achievements.includes('gabaritou'));
});

test('revisão (kind review) não altera prática nem prova', () => {
  const s = A.finishQuiz(withProfile(), quiz({ kind: 'review', total: 2, correct: 2, language, moduleId: 'fund' }), ctxAt()).state;
  assert.deepEqual(s.modules, {});
  assert.deepEqual(s.exams, {});
  assert.equal(s.history.length, 1);
});

test('formatura quando tudo está concluído', () => {
  let s = withProfile();
  s = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state;
  s = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'b', cards }, ctxAt()).state;
  s = A.finishQuiz(s, quiz({ kind: 'practice', total: 5, correct: 5, language, moduleId: 'fund' }), ctxAt()).state;
  const r = A.finishQuiz(s, quiz({ kind: 'exam', mode: 'simulado', total: 10, correct: 7, language }), ctxAt());
  assert.ok(r.events.achievements.includes('formatura'));
});

test('reviewCard reagenda, conta revisão e dá XP uma vez por carta por dia', () => {
  let s = A.completeLesson(withProfile(), { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state;
  const xp0 = s.xp.total;
  s = A.reviewCard(s, { cardId: 'java.fund.f01', rating: RATING.AGAIN }, ctxAt()).state;
  assert.equal(s.xp.total, xp0 + 2);
  s = A.reviewCard(s, { cardId: 'java.fund.f01', rating: RATING.EASY }, ctxAt()).state;
  assert.equal(s.xp.total, xp0 + 2);
  assert.deepEqual(s.cards['java.fund.f01'], { box: 1, due: '2026-10-12', reviews: 2, lapses: 1, xpDay: '2026-10-11' });
  assert.equal(s.counters.cardReviews, 2);
  assert.equal(A.reviewCard(s, { cardId: 'nao.existe.f01', rating: RATING.EASY }, ctxAt()).state, s);
});

test('subir de nível gera evento', () => {
  const s = withProfile();
  s.xp = { total: 90, byDay: {} };
  const r = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt());
  assert.equal(r.events.levelUp, 2);
});

test('estudar de madrugada dá a conquista coruja', () => {
  const r = A.recordAnswer(withProfile(), { question: q(1), correct: false }, ctxAt('2026-10-11', 2));
  assert.ok(r.events.achievements.includes('coruja'));
});

test('activateModuleCards libera todas as cartas do módulo', () => {
  const s = A.activateModuleCards(withProfile(), { language, moduleId: 'fund', cards }, ctxAt()).state;
  assert.equal(s.modules['java.fund'].cardsActivated, true);
  assert.ok(s.cards['java.fund.f01'] && s.cards['java.fund.f02']);
});

test('updateBackupMeta grava e libera a conquista do backup', () => {
  const r = A.updateBackupMeta(withProfile(), { lastExportAt: '2026-10-11T12:00:00.000Z' }, ctxAt());
  assert.equal(r.state.backup.lastExportAt, '2026-10-11T12:00:00.000Z');
  assert.ok(r.events.achievements.includes('seguro-morreu-de-velho'));
});

test('replaceState e resetProgress', () => {
  const other = { ...createInitialState(), lastLesson: 'x' };
  assert.equal(A.replaceState(withProfile(), { state: other }).state, other);
  assert.deepEqual(A.resetProgress().state, createInitialState());
});

test('ações não alteram o estado recebido', () => {
  const s = withProfile();
  const snapshot = JSON.stringify(s);
  A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt());
  A.recordAnswer(s, { question: q(1), correct: false }, ctxAt());
  A.finishQuiz(s, quiz({ kind: 'practice', total: 5, correct: 5, language, moduleId: 'fund' }), ctxAt());
  assert.equal(JSON.stringify(s), snapshot);
});
