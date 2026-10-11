import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, CURRENT_SCHEMA } from '../../js/core/state.js';
import { APP_ID, makeEnvelope, parseEnvelope, slugify, backupFileName, hasProgress, needsBackupReminder } from '../../js/core/backup-format.js';

const withProfile = (createdAt = new Date(2026, 9, 1, 12).toISOString()) => ({
  ...createInitialState(),
  profile: { name: 'Rafa', avatar: '🦊', dailyGoal: 50, createdAt },
});

test('envelope vai e volta sem perder nada', () => {
  const s = withProfile();
  const env = makeEnvelope(s, new Date('2026-10-11T12:00:00Z'));
  assert.equal(env.app, APP_ID);
  assert.equal(env.exportedAt, '2026-10-11T12:00:00.000Z');
  const r = parseEnvelope(JSON.stringify(env));
  assert.equal(r.ok, true);
  assert.deepEqual(r.state, s);
  assert.equal(r.exportedAt, '2026-10-11T12:00:00.000Z');
});

test('parseEnvelope recusa com o motivo certo', () => {
  assert.deepEqual(parseEnvelope('{ quebrado'), { ok: false, reason: 'json' });
  assert.deepEqual(parseEnvelope(JSON.stringify({ app: 'outro-app', data: {} })), { ok: false, reason: 'app' });
  assert.deepEqual(parseEnvelope(JSON.stringify({ app: APP_ID, schema: CURRENT_SCHEMA + 1, data: {} })), { ok: false, reason: 'newer' });
  assert.deepEqual(parseEnvelope(JSON.stringify({ app: APP_ID, schema: 1, data: { schema: 1, history: 'x' } })), { ok: false, reason: 'invalid' });
  assert.deepEqual(parseEnvelope('null'), { ok: false, reason: 'app' });
});

test('slugify e nome do arquivo', () => {
  assert.equal(slugify('Rafael Gonçalves'), 'rafael-goncalves');
  assert.equal(slugify('  !!! '), 'perfil');
  assert.equal(slugify(undefined), 'perfil');
  assert.equal(backupFileName('Ana Júlia', '2026-10-11'), 'progresso-ana-julia-2026-10-11.json');
});

test('hasProgress', () => {
  const s = withProfile();
  assert.equal(hasProgress(s), false);
  assert.equal(hasProgress({ ...s, counters: { ...s.counters, answered: 1 } }), true);
  assert.equal(hasProgress({ ...s, lessons: { 'java.m.a': { doneAt: '2026-10-11' } } }), true);
});

test('lembrete de backup depois de 7 dias com progresso', () => {
  const s = { ...withProfile(), xp: { total: 10, byDay: {} } };
  assert.equal(needsBackupReminder({ state: s, today: '2026-10-07' }), false);
  assert.equal(needsBackupReminder({ state: s, today: '2026-10-08' }), true);
  const exported = { ...s, backup: { ...s.backup, lastExportAt: new Date(2026, 9, 5, 9).toISOString() } };
  assert.equal(needsBackupReminder({ state: exported, today: '2026-10-11' }), false);
  assert.equal(needsBackupReminder({ state: exported, today: '2026-10-12' }), true);
  assert.equal(needsBackupReminder({ state: exported, today: '2026-10-12', dismissedUntil: '2026-10-14' }), false);
  assert.equal(needsBackupReminder({ state: exported, today: '2026-10-14', dismissedUntil: '2026-10-14' }), true);
  assert.equal(needsBackupReminder({ state: exported, today: '2026-10-12', autoHealthy: true }), false);
  assert.equal(needsBackupReminder({ state: withProfile(), today: '2026-12-01' }), false);
});
