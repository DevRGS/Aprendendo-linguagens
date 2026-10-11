import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container, texts } from '../helpers/app.js';
import { renderNotFound } from '../../js/ui/views/not-found.js';
import { renderOnboarding } from '../../js/ui/views/onboarding.js';
import { renderHome } from '../../js/ui/views/home.js';
import { makeEnvelope } from '../../js/core/backup-format.js';
import { toDayKey } from '../../js/core/dates.js';

setupDom();

test('renderNotFound oferece o caminho de volta', () => {
  const el = container();
  renderNotFound(el);
  assert.equal(el.querySelector('h1').textContent, 'Página não encontrada');
  assert.equal(el.querySelector('a').getAttribute('href'), '#/');
});

test('primeira visita: sem nome não avança; com nome cria o perfil e atualiza a tela', async () => {
  const app = await makeTestApp();
  const el = container();
  document.body.append(el);
  renderOnboarding(el, app, route('home'));
  assert.match(el.querySelector('h1').textContent, /Boas-vindas à Central de Linguagens/);
  const form = el.querySelector('form');
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  assert.equal(app.store.get().profile, null);
  el.querySelector('#pf-name').value = 'Rafa';
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  assert.equal(app.store.get().profile.name, 'Rafa');
  assert.equal(app.store.get().profile.dailyGoal, 50);
  assert.equal(app.refreshes, 1);
  el.remove();
});

test('primeira visita: dá para importar um backup feito em outro aparelho', async () => {
  const app = await makeTestApp();
  window.confirm = () => true;
  const el = container();
  renderOnboarding(el, app, route('home'));
  const input = el.querySelector('input[type="file"]');
  const file = new File([JSON.stringify(makeEnvelope(profileState()))], 'b.json');
  Object.defineProperty(input, 'files', { value: [file], configurable: true });
  input.dispatchEvent(new window.Event('change'));
  await tick(20);
  assert.equal(app.store.get().profile.name, 'Rafa');
  assert.equal(app.refreshes, 1);
});

test('início: saudação, meta, sequência, cartas pendentes e linguagens', async () => {
  const today = toDayKey(new Date());
  const state = profileState({
    xp: { total: 30, byDay: { [today]: 30 } },
    streak: { current: 1, best: 3, lastDay: today },
    cards: { 'java.fundamentos.f01': { box: 0, due: today } },
  });
  const app = await makeTestApp({ state });
  const el = container();
  await renderHome(el, app, route('home'));
  assert.match(el.querySelector('h1').textContent, /Olá, Rafa!/);
  const stats = texts(el, '.stat-value');
  assert.deepEqual(stats, ['30/50 XP', '🔥 1 dia', '🧠 1 carta']);
  assert.match(el.textContent, /Recorde: 3 dias/);
  const card = el.querySelector('.lang-card');
  assert.equal(card.getAttribute('href'), '#/java');
  assert.match(card.textContent, /0\/6 aulas · 0%/);
  assert.equal(el.querySelector('.continue'), null);
  assert.match(el.textContent, /Pontos fracos/);
});

test('início: "continuar de onde parou" e nome sempre como texto', async () => {
  const state = profileState({ lastLesson: 'java.fundamentos.lacos' });
  state.profile.name = '<img src=x onerror=alert(1)>';
  const app = await makeTestApp({ state });
  const el = container();
  await renderHome(el, app, route('home'));
  assert.equal(el.querySelector('h1 img'), null);
  assert.match(el.querySelector('h1').textContent, /<img src=x/);
  const cont = el.querySelector('.continue');
  assert.equal(cont.getAttribute('href'), '#/java/fundamentos/lacos');
  assert.match(cont.textContent, /Laços de repetição/);
});
