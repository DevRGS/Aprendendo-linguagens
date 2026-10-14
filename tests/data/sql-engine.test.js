import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from '../helpers/dom.js';
import { loadNodeSqlJs } from '../helpers/sql.js';
import { executeSql, loadScript, loadSqlJsFromCdn, createSqlEngine } from '../../js/data/sql-engine.js';
import { SQLJS_URL, SQLJS_WASM_URL } from '../../js/config.js';

setupDom();

const SETUP = "CREATE TABLE t (id INTEGER, nome TEXT); INSERT INTO t VALUES (1, 'Ana'), (2, 'Bia');";

test('executeSql devolve as colunas mesmo quando a consulta não tem linhas', async () => {
  const SQL = await loadNodeSqlJs();
  assert.deepEqual(executeSql(SQL, SETUP, 'SELECT nome FROM t WHERE id > 5'), [{ columns: ['nome'], values: [] }]);
});

test('executeSql devolve só as instruções com colunas, na ordem, e o check por último', async () => {
  const SQL = await loadNodeSqlJs();
  const out = executeSql(SQL, SETUP, "INSERT INTO t VALUES (3, 'Caio'); SELECT count(*) AS n FROM t", 'SELECT max(id) AS m FROM t');
  assert.deepEqual(out, [{ columns: ['n'], values: [[3]] }, { columns: ['m'], values: [[3]] }]);
});

test('executeSql usa um banco novo a cada chamada e lança os erros do SQLite', async () => {
  const SQL = await loadNodeSqlJs();
  executeSql(SQL, SETUP, 'DELETE FROM t');
  assert.deepEqual(executeSql(SQL, SETUP, 'SELECT count(*) FROM t')[0].values, [[2]]);
  assert.throws(() => executeSql(SQL, SETUP, 'SELECT nme FROM t'), /no such column: nme/);
  assert.deepEqual(executeSql(SQL, SETUP, '-- só um comentário'), []);
});

test('createSqlEngine carrega uma vez, tenta de novo depois de falhar e recusa rodar antes de carregar', async () => {
  let calls = 0;
  let fail = true;
  const engine = createSqlEngine({
    load: async () => {
      calls += 1;
      if (fail) throw new Error('rede');
      return loadNodeSqlJs();
    },
  });
  assert.throws(() => engine.run(SETUP, 'SELECT 1'), /ainda não foi carregado/);
  await assert.rejects(engine.ready(), /rede/);
  assert.equal(engine.isReady(), false);
  fail = false;
  await Promise.all([engine.ready(), engine.ready()]);
  await engine.ready();
  assert.equal(calls, 2);
  assert.equal(engine.isReady(), true);
  assert.deepEqual(engine.run(SETUP, 'SELECT nome FROM t ORDER BY id')[0].values, [['Ana'], ['Bia']]);
});

test('loadScript acrescenta o script e resolve no load; no erro, rejeita e remove', async () => {
  const ok = loadScript('https://exemplo.test/a.js');
  const el = document.head.querySelector('script[src="https://exemplo.test/a.js"]');
  assert.equal(el.async, true);
  el.onload();
  await ok;
  const bad = loadScript('https://exemplo.test/b.js');
  document.head.querySelector('script[src="https://exemplo.test/b.js"]').onerror();
  await assert.rejects(bad, /Não foi possível carregar https:\/\/exemplo\.test\/b\.js/);
  assert.equal(document.head.querySelector('script[src="https://exemplo.test/b.js"]'), null);
});

test('loadSqlJsFromCdn injeta o script da versão certa e aponta o .wasm para o jsdelivr', async () => {
  const injected = [];
  const scope = {};
  const inject = async (src) => {
    injected.push(src);
    scope.initSqlJs = async (opts) => ({ wasm: opts.locateFile('sql-wasm.wasm') });
  };
  assert.deepEqual(await loadSqlJsFromCdn({ inject, scope }), { wasm: SQLJS_WASM_URL });
  assert.deepEqual(injected, [SQLJS_URL]);
  await loadSqlJsFromCdn({ inject, scope });
  assert.equal(injected.length, 1);
  await assert.rejects(loadSqlJsFromCdn({ inject: async () => {}, scope: {} }), /não ficou disponível/);
});

test('loadSqlJsFromCdn: se o .wasm falha, a próxima tentativa recarrega o script (o sql.js guarda a promessa rejeitada)', async () => {
  const scope = {};
  let wasmOk = false;
  let injections = 0;
  // Como o sql-wasm.js de verdade: cada execução do script cria um initSqlJs que guarda a primeira promessa.
  const inject = async () => {
    injections += 1;
    let cached;
    scope.initSqlJs = () => {
      cached ??= wasmOk ? Promise.resolve({ ok: true }) : Promise.reject(new Error('wasm falhou'));
      return cached;
    };
  };
  await assert.rejects(loadSqlJsFromCdn({ inject, scope }), /wasm falhou/);
  wasmOk = true;
  assert.deepEqual(await loadSqlJsFromCdn({ inject, scope }), { ok: true });
  assert.equal(injections, 2);
  assert.deepEqual(await loadSqlJsFromCdn({ inject, scope }), { ok: true });
  assert.equal(injections, 2);
});
