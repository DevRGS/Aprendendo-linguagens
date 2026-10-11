import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CURRENT_SCHEMA, createInitialState, validateState, normalizeState, runMigrations, migrate } from '../../js/core/state.js';

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
