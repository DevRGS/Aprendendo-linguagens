import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xpForLevel, levelForXp, titleForLevel, levelInfo, updateStreak, displayStreak, addXp, crossedGoal } from '../../js/core/gamification.js';

test('níveis: 100 × N para passar do N ao N+1', () => {
  assert.equal(xpForLevel(1), 0);
  assert.equal(xpForLevel(2), 100);
  assert.equal(xpForLevel(5), 1000);
  assert.equal(xpForLevel(10), 4500);
  const casos = [[0, 1], [99, 1], [100, 2], [299, 2], [300, 3], [999, 4], [1000, 5], [4499, 9], [4500, 10], [1e6, 141]];
  for (const [xp, nivel] of casos) assert.equal(levelForXp(xp), nivel, `xp ${xp}`);
});

test('títulos por faixa de nível', () => {
  assert.equal(titleForLevel(1), 'Iniciante');
  assert.equal(titleForLevel(4), 'Iniciante');
  assert.equal(titleForLevel(5), 'Aprendiz');
  assert.equal(titleForLevel(10), 'Praticante');
  assert.equal(titleForLevel(15), 'Especialista');
  assert.equal(titleForLevel(20), 'Referência');
  assert.equal(titleForLevel(60), 'Referência');
});

test('levelInfo mostra o andamento até o próximo nível', () => {
  assert.deepEqual(levelInfo(150), { level: 2, title: 'Iniciante', current: 50, needed: 200, progress: 0.25 });
});

test('sequência: ontem soma, hoje mantém, dia pulado recomeça', () => {
  const zero = { current: 0, best: 0, lastDay: null };
  const d1 = updateStreak(zero, '2026-10-11');
  assert.deepEqual(d1, { current: 1, best: 1, lastDay: '2026-10-11' });
  assert.equal(updateStreak(d1, '2026-10-11'), d1);
  const d2 = updateStreak(d1, '2026-10-12');
  assert.deepEqual(d2, { current: 2, best: 2, lastDay: '2026-10-12' });
  assert.deepEqual(updateStreak(d2, '2026-10-15'), { current: 1, best: 2, lastDay: '2026-10-15' });
});

test('displayStreak zera quando a sequência já quebrou', () => {
  const s = { current: 5, best: 5, lastDay: '2026-10-10' };
  assert.equal(displayStreak(s, '2026-10-10'), 5);
  assert.equal(displayStreak(s, '2026-10-11'), 5);
  assert.equal(displayStreak(s, '2026-10-12'), 0);
  assert.equal(displayStreak({ current: 0, best: 0, lastDay: null }, '2026-10-12'), 0);
});

test('addXp soma no total e no dia e descarta dias antigos', () => {
  const xp = { total: 30, byDay: { '2025-01-01': 10, '2026-10-10': 20 } };
  assert.deepEqual(addXp(xp, 15, '2026-10-11'), { total: 45, byDay: { '2026-10-10': 20, '2026-10-11': 15 } });
  assert.deepEqual(addXp({ total: 0, byDay: {} }, 0, '2026-10-11'), { total: 0, byDay: { '2026-10-11': 0 } });
});

test('crossedGoal só é verdadeiro na passagem', () => {
  const before = { total: 40, byDay: { '2026-10-11': 40 } };
  const after = { total: 55, byDay: { '2026-10-11': 55 } };
  const later = { total: 60, byDay: { '2026-10-11': 60 } };
  assert.equal(crossedGoal(before, after, 50, '2026-10-11'), true);
  assert.equal(crossedGoal(after, later, 50, '2026-10-11'), false);
});
