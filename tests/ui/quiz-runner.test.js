import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { makeTestApp, profileState, container, texts } from '../helpers/app.js';
import { answerCurrent, nextButton } from '../helpers/quiz.js';
import { runQuiz } from '../../js/ui/components/quiz-runner.js';
import { loadBanks } from '../../js/data/content.js';
import { prepareQuestion } from '../../js/core/quiz.js';
import { hasLeaveGuard } from '../../js/router.js';

setupDom();

async function setup(ids) {
  const app = await makeTestApp({ state: profileState() });
  const bank = await loadBanks(app.languages);
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const questions = ids.map((id) => prepareQuestion(byId.get(id)));
  const el = container();
  document.body.append(el);
  return { app, byId, questions, el };
}

test('sem perguntas, avisa em vez de começar', async () => {
  const { app, el } = await setup([]);
  runQuiz(el, app, { questions: [], mode: 'estudo', kind: 'quiz', title: 'Vazio' });
  assert.match(el.textContent, /Não há perguntas disponíveis/);
  el.remove();
});

test('modo estudo: corrige na hora, explica, grava e mostra o resultado', async () => {
  const ids = ['java.fundamentos.q01', 'java.fundamentos.q02', 'java.fundamentos.q05', 'java.fundamentos.q11'];
  const { app, byId, questions, el } = await setup(ids);
  const language = app.getLanguage('java');
  runQuiz(el, app, {
    questions, mode: 'estudo', kind: 'practice', title: 'Prática: Fundamentos', language, moduleId: 'fundamentos',
    scopeLabel: 'Java › Fundamentos', moduleKeys: ['java.fundamentos'],
    resultActions: [{ label: 'Nova prática', onClick: () => {} }, { label: 'Voltar', href: '#/java' }],
  });
  assert.match(el.textContent, /Pergunta 1 de 4/);
  assert.equal(nextButton(el), undefined);
  assert.equal(hasLeaveGuard(), true);

  answerCurrent(el, byId, { correct: true });
  assert.match(el.querySelector('.feedback').textContent, /✅ Correto!/);
  assert.equal(el.querySelector('.feedback a'), null);
  nextButton(el).click();

  answerCurrent(el, byId, { correct: false });
  assert.match(el.querySelector('.feedback').textContent, /❌ Não foi dessa vez\./);
  assert.equal(el.querySelector('.feedback a').getAttribute('href'), '#/java/fundamentos/variaveis-e-tipos');
  nextButton(el).click();

  answerCurrent(el, byId, { correct: true });
  nextButton(el).click();
  answerCurrent(el, byId, { correct: true });
  assert.equal(nextButton(el).textContent, 'Ver resultado');
  nextButton(el).click();

  const state = app.store.get();
  assert.equal(state.counters.answered, 4);
  assert.deepEqual(state.mistakes, ['java.fundamentos.q02']);
  assert.equal(state.history.length, 1);
  assert.equal(state.history[0].kind, 'practice');
  assert.equal(state.modules['java.fundamentos'].bestPractice, 0.75);
  assert.equal(hasLeaveGuard(), false);

  assert.equal(el.querySelector('.big-score').textContent, '3/4');
  assert.match(el.textContent, /75% de acerto/);
  assert.match(el.querySelector('.module-bar').textContent, /Java › Fundamentos3\/4 \(75%\)/);
  assert.equal(el.querySelectorAll('.review-item').length, 1);
  assert.match(el.querySelector('.review-item').textContent, /Sua resposta: Verdadeiro/);
  assert.match(el.querySelector('.review-item').textContent, /Resposta certa: Falso/);
  assert.deepEqual(texts(el, '.actions .btn'), ['Refazer só as erradas', 'Treinar erros nos flashcards', 'Nova prática', 'Voltar']);

  [...el.querySelectorAll('.actions button')].find((b) => b.textContent === 'Refazer só as erradas').click();
  assert.match(el.textContent, /Refazendo as erradas/);
  assert.match(el.textContent, /Pergunta 1 de 1/);
  answerCurrent(el, byId, { correct: true });
  nextButton(el).click();
  assert.equal(app.store.get().history[0].kind, 'review');
  assert.deepEqual(app.store.get().mistakes, []);
  assert.match(el.textContent, /Nenhum erro/);
  el.remove();
});

