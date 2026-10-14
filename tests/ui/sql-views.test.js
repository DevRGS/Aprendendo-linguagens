import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, waitFor } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container, texts } from '../helpers/app.js';
import { nextButton } from '../helpers/quiz.js';
import { runQuiz } from '../../js/ui/components/quiz-runner.js';
import { renderPractice } from '../../js/ui/views/practice.js';
import { renderExam } from '../../js/ui/views/exam.js';
import { renderQuizBuilder } from '../../js/ui/views/quiz-builder.js';
import { renderLesson } from '../../js/ui/views/lesson.js';
import { loadBanks } from '../../js/data/content.js';
import { prepareQuestion } from '../../js/core/quiz.js';
import { createSqlEngine } from '../../js/data/sql-engine.js';

setupDom();

const failingEngine = () => createSqlEngine({ load: async () => { throw new Error('rede'); } });
const buttonIn = (el, label) => [...el.querySelectorAll('button')].find((b) => b.textContent === label);

async function setup(options = {}) {
  const app = await makeTestApp({ state: profileState(), fixture: 'sql-ui', ...options });
  const byId = new Map((await loadBanks(app.languages)).questions.map((q) => [q.id, q]));
  const el = container();
  document.body.append(el);
  return { app, byId, el };
}

// Responde a pergunta sql da tela como uma pessoa: digita, espera o banco e clica em Responder.
async function answerSql(el, sql) {
  const root = el.querySelector('.question');
  const area = root.querySelector('textarea');
  area.value = sql;
  area.dispatchEvent(new window.Event('input', { bubbles: true }));
  await waitFor(() => !buttonIn(root, 'Responder').disabled);
  buttonIn(root, 'Responder').click();
  await waitFor(() => nextButton(el));
}

test('quiz no modo estudo: pergunta sql mostra veredito, esperado e uma resposta certa, e entra no progresso', async () => {
  const { app, byId, el } = await setup();
  runQuiz(el, app, {
    questions: [prepareQuestion(byId.get('sql.teste.q01')), prepareQuestion(byId.get('sql.teste.q02'))],
    mode: 'estudo', kind: 'quiz', title: 'Q',
  });
  assert.equal(el.querySelector('.q-type').textContent, 'Escreva a consulta');
  assert.equal(el.querySelectorAll('.question .md').length, 1, 'o enunciado aparece uma vez só');
  await answerSql(el, 'SELECT nome FROM pessoas WHERE id IN (1, 3)');
  assert.match(el.querySelector('.feedback').textContent, /❌ Não foi dessa vez\./);
  assert.match(el.querySelector('.sql-status').textContent, /Seu resultado bate nestas tabelas/);
  assert.match(el.querySelector('.sql-output').textContent, /Resultado esperado.*Uma resposta certa:/s);
  nextButton(el).click();
  await answerSql(el, 'select nome from pessoas order by nome');
  assert.match(el.querySelector('.feedback').textContent, /✅ Correto!/);
  nextButton(el).click();
  const state = app.store.get();
  assert.equal(state.counters.answered, 2);
  assert.deepEqual(state.mistakes, ['sql.teste.q01']);
  const review = el.querySelector('.review-item').textContent;
  assert.match(review, /Sua consulta: SELECT nome FROM pessoas WHERE id IN \(1, 3\)/);
  assert.match(review, /Uma resposta certa: .*SELECT nome FROM pessoas WHERE idade > 30;/s);
  el.remove();
});

test('quiz no simulado: a pergunta sql só registra a resposta', async () => {
  const { app, byId, el } = await setup();
  runQuiz(el, app, { questions: [prepareQuestion(byId.get('sql.teste.q01'))], mode: 'simulado', kind: 'quiz', title: 'Q' });
  await answerSql(el, 'SELECT nome FROM pessoas WHERE idade > 30');
  assert.equal(el.querySelector('.feedback').textContent, 'Resposta registrada.');
  assert.equal(el.querySelector('.sql-status'), null);
  nextButton(el).click();
  assert.equal(el.querySelector('.big-score').textContent, '1/1');
  el.remove();
});

