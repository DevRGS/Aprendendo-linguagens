// Teste de fumaça com o conteúdo de verdade (sem a fixture da Task 2): a ordem dos módulos
// e o carregamento de todas as aulas e bancos, do jeito que o site faz.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import { loadLanguages, loadModuleBank, loadLesson } from '../../js/data/content.js';

installFetchFromDisk({ overlay: false });

const java = async () => (await loadLanguages()).find((l) => l.id === 'java');

test('Java tem os sete módulos da especificação, na ordem', async () => {
  assert.deepEqual((await java()).modules.map((m) => m.id), ['introducao', 'fundamentos', 'poo', 'colecoes', 'excecoes', 'strings', 'java-moderno']);
});

test('toda aula carrega e começa por um título; todo banco carrega com as chaves do módulo', async () => {
  const lang = await java();
  for (const module of lang.modules) {
    for (const lesson of module.lessons) {
      assert.match(await loadLesson(lang, module, lesson), /^# \S/, `${module.id}/${lesson.id}`);
    }
    const bank = await loadModuleBank(lang, module);
    assert.ok(bank.questions.length >= 12, module.id);
    assert.ok(bank.questions.every((q) => q.module === module.key && q.id.startsWith(`${module.key}.q`)), module.id);
    assert.ok(bank.cards.every((c) => c.module === module.key && c.id.startsWith(`${module.key}.f`)), module.id);
  }
});
