import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import { initTestMarkdown } from '../helpers/markdown.js';
import { memoryStore } from '../helpers/app.js';
import { loadLanguages, loadAchievementTexts } from '../../js/data/content.js';
import { createApp, start } from '../../js/app.js';
import { STORAGE_KEY, AUTO_BACKUP_PAUSE_KEY } from '../../js/config.js';
import { createInitialState } from '../../js/core/state.js';

setupDom();

test('createApp monta o app com estado inicial quando não há nada salvo', async () => {
  installFetchFromDisk();
  const [languages, achievementTexts] = await Promise.all([loadLanguages(), loadAchievementTexts()]);
  localStorage.clear();
  const app = createApp({ languages, achievementTexts, autoBackupOptions: { store: memoryStore() } });
  assert.equal(app.loadStatus, 'empty');
  assert.equal(app.store.get().profile, null);
  assert.equal(app.getLanguage('java').name, 'Java');
  assert.equal(app.getLanguage('cobol'), undefined);
});

test('start: dados danificados pausam o backup automático; erros inesperados viram aviso', async () => {
  installFetchFromDisk();
  await initTestMarkdown();
  const [languages, achievementTexts] = await Promise.all([loadLanguages(), loadAchievementTexts()]);
  localStorage.clear();
  localStorage.setItem(STORAGE_KEY, '{ quebrado');
  window.showSaveFilePicker = async () => ({});
  const store = memoryStore();
  let reads = 0;
  const spyStore = { ...store, get: async (k) => { reads += 1; return store.get(k); } };
  const app = start(languages, achievementTexts, { autoBackupOptions: { store: spyStore } });
  await tick(20);
  assert.equal(app.loadStatus, 'corrupt');
  assert.equal(reads, 0);
  assert.match(document.getElementById('main').textContent, /Boas-vindas/);
  window.dispatchEvent(new window.Event('error'));
  assert.ok([...document.querySelectorAll('#toasts .toast')].some((t) => t.textContent.startsWith('Algo deu errado')));
});

test('start: com a pausa gravada de uma visita anterior, o backup automático não é iniciado', async () => {
  installFetchFromDisk();
  const [languages, achievementTexts] = await Promise.all([loadLanguages(), loadAchievementTexts()]);
  localStorage.clear();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...createInitialState(), profile: { name: 'Rafa', avatar: '🦊', dailyGoal: 50, createdAt: '2026-10-01T12:00:00.000Z' } }));
  localStorage.setItem(AUTO_BACKUP_PAUSE_KEY, '1');
  window.showSaveFilePicker = async () => ({});
  const store = memoryStore();
  let reads = 0;
  const spyStore = { ...store, get: async (k) => { reads += 1; return store.get(k); } };
  const app = start(languages, achievementTexts, { autoBackupOptions: { store: spyStore } });
  await tick(20);
  assert.equal(app.loadStatus, 'ok');
  assert.equal(reads, 0);
});

test('start: depois de carregar o conteúdo, cartas que sumiram deixam de contar como pendentes', async () => {
  installFetchFromDisk();
  await initTestMarkdown();
  const [languages, achievementTexts] = await Promise.all([loadLanguages(), loadAchievementTexts()]);
  localStorage.clear();
  const today = new Date();
  const day = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const card = { box: 0, due: day, reviews: 0, lapses: 0, xpDay: null };
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    ...createInitialState(),
    profile: { name: 'Rafa', avatar: '🦊', dailyGoal: 50, createdAt: '2026-10-01T12:00:00.000Z' },
    cards: { 'java.fundamentos.f01': card, 'java.fundamentos.f99': card },
  }));
  const app = start(languages, achievementTexts, { autoBackupOptions: { store: memoryStore() } });
  await tick(50);
  assert.deepEqual(Object.keys(app.store.get().cards), ['java.fundamentos.f01']);
  assert.equal(document.querySelector('#sidebar .nav-badge').textContent, '1');
});
