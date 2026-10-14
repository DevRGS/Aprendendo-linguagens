import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';

const fromRoot = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');

test('por padrão, o manifesto de Java vem da fixture congelada (só Fundamentos)', async () => {
  installFetchFromDisk();
  const served = await (await fetch('content/java/language.json')).json();
  assert.deepEqual(served, JSON.parse(fromRoot('tests/fixtures/content/java/language.json')));
  assert.deepEqual(served.modules.map((m) => m.id), ['fundamentos']);
});

test('o que não está na fixture vem do conteúdo real', async () => {
  installFetchFromDisk();
  const text = await (await fetch('content/java/02-fundamentos/questions.json')).text();
  assert.equal(text, fromRoot('content/java/02-fundamentos/questions.json'));
});

test('com overlay: false, tudo vem do conteúdo real', async () => {
  installFetchFromDisk({ overlay: false });
  const text = await (await fetch('content/java/language.json')).text();
  assert.equal(text, fromRoot('content/java/language.json'));
});

test('caminho inexistente dá 404, e fail continua simulando erro de rede', async () => {
  installFetchFromDisk({ fail: (p) => p.endsWith('catalog.json') });
  assert.equal((await fetch('content/nao-existe.json')).status, 404);
  assert.equal((await fetch('content/catalog.json')).status, 500);
});

test('por padrão, o catálogo também vem congelado (só Java)', async () => {
  installFetchFromDisk();
  const served = await (await fetch('content/catalog.json')).json();
  assert.deepEqual(served.languages.map((l) => l.id), ['java']);
});

test("overlay: 'sql-ui' usa o mini-curso de SQL das telas e cai no conteúdo real para o resto", async () => {
  installFetchFromDisk({ overlay: 'sql-ui' });
  const catalog = await (await fetch('content/catalog.json')).json();
  assert.deepEqual(catalog.languages.map((l) => l.id), ['sql']);
  const text = await (await fetch('content/achievements.json')).text();
  assert.equal(text, fromRoot('content/achievements.json'));
});
