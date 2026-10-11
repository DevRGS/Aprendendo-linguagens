import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { initTestMarkdown } from '../helpers/markdown.js';
import { md, mdInline } from '../../js/ui/markdown.js';

setupDom();

test('antes de initMarkdown, md avisa com um erro claro', () => {
  assert.throws(() => md('# oi'), /initMarkdown/);
  assert.throws(() => mdInline('oi'), /initMarkdown/);
});

test('md transforma Markdown em HTML com tabelas', async () => {
  await initTestMarkdown();
  const el = md('# Título\n\n| a | b |\n|---|---|\n| 1 | 2 |');
  assert.equal(el.className, 'md');
  assert.equal(el.querySelector('h1').textContent, 'Título');
  assert.equal(el.querySelectorAll('td').length, 2);
});

test('alertas no estilo GitHub viram quadros com título', () => {
  const el = md('> [!TIP]\n> Use chaves sempre.\n\n> [!CAUTION]\n> **Cuidado** aqui.\n\n> citação comum');
  const boxes = el.querySelectorAll('.callout');
  assert.equal(boxes.length, 2);
  assert.equal(boxes[0].className, 'callout callout-tip');
  assert.equal(boxes[0].querySelector('.callout-title').textContent, 'Dica');
  assert.match(boxes[0].textContent, /Use chaves sempre\./);
  assert.ok(!boxes[0].textContent.includes('[!TIP]'));
  assert.equal(boxes[1].querySelector('.callout-title').textContent, 'Cuidado');
  assert.equal(boxes[1].querySelector('strong:not(.callout-title)').textContent, 'Cuidado');
  assert.equal(el.querySelectorAll('blockquote').length, 1);
});

test('blocos de código ganham cor (inclusive com a linguagem padrão) e botão copiar', () => {
  const el = md('```java\nint x = 1;\n```\n\n```\nfor (int i = 0; i < 3; i++) {}\n```\n\n```nada\ntexto\n```', { lang: 'java' });
  const codes = el.querySelectorAll('pre > code');
  assert.ok(codes[0].querySelector('.hljs-type, .hljs-keyword'));
  assert.ok(codes[1].querySelector('.hljs-keyword'));
  assert.equal(codes[2].querySelector('span'), null);
  assert.equal(el.querySelectorAll('pre .copy-btn').length, 3);
});

test('o botão copiar copia o código e avisa se não conseguir', async () => {
  const copied = [];
  navigator.clipboard = { writeText: async (text) => { copied.push(text); } };
  const el = md('```java\nint x = 1;\n```');
  const btn = el.querySelector('.copy-btn');
  btn.click();
  await tick();
  assert.deepEqual(copied, ['int x = 1;\n']);
  assert.equal(btn.textContent, 'copiado!');
  navigator.clipboard = { writeText: async () => { throw new Error('negado'); } };
  btn.click();
  await tick();
  assert.equal(btn.textContent, 'não deu');
});

test('mdInline renderiza só a linha', () => {
  const el = mdInline('Use `List.of()` **sempre**');
  assert.equal(el.tagName, 'SPAN');
  assert.equal(el.querySelector('code').textContent, 'List.of()');
  assert.equal(el.querySelector('p'), null);
});
