import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import {
  loadLanguages, loadModuleBank, loadBanks, loadLesson, loadReference, loadAchievementTexts,
} from '../../js/data/content.js';

let failReference = true;
const calls = installFetchFromDisk({ fail: (path) => failReference && path.endsWith('referencia.md') });

test('loadLanguages lê o catálogo e acrescenta a chave de cada módulo', async () => {
  const [java] = await loadLanguages();
  assert.equal(java.id, 'java');
  assert.equal(java.dir, 'java');
  assert.equal(java.modules[0].key, 'java.fundamentos');
  assert.equal(java.modules[0].lessons.length, 6);
});

test('loadModuleBank marca linguagem e módulo em perguntas e cartas', async () => {
  const [java] = await loadLanguages();
  const bank = await loadModuleBank(java, java.modules[0]);
  assert.equal(bank.questions.length, 20);
  assert.equal(bank.cards.length, 14);
  assert.deepEqual([bank.questions[0].lang, bank.questions[0].module], ['java', 'java.fundamentos']);
  assert.deepEqual([bank.cards[0].lang, bank.cards[0].module], ['java', 'java.fundamentos']);
});

test('loadBanks junta os módulos pedidos (ou todos)', async () => {
  const languages = await loadLanguages();
  assert.equal((await loadBanks(languages)).questions.length, 20);
  assert.equal((await loadBanks(languages, ['java.fundamentos'])).cards.length, 14);
  assert.deepEqual(await loadBanks(languages, ['java.outro']), { questions: [], cards: [] });
});

test('loadLesson e loadAchievementTexts', async () => {
  const [java] = await loadLanguages();
  const module = java.modules[0];
  const text = await loadLesson(java, module, module.lessons[0]);
  assert.match(text, /^# Variáveis e tipos primitivos/);
  assert.equal((await loadAchievementTexts()).length, 21);
});

test('cada arquivo é buscado uma vez só (cache em memória)', async () => {
  const before = calls.filter((c) => c.path === 'content/catalog.json').length;
  await loadLanguages();
  await loadLanguages();
  assert.equal(calls.filter((c) => c.path === 'content/catalog.json').length, before);
  assert.equal(calls[0].init.cache, 'no-cache');
});

test('falha de rede rejeita com mensagem e não fica guardada no cache', async () => {
  const [java] = await loadLanguages();
  await assert.rejects(loadReference(java), /referencia\.md \(HTTP 500\)/);
  failReference = false;
  assert.match(await loadReference(java), /^# Referência rápida de Java/);
});

test('arquivo inexistente rejeita com HTTP 404', async () => {
  const [java] = await loadLanguages();
  await assert.rejects(loadLesson(java, java.modules[0], { file: 'nao-existe.md' }), /HTTP 404/);
});
