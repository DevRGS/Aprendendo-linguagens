import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../../js/core/state.js';
import { ACHIEVEMENT_IDS, ACHIEVEMENT_RULES, checkAchievements } from '../../js/core/achievements.js';

const base = () => createInitialState();
const ctx = (extra = {}) => ({ now: new Date(2026, 9, 11, 12), languages: [], event: null, ...extra });
const quiz = (total, correct, mode = 'estudo') => ({ type: 'quizFinished', kind: 'quiz', mode, total, correct });

test('são 21 conquistas com ids únicos', () => {
  assert.equal(ACHIEVEMENT_IDS.length, 21);
  assert.equal(new Set(ACHIEVEMENT_IDS).size, 21);
  assert.equal(ACHIEVEMENT_RULES.every((r) => typeof r.test === 'function'), true);
});

test('estado inicial não ganha nenhuma conquista', () => {
  assert.deepEqual(checkAchievements(base(), ctx()), []);
});

test('conquistas por contadores e sequência', () => {
  const s = base();
  Object.assign(s.counters, { answered: 100, cardReviews: 500, mistakesFixed: 20, goalDays: 7 });
  s.streak.best = 30;
  const got = checkAchievements(s, ctx());
  for (const id of ['centena', 'revisor', 'persistente', 'meta-7', 'sequencia-7', 'sequencia-30']) assert.ok(got.includes(id), id);
  for (const id of ['mil-respostas', 'sequencia-100', 'primeiros-passos']) assert.ok(!got.includes(id), id);
});

test('conquista já ganha não volta', () => {
  const s = base();
  s.lessons['java.m.a'] = { doneAt: '2026-10-01' };
  assert.ok(checkAchievements(s, ctx()).includes('primeiros-passos'));
  s.achievements['primeiros-passos'] = '2026-10-01';
  assert.ok(!checkAchievements(s, ctx()).includes('primeiros-passos'));
});

test('gabaritou e simulado-de-respeito dependem do quiz terminado', () => {
  assert.ok(checkAchievements(base(), ctx({ event: quiz(10, 10) })).includes('gabaritou'));
  assert.ok(!checkAchievements(base(), ctx({ event: quiz(9, 9) })).includes('gabaritou'));
  assert.ok(checkAchievements(base(), ctx({ event: quiz(20, 16, 'simulado') })).includes('simulado-de-respeito'));
  assert.ok(!checkAchievements(base(), ctx({ event: quiz(20, 16, 'estudo') })).includes('simulado-de-respeito'));
  assert.ok(!checkAchievements(base(), ctx({ event: quiz(19, 19, 'simulado') })).includes('simulado-de-respeito'));
});

test('coruja e madrugador só contam estudo no horário', () => {
  const at = (h) => new Date(2026, 9, 11, h);
  const study = { type: 'answer', study: true };
  assert.ok(checkAchievements(base(), ctx({ now: at(3), event: study })).includes('coruja'));
  assert.ok(!checkAchievements(base(), ctx({ now: at(3), event: { type: 'backup' } })).includes('coruja'));
  assert.ok(checkAchievements(base(), ctx({ now: at(6), event: study })).includes('madrugador'));
  const seteHoras = checkAchievements(base(), ctx({ now: at(7), event: study }));
  assert.ok(!seteHoras.includes('madrugador') && !seteHoras.includes('coruja'));
});

test('poliglota conta linguagens diferentes nas aulas concluídas', () => {
  const s = base();
  s.lessons = { 'java.m.a': {}, 'sql.m.b': {} };
  assert.ok(!checkAchievements(s, ctx()).includes('poliglota'));
  s.lessons['go.m.c'] = {};
  assert.ok(checkAchievements(s, ctx()).includes('poliglota'));
});

test('cartas dominadas', () => {
  const s = base();
  s.cards['java.m.f01'] = { box: 5 };
  assert.ok(checkAchievements(s, ctx()).includes('na-ponta-da-lingua'));
  for (let i = 0; i < 100; i++) s.cards[`java.m.f${i + 10}`] = { box: 6 };
  assert.ok(checkAchievements(s, ctx()).includes('memoria-de-elefante'));
});

test('níveis, backup e módulo', () => {
  const s = base();
  s.xp.total = 4500;
  s.backup.lastExportAt = '2026-10-11T12:00:00.000Z';
  s.modules['java.m'] = { completedAt: '2026-10-11' };
  const got = checkAchievements(s, ctx());
  for (const id of ['subindo-de-nivel', 'dois-digitos', 'seguro-morreu-de-velho', 'modulo-na-conta']) assert.ok(got.includes(id), id);
});

test('formatura usa o conteúdo das linguagens', () => {
  const language = { id: 'java', modules: [{ id: 'm', lessons: [{ id: 'a', minutes: 5 }] }] };
  const s = base();
  s.lessons['java.m.a'] = { doneAt: '2026-10-01' };
  s.modules['java.m'] = { bestPractice: 1, completedAt: '2026-10-01' };
  s.exams.java = { best: 0.7, passedAt: '2026-10-02' };
  assert.ok(checkAchievements(s, ctx({ languages: [language] })).includes('formatura'));
  s.exams.java.best = 0.5;
  assert.ok(!checkAchievements(s, ctx({ languages: [language] })).includes('formatura'));
});
