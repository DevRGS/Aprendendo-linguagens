import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { startRouter, navigate, refresh, setLeaveGuard, hasLeaveGuard } from '../../js/router.js';

setupDom();
const seen = [];

test('startRouter entrega a rota atual na hora', () => {
  startRouter((route) => seen.push(route.name));
  assert.deepEqual(seen, ['home']);
});

test('navigate troca o hash e dispara a nova rota', async () => {
  navigate('#/quiz');
  await tick(20);
  assert.equal(location.hash, '#/quiz');
  assert.deepEqual(seen, ['home', 'quiz']);
});

test('refresh entrega de novo a rota atual', () => {
  refresh();
  assert.deepEqual(seen, ['home', 'quiz', 'quiz']);
});

test('guarda de saída que recusa mantém a rota e o hash', async () => {
  setLeaveGuard(() => false);
  assert.equal(hasLeaveGuard(), true);
  navigate('#/perfil');
  await tick(50);
  assert.equal(location.hash, '#/quiz');
  assert.deepEqual(seen, ['home', 'quiz', 'quiz']);
  assert.equal(hasLeaveGuard(), true);
});

test('guarda de saída que permite libera a troca e é descartado', async () => {
  setLeaveGuard(() => true);
  navigate('#/perfil');
  await tick(20);
  assert.equal(location.hash, '#/perfil');
  assert.deepEqual(seen.at(-1), 'perfil');
  assert.equal(hasLeaveGuard(), false);
});

test('refresh também descarta o guarda de saída', () => {
  setLeaveGuard(() => false);
  refresh();
  assert.equal(hasLeaveGuard(), false);
  setLeaveGuard(null);
  assert.equal(hasLeaveGuard(), false);
});