test('se a correção falhar, o quiz avisa, não registra e deixa responder de novo', async () => {
  const { app, byId, el } = await setup();
  const realGrade = app.sql.grade;
  app.sql.grade = async () => { throw new Error('falhou'); };
  runQuiz(el, app, { questions: [prepareQuestion(byId.get('sql.teste.q01'))], mode: 'estudo', kind: 'quiz', title: 'Q' });
  const root = el.querySelector('.question');
  root.querySelector('textarea').value = 'SELECT nome FROM pessoas WHERE idade > 30';
  root.querySelector('textarea').dispatchEvent(new window.Event('input', { bubbles: true }));
  await waitFor(() => !buttonIn(root, 'Responder').disabled);
  buttonIn(root, 'Responder').click();
  await waitFor(() => /Não foi possível corrigir agora/.test(el.querySelector('.feedback').textContent));
  assert.equal(app.store.get().counters.answered, 0);
  assert.equal(nextButton(el), undefined);
  app.sql.grade = realGrade;
  await waitFor(() => !buttonIn(root, 'Responder').disabled);
  buttonIn(root, 'Responder').click();
  await waitFor(() => nextButton(el));
  assert.equal(app.store.get().counters.answered, 1);
  el.remove();
});

test('prática sem o motor: só as perguntas de outros tipos, com aviso', async () => {
  const { app, el } = await setup({ sqlEngine: failingEngine() });
  await renderPractice(el, app, route('practice', { lang: 'sql', module: 'teste' }));
  assert.match(el.textContent, /Pergunta 1 de 1/);
  assert.equal(el.querySelector('.q-type').textContent, 'Múltipla escolha');
  assert.ok(texts(document, '#toasts .toast').some((t) => /ficaram de fora/.test(t)));
  el.remove();
});

test('prova sem o motor: as vagas vão para os outros tipos', async () => {
  const { app, el } = await setup({ sqlEngine: failingEngine() });
  await renderExam(el, app, route('exam', { lang: 'sql' }));
  buttonIn(el, 'Começar a prova').click();
  await waitFor(() => /Pergunta 1 de 1 · Simulado/.test(el.textContent));
  el.remove();
});

test('montar quiz: "Escrever SQL" aparece quando o escopo tem perguntas sql e some quando não tem', async () => {
  const { app, el } = await setup();
  await renderQuizBuilder(el, app, route('quiz'));
  const sqlBox = [...el.querySelectorAll('label.check')].find((l) => l.textContent.trim() === 'Escrever SQL');
  assert.equal(sqlBox.hidden, false);
  assert.equal(el.querySelector('.quiz-builder > p.muted').textContent, '3 perguntas disponíveis com esses filtros.');
  const mod = [...el.querySelectorAll('.scope-mods label.check')].find((l) => l.textContent.trim() === 'Teste').querySelector('input');
  mod.checked = false;
  mod.dispatchEvent(new window.Event('change'));
  assert.equal(sqlBox.hidden, true);
  el.remove();
});

test('montar quiz com SQL: o quiz começa depois de preparar o banco', async () => {
  const { app, el } = await setup();
  await renderQuizBuilder(el, app, route('quiz'));
  el.querySelector('form').dispatchEvent(new window.Event('submit', { cancelable: true }));
  await waitFor(() => /Pergunta 1 de 3/.test(el.textContent));
  el.remove();
});

test('aula de SQL termina com "Experimente" e os desafios dela', async () => {
  const { app, el } = await setup();
  await renderLesson(el, app, route('lesson', { lang: 'sql', module: 'teste', lesson: 'filtrar' }));
  const section = el.querySelector('section.challenges');
  assert.equal(section.querySelector('h2').textContent, 'Experimente');
  assert.equal(section.querySelectorAll('.sql-exercise').length, 1);
  assert.equal(section.querySelector('.sql-title'), null);
  assert.match(section.textContent, /Liste o nome das pessoas com mais de 30 anos\./);
  assert.ok(section.compareDocumentPosition(el.querySelector('.lesson-foot')) & window.Node.DOCUMENT_POSITION_FOLLOWING);
  await waitFor(() => texts(section, '.sql-expected td').length === 2);
  el.remove();
});
