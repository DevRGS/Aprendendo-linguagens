import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CURRENT_SCHEMA, createInitialState, validateState, normalizeState, runMigrations, migrate } from '../../js/core/state.js';
import { AVATARS } from '../../js/config.js';

test('avatar fora da lista (como os antigos de duas partes) volta para o primeiro da lista', () => {
  const avatarDe = (avatar) => normalizeState({ ...createInitialState(), profile: { name: 'Rafa', avatar, dailyGoal: 50 } }).profile.avatar;
  assert.equal(avatarDe('🦊'), '🦊');
  for (const antigo of ['🧑‍💻', '👩‍💻', '👨‍💻', 'qualquer coisa']) assert.equal(avatarDe(antigo), AVATARS[0], antigo);
});

test('estado inicial é válido e passa pela migração', () => {
  const s = createInitialState();
  assert.equal(s.schema, CURRENT_SCHEMA);
  assert.equal(s.profile, null);
  assert.equal(validateState(s), null);
  const r = migrate(JSON.parse(JSON.stringify(s)));
  assert.equal(r.ok, true);
  assert.deepEqual(r.state, s);
});

test('estado de versão mais nova é recusado como "newer"', () => {
  assert.deepEqual(migrate({ ...createInitialState(), schema: CURRENT_SCHEMA + 1 }), { ok: false, reason: 'newer' });
});

test('lixo é recusado como "invalid"', () => {
  assert.equal(migrate(null).reason, 'invalid');
  assert.equal(migrate('texto').reason, 'invalid');
  assert.equal(migrate({ lessons: {} }).reason, 'invalid');
  assert.equal(migrate({ schema: 0 }).reason, 'invalid');
  assert.equal(migrate({ ...createInitialState(), history: 'x' }).reason, 'invalid');
  assert.equal(migrate({ ...createInitialState(), profile: { name: 42 } }).reason, 'invalid');
  assert.equal(migrate({ ...createInitialState(), xp: { total: 'muito' } }).reason, 'invalid');
});

test('validateState aponta o campo com problema', () => {
  assert.equal(validateState({ ...createInitialState(), cards: [] }), 'campo cards inválido');
  assert.equal(validateState({ ...createInitialState(), mistakes: {} }), 'campo mistakes inválido');
});

test('runMigrations aplica os passos em ordem', () => {
  const migrations = {
    1: (s) => ({ ...s, schema: 2, passo1: true }),
    2: (s) => ({ ...s, schema: 3, passo2: true }),
  };
  const out = runMigrations({ schema: 1 }, migrations, 3);
  assert.deepEqual(out, { schema: 3, passo1: true, passo2: true });
  assert.throws(() => runMigrations({ schema: 1 }, {}, 2), /Sem migração/);
});

test('migrate usa as migrações e o alvo informados', () => {
  const migrations = { 1: (s) => ({ ...s, schema: 2 }) };
  const r = migrate(createInitialState(), { migrations, target: 2 });
  assert.equal(r.ok, true);
  assert.equal(r.state.schema, 2);
});

test('normalizeState completa campos ausentes', () => {
  const s = normalizeState({ schema: 1, counters: { answered: 5 } });
  assert.equal(s.counters.answered, 5);
  assert.equal(s.counters.goalDays, 0);
  assert.equal(s.counters.quizzes, 0);
  assert.deepEqual(s.mistakes, []);
  assert.deepEqual(s.backup.autoFileEnabled, false);
});

test('normalizeState conserta ou descarta entradas internas inválidas', () => {
  const s = normalizeState({
    schema: 1,
    profile: { name: 'Rafa', avatar: 5, dailyGoal: 'muito', createdAt: 3 },
    lessons: { 'java.a.x': { doneAt: '2026-10-01' }, 'java.a.y': null, 'java.a.z': { doneAt: 5 } },
    modules: { 'java.a': { bestPractice: 0.8, completedAt: 'ontem', cardsActivated: 'sim' }, 'java.b': 'x' },
    exams: { java: { best: 0.9, passedAt: '2026-10-01' }, sql: 7, go: { best: 'x' } },
    questions: {
      'java.a.q01': { seen: 2, correct: 1, lastDay: '2026-10-01', lastOk: true, xpDay: null },
      'java.a.q02': null,
      'java.a.q03': { seen: 'x', correct: 0 },
      'java.a.q04': { seen: 1, correct: 1, lastDay: 99 },
    },
    cards: {
      ok: { box: 2, due: '2026-10-11', reviews: 1, lapses: 0, xpDay: null },
      semContadores: { box: 1, due: '2026-10-11' },
      nulo: null,
      ruim: { box: 'a', due: '2026-10-11' },
      semDue: { box: 1 },
      foraDaFaixa: { box: 9, due: '2026-10-11' },
    },
    mistakes: ['java.a.q01', 5, null, 'java.a.q01'],
    counters: { answered: 'x', cardReviews: 2, goalDays: -1 },
    xp: { total: 10, byDay: { '2026-10-01': 10, ontem: 5, '2026-10-02': 'x' } },
    streak: { current: 'x', best: 3, lastDay: 20261011 },
    achievements: { 'primeiros-passos': '2026-10-01', centena: 5 },
    history: [
      { id: 'q1', at: '2026-10-01T10:00:00.000Z', kind: 'quiz', mode: 'estudo', total: 1, correct: 1, durationSec: 1, wrongIds: [] },
      { id: 'q2' },
      null,
    ],
    lastLesson: 5,
    lastQuizIds: ['a', 7],
    backup: { lastExportAt: 3, autoFileEnabled: 'sim', lastAutoWriteAt: null, autoFileError: 9 },
  });
  assert.deepEqual(s.profile, { name: 'Rafa', avatar: AVATARS[0], dailyGoal: 50, createdAt: null });
  assert.deepEqual(Object.keys(s.lessons), ['java.a.x']);
  assert.deepEqual(s.modules, { 'java.a': { bestPractice: 0.8 } });
  assert.deepEqual(s.exams, { java: { best: 0.9, passedAt: '2026-10-01' } });
  assert.deepEqual(Object.keys(s.questions), ['java.a.q01', 'java.a.q04']);
  assert.equal(s.questions['java.a.q04'].lastDay, null);
  assert.deepEqual(Object.keys(s.cards), ['ok', 'semContadores']);
  assert.deepEqual(s.cards.semContadores, { box: 1, due: '2026-10-11', reviews: 0, lapses: 0, xpDay: null });
  assert.deepEqual(s.mistakes, ['java.a.q01']);
  assert.deepEqual(s.counters, { answered: 0, cardReviews: 2, mistakesFixed: 0, goalDays: 0, quizzes: 0 });
  assert.deepEqual(s.xp, { total: 10, byDay: { '2026-10-01': 10 } });
  assert.deepEqual(s.streak, { current: 0, best: 3, lastDay: null });
  assert.deepEqual(s.achievements, { 'primeiros-passos': '2026-10-01' });
  assert.deepEqual(s.history.map((h) => h.id), ['q1']);
  assert.deepEqual(s.history[0].moduleKeys, []);
  assert.equal(s.lastLesson, null);
  assert.deepEqual(s.lastQuizIds, ['a']);
  assert.deepEqual(s.backup, { lastExportAt: null, autoFileEnabled: false, lastAutoWriteAt: null, autoFileError: null });
});
