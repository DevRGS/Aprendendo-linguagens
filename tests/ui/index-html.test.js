import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { SHELL_BODY } from '../helpers/dom.js';
import { HLJS_URL, MARKED_URL } from '../../js/config.js';

const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const doc = new JSDOM(html).window.document;

test('index.html tem os mesmos elementos fixos que os testes simulam', () => {
  const shell = new JSDOM(`<body>${SHELL_BODY}</body>`).window.document;
  const ids = [...shell.querySelectorAll('[id]')].map((el) => el.id);
  for (const id of ids) assert.ok(doc.getElementById(id), `falta #${id} no index.html`);
  assert.ok(doc.querySelector('.skip-link'), 'falta o botão .skip-link');
});

test('index.html carrega o app como módulo e os estilos por caminho relativo', () => {
  const script = doc.querySelector('script[type="module"]');
  assert.equal(script?.getAttribute('src'), 'js/main.js');
  const hrefs = [...doc.querySelectorAll('link[rel="stylesheet"]')].map((l) => l.getAttribute('href'));
  for (const css of ['css/tokens.css', 'css/base.css', 'css/components.css']) assert.ok(hrefs.includes(css), css);
  for (const href of hrefs) assert.ok(!href.startsWith('/'), `caminho absoluto quebra no GitHub Pages: ${href}`);
});

test('a folha de estilo do highlight.js usa a mesma versão do script em config.js', () => {
  const version = /cdn-assets@([\d.]+)/.exec(HLJS_URL)[1];
  const css = [...doc.querySelectorAll('link[rel="stylesheet"]')].find((l) => l.getAttribute('href').includes('highlightjs'));
  assert.ok(css.getAttribute('href').includes(`cdn-assets@${version}/`));
  assert.match(MARKED_URL, /marked@\d+\.\d+\.\d+\//);
});

test('o CSS esconde de verdade qualquer elemento com o atributo hidden', () => {
  const base = readFileSync(new URL('../../css/base.css', import.meta.url), 'utf8');
  assert.match(base, /\[hidden\]\s*\{\s*display:\s*none\s*!important;?\s*\}/);
});
