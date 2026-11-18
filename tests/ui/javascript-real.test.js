import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, waitFor } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container } from '../helpers/app.js';
import { renderLanguage } from '../../js/ui/views/language.js';
import { renderLesson } from '../../js/ui/views/lesson.js';
import { renderReference } from '../../js/ui/views/reference.js';
import { loadModuleBank } from '../../js/data/content.js';
import { md } from '../../js/ui/markdown.js';
import { spawnSync } from 'node:child_process';

setupDom();

test('trilha JavaScript real lista aulas e conclusão libera suas cartas/XP', async () => {
  const app = await makeTestApp({ state: profileState(), fixture: false });
  assert.ok(app.getLanguage('javascript'));
  const el = container();
  await renderLanguage(el, app, route('language', { lang: 'javascript' }));
  assert.equal(el.querySelectorAll('.module-card').length, 14);
  assert.ok(el.querySelector('a[href="#/javascript/introducao/primeira-pagina"]'));
  await renderLesson(el, app, route('lesson', { lang: 'javascript', module: 'introducao', lesson: 'primeira-pagina' }));
  assert.ok(el.querySelector('code.language-html'));
  const before = app.store.get().xp.total;
  el.querySelector('.lesson-foot button').click();
  await waitFor(() => Boolean(app.store.get().lessons['javascript.introducao.primeira-pagina']));
  assert.ok(app.store.get().xp.total > before);
  assert.ok(Object.keys(app.store.get().cards).some((id) => id.startsWith('javascript.introducao.')));
});

test('solução de template literal preserva as crases ao copiar e executa a saída ensinada', async () => {
  const app = await makeTestApp({ state: profileState(), fixture: false });
  const el = container();
  await renderLesson(el, app, route('lesson', { lang: 'javascript', module: 'fundamentos', lesson: 'numeros-e-textos' }));
  const code = [...el.querySelectorAll('details code')].find((item) => item.textContent.includes('const total'));
  assert.ok(code);
  const output = [];
  // Apenas a solução própria, explicitamente selecionada desta aula, sem entrada da pessoa.
  new Function('console', code.textContent)({ log: (value) => output.push(value) });
  assert.deepEqual(output, ['Total: 10']);
});

test('referência preserva os dois operadores lógicos na tabela renderizada', async () => {
  const app = await makeTestApp({ state: profileState(), fixture: false });
  const el = container();
  await renderReference(el, app, route('reference', { lang: 'javascript' }));
  const row = [...el.querySelectorAll('tr')].find((item) => item.cells[0]?.textContent.includes('&&'));
  assert.ok(row);
  assert.equal(row.cells.length, 2);
  assert.match(row.cells[0].textContent, /&&.*\|\|/);
  assert.match(row.cells[1].textContent, /Curto-circuito/);
});

test('carta de importação oferece um exemplo literal com sintaxe de módulo válida', async () => {
  const app = await makeTestApp({ state: profileState(), fixture: false });
  const lang = app.getLanguage('javascript');
  const bank = await loadModuleBank(lang, lang.modules.find((item) => item.id === 'moderno'));
  const card = bank.cards.find((item) => item.id === 'javascript.moderno.f08');
  const code = md(card.back).querySelector('code');
  assert.ok(code, 'importação precisa aparecer como código copiável');
  const result = spawnSync(process.execPath, ['--check', '--input-type=module'], { input: code.textContent, encoding: 'utf8', timeout: 3000 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});

test('cartas JavaScript que ensinam tags mostram código em vez de criar scripts', async () => {
  const app = await makeTestApp({ state: profileState(), fixture: false });
  const lang = app.getLanguage('javascript');
  assert.ok(lang);
  const module = lang.modules.find((item) => item.id === 'moderno');
  const bank = await loadModuleBank(lang, module);
  const card = bank.cards.find((item) => item.id === 'javascript.moderno.f09');
  const rendered = md(card.back);
  assert.equal(rendered.querySelector('script'), null);
  assert.match(rendered.textContent, /<script type="module" src="app\.mjs"><\/script>/);
});

test('aulas JavaScript reais renderizam fontes e código copiável; exemplos HTML são texto', async () => {
  const app = await makeTestApp({ state: profileState(), fixture: false });
  const lang = app.getLanguage('javascript');
  assert.ok(lang);
  const el = container();
  for (const module of lang.modules) {
    for (const lesson of module.lessons) {
      await renderLesson(el, app, route('lesson', { lang: lang.id, module: module.id, lesson: lesson.id }));
      assert.ok(el.querySelector('.md h1'), lesson.id);
      assert.ok(el.querySelector('.md a[href^="https://"]'), lesson.id);
      assert.equal(el.querySelector('.md script'), null, `${lesson.id}: código deve ser mostrado, não executado`);
      for (const code of el.querySelectorAll('.md pre > code')) assert.ok(code.parentElement.querySelector('.copy-btn'));
    }
  }
  await renderReference(el, app, route('reference', { lang: lang.id }));
  assert.equal(el.querySelector('.md h1').textContent, 'Referência rápida de JavaScript');
});
