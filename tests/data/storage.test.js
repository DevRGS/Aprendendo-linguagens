import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { createInitialState, CURRENT_SCHEMA } from '../../js/core/state.js';
import { STORAGE_KEY, CORRUPT_KEY_PREFIX } from '../../js/config.js';
import { createStorage } from '../../js/data/storage.js';

setupDom();
const state = (extra = {}) => ({ ...createInitialState(), ...extra });

test('sem nada salvo, load informa "empty"', () => {
  localStorage.clear();
  assert.deepEqual(createStorage({ debounceMs: 5 }).load(), { status: 'empty' });
});

test('save espera o intervalo antes de gravar; flush grava na hora', async () => {
  localStorage.clear();
  const storage = createStorage({ debounceMs: 30 });
  storage.save(state({ lastLesson: 'a' }));
  assert.equal(localStorage.getItem(STORAGE_KEY), null);
  await tick(60);
  assert.equal(JSON.parse(localStorage.getItem(STORAGE_KEY)).lastLesson, 'a');
  storage.save(state({ lastLesson: 'b' }));
  storage.flush();
  assert.equal(JSON.parse(localStorage.getItem(STORAGE_KEY)).lastLesson, 'b');
});

test('load devolve o estado salvo, já migrado', () => {
  localStorage.clear();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state({ lastLesson: 'x' })));
  const r = createStorage().load();
  assert.equal(r.status, 'ok');
  assert.equal(r.state.lastLesson, 'x');
});

test('dados ilegíveis ou fora do formato viram "corrupt"; versão nova vira "newer"', () => {
  localStorage.setItem(STORAGE_KEY, '{quebrado');
  assert.deepEqual(createStorage().load(), { status: 'corrupt', raw: '{quebrado' });
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, history: 'x' }));
  assert.equal(createStorage().load().status, 'corrupt');
  const newer = JSON.stringify({ ...state(), schema: CURRENT_SCHEMA + 1 });
  localStorage.setItem(STORAGE_KEY, newer);
  assert.deepEqual(createStorage().load(), { status: 'newer', raw: newer });
});

test('keepCorrupt guarda uma cópia com prefixo próprio', () => {
  const storage = createStorage();
  const key = storage.keepCorrupt('{quebrado');
  assert.ok(key.startsWith(CORRUPT_KEY_PREFIX));
  assert.equal(localStorage.getItem(key), '{quebrado');
});

test('pagehide e aba oculta gravam o pendente na hora', () => {
  localStorage.clear();
  const storage = createStorage({ debounceMs: 10000 });
  storage.save(state({ lastLesson: 'pagehide' }));
  window.dispatchEvent(new window.Event('pagehide'));
  assert.equal(JSON.parse(localStorage.getItem(STORAGE_KEY)).lastLesson, 'pagehide');
  storage.save(state({ lastLesson: 'oculta' }));
  Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
  document.dispatchEvent(new window.Event('visibilitychange'));
  assert.equal(JSON.parse(localStorage.getItem(STORAGE_KEY)).lastLesson, 'oculta');
  Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
});

test('mudança feita em outra aba chega por onExternalChange (e lixo é ignorado)', () => {
  const received = [];
  createStorage({ onExternalChange: (s) => received.push(s) });
  const fire = (key, newValue) => window.dispatchEvent(new window.StorageEvent('storage', { key, newValue }));
  fire(STORAGE_KEY, JSON.stringify(state({ lastLesson: 'outra-aba' })));
  fire('outra-chave', JSON.stringify(state()));
  fire(STORAGE_KEY, '{quebrado');
  fire(STORAGE_KEY, null);
  assert.equal(received.length, 1);
  assert.equal(received[0].lastLesson, 'outra-aba');
});

test('disable para de gravar', async () => {
  localStorage.clear();
  const storage = createStorage({ debounceMs: 5 });
  storage.disable();
  assert.equal(storage.available, false);
  storage.save(state());
  storage.flush();
  await tick(20);
  assert.equal(localStorage.getItem(STORAGE_KEY), null);
});

test('getItem, setItem e removeItem', () => {
  const storage = createStorage();
  assert.equal(storage.setItem('k', 'v'), true);
  assert.equal(storage.getItem('k'), 'v');
  storage.removeItem('k');
  assert.equal(storage.getItem('k'), null);
});

test('cota cheia: save avisa por onSaveError e desliga a gravação', () => {
  const errors = [];
  const storage = createStorage({ onSaveError: (e) => errors.push(e) });
  const original = window.Storage.prototype.setItem;
  window.Storage.prototype.setItem = function setItem(key, value) {
    if (key === STORAGE_KEY) throw new Error('QuotaExceededError');
    return original.call(this, key, value);
  };
  try {
    storage.save(state());
    storage.flush();
  } finally {
    window.Storage.prototype.setItem = original;
  }
  assert.equal(errors.length, 1);
  assert.equal(storage.available, false);
});

test('navegador sem armazenamento: load informa "unavailable"', () => {
  const original = window.Storage.prototype.setItem;
  window.Storage.prototype.setItem = () => { throw new Error('bloqueado'); };
  try {
    const storage = createStorage();
    assert.equal(storage.available, false);
    assert.deepEqual(storage.load(), { status: 'unavailable' });
    assert.equal(storage.setItem('k', 'v'), false);
  } finally {
    window.Storage.prototype.setItem = original;
  }
});