test('lacuna errada na revisão mostra o código da pergunta', async () => {
  const { app, byId, questions, el } = await setup(['java.fundamentos.q16']);
  runQuiz(el, app, { questions, mode: 'estudo', kind: 'quiz', title: 'Q' });
  answerCurrent(el, byId, { correct: false });
  nextButton(el).click();
  assert.match(el.querySelector('.review-item .fill-code').textContent, /numeros\.___/);
  el.remove();
});

test('modo simulado: não corrige na hora, mostra cronômetro e a mensagem final', async () => {
  const { app, byId, questions, el } = await setup(['java.fundamentos.q03', 'java.fundamentos.q12']);
  runQuiz(el, app, {
    questions, mode: 'simulado', kind: 'exam', title: 'Prova de Java', timer: true, language: app.getLanguage('java'),
    headline: (rate) => (rate >= 0.7 ? 'Você passou!' : 'Ainda não.'),
  });
  assert.match(el.textContent, /Pergunta 1 de 2 · Simulado/);
  assert.equal(el.querySelector('.timer').textContent, '0 s');
  answerCurrent(el, byId, { correct: true });
  assert.equal(el.querySelector('.feedback').textContent, 'Resposta registrada.');
  assert.equal(el.querySelector('.opt.ok'), null);
  await tick(1100);
  assert.equal(el.querySelector('.timer').textContent, '1 s');
  nextButton(el).click();
  answerCurrent(el, byId, { correct: true });
  nextButton(el).click();
  assert.equal(el.querySelector('.headline').textContent, 'Você passou!');
  assert.equal(app.store.get().exams.java.best, 1);
  el.remove();
});

test('o guarda de saída só pergunta depois da primeira resposta', async () => {
  const { app, byId, questions, el } = await setup(['java.fundamentos.q03', 'java.fundamentos.q12']);
  let guard = null;
  const asks = [];
  window.confirm = (msg) => { asks.push(msg); return false; };
  const realApp = { ...app, setLeaveGuard: (fn) => { guard = fn; } };
  runQuiz(el, realApp, { questions, mode: 'estudo', kind: 'quiz', title: 'Q' });
  assert.equal(guard(), true);
  answerCurrent(el, byId, { correct: true });
  assert.equal(guard(), false);
  assert.match(asks[0], /Sair do quiz\?/);
  window.confirm = () => true;
  el.remove();
});

test('resultado mostra desempenho por linguagem quando o quiz mistura linguagens', async () => {
  const { app, byId, el } = await setup([]);
  const sql = { id: 'sql.basico.q01', lang: 'sql', module: 'sql.basico', type: 'truefalse', difficulty: 1, lesson: 'x', prompt: 'SQL é uma linguagem de consulta.', answer: true, explanation: 'Sim.' };
  byId.set(sql.id, sql);
  const java = byId.get('java.fundamentos.q02');
  runQuiz(el, app, { questions: [prepareQuestion(java), prepareQuestion(sql)], mode: 'estudo', kind: 'quiz', title: 'Misto' });
  for (let i = 0; i < 2; i++) {
    answerCurrent(el, byId, { correct: el.querySelector('.question').dataset.qid === 'sql.basico.q01' });
    nextButton(el).click();
  }
  const headings = texts(el, 'h2');
  assert.ok(headings.includes('Desempenho por linguagem'));
  const labels = texts(el, '.module-bar-label span:first-child');
  assert.ok(labels.includes('Java'));
  assert.ok(labels.includes('sql'));
  el.remove();
});

test('com uma linguagem só, o resultado não repete a barra por linguagem', async () => {
  const { app, byId, questions, el } = await setup(['java.fundamentos.q03']);
  runQuiz(el, app, { questions, mode: 'estudo', kind: 'quiz', title: 'Q' });
  answerCurrent(el, byId, { correct: true });
  nextButton(el).click();
  assert.ok(!texts(el, 'h2').includes('Desempenho por linguagem'));
  el.remove();
});
