import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import { initTestMarkdown } from '../helpers/markdown.js';
import { memoryStore } from '../helpers/app.js';
import { loadLanguages, loadAchievementTexts } from '../../js/data/content.js';
import { createApp, start } from '../../js/app.js';
import { STORAGE_KEY } from '../../js/config.js';

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
