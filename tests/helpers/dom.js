// Simula o navegador nos testes: cria o DOM com os mesmos elementos fixos do index.html
// e registra window, document, location etc. como globais. Cada arquivo de teste roda
// em processo próprio, então os globais não vazam entre arquivos.
import { JSDOM } from 'jsdom';

export const SHELL_BODY = `
  <button type="button" class="skip-link">Pular para o conteúdo</button>
  <header id="topbar" class="topbar"></header>
  <div class="shell">
    <nav id="sidebar" class="sidebar" aria-label="Navegação principal"></nav>
    <div class="content">
      <div id="banners" class="banners"></div>
      <main id="main" tabindex="-1"></main>
    </div>
  </div>
  <nav id="tabbar" class="tabbar" aria-label="Navegação"></nav>
  <div id="toasts" class="toasts" aria-live="polite"></div>
  <div id="sr-live" class="sr-only" aria-live="assertive"></div>`;

const DOM_GLOBALS = [
  'window', 'document', 'location', 'history', 'navigator', 'Node', 'Element', 'HTMLElement',
  'HTMLInputElement', 'HTMLButtonElement', 'DocumentFragment', 'Event', 'KeyboardEvent', 'MouseEvent',
  'CustomEvent', 'localStorage', 'sessionStorage', 'getComputedStyle', 'requestAnimationFrame',
  'cancelAnimationFrame', 'DOMParser',
];

function define(name, value) {
  Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
}

export function setupDom({ url = 'http://localhost/', body = SHELL_BODY } = {}) {
  const dom = new JSDOM(`<!doctype html><html lang="pt-BR"><body>${body}</body></html>`, { url, pretendToBeVisual: true });
  const { window } = dom;
  window.matchMedia = (query) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} });
  window.alert = () => {};
  window.confirm = () => true;
  window.print = () => {};
  window.scrollTo = () => {};
  for (const name of DOM_GLOBALS) define(name, window[name]);
  define('alert', (...args) => window.alert(...args));
  define('confirm', (...args) => window.confirm(...args));
  return dom;
}

// Espera as tarefas pendentes (eventos hashchange, setTimeout curtos etc.).
export const tick = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
