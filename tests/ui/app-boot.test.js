import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import { initTestMarkdown } from '../helpers/markdown.js';
import { memoryStore } from '../helpers/app.js';
import { boot } from '../../js/app.js';

setupDom();

test('boot sem internet mostra o erro e "Tentar de novo" volta a tentar', async () => {
  await initTestMarkdown();
  let offline = true;
  installFetchFromDisk({ fail: () => offline });
  const original = console.error;
  console.error = () => {};
  const options = { storageOptions: { debounceMs: 0 }, autoBackupOptions: { store: memoryStore() } };
  try {
    await boot(options);
  } finally {
    console.error = original;
  }
  const main = document.getElementById('main');
  assert.match(main.textContent, /Não foi possível carregar a Central/);
  offline = false;
  main.querySelector('button').click();
  await tick(50);
  assert.match(main.textContent, /Boas-vindas/);
  assert.equal(document.title, 'Central de Linguagens');
});
