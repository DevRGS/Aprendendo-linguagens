import { test } from 'node:test';
import { byteFigure, byteMode, byteCompanion, byteLessonHint } from '../../js/ui/components/byte.js';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setupDom } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container } from '../helpers/app.js';
import { answerCurrent, nextButton } from '../helpers/quiz.js';
import { addDays, toDayKey } from '../../js/core/dates.js';
import { runQuiz } from '../../js/ui/components/quiz-runner.js';
import { loadBanks } from '../../js/data/content.js';
import { prepareQuestion } from '../../js/core/quiz.js';
import { nextStudyStep } from '../../js/ui/components/study-path.js';
import { renderHome } from '../../js/ui/views/home.js';
import { renderSettings } from '../../js/ui/views/settings.js';
import { renderProjects } from '../../js/ui/views/projects.js';
import { parseRoute } from '../../js/router.js';

setupDom();

test('retomada acompanha a ordem do manifesto, volta ao início e oferece prática, prova e certificado', async () => {
  const app = await makeTestApp({ state: profileState() });
  const java = app.getLanguage('java');
  const state = app.store.get();
  const keys = java.modules[0].lessons.map((l) => `java.fundamentos.${l.id}`);
  state.lastLesson = keys.at(-2);
  state.lessons[keys.at(-2)] = { doneAt: '2026-01-01' };
  assert.equal(nextStudyStep(state, java).href, '#/java/fundamentos/arrays');
  state.lessons[keys.at(-1)] = { doneAt: '2026-01-01' };
  assert.equal(nextStudyStep(state, java).href, '#/java/fundamentos/variaveis-e-tipos');
  state.lessons = Object.fromEntries(keys.map((k) => [k, { doneAt: '2026-01-01' }]));
  assert.equal(nextStudyStep(state, java).href, '#/java/fundamentos/pratica');
  state.modules['java.fundamentos'] = { bestPractice: 0.8 };
  assert.equal(nextStudyStep(state, java).href, '#/java/prova');
  state.exams.java = { best: 0.8 };
  assert.equal(nextStudyStep(state, java).href, '#/java/certificado');
});

test('calendário distingue estudo legado com zero XP, meta e retorno com uma carta devida', async () => {
  const today = toDayKey(new Date());
  const older = addDays(today, -3);
  const lastDay = addDays(today, -2);
  const state = profileState({
    streak: { current: 2, lastDay, best: 2 },
    xp: { total: 20, byDay: { [older]: 0, [lastDay]: 20 } },
    intensiva: { current: 1, best: 1, lastDay, days: { [lastDay]: { goal: 20, reached: true, legacy: false } } },
    cards: { 'java.fundamentos.f01': { box: 0, due: today } },
  });
  const app = await makeTestApp({ state });
  const el = container();
  await renderHome(el, app);
  assert.equal(el.querySelectorAll('.week-days li').length, 7);
  assert.match(el.querySelector('.day-unknown').textContent, /meta histórica desconhecida · 0 XP/);
  assert.match(el.querySelector('.day-goal').textContent, /20 XP de 20/);
  assert.equal(el.querySelector('.byte-speech').getAttribute('href'), '#/flashcards?modo=pendentes');
  assert.equal(el.querySelector('.byte').getAttribute('aria-hidden'), 'true');
});

test('preferência parada mantém expressão e preferência oculta preserva a ação de estudo', async () => {
  const app = await makeTestApp({ state: profileState() });
  const el = container();
  for (const mode of ['still', 'off']) {
    renderSettings(el, app);
    el.querySelector(`input[value="${mode}"]`).click();
    [...el.querySelectorAll('button')].find((b) => b.textContent === 'Salvar perfil').click();
    await renderHome(el, app);
    assert.equal(Boolean(el.querySelector('.byte')), mode === 'still');
    assert.ok(el.querySelector('.resume button'));
    assert.equal(app.store.get().profile.settings.byte, mode);
  }
});

test('simulado mantém cabeçalho e avisos neutros até o resultado, mesmo ao atingir a meta', async () => {
  const state = profileState();
  state.profile.dailyGoal = 20;
  const today = toDayKey(new Date());
  state.xp = { total: 99, byDay: { [today]: 15 } };
  const app = await makeTestApp({ state });
  app.currentRoute = route('quiz');
  app.layout.render(app.store.get(), 'quiz');
  const top = document.getElementById('topbar');
  const toasts = document.getElementById('toasts');
  toasts.replaceChildren();
  const before = top.textContent;
  const question = (await loadBanks(app.languages)).questions.find((q) => q.type === 'multiple');
  const el = container();
  runQuiz(el, app, { mode: 'simulado', kind: 'quiz', title: 'Simulado', questions: [prepareQuestion(question)] });
  answerCurrent(el, new Map([[question.id, question]]));
  assert.ok(app.store.get().xp.total > 99);
  assert.equal(top.textContent, before);
  assert.equal(toasts.textContent, '');
  assert.equal(el.querySelector('.byte'), null);
  assert.equal(el.querySelector('.feedback').textContent, 'Resposta registrada.');
  nextButton(el).click();
  assert.notEqual(top.textContent, before);
  assert.match(toasts.textContent, /Meta de hoje atingida!/);
  assert.ok(el.querySelector('.quiz-result'));
});

test('galeria abre por URL e aponta o projeto de Python para a aula e o ZIP publicados', async () => {
  assert.equal(parseRoute('#/projetos').name, 'projetos');
  const python = JSON.parse(readFileSync(new URL('../../content/python/language.json', import.meta.url), 'utf8'));
  const app = { getLanguage: (id) => id === 'python' ? { ...python, id, dir: id } : null };
  const el = container();
  renderProjects(el, app);
  const download = el.querySelector('a[href="content/python/kits/projeto.zip"]');
  assert.ok(download?.hasAttribute('download'));
  assert.equal(download.closest('article').querySelector('.btn-primary').getAttribute('href'), '#/python/projeto/auditar');
});

test('figura decorativa, fala e dica de Byte respeitam a preferência individual', () => {
  setupDom();
  const hidden = { settings: { byte: 'off' } };
  const still = { settings: { byte: 'still' } };
  assert.equal(byteMode(null), 'animated');
  assert.equal(byteFigure(hidden), null);
  assert.equal(byteCompanion(hidden, { pose: 'wave', speech: 'Oi' }), null);
  assert.equal(byteLessonHint(hidden, '#/git'), null);
  const companion = byteCompanion(still, { pose: 'wave', speech: 'Oi' });
  assert.ok(companion.querySelector('.byte--still[aria-hidden="true"]'));
  assert.equal(companion.querySelector('.byte-speech').textContent, 'Oi');
  const hint = byteLessonHint(still, '#/git');
  assert.equal(hint.open, false);
  assert.equal(hint.querySelector('a').getAttribute('href'), '#/git');
});
