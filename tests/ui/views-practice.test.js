import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container } from '../helpers/app.js';
import { answerCurrent, nextButton } from '../helpers/quiz.js';
import { renderPractice } from '../../js/ui/views/practice.js';
import { loadBanks } from '../../js/data/content.js';

setupDom();
const allLessons = ['variaveis-e-tipos', 'conversoes', 'operadores', 'condicionais', 'lacos', 'arrays'];

test('prática de módulo inexistente mostra "não encontrada"', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  await renderPractice(el, app, route('practice', { lang: 'java', module: 'nada' }));
  assert.equal(el.querySelector('h1').textContent, 'Página não encontrada');
});

test('prática com 5 perguntas; acertar tudo com as aulas feitas conclui o módulo', async () => {
  const lessons = Object.fromEntries(allLessons.map((id) => [`java.fundamentos.${id}`, { doneAt: '2026-10-01' }]));
  const app = await makeTestApp({ state: profileState({ lessons }) });
  const bank = await loadBanks(app.languages);
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const el = container();
  document.body.append(el);
  await renderPractice(el, app, route('practice', { lang: 'java', module: 'fundamentos' }));
  assert.match(el.querySelector('.quiz-title').textContent, /Prática: Fundamentos/);
  assert.match(el.textContent, /Pergunta 1 de 5/);
  for (let i = 0; i < 5; i++) {
    answerCurrent(el, byId, { correct: true });
    nextButton(el).click();
  }
  const state = app.store.get();
  assert.equal(state.modules['java.fundamentos'].bestPractice, 1);
  assert.ok(state.modules['java.fundamentos'].completedAt);
  assert.equal(el.querySelector('.big-score').textContent, '5/5');
  const actions = [...el.querySelectorAll('.actions .btn')].map((b) => b.textContent);
  assert.deepEqual(actions, ['Nova prática', 'Voltar para Java']);
  [...el.querySelectorAll('.actions button')].find((b) => b.textContent === 'Nova prática').click();
  assert.equal(app.refreshes, 1);
  el.remove();
});
