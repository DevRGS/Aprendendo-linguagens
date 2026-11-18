// Exemplos próprios e explícitos. Não extrai/avalia código do Markdown ou da pessoa.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { JSDOM, VirtualConsole } from 'jsdom';

const root = new URL('../verify/javascript/', import.meta.url);
const manifest = new URL('cases.json', root);
const readCases = () => {
  assert.ok(existsSync(manifest), 'faltam os exemplos explícitos JavaScript');
  return JSON.parse(readFileSync(manifest, 'utf8'));
};

test('exemplos incluem o tratamento de HTTP, falha de rede e JSON inválido', () => {
  const cases = readCases();
  assert.ok(cases.some((item) => item.file === 'assincrono-falhas.mjs'), 'falta cenário dos caminhos de erro de fetch');
});

function runDom(item, { saved = null, denyStorage = false } = {}) {
  const logs = [];
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('log', (...values) => logs.push(values.join(' ')));
  virtualConsole.on('jsdomError', (error) => errors.push(error));
  const html = readFileSync(new URL(item.file, root), 'utf8');
  const dom = new JSDOM(html, {
    url: 'https://curso.test/', runScripts: 'dangerously', virtualConsole,
    beforeParse(window) {
      if (saved !== null) window.localStorage.setItem('trilha-js:tarefas:v1', saved);
      if (denyStorage) window.Storage.prototype.setItem = () => { throw new window.DOMException('Bloqueado', 'SecurityError'); };
    },
  });
  assert.deepEqual(errors, [], `${item.file}: execução do HTML`);
  return { dom, logs, errors };
}

test('exemplos JavaScript e HTML produzem as saídas e efeitos ensinados', () => {
  const cases = readCases();
  const covered = new Set();
  for (const item of cases) {
    assert.match(item.file, /^[a-z0-9-]+\.(mjs|html)$/);
    if (item.mode === 'node') {
      const result = spawnSync(process.execPath, [...(item.sqlite ? ['--disable-warning=ExperimentalWarning'] : []), fileURLToPath(new URL(item.file, root))], {
        encoding: 'utf8', timeout: item.sqlite ? 15000 : 5000, maxBuffer: 128 * 1024,
      });
      assert.ifError(result.error);
      assert.equal(result.status, 0, `${item.file}: ${result.stderr}`);
      assert.equal(result.stderr, '', item.file);
      assert.equal(result.stdout, item.stdout, item.file);
    } else {
      assert.equal(item.mode, 'dom', item.file);
      const { dom, logs, errors } = runDom(item);
      try {
        const { document } = dom.window;
        for (const action of item.actions ?? []) {
          const target = document.querySelector(action.selector);
          assert.ok(target, `${item.file}: ${action.selector}`);
          if (action.type === 'value') target.value = action.value;
          else if (action.type === 'click') target.click();
          else if (action.type === 'submit') target.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
          else assert.fail(`Ação desconhecida: ${action.type}`);
        }
        assert.deepEqual(errors, [], item.file);
        assert.deepEqual(logs, item.logs ?? [], item.file);
        for (const check of item.checks ?? []) {
          const found = document.querySelectorAll(check.selector);
          if (check.count !== undefined) assert.equal(found.length, check.count, `${item.file}: ${check.selector}`);
          if (check.text !== undefined) assert.equal(found[0]?.textContent, check.text, `${item.file}: ${check.selector}`);
          if (check.value !== undefined) assert.equal(found[0]?.value, check.value, `${item.file}: ${check.selector}`);
        }
      } finally { dom.window.close(); }
    }
    item.lessons.forEach((id) => covered.add(id));
  }
  const lang = JSON.parse(readFileSync(new URL('../content/javascript/language.json', import.meta.url), 'utf8'));
  for (const module of lang.modules) for (const lesson of module.lessons) {
    assert.ok(covered.has(`${module.id}/${lesson.id}`), `${lesson.id}: sem conferência`);
  }
});

test('projeto trata vazio, HTML digitado, alternância, remoção e recarga', () => {
  const item = readCases().find((c) => c.file === 'pratica-projeto-final.html');
  assert.ok(item);
  const { dom, errors } = runDom(item);
  let saved;
  try {
    const { document } = dom.window;
    const input = document.querySelector('#tarefa');
    const form = document.querySelector('#formulario');
    const submit = () => form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    input.value = '   '; submit();
    assert.equal(document.querySelectorAll('#lista li').length, 0);
    input.value = '<img src=x onerror=alert(1)>'; submit();
    assert.equal(document.querySelectorAll('#lista img').length, 0);
    assert.match(document.querySelector('#lista').textContent, /<img src=x onerror=alert\(1\)>/);
    document.querySelector('#lista input[type="checkbox"]').click();
    saved = dom.window.localStorage.getItem('trilha-js:tarefas:v1');
    assert.equal(JSON.parse(saved)[0].concluida, true);
    document.querySelector('#lista button').click();
    assert.equal(document.querySelectorAll('#lista li').length, 0);
    assert.deepEqual(JSON.parse(dom.window.localStorage.getItem('trilha-js:tarefas:v1')), []);
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
  const restored = runDom(item, { saved });
  try {
    assert.equal(restored.dom.window.document.querySelectorAll('#lista li').length, 1);
    assert.equal(restored.dom.window.document.querySelector('#lista input').checked, true);
  } finally { restored.dom.window.close(); }
});

test('projeto continua em memória com JSON/formato inválidos ou gravação negada', () => {
  const item = readCases().find((c) => c.file === 'pratica-projeto-final.html');
  assert.ok(item);
  for (const saved of ['{', '{}', '[{"texto":3,"concluida":false}]']) {
    const { dom, errors } = runDom(item, { saved });
    try {
      assert.equal(dom.window.document.querySelectorAll('#lista li').length, 0);
      assert.match(dom.window.document.querySelector('#aviso').textContent, /não|inválid|indisponível/i);
      assert.deepEqual(errors, []);
    } finally { dom.window.close(); }
  }
  const { dom, errors } = runDom(item, { denyStorage: true });
  try {
    dom.window.document.querySelector('#tarefa').value = 'Estudar';
    dom.window.document.querySelector('#formulario').dispatchEvent(new dom.window.Event('submit', { cancelable: true }));
    assert.equal(dom.window.document.querySelectorAll('#lista li').length, 1);
    assert.match(dom.window.document.querySelector('#aviso').textContent, /salvar|armazenamento/i);
    assert.deepEqual(errors, []);
  } finally { dom.window.close(); }
});
