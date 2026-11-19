import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { unzipSync, strFromU8 } from 'fflate';
import { marked } from 'marked';
import { setupDom, waitFor } from './helpers/dom.js';
import { makeTestApp, profileState, route, container } from './helpers/app.js';
import { renderLanguage } from '../js/ui/views/language.js';
import { renderLesson } from '../js/ui/views/lesson.js';
import { renderExam } from '../js/ui/views/exam.js';

const root = new URL('../content/', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const json = (path) => JSON.parse(read(path));
const download = (path) => readFileSync(new URL(path, root));

test('Python aparece no catálogo com as 64 aulas e bancos ligados a elas', () => {
  const entry = json('catalog.json').languages.find(({ id }) => id === 'python');
  assert.deepEqual(entry, { id: 'python', dir: 'python' });
  const manifest = json('python/language.json');
  assert.equal(manifest.modules.length, 16);
  assert.equal(manifest.engine, undefined);
  for (const mod of manifest.modules) {
    const base = `python/${mod.dir}`;
    const { questions } = json(`${base}/questions.json`);
    const { cards } = json(`${base}/flashcards.json`);
    assert.equal(mod.lessons.length, 4);
    for (const lesson of mod.lessons) {
      assert.equal(questions.filter(({ lesson: id }) => id === lesson.id).length, 4);
      assert.equal(cards.filter(({ lesson: id }) => id === lesson.id).length, 2);
    }
  }
});

test('links, exemplos e comandos levam a materiais equivalentes no navegador e terminal', () => {
  for (const mod of json('python/language.json').modules) {
    const kit = unzipSync(download(`python/kits/${mod.id}.zip`));
    assert.ok(kit['README.md']);
    for (const lesson of mod.lessons) {
      const page = marked.parse(read(`python/${mod.dir}/${lesson.file}`));
      const path = `python/praticas/${mod.id}/${lesson.id}`;
      assert.ok(page.includes(`href="content/${path}.ipynb"`));
      assert.ok(page.includes(`href="content/python/kits/${mod.id}.zip"`));
      const notebook = json(`${path}.ipynb`);
      const solution = json(`${path}-resolvido.ipynb`);
      assert.equal(notebook.nbformat, 4);
      assert.ok(notebook.cells.filter((cell) => cell.cell_type === 'code')
        .every((cell) => cell.execution_count === null && cell.outputs.length === 0));
      assert.ok(solution.cells.filter((cell) => cell.cell_type === 'code').length >= 3);
      for (const filename of ['e1/exemplo.py', 'e2/variacao.py', 'e3/exercicio.py', 'e3-resolvido/solucao.py']) {
        assert.ok(kit[`aulas/${lesson.id}/${filename}`], filename);
      }
      const script = strFromU8(kit[`aulas/${lesson.id}/e1/exemplo.py`]).trim();
      assert.ok(notebook.cells.some((cell) => cell.source.join('').includes(script)));
    }
  }
  assert.ok(existsSync(new URL('python/kits/python-completo.zip', root)));
});

test('a primeira aula aparece no fluxo real e sua conclusão ativa as cartas', async () => {
  setupDom({ url: 'https://example.test/Aprendendo-linguagens/' });
  const app = await makeTestApp({ state: profileState(), fixture: false });
  const el = container();
  await renderLanguage(el, app, route('language', { lang: 'python' }));
  assert.match(el.textContent, /0\/64 aulas/);
  assert.equal(el.querySelectorAll('.module-card').length, 16);
  await renderLesson(el, app, route('lesson', {
    lang: 'python', module: 'inicio', lesson: 'primeira-execucao',
  }));
  assert.match(el.querySelector('.md h1').textContent, /[Pp]rimeira/);
  assert.ok(el.querySelector('.copy-btn'));
  assert.ok(el.querySelector('details'));
  const notebook = el.querySelector('a[download][href$="primeira-execucao.ipynb"]');
  assert.equal(new URL(notebook.href).pathname,
    '/Aprendendo-linguagens/content/python/praticas/inicio/primeira-execucao.ipynb');
  el.querySelector('.lesson-foot .btn-primary').click();
  await waitFor(() => app.store.get().lessons['python.inicio.primeira-execucao']?.doneAt);
  const { cards } = app.store.get();
  assert.equal(Object.keys(cards).filter((id) => id.startsWith('python.inicio.')).length, 2);
  await renderExam(el, app, route('exam', { lang: 'python' }));
  assert.match(el.textContent, /40 perguntas de todos os módulos/);
});
