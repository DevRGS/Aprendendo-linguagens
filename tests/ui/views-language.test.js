import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container, texts } from '../helpers/app.js';
import { renderLanguage } from '../../js/ui/views/language.js';
import { renderLesson } from '../../js/ui/views/lesson.js';
import { renderReference } from '../../js/ui/views/reference.js';
import { formatDay } from '../../js/ui/dom.js';
import { toDayKey } from '../../js/core/dates.js';

setupDom();
const allLessons = ['variaveis-e-tipos', 'conversoes', 'operadores', 'condicionais', 'lacos', 'arrays'];
const doneLessons = (ids) => Object.fromEntries(ids.map((id) => [`java.fundamentos.${id}`, { doneAt: '2026-10-01' }]));

test('linguagem inexistente mostra "não encontrada"', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  await renderLanguage(el, app, route('language', { lang: 'cobol' }));
  assert.equal(el.querySelector('h1').textContent, 'Página não encontrada');
});

test('página da linguagem sem progresso', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  await renderLanguage(el, app, route('language', { lang: 'java' }));
  assert.equal(el.querySelector('h1').textContent, 'Java');
  assert.match(el.textContent, /0\/6 aulas · 0\/1 módulos concluídos/);
  assert.deepEqual(texts(el, '.lang-links a'), ['📋 Referência rápida', '🎯 Prova', '🔒 Certificado']);
  assert.deepEqual([...el.querySelectorAll('.lang-links a')].map((a) => a.getAttribute('href')), ['#/java/referencia', '#/java/prova', '#/java/certificado']);
  const card = el.querySelector('.module-card');
  assert.equal(card.querySelectorAll('.lesson-list li').length, 6);
  assert.equal(card.querySelector('.lesson-list a').getAttribute('href'), '#/java/fundamentos/variaveis-e-tipos');
  assert.equal(card.querySelector('.badge').textContent, '0/6 aulas');
  assert.match(card.textContent, /Para concluir: todas as aulas e 60% na prática/);
  assert.equal(card.querySelector('a.btn-primary').getAttribute('href'), '#/java/fundamentos/pratica');
});

test('página da linguagem com aulas, prática, prova e certificado', async () => {
  const state = profileState({
    lessons: doneLessons(allLessons),
    modules: { 'java.fundamentos': { bestPractice: 0.8, completedAt: '2026-10-02', cardsActivated: true } },
    exams: { java: { best: 0.75, passedAt: '2026-10-03' } },
  });
  const app = await makeTestApp({ state });
  const el = container();
  await renderLanguage(el, app, route('language', { lang: 'java' }));
  const card = el.querySelector('.module-card');
  assert.match(card.className, /done/);
  assert.equal(card.querySelector('.badge').textContent, '✓ Concluído');
  assert.equal(card.querySelectorAll('li.done').length, 6);
  assert.match(card.textContent, /\(concluída\)/);
  assert.equal(card.querySelector('.actions .badge').textContent, 'Melhor prática: 80%');
  assert.match(card.querySelector('.actions .badge').className, /success/);
  assert.match(card.textContent, /Cartas do módulo ativadas/);
  assert.deepEqual(texts(el, '.lang-links a'), ['📋 Referência rápida', '🎯 Prova (melhor nota: 75%)', '🎓 Ver certificado']);
});

test('ativar todas as cartas do módulo', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  await renderLanguage(el, app, route('language', { lang: 'java' }));
  const btn = [...el.querySelectorAll('button')].find((b) => b.textContent.includes('Ativar todas as cartas'));
  btn.click();
  await tick(20);
  assert.equal(Object.keys(app.store.get().cards).length, 14);
  assert.equal(app.store.get().modules['java.fundamentos'].cardsActivated, true);
  assert.equal(app.refreshes, 1);
});

test('aula inexistente mostra "não encontrada"', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  await renderLesson(el, app, route('lesson', { lang: 'java', module: 'fundamentos', lesson: 'nada' }));
  assert.equal(el.querySelector('h1').textContent, 'Página não encontrada');
  await renderLesson(el, app, route('lesson', { lang: 'java', module: 'nada', lesson: 'arrays' }));
  assert.equal(el.querySelector('h1').textContent, 'Página não encontrada');
});

test('aula mostra o conteúdo, registra a última aula e navega para a próxima', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  await renderLesson(el, app, route('lesson', { lang: 'java', module: 'fundamentos', lesson: 'variaveis-e-tipos' }));
  assert.equal(el.querySelector('.md h1').textContent, 'Variáveis e tipos primitivos');
  assert.equal(el.querySelector('.eyebrow').textContent, 'Aula 1 de 6 · 10 min');
  assert.match(el.querySelector('.breadcrumb').textContent, /Java › Fundamentos/);
  assert.ok(el.querySelector('.md .callout-note'));
  assert.equal(app.store.get().lastLesson, 'java.fundamentos.variaveis-e-tipos');
  const foot = el.querySelector('.lesson-foot');
  assert.equal(foot.querySelector('a.btn-ghost'), null);
  assert.equal(foot.querySelector('a.btn:last-child').getAttribute('href'), '#/java/fundamentos/conversoes');
});

test('última aula aponta para a prática; concluir dá XP, libera cartas e troca o botão', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  await renderLesson(el, app, route('lesson', { lang: 'java', module: 'fundamentos', lesson: 'arrays' }));
  const foot = () => el.querySelector('.lesson-foot');
  assert.equal(foot().querySelector('a.btn-ghost').getAttribute('href'), '#/java/fundamentos/lacos');
  assert.equal(foot().querySelector('a:last-child').getAttribute('href'), '#/java/fundamentos/pratica');
  foot().querySelector('button').click();
  await tick(20);
  const state = app.store.get();
  assert.ok(state.lessons['java.fundamentos.arrays']);
  assert.deepEqual(Object.keys(state.cards).sort(), ['java.fundamentos.f13', 'java.fundamentos.f14']);
  assert.ok(texts(document, '#toasts .toast').includes('Aula concluída! +20 XP'));
  assert.equal(foot().querySelector('button'), null);
  assert.equal(foot().querySelector('.badge').textContent, `✓ Concluída em ${formatDay(toDayKey(new Date()))}`);
});

test('referência rápida', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  await renderReference(el, app, route('reference', { lang: 'java' }));
  assert.equal(el.querySelector('.md h1').textContent, 'Referência rápida de Java');
  assert.match(el.querySelector('.breadcrumb').textContent, /Referência rápida/);
  await renderReference(el, app, route('reference', { lang: 'cobol' }));
  assert.equal(el.querySelector('h1').textContent, 'Página não encontrada');
});
