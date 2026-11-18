import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, waitFor } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container } from '../helpers/app.js';
import { renderLanguage } from '../../js/ui/views/language.js';
import { renderLesson } from '../../js/ui/views/lesson.js';
import { renderReference } from '../../js/ui/views/reference.js';

setupDom();

test('trilha real navega até WSL e concluir a aula libera cartas e progresso', async () => {
  const app = await makeTestApp({ state: profileState(), fixture: false });
  assert.ok(app.getLanguage('linux'), 'Linux deve aparecer no catálogo');
  const el = container();
  await renderLanguage(el, app, route('language', { lang: 'linux' }));
  assert.equal(el.querySelectorAll('.module-card').length, 6);
  assert.ok(el.querySelector('a[href="#/linux/primeiros-passos/instalacao-wsl"]'));
  await renderLesson(el, app, route('lesson', { lang: 'linux', module: 'primeiros-passos', lesson: 'instalacao-wsl' }));
  assert.ok(el.querySelector('code.language-powershell'));
  assert.ok(el.querySelector('code.language-bash'));
  assert.ok(el.querySelector('a[href="https://learn.microsoft.com/pt-br/windows/wsl/install"]'));
  assert.equal(el.querySelector('.challenges'), null);
  const before = app.store.get().xp.total;
  el.querySelector('.lesson-foot button').click();
  await waitFor(() => app.store.get().lessons['linux.primeiros-passos.instalacao-wsl']);
  assert.ok(app.store.get().xp.total > before);
  assert.ok(Object.keys(app.store.get().cards).some((key) => key.startsWith('linux.primeiros-passos.')));
  assert.equal(el.querySelector('.lesson-foot button'), null);
});

test('todas as aulas reais renderizam código copiável e fontes, e a referência abre', async () => {
  const app = await makeTestApp({ state: profileState(), fixture: false });
  const lang = app.getLanguage('linux');
  assert.ok(lang);
  const el = container();
  for (const module of lang.modules) {
    for (const lesson of module.lessons) {
      await renderLesson(el, app, route('lesson', { lang: 'linux', module: module.id, lesson: lesson.id }));
      assert.ok(el.querySelector('.md h1'), lesson.id);
      assert.ok(el.querySelector('.md a[href^="https://"]'), `${lesson.id}: sem fonte`);
      for (const code of el.querySelectorAll('.md pre > code')) {
        assert.ok(code.parentElement.querySelector('.copy-btn'), `${lesson.id}: sem copiar`);
      }
    }
  }
  await renderReference(el, app, route('reference', { lang: 'linux' }));
  assert.equal(el.querySelector('.md h1').textContent, 'Referência rápida de Terminal Linux');
});
