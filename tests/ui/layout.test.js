import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { profileState, texts } from '../helpers/app.js';
import { createLayout } from '../../js/ui/layout.js';
import { createInitialState } from '../../js/core/state.js';
import { toDayKey } from '../../js/core/dates.js';

setupDom();
const languages = [{ id: 'java', name: 'Java', icon: '☕' }];
const layout = createLayout({ languages });
const topbar = () => document.getElementById('topbar');

test('sem perfil, o topo só mostra a marca e os menus ficam vazios', () => {
  layout.render(createInitialState(), 'home');
  assert.match(topbar().textContent, /Central de Linguagens/);
  assert.equal(topbar().querySelector('.topbar-stats'), null);
  assert.equal(document.getElementById('sidebar').children.length, 0);
  assert.equal(document.getElementById('tabbar').children.length, 0);
});

test('com perfil, o topo mostra meta do dia, sequência, nível e avatar', () => {
  const today = toDayKey(new Date());
  const s = profileState({ xp: { total: 150, byDay: { [today]: 30 } }, streak: { current: 4, best: 4, lastDay: today } });
  layout.render(s, 'home');
  const bar = topbar().querySelector('.topbar-stats');
  assert.match(bar.querySelector('.goal').textContent, /30\/50 XP/);
  assert.equal(bar.querySelectorAll('.pill strong')[0].textContent, '4');
  assert.equal(bar.querySelectorAll('.pill strong')[1].textContent, '2');
  assert.equal(bar.querySelector('.avatar').textContent, '🦊');
  assert.equal(bar.querySelector('.avatar').getAttribute('aria-label'), 'Perfil de Rafa');
});

test('menus marcam a rota atual, mostram as linguagens e as cartas pendentes', () => {
  const today = toDayKey(new Date());
  const s = profileState({ cards: { 'java.a.f01': { box: 0, due: today }, 'java.a.f02': { box: 1, due: '2999-01-01' } } });
  layout.render(s, 'flashcards');
  const sidebar = document.getElementById('sidebar');
  assert.deepEqual(texts(sidebar, '.nav-link.active .nav-label'), ['Flashcards']);
  assert.equal(sidebar.querySelector('.nav-link.active').getAttribute('aria-current'), 'page');
  assert.deepEqual(texts(sidebar, '.nav-badge'), ['1']);
  assert.ok(texts(sidebar, '.nav-label').includes('Java'));
  assert.deepEqual(texts(document.getElementById('tabbar'), '.nav-badge'), ['1']);
});

test('avisos: setBanner mostra, não duplica e clearBanner remove', () => {
  let clicked = 0;
  const box = document.getElementById('banners');
  layout.setBanner('lembrete', { text: 'Faça backup', tone: 'warning', actions: [{ label: 'Exportar', onClick: () => { clicked += 1; } }] });
  const first = box.firstChild;
  layout.setBanner('lembrete', { text: 'Faça backup', tone: 'warning', actions: [] });
  assert.equal(box.firstChild, first);
  assert.equal(box.querySelector('.banner').className, 'banner banner-warning');
  box.querySelector('button').click();
  assert.equal(clicked, 1);
  layout.setBanner('outro', { text: 'Outro aviso' });
  assert.equal(box.querySelectorAll('.banner').length, 2);
  layout.clearBanner('lembrete');
  layout.clearBanner('inexistente');
  assert.deepEqual(texts(box, '.banner > span:first-child'), ['Outro aviso']);
});

test('toast aparece e some sozinho', async () => {
  layout.toast('Salvo!', { tone: 'success', timeout: 10 });
  const el = document.querySelector('#toasts .toast');
  assert.equal(el.textContent, 'Salvo!');
  assert.equal(el.className, 'toast toast-success');
  await tick(350);
  assert.equal(document.querySelector('#toasts .toast'), null);
});

test('announce escreve na região lida pelos leitores de tela', async () => {
  layout.announce('Resposta correta.');
  await tick(80);
  assert.equal(document.getElementById('sr-live').textContent, 'Resposta correta.');
});
