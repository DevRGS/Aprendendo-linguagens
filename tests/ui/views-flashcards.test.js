import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container, texts } from '../helpers/app.js';
import { renderFlashcards } from '../../js/ui/views/flashcards.js';
import { toDayKey } from '../../js/core/dates.js';

setupDom();
const today = toDayKey(new Date());
const card = (extra = {}) => ({ box: 0, due: today, reviews: 0, lapses: 0, xpDay: null, ...extra });
const key = (k, target = document) => target.dispatchEvent(new window.KeyboardEvent('keydown', { key: k, bubbles: true }));
const button = (el, start) => [...el.querySelectorAll('button')].find((b) => b.textContent.startsWith(start));

async function open(state, query = {}) {
  const app = await makeTestApp({ state });
  const el = container();
  document.body.append(el);
  const cleanup = await renderFlashcards(el, app, route('flashcards', {}, query));
  return { app, el, cleanup };
}

test('sem cartas liberadas, orienta a concluir aulas', async () => {
  const { el, cleanup } = await open(profileState());
  assert.equal(el.querySelector('h1').textContent, '🧠 Flashcards');
  assert.deepEqual(texts(el, '.stat-value'), ['0', '0', '0', '0']);
  assert.match(el.textContent, /Nenhuma carta liberada ainda/);
  assert.equal(button(el, 'Revisar pendentes').disabled, true);
  assert.equal(button(el, 'Estudo livre').disabled, true);
  assert.equal(button(el, 'Meus erros').disabled, true);
  cleanup();
  el.remove();
});

test('revisão do dia: Espaço vira, 1/2/3 avaliam, "Errei" volta no fim e o resumo conta tudo', async () => {
  const cards = { 'java.fundamentos.f04': card(), 'java.fundamentos.f05': card(), 'java.fundamentos.f06': card({ box: 5, due: '2999-01-01' }) };
  const { app, el, cleanup } = await open(profileState({ cards }));
  assert.deepEqual(texts(el, '.stat-value'), ['2', '2', '1', '3']);
  button(el, 'Revisar pendentes (2)').click();
  assert.equal(el.querySelector('.fc-session p').textContent, 'Carta 1 de 2');
  assert.equal(el.querySelector('.rate').hidden, true);
  assert.match(el.querySelector('.fc-level').textContent, /Nível 1\/7/);
  key('3');
  assert.equal(el.querySelector('.rate').hidden, true);
  key(' ');
  assert.equal(el.querySelector('.flashcard').classList.contains('flipped'), true);
  assert.equal(el.querySelector('.rate').hidden, false);
  key('1');
  assert.equal(el.querySelector('.fc-session p').textContent, 'Carta 2 de 3');
  key(' ');
  key('3');
  assert.equal(el.querySelector('.fc-session p').textContent, 'Carta 3 de 3');
  el.querySelector('.flashcard').click();
  el.querySelectorAll('.rate-btn')[2].click();
  assert.equal(el.querySelector('h1').textContent, 'Sessão concluída!');
  assert.match(el.textContent, /Você revisou 3 cartas: 🟢 2 fáceis · 🟡 0 difíceis · 🔴 1 erradas\./);
  const state = app.store.get();
  assert.equal(state.counters.cardReviews, 3);
  assert.equal(state.cards['java.fundamentos.f04'].box + state.cards['java.fundamentos.f05'].box, 2);
  assert.equal(state.xp.total, 4);
  button(el, 'Voltar ao painel').click();
  assert.equal(el.querySelector('h1').textContent, '🧠 Flashcards');
  cleanup();
  el.remove();
});

test('"Errei" repete a carta no máximo duas vezes na mesma sessão', async () => {
  const { el, cleanup } = await open(profileState({ cards: { 'java.fundamentos.f04': card() } }));
  button(el, 'Revisar pendentes').click();
  for (let i = 0; i < 3; i++) {
    key(' ');
    key('1');
  }
  assert.match(el.textContent, /Você revisou 3 cartas: .* 🔴 3 erradas/);
  cleanup();
  el.remove();
});

test('estudo livre não muda o agendamento; Enter na carta também vira', async () => {
  const cards = { 'java.fundamentos.f04': card({ due: '2999-01-01', box: 3 }) };
  const { app, el, cleanup } = await open(profileState({ cards }));
  button(el, 'Estudo livre').click();
  assert.match(el.querySelector('.fc-session p').textContent, /estudo livre/);
  key('Enter', el.querySelector('.flashcard'));
  assert.equal(el.querySelector('.flashcard').classList.contains('flipped'), true);
  key('2');
  assert.match(el.textContent, /No estudo livre, o agendamento das cartas não muda\./);
  assert.deepEqual(app.store.get().cards, cards);
  assert.equal(app.store.get().counters.cardReviews, 0);
  cleanup();
  el.remove();
});

test('encerrar a sessão no meio mostra o resumo do que foi feito', async () => {
  const { el, cleanup } = await open(profileState({ cards: { 'java.fundamentos.f04': card(), 'java.fundamentos.f05': card() } }));
  button(el, 'Revisar pendentes').click();
  button(el, 'Encerrar sessão').click();
  assert.match(el.textContent, /Você revisou 0 cartas/);
  cleanup();
  el.remove();
});

test('meus erros refaz as perguntas originais (inclusive pela URL ?modo=erros)', async () => {
  const state = profileState({ mistakes: ['java.fundamentos.q01', 'java.fundamentos.q99'] });
  const { el, cleanup } = await open(state);
  assert.equal(button(el, 'Meus erros').textContent, 'Meus erros (1)');
  button(el, 'Meus erros').click();
  assert.match(el.querySelector('.quiz-title').textContent, /Meus erros/);
  assert.match(el.textContent, /Pergunta 1 de 1/);
  cleanup();
  el.remove();
  const direct = await open(state, { modo: 'erros' });
  assert.match(direct.el.querySelector('.quiz-title').textContent, /Meus erros/);
  direct.cleanup();
  direct.el.remove();
  const empty = await open(profileState(), { modo: 'erros' });
  assert.equal(empty.el.querySelector('h1').textContent, '🧠 Flashcards');
  empty.cleanup();
  empty.el.remove();
});

test('o filtro por módulo atualiza os números e fica aberto', async () => {
  const { el, cleanup } = await open(profileState({ cards: { 'java.fundamentos.f04': card() } }));
  const details = el.querySelector('details');
  details.open = true;
  details.dispatchEvent(new window.Event('toggle'));
  const box = el.querySelector('.scope-mods input');
  box.checked = false;
  box.dispatchEvent(new window.Event('change'));
  assert.deepEqual(texts(el, '.stat-value'), ['0', '0', '0', '0']);
  assert.equal(el.querySelector('details').open, true);
  cleanup();
  el.remove();
});

test('depois da limpeza (troca de tela), as teclas não fazem mais nada', async () => {
  const { el, cleanup } = await open(profileState({ cards: { 'java.fundamentos.f04': card() } }));
  button(el, 'Revisar pendentes').click();
  cleanup();
  key(' ');
  assert.equal(el.querySelector('.flashcard').classList.contains('flipped'), false);
  el.remove();
  await tick();
});
