import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import { loadLanguages, loadLesson, loadModuleBank, loadReference, loadChallenges } from '../../js/data/content.js';
import { selectQuestions } from '../../js/core/quiz.js';
import { gradeQuestion } from '../../js/core/grading.js';

installFetchFromDisk({ overlay: false });

test('lacunas de backend aceitam grafias HTTP/SQL e formas equivalentes do contrato', async () => {
  const lang = await javascript();
  const cases = [
    ['node', 'q06', ['CONTENT-TYPE', 'Content-type'], 'Accept'],
    ['banco', 'q06', ['not NULL', 'NoT NuLl'], 'NULL'],
    ['banco', 'q15', ['commit transaction', 'end transaction', 'cOmMiT'], 'ROLLBACK'],
    ['autenticacao', 'q10', ['aNd'], 'OR'],
    ['backend-projeto', 'q12', ['rollback transaction', 'rOlLbAcK'], 'COMMIT'],
    ['api', 'q06', ['end', 'send', 'json'], 'write'],
  ];
  for (const [moduleId, id, accepted, rejected] of cases) {
    const bank = await loadModuleBank(lang, lang.modules.find((module) => module.id === moduleId));
    const question = bank.questions.find((q) => q.id === `javascript.${moduleId}.${id}`);
    for (const response of accepted) assert.equal(gradeQuestion(question, [response]), true, `${moduleId}.${id}: ${response}`);
    assert.equal(gradeQuestion(question, [rejected]), false, `${moduleId}.${id}: ${rejected}`);
  }
});

async function javascript() {
  const lang = (await loadLanguages()).find((item) => item.id === 'javascript');
  assert.ok(lang, 'JavaScript precisa aparecer no catálogo real');
  return lang;
}

test('trilha JavaScript carrega base e backend com bancos reais sem depender de motor', async () => {
  const lang = await javascript();
  assert.equal(lang.engine, undefined);
  let lessons = 0;
  let questions = 0;
  let cards = 0;
  for (const module of lang.modules) {
    const bank = await loadModuleBank(lang, module);
    questions += bank.questions.length;
    cards += bank.cards.length;
    assert.deepEqual(await loadChallenges(lang, module), []);
    assert.ok(new Set(bank.questions.map((q) => q.type)).size >= 3, module.id);
    for (const lesson of module.lessons) {
      lessons += 1;
      assert.match(await loadLesson(lang, module, lesson), /^# \S/, lesson.id);
      assert.ok(bank.questions.some((q) => q.lesson === lesson.id), `${lesson.id}: pergunta`);
      assert.ok(bank.cards.some((c) => c.lesson === lesson.id), `${lesson.id}: carta`);
    }
  }
  assert.equal(lessons, 56);
  assert.equal(questions, 210);
  assert.equal(cards, 140);
  assert.equal(lang.modules.slice(0, 8).flatMap((m) => m.lessons).length, 32);
  assert.match(await loadReference(lang), /^# Referência rápida de JavaScript/);
});

test('prova real de JavaScript tem 40 perguntas sem repetição e cobre os 14 módulos', async () => {
  const lang = await javascript();
  const banks = await Promise.all(lang.modules.map((module) => loadModuleBank(lang, module)));
  const { questions } = selectQuestions({ pool: banks.flatMap((bank) => bank.questions), count: 40 });
  assert.equal(questions.length, 40);
  assert.equal(new Set(questions.map((q) => q.id)).size, 40);
  assert.equal(new Set(questions.map((q) => q.module)).size, 14);
  assert.ok(questions.every((q) => q.lang === 'javascript' && q.type !== 'sql'));
});

test('lacuna real de conversão aceita Number e rejeita converter para texto', async () => {
  const lang = await javascript();
  const { questions } = await loadModuleBank(lang, lang.modules.find((module) => module.id === 'fundamentos'));
  const q = questions.find((item) => item.id === 'javascript.fundamentos.q06');
  assert.ok(gradeQuestion(q, ['Number']));
  assert.equal(gradeQuestion(q, ['String']), false);
  assert.equal(gradeQuestion(q, ['number']), false);
});
