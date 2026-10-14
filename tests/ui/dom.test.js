import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from '../helpers/dom.js';
import { h, mount, bar, pct, toneFor, plural, formatDay, formatDateTime, formatDuration } from '../../js/ui/dom.js';

setupDom();

test('h cria o elemento com classe, texto, atributos e filhos', () => {
  const el = h('a', { class: 'btn', href: '#/x', 'aria-label': 'Ir' }, 'Olá ', h('strong', { text: 'mundo' }), null, false, [' ', ['!']]);
  assert.equal(el.tagName, 'A');
  assert.equal(el.className, 'btn');
  assert.equal(el.getAttribute('href'), '#/x');
  assert.equal(el.getAttribute('aria-label'), 'Ir');
  assert.equal(el.textContent, 'Olá mundo !');
});

test('h trata texto da pessoa como texto, nunca como HTML', () => {
  const nome = '<img src=x onerror="alert(1)">';
  const el = h('p', {}, nome);
  assert.equal(el.querySelector('img'), null);
  assert.equal(el.textContent, nome);
  assert.equal(h('p', { text: nome }).querySelector('img'), null);
});

test('h aceita html confiável, style, eventos e atributos booleanos', () => {
  let clicks = 0;
  const el = h('button', { html: '<b>x</b>', style: { width: '50%', '--accent': '#fff' }, onClick: () => { clicks += 1; }, disabled: true, hidden: null });
  assert.equal(el.querySelector('b').textContent, 'x');
  assert.equal(el.style.getPropertyValue('width'), '50%');
  assert.equal(el.style.getPropertyValue('--accent'), '#fff');
  assert.equal(el.hasAttribute('disabled'), true);
  assert.equal(el.hasAttribute('hidden'), false);
  el.disabled = false;
  el.click();
  assert.equal(clicks, 1);
});

test('mount troca todo o conteúdo do container', () => {
  const box = h('div', {}, 'antigo');
  mount(box, h('span', { text: 'a' }), [h('span', { text: 'b' })], null);
  assert.equal(box.textContent, 'ab');
  assert.equal(box.children.length, 2);
});

test('bar limita entre 0 e 100% e informa o valor para leitores de tela', () => {
  const b = bar(1.5, { tone: 'success', label: 'Meta' });
  assert.equal(b.getAttribute('role'), 'progressbar');
  assert.equal(b.getAttribute('aria-valuenow'), '100');
  assert.equal(b.getAttribute('aria-label'), 'Meta');
  assert.equal(b.firstChild.className, 'bar-fill tone-success');
  assert.equal(b.firstChild.style.getPropertyValue('width'), '100%');
  assert.equal(bar(-1).getAttribute('aria-valuenow'), '0');
  assert.equal(bar(undefined).firstChild.className, 'bar-fill');
});

test('pct, toneFor e plural', () => {
  assert.equal(pct(0.666), '67%');
  assert.equal(pct(undefined), '0%');
  assert.equal(toneFor(0.8), 'success');
  assert.equal(toneFor(0.6), 'warning');
  assert.equal(toneFor(0.59), 'danger');
  assert.equal(plural(1, 'dia', 'dias'), 'dia');
  assert.equal(plural(0, 'dia', 'dias'), 'dias');
});

test('formatos de data e duração', () => {
  assert.equal(formatDay('2026-10-11'), '11/10/2026');
  assert.match(formatDateTime(new Date(2026, 9, 11, 14, 30).toISOString()), /11\/10\/2026/);
  assert.equal(formatDuration(42), '42 s');
  assert.equal(formatDuration(125.4), '2 min 05 s');
  assert.equal(formatDuration(-3), '0 s');
});
