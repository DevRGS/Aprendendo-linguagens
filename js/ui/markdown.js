import { MARKED_URL, HLJS_URL } from '../config.js';

let lib = null;

// Sem argumento, carrega marked e highlight.js da CDN. Os testes injetam as mesmas versões locais.
export async function initMarkdown(libs = null) {
  if (libs) {
    lib = libs;
    return;
  }
  if (lib) return;
  const [markedModule, hljsModule] = await Promise.all([import(MARKED_URL), import(HLJS_URL)]);
  lib = { marked: markedModule.marked, hljs: hljsModule.default };
}

function requireLib() {
  if (!lib) throw new Error('Markdown ainda não foi carregado: chame initMarkdown() antes.');
  return lib;
}

const CALLOUTS = {
  NOTE: ['note', 'Nota'],
  TIP: ['tip', 'Dica'],
  IMPORTANT: ['important', 'Importante'],
  WARNING: ['warning', 'Atenção'],
  CAUTION: ['caution', 'Cuidado'],
};

function decorateCallouts(root) {
  for (const quote of root.querySelectorAll('blockquote')) {
    const first = quote.querySelector('p');
    const match = first && /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/.exec(first.innerHTML);
    if (!match) continue;
    const [cls, label] = CALLOUTS[match[1]];
    first.innerHTML = first.innerHTML.slice(match[0].length);
    if (!first.innerHTML.trim()) first.remove();
    const box = document.createElement('div');
    box.className = `callout callout-${cls}`;
    const title = document.createElement('strong');
    title.className = 'callout-title';
    title.textContent = label;
    box.append(title, ...quote.childNodes);
    quote.replaceWith(box);
  }
}

function addCopyButton(pre) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-btn';
  btn.textContent = 'copiar';
  btn.addEventListener('click', async (event) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(pre.querySelector('code').textContent);
      btn.textContent = 'copiado!';
    } catch {
      btn.textContent = 'não deu';
    }
    setTimeout(() => { btn.textContent = 'copiar'; }, 1500);
  });
  pre.append(btn);
}

function decorateCode(root, hljs, defaultLang) {
  for (const code of root.querySelectorAll('pre > code')) {
    const m = /language-([\w-]+)/.exec(code.className);
    const language = m ? m[1] : defaultLang;
    if (language && hljs.getLanguage(language)) {
      code.innerHTML = hljs.highlight(code.textContent, { language }).value;
      code.classList.add('hljs');
    }
    addCopyButton(code.parentElement);
  }
}

export function md(text, { lang } = {}) {
  const { marked, hljs } = requireLib();
  const div = document.createElement('div');
  div.className = 'md';
  div.innerHTML = marked.parse(String(text ?? ''), { gfm: true });
  decorateCallouts(div);
  decorateCode(div, hljs, lang);
  return div;
}

export function mdInline(text) {
  const { marked } = requireLib();
  const span = document.createElement('span');
  span.innerHTML = marked.parseInline(String(text ?? ''));
  return span;
}
