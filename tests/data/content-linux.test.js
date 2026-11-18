import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import { loadLanguages, loadModuleBank, loadLesson, loadReference, loadChallenges } from '../../js/data/content.js';
import { selectQuestions } from '../../js/core/quiz.js';
import { gradeQuestion } from '../../js/core/grading.js';

installFetchFromDisk({ overlay: false });

async function linux() {
  const lang = (await loadLanguages()).find((l) => l.id === 'linux');
  assert.ok(lang, 'Terminal Linux deve estar disponível no catálogo real');
  return lang;
}

test('trilha Linux carrega aulas, referência e bancos reais pelos caminhos do catálogo', async () => {
  const lang = await linux();
  assert.equal(lang.engine, undefined);
  let lessons = 0;
  let questions = 0;
  let cards = 0;
  for (const module of lang.modules) {
    const bank = await loadModuleBank(lang, module);
    questions += bank.questions.length;
    cards += bank.cards.length;
    assert.deepEqual(await loadChallenges(lang, module), []);
    for (const lesson of module.lessons) {
      lessons += 1;
      const label = `${module.id}/${lesson.id}`;
      assert.match(await loadLesson(lang, module, lesson), /^# \S/, label);
      assert.ok(bank.questions.some((q) => q.lesson === lesson.id), `${label}: sem pergunta`);
      assert.ok(bank.cards.some((c) => c.lesson === lesson.id), `${label}: sem carta`);
    }
    assert.ok(bank.questions.every((q) => q.lang === 'linux' && q.module === module.key));
    assert.ok(new Set(bank.questions.map((q) => q.type)).size >= 3);
  }
  assert.equal(lessons, 24);
  assert.equal(questions, 90);
  assert.equal(cards, 60);
  assert.match(await loadReference(lang), /^# Referência rápida/);
});

test('banco Linux permite prova completa, distribuída e sem perguntas repetidas', async () => {
  const lang = await linux();
  const banks = await Promise.all(lang.modules.map((m) => loadModuleBank(lang, m)));
  const pool = banks.flatMap((b) => b.questions);
  const exam = selectQuestions({ pool, count: 40, filters: { moduleKeys: lang.modules.map((m) => m.key) } });
  assert.equal(exam.questions.length, 40);
  assert.equal(new Set(exam.questions.map((q) => q.id)).size, 40);
  assert.equal(new Set(exam.questions.map((q) => q.module)).size, 6);
  assert.ok(exam.questions.every((q) => q.lang === 'linux' && q.type !== 'sql'));
});

test('lacunas reais aceitam opções equivalentes sem apagar a distinção de maiúsculas', async () => {
  const lang = await linux();
  const module = lang.modules.find((m) => m.id === 'arquivos');
  const { questions } = await loadModuleBank(lang, module);
  const q = questions.find((item) => item.id === 'linux.arquivos.q03');
  assert.ok(gradeQuestion(q, ['-a']));
  assert.ok(gradeQuestion(q, ['--all']));
  assert.equal(gradeQuestion(q, ['-A']), false);
});

test('lacunas de caminhos, modos e expansões aceitam variantes Bash equivalentes', async () => {
  const lang = await linux();
  const banks = await Promise.all(lang.modules.map((m) => loadModuleBank(lang, m)));
  const byId = new Map(banks.flatMap((b) => b.questions).map((q) => [q.id, q]));
  const examples = [
    ['linux.rotinas.q08', ['"$1"', '"${1}"'], ['$0', '$2']],
    ['linux.shell.q12', ['${?}', '"$?"', '"${?}"'], ['$!', '$1']],
    ['linux.sistema.q08', ['${!}', '"$!"', '"${!}"'], ['$?', '$$']],
    ['linux.sistema.q02', ['0600'], ['644', '777']],
    ['linux.arquivos.q15', ['../'], ['.', '/']],
  ];
  for (const [id, accepted, rejected] of examples) {
    const question = byId.get(id);
    for (const answer of accepted) assert.ok(gradeQuestion(question, [answer]), `${id}: deve aceitar ${answer}`);
    for (const answer of rejected) assert.equal(gradeQuestion(question, [answer]), false, `${id}: deve recusar ${answer}`);
  }
});
