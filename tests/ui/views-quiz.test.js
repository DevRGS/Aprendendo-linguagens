import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container, texts } from '../helpers/app.js';
import { answerCurrent, nextButton } from '../helpers/quiz.js';
import { renderQuizBuilder } from '../../js/ui/views/quiz-builder.js';
import { renderExam } from '../../js/ui/views/exam.js';
import { loadBanks } from '../../js/data/content.js';
import { formatDay } from '../../js/ui/dom.js';

setupDom();
const check = (label, el) => [...el.querySelectorAll('label.check')].find((l) => l.textContent.trim() === label).querySelector('input');
const toggle = (box, checked) => { box.checked = checked; box.dispatchEvent(new window.Event('change')); };
const submit = (el) => el.querySelector('form').dispatchEvent(new window.Event('submit', { cancelable: true }));

test('montar quiz: contagem de disponíveis acompanha os filtros', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  await renderQuizBuilder(el, app, route('quiz'));
  assert.equal(el.querySelector('h1').textContent, '🎯 Monte seu quiz');
  const available = () => el.querySelector('.quiz-builder > p.muted').textContent;
  assert.equal(available(), '20 perguntas disponíveis com esses filtros.');
  for (const label of ['Múltipla escolha', 'Verdadeiro ou falso', 'Ordenar linhas']) toggle(check(label, el), false);
  assert.equal(available(), '3 perguntas disponíveis com esses filtros.');
  toggle(check('Lacuna', el), false);
  assert.equal(available(), '0 perguntas disponíveis com esses filtros.');
  assert.equal(el.querySelector('button[type="submit"]').disabled, true);
  toggle(check('Lacuna', el), true);
  toggle(check('Fácil', el), false);
  assert.equal(available(), '1 pergunta disponível com esses filtros.');
});

test('montar quiz: cronômetro só no simulado; pedir mais do que existe avisa e usa tudo', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  document.body.append(el);
  await renderQuizBuilder(el, app, route('quiz'));
  const timer = check('Mostrar cronômetro', el);
  assert.equal(timer.disabled, true);
  toggle(check('Simulado: correção só no final', el), true);
  assert.equal(timer.disabled, false);
  toggle(timer, true);
  toggle(check('50 perguntas', el), true);
  submit(el);
  assert.ok(texts(document, '#toasts .toast').includes('Só havia 20 perguntas com esses filtros; o quiz vai usar todas.'));
  assert.match(el.textContent, /Pergunta 1 de 20 · Simulado/);
  assert.ok(el.querySelector('.timer'));
  el.remove();
});

test('quiz focado vindo dos pontos fracos já chega configurado', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  await renderQuizBuilder(el, app, route('quiz', {}, { modulo: 'java.fundamentos', foco: '1' }));
  assert.equal(check('Focar nos meus pontos fracos', el).checked, true);
  assert.equal(check('☕ Java', el).checked, true);
});

test('quiz personalizado completo entra no histórico com o escopo descrito', async () => {
  const app = await makeTestApp({ state: profileState() });
  const bank = await loadBanks(app.languages);
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const el = container();
  document.body.append(el);
  await renderQuizBuilder(el, app, route('quiz'));
  submit(el);
  for (let i = 0; i < 10; i++) {
    answerCurrent(el, byId, { correct: i > 0 });
    nextButton(el).click();
  }
  const entry = app.store.get().history[0];
  assert.equal(entry.kind, 'quiz');
  assert.equal(entry.scopeLabel, 'Java inteiro');
  assert.equal(entry.total, 10);
  assert.equal(entry.wrongIds.length, 1);
  el.remove();
});

test('refazer as erradas de um quiz do histórico', async () => {
  const history = [{ id: 'q7', at: '2026-10-10T10:00:00.000Z', kind: 'quiz', mode: 'estudo', scopeLabel: 'Java inteiro', moduleKeys: ['java.fundamentos'], total: 10, correct: 8, durationSec: 60, wrongIds: ['java.fundamentos.q01', 'java.fundamentos.q99'] }];
  const app = await makeTestApp({ state: profileState({ history }) });
  const el = container();
  await renderQuizBuilder(el, app, route('quiz', {}, { refazer: 'q7' }));
  assert.match(el.textContent, /Refazendo as erradas/);
  assert.match(el.textContent, /Pergunta 1 de 1/);
  await renderQuizBuilder(el, app, route('quiz', {}, { refazer: 'q999' }));
  assert.equal(el.querySelector('h1').textContent, 'Nada para refazer');
});

test('prova: introdução, simulado com cronômetro e aprovação', async () => {
  const app = await makeTestApp({ state: profileState() });
  const bank = await loadBanks(app.languages);
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const el = container();
  document.body.append(el);
  await renderExam(el, app, route('exam', { lang: 'java' }));
  assert.equal(el.querySelector('h1').textContent, '🎯 Prova de Java');
  assert.deepEqual(texts(el, 'li'), ['20 perguntas de todos os módulos', 'Correção só no final (modo simulado)', 'Aprovação com 70% ou mais', 'O tempo aparece na tela, mas não há limite']);
  el.querySelector('button').click();
  assert.match(el.textContent, /Pergunta 1 de 20 · Simulado/);
  assert.ok(el.querySelector('.timer'));
  for (let i = 0; i < 20; i++) {
    answerCurrent(el, byId, { correct: i >= 4 });
    nextButton(el).click();
  }
  assert.equal(el.querySelector('.headline').textContent, '🎉 Você passou na prova!');
  assert.equal(app.store.get().exams.java.best, 0.8);
  assert.ok(texts(document, '#toasts .toast').includes('🏆 Você passou na prova! +200 XP'));
  el.remove();
});

test('prova: mostra a melhor nota e reprovação explica o mínimo', async () => {
  const app = await makeTestApp({ state: profileState({ exams: { java: { best: 0.75, passedAt: '2026-10-05' } } }) });
  const bank = await loadBanks(app.languages);
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const el = container();
  document.body.append(el);
  await renderExam(el, app, route('exam', { lang: 'java' }));
  assert.match(el.textContent, new RegExp(`Sua melhor nota: 75% · prova aprovada em ${formatDay('2026-10-05').replaceAll('/', '\\/')}`));
  el.querySelector('button').click();
  for (let i = 0; i < 20; i++) {
    answerCurrent(el, byId, { correct: false });
    nextButton(el).click();
  }
  assert.match(el.querySelector('.headline').textContent, /Ainda não foi dessa vez: são necessários 70%/);
  await renderExam(el, app, route('exam', { lang: 'cobol' }));
  assert.equal(el.querySelector('h1').textContent, 'Página não encontrada');
  el.remove();
  await tick();
});
