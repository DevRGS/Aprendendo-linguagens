# Central de Linguagens — SQL-A (plataforma de exercícios de SQL e módulos 1 e 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pôr o SQL no ar como segunda linguagem da Central, com exercícios em que a pessoa escreve a consulta e o site executa (sql.js no navegador), corrigidos pelo resultado com teste escondido, e com os módulos Introdução e Consultas básicas.

**Architecture:** O motor (`js/data/sql-engine.js`) carrega o sql.js 1.14.2 do jsdelivr sob demanda e roda cada SQL num banco novo. A correção (`js/core/sql-grading.js`) é pura: compara o resultado da pessoa com o da consulta de referência, primeiro nos dados visíveis e depois nos ocultos. Um serviço (`js/ui/sql-service.js`) junta motor, conteúdo e correção para as telas. Um componente (`js/ui/components/sql-exercise.js`) serve aos desafios das aulas e ao tipo de pergunta `sql` no quiz, na prática e na prova. O conteúdo de SQL usa o formato da Fase 1 mais os conjuntos de tabelas (`datasets/`) e os desafios (`challenges.json`). Tudo é conferido no `npm test` com o sql.js do npm, a mesma versão do site.

**Tech Stack:** JavaScript puro (módulos ES, sem build), sql.js 1.14.2 (SQLite 3.49.1 em WebAssembly), Node 22 (`node --test`), jsdom.

**Spec:** `docs/superpowers/specs/2026-10-14-sql-design.md` (a especificação de SQL), sobre a base `docs/superpowers/specs/2026-10-11-central-linguagens-design.md`.

## Global Constraints

- A especificação de SQL manda; o que ela não muda segue a especificação da Fase 1.
- sql.js **1.14.2**, versão exata, no `package.json` (devDependency) e em `js/config.js` (`SQLJS_VERSION`). As URLs são `https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/sql-wasm.js` e `.../sql-wasm.wasm`. Um teste trava as três coisas juntas.
- O Java não muda de comportamento. Os testes existentes só ganham casos novos; nenhuma expectativa antiga muda. Os testes de tela continuam lendo o catálogo e o Java congelados de `tests/fixtures/content/`.
- `core/` não importa `data/` nem `ui/` (seção 3.3 da Fase 1). O serviço que junta motor, conteúdo e correção fica em `ui/`.
- Sem perguntas de SQL, quiz, prática e prova começam **na hora** (sem `await`), como antes. Só esperam o banco quando há pergunta `sql` (`hasSqlQuestions`).
- Conteúdo:
  - em português do Brasil, com linguagem neutra em gênero;
  - palavras-chave SQL em maiúsculas;
  - alertas `> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` e `[!CAUTION]`;
  - nada de `|` dentro de código em células de tabela.
- Todo resultado mostrado numa aula e todo "isto dá erro" tem um trecho em `verify/sql/<modulo>/`, conferido pelo `npm test`.
- Todo exercício de SQL (pergunta `sql` ou desafio):
  - tem pelo menos uma forma recusada;
  - os de ordenação (`ordered: true`) ordenam por uma coluna sem empates nos dados visíveis **e** nos ocultos (nomes, notas e preços são únicos nos dois).
- Arquivos que contêm `\` (código JS com `\``, por exemplo) são gravados com a ferramenta de escrever arquivos ou por script em Node, nunca com heredoc do shell.
- Todo commit termina com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- `npm test` passa ao fim de cada tarefa.

## Review Focus

1. **Empate na ordenação.** Duas consultas equivalentes podem devolver linhas empatadas em ordens diferentes, e aí um exercício com `ordered: true` recusaria uma resposta certa. Os exercícios ordenados usam colunas sem empate nos dois conjuntos de dados; a revisão confere cada `ordered: true` contra `data.sql` e `hidden-data.sql`.
2. **Forma certa recusada.** Os testes garantem as formas de `accepted`, mas uma alternativa natural fora da lista poderia ser recusada pelo teste escondido. Exemplos: `nota > 7.9` no lugar de `nota >= 8`, ou `LIKE` no lugar de `=`. A revisão pensa nas alternativas óbvias de cada exercício.
3. **Correção assíncrona no quiz.** "Responder" dispara uma correção que termina depois. Clicar duas vezes, ou sair da página antes do fim, não pode registrar a resposta duas vezes nem quebrar a tela. O componente trava a caixa no primeiro clique, e o quiz só mostra "Próxima" depois do veredito.
4. **Banco que não carrega.** O jsdelivr pode estar fora do ar ou a pessoa pode estar sem internet. As aulas avisam no lugar do desafio, e prática, quiz e prova tiram as perguntas `sql` com um aviso. O motor tenta de novo na próxima vez, sem guardar a falha.
5. **Teclado e celular.** A caixa de texto não pode prender quem navega pelo teclado: Esc libera o Tab. No celular, as tabelas largas rolam dentro do próprio bloco, sem empurrar a página.

## Como os arquivos aparecem neste plano

Arquivos novos aparecem como uma linha `` `caminho`: `` seguida de um bloco com o conteúdo exato. Arquivos substituídos aparecem como "Substitua o conteúdo de `caminho` por:" seguido do bloco. Acréscimos aparecem como "Acrescente ao fim de `caminho`:". Na execução, os blocos podem ser extraídos mecanicamente: cada bloco vira o arquivo do caminho, com uma quebra de linha final. Blocos de Markdown usam quatro crases, porque contêm blocos de código.

Todo o código e todo o conteúdo deste plano foram rodados antes, numa cópia do repositório: 550 testes passando, incluindo os 30 exercícios de SQL e os 55 trechos de `verify/sql`.

---

### Task 1: Motor de SQL

**Files:**
- Modify: `package.json` e `package-lock.json` (por `npm install`), `js/config.js`
- Create: `js/data/sql-engine.js`, `tests/helpers/sql.js`, `tests/data/sql-engine.test.js`
- Test: `tests/config.test.js` (ganha o teste da versão)

**Interfaces:**
- Produces:
  - `SQLJS_VERSION`, `SQLJS_URL`, `SQLJS_WASM_URL` (`js/config.js`).
  - `executeSql(SQL, setup, sql, check = null)`: devolve `[{ columns, values }]` com toda instrução que tem colunas, mesmo sem linhas; os resultados de `check` vêm por último; lança o erro do SQLite.
  - `loadScript(src, doc)`.
  - `loadSqlJsFromCdn({ inject, scope })`.
  - `createSqlEngine({ load })` → `{ ready(), isReady(), run(setup, sql, check) }`. O `ready()` carrega uma vez e tenta de novo depois de falhar.
  - Para os testes: `loadNodeSqlJs()`, `nodeSqlEngine()` e `nodeRun()` (`tests/helpers/sql.js`).

- [ ] **Step 1: Instalar o sql.js como dependência de teste**

Run: `npm install --save-dev --save-exact sql.js@1.14.2`
Expected: o `package.json` passa a ter `"sql.js": "1.14.2"` em `devDependencies`.

- [ ] **Step 2: Escrever os testes (falhando)**

Substitua o conteúdo de `tests/config.test.js` por:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AVATARS, SQLJS_VERSION, SQLJS_URL, SQLJS_WASM_URL } from '../js/config.js';

test('o sql.js do site é a mesma versão do sql.js dos testes', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.devDependencies['sql.js'], SQLJS_VERSION);
  assert.equal(SQLJS_URL, `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/sql-wasm.js`);
  assert.equal(SQLJS_WASM_URL, `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/sql-wasm.wasm`);
});

// Sequências unidas por U+200D (como 🧑‍💻) aparecem como dois desenhos no Windows 10.
test('todo avatar é um emoji de um código só, e nenhum se repete', () => {
  for (const a of AVATARS) assert.equal([...a].length, 1, `${a} tem ${[...a].length} códigos`);
  assert.equal(new Set(AVATARS).size, AVATARS.length);
});
```

`tests/helpers/sql.js`:
```js
// O sql.js dos testes é o mesmo pacote (e a mesma versão) que o site carrega do jsdelivr.
import { createRequire } from 'node:module';
import { createSqlEngine, executeSql } from '../../js/data/sql-engine.js';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
let loading = null;

export const loadNodeSqlJs = () => {
  loading ??= initSqlJs();
  return loading;
};

export const nodeSqlEngine = () => createSqlEngine({ load: loadNodeSqlJs });

// Função run(setup, sql, check) pronta para a correção, com o sql.js já carregado.
export async function nodeRun() {
  const SQL = await loadNodeSqlJs();
  return (setup, sql, check = null) => executeSql(SQL, setup, sql, check);
}
```

`tests/data/sql-engine.test.js`:
```js
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
```

Run: `node --test tests/config.test.js tests/data/sql-engine.test.js`
Expected: FAIL. O `config.test.js` não acha `SQLJS_VERSION`, e o `sql-engine.test.js` não acha o módulo `js/data/sql-engine.js`.

- [ ] **Step 3: Implementar**

Substitua o conteúdo de `js/config.js` por:
```js
// Constantes da aplicação. O nome do produto vive só aqui.
export const APP_NAME = 'Central de Linguagens';

export const STORAGE_KEY = 'central-linguagens:state';
export const CORRUPT_KEY_PREFIX = 'central-linguagens:corrupt:';
export const PRE_IMPORT_KEY = 'central-linguagens:pre-import';
export const REMINDER_DISMISS_KEY = 'central-linguagens:reminder-dismissed-until';
export const AUTO_BACKUP_PAUSE_KEY = 'central-linguagens:auto-backup-paused';
export const IDB_NAME = 'central-linguagens';
export const IDB_STORE = 'handles';

export const SAVE_DEBOUNCE_MS = 300;
export const AUTO_BACKUP_DEBOUNCE_MS = 5000;
export const AUTO_BACKUP_FILE_NAME = 'central-linguagens-backup.json';
export const REMINDER_SNOOZE_DAYS = 3;

// Um código Unicode por avatar: sequências com U+200D (como 🧑‍💻) viram dois desenhos no Windows 10.
export const AVATARS = ['💻', '🤖', '☕', '🦊', '🐱', '🐼', '🦉', '🐙', '🚀', '⭐', '🌱', '🎧'];
export const GOAL_OPTIONS = [
  { xp: 20, label: 'Leve', hint: '20 XP por dia' },
  { xp: 50, label: 'Normal', hint: '50 XP por dia' },
  { xp: 100, label: 'Intenso', hint: '100 XP por dia' },
];

export const MARKED_URL = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js';
export const HLJS_URL = 'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/es/highlight.min.js';

// SQLite no navegador. A versão precisa ser a mesma do package.json (os testes usam o pacote do npm).
export const SQLJS_VERSION = '1.14.2';
export const SQLJS_URL = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/sql-wasm.js`;
export const SQLJS_WASM_URL = `https://cdn.jsdelivr.net/npm/sql.js@${SQLJS_VERSION}/dist/sql-wasm.wasm`;
```

`js/data/sql-engine.js`:
```js
// Motor de SQL: carrega o sql.js sob demanda (uma vez por página) e executa cada SQL num banco novo.
import { SQLJS_URL, SQLJS_WASM_URL } from '../config.js';

function runStatements(db, sql) {
  const results = [];
  // iterateStatements (e não db.exec): o exec omite as consultas que não devolvem nenhuma linha.
  for (const stmt of db.iterateStatements(sql)) {
    try {
      const columns = stmt.getColumnNames();
      const values = [];
      while (stmt.step()) values.push(stmt.get());
      if (columns.length) results.push({ columns, values });
    } finally {
      stmt.free();
    }
  }
  return results;
}

// Cria um banco com `setup`, roda `sql` e, se houver, `check` no mesmo banco. Devolve toda instrução
// que tem colunas, mesmo sem linhas; os resultados de `check` vêm por último. Erros do SQLite são lançados.
export function executeSql(SQL, setup, sql, check = null) {
  const db = new SQL.Database();
  try {
    db.exec(setup);
    const results = runStatements(db, sql);
    if (check) results.push(...runStatements(db, check));
    return results;
  } finally {
    db.close();
  }
}

export function loadScript(src, doc = document) {
  return new Promise((resolve, reject) => {
    const el = doc.createElement('script');
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => {
      el.remove();
      reject(new Error(`Não foi possível carregar ${src}`));
    };
    doc.head.append(el);
  });
}

// O pacote do sql.js não traz módulo ES: o script define a função global initSqlJs.
export async function loadSqlJsFromCdn({ inject = loadScript, scope = globalThis } = {}) {
  if (typeof scope.initSqlJs !== 'function') await inject(SQLJS_URL);
  if (typeof scope.initSqlJs !== 'function') throw new Error('O sql.js não ficou disponível.');
  return scope.initSqlJs({ locateFile: () => SQLJS_WASM_URL });
}

export function createSqlEngine({ load = () => loadSqlJsFromCdn() } = {}) {
  let SQL = null;
  let pending = null;
  return {
    // Carrega uma vez; se falhar, a próxima chamada tenta de novo.
    ready() {
      if (SQL) return Promise.resolve();
      pending ??= Promise.resolve()
        .then(load)
        .then((mod) => { SQL = mod; }, (err) => {
          pending = null;
          throw err;
        });
      return pending;
    },
    isReady: () => SQL !== null,
    run(setup, sql, check = null) {
      if (!SQL) throw new Error('O motor de SQL ainda não foi carregado.');
      return executeSql(SQL, setup, sql, check);
    },
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `node --test tests/config.test.js tests/data/sql-engine.test.js`
Expected: PASS (8 testes).

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json js/config.js js/data/sql-engine.js tests/helpers/sql.js tests/data/sql-engine.test.js tests/config.test.js
git commit -m "Motor de SQL: sql.js 1.14.2 sob demanda, um banco novo por execução" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Correção pelo resultado

**Files:**
- Create: `js/core/sql-grading.js`
- Test: `tests/core/sql-grading.test.js`

**Interfaces:**
- Consumes: `nodeRun()` (Task 1), só nos testes.
- Produces:
  - `sameValue(a, b)`, `compareResults(expected, actual, { ordered, columnNames })` → `null` ou `{ reason, ... }`, `runQuery(run, setup, sql, check)` → `{ result }` ou `{ error }`, `sqlErrorHint(message)`, `verdictMessage(reason, detail)`.
  - `gradeSql(exercise, sql, { run, dataset })` → `{ ok, reason, message, actual, expected, error, hint }`.
  - Os motivos são `ok`, `erro`, `sem-resultado`, `colunas`, `nomes`, `linhas`, `conteudo`, `ordem` e `coincidencia`. O `dataset` é `{ schema, data, hidden }`.

- [ ] **Step 1: Escrever o teste (falhando)**

`tests/core/sql-grading.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nodeRun } from '../helpers/sql.js';
import {
  sameValue, compareResults, runQuery, sqlErrorHint, verdictMessage, gradeSql,
} from '../../js/core/sql-grading.js';

const dataset = {
  schema: 'CREATE TABLE alunos (id INTEGER PRIMARY KEY, nome TEXT, nota REAL, cidade TEXT);',
  data: "INSERT INTO alunos VALUES (1, 'Ana', 9.5, 'Recife'), (2, 'Bia', 7, 'Natal'), (3, 'Caio', 8.5, 'Recife'), (4, 'Davi', 6, NULL);",
  hidden: "INSERT INTO alunos VALUES (1, 'Eva', 5, 'Natal'), (2, 'Fábio', 9, 'Recife'), (3, 'Gil', 8.5, NULL), (4, 'Hana', 10, 'Natal');",
};
const notaAlta = { id: 'teste.q01', answer: 'SELECT nome FROM alunos WHERE nota > 8;' };
const r = (columns, values) => ({ columns, values });

test('sameValue: números pelo valor, com folga mínima; texto, NULL e tipos exatos', () => {
  assert.equal(sameValue(5, 5.0), true);
  assert.equal(sameValue(0.1 + 0.2, 0.3), true);
  assert.equal(sameValue(1e12, 1e12 + 1), true);
  assert.equal(sameValue(1e12, 1e12 + 1e4), false);
  assert.equal(sameValue(8.5, 8.49), false);
  assert.equal(sameValue(7, '7'), false);
  assert.equal(sameValue(null, null), true);
  assert.equal(sameValue(null, 0), false);
  assert.equal(sameValue('a', 'A'), false);
});

test('compareResults aponta colunas, nomes, linhas, conteúdo e ordem, nessa prioridade', () => {
  const exp = r(['nome', 'nota'], [['Ana', 9.5], ['Caio', 8.5]]);
  assert.deepEqual(compareResults(exp, r(['nome'], [['Ana']])), { reason: 'colunas', expectedCount: 2, actualCount: 1 });
  assert.equal(compareResults(exp, r(['n', 'x'], [['Caio', 8.5], ['Ana', 9.5]])), null);
  assert.deepEqual(compareResults(exp, r(['n', 'x'], [['Ana', 9.5], ['Caio', 8.5]]), { columnNames: true }),
    { reason: 'nomes', expectedNames: ['nome', 'nota'] });
  assert.equal(compareResults(exp, r([' NOME ', 'Nota'], [['Ana', 9.5], ['Caio', 8.5]]), { columnNames: true }), null);
  assert.deepEqual(compareResults(exp, r(['nome', 'nota'], [['Ana', 9.5]])), { reason: 'linhas', expectedCount: 2, actualCount: 1 });
  assert.deepEqual(compareResults(exp, r(['nome', 'nota'], [['Ana', 9.5], ['Caio', 8]])), { reason: 'conteudo' });
  assert.deepEqual(compareResults(exp, r(['nome', 'nota'], [['Caio', 8.5], ['Ana', 9.5]]), { ordered: true }), { reason: 'ordem' });
  assert.equal(compareResults(exp, r(['nome', 'nota'], [['Ana', 9.5], ['Caio', 8.5]]), { ordered: true }), null);
});

test('compareResults conta repetições e não confunde número com texto', () => {
  assert.deepEqual(compareResults(r(['x'], [[1], [1], [2]]), r(['x'], [[1], [2], [2]])), { reason: 'conteudo' });
  assert.deepEqual(compareResults(r(['x'], [[7]]), r(['x'], [['7']])), { reason: 'conteudo' });
  assert.equal(compareResults(r(['x'], [[null], [5]]), r(['x'], [[5.0], [null]])), null);
});

test('runQuery pega o resultado da última instrução com colunas, ou null, ou o erro', async () => {
  const run = await nodeRun();
  const setup = `${dataset.schema}\n${dataset.data}`;
  assert.deepEqual(runQuery(run, setup, 'SELECT 1 AS a; SELECT 2 AS b').result, r(['b'], [[2]]));
  assert.deepEqual(runQuery(run, setup, "UPDATE alunos SET nota = 0 WHERE id = 1"), { result: null });
  assert.deepEqual(runQuery(run, setup, 'SELEC 1'), { error: 'near "SELEC": syntax error' });
});

test('sqlErrorHint traduz os erros comuns e devolve null para os outros', () => {
  assert.match(sqlErrorHint('no such table: aluno'), /A tabela aluno não existe/);
  assert.match(sqlErrorHint('no such column: nme'), /A coluna nme não existe/);
  assert.match(sqlErrorHint('near "FORM": syntax error'), /Erro de sintaxe perto de FORM/);
  assert.match(sqlErrorHint('incomplete input'), /terminou antes da hora/);
  assert.match(sqlErrorHint('ambiguous column name: id'), /Diga de qual: tabela\.id/);
  assert.equal(sqlErrorHint('UNIQUE constraint failed: alunos.id'), null);
});

test('verdictMessage concorda número e plural', () => {
  assert.equal(verdictMessage('colunas', { actualCount: 3, expectedCount: 1 }), 'Sua consulta devolveu 3 colunas; o esperado é 1 coluna.');
  assert.equal(verdictMessage('linhas', { actualCount: 1, expectedCount: 0 }), 'Sua consulta devolveu 1 linha; o esperado são 0 linhas.');
  assert.equal(verdictMessage('nomes', { expectedNames: ['nome', 'media'] }), 'As colunas devem se chamar: nome, media.');
});

test('gradeSql aceita outro caminho para o mesmo resultado, nos dados visíveis e nos ocultos', async () => {
  const run = await nodeRun();
  const v = gradeSql(notaAlta, 'select NOME from alunos where 8 < nota', { run, dataset });
  assert.equal(v.ok, true);
  assert.equal(v.message, 'Resultado certo!');
  assert.deepEqual(v.expected, r(['nome'], [['Ana'], ['Caio']]));
});

test('gradeSql recusa quem acerta por coincidência só nos dados visíveis', async () => {
  const run = await nodeRun();
  const v = gradeSql(notaAlta, 'SELECT nome FROM alunos WHERE id IN (1, 3)', { run, dataset });
  assert.equal(v.ok, false);
  assert.equal(v.reason, 'coincidencia');
  assert.match(v.message, /não funcionaria com outros dados/);
  assert.deepEqual(v.actual, v.expected);
});

test('gradeSql explica erro, falta de tabela e diferença de colunas', async () => {
  const run = await nodeRun();
  const erro = gradeSql(notaAlta, 'SELECT nme FROM alunos', { run, dataset });
  assert.deepEqual([erro.ok, erro.reason, erro.error], [false, 'erro', 'no such column: nme']);
  assert.match(erro.hint, /A coluna nme não existe/);
  assert.equal(erro.actual, null);
  const semTabela = gradeSql(notaAlta, "UPDATE alunos SET nota = 10", { run, dataset });
  assert.equal(semTabela.reason, 'sem-resultado');
  const colunas = gradeSql(notaAlta, 'SELECT nome, nota FROM alunos WHERE nota > 8', { run, dataset });
  assert.equal(colunas.reason, 'colunas');
  assert.equal(colunas.message, 'Sua consulta devolveu 2 colunas; o esperado é 1 coluna.');
});

test('gradeSql com check compara o estado da tabela depois da alteração', async () => {
  const run = await nodeRun();
  const insere = {
    id: 'teste.q02',
    answer: "INSERT INTO alunos (id, nome, nota, cidade) VALUES (5, 'Íris', 8, 'Natal');",
    check: 'SELECT id, nome, nota, cidade FROM alunos ORDER BY id',
  };
  assert.equal(gradeSql(insere, "INSERT INTO alunos VALUES (5, 'Íris', 8, 'Natal')", { run, dataset }).ok, true);
  assert.equal(gradeSql(insere, "INSERT INTO alunos VALUES (5, 'Iris', 8, 'Natal')", { run, dataset }).reason, 'conteudo');
});

test('gradeSql avisa quando a própria resposta de referência falha', async () => {
  const run = await nodeRun();
  assert.throws(() => gradeSql({ id: 'teste.q03', answer: 'SELECT x FROM nada' }, 'SELECT 1', { run, dataset }),
    /A resposta de referência de teste\.q03 falhou: no such table: nada/);
});
```

Run: `node --test tests/core/sql-grading.test.js`
Expected: FAIL, porque o módulo `js/core/sql-grading.js` não existe.

- [ ] **Step 2: Implementar**

`js/core/sql-grading.js`:
```js
// Correção de exercícios de SQL pelo resultado (especificação de SQL, seção 6). Não conhece o sql.js:
// recebe run(setup, sql, check), que devolve [{ columns, values }] ou lança o erro do SQLite.

export const NUMBER_TOLERANCE = 1e-9;

export function sameValue(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) <= NUMBER_TOLERANCE * Math.max(1, Math.abs(a), Math.abs(b));
  }
  return a === b;
}

const cellKey = (v) => {
  if (v === null) return ['z'];
  if (typeof v === 'number') return ['n', Number(v.toPrecision(12))];
  return ['s', String(v)];
};
const rowKey = (row) => JSON.stringify(row.map(cellKey));
const sortRows = (rows) => [...rows].sort((a, b) => (rowKey(a) < rowKey(b) ? -1 : rowKey(a) > rowKey(b) ? 1 : 0));
const sameRows = (xs, ys) => xs.every((row, i) => row.every((v, j) => sameValue(v, ys[i][j])));
const sameName = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

// Devolve null se os resultados batem, ou { reason, ... } com o primeiro motivo da diferença.
export function compareResults(expected, actual, { ordered = false, columnNames = false } = {}) {
  if (actual.columns.length !== expected.columns.length) {
    return { reason: 'colunas', expectedCount: expected.columns.length, actualCount: actual.columns.length };
  }
  if (columnNames && !expected.columns.every((c, i) => sameName(c, actual.columns[i]))) {
    return { reason: 'nomes', expectedNames: expected.columns };
  }
  if (actual.values.length !== expected.values.length) {
    return { reason: 'linhas', expectedCount: expected.values.length, actualCount: actual.values.length };
  }
  const asMultiset = sameRows(sortRows(actual.values), sortRows(expected.values));
  if (!ordered) return asMultiset ? null : { reason: 'conteudo' };
  if (sameRows(actual.values, expected.values)) return null;
  return asMultiset ? { reason: 'ordem' } : { reason: 'conteudo' };
}

// Roda e devolve { result } (o da última instrução com colunas, ou null se nenhuma tem) ou { error }.
export function runQuery(run, setup, sql, check = null) {
  try {
    const results = run(setup, sql, check);
    return { result: results.length ? results[results.length - 1] : null };
  } catch (err) {
    return { error: String(err?.message ?? err) };
  }
}

const HINTS = [
  [/^no such table: (.+)$/, (m) => `A tabela ${m[1]} não existe. Confira o nome em "Tabelas deste exercício".`],
  [/^no such column: (.+)$/, (m) => `A coluna ${m[1]} não existe nessas tabelas. Confira o nome e de qual tabela ela é.`],
  [/^near "(.+)": syntax error$/, (m) => `Erro de sintaxe perto de ${m[1]}. Confira vírgulas, aspas e a ordem das cláusulas.`],
  [/^incomplete input$/, () => 'A consulta terminou antes da hora. Falta fechar parênteses ou aspas?'],
  [/^ambiguous column name: (.+)$/, (m) => `A coluna ${m[1]} existe em mais de uma tabela. Diga de qual: tabela.${m[1]}.`],
];

export function sqlErrorHint(message) {
  for (const [re, hint] of HINTS) {
    const m = re.exec(String(message ?? ''));
    if (m) return hint(m);
  }
  return null;
}

const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const expectedIs = (n, one, many) => `o esperado ${n === 1 ? 'é' : 'são'} ${count(n, one, many)}`;

export function verdictMessage(reason, detail = {}) {
  switch (reason) {
    case 'ok': return 'Resultado certo!';
    case 'erro': return 'A consulta deu erro.';
    case 'sem-resultado': return 'Sua consulta não devolveu uma tabela. Termine com um SELECT.';
    case 'colunas':
      return `Sua consulta devolveu ${count(detail.actualCount, 'coluna', 'colunas')}; ${expectedIs(detail.expectedCount, 'coluna', 'colunas')}.`;
    case 'nomes': return `As colunas devem se chamar: ${detail.expectedNames.join(', ')}.`;
    case 'linhas':
      return `Sua consulta devolveu ${count(detail.actualCount, 'linha', 'linhas')}; ${expectedIs(detail.expectedCount, 'linha', 'linhas')}.`;
    case 'conteudo': return 'Algumas linhas não são as esperadas.';
    case 'ordem': return 'As linhas estão certas, mas a ordem não: o enunciado pede ordenação.';
    case 'coincidencia':
      return 'Seu resultado bate nestas tabelas, mas a consulta não funcionaria com outros dados. Confira o filtro.';
    default: return '';
  }
}

// Corrige `sql` contra a resposta de referência do exercício: primeiro nos dados visíveis, depois nos ocultos.
// dataset = { schema, data, hidden } (textos SQL). actual e expected são sempre os do banco visível.
export function gradeSql(exercise, sql, { run, dataset }) {
  const check = exercise.check ?? null;
  const banks = [`${dataset.schema}\n${dataset.data}`, `${dataset.schema}\n${dataset.hidden}`];
  let shown = null;
  for (let i = 0; i < banks.length; i++) {
    const ref = runQuery(run, banks[i], exercise.answer, check);
    if (ref.error) throw new Error(`A resposta de referência de ${exercise.id} falhou: ${ref.error}`);
    const mine = runQuery(run, banks[i], sql, check);
    const hidden = i === 1;
    if (!hidden) shown = { actual: mine.result ?? null, expected: ref.result };
    let reason = null;
    let detail = {};
    if (mine.error) reason = 'erro';
    else if (!mine.result) reason = 'sem-resultado';
    else {
      const diff = compareResults(ref.result, mine.result, exercise);
      if (diff) ({ reason, ...detail } = diff);
    }
    if (reason) {
      if (hidden) reason = 'coincidencia';
      const error = hidden ? null : mine.error ?? null;
      return {
        ok: false, reason, message: verdictMessage(reason, detail), ...shown,
        error, hint: error ? sqlErrorHint(error) : null,
      };
    }
  }
  return { ok: true, reason: 'ok', message: verdictMessage('ok'), ...shown, error: null, hint: null };
}
```

- [ ] **Step 3: Rodar e ver passar**

Run: `node --test tests/core/sql-grading.test.js`
Expected: PASS (11 testes).

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add js/core/sql-grading.js tests/core/sql-grading.test.js
git commit -m "Correção de SQL pelo resultado, com teste escondido" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Conteúdo de SQL nos testes e no carregador

Quando o SQL entrar no `content/catalog.json` real (Task 8), os testes de tela do Java veriam uma linguagem a mais e quebrariam (contagens como "20 perguntas disponíveis"). Por isso o catálogo dos testes também fica congelado, e as telas de SQL ganham um mini-curso próprio, que não muda quando o curso cresce.

**Files:**
- Create:
  - `tests/fixtures/content/catalog.json` (cópia do catálogo de agora, só Java);
  - o mini-curso `tests/fixtures/sql-ui/content/` (catálogo, `language.json`, duas aulas, perguntas, cartas, desafios e o conjunto `pessoas`);
  - `tests/data/sql-content-loader.test.js`.
- Modify: `tests/helpers/fetch-from-disk.js`, `js/data/content.js`
- Test: `tests/data/fetch-from-disk.test.js` (ganha dois testes)

**Interfaces:**
- Consumes: `installFetchFromDisk` (Fase 1B).
- Produces:
  - `installFetchFromDisk({ overlay })`: com `overlay: '<nome>'`, lê primeiro de `tests/fixtures/<nome>/`.
  - `loadChallenges(language, module)`: devolve `[]` sem `engine`; com `engine`, devolve os desafios marcados com `lang` e `module`.
  - `loadDataset(language, id)` → `{ schema, data, hidden }`.

- [ ] **Step 1: Escrever os testes (falhando)**

Acrescente ao fim de `tests/data/fetch-from-disk.test.js`:

```js
test('por padrão, o catálogo também vem congelado (só Java)', async () => {
  installFetchFromDisk();
  const served = await (await fetch('content/catalog.json')).json();
  assert.deepEqual(served.languages.map((l) => l.id), ['java']);
});

test("overlay: 'sql-ui' usa o mini-curso de SQL das telas e cai no conteúdo real para o resto", async () => {
  installFetchFromDisk({ overlay: 'sql-ui' });
  const catalog = await (await fetch('content/catalog.json')).json();
  assert.deepEqual(catalog.languages.map((l) => l.id), ['sql']);
  const text = await (await fetch('content/achievements.json')).text();
  assert.equal(text, fromRoot('content/achievements.json'));
});
```

`tests/data/sql-content-loader.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import { loadLanguages, loadChallenges, loadDataset } from '../../js/data/content.js';

installFetchFromDisk({ overlay: 'sql-ui' });

test('loadChallenges marca linguagem e módulo; sem engine, não há desafios', async () => {
  const [sql] = await loadLanguages();
  const challenges = await loadChallenges(sql, sql.modules[0]);
  assert.deepEqual(challenges.map((c) => [c.id, c.lesson, c.lang, c.module]), [
    ['sql.teste.d01', 'selecionar', 'sql', 'sql.teste'],
    ['sql.teste.d02', 'filtrar', 'sql', 'sql.teste'],
  ]);
  assert.deepEqual(await loadChallenges({ ...sql, engine: undefined }, sql.modules[0]), []);
});

test('loadDataset traz o esquema, os dados visíveis e os ocultos', async () => {
  const [sql] = await loadLanguages();
  const ds = await loadDataset(sql, 'pessoas');
  assert.match(ds.schema, /^CREATE TABLE pessoas/);
  assert.match(ds.data, /'Ana', 34/);
  assert.match(ds.hidden, /'Elisa', 25/);
  await assert.rejects(loadDataset(sql, 'nao-existe'), /HTTP 404/);
});
```

Run: `node --test tests/data/fetch-from-disk.test.js tests/data/sql-content-loader.test.js`
Expected: FAIL. O `overlay: 'sql-ui'` ainda não existe, e `loadChallenges` e `loadDataset` não são exportados. (O teste do catálogo congelado já passa, porque o catálogo real ainda é só Java; ele trava o congelamento para a Task 8.)

- [ ] **Step 2: Congelar o catálogo e criar o mini-curso de SQL**

Run: `node -e "require('fs').copyFileSync('content/catalog.json','tests/fixtures/content/catalog.json')"`

`tests/fixtures/sql-ui/content/catalog.json`:
```json
{ "languages": [ { "id": "sql", "dir": "sql" } ] }
```

`tests/fixtures/sql-ui/content/sql/01-teste/01-selecionar.md`:
````markdown
# Selecionando

Use `SELECT` para ler dados.
````

`tests/fixtures/sql-ui/content/sql/01-teste/02-filtrar.md`:
````markdown
# Filtrando

Use `WHERE` para filtrar linhas.
````

`tests/fixtures/sql-ui/content/sql/01-teste/challenges.json`:
```json
{
  "challenges": [
    {
      "id": "sql.teste.d01", "lesson": "selecionar",
      "dataset": "pessoas",
      "prompt": "Mostre todas as colunas da tabela `pessoas`.",
      "answer": "SELECT * FROM pessoas;",
      "rejected": ["SELECT nome FROM pessoas;"],
      "explanation": "O `*` traz todas as colunas."
    },
    {
      "id": "sql.teste.d02", "lesson": "filtrar",
      "dataset": "pessoas",
      "prompt": "Liste o nome das pessoas com mais de 30 anos.",
      "answer": "SELECT nome FROM pessoas WHERE idade > 30;",
      "rejected": ["SELECT nome FROM pessoas WHERE id IN (1, 3);"],
      "explanation": "`WHERE idade > 30` fica só com quem passou dos 30."
    }
  ]
}
```

`tests/fixtures/sql-ui/content/sql/01-teste/flashcards.json`:
```json
{ "cards": [ { "id": "sql.teste.f01", "lesson": "selecionar", "front": "O que faz o SELECT?", "back": "Lê dados de uma tabela." } ] }
```

`tests/fixtures/sql-ui/content/sql/01-teste/questions.json`:
```json
{
  "questions": [
    {
      "id": "sql.teste.q01", "type": "sql", "difficulty": 1, "lesson": "filtrar",
      "dataset": "pessoas",
      "prompt": "Liste o nome das pessoas com mais de 30 anos.",
      "answer": "SELECT nome FROM pessoas WHERE idade > 30;",
      "rejected": ["SELECT nome FROM pessoas WHERE id IN (1, 3);"],
      "explanation": "`WHERE idade > 30` fica só com quem passou dos 30."
    },
    {
      "id": "sql.teste.q02", "type": "sql", "difficulty": 2, "lesson": "selecionar",
      "dataset": "pessoas",
      "prompt": "Liste os nomes em ordem alfabética.",
      "answer": "SELECT nome FROM pessoas ORDER BY nome;",
      "ordered": true,
      "rejected": ["SELECT nome FROM pessoas;"],
      "explanation": "`ORDER BY nome` ordena pelo nome."
    },
    {
      "id": "sql.teste.q03", "type": "multiple", "difficulty": 1, "lesson": "selecionar",
      "prompt": "Qual comando lê dados de uma tabela?",
      "options": ["`SELECT`", "`INSERT`", "`DELETE`"], "answer": 0,
      "explanation": "`SELECT` lê; os outros alteram."
    }
  ]
}
```

`tests/fixtures/sql-ui/content/sql/datasets/pessoas/data.sql`:
```sql
INSERT INTO pessoas VALUES (1, 'Ana', 34), (2, 'Bruno', 28), (3, 'Carla', 41), (4, 'Davi', 19);
```

`tests/fixtures/sql-ui/content/sql/datasets/pessoas/hidden-data.sql`:
```sql
INSERT INTO pessoas VALUES (1, 'Elisa', 25), (2, 'Fábio', 52), (3, 'Gabi', 30), (4, 'Hugo', 33);
```

`tests/fixtures/sql-ui/content/sql/datasets/pessoas/schema.sql`:
```sql
CREATE TABLE pessoas (id INTEGER PRIMARY KEY, nome TEXT NOT NULL, idade INTEGER);
```

`tests/fixtures/sql-ui/content/sql/language.json`:
```json
{
  "id": "sql",
  "name": "SQL",
  "color": "#336791",
  "icon": "🗄️",
  "highlight": "sql",
  "reference": "referencia.md",
  "engine": "sqlite",
  "modules": [
    {
      "id": "teste",
      "dir": "01-teste",
      "title": "Teste",
      "description": "Mini-curso congelado para os testes de tela.",
      "lessons": [
        { "id": "selecionar", "file": "01-selecionar.md", "title": "Selecionando", "minutes": 5 },
        { "id": "filtrar", "file": "02-filtrar.md", "title": "Filtrando", "minutes": 5 }
      ]
    }
  ]
}
```

`tests/fixtures/sql-ui/content/sql/referencia.md`:
````markdown
# Referência de teste

Só para os testes de tela.
````

- [ ] **Step 3: Ensinar o carregador a usar outro conjunto e ler desafios e bancos**

Substitua o conteúdo de `tests/helpers/fetch-from-disk.js` por:
```js
// Substitui fetch() nos testes: 'content/...' é lido do disco, a partir da raiz do projeto.
// Com overlay (o padrão), um arquivo que existe em tests/fixtures/ tem prioridade. Assim o catálogo e o
// manifesto de Java ficam congelados (só Java › Fundamentos), e os testes de tela não quebram quando o curso cresce.
// overlay: '<nome>' usa outro conjunto, tests/fixtures/<nome>/ (por exemplo, o mini-curso de SQL das telas).
import { readFile } from 'node:fs/promises';

const ROOT = new URL('../../', import.meta.url);
const FIXTURES = new URL('../fixtures/', import.meta.url);

async function readFirst(urls) {
  for (const url of urls) {
    try {
      return await readFile(url);
    } catch {
      // não existe aqui: tenta o próximo
    }
  }
  return null;
}

export function installFetchFromDisk({ fail = () => false, overlay = true } = {}) {
  const calls = [];
  const fixtures = typeof overlay === 'string' ? new URL(`${overlay}/`, FIXTURES) : FIXTURES;
  globalThis.fetch = async (path, init) => {
    calls.push({ path: String(path), init });
    if (fail(String(path))) return new Response('erro simulado', { status: 500 });
    const real = new URL(String(path), ROOT);
    const body = await readFirst(overlay ? [new URL(String(path), fixtures), real] : [real]);
    return body === null ? new Response('não encontrado', { status: 404 }) : new Response(body, { status: 200 });
  };
  return calls;
}
```

Substitua o conteúdo de `js/data/content.js` por:
```js
// Carrega o conteúdo sob demanda e guarda em memória. "no-cache" revalida no servidor a cada visita.
const cache = new Map();

function get(path, as) {
  const key = `${as}:${path}`;
  if (!cache.has(key)) {
    const promise = fetch(path, { cache: 'no-cache' }).then((res) => {
      if (!res.ok) throw new Error(`Não foi possível carregar ${path} (HTTP ${res.status})`);
      return as === 'json' ? res.json() : res.text();
    });
    cache.set(key, promise);
    promise.catch(() => cache.delete(key));
  }
  return cache.get(key);
}

export async function loadLanguages() {
  const catalog = await get('content/catalog.json', 'json');
  return Promise.all(catalog.languages.map(async ({ id, dir }) => {
    const lang = await get(`content/${dir}/language.json`, 'json');
    return { ...lang, id, dir, modules: lang.modules.map((m) => ({ ...m, key: `${id}.${m.id}` })) };
  }));
}

export async function loadModuleBank(language, module) {
  const base = `content/${language.dir}/${module.dir}`;
  const [q, c] = await Promise.all([get(`${base}/questions.json`, 'json'), get(`${base}/flashcards.json`, 'json')]);
  const tag = (item) => ({ ...item, lang: language.id, module: module.key });
  return { questions: q.questions.map(tag), cards: c.cards.map(tag) };
}

export async function loadBanks(languages, moduleKeys = null) {
  const wanted = moduleKeys ? new Set(moduleKeys) : null;
  const jobs = [];
  for (const language of languages) {
    for (const module of language.modules) {
      if (!wanted || wanted.has(module.key)) jobs.push(loadModuleBank(language, module));
    }
  }
  const banks = await Promise.all(jobs);
  return { questions: banks.flatMap((b) => b.questions), cards: banks.flatMap((b) => b.cards) };
}

export const loadLesson = (language, module, lesson) => get(`content/${language.dir}/${module.dir}/${lesson.file}`, 'text');
export const loadReference = (language) => get(`content/${language.dir}/${language.reference}`, 'text');
export const loadAchievementTexts = () => get('content/achievements.json', 'json');

// Desafios "Experimente" do fim das aulas. Só existem em linguagens com banco (engine).
export async function loadChallenges(language, module) {
  if (!language.engine) return [];
  const data = await get(`content/${language.dir}/${module.dir}/challenges.json`, 'json');
  return data.challenges.map((item) => ({ ...item, lang: language.id, module: module.key }));
}

// Um conjunto de tabelas: o esquema, os dados visíveis e os ocultos (textos SQL).
export async function loadDataset(language, id) {
  const base = `content/${language.dir}/datasets/${id}`;
  const [schema, data, hidden] = await Promise.all(
    ['schema.sql', 'data.sql', 'hidden-data.sql'].map((file) => get(`${base}/${file}`, 'text')),
  );
  return { schema, data, hidden };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `node --test tests/data/fetch-from-disk.test.js tests/data/sql-content-loader.test.js`
Expected: PASS.

Run: `npm test`
Expected: PASS (com o catálogo congelado igual ao real, nada muda para os outros testes).

- [ ] **Step 5: Commit**

```bash
git add tests/fixtures tests/helpers/fetch-from-disk.js tests/data/fetch-from-disk.test.js tests/data/sql-content-loader.test.js js/data/content.js
git commit -m "Desafios e conjuntos de tabelas no carregador; catálogo e mini-curso de SQL congelados para os testes" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Serviço de SQL no app

**Files:**
- Create: `js/ui/sql-service.js`
- Modify: `js/app.js`, `tests/helpers/app.js`
- Test: `tests/ui/sql-service.test.js`

**Interfaces:**
- Consumes: `createSqlEngine` (Task 1), `gradeSql`, `runQuery` e `sqlErrorHint` (Task 2), `loadDataset` (Task 3).
- Produces:
  - `createSqlService({ engine, getLanguage })` → `{ ready, preload(ex), tables(ex), expected(ex), execute(ex, sql), grade(ex, sql) }`.
  - `hasSqlQuestions(questions)`.
  - `usableQuestions(app, questions)`: devolve as perguntas que dá para usar, e sem o motor tira as `sql` com um aviso.
  - `createApp({ ..., sqlEngine = createSqlEngine() })` põe o serviço em `app.sql`.
  - `makeTestApp({ fixture = true, sqlEngine = nodeSqlEngine() })`.

- [ ] **Step 1: Escrever o teste (falhando)**

`tests/ui/sql-service.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from '../helpers/dom.js';
import { makeTestApp, profileState, texts } from '../helpers/app.js';
import { loadBanks, loadChallenges } from '../../js/data/content.js';
import { createSqlEngine } from '../../js/data/sql-engine.js';
import { usableQuestions, createSqlService, hasSqlQuestions } from '../../js/ui/sql-service.js';

setupDom();

async function setup(options = {}) {
  const app = await makeTestApp({ state: profileState(), fixture: 'sql-ui', ...options });
  const [sql] = app.languages;
  const bank = await loadBanks(app.languages);
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const challenges = await loadChallenges(sql, sql.modules[0]);
  return { app, byId, challenges };
}

const failingEngine = () => createSqlEngine({ load: async () => { throw new Error('rede'); } });

test('tables mostra as tabelas do banco visível, sem os dados ocultos', async () => {
  const { app, challenges } = await setup();
  const tables = await app.sql.tables(challenges[0]);
  assert.deepEqual(tables.map((t) => t.name), ['pessoas']);
  assert.deepEqual(tables[0].result.columns, ['id', 'nome', 'idade']);
  assert.deepEqual(tables[0].result.values.map((row) => row[1]), ['Ana', 'Bruno', 'Carla', 'Davi']);
});

test('expected roda a resposta de referência nos dados visíveis', async () => {
  const { app, challenges } = await setup();
  assert.deepEqual(await app.sql.expected(challenges[1]), { columns: ['nome'], values: [['Ana'], ['Carla']] });
});

test('execute só executa: devolve o resultado ou o erro com a dica', async () => {
  const { app, byId } = await setup();
  const q = byId.get('sql.teste.q01');
  assert.deepEqual(await app.sql.execute(q, 'SELECT nome FROM pessoas WHERE idade < 20'), { result: { columns: ['nome'], values: [['Davi']] } });
  const erro = await app.sql.execute(q, 'SELECT nme FROM pessoas');
  assert.equal(erro.error, 'no such column: nme');
  assert.match(erro.hint, /A coluna nme não existe/);
});

test('grade corrige com o teste escondido', async () => {
  const { app, byId } = await setup();
  const q = byId.get('sql.teste.q01');
  assert.equal((await app.sql.grade(q, 'SELECT nome FROM pessoas WHERE 30 < idade')).ok, true);
  assert.equal((await app.sql.grade(q, 'SELECT nome FROM pessoas WHERE id IN (1, 3)')).reason, 'coincidencia');
});

test('usableQuestions mantém as perguntas sql quando o motor carrega', async () => {
  const { app, byId } = await setup();
  const questions = [...byId.values()];
  assert.equal((await usableQuestions(app, questions)).length, 3);
});

test('usableQuestions tira as perguntas sql e avisa quando o motor não carrega', async () => {
  const { app, byId } = await setup({ sqlEngine: failingEngine() });
  const kept = await usableQuestions(app, [...byId.values()]);
  assert.deepEqual(kept.map((q) => q.id), ['sql.teste.q03']);
  assert.ok(texts(document, '#toasts .toast').some((t) => /As perguntas de escrever SQL ficaram de fora/.test(t)));
});

test('usableQuestions nem tenta carregar o motor quando não há perguntas sql', async () => {
  let loads = 0;
  const engine = createSqlEngine({ load: async () => { loads += 1; throw new Error('rede'); } });
  const service = createSqlService({ engine, getLanguage: () => null });
  const app = { sql: service, layout: { toast() { throw new Error('não devia avisar'); } } };
  const only = [{ id: 'x.q01', type: 'multiple' }];
  assert.equal(await usableQuestions(app, only), only);
  assert.equal(loads, 0);
});

test('hasSqlQuestions diz se há alguma pergunta sql na lista', () => {
  assert.equal(hasSqlQuestions([{ type: 'multiple' }, { type: 'sql' }]), true);
  assert.equal(hasSqlQuestions([{ type: 'fill' }]), false);
  assert.equal(hasSqlQuestions([]), false);
});
```

Run: `node --test tests/ui/sql-service.test.js`
Expected: FAIL, porque o módulo `js/ui/sql-service.js` não existe.

- [ ] **Step 2: Implementar e ligar no app**

`js/ui/sql-service.js`:
```js
// Junta o motor (data/sql-engine), os conjuntos de tabelas (data/content) e a correção (core/sql-grading)
// para as telas: executar, mostrar tabelas, calcular o esperado e corrigir.
import { loadDataset } from '../data/content.js';
import { gradeSql, runQuery, sqlErrorHint } from '../core/sql-grading.js';

const TABLES_SQL = "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name";
const quoteName = (name) => `"${String(name).replaceAll('"', '""')}"`;
const visibleSetup = (ds) => `${ds.schema}\n${ds.data}`;

export function createSqlService({ engine, getLanguage }) {
  const dataset = (ex) => loadDataset(getLanguage(ex.lang), ex.dataset);
  const run = (setup, sql, check) => engine.run(setup, sql, check);
  async function prepared(ex) {
    const [, ds] = await Promise.all([engine.ready(), dataset(ex)]);
    return ds;
  }
  return {
    ready: () => engine.ready(),
    preload: prepared,
    // As tabelas do banco visível, com todas as linhas.
    async tables(ex) {
      const setup = visibleSetup(await prepared(ex));
      const names = engine.run(setup, TABLES_SQL)[0].values.map(([name]) => name);
      return names.map((name) => ({ name, result: engine.run(setup, `SELECT * FROM ${quoteName(name)}`)[0] }));
    },
    async expected(ex) {
      return runQuery(run, visibleSetup(await prepared(ex)), ex.answer, ex.check ?? null).result;
    },
    // Só executa nos dados visíveis (o botão "Executar" das perguntas), sem dizer se está certo.
    async execute(ex, sql) {
      const out = runQuery(run, visibleSetup(await prepared(ex)), sql, ex.check ?? null);
      return out.error ? { ...out, hint: sqlErrorHint(out.error) } : out;
    },
    async grade(ex, sql) {
      return gradeSql(ex, sql, { run, dataset: await prepared(ex) });
    },
  };
}

export const hasSqlQuestions = (questions) => questions.some((q) => q.type === 'sql');

// Antes de um quiz: carrega o motor e as tabelas das perguntas "sql". Se não der, elas saem e um aviso explica.
// Quem chama só espera (await) quando hasSqlQuestions: sem SQL, o quiz começa na hora, como antes.
export async function usableQuestions(app, questions) {
  const sqlQuestions = questions.filter((q) => q.type === 'sql');
  if (!sqlQuestions.length) return questions;
  try {
    await Promise.all(sqlQuestions.map((q) => app.sql.preload(q)));
    return questions;
  } catch {
    app.layout.toast('As perguntas de escrever SQL ficaram de fora: não foi possível carregar o banco de dados. Confira sua conexão.', { tone: 'danger', timeout: 8000 });
    return questions.filter((q) => q.type !== 'sql');
  }
}
```

Substitua o conteúdo de `js/app.js` por:
```js
// Monta a aplicação: estado, armazenamento, backup automático, avisos e rotas.
// main.js só chama boot(); aqui fica tudo o que dá para testar.
import { createInitialState } from './core/state.js';
import { toDayKey, addDays } from './core/dates.js';
import { needsBackupReminder, hasProgress } from './core/backup-format.js';
import { levelInfo } from './core/gamification.js';
import { updateBackupMeta, pruneOrphans } from './core/actions.js';
import { createStore } from './ui/store.js';
import { createStorage } from './data/storage.js';
import { createAutoBackup } from './data/backup.js';
import { loadLanguages, loadAchievementTexts, loadBanks } from './data/content.js';
import { createSqlEngine } from './data/sql-engine.js';
import { createSqlService } from './ui/sql-service.js';
import { initMarkdown } from './ui/markdown.js';
import { createLayout } from './ui/layout.js';
import { h, mount } from './ui/dom.js';
import { errorPanel } from './ui/components/common.js';
import { exportNow } from './ui/backup-flow.js';
import { VIEWS } from './ui/views/index.js';
import { renderOnboarding } from './ui/views/onboarding.js';
import { startRouter, navigate, refresh, setLeaveGuard, hasLeaveGuard } from './router.js';
import { APP_NAME, REMINDER_DISMISS_KEY, REMINDER_SNOOZE_DAYS, AUTO_BACKUP_PAUSE_KEY } from './config.js';

const loading = () => h('p', { class: 'loading', text: 'Carregando…' });

export function createApp({ languages, achievementTexts, storageOptions = {}, autoBackupOptions = {}, sqlEngine = createSqlEngine() }) {
  const app = { languages, achievementTexts, getLanguage: (id) => languages.find((l) => l.id === id), currentRoute: null };
  app.sql = createSqlService({ engine: sqlEngine, getLanguage: app.getLanguage });
  const layout = createLayout(app);
  const noStorage = () => layout.setBanner('storage', {
    tone: 'danger',
    text: 'Seu progresso não está sendo salvo neste navegador. Exporte um backup antes de fechar a página.',
  });

  let store = null;
  const storage = createStorage({
    ...storageOptions,
    onExternalChange: (state) => {
      store.set(state, { external: true });
      if (!hasLeaveGuard()) app.refresh();
    },
    onSaveError: noStorage,
  });
  const loaded = storage.load();
  store = createStore(loaded.status === 'ok' ? loaded.state : createInitialState());

  if (loaded.status === 'unavailable') noStorage();
  // Com dados danificados ou de versão mais nova, o backup automático fica pausado (também nas próximas visitas)
  // até a pessoa importar um backup ou retomar de propósito: o arquivo em disco pode ser justamente a cópia boa.
  if (loaded.status === 'corrupt' || loaded.status === 'newer') storage.setItem(AUTO_BACKUP_PAUSE_KEY, '1');
  if (loaded.status === 'corrupt') {
    storage.keepCorrupt(loaded.raw);
    layout.setBanner('corrupt', {
      tone: 'warning',
      text: 'Seu progresso salvo estava danificado. Guardamos uma cópia e começamos do zero. Se você tiver um backup, importe-o em Configurações.',
      actions: [{ label: 'Abrir Configurações', onClick: () => navigate('#/config') }],
    });
  }
  if (loaded.status === 'newer') {
    storage.disable();
    layout.setBanner('newer', {
      tone: 'danger',
      text: 'Seu progresso foi salvo por uma versão mais nova do site. Recarregue a página para atualizar. Até lá, nada será salvo.',
    });
  }

  const ctx = () => {
    const now = new Date();
    return { now, today: toDayKey(now), languages };
  };
  const achievementName = (id) => achievementTexts.find((a) => a.id === id)?.name ?? id;

  function announce(events) {
    if (events.moduleCompleted) layout.toast('🎉 Módulo concluído! +50 XP', { tone: 'success' });
    if (events.examPassed) layout.toast('🏆 Você passou na prova! +200 XP', { tone: 'success' });
    if (events.levelUp) layout.toast(`⬆️ Nível ${events.levelUp}: ${levelInfo(store.get().xp.total).title}!`, { tone: 'success' });
    for (const id of events.achievements) layout.toast(`🏅 Conquista desbloqueada: ${achievementName(id)}`, { tone: 'success', timeout: 6000 });
  }

  function dispatch(action, payload = {}, meta = {}) {
    const { state, events } = action(store.get(), payload, ctx());
    if (state !== store.get()) store.set(state, meta);
    announce(events);
    return events;
  }

  const autoBackup = createAutoBackup({
    ...autoBackupOptions,
    onWrite: (at) => dispatch(updateBackupMeta, { lastAutoWriteAt: at, autoFileError: null }, { backupMeta: true }),
    onError: (message) => dispatch(updateBackupMeta, { autoFileError: message }, { backupMeta: true }),
  });

  const isAutoBackupPaused = () => Boolean(storage.getItem(AUTO_BACKUP_PAUSE_KEY));

  async function resumeAutoBackup() {
    storage.removeItem(AUTO_BACKUP_PAUSE_KEY);
    await autoBackup.init().catch(() => {});
    updateBanners(store.get());
  }

  function updateBanners(state) {
    if (isAutoBackupPaused()) {
      layout.setBanner('paused', {
        tone: 'warning',
        text: 'O backup automático está pausado porque o progresso salvo neste navegador não pôde ser lido. O arquivo de backup não será alterado até você importar um backup ou retomar em Configurações.',
        actions: [{ label: 'Abrir Configurações', onClick: () => navigate('#/config') }],
      });
    } else {
      layout.clearBanner('paused');
    }
    const status = autoBackup.status();
    if (status === 'needs-permission') {
      layout.setBanner('reconnect', {
        text: 'O backup automático precisa da sua permissão para continuar gravando.',
        actions: [{
          label: 'Reconectar backup automático',
          onClick: async () => {
            await autoBackup.reconnect(store.get());
            updateBanners(store.get());
          },
        }],
      });
    } else {
      layout.clearBanner('reconnect');
    }
    const today = toDayKey(new Date());
    const remind = needsBackupReminder({
      state,
      today,
      dismissedUntil: storage.getItem(REMINDER_DISMISS_KEY),
      autoHealthy: status === 'on' && !state.backup.autoFileError,
    });
    if (remind) {
      layout.setBanner('reminder', {
        text: 'Já faz um tempo desde o seu último backup. Que tal exportar o progresso agora?',
        actions: [
          { label: 'Exportar agora', onClick: () => exportNow(app) },
          {
            label: 'Depois',
            onClick: () => {
              storage.setItem(REMINDER_DISMISS_KEY, addDays(today, REMINDER_SNOOZE_DAYS));
              layout.clearBanner('reminder');
            },
          },
        ],
      });
    } else {
      layout.clearBanner('reminder');
    }
  }

  Object.assign(app, {
    store, storage, layout, autoBackup, dispatch, ctx, navigate, refresh, setLeaveGuard, updateBanners,
    isAutoBackupPaused, resumeAutoBackup,
    loadStatus: loaded.status,
    go: (hash) => (location.hash === hash ? app.refresh() : navigate(hash)),
  });

  store.subscribe((state, meta) => {
    if (!meta.external) storage.save(state);
    // Um estado sem progresso (recém-zerado ou recomeçado após dados danificados) nunca sobrescreve o arquivo de backup.
    if (!meta.external && !meta.backupMeta && hasProgress(state) && !isAutoBackupPaused()) autoBackup.schedule(state);
    layout.render(state, app.currentRoute?.name);
    updateBanners(state);
  });

  return app;
}

export function createRouteHandler(app, main, views = VIEWS) {
  let renderToken = 0;
  let cleanup = null;
  return async function onRoute(route) {
    app.currentRoute = route;
    const token = ++renderToken;
    cleanup?.();
    cleanup = null;
    mount(main, loading());
    const target = h('div', { class: 'view' });
    try {
      app.layout.render(app.store.get(), route.name);
      const view = app.store.get().profile ? (views[route.name] ?? views.notFound) : renderOnboarding;
      const result = await view(target, app, route);
      if (token !== renderToken) {
        if (typeof result === 'function') result();
        return;
      }
      cleanup = typeof result === 'function' ? result : null;
      mount(main, target);
    } catch (err) {
      console.error(err);
      if (token === renderToken) mount(main, errorPanel('Não foi possível abrir esta página. Tente de novo; se o problema continuar, confira sua conexão.', () => onRoute(route)));
    }
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  };
}

export function start(languages, achievementTexts, options = {}) {
  const app = createApp({ languages, achievementTexts, ...options });
  const onRoute = createRouteHandler(app, document.getElementById('main'));
  const oops = () => app.layout.toast('Algo deu errado. Seu progresso salvo não foi afetado.', { tone: 'danger' });
  window.addEventListener('error', oops);
  window.addEventListener('unhandledrejection', oops);
  app.updateBanners(app.store.get());
  if (!app.isAutoBackupPaused()) app.autoBackup.init().catch(() => {}).finally(() => app.updateBanners(app.store.get()));
  startRouter(onRoute);
  // Só com o conteúdo inteiro carregado dá para saber o que sumiu; se algo falhar, não se apaga nada.
  loadBanks(languages)
    .then((bank) => app.dispatch(pruneOrphans, {
      cardIds: new Set(bank.cards.map((c) => c.id)),
      questionIds: new Set(bank.questions.map((q) => q.id)),
    }))
    .catch(() => {});
  return app;
}

export async function boot(options = {}) {
  const main = document.getElementById('main');
  document.title = APP_NAME;
  mount(main, loading());
  let languages;
  let achievementTexts;
  try {
    [languages, achievementTexts] = await Promise.all([loadLanguages(), loadAchievementTexts(), initMarkdown()]);
  } catch (err) {
    console.error(err);
    mount(main, errorPanel('Não foi possível carregar a Central. Confira sua conexão com a internet.', () => boot(options)));
    return null;
  }
  return start(languages, achievementTexts, options);
}
```

Substitua o conteúdo de `tests/helpers/app.js` por:
```js
// Monta um "app" de verdade (createApp) para testar telas e fluxos, com conteúdo lido do disco,
// Markdown local, armazenamento do jsdom e backup automático em memória.
import { installFetchFromDisk } from './fetch-from-disk.js';
import { nodeSqlEngine } from './sql.js';
import { initTestMarkdown } from './markdown.js';
import { loadLanguages, loadAchievementTexts } from '../../js/data/content.js';
import { createApp } from '../../js/app.js';
import { createInitialState } from '../../js/core/state.js';
import { STORAGE_KEY } from '../../js/config.js';

export function memoryStore() {
  const map = new Map();
  return { map, get: async (k) => map.get(k), set: async (k, v) => { map.set(k, v); }, delete: async (k) => { map.delete(k); } };
}

export function profileState(extra = {}) {
  return {
    ...createInitialState(),
    profile: { name: 'Rafa', avatar: '🦊', dailyGoal: 50, createdAt: new Date(2026, 9, 1, 12).toISOString() },
    ...extra,
  };
}

// Chame setupDom() no arquivo de teste antes. fixture: true (Java congelado) ou o nome de outro conjunto de
// tests/fixtures/ (como 'sql-ui'). sqlEngine: por padrão, o sql.js do npm.
export async function makeTestApp({ state = null, raw = null, fixture = true, sqlEngine = nodeSqlEngine() } = {}) {
  installFetchFromDisk({ overlay: fixture });
  await initTestMarkdown();
  const [languages, achievementTexts] = await Promise.all([loadLanguages(), loadAchievementTexts()]);
  localStorage.clear();
  if (raw !== null) localStorage.setItem(STORAGE_KEY, raw);
  else if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const app = createApp({
    languages,
    achievementTexts,
    storageOptions: { debounceMs: 0 },
    autoBackupOptions: { store: memoryStore(), debounceMs: 0 },
    sqlEngine,
  });
  app.refreshes = 0;
  app.refresh = () => { app.refreshes += 1; };
  return app;
}

export const route = (name, params = {}, query = {}) => ({ name, params, query });
export const container = () => document.createElement('div');
export const texts = (el, selector) => [...el.querySelectorAll(selector)].map((n) => n.textContent.trim());
```

- [ ] **Step 3: Rodar e ver passar**

Run: `node --test tests/ui/sql-service.test.js`
Expected: PASS (8 testes).

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add js/ui/sql-service.js js/app.js tests/helpers/app.js tests/ui/sql-service.test.js
git commit -m "Serviço de SQL no app: tabelas, esperado, execução e correção" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Componente do exercício de SQL

**Files:**
- Create: `js/ui/components/sql-exercise.js`
- Modify: `tests/helpers/dom.js` (ganha `waitFor`), `css/components.css`
- Test: `tests/ui/sql-exercise.test.js`

**Interfaces:**
- Consumes: `app.sql` (Task 4).
- Produces:
  - `MAX_ROWS` (100), `resultTable(result, { label })`, `errorBox(error, hint)`, `sqlEditor({ label, onRun })`.
  - `createSqlExercise(exercise, { service, lang, mode, title, showPrompt, onSubmit })` → `{ el, loaded, focus(), unlock(), reveal({ verdict, showCorrect }) }`, com `mode` `'challenge'` ou `'question'`.
  - `waitFor(check, { timeout })`, para os testes.

- [ ] **Step 1: Escrever o teste (falhando)**

Substitua o conteúdo de `tests/helpers/dom.js` por:
```js
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

// Espera até check() ser verdadeiro (telas que dependem do sql.js ou de arquivos lidos do disco).
export async function waitFor(check, { timeout = 3000 } = {}) {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeout) throw new Error('waitFor: a condição não ficou verdadeira a tempo');
    await tick(5);
  }
}
```

`tests/ui/sql-exercise.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, waitFor } from '../helpers/dom.js';
import { makeTestApp, profileState, texts } from '../helpers/app.js';
import { loadBanks, loadChallenges } from '../../js/data/content.js';
import { createSqlEngine } from '../../js/data/sql-engine.js';
import { createSqlExercise, resultTable, sqlEditor, errorBox, MAX_ROWS } from '../../js/ui/components/sql-exercise.js';

setupDom();

async function setup(options = {}) {
  const app = await makeTestApp({ state: profileState(), fixture: 'sql-ui', ...options });
  const [sql] = app.languages;
  const challenges = await loadChallenges(sql, sql.modules[0]);
  const byId = new Map((await loadBanks(app.languages)).questions.map((q) => [q.id, q]));
  return { app, challenges, byId };
}

async function mountExercise(app, exercise, opts) {
  const ex = createSqlExercise(exercise, { service: app.sql, lang: 'sql', ...opts });
  document.body.append(ex.el);
  await ex.loaded;
  return ex;
}

const type = (ex, sql) => {
  const area = ex.el.querySelector('textarea');
  area.value = sql;
  area.dispatchEvent(new window.Event('input', { bubbles: true }));
};
const button = (ex, label) => [...ex.el.querySelectorAll('button')].find((b) => b.textContent === label);

test('desafio: mostra as tabelas visíveis e o resultado esperado; os dados ocultos nunca aparecem', async () => {
  const { app, challenges } = await setup();
  const ex = await mountExercise(app, challenges[1], { mode: 'challenge', title: 'Desafio 2' });
  assert.equal(ex.el.querySelector('.sql-title').textContent, 'Desafio 2');
  assert.equal(ex.el.querySelector('.sql-tables summary').textContent, 'Tabelas deste exercício');
  const tableText = ex.el.querySelector('.sql-tables').textContent;
  assert.match(tableText, /Ana.*Bruno.*Carla.*Davi/s);
  assert.doesNotMatch(ex.el.textContent, /Elisa|Fábio|Gabi|Hugo/);
  assert.deepEqual(texts(ex.el, '.sql-expected td'), ['Ana', 'Carla']);
  assert.equal(button(ex, 'Executar').disabled, false);
  ex.el.remove();
});

test('desafio: cada execução corrige; "Ver uma resposta" aparece depois da primeira', async () => {
  const { app, challenges } = await setup();
  const ex = await mountExercise(app, challenges[1], { mode: 'challenge' });
  assert.equal(button(ex, 'Ver uma resposta').hidden, true);
  type(ex, 'SELECT nome FROM pessoas WHERE id IN (1, 3)');
  button(ex, 'Executar').click();
  await waitFor(() => ex.el.querySelector('.sql-status'));
  assert.match(ex.el.querySelector('.sql-status').textContent, /^❌ Seu resultado bate nestas tabelas/);
  type(ex, 'SELECT nome FROM pessoas WHERE idade > 30');
  button(ex, 'Executar').click();
  await waitFor(() => /✅/.test(ex.el.querySelector('.sql-status').textContent));
  assert.equal(ex.el.querySelector('.sql-status').textContent, '✅ Resultado certo!');
  assert.deepEqual(texts(ex.el, '.sql-output td'), ['Ana', 'Carla']);
  button(ex, 'Ver uma resposta').click();
  assert.equal(ex.el.querySelector('.sql-answer').hidden, false);
  assert.match(ex.el.querySelector('.sql-answer').textContent, /SELECT nome FROM pessoas WHERE idade > 30;/);
  ex.el.remove();
});

test('desafio: erro do SQLite aparece com a dica; caixa vazia pede uma consulta', async () => {
  const { app, challenges } = await setup();
  const ex = await mountExercise(app, challenges[0], { mode: 'challenge' });
  button(ex, 'Executar').click();
  assert.equal(ex.el.querySelector('.sql-output').textContent, 'Escreva uma consulta antes de executar.');
  type(ex, 'SELECT * FROM pessoa');
  button(ex, 'Executar').click();
  await waitFor(() => ex.el.querySelector('.sql-error'));
  assert.equal(ex.el.querySelector('.sql-error').getAttribute('role'), 'alert');
  assert.match(ex.el.querySelector('.sql-error').textContent, /no such table: pessoa.*A tabela pessoa não existe/s);
  ex.el.remove();
});

test('pergunta: Executar só mostra o resultado; Responder envia e trava a caixa', async () => {
  const { app, byId } = await setup();
  const sent = [];
  const ex = await mountExercise(app, byId.get('sql.teste.q01'), { mode: 'question', onSubmit: (sql) => sent.push(sql) });
  assert.equal(button(ex, 'Responder').disabled, true);
  type(ex, 'SELECT nome FROM pessoas WHERE idade < 20');
  assert.equal(button(ex, 'Responder').disabled, false);
  button(ex, 'Executar').click();
  await waitFor(() => ex.el.querySelector('.sql-output td'));
  assert.deepEqual(texts(ex.el, '.sql-output td'), ['Davi']);
  assert.equal(ex.el.querySelector('.sql-status'), null);
  button(ex, 'Responder').click();
  assert.deepEqual(sent, ['SELECT nome FROM pessoas WHERE idade < 20']);
  assert.equal(ex.el.querySelector('textarea').readOnly, true);
  assert.equal(button(ex, 'Executar').disabled, true);
  ex.unlock();
  assert.equal(ex.el.querySelector('textarea').readOnly, false);
  ex.el.remove();
});

test('pergunta: reveal mostra veredito, esperado e uma resposta certa só no modo estudo', async () => {
  const { app, byId } = await setup();
  const q = byId.get('sql.teste.q01');
  const verdict = await app.sql.grade(q, 'SELECT nome FROM pessoas');
  const estudo = await mountExercise(app, q, { mode: 'question' });
  estudo.reveal({ verdict, showCorrect: true });
  assert.match(estudo.el.querySelector('.sql-status').textContent, /^❌ Sua consulta devolveu 4 linhas; o esperado são 2 linhas\./);
  assert.match(estudo.el.querySelector('.sql-output').textContent, /Resultado esperado.*Uma resposta certa:.*WHERE idade > 30/s);
  const simulado = await mountExercise(app, q, { mode: 'question' });
  simulado.reveal({ verdict, showCorrect: false });
  assert.equal(simulado.el.querySelector('.sql-output').textContent, '');
  assert.equal(simulado.el.querySelector('textarea').readOnly, true);
  estudo.el.remove();
  simulado.el.remove();
});

test('sem o motor, o exercício avisa e não deixa executar', async () => {
  const { app, challenges } = await setup({ sqlEngine: createSqlEngine({ load: async () => { throw new Error('rede'); } }) });
  const ex = await mountExercise(app, challenges[0], { mode: 'challenge' });
  assert.equal(ex.el.querySelector('.sql-unavailable').textContent,
    'Não foi possível carregar o banco de dados. Confira sua conexão e recarregue a página.');
  assert.equal(button(ex, 'Executar').disabled, true);
  ex.el.remove();
});

test(`resultTable mostra até ${MAX_ROWS} linhas, NULL e o aviso de linhas a mais ou de nenhuma linha`, () => {
  const many = resultTable({ columns: ['x'], values: Array.from({ length: 150 }, (_, i) => [i]) }, { label: 'Resultado' });
  assert.equal(many.querySelectorAll('tbody tr').length, MAX_ROWS);
  assert.equal(many.querySelector('.sql-label').textContent, 'Resultado');
  assert.match(many.textContent, /e mais 50 linhas/);
  const one = resultTable({ columns: ['x'], values: Array.from({ length: 101 }, () => [null]) });
  assert.match(one.textContent, /e mais 1 linha$/);
  assert.equal(one.querySelector('td').className, 'sql-null');
  assert.equal(one.querySelector('td').textContent, 'NULL');
  const empty = resultTable({ columns: ['nome'], values: [] });
  assert.deepEqual(texts(empty, 'th'), ['nome']);
  assert.match(empty.textContent, /A consulta não devolveu nenhuma linha\./);
  assert.match(errorBox('incomplete input', null).textContent, /^Erro do SQLite: incomplete input$/);
});

test('sqlEditor: Tab indenta, Esc libera o Tab para sair e Ctrl+Enter executa', () => {
  let runs = 0;
  const area = sqlEditor({ label: 'Sua consulta SQL', onRun: () => { runs += 1; } });
  document.body.append(area);
  assert.equal(area.getAttribute('aria-label'), 'Sua consulta SQL');
  assert.equal(area.getAttribute('spellcheck'), 'false');
  area.value = 'SELECT';
  area.selectionStart = 0;
  area.selectionEnd = 0;
  const tab = new window.KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
  area.dispatchEvent(tab);
  assert.equal(tab.defaultPrevented, true);
  assert.equal(area.value, '  SELECT');
  assert.equal(area.selectionStart, 2);
  area.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  const tabOut = new window.KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
  area.dispatchEvent(tabOut);
  assert.equal(tabOut.defaultPrevented, false);
  area.dispatchEvent(new window.Event('focus'));
  const tabAgain = new window.KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
  area.dispatchEvent(tabAgain);
  assert.equal(tabAgain.defaultPrevented, true);
  area.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, cancelable: true }));
  area.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', metaKey: true, cancelable: true }));
  assert.equal(runs, 2);
  area.remove();
});
```

Run: `node --test tests/ui/sql-exercise.test.js`
Expected: FAIL, porque o módulo `js/ui/components/sql-exercise.js` não existe.

- [ ] **Step 2: Implementar**

`js/ui/components/sql-exercise.js`:
```js
// Exercício de SQL: enunciado, "Tabelas deste exercício", caixa de texto, Executar e resultado.
// mode 'challenge' (desafio da aula): cada execução corrige, com o esperado ao lado e "Ver uma resposta".
// mode 'question' (pergunta do quiz): Executar só mostra o resultado; Responder envia para a correção.
import { h, plural } from '../dom.js';
import { md } from '../markdown.js';

export const MAX_ROWS = 100;

export function resultTable(result, { label = null } = {}) {
  const shown = result.values.slice(0, MAX_ROWS);
  const hiddenRows = result.values.length - shown.length;
  return h('div', { class: 'sql-result' },
    label ? h('p', { class: 'sql-label', text: label }) : null,
    h('div', { class: 'sql-table-wrap' },
      h('table', { class: 'sql-table' },
        h('thead', {}, h('tr', {}, result.columns.map((c) => h('th', { scope: 'col', text: c })))),
        h('tbody', {}, shown.map((row) => h('tr', {}, row.map((v) => h('td', { class: v === null ? 'sql-null' : null, text: v === null ? 'NULL' : String(v) }))))))),
    result.values.length === 0 ? h('p', { class: 'muted small', text: 'A consulta não devolveu nenhuma linha.' }) : null,
    hiddenRows > 0 ? h('p', { class: 'muted small', text: `e mais ${hiddenRows} ${plural(hiddenRows, 'linha', 'linhas')}` }) : null);
}

export function errorBox(error, hint) {
  return h('div', { class: 'sql-error', role: 'alert' },
    h('p', {}, h('strong', { text: 'Erro do SQLite: ' }), h('code', { text: error })),
    hint ? h('p', { text: hint }) : null);
}

// Caixa de texto para SQL: Tab insere dois espaços; Esc libera o Tab para sair da caixa; Ctrl+Enter executa.
export function sqlEditor({ label, onRun }) {
  const area = h('textarea', {
    class: 'sql-input', rows: '5', 'aria-label': label, spellcheck: 'false',
    autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off',
  });
  let tabIndents = true;
  area.addEventListener('focus', () => { tabIndents = true; });
  area.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onRun();
    } else if (event.key === 'Escape') {
      tabIndents = false;
    } else if (event.key === 'Tab' && !event.shiftKey && tabIndents && !area.readOnly) {
      event.preventDefault();
      const { selectionStart: start, selectionEnd: end, value } = area;
      area.value = `${value.slice(0, start)}  ${value.slice(end)}`;
      area.selectionStart = start + 2;
      area.selectionEnd = start + 2;
      area.dispatchEvent(new window.Event('input', { bubbles: true }));
    }
  });
  return area;
}

const answerBlock = (exercise, lang) => md(`\`\`\`sql\n${exercise.answer}\n\`\`\``, { lang });
const statusLine = (verdict) => h('p', { class: `sql-status ${verdict.ok ? 'ok' : 'err'}`, text: `${verdict.ok ? '✅' : '❌'} ${verdict.message}` });

function verdictBody(verdict) {
  if (verdict.error) return errorBox(verdict.error, verdict.hint);
  return verdict.actual ? resultTable(verdict.actual, { label: 'Seu resultado' }) : null;
}

export function createSqlExercise(exercise, {
  service, lang, mode = 'challenge', title = null, showPrompt = true, onSubmit = () => {},
}) {
  const isChallenge = mode === 'challenge';
  const status = h('p', { class: 'muted small', text: 'Carregando o banco de dados…' });
  const tablesBox = h('div', { class: 'sql-tables-body' });
  const tables = h('details', { class: 'sql-tables' }, h('summary', { text: 'Tabelas deste exercício' }), tablesBox);
  const output = h('div', { class: 'sql-output', 'aria-live': 'polite' });
  const expectedBox = h('div', { class: 'sql-expected' });
  const answerBox = h('div', { class: 'sql-answer', hidden: true });
  const runBtn = h('button', { type: 'button', class: 'btn', disabled: true, text: 'Executar' });
  const showAnswerBtn = h('button', { type: 'button', class: 'btn btn-ghost', hidden: true, text: 'Ver uma resposta' });
  const submitBtn = h('button', { type: 'button', class: 'btn btn-primary', disabled: true, text: 'Responder' });
  const editor = sqlEditor({ label: 'Sua consulta SQL', onRun: () => run() });
  let ready = false;
  let locked = false;

  const refreshButtons = () => {
    runBtn.disabled = !ready || locked;
    submitBtn.disabled = !ready || locked || !editor.value.trim();
  };
  editor.addEventListener('input', refreshButtons);

  async function run() {
    if (!ready || locked) return;
    if (!editor.value.trim()) {
      output.replaceChildren(h('p', { class: 'muted small', text: 'Escreva uma consulta antes de executar.' }));
      return;
    }
    runBtn.disabled = true;
    try {
      if (isChallenge) {
        const verdict = await service.grade(exercise, editor.value);
        output.replaceChildren(statusLine(verdict), verdictBody(verdict) ?? '');
        showAnswerBtn.hidden = false;
      } else {
        const out = await service.execute(exercise, editor.value);
        if (out.error) output.replaceChildren(errorBox(out.error, out.hint));
        else if (out.result) output.replaceChildren(resultTable(out.result, { label: 'Resultado' }));
        else output.replaceChildren(h('p', { class: 'muted small', text: 'Sua consulta não devolveu uma tabela.' }));
      }
    } finally {
      refreshButtons();
    }
  }

  runBtn.addEventListener('click', run);
  showAnswerBtn.addEventListener('click', () => {
    answerBox.hidden = false;
    showAnswerBtn.hidden = true;
  });
  submitBtn.addEventListener('click', () => {
    if (submitBtn.disabled) return;
    lock();
    onSubmit(editor.value);
  });

  function lock() {
    locked = true;
    editor.readOnly = true;
    refreshButtons();
  }

  answerBox.append(h('p', { class: 'sql-label', text: 'Uma resposta certa:' }), answerBlock(exercise, lang),
    exercise.explanation ? md(exercise.explanation, { lang }) : '');

  const root = h('div', { class: `sql-exercise sql-${mode}` },
    title ? h('h3', { class: 'sql-title', text: title }) : null,
    showPrompt ? md(exercise.prompt, { lang }) : null,
    status,
    tables,
    editor,
    h('div', { class: 'sql-actions' }, runBtn, isChallenge ? showAnswerBtn : submitBtn),
    output,
    isChallenge ? expectedBox : null,
    isChallenge ? answerBox : null);

  const loaded = (async () => {
    try {
      const list = await service.tables(exercise);
      tablesBox.replaceChildren(...list.map((t) => resultTable(t.result, { label: t.name })));
      if (isChallenge) expectedBox.replaceChildren(resultTable(await service.expected(exercise), { label: 'Resultado esperado' }));
      ready = true;
      status.remove();
    } catch {
      status.className = 'sql-unavailable';
      status.textContent = 'Não foi possível carregar o banco de dados. Confira sua conexão e recarregue a página.';
    }
    refreshButtons();
  })();

  return {
    el: root,
    loaded,
    focus: () => editor.focus(),
    unlock() {
      locked = false;
      editor.readOnly = false;
      refreshButtons();
    },
    // Depois de Responder: no modo estudo mostra veredito, resultados e uma resposta certa.
    reveal({ verdict = null, showCorrect }) {
      lock();
      if (!showCorrect || !verdict) return;
      output.replaceChildren(statusLine(verdict), verdictBody(verdict) ?? '',
        verdict.expected ? resultTable(verdict.expected, { label: 'Resultado esperado' }) : '',
        h('p', { class: 'sql-label', text: 'Uma resposta certa:' }), answerBlock(exercise, lang));
    },
  };
}
```

Acrescente ao fim de `css/components.css`:
```css
/* Exercícios de SQL (desafios das aulas e perguntas "sql") */
.challenges { margin-top: 28px; }
.sql-exercise { display: flex; flex-direction: column; gap: 10px; margin: 14px 0; padding: 16px; border: 1px solid var(--bd); border-radius: var(--radius); background: var(--sf); }
.sql-question { margin: 12px 0 0; padding: 0; border: 0; background: none; }
.sql-title { margin: 0; font-size: 1rem; }
.sql-tables summary { cursor: pointer; color: var(--blue); font-size: .9rem; }
.sql-tables-body { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; }
.sql-input { width: 100%; min-height: 110px; padding: 12px 14px; border: 1px solid var(--bd); border-radius: var(--radius-sm); background: var(--bg); color: var(--tx); font-family: var(--mono); font-size: .9rem; line-height: 1.5; resize: vertical; tab-size: 2; }
.sql-input:focus-visible { outline: 2px solid var(--blue); outline-offset: 1px; }
.sql-input[readonly] { opacity: .8; }
.sql-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.sql-label { margin: 0 0 4px; color: var(--mt); font-size: .75rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.sql-output, .sql-expected { display: flex; flex-direction: column; gap: 10px; }
.sql-table-wrap { max-width: 100%; max-height: 360px; overflow: auto; border: 1px solid var(--bd); border-radius: var(--radius-sm); }
.sql-table { border-collapse: collapse; font-family: var(--mono); font-size: .82rem; }
.sql-table th, .sql-table td { padding: 5px 10px; border-bottom: 1px solid var(--bd); text-align: left; white-space: nowrap; }
.sql-table th { position: sticky; top: 0; background: var(--sf2); color: var(--mt); }
.sql-null { color: var(--mt); font-style: italic; }
.sql-status { margin: 0; padding: 10px 12px; border-radius: var(--radius-sm); }
.sql-status.ok { background: rgba(63, 185, 80, .08); border: 1px solid rgba(63, 185, 80, .3); }
.sql-status.err { background: rgba(248, 81, 73, .08); border: 1px solid rgba(248, 81, 73, .3); }
.sql-error, .sql-unavailable { margin: 0; padding: 10px 12px; border: 1px solid rgba(248, 81, 73, .4); border-radius: var(--radius-sm); }
.sql-error p { margin: 0 0 4px; }
.sql-error code { font-family: var(--mono); font-size: .85rem; }
```

- [ ] **Step 3: Rodar e ver passar**

Run: `node --test tests/ui/sql-exercise.test.js`
Expected: PASS (8 testes).

Run: `npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add js/ui/components/sql-exercise.js css/components.css tests/helpers/dom.js tests/ui/sql-exercise.test.js
git commit -m "Componente do exercício de SQL: tabelas, caixa, Executar e resultado" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Perguntas sql no quiz, na prática e na prova; desafios nas aulas

**Files:**
- Modify:
  - `js/ui/components/question.js` (tipo `sql`);
  - `js/ui/components/quiz-runner.js` (correção assíncrona só para `sql`, rótulos da revisão);
  - `js/ui/views/practice.js`, `js/ui/views/exam.js` e `js/ui/views/quiz-builder.js` (`usableQuestions` só quando há `sql`; tipo "Escrever SQL");
  - `js/ui/views/lesson.js` (bloco "Experimente").
- Test: `tests/ui/sql-views.test.js`

**Interfaces:**
- Consumes: `createSqlExercise` (Task 5), `usableQuestions` e `hasSqlQuestions` (Task 4), `loadChallenges` (Task 3).
- Produces:
  - `createQuestionView(q, { lang, onSubmit, sql })` aceita `type: 'sql'` e devolve também `unlock()`.
  - `view.reveal` recebe `verdict`.
  - `describeResponse` e `describeAnswer` tratam `sql`.

- [ ] **Step 1: Escrever o teste (falhando)**

`tests/ui/sql-views.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, waitFor } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container, texts } from '../helpers/app.js';
import { nextButton } from '../helpers/quiz.js';
import { runQuiz } from '../../js/ui/components/quiz-runner.js';
import { renderPractice } from '../../js/ui/views/practice.js';
import { renderExam } from '../../js/ui/views/exam.js';
import { renderQuizBuilder } from '../../js/ui/views/quiz-builder.js';
import { renderLesson } from '../../js/ui/views/lesson.js';
import { loadBanks } from '../../js/data/content.js';
import { prepareQuestion } from '../../js/core/quiz.js';
import { createSqlEngine } from '../../js/data/sql-engine.js';

setupDom();

const failingEngine = () => createSqlEngine({ load: async () => { throw new Error('rede'); } });
const buttonIn = (el, label) => [...el.querySelectorAll('button')].find((b) => b.textContent === label);

async function setup(options = {}) {
  const app = await makeTestApp({ state: profileState(), fixture: 'sql-ui', ...options });
  const byId = new Map((await loadBanks(app.languages)).questions.map((q) => [q.id, q]));
  const el = container();
  document.body.append(el);
  return { app, byId, el };
}

// Responde a pergunta sql da tela como uma pessoa: digita, espera o banco e clica em Responder.
async function answerSql(el, sql) {
  const root = el.querySelector('.question');
  const area = root.querySelector('textarea');
  area.value = sql;
  area.dispatchEvent(new window.Event('input', { bubbles: true }));
  await waitFor(() => !buttonIn(root, 'Responder').disabled);
  buttonIn(root, 'Responder').click();
  await waitFor(() => nextButton(el));
}

test('quiz no modo estudo: pergunta sql mostra veredito, esperado e uma resposta certa, e entra no progresso', async () => {
  const { app, byId, el } = await setup();
  runQuiz(el, app, {
    questions: [prepareQuestion(byId.get('sql.teste.q01')), prepareQuestion(byId.get('sql.teste.q02'))],
    mode: 'estudo', kind: 'quiz', title: 'Q',
  });
  assert.equal(el.querySelector('.q-type').textContent, 'Escreva a consulta');
  assert.equal(el.querySelectorAll('.question .md').length, 1, 'o enunciado aparece uma vez só');
  await answerSql(el, 'SELECT nome FROM pessoas WHERE id IN (1, 3)');
  assert.match(el.querySelector('.feedback').textContent, /❌ Não foi dessa vez\./);
  assert.match(el.querySelector('.sql-status').textContent, /Seu resultado bate nestas tabelas/);
  assert.match(el.querySelector('.sql-output').textContent, /Resultado esperado.*Uma resposta certa:/s);
  nextButton(el).click();
  await answerSql(el, 'select nome from pessoas order by nome');
  assert.match(el.querySelector('.feedback').textContent, /✅ Correto!/);
  nextButton(el).click();
  const state = app.store.get();
  assert.equal(state.counters.answered, 2);
  assert.deepEqual(state.mistakes, ['sql.teste.q01']);
  const review = el.querySelector('.review-item').textContent;
  assert.match(review, /Sua consulta: SELECT nome FROM pessoas WHERE id IN \(1, 3\)/);
  assert.match(review, /Uma resposta certa: .*SELECT nome FROM pessoas WHERE idade > 30;/s);
  el.remove();
});

test('quiz no simulado: a pergunta sql só registra a resposta', async () => {
  const { app, byId, el } = await setup();
  runQuiz(el, app, { questions: [prepareQuestion(byId.get('sql.teste.q01'))], mode: 'simulado', kind: 'quiz', title: 'Q' });
  await answerSql(el, 'SELECT nome FROM pessoas WHERE idade > 30');
  assert.equal(el.querySelector('.feedback').textContent, 'Resposta registrada.');
  assert.equal(el.querySelector('.sql-status'), null);
  nextButton(el).click();
  assert.equal(el.querySelector('.big-score').textContent, '1/1');
  el.remove();
});

test('se a correção falhar, o quiz avisa, não registra e deixa responder de novo', async () => {
  const { app, byId, el } = await setup();
  const realGrade = app.sql.grade;
  app.sql.grade = async () => { throw new Error('falhou'); };
  runQuiz(el, app, { questions: [prepareQuestion(byId.get('sql.teste.q01'))], mode: 'estudo', kind: 'quiz', title: 'Q' });
  const root = el.querySelector('.question');
  root.querySelector('textarea').value = 'SELECT nome FROM pessoas WHERE idade > 30';
  root.querySelector('textarea').dispatchEvent(new window.Event('input', { bubbles: true }));
  await waitFor(() => !buttonIn(root, 'Responder').disabled);
  buttonIn(root, 'Responder').click();
  await waitFor(() => /Não foi possível corrigir agora/.test(el.querySelector('.feedback').textContent));
  assert.equal(app.store.get().counters.answered, 0);
  assert.equal(nextButton(el), undefined);
  app.sql.grade = realGrade;
  await waitFor(() => !buttonIn(root, 'Responder').disabled);
  buttonIn(root, 'Responder').click();
  await waitFor(() => nextButton(el));
  assert.equal(app.store.get().counters.answered, 1);
  el.remove();
});

test('prática sem o motor: só as perguntas de outros tipos, com aviso', async () => {
  const { app, el } = await setup({ sqlEngine: failingEngine() });
  await renderPractice(el, app, route('practice', { lang: 'sql', module: 'teste' }));
  assert.match(el.textContent, /Pergunta 1 de 1/);
  assert.equal(el.querySelector('.q-type').textContent, 'Múltipla escolha');
  assert.ok(texts(document, '#toasts .toast').some((t) => /ficaram de fora/.test(t)));
  el.remove();
});

test('prova sem o motor: as vagas vão para os outros tipos', async () => {
  const { app, el } = await setup({ sqlEngine: failingEngine() });
  await renderExam(el, app, route('exam', { lang: 'sql' }));
  buttonIn(el, 'Começar a prova').click();
  await waitFor(() => /Pergunta 1 de 1 · Simulado/.test(el.textContent));
  el.remove();
});

test('montar quiz: "Escrever SQL" aparece quando o escopo tem perguntas sql e some quando não tem', async () => {
  const { app, el } = await setup();
  await renderQuizBuilder(el, app, route('quiz'));
  const sqlBox = [...el.querySelectorAll('label.check')].find((l) => l.textContent.trim() === 'Escrever SQL');
  assert.equal(sqlBox.hidden, false);
  assert.equal(el.querySelector('.quiz-builder > p.muted').textContent, '3 perguntas disponíveis com esses filtros.');
  const mod = [...el.querySelectorAll('.scope-mods label.check')].find((l) => l.textContent.trim() === 'Teste').querySelector('input');
  mod.checked = false;
  mod.dispatchEvent(new window.Event('change'));
  assert.equal(sqlBox.hidden, true);
  el.remove();
});

test('montar quiz com SQL: o quiz começa depois de preparar o banco', async () => {
  const { app, el } = await setup();
  await renderQuizBuilder(el, app, route('quiz'));
  el.querySelector('form').dispatchEvent(new window.Event('submit', { cancelable: true }));
  await waitFor(() => /Pergunta 1 de 3/.test(el.textContent));
  el.remove();
});

test('aula de SQL termina com "Experimente" e os desafios dela', async () => {
  const { app, el } = await setup();
  await renderLesson(el, app, route('lesson', { lang: 'sql', module: 'teste', lesson: 'filtrar' }));
  const section = el.querySelector('section.challenges');
  assert.equal(section.querySelector('h2').textContent, 'Experimente');
  assert.equal(section.querySelectorAll('.sql-exercise').length, 1);
  assert.equal(section.querySelector('.sql-title'), null);
  assert.match(section.textContent, /Liste o nome das pessoas com mais de 30 anos\./);
  assert.ok(section.compareDocumentPosition(el.querySelector('.lesson-foot')) & window.Node.DOCUMENT_POSITION_FOLLOWING);
  await waitFor(() => texts(section, '.sql-expected td').length === 2);
  el.remove();
});
```

Run: `node --test tests/ui/sql-views.test.js`
Expected: FAIL. A pergunta `sql` ainda não tem visão, e não existe o "Experimente".

- [ ] **Step 2: Implementar**

Substitua o conteúdo de `js/ui/components/question.js` por:
```js
import { h } from '../dom.js';
import { md, mdInline } from '../markdown.js';
import { BLANK, isBlankCorrect } from '../../core/grading.js';
import { createSqlExercise } from './sql-exercise.js';

const TYPE_LABEL = {
  multiple: 'Múltipla escolha',
  truefalse: 'Verdadeiro ou falso',
  fill: 'Complete a lacuna',
  order: 'Ordene as linhas',
  sql: 'Escreva a consulta',
};
const LETTERS = 'ABCDE';

function multiple(root, q, onSubmit) {
  const buttons = q.optionOrder.map((orig, i) => {
    const btn = h('button', { type: 'button', class: 'opt', 'data-orig': orig },
      h('span', { class: 'opt-letter', text: LETTERS[i] }), mdInline(q.options[orig]));
    btn.addEventListener('click', () => { lock(); onSubmit(orig); });
    return btn;
  });
  const lock = () => buttons.forEach((b) => { b.disabled = true; });
  root.append(h('div', { class: 'opts' }, buttons));
  return {
    reveal({ response, showCorrect }) {
      lock();
      for (const b of buttons) {
        const orig = Number(b.dataset.orig);
        if (orig === response) b.classList.add('chosen');
        if (showCorrect && orig === q.answer) b.classList.add('ok');
        else if (showCorrect && orig === response) b.classList.add('err');
      }
    },
    focus: () => buttons[0]?.focus(),
  };
}

function trueFalse(root, q, onSubmit) {
  const make = (value, label) => {
    const btn = h('button', { type: 'button', class: 'opt', 'data-value': String(value), text: label });
    btn.addEventListener('click', () => { lock(); onSubmit(value); });
    return btn;
  };
  const buttons = [make(true, 'Verdadeiro'), make(false, 'Falso')];
  const lock = () => buttons.forEach((b) => { b.disabled = true; });
  root.append(h('div', { class: 'opts opts-row' }, buttons));
  return {
    reveal({ response, showCorrect }) {
      lock();
      for (const b of buttons) {
        const value = b.dataset.value === 'true';
        if (value === response) b.classList.add('chosen');
        if (showCorrect && value === q.answer) b.classList.add('ok');
        else if (showCorrect && value === response) b.classList.add('err');
      }
    },
    focus: () => buttons[0].focus(),
  };
}

function fill(root, q, onSubmit) {
  const parts = q.code.split(BLANK);
  const inputs = [];
  const code = h('code');
  parts.forEach((part, i) => {
    code.append(document.createTextNode(part));
    if (i < parts.length - 1) {
      const input = h('input', { type: 'text', class: 'blank', 'aria-label': `Lacuna ${i + 1}`, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
      inputs.push(input);
      code.append(input);
    }
  });
  const submit = h('button', { type: 'submit', class: 'btn btn-primary', text: 'Responder' });
  const form = h('form', { class: 'fill-form' }, h('pre', { class: 'fill-code' }, code), submit);
  const lock = () => {
    inputs.forEach((i) => { i.readOnly = true; });
    submit.disabled = true;
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const empty = inputs.find((i) => !i.value.trim());
    if (empty) {
      empty.focus();
      return;
    }
    lock();
    onSubmit(inputs.map((i) => i.value));
  });
  root.append(form);
  return {
    reveal({ response, showCorrect, correct }) {
      lock();
      if (!showCorrect) return;
      inputs.forEach((input, i) => input.classList.add(isBlankCorrect(q, i, response[i]) ? 'ok' : 'err'));
      if (!correct) {
        root.append(h('p', { class: 'fill-answer' }, 'Resposta esperada: ',
          q.blanks.map((accepted, i) => [i ? ' · ' : '', h('code', { text: accepted[0] })])));
      }
    },
    focus: () => inputs[0]?.focus(),
  };
}

function order(root, q, onSubmit, lang) {
  const lines = q.shuffledLines.slice();
  let selected = null;
  let locked = false;
  const list = h('ol', { class: 'order-list' });
  const submit = h('button', { type: 'button', class: 'btn btn-primary', text: 'Confirmar ordem' });

  function move(i, delta) {
    const j = i + delta;
    if (locked || j < 0 || j >= lines.length) return;
    [lines[i], lines[j]] = [lines[j], lines[i]];
    selected = j;
    draw();
    list.children[j]?.querySelector('.order-line')?.focus();
  }

  function draw() {
    list.replaceChildren(...lines.map((line, i) => {
      const item = h('li', { class: `order-item${selected === i ? ' selected' : ''}`, draggable: locked ? null : 'true' },
        h('button', {
          type: 'button', class: 'order-line', disabled: locked || null, 'aria-pressed': String(selected === i),
          'aria-label': `Linha ${i + 1}: ${line}. Use as setas para mover.`,
          onClick: () => { selected = selected === i ? null : i; draw(); list.children[i]?.querySelector('.order-line')?.focus(); },
          onKeydown: (event) => {
            if (event.key === 'ArrowUp') { event.preventDefault(); move(i, -1); }
            if (event.key === 'ArrowDown') { event.preventDefault(); move(i, 1); }
          },
        }, h('code', { text: line })),
        h('span', { class: 'order-moves' },
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Mover para cima', disabled: locked || i === 0 || null, onClick: () => move(i, -1), text: '↑' }),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Mover para baixo', disabled: locked || i === lines.length - 1 || null, onClick: () => move(i, 1), text: '↓' })));
      item.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', String(i));
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', () => item.classList.remove('dragging'));
      item.addEventListener('dragover', (event) => event.preventDefault());
      item.addEventListener('drop', (event) => {
        event.preventDefault();
        const from = Number(event.dataTransfer.getData('text/plain'));
        if (locked || Number.isNaN(from) || from === i) return;
        const [moved] = lines.splice(from, 1);
        lines.splice(i, 0, moved);
        selected = i;
        draw();
      });
      return item;
    }));
  }

  draw();
  submit.addEventListener('click', () => {
    locked = true;
    selected = null;
    submit.disabled = true;
    draw();
    onSubmit(lines.slice());
  });
  root.append(
    h('p', { class: 'muted small', text: 'Toque numa linha e use ↑ ↓ (ou as setas do teclado). No computador, também dá para arrastar.' }),
    list, submit);
  return {
    reveal({ showCorrect, correct }) {
      locked = true;
      submit.disabled = true;
      draw();
      if (showCorrect && !correct) {
        root.append(h('div', { class: 'order-answer' }, h('p', { text: 'Ordem correta:' }),
          md(`\`\`\`${lang ?? ''}\n${q.lines.join('\n')}\n\`\`\``, { lang })));
      }
    },
    focus: () => list.querySelector('.order-line')?.focus(),
  };
}

// O enunciado já vem da pergunta; o exercício cuida das tabelas, da caixa e do Executar.
function sqlQuestion(root, q, onSubmit, lang, sql) {
  const ex = createSqlExercise(q, { service: sql, lang, mode: 'question', showPrompt: false, onSubmit });
  root.append(ex.el);
  return { reveal: ex.reveal, focus: ex.focus, unlock: ex.unlock };
}

export function createQuestionView(question, { lang, onSubmit, sql = null }) {
  const root = h('div', { class: `question q-${question.type}`, 'data-qid': question.id },
    h('div', { class: 'q-type', text: TYPE_LABEL[question.type] }),
    md(question.prompt, { lang }));
  const builders = { multiple, truefalse: trueFalse, fill, order, sql: sqlQuestion };
  const { reveal, focus, unlock = () => {} } = builders[question.type](root, question, onSubmit, lang, sql);
  return { el: root, reveal, focus, unlock };
}

export function describeResponse(question, response) {
  if (response === undefined || response === null) return h('em', { text: 'sem resposta' });
  switch (question.type) {
    case 'multiple': return mdInline(question.options[response]);
    case 'truefalse': return h('span', { text: response ? 'Verdadeiro' : 'Falso' });
    case 'fill': return h('code', { text: response.join(' · ') });
    case 'order': return h('pre', {}, h('code', { text: response.join('\n') }));
    case 'sql': return h('pre', {}, h('code', { text: response }));
    default: return h('span', { text: String(response) });
  }
}

export function describeAnswer(question, lang) {
  switch (question.type) {
    case 'multiple': return mdInline(question.options[question.answer]);
    case 'truefalse': return h('span', { text: question.answer ? 'Verdadeiro' : 'Falso' });
    case 'fill': return h('code', { text: question.blanks.map((b) => b[0]).join(' · ') });
    case 'order': return md(`\`\`\`${lang ?? ''}\n${question.lines.join('\n')}\n\`\`\``, { lang });
    case 'sql': return md(`\`\`\`sql\n${question.answer}\n\`\`\``, { lang });
    default: return h('span', { text: '' });
  }
}
```

Substitua o conteúdo de `js/ui/components/quiz-runner.js` por:
```js
import { h, mount, bar, pct, formatDuration, toneFor } from '../dom.js';
import { md } from '../markdown.js';
import { gradeQuestion } from '../../core/grading.js';
import { prepareQuestion } from '../../core/quiz.js';
import { recordAnswer, finishQuiz } from '../../core/actions.js';
import { createQuestionView, describeResponse, describeAnswer } from './question.js';
import { findModule } from './common.js';

export function runQuiz(container, app, opts) {
  const {
    questions, mode, kind, title, timer = false, language = null, moduleId = null,
    scopeLabel = '', moduleKeys = [], resultActions = [], headline = null,
  } = opts;
  if (!questions.length) {
    mount(container, h('section', { class: 'panel' },
      h('h1', { text: title }),
      h('p', { text: 'Não há perguntas disponíveis para este quiz.' })));
    return;
  }
  const answers = [];
  const startedAt = Date.now();
  let index = 0;
  let finished = false;
  app.setLeaveGuard(() => finished || answers.length === 0 || confirm('Sair do quiz? O progresso deste quiz será perdido.'));

  const elapsed = h('span', { class: 'timer', 'aria-label': 'Tempo decorrido', text: '0 s' });
  const tick = timer ? setInterval(() => {
    if (finished || !container.isConnected) {
      clearInterval(tick);
      return;
    }
    elapsed.textContent = formatDuration((Date.now() - startedAt) / 1000);
  }, 1000) : null;

  const lessonLink = (q) => {
    const found = findModule(app, q.module);
    const lesson = found?.module.lessons.find((l) => l.id === q.lesson);
    return lesson
      ? h('a', { class: 'link', href: `#/${found.language.id}/${found.module.id}/${lesson.id}`, text: `📖 Revise a aula "${lesson.title}"` })
      : null;
  };

  function showQuestion() {
    const q = questions[index];
    const hl = app.getLanguage(q.lang)?.highlight;
    const feedback = h('div', { class: 'feedback', 'aria-live': 'polite' });
    const next = h('button', { type: 'button', class: 'btn btn-primary', hidden: true, text: index === questions.length - 1 ? 'Ver resultado' : 'Próxima →' });
    next.addEventListener('click', () => {
      index += 1;
      if (index < questions.length) showQuestion();
      else finish();
    });
    const view = createQuestionView(q, { lang: hl, sql: app.sql, onSubmit: (response) => submit(q, response, view, feedback, next, hl) });
    mount(container, h('section', { class: 'quiz' },
      h('header', { class: 'quiz-head' },
        h('div', {},
          h('h1', { class: 'quiz-title', text: title }),
          h('p', { class: 'muted', text: `Pergunta ${index + 1} de ${questions.length}${mode === 'simulado' ? ' · Simulado' : ''}` })),
        timer ? elapsed : null),
      bar(index / questions.length, { label: 'Andamento do quiz' }),
      h('div', { class: 'panel' }, view.el, feedback, h('div', { class: 'quiz-nav' }, next))));
    requestAnimationFrame(() => view.focus());
  }

  // Perguntas "sql" são corrigidas pelo banco (assíncrono); as outras, na hora.
  function submit(q, response, view, feedback, next, hl) {
    if (q.type !== 'sql') {
      settle(q, response, gradeQuestion(q, response), null, view, feedback, next, hl);
      return;
    }
    feedback.className = 'feedback';
    mount(feedback, h('p', { class: 'muted', text: 'Corrigindo…' }));
    app.sql.grade(q, response).then(
      (verdict) => settle(q, response, verdict.ok, verdict, view, feedback, next, hl),
      () => {
        feedback.className = 'feedback err';
        mount(feedback, h('p', { text: 'Não foi possível corrigir agora. Tente responder de novo.' }));
        view.unlock();
      },
    );
  }

  function settle(q, response, correct, verdict, view, feedback, next, hl) {
    answers[index] = { response, correct };
    app.dispatch(recordAnswer, { question: q, correct });
    const study = mode === 'estudo';
    view.reveal({ response, correct, showCorrect: study, verdict });
    if (study) {
      feedback.className = `feedback ${correct ? 'ok' : 'err'}`;
      mount(feedback,
        h('strong', { text: correct ? '✅ Correto!' : '❌ Não foi dessa vez.' }),
        md(q.explanation, { lang: hl }),
        correct ? null : lessonLink(q));
      app.layout.announce(correct ? 'Resposta correta.' : 'Resposta incorreta.');
    } else {
      mount(feedback, h('p', { class: 'muted', text: 'Resposta registrada.' }));
    }
    next.hidden = false;
    next.focus();
  }

  function finish() {
    finished = true;
    if (tick) clearInterval(tick);
    app.setLeaveGuard(null);
    const total = questions.length;
    const correct = answers.filter((a) => a.correct).length;
    const wrongIdx = questions.map((_, i) => i).filter((i) => !answers[i].correct);
    const durationSec = Math.round((Date.now() - startedAt) / 1000);
    app.dispatch(finishQuiz, {
      kind, mode, scopeLabel, moduleKeys, total, correct, durationSec, language, moduleId,
      questionIds: questions.map((q) => q.id),
      wrongIds: wrongIdx.map((i) => questions[i].id),
    });
    renderResult({ total, correct, durationSec, wrongIdx });
  }

  function reviewItem(i) {
    const q = questions[i];
    const found = findModule(app, q.module);
    const hl = found?.language.highlight;
    return h('article', { class: 'panel review-item' },
      h('span', { class: 'badge danger', text: found ? `${found.language.name} › ${found.module.title}` : q.module }),
      md(q.prompt, { lang: hl }),
      q.type === 'fill' ? h('pre', { class: 'fill-code' }, h('code', { text: q.code })) : null,
      h('div', { class: 'review-answer' }, h('span', { class: 'muted', text: q.type === 'sql' ? 'Sua consulta: ' : 'Sua resposta: ' }), describeResponse(q, answers[i].response)),
      h('div', { class: 'review-answer' }, h('span', { class: 'muted', text: q.type === 'sql' ? 'Uma resposta certa: ' : 'Resposta certa: ' }), describeAnswer(q, hl)),
      md(q.explanation, { lang: hl }),
      lessonLink(q));
  }

  function tally(keyOf) {
    const map = new Map();
    questions.forEach((q, i) => {
      const entry = map.get(keyOf(q)) ?? { ok: 0, total: 0 };
      entry.total += 1;
      if (answers[i].correct) entry.ok += 1;
      map.set(keyOf(q), entry);
    });
    return map;
  }

  const barRow = (label, e) => h('div', { class: 'module-bar' },
    h('div', { class: 'module-bar-label' }, h('span', { text: label }), h('span', { class: 'muted', text: `${e.ok}/${e.total} (${pct(e.ok / e.total)})` })),
    bar(e.ok / e.total, { tone: toneFor(e.ok / e.total), label }));

  function renderResult({ total, correct, durationSec, wrongIdx }) {
    const rate = correct / total;
    const byLang = tally((q) => q.lang);
    const byModule = tally((q) => q.module);
    const retryWrong = () => runQuiz(container, app, {
      ...opts,
      questions: wrongIdx.map((i) => prepareQuestion(questions[i])),
      kind: 'review', mode: 'estudo', title: 'Refazendo as erradas', timer: false, headline: null,
    });
    mount(container, h('section', { class: 'quiz-result' },
      h('div', { class: 'panel center' },
        h('p', { class: 'muted', text: title }),
        h('div', { class: 'big-score', text: `${correct}/${total}` }),
        h('p', { text: `${pct(rate)} de acerto · ${formatDuration(durationSec)}` }),
        headline ? h('p', { class: 'headline', text: headline(rate) }) : null),
      byLang.size > 1 ? [
        h('h2', { text: 'Desempenho por linguagem' }),
        h('div', { class: 'panel' }, [...byLang].map(([lang, e]) => barRow(app.getLanguage(lang)?.name ?? lang, e))),
      ] : null,
      h('h2', { text: 'Desempenho por módulo' }),
      h('div', { class: 'panel' }, [...byModule].map(([key, e]) => {
        const found = findModule(app, key);
        return barRow(found ? `${found.language.name} › ${found.module.title}` : key, e);
      })),
      wrongIdx.length ? h('h2', { text: 'Revise o que você errou' }) : h('p', { class: 'panel center', text: '🏆 Nenhum erro. Mandou bem!' }),
      wrongIdx.map(reviewItem),
      h('div', { class: 'actions' },
        wrongIdx.length ? h('button', { type: 'button', class: 'btn btn-primary', onClick: retryWrong, text: 'Refazer só as erradas' }) : null,
        wrongIdx.length ? h('a', { class: 'btn', href: '#/flashcards?modo=erros', text: 'Treinar erros nos flashcards' }) : null,
        resultActions.map((a) => (a.href
          ? h('a', { class: 'btn btn-ghost', href: a.href, text: a.label })
          : h('button', { type: 'button', class: 'btn btn-ghost', onClick: a.onClick, text: a.label }))))));
    app.layout.announce(`Quiz concluído: ${correct} de ${total}.`);
  }

  showQuestion();
}
```

Substitua o conteúdo de `js/ui/views/practice.js` por:
```js
import { loadModuleBank } from '../../data/content.js';
import { selectQuestions, prepareQuestion } from '../../core/quiz.js';
import { PRACTICE_QUESTIONS } from '../../core/progress.js';
import { runQuiz } from '../components/quiz-runner.js';
import { usableQuestions, hasSqlQuestions } from '../sql-service.js';
import { renderNotFound } from './not-found.js';

export async function renderPractice(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  const module = language?.modules.find((m) => m.id === route.params.module);
  if (!module) return renderNotFound(container);
  const bank = await loadModuleBank(language, module);
  const pool = hasSqlQuestions(bank.questions) ? await usableQuestions(app, bank.questions) : bank.questions;
  const state = app.store.get();
  const { questions } = selectQuestions({
    pool,
    count: PRACTICE_QUESTIONS,
    filters: { moduleKeys: [module.key] },
    questionStats: state.questions,
    lastQuizIds: state.lastQuizIds,
    today: app.ctx().today,
  });
  runQuiz(container, app, {
    questions: questions.map((q) => prepareQuestion(q)),
    mode: 'estudo',
    kind: 'practice',
    title: `Prática: ${module.title}`,
    language,
    moduleId: module.id,
    scopeLabel: `${language.name} › ${module.title}`,
    moduleKeys: [module.key],
    resultActions: [
      { label: 'Nova prática', onClick: () => app.refresh() },
      { label: `Voltar para ${language.name}`, href: `#/${language.id}` },
    ],
  });
}
```

Substitua o conteúdo de `js/ui/views/exam.js` por:
```js
import { h, mount, pct, formatDay } from '../dom.js';
import { loadBanks } from '../../data/content.js';
import { selectQuestions, prepareQuestion } from '../../core/quiz.js';
import { EXAM_QUESTIONS, EXAM_PASS } from '../../core/progress.js';
import { runQuiz } from '../components/quiz-runner.js';
import { usableQuestions, hasSqlQuestions } from '../sql-service.js';
import { renderNotFound } from './not-found.js';

export async function renderExam(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  if (!language) return renderNotFound(container);
  const bank = await loadBanks([language]);
  const best = app.store.get().exams[language.id];
  const count = Math.min(EXAM_QUESTIONS, bank.questions.length);
  const moduleKeys = language.modules.map((m) => m.key);

  const start = async () => {
    // Sem o banco de SQL, as vagas das perguntas sql vão para outros tipos (a prova mantém o tamanho).
    const pool = hasSqlQuestions(bank.questions) ? await usableQuestions(app, bank.questions) : bank.questions;
    // Sem histórico nem "último quiz": a prova sorteia todas as perguntas com o mesmo peso.
    const { questions } = selectQuestions({ pool, count: EXAM_QUESTIONS, filters: { moduleKeys }, today: app.ctx().today });
    runQuiz(container, app, {
      questions: questions.map((q) => prepareQuestion(q)),
      mode: 'simulado',
      kind: 'exam',
      timer: true,
      title: `Prova de ${language.name}`,
      language,
      scopeLabel: `${language.name} inteiro`,
      moduleKeys,
      headline: (rate) => (rate >= EXAM_PASS
        ? '🎉 Você passou na prova!'
        : `Ainda não foi dessa vez: são necessários ${pct(EXAM_PASS)}. Revise os pontos fracos e tente de novo.`),
      resultActions: [{ label: `Voltar para ${language.name}`, href: `#/${language.id}` }],
    });
  };

  mount(container, h('section', { class: 'panel exam-intro', style: { '--accent': language.color } },
    h('h1', { text: `🎯 Prova de ${language.name}` }),
    h('ul', {},
      h('li', { text: `${count} perguntas de todos os módulos` }),
      h('li', { text: 'Correção só no final (modo simulado)' }),
      h('li', { text: `Aprovação com ${pct(EXAM_PASS)} ou mais` }),
      h('li', { text: 'O tempo aparece na tela, mas não há limite' })),
    best ? h('p', { text: `Sua melhor nota: ${pct(best.best)}${best.passedAt ? ` · prova aprovada em ${formatDay(best.passedAt)}` : ''}` }) : null,
    h('button', { type: 'button', class: 'btn btn-primary', onClick: start, text: 'Começar a prova' })));
}
```

Substitua o conteúdo de `js/ui/views/quiz-builder.js` por:
```js
import { h, mount, plural } from '../dom.js';
import { loadBanks } from '../../data/content.js';
import { filterPool, selectQuestions, prepareQuestion, pickExisting } from '../../core/quiz.js';
import { createScopeTree, describeScope } from '../components/scope-tree.js';
import { runQuiz } from '../components/quiz-runner.js';
import { usableQuestions, hasSqlQuestions } from '../sql-service.js';

const COUNTS = [10, 20, 30, 50];
const DIFFICULTIES = [[1, 'Fácil'], [2, 'Médio'], [3, 'Difícil']];
const TYPES = [['multiple', 'Múltipla escolha'], ['truefalse', 'Verdadeiro ou falso'], ['fill', 'Lacuna'], ['order', 'Ordenar linhas']];
const SQL_TYPE = ['sql', 'Escrever SQL'];

const fieldset = (legend, ...children) => h('fieldset', { class: 'field' }, h('legend', { text: legend }), children);

function checkbox(label, checked, onChange) {
  const input = h('input', { type: 'checkbox' });
  input.checked = checked;
  input.addEventListener('change', () => onChange(input.checked));
  return h('label', { class: 'check' }, input, ` ${label}`);
}

function radioGroup(name, options, current, onChange) {
  return h('div', { class: 'radio-group' }, options.map(([value, label]) => {
    const input = h('input', { type: 'radio', name });
    input.checked = value === current;
    input.addEventListener('change', () => { if (input.checked) onChange(value); });
    return h('label', { class: 'check' }, input, ` ${label}`);
  }));
}

const toggle = (set, value, on) => (on ? set.add(value) : set.delete(value));

async function retake(container, app, bank, historyId) {
  const entry = app.store.get().history.find((e) => e.id === historyId);
  const found = entry ? pickExisting(entry.wrongIds, bank.questions) : [];
  const questions = hasSqlQuestions(found) ? await usableQuestions(app, found) : found;
  if (!questions.length) {
    mount(container, h('section', { class: 'panel' },
      h('h1', { text: 'Nada para refazer' }),
      h('p', { text: 'Não encontramos as perguntas desse quiz. Elas podem ter sido removidas do conteúdo.' }),
      h('a', { class: 'btn', href: '#/quiz', text: 'Montar um quiz' })));
    return;
  }
  runQuiz(container, app, {
    questions: questions.map((q) => prepareQuestion(q)),
    mode: 'estudo', kind: 'review', title: 'Refazendo as erradas',
    scopeLabel: entry.scopeLabel, moduleKeys: entry.moduleKeys ?? [],
    resultActions: [{ label: 'Ver histórico', href: '#/perfil' }],
  });
}

export async function renderQuizBuilder(container, app, route) {
  const bank = await loadBanks(app.languages);
  if (route.query.refazer) return retake(container, app, bank, route.query.refazer);
  const state = app.store.get();
  const preset = route.query.modulo ? [route.query.modulo] : null;
  const tree = createScopeTree(app, { state, selected: preset });
  // "Escrever SQL" só existe se alguma linguagem tem perguntas sql, e só aparece quando o escopo tem alguma.
  const types = bank.questions.some((q) => q.type === 'sql') ? [...TYPES, SQL_TYPE] : TYPES;
  const choice = {
    count: 10,
    difficulties: new Set([1, 2, 3]),
    types: new Set(types.map(([t]) => t)),
    mode: 'estudo',
    timer: false,
    focusWeak: route.query.foco === '1',
  };
  const filters = () => ({ moduleKeys: tree.getSelected(), difficulties: [...choice.difficulties], types: [...choice.types] });
  const available = h('p', { class: 'muted', 'aria-live': 'polite' });
  const startBtn = h('button', { type: 'submit', class: 'btn btn-primary', text: 'Começar quiz' });
  const timerBox = checkbox('Mostrar cronômetro', choice.timer, (on) => { choice.timer = on; });
  const timerInput = timerBox.querySelector('input');
  timerInput.disabled = true;

  const typeBoxes = types.map(([v, label]) => {
    const box = checkbox(label, true, (on) => { toggle(choice.types, v, on); updateAvailable(); });
    box.dataset.type = v;
    return box;
  });
  const sqlBox = typeBoxes.find((box) => box.dataset.type === 'sql');

  function updateAvailable() {
    if (sqlBox) sqlBox.hidden = !filterPool(bank.questions, { moduleKeys: tree.getSelected() }).some((q) => q.type === 'sql');
    const n = filterPool(bank.questions, filters()).length;
    available.textContent = `${n} ${plural(n, 'pergunta disponível', 'perguntas disponíveis')} com esses filtros.`;
    startBtn.disabled = n === 0;
  }
  tree.onChange(updateAvailable);

  const form = h('form', { class: 'quiz-builder' },
    h('h1', { text: '🎯 Monte seu quiz' }),
    fieldset('Escopo', tree.el),
    fieldset('Quantidade', radioGroup('quantidade', COUNTS.map((n) => [n, `${n} perguntas`]), choice.count, (v) => { choice.count = v; })),
    fieldset('Dificuldade', DIFFICULTIES.map(([v, label]) => checkbox(label, true, (on) => { toggle(choice.difficulties, v, on); updateAvailable(); }))),
    fieldset('Tipos de pergunta', typeBoxes),
    fieldset('Modo',
      radioGroup('modo', [['estudo', 'Estudo: correção a cada pergunta'], ['simulado', 'Simulado: correção só no final']], choice.mode, (v) => {
        choice.mode = v;
        timerInput.disabled = v !== 'simulado';
      }),
      timerBox),
    fieldset('Preferência', checkbox('Focar nos meus pontos fracos', choice.focusWeak, (on) => { choice.focusWeak = on; })),
    available,
    startBtn);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const eligible = filterPool(bank.questions, filters());
    const pool = hasSqlQuestions(eligible) ? await usableQuestions(app, eligible) : eligible;
    const s = app.store.get();
    const { questions, available: n } = selectQuestions({
      pool,
      count: choice.count,
      filters: filters(),
      questionStats: s.questions,
      lastQuizIds: s.lastQuizIds,
      focusWeak: choice.focusWeak,
      today: app.ctx().today,
    });
    if (!questions.length) return;
    if (n < choice.count) app.layout.toast(`Só havia ${n} ${plural(n, 'pergunta', 'perguntas')} com esses filtros; o quiz vai usar todas.`);
    const keys = tree.getSelected();
    runQuiz(container, app, {
      questions: questions.map((q) => prepareQuestion(q)),
      mode: choice.mode,
      kind: 'quiz',
      timer: choice.mode === 'simulado' && choice.timer,
      title: 'Quiz personalizado',
      scopeLabel: describeScope(app, keys),
      moduleKeys: keys,
      resultActions: [{ label: 'Montar outro quiz', onClick: () => app.go('#/quiz') }],
    });
  });

  mount(container, form);
  updateAvailable();
}
```

Substitua o conteúdo de `js/ui/views/lesson.js` por:
```js
import { h, mount, formatDay } from '../dom.js';
import { md } from '../markdown.js';
import { loadLesson, loadModuleBank, loadChallenges } from '../../data/content.js';
import { createSqlExercise } from '../components/sql-exercise.js';
import { lessonKey } from '../../core/progress.js';
import { openLesson, completeLesson } from '../../core/actions.js';
import { renderNotFound } from './not-found.js';

export async function renderLesson(container, app, route) {
  const { lang, module: moduleId, lesson: lessonId } = route.params;
  const language = app.getLanguage(lang);
  const module = language?.modules.find((m) => m.id === moduleId);
  const index = module ? module.lessons.findIndex((l) => l.id === lessonId) : -1;
  if (index < 0) return renderNotFound(container);
  const lesson = module.lessons[index];
  const key = lessonKey(lang, moduleId, lessonId);
  const [text, allChallenges] = await Promise.all([loadLesson(language, module, lesson), loadChallenges(language, module)]);
  const challenges = allChallenges.filter((c) => c.lesson === lessonId);
  app.dispatch(openLesson, { key });
  const prev = module.lessons[index - 1];
  const next = module.lessons[index + 1];

  function footer() {
    const doneAt = app.store.get().lessons[key]?.doneAt;
    return h('footer', { class: 'lesson-foot' },
      prev ? h('a', { class: 'btn btn-ghost', href: `#/${lang}/${moduleId}/${prev.id}`, text: `← ${prev.title}` }) : h('span'),
      doneAt
        ? h('span', { class: 'badge success', text: `✓ Concluída em ${formatDay(doneAt)}` })
        : h('button', { type: 'button', class: 'btn btn-primary', onClick: complete, text: 'Concluir aula' }),
      next
        ? h('a', { class: 'btn', href: `#/${lang}/${moduleId}/${next.id}`, text: `${next.title} →` })
        : h('a', { class: 'btn', href: `#/${lang}/${moduleId}/pratica`, text: 'Praticar o módulo →' }));
  }

  let foot = footer();
  async function complete() {
    const bank = await loadModuleBank(language, module);
    const events = app.dispatch(completeLesson, { language, moduleId, lessonId, cards: bank.cards });
    app.layout.toast(`Aula concluída! +${events.xpGained} XP`, { tone: 'success' });
    const fresh = footer();
    foot.replaceWith(fresh);
    foot = fresh;
  }

  mount(container, h('article', { class: 'lesson', style: { '--accent': language.color } },
    h('nav', { class: 'breadcrumb', 'aria-label': 'Você está em' },
      h('a', { href: `#/${lang}`, text: `${language.icon} ${language.name}` }), ` › ${module.title}`),
    h('p', { class: 'eyebrow', text: `Aula ${index + 1} de ${module.lessons.length} · ${lesson.minutes} min` }),
    md(text, { lang: language.highlight }),
    challenges.length ? h('section', { class: 'challenges' },
      h('h2', { text: 'Experimente' }),
      challenges.map((c, i) => createSqlExercise(c, {
        service: app.sql, lang: language.highlight, mode: 'challenge', title: challenges.length > 1 ? `Desafio ${i + 1}` : null,
      }).el)) : null,
    foot));
}
```

- [ ] **Step 3: Rodar e ver passar**

Run: `node --test tests/ui/sql-views.test.js`
Expected: PASS (8 testes).

Run: `npm test`
Expected: PASS. Os testes de Java (quiz, prova e prática) continuam passando sem mudança, porque sem `sql` tudo começa na hora.

- [ ] **Step 4: Commit**

```bash
git add js/ui tests/ui/sql-views.test.js
git commit -m "Perguntas sql no quiz, na prática e na prova; desafios no fim das aulas" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Validador e conferência do conteúdo de SQL

**Files:**
- Create: `tools/verify-sql-format.mjs`, `tests/tools/verify-sql-format.test.js`, `tests/sql-snippets.test.js`, `tests/content-sql.test.js`
- Modify: `tests/content.test.js`, `tests/meta/exports-covered.test.js`

**Interfaces:**
- Consumes: `nodeRun` (Task 1), `runQuery` e `gradeSql` (Task 2).
- Produces:
  - `parseTable`, `parseSqlSnippet`, `formatCell`, `formatTable`, `judgeSqlSnippet` e `listSqlFiles` (`tools/verify-sql-format.mjs`).
  - No validador, `validateSqlFields`, `validateChallenge` e `readDatasets`, com as regras da seção 8.2 da especificação de SQL.
  - Os testes `sql-snippets` e `content-sql` rodam sozinhos quando o conteúdo de SQL existir. Enquanto não existe, não registram nenhum teste.

- [ ] **Step 1: Testes do formato dos trechos (falhando)**

`tests/tools/verify-sql-format.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { tmpdir } from 'node:os';
import {
  parseTable, parseSqlSnippet, formatCell, formatTable, judgeSqlSnippet, listSqlFiles,
} from '../../tools/verify-sql-format.mjs';

test('parseTable lê os nomes das colunas e as linhas, sem os espaços em volta', () => {
  assert.deepEqual(parseTable(['nome | nota', 'Ana  | 9.5', 'Bia  | NULL']), { columns: ['nome', 'nota'], rows: [['Ana', '9.5'], ['Bia', 'NULL']] });
  assert.deepEqual(parseTable(['nome']), { columns: ['nome'], rows: [] });
});

test('parseSqlSnippet entende banco, saída esperada e o SQL depois do cabeçalho', () => {
  const src = '-- verifica: a aula where\r\n-- banco: escola\r\n-- saida:\r\n-- nome | nota\r\n-- Ana  | 9.5\r\nSELECT nome, nota\r\nFROM alunos;\r\n';
  assert.deepEqual(parseSqlSnippet(src), {
    bank: { dataset: 'escola', hidden: false },
    sql: 'SELECT nome, nota\nFROM alunos;',
    expect: { kind: 'table', columns: ['nome', 'nota'], rows: [['Ana', '9.5']] },
  });
  assert.deepEqual(parseSqlSnippet('-- banco: dados-ocultos:escola\n-- saida:\n-- n\nSELECT 1 AS n;').bank, { dataset: 'escola', hidden: true });
  assert.equal(parseSqlSnippet('-- banco: vazio\n-- saida:\n-- n\nSELECT 1 AS n;').bank, null);
});

test('parseSqlSnippet: uma linha em branco separa o cabeçalho de um SQL que começa com comentário', () => {
  const src = '-- banco: vazio\n-- saida:\n-- n\n\n-- comentário do exemplo\nSELECT 1 AS n;';
  const snippet = parseSqlSnippet(src);
  assert.deepEqual(snippet.expect.rows, []);
  assert.equal(snippet.sql, '-- comentário do exemplo\nSELECT 1 AS n;');
});

test('parseSqlSnippet entende erro esperado, com ou sem texto', () => {
  assert.deepEqual(parseSqlSnippet('-- banco: vazio\n-- espera: erro no such table: x\nSELECT * FROM x;').expect, { kind: 'error', contains: 'no such table: x' });
  assert.deepEqual(parseSqlSnippet('-- banco: vazio\n-- espera: erro\nSELEC 1;').expect, { kind: 'error', contains: null });
});

test('parseSqlSnippet recusa cabeçalhos incompletos', () => {
  assert.throws(() => parseSqlSnippet('-- saida:\n-- n\nSELECT 1;'), /sem "-- banco:"/);
  assert.throws(() => parseSqlSnippet('-- banco: Escola\n-- saida:\n-- n\nSELECT 1;'), /"-- banco:" inválido/);
  assert.throws(() => parseSqlSnippet('-- banco: vazio\n-- saida:\n-- n\n'), /sem SQL/);
  assert.throws(() => parseSqlSnippet('-- banco: vazio\nSELECT 1;'), /sem "-- saida:" nem "-- espera:"/);
  assert.throws(() => parseSqlSnippet('-- banco: vazio\n-- espera: talvez\nSELECT 1;'), /"-- espera:" desconhecido/);
  assert.throws(() => parseSqlSnippet('-- banco: vazio\n-- saida:\nSELECT 1;'), /sem a linha dos nomes/);
});

test('formatCell e formatTable escrevem como no cabeçalho', () => {
  assert.equal(formatCell(null), 'NULL');
  assert.equal(formatCell(9.5), '9.5');
  assert.equal(formatCell(7), '7');
  assert.equal(formatCell('Ana'), 'Ana');
  assert.equal(formatTable({ columns: ['a', 'b'], rows: [['1', 'NULL']] }), 'a | b\n1 | NULL');
});

test('judgeSqlSnippet compara a tabela e o erro', () => {
  const table = { kind: 'table', columns: ['nome', 'nota'], rows: [['Ana', '9.5'], ['Davi', 'NULL']] };
  assert.equal(judgeSqlSnippet(table, { result: { columns: ['nome', 'nota'], values: [['Ana', 9.5], ['Davi', null]] } }), null);
  assert.match(judgeSqlSnippet(table, { result: { columns: ['nome', 'nota'], values: [['Ana', 9.5]] } }), /resultado diferente/);
  assert.match(judgeSqlSnippet(table, { error: 'no such column: nme' }), /a consulta deu erro: no such column: nme/);
  assert.match(judgeSqlSnippet(table, { result: null }), /não devolveu uma tabela/);
  const err = { kind: 'error', contains: 'no such table' };
  assert.equal(judgeSqlSnippet(err, { error: 'no such table: x' }), null);
  assert.match(judgeSqlSnippet(err, { error: 'incomplete input' }), /não contém "no such table"/);
  assert.match(judgeSqlSnippet(err, { result: { columns: ['x'], values: [] } }), /esperava um erro/);
  assert.equal(judgeSqlSnippet({ kind: 'error', contains: null }, { error: 'qualquer' }), null);
});

test('listSqlFiles acha .sql em subpastas e aceita pasta inexistente', () => {
  const dir = mkdtempSync(join(tmpdir(), 'verify-sql-'));
  try {
    mkdirSync(join(dir, 'consultas'));
    writeFileSync(join(dir, 'consultas', 'a.sql'), '');
    writeFileSync(join(dir, 'b.sql'), '');
    writeFileSync(join(dir, 'leia-me.txt'), '');
    assert.deepEqual(listSqlFiles(dir).map((f) => basename(f)).sort(), ['a.sql', 'b.sql']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.deepEqual(listSqlFiles(join(tmpdir(), 'nao-existe-mesmo')), []);
});
```

Run: `node --test tests/tools/verify-sql-format.test.js`
Expected: FAIL, porque o módulo `tools/verify-sql-format.mjs` não existe.

- [ ] **Step 2: Implementar o formato**

`tools/verify-sql-format.mjs`:
```js
// Lógica pura da conferência dos trechos SQL (verify/sql), testada em tests/tools/verify-sql-format.test.js.
// Cabeçalho, em comentários "--" no início do arquivo:
//   -- verifica: o que o trecho prova
//   -- banco: escola | vazio | dados-ocultos:escola
//   -- espera: erro <texto que a mensagem contém>      (ou, no lugar do "espera":)
//   -- saida:                                          (sempre a última diretiva)
//   -- coluna1 | coluna2                               (primeira linha: os nomes das colunas)
//   -- valor   | NULL                                  (valores separados por |; nomes e valores sem |)
// O cabeçalho termina na primeira linha que não começa com "--". Se o SQL começa com um comentário,
// deixe uma linha em branco entre o cabeçalho e o SQL.
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function parseTable(lines) {
  const [columns = [], ...rows] = lines.map((line) => line.split('|').map((cell) => cell.trim()));
  return { columns, rows };
}

export function parseSqlSnippet(source) {
  const lines = source.split(/\r?\n/);
  const header = [];
  for (const line of lines) {
    if (!line.startsWith('--')) break;
    header.push(line);
  }
  const directive = (prefix) => header.find((l) => l.startsWith(prefix))?.slice(prefix.length).trim();
  const bankText = directive('-- banco:');
  if (bankText === undefined) throw new Error('cabeçalho sem "-- banco:"');
  let bank = null;
  if (bankText !== 'vazio') {
    const m = /^(dados-ocultos:)?([a-z0-9-]+)$/.exec(bankText);
    if (!m) throw new Error(`"-- banco:" inválido: ${bankText}`);
    bank = { dataset: m[2], hidden: Boolean(m[1]) };
  }
  const sql = lines.slice(header.length).join('\n').trim();
  if (!sql) throw new Error('trecho sem SQL depois do cabeçalho');
  const expect = directive('-- espera:');
  if (expect !== undefined) {
    const m = /^erro(?:\s+(.+))?$/.exec(expect);
    if (!m) throw new Error(`"-- espera:" desconhecido: ${expect}`);
    return { bank, sql, expect: { kind: 'error', contains: m[1] ?? null } };
  }
  const start = header.findIndex((l) => l.trim() === '-- saida:');
  if (start < 0) throw new Error('cabeçalho sem "-- saida:" nem "-- espera:"');
  const tableLines = header.slice(start + 1).map((l) => l.replace(/^-- ?/, ''));
  if (!tableLines.length) throw new Error('"-- saida:" sem a linha dos nomes das colunas');
  return { bank, sql, expect: { kind: 'table', ...parseTable(tableLines) } };
}

export function formatCell(value) {
  return value === null ? 'NULL' : String(value);
}

export function formatTable({ columns, rows }) {
  return [columns, ...rows].map((row) => row.join(' | ')).join('\n');
}

// outcome = { result } ou { error }, como o runQuery de core/sql-grading. Devolve null se bateu.
export function judgeSqlSnippet(expect, outcome) {
  if (expect.kind === 'error') {
    if (!outcome.error) return 'esperava um erro, mas a consulta rodou';
    return expect.contains && !outcome.error.includes(expect.contains) ? `o erro não contém "${expect.contains}": ${outcome.error}` : null;
  }
  if (outcome.error) return `a consulta deu erro: ${outcome.error}`;
  if (!outcome.result) return 'a consulta não devolveu uma tabela';
  const got = { columns: outcome.result.columns.map(String), rows: outcome.result.values.map((row) => row.map(formatCell)) };
  const want = { columns: expect.columns, rows: expect.rows };
  return JSON.stringify(got) === JSON.stringify(want) ? null : `resultado diferente.\nEsperado:\n${formatTable(want)}\nObtido:\n${formatTable(got)}`;
}

export function listSqlFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return listSqlFiles(p);
    return name.endsWith('.sql') ? [p] : [];
  });
}
```

Run: `node --test tests/tools/verify-sql-format.test.js`
Expected: PASS (8 testes).

- [ ] **Step 3: Autotestes do validador (falhando)**

Acrescente ao fim de `tests/content.test.js`:

```js
test('o validador cuida das perguntas sql e dos desafios', () => {
  const sqlQ = {
    id: 'sql.cons.q01', type: 'sql', difficulty: 1, lesson: 'a', prompt: 'p', explanation: 'e',
    dataset: 'escola', answer: 'SELECT 1', rejected: ['SELECT 2'],
  };
  const base = { lang: 'sql', module: 'cons', lessons: new Set(['a']), file: 'x.json', datasets: new Set(['escola']) };
  const run = (fn, item, ctx) => {
    const errors = [];
    fn(item, { ids: new Set(), ...ctx }, errors);
    return errors.join('\n');
  };
  assert.equal(run(validateQuestion, sqlQ, { ...base, engine: 'sqlite' }), '');
  assert.match(run(validateQuestion, sqlQ, { ...base, engine: undefined }), /o tipo "sql" só vale em linguagem com "engine": "sqlite"/);
  const bad = run(validateQuestion, {
    ...sqlQ, dataset: 'loja', answer: ' ', ordered: 'sim', check: '', accepted: [1], rejected: [],
  }, { ...base, engine: 'sqlite' });
  for (const trecho of ['conjunto de tabelas inexistente: loja', 'answer (a consulta de referência) vazio', 'ordered deve ser booleano',
    'check deve ser uma consulta', 'accepted deve ser uma lista de consultas', 'rejected precisa de pelo menos uma consulta errada']) {
    assert.ok(bad.includes(trecho), `deveria acusar: ${trecho}`);
  }
  const challenge = { id: 'sql.cons.d01', lesson: 'a', prompt: 'p', explanation: 'e', dataset: 'escola', answer: 'SELECT 1', rejected: ['SELECT 2'] };
  assert.equal(run(validateChallenge, challenge, base), '');
  assert.match(run(validateChallenge, { ...challenge, id: 'sql.cons.q01', lesson: 'z', explanation: '' }, base),
    /id deve seguir sql\.cons\.dNN[\s\S]*aula inexistente: z[\s\S]*explanation vazia/);
});

test('readDatasets aceita pastas com os três arquivos e acusa as incompletas', () => {
  const ok = readDatasets(fileURLToPath(new URL('fixtures/sql-ui/content/sql/datasets/', import.meta.url)));
  assert.deepEqual([...ok.datasets], ['pessoas']);
  assert.deepEqual(ok.errors, []);
  const dir = mkdtempSync(join(tmpdir(), 'datasets-'));
  try {
    mkdirSync(join(dir, 'Loja'));
    writeFileSync(join(dir, 'Loja', 'schema.sql'), '');
    const bad = readDatasets(dir);
    assert.deepEqual(bad.errors, ['datasets/Loja: nome inválido', 'datasets/Loja: faltam data.sql, hidden-data.sql']);
    assert.equal(bad.datasets.size, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.deepEqual(readDatasets(join(tmpdir(), 'nao-existe-mesmo')), { datasets: new Set(), errors: [] });
});
```

Run: `node --test tests/content.test.js`
Expected: FAIL com `ReferenceError` (`validateChallenge`, `readDatasets` e os imports usados nesses testes ainda não existem).

- [ ] **Step 4: Implementar as regras novas do validador**

Substitua o conteúdo de `tests/content.test.js` por:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { countBlanks } from '../js/core/grading.js';
import { ACHIEVEMENT_IDS } from '../js/core/achievements.js';
import { RESERVED_ROUTES } from '../js/router.js';

const ROOT = new URL('../content/', import.meta.url);
const exists = (rel) => existsSync(new URL(rel, ROOT));
const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, ROOT), 'utf8'));

const TYPES = new Set(['multiple', 'truefalse', 'fill', 'order']);
const ENGINES = new Set(['sqlite']);
const DATASET_FILES = ['schema.sql', 'data.sql', 'hidden-data.sql'];
const BANNED_OPTION = /todas as (anteriores|alternativas)|nenhuma das (anteriores|alternativas)/i;
const ID_PART = /^[a-z0-9-]+$/;
const MIN_QUESTIONS = 12;
const MIN_TYPES = 3;
const MIN_CARDS = 8;
const MIN_SQL_QUESTIONS = 3;
const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

// Campos dos exercícios de SQL (perguntas "sql" e desafios): especificação de SQL, seções 4.3 e 4.4.
export function validateSqlFields(item, ctx, err) {
  if (!ctx.datasets?.has(item.dataset)) err(`conjunto de tabelas inexistente: ${item.dataset}`);
  if (!nonEmpty(item.answer)) err('answer (a consulta de referência) vazio');
  for (const flag of ['ordered', 'columnNames']) {
    if (item[flag] !== undefined && typeof item[flag] !== 'boolean') err(`${flag} deve ser booleano`);
  }
  if (item.check !== undefined && !nonEmpty(item.check)) err('check deve ser uma consulta');
  if (item.accepted !== undefined && !(Array.isArray(item.accepted) && item.accepted.every(nonEmpty))) err('accepted deve ser uma lista de consultas');
  if (!Array.isArray(item.rejected) || item.rejected.length === 0 || !item.rejected.every(nonEmpty)) {
    err('rejected precisa de pelo menos uma consulta errada');
  }
}

export function validateQuestion(q, ctx, errors) {
  const err = (msg) => errors.push(`${ctx.file} → ${q.id ?? '(sem id)'}: ${msg}`);
  if (!new RegExp(`^${ctx.lang}\\.${ctx.module}\\.q\\d{2,}$`).test(q.id ?? '')) err(`id deve seguir ${ctx.lang}.${ctx.module}.qNN`);
  if (ctx.ids.has(q.id)) err('id repetido');
  ctx.ids.add(q.id);
  if (q.type === 'code') err('o tipo "code" é da Fase 2 e ainda não é aceito');
  else if (q.type === 'sql') {
    if (ctx.engine !== 'sqlite') err('o tipo "sql" só vale em linguagem com "engine": "sqlite"');
  } else if (!TYPES.has(q.type)) err(`tipo inválido: ${q.type}`);
  if (![1, 2, 3].includes(q.difficulty)) err('difficulty deve ser 1, 2 ou 3');
  if (!ctx.lessons.has(q.lesson)) err(`aula inexistente: ${q.lesson}`);
  if (!nonEmpty(q.prompt)) err('prompt vazio');
  if (!nonEmpty(q.explanation)) err('explanation vazia');
  if (q.type === 'multiple') {
    if (!Array.isArray(q.options) || q.options.length < 3 || q.options.length > 5) err('multiple precisa de 3 a 5 opções');
    else {
      if (!q.options.every(nonEmpty)) err('opção vazia');
      if (new Set(q.options).size !== q.options.length) err('opções repetidas');
      if (q.options.some((o) => BANNED_OPTION.test(o))) err('opção proibida (todas/nenhuma das anteriores)');
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) err('answer fora da faixa');
    }
  }
  if (q.type === 'truefalse' && typeof q.answer !== 'boolean') err('answer deve ser true ou false');
  if (q.type === 'fill') {
    if (!nonEmpty(q.code)) err('fill precisa de code');
    else if (!Array.isArray(q.blanks) || countBlanks(q.code) !== q.blanks.length) err('número de ___ diferente do tamanho de blanks');
    else if (!q.blanks.every((b) => Array.isArray(b) && b.length > 0 && b.every(nonEmpty))) err('blanks precisa de respostas não vazias');
    if (q.caseInsensitive !== undefined && typeof q.caseInsensitive !== 'boolean') err('caseInsensitive deve ser booleano');
  }
  if (q.type === 'order' && (!Array.isArray(q.lines) || q.lines.length < 3 || !q.lines.every(nonEmpty))) {
    err('order precisa de pelo menos 3 linhas não vazias');
  }
  if (q.type === 'sql') validateSqlFields(q, ctx, err);
}

export function validateChallenge(c, ctx, errors) {
  const err = (msg) => errors.push(`${ctx.file} → ${c.id ?? '(sem id)'}: ${msg}`);
  if (!new RegExp(`^${ctx.lang}\\.${ctx.module}\\.d\\d{2,}$`).test(c.id ?? '')) err(`id deve seguir ${ctx.lang}.${ctx.module}.dNN`);
  if (ctx.ids.has(c.id)) err('id repetido');
  ctx.ids.add(c.id);
  if (!ctx.lessons.has(c.lesson)) err(`aula inexistente: ${c.lesson}`);
  if (!nonEmpty(c.prompt)) err('prompt vazio');
  if (!nonEmpty(c.explanation)) err('explanation vazia');
  validateSqlFields(c, ctx, err);
}

export function validateCard(c, ctx, errors) {
  const err = (msg) => errors.push(`${ctx.file} → ${c.id ?? '(sem id)'}: ${msg}`);
  if (!new RegExp(`^${ctx.lang}\\.${ctx.module}\\.f\\d{2,}$`).test(c.id ?? '')) err(`id deve seguir ${ctx.lang}.${ctx.module}.fNN`);
  if (ctx.ids.has(c.id)) err('id repetido');
  ctx.ids.add(c.id);
  if (!ctx.lessons.has(c.lesson)) err(`aula inexistente: ${c.lesson}`);
  if (!nonEmpty(c.front) || !nonEmpty(c.back)) err('front/back vazios');
}

// Aulas que não aparecem em nenhum item da lista (perguntas ou desafios).
export function lessonsWithoutQuestions(lessonIds, items) {
  const used = new Set(items.map((q) => q.lesson));
  return lessonIds.filter((id) => !used.has(id));
}

// Conjuntos de tabelas de uma linguagem: cada pasta de datasets/ precisa dos três arquivos.
export function readDatasets(dir) {
  const datasets = new Set();
  const errors = [];
  if (!existsSync(dir)) return { datasets, errors };
  for (const name of readdirSync(dir)) {
    if (!statSync(join(dir, name)).isDirectory()) continue;
    if (!ID_PART.test(name)) errors.push(`datasets/${name}: nome inválido`);
    const missing = DATASET_FILES.filter((f) => !existsSync(join(dir, name, f)));
    if (missing.length) errors.push(`datasets/${name}: faltam ${missing.join(', ')}`);
    else datasets.add(name);
  }
  return { datasets, errors };
}

function validateLanguage(entry, ids, errors) {
  const base = `${entry.dir}/`;
  if (!exists(`${base}language.json`)) {
    errors.push(`${base}language.json não existe`);
    return;
  }
  const lang = readJson(`${base}language.json`);
  const err = (msg) => errors.push(`${base}language.json: ${msg}`);
  if (lang.id !== entry.id) err(`id "${lang.id}" diferente do catálogo "${entry.id}"`);
  if (RESERVED_ROUTES.has(lang.id) || !ID_PART.test(lang.id ?? '')) err('id reservado ou inválido');
  for (const f of ['name', 'color', 'icon', 'highlight', 'reference']) if (!nonEmpty(lang[f])) err(`campo ${f} ausente`);
  if (nonEmpty(lang.reference) && !exists(base + lang.reference)) err(`referência ${lang.reference} não existe`);
  if (lang.engine !== undefined && !ENGINES.has(lang.engine)) err(`engine desconhecido: ${lang.engine}`);
  const { datasets, errors: datasetErrors } = readDatasets(fileURLToPath(new URL(`${base}datasets/`, ROOT)));
  datasetErrors.forEach((e) => err(e));
  if (!Array.isArray(lang.modules) || lang.modules.length === 0) {
    err('sem módulos');
    return;
  }
  const moduleIds = new Set();
  for (const m of lang.modules) {
    const mbase = `${base}${m.dir}/`;
    if (!ID_PART.test(m.id ?? '') || moduleIds.has(m.id)) err(`módulo com id inválido ou repetido: ${m.id}`);
    moduleIds.add(m.id);
    if (!nonEmpty(m.title) || !nonEmpty(m.description)) err(`módulo ${m.id} sem título ou descrição`);
    if (!exists(mbase)) {
      err(`pasta ${m.dir} não existe`);
      continue;
    }
    const lessons = new Set();
    for (const l of m.lessons ?? []) {
      if (!ID_PART.test(l.id ?? '') || l.id === 'pratica' || lessons.has(l.id)) err(`aula com id inválido, reservado ou repetido: ${m.id}/${l.id}`);
      lessons.add(l.id);
      if (!nonEmpty(l.title)) err(`aula ${l.id} sem título`);
      if (!Number.isInteger(l.minutes) || l.minutes <= 0) err(`aula ${l.id} com minutes inválido`);
      if (!exists(mbase + l.file)) err(`arquivo ${m.dir}/${l.file} não existe`);
    }
    if (lessons.size === 0) err(`módulo ${m.id} sem aulas`);
    const qFile = `${mbase}questions.json`;
    const cFile = `${mbase}flashcards.json`;
    const dFile = `${mbase}challenges.json`;
    if (!exists(qFile) || !exists(cFile)) {
      err(`módulo ${m.id} sem questions.json ou flashcards.json`);
      continue;
    }
    const ctx = { lang: lang.id, module: m.id, lessons, ids, engine: lang.engine, datasets };
    const questions = readJson(qFile).questions ?? [];
    const cards = readJson(cFile).cards ?? [];
    questions.forEach((q) => validateQuestion(q, { ...ctx, file: qFile }, errors));
    cards.forEach((c) => validateCard(c, { ...ctx, file: cFile }, errors));
    if (questions.length < MIN_QUESTIONS) errors.push(`${qFile}: precisa de pelo menos ${MIN_QUESTIONS} perguntas (tem ${questions.length})`);
    if (new Set(questions.map((q) => q.type)).size < MIN_TYPES) errors.push(`${qFile}: precisa cobrir pelo menos ${MIN_TYPES} tipos de pergunta`);
    if (cards.length < MIN_CARDS) errors.push(`${cFile}: precisa de pelo menos ${MIN_CARDS} cartas (tem ${cards.length})`);
    for (const id of lessonsWithoutQuestions([...lessons], questions)) errors.push(`${qFile}: a aula ${id} não tem nenhuma pergunta`);
    if (!lang.engine) {
      if (exists(dFile)) errors.push(`${dFile}: desafios só existem em linguagem com engine`);
      continue;
    }
    const sqlCount = questions.filter((q) => q.type === 'sql').length;
    if (sqlCount < MIN_SQL_QUESTIONS) errors.push(`${qFile}: precisa de pelo menos ${MIN_SQL_QUESTIONS} perguntas sql (tem ${sqlCount})`);
    if (!exists(dFile)) {
      errors.push(`${dFile}: não existe`);
      continue;
    }
    const challenges = readJson(dFile).challenges ?? [];
    challenges.forEach((c) => validateChallenge(c, { ...ctx, file: dFile }, errors));
    for (const id of lessonsWithoutQuestions([...lessons], challenges)) errors.push(`${dFile}: a aula ${id} não tem nenhum desafio`);
  }
}

test('o validador encontra problemas de propósito', () => {
  const errors = [];
  const ctx = { lang: 'java', module: 'fund', lessons: new Set(['a']), ids: new Set(), file: 'x.json' };
  validateQuestion({ id: 'java.fund.q01', type: 'multiple', difficulty: 1, lesson: 'a', prompt: 'p', explanation: 'e', options: ['1', 'Todas as anteriores', '3'], answer: 0 }, ctx, errors);
  validateQuestion({ id: 'java.fund.q01', type: 'fill', difficulty: 4, lesson: 'z', prompt: 'p', explanation: 'e', code: 'a ___ b ___', blanks: [['x']] }, ctx, errors);
  validateQuestion({ id: 'java.fund.q03', type: 'code', difficulty: 1, lesson: 'a', prompt: 'p', explanation: 'e' }, ctx, errors);
  validateCard({ id: 'java.outro.f01', lesson: 'a', front: 'f', back: '' }, ctx, errors);
  const text = errors.join('\n');
  for (const trecho of ['opção proibida', 'id repetido', 'difficulty', 'aula inexistente', 'número de ___', 'Fase 2', 'fNN', 'front/back']) {
    assert.ok(text.includes(trecho), `deveria acusar: ${trecho}`);
  }
});

test('o validador aponta aulas sem nenhuma pergunta', () => {
  assert.deepEqual(lessonsWithoutQuestions(['a', 'b', 'c'], [{ lesson: 'a' }, { lesson: 'c' }, { lesson: 'a' }]), ['b']);
  assert.deepEqual(lessonsWithoutQuestions(['a'], [{ lesson: 'a' }]), []);
});

test('o validador cuida das perguntas sql e dos desafios', () => {
  const sqlQ = {
    id: 'sql.cons.q01', type: 'sql', difficulty: 1, lesson: 'a', prompt: 'p', explanation: 'e',
    dataset: 'escola', answer: 'SELECT 1', rejected: ['SELECT 2'],
  };
  const base = { lang: 'sql', module: 'cons', lessons: new Set(['a']), file: 'x.json', datasets: new Set(['escola']) };
  const run = (fn, item, ctx) => {
    const errors = [];
    fn(item, { ids: new Set(), ...ctx }, errors);
    return errors.join('\n');
  };
  assert.equal(run(validateQuestion, sqlQ, { ...base, engine: 'sqlite' }), '');
  assert.match(run(validateQuestion, sqlQ, { ...base, engine: undefined }), /o tipo "sql" só vale em linguagem com "engine": "sqlite"/);
  const bad = run(validateQuestion, {
    ...sqlQ, dataset: 'loja', answer: ' ', ordered: 'sim', check: '', accepted: [1], rejected: [],
  }, { ...base, engine: 'sqlite' });
  for (const trecho of ['conjunto de tabelas inexistente: loja', 'answer (a consulta de referência) vazio', 'ordered deve ser booleano',
    'check deve ser uma consulta', 'accepted deve ser uma lista de consultas', 'rejected precisa de pelo menos uma consulta errada']) {
    assert.ok(bad.includes(trecho), `deveria acusar: ${trecho}`);
  }
  const challenge = { id: 'sql.cons.d01', lesson: 'a', prompt: 'p', explanation: 'e', dataset: 'escola', answer: 'SELECT 1', rejected: ['SELECT 2'] };
  assert.equal(run(validateChallenge, challenge, base), '');
  assert.match(run(validateChallenge, { ...challenge, id: 'sql.cons.q01', lesson: 'z', explanation: '' }, base),
    /id deve seguir sql\.cons\.dNN[\s\S]*aula inexistente: z[\s\S]*explanation vazia/);
});

test('readDatasets aceita pastas com os três arquivos e acusa as incompletas', () => {
  const ok = readDatasets(fileURLToPath(new URL('fixtures/sql-ui/content/sql/datasets/', import.meta.url)));
  assert.deepEqual([...ok.datasets], ['pessoas']);
  assert.deepEqual(ok.errors, []);
  const dir = mkdtempSync(join(tmpdir(), 'datasets-'));
  try {
    mkdirSync(join(dir, 'Loja'));
    writeFileSync(join(dir, 'Loja', 'schema.sql'), '');
    const bad = readDatasets(dir);
    assert.deepEqual(bad.errors, ['datasets/Loja: nome inválido', 'datasets/Loja: faltam data.sql, hidden-data.sql']);
    assert.equal(bad.datasets.size, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.deepEqual(readDatasets(join(tmpdir(), 'nao-existe-mesmo')), { datasets: new Set(), errors: [] });
});

test('conteúdo de todas as linguagens é válido', () => {
  const catalog = readJson('catalog.json');
  const errors = [];
  const ids = new Set();
  const langIds = new Set();
  for (const entry of catalog.languages) {
    if (langIds.has(entry.id)) errors.push(`catalog.json: linguagem repetida ${entry.id}`);
    langIds.add(entry.id);
    validateLanguage(entry, ids, errors);
  }
  assert.deepEqual(errors, []);
});

test('toda conquista tem texto e todo texto tem regra', () => {
  const texts = readJson('achievements.json');
  const errors = [];
  for (const a of texts) {
    for (const f of ['id', 'name', 'description', 'hint', 'icon']) if (!nonEmpty(a[f])) errors.push(`achievements.json: ${a.id ?? '?'} sem ${f}`);
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(texts.map((a) => a.id).sort(), [...ACHIEVEMENT_IDS].sort());
});
```

Run: `node --test tests/content.test.js`
Expected: PASS (6 testes).

- [ ] **Step 5: Os executores do conteúdo de SQL e o meta-teste**

`tests/sql-snippets.test.js`:
```js
// Roda cada trecho de verify/sql no sql.js e compara com o cabeçalho (especificação de SQL, seção 8.4).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nodeRun } from './helpers/sql.js';
import { runQuery } from '../js/core/sql-grading.js';
import { parseSqlSnippet, judgeSqlSnippet, listSqlFiles } from '../tools/verify-sql-format.mjs';

const ROOT = fileURLToPath(new URL('../verify/sql/', import.meta.url));

function setupFor(bank) {
  if (!bank) return '';
  const dir = new URL(`../content/sql/datasets/${bank.dataset}/`, import.meta.url);
  const read = (file) => readFileSync(new URL(file, dir), 'utf8');
  return `${read('schema.sql')}\n${read(bank.hidden ? 'hidden-data.sql' : 'data.sql')}`;
}

for (const file of listSqlFiles(ROOT)) {
  const name = relative(ROOT, file).replaceAll('\\', '/');
  test(`trecho SQL ${name}`, async () => {
    const run = await nodeRun();
    const snippet = parseSqlSnippet(readFileSync(file, 'utf8'));
    assert.equal(judgeSqlSnippet(snippet.expect, runQuery(run, setupFor(snippet.bank), snippet.sql)), null);
  });
}
```

`tests/content-sql.test.js`:
```js
// Roda todo exercício de SQL do conteúdo real no sql.js (especificação de SQL, seção 8.3): a resposta de
// referência funciona nos dois bancos e devolve linhas no visível, as formas aceitas passam e as recusadas não.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { nodeRun } from './helpers/sql.js';
import { runQuery, gradeSql } from '../js/core/sql-grading.js';

const ROOT = new URL('../content/', import.meta.url);
const readText = (rel) => readFileSync(new URL(rel, ROOT), 'utf8');
const readJson = (rel) => JSON.parse(readText(rel));
const TABLES_SQL = "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name";

function datasetsOf(dir) {
  const path = fileURLToPath(new URL(`${dir}/datasets/`, ROOT));
  if (!existsSync(path)) return new Map();
  return new Map(readdirSync(path).filter((name) => statSync(`${path}/${name}`).isDirectory()).map((name) => [name, {
    schema: readText(`${dir}/datasets/${name}/schema.sql`),
    data: readText(`${dir}/datasets/${name}/data.sql`),
    hidden: readText(`${dir}/datasets/${name}/hidden-data.sql`),
  }]));
}

for (const entry of readJson('catalog.json').languages) {
  const lang = readJson(`${entry.dir}/language.json`);
  if (!lang.engine) continue;
  const datasets = datasetsOf(entry.dir);

  for (const [id, ds] of datasets) {
    test(`conjunto ${lang.id}/${id}: os dois bancos montam, toda tabela tem linhas e os dados diferem`, async () => {
      const run = await nodeRun();
      assert.notEqual(ds.data.trim(), ds.hidden.trim());
      for (const data of [ds.data, ds.hidden]) {
        const setup = `${ds.schema}\n${data}`;
        const names = run(setup, TABLES_SQL)[0].values.map(([name]) => name);
        assert.ok(names.length > 0, 'o esquema precisa criar pelo menos uma tabela');
        for (const name of names) assert.ok(run(setup, `SELECT count(*) FROM "${name}"`)[0].values[0][0] > 0, `${name} sem linhas`);
      }
    });
  }

  for (const m of lang.modules) {
    const base = `${entry.dir}/${m.dir}`;
    const items = [
      ...readJson(`${base}/questions.json`).questions.filter((q) => q.type === 'sql'),
      ...readJson(`${base}/challenges.json`).challenges,
    ];
    for (const ex of items) {
      test(`exercício ${ex.id}: referência, formas aceitas e recusadas`, async () => {
        const run = await nodeRun();
        const ds = datasets.get(ex.dataset);
        assert.ok(ds, `conjunto ${ex.dataset} não existe`);
        const visible = runQuery(run, `${ds.schema}\n${ds.data}`, ex.answer, ex.check ?? null);
        assert.equal(visible.error, undefined, `a referência deu erro: ${visible.error}`);
        assert.ok(visible.result && visible.result.values.length > 0, 'a referência precisa devolver linhas nos dados visíveis');
        const hidden = runQuery(run, `${ds.schema}\n${ds.hidden}`, ex.answer, ex.check ?? null);
        assert.equal(hidden.error, undefined, `a referência deu erro nos dados ocultos: ${hidden.error}`);
        for (const sql of [ex.answer, ...(ex.accepted ?? [])]) {
          const v = gradeSql(ex, sql, { run, dataset: ds });
          assert.equal(v.ok, true, `deveria aceitar: ${sql} (${v.message})`);
        }
        for (const sql of ex.rejected) {
          assert.equal(gradeSql(ex, sql, { run, dataset: ds }).ok, false, `deveria recusar: ${sql}`);
        }
      });
    }
  }
}
```

Substitua o conteúdo de `tests/meta/exports-covered.test.js` por:
```js
// Emenda 1: toda função exportada tem de aparecer em algum arquivo de teste.
// Uma função nova sem teste quebra a suíte aqui.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const listFiles = (dir, ext) => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name);
  if (statSync(p).isDirectory()) return listFiles(p, ext);
  return name.endsWith(ext) ? [p] : [];
});

// main.js só chama boot() (toca no DOM ao carregar); verify-java.mjs só executa o JDK.
const SKIP = new Set(['js/main.js']);
const modules = [
  ...listFiles(join(ROOT, 'js'), '.js'),
  join(ROOT, 'tools', 'verify-format.mjs'),
  join(ROOT, 'tools', 'verify-sql-format.mjs'),
].filter((f) => !SKIP.has(relative(ROOT, f).replaceAll('\\', '/')));

const testCorpus = listFiles(join(ROOT, 'tests'), '.test.js')
  .filter((f) => !f.includes(`${join('tests', 'meta')}`))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');

for (const file of modules) {
  const name = relative(ROOT, file).replaceAll('\\', '/');
  test(`toda função exportada de ${name} tem teste`, async () => {
    const mod = await import(pathToFileURL(file).href);
    const missing = Object.entries(mod)
      .filter(([, value]) => typeof value === 'function')
      .map(([fn]) => fn)
      .filter((fn) => !new RegExp(`\\b${fn}\\b`).test(testCorpus));
    assert.deepEqual(missing, [], `sem teste: ${missing.join(', ')}`);
  });
}
```

Run: `npm test`
Expected: PASS. O meta-teste agora também cobre `tools/verify-sql-format.mjs`. Os executores de SQL ainda não registram testes, porque não há SQL no catálogo.

- [ ] **Step 6: Commit**

```bash
git add tools/verify-sql-format.mjs tests/tools/verify-sql-format.test.js tests/sql-snippets.test.js tests/content-sql.test.js tests/content.test.js tests/meta/exports-covered.test.js
git commit -m "Validador e conferência do conteúdo de SQL: exercícios, bancos e trechos das aulas" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: SQL › Introdução, os bancos `escola` e `loja` e a referência

**Files:**
- Modify: `content/catalog.json` (SQL entra no catálogo)
- Create:
  - `content/sql/language.json` (só a Introdução por enquanto) e `content/sql/referencia.md`;
  - os conjuntos `content/sql/datasets/escola/` e `content/sql/datasets/loja/`;
  - `content/sql/01-introducao/` (3 aulas, `questions.json`, `flashcards.json` e `challenges.json`);
  - `verify/sql/introducao/` (8 trechos).

**Interfaces:**
- Consumes: o formato e as regras das Tasks 3 e 7.
- Produces: a linguagem `sql` com o módulo `sql.introducao` e os conjuntos `escola` (tabela `alunos`) e `loja` (tabela `produtos`). Nos dados ocultos, os mesmos `id` caem em outras cidades e categorias, os `NULL` mudam de lugar e uma nota a mais passa de 9.

- [ ] **Step 1: Registrar a linguagem (o validador passa a falhar)**

Substitua o conteúdo de `content/catalog.json` por:

```json
{ "languages": [ { "id": "java", "dir": "java" }, { "id": "sql", "dir": "sql" } ] }
```

`content/sql/language.json`:
```json
{
  "id": "sql",
  "name": "SQL",
  "color": "#336791",
  "icon": "🗄️",
  "highlight": "sql",
  "reference": "referencia.md",
  "engine": "sqlite",
  "modules": [
    {
      "id": "introducao",
      "dir": "01-introducao",
      "title": "Introdução",
      "description": "O que é um banco de dados, o que é SQL, o SQLite e a sua primeira consulta.",
      "lessons": [
        { "id": "banco-de-dados", "file": "01-banco-de-dados.md", "title": "O que é um banco de dados", "minutes": 7 },
        { "id": "sql-e-sqlite", "file": "02-sql-e-sqlite.md", "title": "SQL e o SQLite", "minutes": 7 },
        { "id": "primeira-consulta", "file": "03-primeira-consulta.md", "title": "Sua primeira consulta", "minutes": 9 }
      ]
    }
  ]
}
```

Run: `npm test`
Expected: FAIL só em "conteúdo de todas as linguagens é válido" (falta a referência, a pasta do módulo e os bancos) e em `tests/content-sql.test.js` (lê arquivos que ainda não existem). Os testes de tela seguem passando, por causa do catálogo congelado da Task 3.

- [ ] **Step 2: Bancos e referência**

`content/sql/datasets/escola/data.sql`:
```sql
INSERT INTO alunos (id, nome, idade, cidade, turma, nota, email) VALUES
  (1, 'Ana', 17, 'Recife', '2A', 9.5, 'ana@escola.br'),
  (2, 'Bruno', 16, 'Natal', '1B', 6.0, NULL),
  (3, 'Carla', 18, 'Recife', '3A', 8.0, 'carla@escola.br'),
  (4, 'Diego', 17, 'Fortaleza', '2A', 7.5, 'diego@escola.br'),
  (5, 'Elisa', 16, 'Natal', '1B', 9.0, NULL),
  (6, 'Fábio', 18, 'Salvador', '3A', 5.5, 'fabio@escola.br'),
  (7, 'Gabriela', 17, 'Recife', '2A', 8.5, 'gabi@escola.br'),
  (8, 'Heitor', 16, 'Fortaleza', '1B', 4.0, NULL),
  (9, 'Isadora', 18, 'Salvador', '3A', 10.0, 'isa@escola.br'),
  (10, 'João', 17, 'Natal', '2A', 7.0, 'joao@escola.br');
```

`content/sql/datasets/escola/hidden-data.sql`:
```sql
INSERT INTO alunos (id, nome, idade, cidade, turma, nota, email) VALUES
  (1, 'Lucas', 16, 'Recife', '1B', 5.0, NULL),
  (2, 'Marina', 18, 'Natal', '3A', 9.5, 'marina@escola.br'),
  (3, 'Nicolas', 17, 'Salvador', '2A', 6.5, 'nicolas@escola.br'),
  (4, 'Olívia', 16, 'Recife', '1B', 8.5, NULL),
  (5, 'Pedro', 18, 'Fortaleza', '3A', 7.0, 'pedro@escola.br'),
  (6, 'Quésia', 17, 'Natal', '2A', 9.0, 'quesia@escola.br'),
  (7, 'Rafael', 16, 'Salvador', '1B', 4.5, 'rafael@escola.br'),
  (8, 'Sofia', 18, 'Recife', '3A', 10.0, NULL),
  (9, 'Tiago', 17, 'Fortaleza', '2A', 9.2, 'tiago@escola.br'),
  (10, 'Úrsula', 16, 'Natal', '1B', 7.5, 'ursula@escola.br'),
  (11, 'Vitor', 17, 'Recife', '2A', 6.0, 'vitor@escola.br');
```

`content/sql/datasets/escola/schema.sql`:
```sql
CREATE TABLE alunos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  idade INTEGER NOT NULL,
  cidade TEXT NOT NULL,
  turma TEXT NOT NULL,
  nota REAL NOT NULL,
  email TEXT
);
```

`content/sql/datasets/loja/data.sql`:
```sql
INSERT INTO produtos (id, nome, categoria, preco, estoque) VALUES
  (1, 'Caderno', 'Papelaria', 18.90, 40),
  (2, 'Caneta azul', 'Papelaria', 2.50, 200),
  (3, 'Mochila', 'Acessórios', 129.90, 8),
  (4, 'Garrafa térmica', 'Acessórios', 59.90, 0),
  (5, 'Lápis', 'Papelaria', 1.20, 350),
  (6, 'Fone de ouvido', 'Eletrônicos', 89.90, 15),
  (7, 'Carregador', 'Eletrônicos', 49.90, 0),
  (8, 'Estojo', 'Papelaria', 24.90, 30);
```

`content/sql/datasets/loja/hidden-data.sql`:
```sql
INSERT INTO produtos (id, nome, categoria, preco, estoque) VALUES
  (1, 'Agenda', 'Papelaria', 32.00, 12),
  (2, 'Calculadora', 'Eletrônicos', 45.00, 0),
  (3, 'Borracha', 'Papelaria', 1.50, 500),
  (4, 'Lancheira', 'Acessórios', 39.90, 7),
  (5, 'Mouse', 'Eletrônicos', 79.90, 20),
  (6, 'Régua', 'Papelaria', 3.20, 0),
  (7, 'Pendrive', 'Eletrônicos', 29.90, 60),
  (8, 'Mochila escolar', 'Acessórios', 149.90, 3),
  (9, 'Marca-texto', 'Papelaria', 6.50, 90);
```

`content/sql/datasets/loja/schema.sql`:
```sql
CREATE TABLE produtos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  preco REAL NOT NULL,
  estoque INTEGER NOT NULL
);
```

`content/sql/referencia.md`:
````markdown
# Referência rápida de SQL

Resumo para consultar durante os estudos. Os detalhes estão nas aulas. O dialeto é o do SQLite.

## A forma de uma consulta

```sql
SELECT colunas
FROM tabela
WHERE condição
ORDER BY coluna DESC
LIMIT 10 OFFSET 20;
```

As cláusulas aparecem sempre nesta ordem. Só `SELECT` e `FROM` são obrigatórias numa consulta a uma tabela.

## Condições

| Escrita | Significa |
|---|---|
| `=` | igual |
| `<>` ou `!=` | diferente |
| `>`, `<`, `>=`, `<=` | maior, menor, maior ou igual, menor ou igual |
| `AND`, `OR`, `NOT` | e, ou, não (o `AND` vale antes do `OR`) |
| `IN ('a', 'b')` | está na lista |
| `BETWEEN 7 AND 9` | está na faixa, com as pontas |
| `LIKE 'Ca%'` | combina com o padrão (`%`: qualquer quantidade de caracteres; `_`: um caractere) |
| `IS NULL`, `IS NOT NULL` | não tem valor, tem valor |

## No resultado

| Escrita | Faz |
|---|---|
| `SELECT *` | todas as colunas |
| `SELECT DISTINCT` | tira as linhas repetidas |
| `idade + 1` | conta feita em cada linha, só no resultado |
| `nome AS aluno` | apelido da coluna (com espaço, use aspas duplas) |
| `ORDER BY nota DESC` | ordena; `ASC` (o padrão) é crescente |
| `LIMIT 3 OFFSET 3` | pula 3 linhas e pega as 3 seguintes |

## Pegadinhas clássicas

- Textos vão entre **aspas simples**: `'Recife'`. Aspas duplas são para nomes de colunas.
- No SQLite, o `=` diferencia maiúsculas de minúsculas; o `LIKE` não, nas letras sem acento.
- `7 / 2` dá `3`: divisão entre inteiros. Use `7 / 2.0` para `3.5`.
- `AND` vale antes do `OR`. Na dúvida, use parênteses.
- `= NULL` nunca é verdadeiro. Use `IS NULL`.
- Sem `ORDER BY`, a ordem do resultado não é garantida, e `LIMIT` pega linhas quaisquer.

## Créditos

A ordem dos assuntos e a ideia de praticar escrevendo consultas vêm do [SQL Teaching](https://www.sqlteaching.com/), de Ronald Cheng, publicado com a licença MIT. O SQLite roda no navegador graças ao [sql.js](https://github.com/sql-js/sql.js) (licença MIT); o SQLite é de domínio público.
````

- [ ] **Step 3: Aulas, perguntas, cartas e desafios**

`content/sql/01-introducao/01-banco-de-dados.md`:
````markdown
# O que é um banco de dados

Quase todo sistema guarda informações: os alunos de uma escola, os produtos de uma loja, as mensagens de um aplicativo. Um **banco de dados** guarda essas informações de um jeito organizado, para que seja fácil encontrá-las, mudá-las e manter tudo consistente.

## Tabelas, linhas e colunas

Nos bancos **relacionais**, os mais usados, os dados ficam em **tabelas**, parecidas com planilhas:

| id | nome | idade | cidade |
|---|---|---|---|
| 1 | Ana | 17 | Recife |
| 2 | Bruno | 16 | Natal |
| 3 | Carla | 18 | Recife |

- Cada **coluna** é um tipo de informação: `nome`, `idade`, `cidade`.
- Cada **linha** é um registro: aqui, um aluno.
- Toda coluna tem um **tipo**: `idade` guarda números inteiros; `nome` e `cidade`, textos.

## A chave primária

A coluna `id` tem um papel especial: ela é a **chave primária**. Cada linha tem um valor diferente nela, então o `id` identifica um aluno sem confusão, mesmo que existam dois alunos com o mesmo nome.

> [!NOTE]
> Um banco costuma ter várias tabelas ligadas entre si, como `alunos`, `turmas` e `notas`. É daí que vem o nome "relacional". O módulo de junções mostra como juntar tabelas numa consulta.

## As tabelas deste curso

Os exercícios usam dois bancos pequenos:

- **escola**, com a tabela `alunos`: `id`, `nome`, `idade`, `cidade`, `turma`, `nota` e `email`.
- **loja**, com a tabela `produtos`: `id`, `nome`, `categoria`, `preco` e `estoque`.

Em cada exercício, o bloco **"Tabelas deste exercício"** mostra as tabelas completas. Abra e dê uma olhada antes de escrever a consulta.
````

`content/sql/01-introducao/02-sql-e-sqlite.md`:
````markdown
# SQL e o SQLite

**SQL** (*Structured Query Language*, ou linguagem de consulta estruturada) é a linguagem usada para conversar com bancos de dados relacionais. Com ela você consulta, insere, altera e apaga dados, e também cria as tabelas.

## Uma linguagem declarativa

Em SQL, você diz **o que** quer, e o banco decide **como** buscar:

```sql
SELECT nome FROM alunos;
```

Essa consulta pede "o nome de todos os alunos". Você não escreve o laço que percorre a tabela: o banco faz isso por você.

## Os principais comandos

| Comando | Para quê |
|---|---|
| `SELECT` | consultar (ler) dados |
| `INSERT` | inserir linhas |
| `UPDATE` | alterar linhas |
| `DELETE` | apagar linhas |
| `CREATE TABLE` | criar uma tabela |

Os módulos 1 a 5 tratam do `SELECT`, o comando mais usado. O módulo 6 trata dos outros.

## O SQLite

Existem vários **sistemas de banco de dados**: MySQL, PostgreSQL, SQL Server, Oracle, SQLite... Todos entendem SQL, com pequenas diferenças entre si, os **dialetos**.

Este curso usa o **SQLite**, que guarda o banco inteiro num único arquivo e não precisa de um servidor. Ele está em celulares, navegadores e muitos aplicativos. Aqui no site, o SQLite roda **dentro do seu navegador**: as suas consultas não são enviadas para nenhum servidor.

> [!TIP]
> O que você aprende aqui vale para os outros bancos. Quando algo for diferente no MySQL ou no PostgreSQL, a aula avisa num quadro como este.

## Maiúsculas e minúsculas

As **palavras-chave** do SQL não diferenciam maiúsculas de minúsculas: `SELECT`, `select` e `Select` são o mesmo comando. É costume escrevê-las em maiúsculas, para separar dos nomes das tabelas e colunas.

```sql
select nome from alunos;   -- dá o mesmo resultado que SELECT nome FROM alunos;
```
````

`content/sql/01-introducao/03-primeira-consulta.md`:
````markdown
# Sua primeira consulta

## SELECT e FROM

A consulta mais simples tem duas partes:

```sql
SELECT nome, cidade
FROM alunos;
```

- `SELECT` diz **quais colunas** você quer, separadas por vírgula, na ordem em que devem aparecer.
- `FROM` diz **de qual tabela**.
- O `;` marca o fim da instrução. Numa consulta sozinha, o SQLite aceita sem ele, mas é bom costume colocar.

As primeiras linhas do resultado:

| nome | cidade |
|---|---|
| Ana | Recife |
| Bruno | Natal |
| Carla | Recife |

Para pegar **todas** as colunas, use `*`:

```sql
SELECT * FROM alunos;
```

> [!TIP]
> A consulta pode ocupar várias linhas e ter espaços à vontade. `SELECT nome, cidade FROM alunos;`, numa linha só, dá o mesmo resultado.

## Comentários

O que vem depois de `--`, até o fim da linha, é comentário e não é executado. Para comentar várias linhas, use `/*` e `*/`.

```sql
-- isto é um comentário
SELECT nome   -- este também
FROM alunos;

/* comentário de
   várias linhas */
```

## Como funcionam os exercícios

1. Leia o enunciado e abra **"Tabelas deste exercício"** para ver os dados.
2. Escreva a consulta na caixa e clique em **Executar** (ou aperte **Ctrl+Enter**).
3. Compare o **seu resultado** com o **resultado esperado**. Nos desafios das aulas, você pode tentar quantas vezes quiser; depois da primeira tentativa, aparece "Ver uma resposta".

O que conta é o **resultado**: qualquer consulta que chegue nele está certa. Mas a correção também roda a sua consulta com **outros dados**, que você não vê. Assim, uma consulta que só acertou por coincidência (por exemplo, escolhendo as linhas pelo `id` em vez de pela regra pedida) é recusada, com uma explicação.

> [!NOTE]
> Na caixa de texto, a tecla Tab insere dois espaços. Para sair da caixa usando o teclado, aperte Esc e depois Tab.
````

`content/sql/01-introducao/challenges.json`:
```json
{
  "challenges": [
    {
      "id": "sql.introducao.d01", "lesson": "banco-de-dados",
      "dataset": "escola",
      "prompt": "Veja a tabela `alunos` inteira: escreva `SELECT * FROM alunos;` na caixa e clique em **Executar**.",
      "answer": "SELECT * FROM alunos;",
      "rejected": ["SELECT nome FROM alunos;"],
      "explanation": "O `*` traz todas as colunas, e sem nenhum filtro vêm todas as linhas."
    },
    {
      "id": "sql.introducao.d02", "lesson": "sql-e-sqlite",
      "dataset": "loja",
      "prompt": "Agora é com você: mostre todas as colunas da tabela `produtos`, da loja.",
      "answer": "SELECT * FROM produtos;",
      "accepted": ["select * from produtos"],
      "rejected": ["SELECT nome FROM produtos;"],
      "explanation": "Mesma forma do desafio anterior, com outra tabela: `SELECT * FROM produtos;`."
    },
    {
      "id": "sql.introducao.d03", "lesson": "primeira-consulta",
      "dataset": "escola",
      "prompt": "Liste o nome e a cidade de todos os alunos.",
      "answer": "SELECT nome, cidade FROM alunos;",
      "rejected": ["SELECT nome FROM alunos;"],
      "explanation": "As duas colunas vão no `SELECT`, separadas por vírgula."
    },
    {
      "id": "sql.introducao.d04", "lesson": "primeira-consulta",
      "dataset": "loja",
      "prompt": "Liste o nome, a categoria e o estoque de todos os produtos.",
      "answer": "SELECT nome, categoria, estoque FROM produtos;",
      "rejected": ["SELECT * FROM produtos;"],
      "explanation": "Escolha só as três colunas pedidas, na ordem do enunciado."
    }
  ]
}
```

`content/sql/01-introducao/flashcards.json`:
```json
{
  "cards": [
    { "id": "sql.introducao.f01", "lesson": "banco-de-dados", "front": "O que é um banco de dados?", "back": "Um lugar organizado para guardar informações e encontrá-las, mudá-las e mantê-las consistentes." },
    { "id": "sql.introducao.f02", "lesson": "banco-de-dados", "front": "Numa tabela, o que são linhas e colunas?", "back": "Cada linha é um registro (um aluno, um produto). Cada coluna é um tipo de informação (`nome`, `idade`)." },
    { "id": "sql.introducao.f03", "lesson": "banco-de-dados", "front": "O que é a chave primária?", "back": "A coluna (como o `id`) cujo valor é diferente em cada linha e identifica o registro sem confusão." },
    { "id": "sql.introducao.f04", "lesson": "sql-e-sqlite", "front": "O que quer dizer que o SQL é declarativo?", "back": "Você diz o que quer no resultado; o banco decide como buscar." },
    { "id": "sql.introducao.f05", "lesson": "sql-e-sqlite", "front": "O que é o SQLite?", "back": "Um banco de dados que guarda tudo num único arquivo, sem servidor. Neste site, ele roda dentro do navegador." },
    { "id": "sql.introducao.f06", "lesson": "sql-e-sqlite", "front": "O que são os dialetos do SQL?", "back": "As pequenas diferenças entre os bancos (SQLite, MySQL, PostgreSQL...). A base da linguagem é a mesma em todos." },
    { "id": "sql.introducao.f07", "lesson": "sql-e-sqlite", "front": "Palavras-chave do SQL diferenciam maiúsculas?", "back": "Não: `SELECT` e `select` são iguais. Escrever em maiúsculas é só um costume." },
    { "id": "sql.introducao.f08", "lesson": "primeira-consulta", "front": "Qual é a forma da consulta mais simples?", "back": "`SELECT colunas FROM tabela;`, com as colunas separadas por vírgula." },
    { "id": "sql.introducao.f09", "lesson": "primeira-consulta", "front": "O que significa `SELECT *`?", "back": "Todas as colunas da tabela." },
    { "id": "sql.introducao.f10", "lesson": "primeira-consulta", "front": "Como escrever comentários em SQL?", "back": "`--` comenta até o fim da linha; `/* ... */` comenta várias linhas." }
  ]
}
```

`content/sql/01-introducao/questions.json`:
```json
{
  "questions": [
    {
      "id": "sql.introducao.q01", "type": "multiple", "difficulty": 1, "lesson": "banco-de-dados",
      "prompt": "Numa tabela de banco de dados, o que cada **linha** representa?",
      "options": ["Um registro, como um aluno", "Um tipo de informação, como a idade", "Uma tabela inteira", "Um comando SQL"], "answer": 0,
      "explanation": "Cada linha é um registro (um aluno, um produto). Cada coluna é um tipo de informação, como `nome` ou `idade`."
    },
    {
      "id": "sql.introducao.q02", "type": "truefalse", "difficulty": 1, "lesson": "banco-de-dados",
      "prompt": "A chave primária identifica cada linha da tabela de forma única.",
      "answer": true,
      "explanation": "Cada linha tem um valor diferente na chave primária (como o `id`), então ela identifica o registro sem confusão, mesmo com nomes repetidos."
    },
    {
      "id": "sql.introducao.q03", "type": "multiple", "difficulty": 1, "lesson": "banco-de-dados",
      "prompt": "Na tabela `alunos`, o que são `nome`, `idade` e `cidade`?",
      "options": ["Colunas", "Linhas", "Bancos de dados", "Consultas"], "answer": 0,
      "explanation": "São colunas: cada uma guarda um tipo de informação de todos os alunos."
    },
    {
      "id": "sql.introducao.q04", "type": "truefalse", "difficulty": 1, "lesson": "sql-e-sqlite",
      "prompt": "SQL é uma linguagem declarativa: você diz o que quer, e o banco decide como buscar.",
      "answer": true,
      "explanation": "Em `SELECT nome FROM alunos;` você não escreve o laço que percorre a tabela: só descreve o resultado, e o banco cuida do resto."
    },
    {
      "id": "sql.introducao.q05", "type": "multiple", "difficulty": 2, "lesson": "sql-e-sqlite",
      "prompt": "O que o SQLite tem de diferente do MySQL e do PostgreSQL?",
      "options": ["Guarda o banco inteiro num único arquivo, sem precisar de um servidor", "Não aceita a linguagem SQL", "Só funciona conectado à internet", "Não guarda os dados em tabelas"], "answer": 0,
      "explanation": "O SQLite é um banco num arquivo só, sem servidor; por isso está em celulares e navegadores. Ele usa SQL e tabelas como os outros."
    },
    {
      "id": "sql.introducao.q06", "type": "truefalse", "difficulty": 1, "lesson": "sql-e-sqlite",
      "prompt": "Em SQL, `select` e `SELECT` são o mesmo comando.",
      "answer": true,
      "explanation": "As palavras-chave do SQL não diferenciam maiúsculas de minúsculas. Escrevê-las em maiúsculas é só um costume, para separar dos nomes das tabelas e colunas."
    },
    {
      "id": "sql.introducao.q07", "type": "fill", "difficulty": 1, "lesson": "primeira-consulta",
      "prompt": "Complete para listar **todas** as colunas da tabela `alunos`:",
      "code": "SELECT ___ FROM alunos;",
      "blanks": [["*", "id, nome, idade, cidade, turma, nota, email"]],
      "explanation": "O `*` significa \"todas as colunas\". Escrever os nomes de todas as colunas, na ordem da tabela, também funciona, mas dá mais trabalho."
    },
    {
      "id": "sql.introducao.q08", "type": "fill", "difficulty": 1, "lesson": "primeira-consulta",
      "prompt": "Complete para ler o nome dos produtos da tabela `produtos`:",
      "code": "SELECT nome ___ produtos;",
      "blanks": [["FROM"]], "caseInsensitive": true,
      "explanation": "`FROM` diz de qual tabela vêm os dados. Como toda palavra-chave, pode ser escrita em maiúsculas ou minúsculas."
    },
    {
      "id": "sql.introducao.q09", "type": "order", "difficulty": 1, "lesson": "primeira-consulta",
      "prompt": "Monte a consulta que lista o nome e o preço de todos os produtos, com uma coluna por linha:",
      "lines": ["SELECT", "  nome,", "  preco", "FROM produtos;"],
      "explanation": "Primeiro o `SELECT` com as colunas (a vírgula separa uma da outra), depois o `FROM` com a tabela."
    },
    {
      "id": "sql.introducao.q10", "type": "sql", "difficulty": 1, "lesson": "primeira-consulta",
      "dataset": "escola",
      "prompt": "Liste o nome de todos os alunos.",
      "answer": "SELECT nome FROM alunos;",
      "accepted": ["select nome from alunos"],
      "rejected": ["SELECT * FROM alunos;", "SELECT nome, cidade FROM alunos;"],
      "explanation": "`SELECT nome FROM alunos;` pede só a coluna `nome`, de todas as linhas."
    },
    {
      "id": "sql.introducao.q11", "type": "sql", "difficulty": 1, "lesson": "primeira-consulta",
      "dataset": "loja",
      "prompt": "Liste o nome e o preço de todos os produtos.",
      "answer": "SELECT nome, preco FROM produtos;",
      "rejected": ["SELECT nome FROM produtos;", "SELECT * FROM produtos;"],
      "explanation": "As colunas vão no `SELECT`, separadas por vírgula, e a tabela no `FROM`."
    },
    {
      "id": "sql.introducao.q12", "type": "sql", "difficulty": 1, "lesson": "banco-de-dados",
      "dataset": "escola",
      "prompt": "Mostre a tabela `alunos` inteira, com todas as colunas.",
      "answer": "SELECT * FROM alunos;",
      "accepted": ["SELECT id, nome, idade, cidade, turma, nota, email FROM alunos;"],
      "rejected": ["SELECT nome FROM alunos;"],
      "explanation": "O `*` traz todas as colunas da tabela."
    },
    {
      "id": "sql.introducao.q13", "type": "multiple", "difficulty": 1, "lesson": "primeira-consulta",
      "prompt": "Para que serve o `;` no fim de uma consulta?",
      "options": ["Marca o fim da instrução", "Começa um comentário", "Junta duas tabelas", "Ordena o resultado"], "answer": 0,
      "explanation": "O `;` separa uma instrução da outra. Comentários começam com `--`."
    },
    {
      "id": "sql.introducao.q14", "type": "truefalse", "difficulty": 1, "lesson": "primeira-consulta",
      "prompt": "Em SQL, `--` começa um comentário que vai até o fim da linha.",
      "answer": true,
      "explanation": "Tudo o que vem depois de `--` na mesma linha é ignorado. Para várias linhas, use `/*` e `*/`."
    },
    {
      "id": "sql.introducao.q15", "type": "multiple", "difficulty": 1, "lesson": "sql-e-sqlite",
      "prompt": "Qual comando SQL serve para **ler** dados de uma tabela?",
      "options": ["`SELECT`", "`INSERT`", "`UPDATE`", "`DELETE`"], "answer": 0,
      "explanation": "`SELECT` consulta. `INSERT` insere, `UPDATE` altera e `DELETE` apaga linhas."
    }
  ]
}
```

- [ ] **Step 4: Trechos conferidos das aulas**

`verify/sql/introducao/aula-comentarios.sql`:
```sql
-- verifica: f10 e a aula primeira-consulta (comentários não são executados)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Bruno
-- Carla
-- Diego
-- Elisa
-- Fábio
-- Gabriela
-- Heitor
-- Isadora
-- João

-- isto é um comentário
SELECT nome   -- este também
FROM alunos;

/* comentário de
   várias linhas */
```

`verify/sql/introducao/aula-primeira-consulta.sql`:
```sql
-- verifica: a aula primeira-consulta (consulta em duas linhas; a aula mostra as primeiras)
-- banco: escola
-- saida:
-- nome | cidade
-- Ana | Recife
-- Bruno | Natal
-- Carla | Recife
-- Diego | Fortaleza
-- Elisa | Natal
-- Fábio | Salvador
-- Gabriela | Recife
-- Heitor | Fortaleza
-- Isadora | Salvador
-- João | Natal
SELECT nome, cidade
FROM alunos;
```

`verify/sql/introducao/aula-select-minusculas.sql`:
```sql
-- verifica: sql.introducao.q06 e a aula sql-e-sqlite (palavras-chave em minúsculas)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Bruno
-- Carla
-- Diego
-- Elisa
-- Fábio
-- Gabriela
-- Heitor
-- Isadora
-- João
select nome from alunos;
```

`verify/sql/introducao/aula-sem-ponto-e-virgula.sql`:
```sql
-- verifica: a aula primeira-consulta (uma consulta sozinha roda sem o ;)
-- banco: escola
-- saida:
-- nome
-- Ana
SELECT nome FROM alunos WHERE id = 1
```

`verify/sql/introducao/aula-tabela.sql`:
```sql
-- verifica: a tabela da aula banco-de-dados
-- banco: escola
-- saida:
-- id | nome | idade | cidade
-- 1 | Ana | 17 | Recife
-- 2 | Bruno | 16 | Natal
-- 3 | Carla | 18 | Recife
SELECT id, nome, idade, cidade FROM alunos WHERE id <= 3;
```

`verify/sql/introducao/aula-uma-linha.sql`:
```sql
-- verifica: a dica da aula primeira-consulta (numa linha só, o mesmo resultado)
-- banco: escola
-- saida:
-- nome | cidade
-- Ana | Recife
-- Bruno | Natal
-- Carla | Recife
-- Diego | Fortaleza
-- Elisa | Natal
-- Fábio | Salvador
-- Gabriela | Recife
-- Heitor | Fortaleza
-- Isadora | Salvador
-- João | Natal
SELECT nome, cidade FROM alunos;
```

`verify/sql/introducao/q07-todas-as-colunas.sql`:
```sql
-- verifica: sql.introducao.q07 (listar as colunas na ordem da tabela dá o mesmo que *)
-- banco: escola
-- saida:
-- diferencas
-- 0
SELECT count(*) AS diferencas FROM (
  SELECT * FROM alunos
  EXCEPT
  SELECT id, nome, idade, cidade, turma, nota, email FROM alunos
);
```

`verify/sql/introducao/q09-ordem.sql`:
```sql
-- verifica: sql.introducao.q09 (a ordem montada roda)
-- banco: loja
-- saida:
-- nome | preco
-- Caderno | 18.9
-- Caneta azul | 2.5
-- Mochila | 129.9
-- Garrafa térmica | 59.9
-- Lápis | 1.2
-- Fone de ouvido | 89.9
-- Carregador | 49.9
-- Estojo | 24.9
SELECT
  nome,
  preco
FROM produtos;
```

- [ ] **Step 5: Rodar tudo**

Run: `npm test`
Expected: PASS, incluindo:
- os exercícios `sql.introducao.*` em `tests/content-sql.test.js`: a referência roda nos dois bancos, as formas aceitas passam e as recusadas não;
- os dois conjuntos de tabelas;
- os 8 trechos de `verify/sql/introducao`.

- [ ] **Step 6: Commit**

```bash
git add content verify
git commit -m "Adiciona SQL › Introdução, os bancos escola e loja e a referência rápida" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: SQL › Consultas básicas

**Files:**
- Modify: `content/sql/language.json` (entra o módulo `consultas`)
- Create: `content/sql/02-consultas/` (7 aulas, `questions.json`, `flashcards.json` e `challenges.json`), `verify/sql/consultas/` (47 trechos)

**Interfaces:**
- Consumes: os bancos da Task 8.
- Produces: o módulo `sql.consultas`, com as aulas `colunas`, `where`, `e-ou`, `like`, `ordenar`, `null` e `apelidos`.

- [ ] **Step 1: Registrar o módulo (o validador passa a falhar)**

Substitua o conteúdo de `content/sql/language.json` por:
```json
{
  "id": "sql",
  "name": "SQL",
  "color": "#336791",
  "icon": "🗄️",
  "highlight": "sql",
  "reference": "referencia.md",
  "engine": "sqlite",
  "modules": [
    {
      "id": "introducao",
      "dir": "01-introducao",
      "title": "Introdução",
      "description": "O que é um banco de dados, o que é SQL, o SQLite e a sua primeira consulta.",
      "lessons": [
        { "id": "banco-de-dados", "file": "01-banco-de-dados.md", "title": "O que é um banco de dados", "minutes": 7 },
        { "id": "sql-e-sqlite", "file": "02-sql-e-sqlite.md", "title": "SQL e o SQLite", "minutes": 7 },
        { "id": "primeira-consulta", "file": "03-primeira-consulta.md", "title": "Sua primeira consulta", "minutes": 9 }
      ]
    },
    {
      "id": "consultas",
      "dir": "02-consultas",
      "title": "Consultas básicas",
      "description": "Escolher colunas, filtrar linhas, buscar partes de texto, ordenar, limitar, lidar com NULL e dar apelidos às colunas.",
      "lessons": [
        { "id": "colunas", "file": "01-colunas.md", "title": "Escolhendo colunas e fazendo contas", "minutes": 7 },
        { "id": "where", "file": "02-where.md", "title": "Filtrando linhas com WHERE", "minutes": 9 },
        { "id": "e-ou", "file": "03-e-ou.md", "title": "Combinando condições", "minutes": 10 },
        { "id": "like", "file": "04-like.md", "title": "Buscando partes do texto com LIKE", "minutes": 7 },
        { "id": "ordenar", "file": "05-ordenar.md", "title": "Sem repetir, ordenando e limitando", "minutes": 9 },
        { "id": "null", "file": "06-null.md", "title": "NULL: quando falta o valor", "minutes": 8 },
        { "id": "apelidos", "file": "07-apelidos.md", "title": "Apelidos de coluna com AS", "minutes": 6 }
      ]
    }
  ]
}
```

Run: `npm test`
Expected: FAIL só em "conteúdo de todas as linguagens é válido" (`pasta 02-consultas não existe`) e no `tests/content-sql.test.js`.

- [ ] **Step 2: Aulas, perguntas, cartas e desafios**

`content/sql/02-consultas/01-colunas.md`:
````markdown
# Escolhendo colunas e fazendo contas

## Só as colunas que interessam

```sql
SELECT nome, turma FROM alunos;
```

As colunas aparecem na ordem em que você as escreve. Trocar a ordem no `SELECT` troca a ordem no resultado:

```sql
SELECT turma, nome FROM alunos;
```

| turma | nome |
|---|---|
| 2A | Ana |
| 1B | Bruno |

## Contas no SELECT

O `SELECT` também calcula. A conta é feita linha a linha, só no resultado: **a tabela não muda**.

```sql
SELECT nome, idade, idade + 1 FROM alunos;
```

As primeiras linhas do resultado:

| nome | idade | idade + 1 |
|---|---|---|
| Ana | 17 | 18 |
| Bruno | 16 | 17 |
| Carla | 18 | 19 |

Os operadores são `+`, `-`, `*` e `/`. O nome da coluna calculada é a própria conta (`idade + 1`); a última aula do módulo mostra como dar um nome melhor com `AS`.

> [!CAUTION]
> Divisão entre dois inteiros descarta a parte decimal: `SELECT 7 / 2;` dá `3`. Para obter `3.5`, use um número com ponto: `7 / 2.0`. O PostgreSQL faz igual ao SQLite; no MySQL, `7 / 2` já dá `3.5000`.

## Valores fixos

Um valor escrito direto no `SELECT` se repete em todas as linhas:

```sql
SELECT nome, 'aluno' FROM alunos;
```

As primeiras linhas do resultado:

| nome | 'aluno' |
|---|---|
| Ana | aluno |
| Bruno | aluno |
````

`content/sql/02-consultas/02-where.md`:
````markdown
# Filtrando linhas com WHERE

`WHERE` escolhe **quais linhas** entram no resultado: só as que satisfazem a condição.

```sql
SELECT nome, nota FROM alunos WHERE nota > 9;
```

| nome | nota |
|---|---|
| Ana | 9.5 |
| Isadora | 10 |

## Comparações

| Operador | Significa |
|---|---|
| `=` | igual |
| `<>` ou `!=` | diferente |
| `>` e `<` | maior e menor |
| `>=` e `<=` | maior ou igual e menor ou igual |

## Texto vai entre aspas simples

```sql
SELECT nome FROM alunos WHERE cidade = 'Recife';
```

| nome |
|---|
| Ana |
| Carla |
| Gabriela |

- Números vão sem aspas: `WHERE idade = 17`.
- Textos vão entre **aspas simples**: `'Recife'`.

> [!WARNING]
> No padrão do SQL, aspas **duplas** servem para nomes de colunas e tabelas, não para textos. O SQLite aceita `"Recife"` como texto por compatibilidade, mas o PostgreSQL não: lá, `"Recife"` seria o nome de uma coluna. Use sempre aspas simples para textos.

> [!IMPORTANT]
> No SQLite, o `=` entre textos diferencia maiúsculas de minúsculas: `WHERE cidade = 'recife'` não encontra nenhuma linha, porque a cidade está gravada como `Recife`. O PostgreSQL faz igual; no MySQL, com a configuração mais comum, essa comparação não diferencia.
````

`content/sql/02-consultas/03-e-ou.md`:
````markdown
# Combinando condições

## AND, OR e NOT

- `AND`: as **duas** condições precisam ser verdadeiras.
- `OR`: basta **uma** delas.
- `NOT`: inverte a condição.

```sql
SELECT nome, cidade, nota FROM alunos
WHERE cidade = 'Recife' AND nota >= 8.5;
```

| nome | cidade | nota |
|---|---|---|
| Ana | Recife | 9.5 |
| Gabriela | Recife | 8.5 |

`WHERE NOT cidade = 'Natal'` lista todos os alunos, menos os de Natal.

## Cuidado com AND e OR juntos

Sem parênteses, o `AND` é avaliado **antes** do `OR`, como a multiplicação antes da soma:

```sql
-- A ideia: alunos de Recife ou de Salvador que têm 18 anos
SELECT nome FROM alunos
WHERE cidade = 'Recife' OR cidade = 'Salvador' AND idade = 18;
```

O banco lê essa condição como `cidade = 'Recife' OR (cidade = 'Salvador' AND idade = 18)` e traz **todos** os alunos de Recife, de qualquer idade:

| nome |
|---|
| Ana |
| Carla |
| Fábio |
| Gabriela |
| Isadora |

Com parênteses, a condição fica como se queria:

```sql
SELECT nome FROM alunos
WHERE (cidade = 'Recife' OR cidade = 'Salvador') AND idade = 18;
```

| nome |
|---|
| Carla |
| Fábio |
| Isadora |

> [!TIP]
> Na dúvida, coloque parênteses. Eles nunca atrapalham e deixam a intenção clara para quem lê.

## IN: um valor de uma lista

```sql
SELECT nome, cidade FROM alunos WHERE cidade IN ('Natal', 'Fortaleza');
```

| nome | cidade |
|---|---|
| Bruno | Natal |
| Diego | Fortaleza |
| Elisa | Natal |
| Heitor | Fortaleza |
| João | Natal |

`IN ('Natal', 'Fortaleza')` equivale a `cidade = 'Natal' OR cidade = 'Fortaleza'`.

## BETWEEN: uma faixa de valores

```sql
SELECT nome, nota FROM alunos WHERE nota BETWEEN 7 AND 8;
```

| nome | nota |
|---|---|
| Carla | 8 |
| Diego | 7.5 |
| João | 7 |

`BETWEEN` **inclui as pontas**: as notas 7 e 8 entram. É o mesmo que `nota >= 7 AND nota <= 8`.

Também existem `NOT IN` e `NOT BETWEEN`, que fazem o contrário.
````

`content/sql/02-consultas/04-like.md`:
````markdown
# Buscando partes do texto com LIKE

O `=` compara o texto inteiro. Para buscar **partes** de um texto, use `LIKE` com os curingas:

| Curinga | Significa |
|---|---|
| `%` | qualquer quantidade de caracteres, inclusive nenhum |
| `_` | exatamente um caractere |

Produtos cujo nome começa com "Ca":

```sql
SELECT nome FROM produtos WHERE nome LIKE 'Ca%';
```

| nome |
|---|
| Caderno |
| Caneta azul |
| Carregador |

Mais exemplos:

| Condição | Encontra | Na loja |
|---|---|---|
| `nome LIKE '%a'` | termina com "a" | Mochila, Garrafa térmica |
| `nome LIKE '%de%'` | tem "de" em qualquer lugar | Caderno, Fone de ouvido |
| `nome LIKE '_____'` | tem exatamente 5 caracteres | Lápis |

`NOT LIKE` faz o contrário: fica com os textos que **não** combinam com o padrão.

> [!NOTE]
> No SQLite, o `LIKE` não diferencia maiúsculas de minúsculas nas letras sem acento: `LIKE 'ca%'` também encontra `Caderno`. Nas letras acentuadas, diferencia: `'Ábaco' LIKE 'á%'` é falso. No PostgreSQL, o `LIKE` sempre diferencia (para ignorar, existe o `ILIKE`); no MySQL, depende da configuração do banco.
````

`content/sql/02-consultas/05-ordenar.md`:
````markdown
# Sem repetir, ordenando e limitando

## DISTINCT: sem repetições

```sql
SELECT DISTINCT cidade FROM alunos;
```

| cidade |
|---|
| Recife |
| Natal |
| Fortaleza |
| Salvador |

Com várias colunas, o `DISTINCT` olha a **combinação**: `SELECT DISTINCT cidade, turma` só tira as linhas em que a cidade **e** a turma se repetem juntas.

## ORDER BY: ordenando

```sql
SELECT nome, nota FROM alunos ORDER BY nota DESC;
```

| nome | nota |
|---|---|
| Isadora | 10 |
| Ana | 9.5 |
| Elisa | 9 |
| Gabriela | 8.5 |
| Carla | 8 |
| Diego | 7.5 |
| João | 7 |
| Bruno | 6 |
| Fábio | 5.5 |
| Heitor | 4 |

- `ASC` (o padrão) ordena de forma crescente; `DESC`, decrescente.
- Dá para ordenar por várias colunas: `ORDER BY cidade, nome` ordena pela cidade e, dentro de cada cidade, pelo nome.
- Sem `ORDER BY`, **a ordem do resultado não é garantida**: o banco devolve as linhas na ordem que for mais conveniente para ele.

```sql
SELECT cidade, nome FROM alunos ORDER BY cidade, nome;
```

| cidade | nome |
|---|---|
| Fortaleza | Diego |
| Fortaleza | Heitor |
| Natal | Bruno |
| Natal | Elisa |
| Natal | João |
| Recife | Ana |
| Recife | Carla |
| Recife | Gabriela |
| Salvador | Fábio |
| Salvador | Isadora |

## LIMIT: só as primeiras linhas

Os 3 produtos mais baratos:

```sql
SELECT nome, preco FROM produtos ORDER BY preco LIMIT 3;
```

| nome | preco |
|---|---|
| Lápis | 1.2 |
| Caneta azul | 2.5 |
| Caderno | 18.9 |

`LIMIT 3 OFFSET 3` pula os 3 primeiros e pega os 3 seguintes, o que é útil para mostrar resultados em páginas. Aqui, seriam Estojo, Carregador e Garrafa térmica.

> [!TIP]
> `LIMIT` sem `ORDER BY` pega linhas quaisquer. Para "os 3 mais baratos", ordene antes.

> [!NOTE]
> `LIMIT` funciona no SQLite, no MySQL e no PostgreSQL. O SQL Server usa `SELECT TOP 3 ...`, e a forma do padrão SQL, aceita pelo PostgreSQL e pelo Oracle, é `FETCH FIRST 3 ROWS ONLY`. O SQLite não aceita essas duas.
````

`content/sql/02-consultas/06-null.md`:
````markdown
# NULL: quando falta o valor

`NULL` significa **sem valor**: a informação não existe ou não foi preenchida. Na tabela `alunos`, alguns alunos não têm e-mail cadastrado:

```sql
SELECT nome, email FROM alunos;
```

As primeiras linhas do resultado:

| nome | email |
|---|---|
| Ana | ana@escola.br |
| Bruno | NULL |
| Carla | carla@escola.br |

`NULL` não é zero nem texto vazio: é a ausência de valor.

## IS NULL e IS NOT NULL

```sql
SELECT nome FROM alunos WHERE email IS NULL;
```

| nome |
|---|
| Bruno |
| Elisa |
| Heitor |

`WHERE email IS NOT NULL` traz os outros sete.

> [!CAUTION]
> `WHERE email = NULL` **não funciona**. Comparar qualquer coisa com `NULL` dá "desconhecido", que nunca é verdadeiro. A consulta roda sem erro, mas não devolve nenhuma linha. Use sempre `IS NULL`.

## NULL na ordenação

No SQLite, o `ORDER BY` coloca os `NULL` **primeiro** na ordem crescente e por último na decrescente. Para escolher, use `NULLS FIRST` ou `NULLS LAST`:

```sql
SELECT nome, email FROM alunos ORDER BY email NULLS LAST;
```

| nome | email |
|---|---|
| Ana | ana@escola.br |
| Carla | carla@escola.br |
| Diego | diego@escola.br |
| Fábio | fabio@escola.br |
| Gabriela | gabi@escola.br |
| Isadora | isa@escola.br |
| João | joao@escola.br |
| Bruno | NULL |
| Elisa | NULL |
| Heitor | NULL |

> [!NOTE]
> O PostgreSQL faz o contrário: na ordem crescente, os `NULL` vão por último. O PostgreSQL e o SQLite aceitam `NULLS FIRST` e `NULLS LAST`; o MySQL, não.
````

`content/sql/02-consultas/07-apelidos.md`:
````markdown
# Apelidos de coluna com AS

`AS` dá um **apelido** a uma coluna do resultado. É útil para colunas calculadas e para deixar o resultado mais claro:

```sql
SELECT nome AS aluno, idade + 1 AS idade_ano_que_vem FROM alunos;
```

As primeiras linhas do resultado:

| aluno | idade_ano_que_vem |
|---|---|
| Ana | 18 |
| Bruno | 17 |
| Carla | 19 |

- O apelido muda só o **resultado**; na tabela, a coluna continua se chamando `nome`.
- O `AS` é opcional: `SELECT nome aluno FROM alunos` também funciona. Com `AS`, fica mais fácil de ler.
- Apelido com espaço precisa de **aspas duplas**: `SELECT nome AS "Nome do aluno" FROM alunos`. Sem as aspas, dá erro de sintaxe.

> [!NOTE]
> Aqui as aspas duplas estão no papel certo: elas marcam um **nome** (de coluna), e não um texto.

## Usando o apelido no ORDER BY

O apelido pode ser usado para ordenar:

```sql
SELECT nome, nota * 10 AS pontos FROM alunos ORDER BY pontos DESC LIMIT 3;
```

| nome | pontos |
|---|---|
| Isadora | 100 |
| Ana | 95 |
| Elisa | 90 |
````

`content/sql/02-consultas/challenges.json`:
```json
{
  "challenges": [
    {
      "id": "sql.consultas.d01", "lesson": "colunas",
      "dataset": "escola",
      "prompt": "Liste o nome e a idade de todos os alunos.",
      "answer": "SELECT nome, idade FROM alunos;",
      "rejected": ["SELECT idade, nome FROM alunos;", "SELECT nome FROM alunos;"],
      "explanation": "As colunas vão na ordem do enunciado: primeiro `nome`, depois `idade`."
    },
    {
      "id": "sql.consultas.d02", "lesson": "colunas",
      "dataset": "escola",
      "prompt": "Mostre o nome de cada aluno e a idade que ele terá no ano que vem (a idade mais 1).",
      "answer": "SELECT nome, idade + 1 FROM alunos;",
      "accepted": ["SELECT nome, 1 + idade FROM alunos;"],
      "rejected": ["SELECT nome, idade FROM alunos;"],
      "explanation": "A conta `idade + 1` vai direto no `SELECT` e vale para cada linha."
    },
    {
      "id": "sql.consultas.d03", "lesson": "where",
      "dataset": "loja",
      "prompt": "Mostre todas as colunas dos produtos da categoria Papelaria.",
      "answer": "SELECT * FROM produtos WHERE categoria = 'Papelaria';",
      "rejected": ["SELECT * FROM produtos WHERE id IN (1, 2, 5, 8);", "SELECT * FROM produtos;"],
      "explanation": "Filtre pela regra pedida, a categoria, e não pelos `id` que aparecem na tabela: com outros dados, os `id` mudam."
    },
    {
      "id": "sql.consultas.d04", "lesson": "where",
      "dataset": "loja",
      "prompt": "Liste o nome dos produtos sem estoque (estoque igual a 0).",
      "answer": "SELECT nome FROM produtos WHERE estoque = 0;",
      "rejected": ["SELECT nome FROM produtos WHERE estoque < 10;"],
      "explanation": "`WHERE estoque = 0` fica só com o que zerou. `estoque < 10` traria também a Mochila, que ainda tem 8."
    },
    {
      "id": "sql.consultas.d05", "lesson": "e-ou",
      "dataset": "loja",
      "prompt": "Liste o nome e o preço dos produtos da categoria Eletrônicos que custam menos de 60.",
      "answer": "SELECT nome, preco FROM produtos WHERE categoria = 'Eletrônicos' AND preco < 60;",
      "rejected": ["SELECT nome, preco FROM produtos WHERE preco < 60;", "SELECT nome, preco FROM produtos WHERE categoria = 'Eletrônicos';"],
      "explanation": "As duas condições precisam valer juntas: `AND`."
    },
    {
      "id": "sql.consultas.d06", "lesson": "e-ou",
      "dataset": "escola",
      "prompt": "Liste o nome dos alunos que têm entre 16 e 17 anos (incluindo os de 16 e os de 17).",
      "answer": "SELECT nome FROM alunos WHERE idade BETWEEN 16 AND 17;",
      "accepted": ["SELECT nome FROM alunos WHERE idade >= 16 AND idade <= 17;", "SELECT nome FROM alunos WHERE idade IN (16, 17);"],
      "rejected": ["SELECT nome FROM alunos WHERE idade > 16 AND idade < 17;", "SELECT nome FROM alunos WHERE idade = 17;"],
      "explanation": "`BETWEEN 16 AND 17` inclui as pontas. Com `>` e `<`, nenhuma idade inteira caberia."
    },
    {
      "id": "sql.consultas.d07", "lesson": "like",
      "dataset": "escola",
      "prompt": "Liste o nome dos alunos cujo nome termina com a letra \"a\".",
      "answer": "SELECT nome FROM alunos WHERE nome LIKE '%a';",
      "rejected": ["SELECT nome FROM alunos WHERE nome LIKE 'a%';"],
      "explanation": "O `%` antes do \"a\" aceita qualquer começo; o \"a\" no fim do padrão exige que o nome termine assim."
    },
    {
      "id": "sql.consultas.d08", "lesson": "like",
      "dataset": "loja",
      "prompt": "Liste o nome dos produtos cujo nome tem exatamente 5 caracteres.",
      "answer": "SELECT nome FROM produtos WHERE nome LIKE '_____';",
      "rejected": ["SELECT nome FROM produtos WHERE nome LIKE '%s';", "SELECT nome FROM produtos WHERE nome LIKE '%_____%';"],
      "explanation": "Cada `_` vale exatamente um caractere, então cinco `_` exigem um nome de cinco caracteres."
    },
    {
      "id": "sql.consultas.d09", "lesson": "ordenar",
      "dataset": "escola",
      "prompt": "Liste as turmas que existem, sem repetir nenhuma.",
      "answer": "SELECT DISTINCT turma FROM alunos;",
      "rejected": ["SELECT turma FROM alunos;"],
      "explanation": "`DISTINCT` tira as repetições."
    },
    {
      "id": "sql.consultas.d10", "lesson": "ordenar",
      "dataset": "escola",
      "prompt": "Liste o nome e a nota dos alunos, em ordem alfabética de nome.",
      "answer": "SELECT nome, nota FROM alunos ORDER BY nome;",
      "ordered": true,
      "accepted": ["SELECT nome, nota FROM alunos ORDER BY nome ASC;"],
      "rejected": ["SELECT nome, nota FROM alunos ORDER BY nome DESC;", "SELECT nome, nota FROM alunos ORDER BY nota;"],
      "explanation": "`ORDER BY nome` ordena pelo nome, em ordem crescente (o `ASC` é o padrão)."
    },
    {
      "id": "sql.consultas.d11", "lesson": "ordenar",
      "dataset": "loja",
      "prompt": "Liste o nome e o preço dos 2 produtos mais baratos, do mais barato para o mais caro.",
      "answer": "SELECT nome, preco FROM produtos ORDER BY preco LIMIT 2;",
      "ordered": true,
      "rejected": ["SELECT nome, preco FROM produtos ORDER BY preco DESC LIMIT 2;", "SELECT nome, preco FROM produtos LIMIT 2;"],
      "explanation": "Primeiro ordene pelo preço, depois limite: `ORDER BY preco LIMIT 2`."
    },
    {
      "id": "sql.consultas.d12", "lesson": "null",
      "dataset": "escola",
      "prompt": "Liste o nome e o e-mail dos alunos que têm e-mail cadastrado.",
      "answer": "SELECT nome, email FROM alunos WHERE email IS NOT NULL;",
      "rejected": ["SELECT nome, email FROM alunos;", "SELECT nome, email FROM alunos WHERE email != NULL;"],
      "explanation": "`IS NOT NULL` fica com quem tem valor. Comparar com `!= NULL` não funciona: não devolve nenhuma linha."
    },
    {
      "id": "sql.consultas.d13", "lesson": "apelidos",
      "dataset": "escola",
      "prompt": "Liste os alunos com duas colunas: o nome, com o título `aluno`, e a nota, com o título `media_final`.",
      "answer": "SELECT nome AS aluno, nota AS media_final FROM alunos;",
      "columnNames": true,
      "accepted": ["SELECT nome aluno, nota media_final FROM alunos;"],
      "rejected": ["SELECT nome, nota FROM alunos;"],
      "explanation": "Cada coluna ganha seu apelido com `AS`."
    }
  ]
}
```

`content/sql/02-consultas/flashcards.json`:
```json
{
  "cards": [
    { "id": "sql.consultas.f01", "lesson": "colunas", "front": "Em que ordem as colunas aparecem no resultado?", "back": "Na ordem em que você as escreve no `SELECT`." },
    { "id": "sql.consultas.f02", "lesson": "colunas", "front": "Uma conta no SELECT, como `idade + 1`, muda a tabela?", "back": "Não. A conta acontece só no resultado, linha a linha." },
    { "id": "sql.consultas.f03", "lesson": "colunas", "front": "Quanto dá `7 / 2` no SQLite?", "back": "`3`: divisão entre inteiros descarta a parte decimal. Para `3.5`, use `7 / 2.0`." },
    { "id": "sql.consultas.f04", "lesson": "where", "front": "Para que serve o `WHERE`?", "back": "Para escolher quais linhas entram no resultado: só as que satisfazem a condição." },
    { "id": "sql.consultas.f05", "lesson": "where", "front": "Como escrever textos numa condição?", "back": "Entre aspas simples: `WHERE cidade = 'Recife'`. Aspas duplas são para nomes de colunas." },
    { "id": "sql.consultas.f06", "lesson": "e-ou", "front": "Com `AND` e `OR` sem parênteses, qual vale primeiro?", "back": "O `AND`. Use parênteses para deixar a intenção clara." },
    { "id": "sql.consultas.f07", "lesson": "e-ou", "front": "O que fazem `IN` e `BETWEEN`?", "back": "`IN (a, b)` testa se o valor está na lista. `BETWEEN x AND y` testa uma faixa, incluindo as pontas." },
    { "id": "sql.consultas.f08", "lesson": "like", "front": "O que significam `%` e `_` no `LIKE`?", "back": "`%`: qualquer quantidade de caracteres, inclusive nenhum. `_`: exatamente um caractere." },
    { "id": "sql.consultas.f09", "lesson": "ordenar", "front": "O que o `DISTINCT` faz?", "back": "Tira do resultado as linhas repetidas." },
    { "id": "sql.consultas.f10", "lesson": "ordenar", "front": "Como ordenar do maior para o menor?", "back": "`ORDER BY coluna DESC`. Sem `DESC` (ou com `ASC`), a ordem é crescente." },
    { "id": "sql.consultas.f11", "lesson": "ordenar", "front": "Como pegar só as primeiras linhas do resultado?", "back": "`LIMIT n` (com `OFFSET` para pular linhas). Ordene antes com `ORDER BY`. No SQL Server, usa-se `TOP`." },
    { "id": "sql.consultas.f12", "lesson": "null", "front": "Como encontrar valores ausentes (NULL)?", "back": "Com `IS NULL` (ou `IS NOT NULL`). `= NULL` nunca dá verdadeiro." },
    { "id": "sql.consultas.f13", "lesson": "apelidos", "front": "Para que serve o `AS`?", "back": "Para dar um apelido a uma coluna do resultado: `SELECT nome AS aluno`. Com espaço, use aspas duplas." }
  ]
}
```

`content/sql/02-consultas/questions.json`:
```json
{
  "questions": [
    {
      "id": "sql.consultas.q01", "type": "sql", "difficulty": 1, "lesson": "colunas",
      "dataset": "escola",
      "prompt": "Liste o nome e a turma de cada aluno.",
      "answer": "SELECT nome, turma FROM alunos;",
      "rejected": ["SELECT turma FROM alunos;", "SELECT nome, cidade FROM alunos;"],
      "explanation": "As colunas pedidas vão no `SELECT`, na ordem do enunciado: primeiro `nome`, depois `turma`."
    },
    {
      "id": "sql.consultas.q02", "type": "multiple", "difficulty": 2, "lesson": "colunas",
      "prompt": "O que `SELECT nome, idade + 1 FROM alunos;` faz?",
      "options": ["Mostra o nome e a idade somada de 1, sem mudar a tabela", "Soma 1 à idade guardada na tabela", "Dá erro: não dá para fazer contas no SELECT", "Mostra só os alunos com 1 ano"], "answer": 0,
      "explanation": "A conta acontece só no resultado, linha a linha. Para mudar os dados guardados, seria preciso um `UPDATE`, assunto do módulo 6."
    },
    {
      "id": "sql.consultas.q03", "type": "sql", "difficulty": 1, "lesson": "where",
      "dataset": "escola",
      "prompt": "Liste o nome dos alunos de Recife.",
      "answer": "SELECT nome FROM alunos WHERE cidade = 'Recife';",
      "accepted": ["SELECT nome FROM alunos WHERE 'Recife' = cidade;"],
      "rejected": ["SELECT nome FROM alunos WHERE id IN (1, 3, 7);", "SELECT nome FROM alunos WHERE cidade = 'recife';"],
      "explanation": "O texto vai entre aspas simples e com as maiúsculas certas: no SQLite, `'recife'` não encontra `Recife`."
    },
    {
      "id": "sql.consultas.q04", "type": "truefalse", "difficulty": 2, "lesson": "where",
      "prompt": "No SQLite, `WHERE cidade = 'recife'` encontra as linhas em que a cidade é `Recife`.",
      "answer": false,
      "explanation": "O `=` entre textos diferencia maiúsculas de minúsculas no SQLite: `'recife'` e `'Recife'` são textos diferentes, e a consulta não devolve nenhuma linha."
    },
    {
      "id": "sql.consultas.q05", "type": "multiple", "difficulty": 1, "lesson": "where",
      "prompt": "Qual destes operadores significa \"diferente de\" em SQL?",
      "options": ["`<>`", "`=!`", "`><`", "`=<>`"], "answer": 0,
      "explanation": "`<>` é o operador de diferente do padrão SQL. O SQLite também aceita `!=`."
    },
    {
      "id": "sql.consultas.q06", "type": "sql", "difficulty": 2, "lesson": "where",
      "dataset": "escola",
      "prompt": "Liste o nome e a nota dos alunos com nota maior ou igual a 8.",
      "answer": "SELECT nome, nota FROM alunos WHERE nota >= 8;",
      "accepted": ["SELECT nome, nota FROM alunos WHERE NOT nota < 8;", "SELECT nome, nota FROM alunos WHERE 8 <= nota;"],
      "rejected": ["SELECT nome, nota FROM alunos WHERE nota > 8;"],
      "explanation": "`>=` inclui o próprio 8: com `>`, a Carla, que tem nota 8, ficaria de fora."
    },
    {
      "id": "sql.consultas.q07", "type": "sql", "difficulty": 2, "lesson": "e-ou",
      "dataset": "escola",
      "prompt": "Liste o nome dos alunos de Natal que têm nota maior que 6.",
      "answer": "SELECT nome FROM alunos WHERE cidade = 'Natal' AND nota > 6;",
      "rejected": ["SELECT nome FROM alunos WHERE cidade = 'Natal' OR nota > 6;", "SELECT nome FROM alunos WHERE cidade = 'Natal';"],
      "explanation": "As duas condições precisam valer ao mesmo tempo, então é `AND`. Com `OR`, entrariam todos de Natal e todos com nota acima de 6."
    },
    {
      "id": "sql.consultas.q08", "type": "multiple", "difficulty": 3, "lesson": "e-ou",
      "prompt": "Numa condição com `AND` e `OR` e sem parênteses, o que o SQL avalia primeiro?",
      "options": ["O `AND`", "O `OR`", "O que aparece primeiro na linha", "O que estiver mais à direita"], "answer": 0,
      "explanation": "O `AND` tem precedência sobre o `OR`, como a multiplicação sobre a soma. Para mudar a ordem, use parênteses."
    },
    {
      "id": "sql.consultas.q09", "type": "fill", "difficulty": 1, "lesson": "e-ou",
      "prompt": "Complete para listar os alunos de Recife ou de Natal:",
      "code": "SELECT nome FROM alunos WHERE cidade ___ ('Recife', 'Natal');",
      "blanks": [["IN"]], "caseInsensitive": true,
      "explanation": "`IN` testa se o valor está na lista. Equivale a `cidade = 'Recife' OR cidade = 'Natal'`."
    },
    {
      "id": "sql.consultas.q10", "type": "truefalse", "difficulty": 2, "lesson": "e-ou",
      "prompt": "`WHERE nota BETWEEN 7 AND 9` inclui as notas 7 e 9.",
      "answer": true,
      "explanation": "`BETWEEN` inclui as pontas: é o mesmo que `nota >= 7 AND nota <= 9`."
    },
    {
      "id": "sql.consultas.q11", "type": "sql", "difficulty": 3, "lesson": "e-ou",
      "dataset": "escola",
      "prompt": "Liste o nome dos alunos de Natal ou de Fortaleza que têm nota maior que 7.",
      "answer": "SELECT nome FROM alunos WHERE (cidade = 'Natal' OR cidade = 'Fortaleza') AND nota > 7;",
      "accepted": ["SELECT nome FROM alunos WHERE cidade IN ('Natal', 'Fortaleza') AND nota > 7;"],
      "rejected": ["SELECT nome FROM alunos WHERE cidade = 'Natal' OR cidade = 'Fortaleza' AND nota > 7;"],
      "explanation": "Sem parênteses, o `AND` vale antes do `OR`, e entrariam todos os alunos de Natal. Os parênteses (ou o `IN`) agrupam as cidades."
    },
    {
      "id": "sql.consultas.q12", "type": "sql", "difficulty": 2, "lesson": "like",
      "dataset": "loja",
      "prompt": "Liste o nome dos produtos cujo nome começa com \"Ca\".",
      "answer": "SELECT nome FROM produtos WHERE nome LIKE 'Ca%';",
      "accepted": ["SELECT nome FROM produtos WHERE nome LIKE 'ca%';"],
      "rejected": ["SELECT nome FROM produtos WHERE nome LIKE '%Ca%';", "SELECT nome FROM produtos WHERE nome LIKE 'Ca';"],
      "explanation": "`'Ca%'` exige o \"Ca\" no começo e aceita qualquer coisa depois. Com `'%Ca%'`, entraria também um nome com \"ca\" no meio, como Garrafa térmica."
    },
    {
      "id": "sql.consultas.q13", "type": "multiple", "difficulty": 2, "lesson": "like",
      "prompt": "Num padrão de `LIKE`, o que o `_` significa?",
      "options": ["Exatamente um caractere qualquer", "Qualquer quantidade de caracteres", "Um espaço em branco", "O fim do texto"], "answer": 0,
      "explanation": "`_` vale um caractere; `%` vale qualquer quantidade, inclusive nenhum."
    },
    {
      "id": "sql.consultas.q14", "type": "truefalse", "difficulty": 3, "lesson": "like",
      "prompt": "No SQLite, `WHERE nome LIKE 'ana%'` também encontra o nome `Ana`.",
      "answer": true,
      "explanation": "No SQLite, o `LIKE` não diferencia maiúsculas de minúsculas nas letras sem acento. Já no PostgreSQL, diferencia (lá existe o `ILIKE` para ignorar)."
    },
    {
      "id": "sql.consultas.q15", "type": "sql", "difficulty": 2, "lesson": "ordenar",
      "dataset": "loja",
      "prompt": "Liste o nome e o preço dos produtos, do mais caro para o mais barato.",
      "answer": "SELECT nome, preco FROM produtos ORDER BY preco DESC;",
      "ordered": true,
      "rejected": ["SELECT nome, preco FROM produtos ORDER BY preco;", "SELECT nome, preco FROM produtos;"],
      "explanation": "`ORDER BY preco DESC` ordena do maior para o menor. Sem `DESC`, a ordem seria crescente."
    },
    {
      "id": "sql.consultas.q16", "type": "sql", "difficulty": 3, "lesson": "ordenar",
      "dataset": "escola",
      "prompt": "Liste o nome dos 3 alunos com as maiores notas, da maior para a menor.",
      "answer": "SELECT nome FROM alunos ORDER BY nota DESC LIMIT 3;",
      "ordered": true,
      "rejected": ["SELECT nome FROM alunos ORDER BY nota LIMIT 3;", "SELECT nome FROM alunos WHERE nota >= 9 ORDER BY nota DESC;"],
      "explanation": "Primeiro ordene pela nota em ordem decrescente e depois pegue as 3 primeiras linhas com `LIMIT 3`. Filtrar por `nota >= 9` só dá certo se, por acaso, houver exatamente 3 notas assim."
    },
    {
      "id": "sql.consultas.q17", "type": "fill", "difficulty": 1, "lesson": "ordenar",
      "prompt": "Complete para listar as cidades dos alunos sem repetir nenhuma:",
      "code": "SELECT ___ cidade FROM alunos;",
      "blanks": [["DISTINCT"]], "caseInsensitive": true,
      "explanation": "`DISTINCT` tira as linhas repetidas do resultado."
    },
    {
      "id": "sql.consultas.q18", "type": "multiple", "difficulty": 2, "lesson": "ordenar",
      "prompt": "No SQLite, qual cláusula limita a quantidade de linhas do resultado?",
      "options": ["`LIMIT`", "`TOP`", "`MAX`", "`COUNT`"], "answer": 0,
      "explanation": "`LIMIT` vale no SQLite, no MySQL e no PostgreSQL. `TOP` é do SQL Server e dá erro no SQLite; `MAX` e `COUNT` são funções de agrupamento, do módulo 3."
    },
    {
      "id": "sql.consultas.q19", "type": "order", "difficulty": 2, "lesson": "ordenar",
      "prompt": "Monte a consulta que lista nome e nota dos 2 alunos com as maiores notas da turma 2A:",
      "lines": ["SELECT nome, nota", "FROM alunos", "WHERE turma = '2A'", "ORDER BY nota DESC", "LIMIT 2;"],
      "explanation": "As cláusulas têm ordem fixa: `SELECT`, `FROM`, `WHERE`, `ORDER BY` e `LIMIT`."
    },
    {
      "id": "sql.consultas.q20", "type": "sql", "difficulty": 2, "lesson": "null",
      "dataset": "escola",
      "prompt": "Liste o nome dos alunos que não têm e-mail cadastrado.",
      "answer": "SELECT nome FROM alunos WHERE email IS NULL;",
      "rejected": ["SELECT nome FROM alunos WHERE email = NULL;", "SELECT nome FROM alunos WHERE id IN (2, 5, 8);"],
      "explanation": "Para achar valores ausentes, use `IS NULL`. Com `= NULL`, a consulta não devolve nenhuma linha."
    },
    {
      "id": "sql.consultas.q21", "type": "truefalse", "difficulty": 2, "lesson": "null",
      "prompt": "`WHERE email = NULL` encontra as linhas em que o e-mail é NULL.",
      "answer": false,
      "explanation": "Comparar com `NULL` usando `=` nunca dá verdadeiro, então a consulta não devolve linhas. O certo é `WHERE email IS NULL`."
    },
    {
      "id": "sql.consultas.q22", "type": "multiple", "difficulty": 3, "lesson": "null",
      "prompt": "No SQLite, com `ORDER BY email` (ordem crescente), onde ficam as linhas com e-mail NULL?",
      "options": ["No começo", "No fim", "Somem do resultado", "A consulta dá erro"], "answer": 0,
      "explanation": "O SQLite põe os `NULL` primeiro na ordem crescente. O PostgreSQL faz o contrário. Para escolher, use `NULLS FIRST` ou `NULLS LAST`."
    },
    {
      "id": "sql.consultas.q23", "type": "sql", "difficulty": 2, "lesson": "apelidos",
      "dataset": "loja",
      "prompt": "Liste os produtos com duas colunas: o nome, com o título `produto`, e o preço, com o título `valor`.",
      "answer": "SELECT nome AS produto, preco AS valor FROM produtos;",
      "columnNames": true,
      "accepted": ["SELECT nome produto, preco valor FROM produtos;"],
      "rejected": ["SELECT nome, preco FROM produtos;"],
      "explanation": "`AS` dá o apelido à coluna do resultado. O `AS` é opcional, mas deixa a consulta mais clara."
    },
    {
      "id": "sql.consultas.q24", "type": "fill", "difficulty": 1, "lesson": "apelidos",
      "prompt": "Complete para que a coluna calculada se chame `idade_ano_que_vem`:",
      "code": "SELECT nome, idade + 1 ___ idade_ano_que_vem FROM alunos;",
      "blanks": [["AS"]], "caseInsensitive": true,
      "explanation": "`AS` dá um apelido à coluna. Sem ele, a coluna se chamaria `idade + 1`."
    },
    {
      "id": "sql.consultas.q25", "type": "truefalse", "difficulty": 2, "lesson": "apelidos",
      "prompt": "Um apelido com espaço, como `Nome do aluno`, precisa ficar entre aspas duplas.",
      "answer": true,
      "explanation": "`SELECT nome AS \"Nome do aluno\" FROM alunos` funciona. Sem as aspas, o banco entende só `Nome` como apelido e acusa erro de sintaxe no `do`."
    }
  ]
}
```

- [ ] **Step 3: Trechos conferidos das aulas**

`verify/sql/consultas/apelidos-as.sql`:
```sql
-- verifica: f13 e a aula apelidos (AS)
-- banco: escola
-- saida:
-- aluno | idade_ano_que_vem
-- Ana | 18
-- Bruno | 17
-- Carla | 19
SELECT nome AS aluno, idade + 1 AS idade_ano_que_vem FROM alunos LIMIT 3;
```

`verify/sql/consultas/apelidos-espaco-erro.sql`:
```sql
-- verifica: sql.consultas.q25 e a aula apelidos (sem as aspas, erro de sintaxe no do)
-- banco: escola
-- espera: erro near "do": syntax error
SELECT nome AS Nome do aluno FROM alunos;
```

`verify/sql/consultas/apelidos-espaco.sql`:
```sql
-- verifica: sql.consultas.q25 e a aula apelidos (apelido com espaço entre aspas duplas)
-- banco: escola
-- saida:
-- Nome do aluno
-- Ana
SELECT nome AS "Nome do aluno" FROM alunos LIMIT 1;
```

`verify/sql/consultas/apelidos-order-by.sql`:
```sql
-- verifica: a aula apelidos (apelido no ORDER BY)
-- banco: escola
-- saida:
-- nome | pontos
-- Isadora | 100
-- Ana | 95
-- Elisa | 90
SELECT nome, nota * 10 AS pontos FROM alunos ORDER BY pontos DESC LIMIT 3;
```

`verify/sql/consultas/apelidos-sem-as.sql`:
```sql
-- verifica: a aula apelidos (o AS é opcional)
-- banco: escola
-- saida:
-- aluno
-- Ana
SELECT nome aluno FROM alunos LIMIT 1;
```

`verify/sql/consultas/apelidos-tabela-nao-muda.sql`:
```sql
-- verifica: a aula apelidos (na tabela, a coluna continua se chamando nome)
-- banco: escola
-- saida:
-- nome
-- Ana
SELECT nome AS aluno FROM alunos;
SELECT nome FROM alunos WHERE id = 1;
```

`verify/sql/consultas/colunas-conta.sql`:
```sql
-- verifica: sql.consultas.q02 e a aula colunas (conta no SELECT; o nome da coluna é a conta)
-- banco: escola
-- saida:
-- nome | idade | idade + 1
-- Ana | 17 | 18
-- Bruno | 16 | 17
-- Carla | 18 | 19
SELECT nome, idade, idade + 1 FROM alunos LIMIT 3;
```

`verify/sql/consultas/colunas-divisao.sql`:
```sql
-- verifica: f03 e o alerta da aula colunas (divisão entre inteiros)
-- banco: vazio
-- saida:
-- 7 / 2 | 7 / 2.0
-- 3 | 3.5
SELECT 7 / 2, 7 / 2.0;
```

`verify/sql/consultas/colunas-ordem.sql`:
```sql
-- verifica: f01 e a aula colunas (a ordem do SELECT é a ordem do resultado)
-- banco: escola
-- saida:
-- turma | nome
-- 2A | Ana
-- 1B | Bruno
SELECT turma, nome FROM alunos LIMIT 2;
```

`verify/sql/consultas/colunas-tabela-nao-muda.sql`:
```sql
-- verifica: f02 e a aula colunas (a conta não muda a tabela)
-- banco: escola
-- saida:
-- idade
-- 17
SELECT idade + 1 FROM alunos;
SELECT idade FROM alunos WHERE id = 1;
```

`verify/sql/consultas/colunas-valor-fixo.sql`:
```sql
-- verifica: a aula colunas (valor fixo se repete em todas as linhas)
-- banco: escola
-- saida:
-- nome | 'aluno'
-- Ana | aluno
-- Bruno | aluno
SELECT nome, 'aluno' FROM alunos LIMIT 2;
```

`verify/sql/consultas/e-ou-and.sql`:
```sql
-- verifica: a aula e-ou (AND)
-- banco: escola
-- saida:
-- nome | cidade | nota
-- Ana | Recife | 9.5
-- Gabriela | Recife | 8.5
SELECT nome, cidade, nota FROM alunos
WHERE cidade = 'Recife' AND nota >= 8.5;
```

`verify/sql/consultas/e-ou-between-equivale.sql`:
```sql
-- verifica: a aula e-ou (BETWEEN é o mesmo que >= e <=, em todas as linhas)
-- banco: escola
-- saida:
-- iguais
-- 10
SELECT count(*) AS iguais FROM alunos
WHERE (nota BETWEEN 7 AND 8) = (nota >= 7 AND nota <= 8);
```

`verify/sql/consultas/e-ou-between.sql`:
```sql
-- verifica: sql.consultas.q10, f07 e a aula e-ou (BETWEEN inclui as pontas)
-- banco: escola
-- saida:
-- nome | nota
-- Carla | 8
-- Diego | 7.5
-- João | 7
SELECT nome, nota FROM alunos WHERE nota BETWEEN 7 AND 8;
```

`verify/sql/consultas/e-ou-com-parenteses.sql`:
```sql
-- verifica: a aula e-ou (com parênteses)
-- banco: escola
-- saida:
-- nome
-- Carla
-- Fábio
-- Isadora
SELECT nome FROM alunos
WHERE (cidade = 'Recife' OR cidade = 'Salvador') AND idade = 18;
```

`verify/sql/consultas/e-ou-in.sql`:
```sql
-- verifica: f07 e a aula e-ou (IN)
-- banco: escola
-- saida:
-- nome | cidade
-- Bruno | Natal
-- Diego | Fortaleza
-- Elisa | Natal
-- Heitor | Fortaleza
-- João | Natal
SELECT nome, cidade FROM alunos WHERE cidade IN ('Natal', 'Fortaleza');
```

`verify/sql/consultas/e-ou-not-in-between.sql`:
```sql
-- verifica: a aula e-ou (NOT IN e NOT BETWEEN)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Fábio
-- Isadora
SELECT nome FROM alunos
WHERE cidade NOT IN ('Natal', 'Fortaleza') AND nota NOT BETWEEN 7 AND 9;
```

`verify/sql/consultas/e-ou-not.sql`:
```sql
-- verifica: a aula e-ou (NOT: todos menos os de Natal)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Carla
-- Diego
-- Fábio
-- Gabriela
-- Heitor
-- Isadora
SELECT nome FROM alunos WHERE NOT cidade = 'Natal';
```

`verify/sql/consultas/e-ou-sem-parenteses.sql`:
```sql
-- verifica: sql.consultas.q08, f06 e a aula e-ou (sem parênteses, o AND vale antes)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Carla
-- Fábio
-- Gabriela
-- Isadora
SELECT nome FROM alunos
WHERE cidade = 'Recife' OR cidade = 'Salvador' AND idade = 18;
```

`verify/sql/consultas/like-ca.sql`:
```sql
-- verifica: a aula like (começa com Ca)
-- banco: loja
-- saida:
-- nome
-- Caderno
-- Caneta azul
-- Carregador
SELECT nome FROM produtos WHERE nome LIKE 'Ca%';
```

`verify/sql/consultas/like-cinco.sql`:
```sql
-- verifica: sql.consultas.q13 e a tabela da aula like (cinco _ valem cinco caracteres)
-- banco: loja
-- saida:
-- nome
-- Lápis
SELECT nome FROM produtos WHERE nome LIKE '_____';
```

`verify/sql/consultas/like-de.sql`:
```sql
-- verifica: a tabela da aula like (tem de em qualquer lugar)
-- banco: loja
-- saida:
-- nome
-- Caderno
-- Fone de ouvido
SELECT nome FROM produtos WHERE nome LIKE '%de%';
```

`verify/sql/consultas/like-maiusculas.sql`:
```sql
-- verifica: a nota da aula like (sem acento não diferencia; com acento, diferencia)
-- banco: vazio
-- saida:
-- sem_acento | acentuada
-- 1 | 0
SELECT 'Caderno' LIKE 'ca%' AS sem_acento, 'Ábaco' LIKE 'á%' AS acentuada;
```

`verify/sql/consultas/like-not.sql`:
```sql
-- verifica: a aula like (NOT LIKE fica com os que não combinam)
-- banco: loja
-- saida:
-- nome
-- Caneta azul
-- Garrafa térmica
-- Lápis
SELECT nome FROM produtos WHERE nome NOT LIKE '%o%';
```

`verify/sql/consultas/like-termina-a.sql`:
```sql
-- verifica: a tabela da aula like (termina com a)
-- banco: loja
-- saida:
-- nome
-- Mochila
-- Garrafa térmica
SELECT nome FROM produtos WHERE nome LIKE '%a';
```

`verify/sql/consultas/null-igual.sql`:
```sql
-- verifica: sql.consultas.q21 e o alerta da aula null (= NULL não devolve linhas)
-- banco: escola
-- saida:
-- nome
SELECT nome FROM alunos WHERE email = NULL;
```

`verify/sql/consultas/null-is-not-null.sql`:
```sql
-- verifica: a aula null (IS NOT NULL traz os outros sete)
-- banco: escola
-- saida:
-- total
-- 7
SELECT count(*) AS total FROM alunos WHERE email IS NOT NULL;
```

`verify/sql/consultas/null-is-null.sql`:
```sql
-- verifica: f12 e a aula null (IS NULL)
-- banco: escola
-- saida:
-- nome
-- Bruno
-- Elisa
-- Heitor
SELECT nome FROM alunos WHERE email IS NULL;
```

`verify/sql/consultas/null-nulls-last.sql`:
```sql
-- verifica: a aula null (NULLS LAST)
-- banco: escola
-- saida:
-- nome | email
-- Ana | ana@escola.br
-- Carla | carla@escola.br
-- Diego | diego@escola.br
-- Fábio | fabio@escola.br
-- Gabriela | gabi@escola.br
-- Isadora | isa@escola.br
-- João | joao@escola.br
-- Bruno | NULL
-- Elisa | NULL
-- Heitor | NULL
SELECT nome, email FROM alunos ORDER BY email NULLS LAST;
```

`verify/sql/consultas/null-ordem-crescente.sql`:
```sql
-- verifica: sql.consultas.q22 e a aula null (NULL primeiro na ordem crescente)
-- banco: escola
-- saida:
-- email
-- NULL
-- NULL
-- NULL
-- ana@escola.br
SELECT email FROM alunos ORDER BY email LIMIT 4;
```

`verify/sql/consultas/null-ordem-decrescente.sql`:
```sql
-- verifica: a aula null (NULL por último na ordem decrescente)
-- banco: escola
-- saida:
-- email
-- joao@escola.br
-- isa@escola.br
-- gabi@escola.br
-- fabio@escola.br
-- diego@escola.br
-- carla@escola.br
-- ana@escola.br
-- NULL
-- NULL
-- NULL
SELECT email FROM alunos ORDER BY email DESC;
```

`verify/sql/consultas/null-tres.sql`:
```sql
-- verifica: a aula null (as primeiras linhas de nome e email)
-- banco: escola
-- saida:
-- nome | email
-- Ana | ana@escola.br
-- Bruno | NULL
-- Carla | carla@escola.br
SELECT nome, email FROM alunos LIMIT 3;
```

`verify/sql/consultas/ordenar-cidade-nome.sql`:
```sql
-- verifica: a aula ordenar (ordenar por duas colunas)
-- banco: escola
-- saida:
-- cidade | nome
-- Fortaleza | Diego
-- Fortaleza | Heitor
-- Natal | Bruno
-- Natal | Elisa
-- Natal | João
-- Recife | Ana
-- Recife | Carla
-- Recife | Gabriela
-- Salvador | Fábio
-- Salvador | Isadora
SELECT cidade, nome FROM alunos ORDER BY cidade, nome;
```

`verify/sql/consultas/ordenar-distinct-combinacao.sql`:
```sql
-- verifica: a aula ordenar (DISTINCT com duas colunas olha a combinação)
-- banco: escola
-- saida:
-- cidade | turma
-- Recife | 2A
-- Natal | 1B
-- Recife | 3A
-- Fortaleza | 2A
-- Salvador | 3A
-- Fortaleza | 1B
-- Natal | 2A
SELECT DISTINCT cidade, turma FROM alunos;
```

`verify/sql/consultas/ordenar-distinct.sql`:
```sql
-- verifica: f09 e a aula ordenar (DISTINCT)
-- banco: escola
-- saida:
-- cidade
-- Recife
-- Natal
-- Fortaleza
-- Salvador
SELECT DISTINCT cidade FROM alunos;
```

`verify/sql/consultas/ordenar-fetch-erro.sql`:
```sql
-- verifica: a nota da aula ordenar (o SQLite não aceita FETCH FIRST)
-- banco: loja
-- espera: erro
SELECT nome FROM produtos ORDER BY preco FETCH FIRST 3 ROWS ONLY;
```

`verify/sql/consultas/ordenar-limit.sql`:
```sql
-- verifica: f11 e a aula ordenar (os 3 mais baratos)
-- banco: loja
-- saida:
-- nome | preco
-- Lápis | 1.2
-- Caneta azul | 2.5
-- Caderno | 18.9
SELECT nome, preco FROM produtos ORDER BY preco LIMIT 3;
```

`verify/sql/consultas/ordenar-nota-desc.sql`:
```sql
-- verifica: f10 e a aula ordenar (ORDER BY ... DESC)
-- banco: escola
-- saida:
-- nome | nota
-- Isadora | 10
-- Ana | 9.5
-- Elisa | 9
-- Gabriela | 8.5
-- Carla | 8
-- Diego | 7.5
-- João | 7
-- Bruno | 6
-- Fábio | 5.5
-- Heitor | 4
SELECT nome, nota FROM alunos ORDER BY nota DESC;
```

`verify/sql/consultas/ordenar-offset.sql`:
```sql
-- verifica: f11 e a aula ordenar (OFFSET pula linhas)
-- banco: loja
-- saida:
-- nome | preco
-- Estojo | 24.9
-- Carregador | 49.9
-- Garrafa térmica | 59.9
SELECT nome, preco FROM produtos ORDER BY preco LIMIT 3 OFFSET 3;
```

`verify/sql/consultas/ordenar-top-erro.sql`:
```sql
-- verifica: sql.consultas.q18 e a nota da aula ordenar (o SQLite não aceita TOP)
-- banco: loja
-- espera: erro
SELECT TOP 3 nome FROM produtos;
```

`verify/sql/consultas/q14-like-ana.sql`:
```sql
-- verifica: sql.consultas.q14 (LIKE 'ana%' encontra Ana)
-- banco: escola
-- saida:
-- nome
-- Ana
SELECT nome FROM alunos WHERE nome LIKE 'ana%';
```

`verify/sql/consultas/q19-ordem.sql`:
```sql
-- verifica: sql.consultas.q19 (a ordem montada roda)
-- banco: escola
-- saida:
-- nome | nota
-- Ana | 9.5
-- Gabriela | 8.5
SELECT nome, nota
FROM alunos
WHERE turma = '2A'
ORDER BY nota DESC
LIMIT 2;
```

`verify/sql/consultas/where-aspas-duplas.sql`:
```sql
-- verifica: o aviso da aula where (o SQLite aceita aspas duplas como texto)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Carla
-- Gabriela
SELECT nome FROM alunos WHERE cidade = "Recife";
```

`verify/sql/consultas/where-diferente.sql`:
```sql
-- verifica: sql.consultas.q05 e a tabela da aula where (<> e != significam diferente)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Diego
-- Gabriela
-- João
SELECT nome FROM alunos WHERE turma <> '1B' AND turma != '3A';
```

`verify/sql/consultas/where-minusculas.sql`:
```sql
-- verifica: sql.consultas.q04 e a aula where (= diferencia maiúsculas)
-- banco: escola
-- saida:
-- nome
SELECT nome FROM alunos WHERE cidade = 'recife';
```

`verify/sql/consultas/where-nota.sql`:
```sql
-- verifica: a aula where (nota maior que 9)
-- banco: escola
-- saida:
-- nome | nota
-- Ana | 9.5
-- Isadora | 10
SELECT nome, nota FROM alunos WHERE nota > 9;
```

`verify/sql/consultas/where-recife.sql`:
```sql
-- verifica: f05 e a aula where (texto entre aspas simples)
-- banco: escola
-- saida:
-- nome
-- Ana
-- Carla
-- Gabriela
SELECT nome FROM alunos WHERE cidade = 'Recife';
```

- [ ] **Step 4: Rodar tudo**

Run: `npm test`
Expected: PASS, com os 23 exercícios de `sql.consultas.*` (10 perguntas `sql` e 13 desafios) e os 47 trechos de `verify/sql/consultas`.

- [ ] **Step 5: Commit**

```bash
git add content verify
git commit -m "Adiciona SQL › Consultas básicas" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Fechamento: teste de fumaça, README e roteiro manual

**Files:**
- Modify: `tests/data/content-real.test.js`, `README.md`, `docs/verificacao-manual.md`

**Interfaces:**
- Consumes: `loadChallenges` e `loadDataset` (Task 3), o conteúdo das Tasks 8 e 9.
- Produces: o teste de fumaça do SQL real, os créditos (SQL Teaching, sql.js, SQLite, marked e highlight.js) e a seção de SQL no roteiro manual.

- [ ] **Step 1: Teste de fumaça do SQL real**

Substitua o conteúdo de `tests/data/content-real.test.js` por:
```js
// Teste de fumaça com o conteúdo de verdade (sem a fixture da Task 2): a ordem dos módulos
// e o carregamento de todas as aulas e bancos, do jeito que o site faz.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import { loadLanguages, loadModuleBank, loadLesson, loadChallenges, loadDataset } from '../../js/data/content.js';

installFetchFromDisk({ overlay: false });

const java = async () => (await loadLanguages()).find((l) => l.id === 'java');

test('Java tem os sete módulos da especificação, na ordem', async () => {
  assert.deepEqual((await java()).modules.map((m) => m.id), ['introducao', 'fundamentos', 'poo', 'colecoes', 'excecoes', 'strings', 'java-moderno']);
});

test('toda aula carrega e começa por um título; todo banco carrega com as chaves do módulo', async () => {
  const lang = await java();
  for (const module of lang.modules) {
    for (const lesson of module.lessons) {
      assert.match(await loadLesson(lang, module, lesson), /^# \S/, `${module.id}/${lesson.id}`);
    }
    const bank = await loadModuleBank(lang, module);
    assert.ok(bank.questions.length >= 12, module.id);
    assert.ok(bank.questions.every((q) => q.module === module.key && q.id.startsWith(`${module.key}.q`)), module.id);
    assert.ok(bank.cards.every((c) => c.module === module.key && c.id.startsWith(`${module.key}.f`)), module.id);
  }
});

test('SQL tem os módulos da etapa SQL-A; toda aula carrega e tem desafio; os desafios acham os bancos', async () => {
  const sql = (await loadLanguages()).find((l) => l.id === 'sql');
  assert.equal(sql.engine, 'sqlite');
  assert.deepEqual(sql.modules.map((m) => m.id), ['introducao', 'consultas']);
  for (const module of sql.modules) {
    const challenges = await loadChallenges(sql, module);
    for (const lesson of module.lessons) {
      assert.match(await loadLesson(sql, module, lesson), /^# \S/, `${module.id}/${lesson.id}`);
      assert.ok(challenges.some((c) => c.lesson === lesson.id), `${module.id}/${lesson.id} sem desafio`);
    }
    for (const c of challenges) assert.match((await loadDataset(sql, c.dataset)).schema, /CREATE TABLE/, c.id);
  }
});
```

Run: `node --test tests/data/content-real.test.js`
Expected: PASS. Este teste trava o resultado das Tasks 8 e 9, por isso passa de primeira. Para ver que ele pega o erro, apague temporariamente o desafio `sql.consultas.d13` de `content/sql/02-consultas/challenges.json` e rode de novo. Expected: FAIL em "SQL tem os módulos...", com `consultas/apelidos sem desafio`. Desfaça com `git checkout content/sql/02-consultas/challenges.json`.

- [ ] **Step 2: Documentação**

Substitua o conteúdo de `README.md` por:
````markdown
# Central de Linguagens

Central gratuita e didática para aprender programação: aulas curtas, quizzes com perguntas aleatórias, flashcards com repetição espaçada, perfil com progresso, conquistas e certificado. Tudo roda no navegador; o progresso fica salvo no aparelho de cada pessoa, com backup manual e automático.

Inspirada no trabalho de Gustavo Guanabara de abrir portas para quem está começando. Sem fins comerciais.

## Rodar no seu computador

```bash
python -m http.server 8000
```

Abra `http://localhost:8000/`. Abrir o `index.html` com dois cliques não funciona: o navegador bloqueia o carregamento do conteúdo fora de um servidor.

## Testes

```bash
npm install   # só na primeira vez: instala as ferramentas de teste
npm test
```

Toda função do site tem teste automático: as regras (`tests/core`), a camada de dados (`tests/data`), as telas e componentes (`tests/ui`, com o navegador simulado pelo jsdom) e o validador de conteúdo (`tests/content.test.js`). O teste `tests/meta/exports-covered.test.js` falha se alguém criar uma função exportada sem teste.

Os testes de telas e da camada de dados leem um catálogo e um manifesto de Java congelados, em `tests/fixtures/content/` (só Java › Fundamentos), para não quebrarem quando o curso cresce. As telas de SQL usam um mini-curso próprio, em `tests/fixtures/sql-ui/`. O conteúdo real é conferido pelo validador (`tests/content.test.js`) e por um teste de fumaça que carrega todos os módulos de verdade (`tests/data/content-real.test.js`).

Os exercícios de SQL rodam no sql.js, o mesmo SQLite do site, instalado como dependência de teste. O `npm test` roda cada resposta de referência, cada forma aceita e cada forma recusada (`tests/content-sql.test.js`) e confere os resultados citados nas aulas, guardados em `verify/sql/` (`tests/sql-snippets.test.js`). O formato desses trechos está no começo de `tools/verify-sql-format.mjs`.

O site em si não tem dependências nem etapa de build: o `npm install` só serve para os testes.

## Conferir os códigos Java

Todo trecho Java citado nas aulas e perguntas (saídas, erros de compilação, exceções) tem uma cópia executável em `verify/java/`. Para conferir, é preciso o JDK 21:

```powershell
$env:JAVA_HOME = "C:\caminho\para\jdk-21"
node tools/verify-java.mjs
```

Cada trecho começa com um cabeçalho de comentários:

```java
// verifica: o que este trecho prova (ids de perguntas, cartas ou aulas)
// modo: javac                 (opcional: compila de verdade; o nome do arquivo importa)
// classe: Ola                 (obrigatório no modo javac quando o trecho executa)
// erro-contem: texto          (opcional: trecho que a mensagem de erro precisa ter)
// espera: erro-de-compilacao  (ou: // espera: excecao NomeDaExcecao)
// saida:                      (alternativa ao "espera"; sempre a última diretiva)
// linha 1 esperada
// linha 2 esperada
```

No modo padrão (`java Arquivo.java`), o Java executa a **primeira** classe do arquivo, então `class Main` vem primeiro.

## Como o conteúdo é organizado

```
content/
  catalog.json                 lista de linguagens
  achievements.json            textos das conquistas
  <linguagem>/
    language.json              nome, cor, ícone e módulos (com as aulas de cada um)
    referencia.md              referência rápida
    datasets/<id>/             só em linguagens com banco (SQL): schema.sql, data.sql e hidden-data.sql
    <NN-modulo>/
      <NN-aula>.md             aulas em Markdown (alertas: > [!TIP], > [!WARNING]...)
      questions.json           perguntas: multiple, truefalse, fill, order (e sql, em linguagens com banco)
      flashcards.json          cartas: front, back, lesson
      challenges.json          desafios "Experimente" do fim das aulas (só em linguagens com banco)
```

O formato completo está em `docs/superpowers/specs/2026-10-11-central-linguagens-design.md`, seção 4, e o que muda para o SQL, em `docs/superpowers/specs/2026-10-14-sql-design.md`, seção 4. O validador recusa conteúdo fora do padrão.

## Publicar

No GitHub: **Settings → Pages → Source: GitHub Actions**. A cada `push` na `main`, o workflow instala as ferramentas de teste, roda os testes e a conferência Java e só publica se tudo passar.

## Créditos

- [SQL Teaching](https://www.sqlteaching.com/), de Ronald Cheng (licença MIT): inspiração para os exercícios de SQL e para a ordem dos assuntos.
- [sql.js](https://github.com/sql-js/sql.js) (licença MIT) e [SQLite](https://sqlite.org/) (domínio público): o banco de dados que roda no navegador.
- [marked](https://marked.js.org/) (licença MIT) e [highlight.js](https://highlightjs.org/) (licença BSD-3-Clause): o Markdown e as cores do código.
````

Substitua o conteúdo de `docs/verificacao-manual.md` por:
````markdown
# Roteiro de verificação manual

Os testes automáticos cobrem as regras, os dados e o comportamento das telas (com o navegador simulado). Este roteiro cobre o que só um navegador de verdade mostra: aparência, celular, impressão, permissões e o backup em arquivo.

Use um servidor local (`python -m http.server 8000`) e o Chrome. Marque cada item.

## Primeira visita e navegação
- [ ] Sem dados salvos, aparece a tela de boas-vindas; sem nome, aparece "Digite seu nome."
- [ ] Um nome com HTML, como `<img src=x onerror=alert(1)>`, aparece como texto puro no topo, no perfil e no certificado (nenhum alerta abre).
- [ ] Menu lateral no computador; barra de abas embaixo na largura de celular (DevTools, 390 px), sem rolagem horizontal.
- [ ] Toda a navegação funciona só com o teclado (Tab, Enter, Espaço, setas na ordenação); o foco é sempre visível.
- [ ] `#/qualquer-coisa` mostra "Página não encontrada".

## Aulas, prática, quiz e prova
- [ ] A página de Java lista os 7 módulos, nesta ordem: Introdução, Fundamentos, Orientação a Objetos, Coleções, Exceções, Strings e Entrada, Java Moderno (8 a 21).
- [ ] As aulas dos 7 módulos aparecem com tabelas, código colorido, botão "copiar" e quadros de destaque coloridos (confira pelo menos uma aula de cada módulo).
- [ ] Concluir uma aula dá XP, libera as cartas da aula e atualiza o anel da meta e a sequência.
- [ ] A prática do módulo mostra os 4 tipos de pergunta ao longo de algumas tentativas; sair no meio pede confirmação.
- [ ] Em "Ordenar linhas", arrastar com o mouse funciona no computador.
- [ ] O quiz personalizado respeita escopo, dificuldade, tipo e quantidade; "0 perguntas" desativa o botão.
- [ ] A prova roda em modo simulado com cronômetro; 70% ou mais mostra "Você passou na prova!".
- [ ] Com o sistema configurado para reduzir movimento, a carta vira sem animação.

## SQL
- [ ] A página de SQL lista os módulos Introdução e Consultas básicas, e toda aula termina com o bloco "Experimente".
- [ ] Num desafio: "Tabelas deste exercício" abre e mostra a tabela inteira; Executar (e Ctrl+Enter) mostra o resultado, o veredito e o resultado esperado; "Ver uma resposta" aparece depois da primeira execução.
- [ ] `SELECT nme FROM alunos` mostra a mensagem do SQLite e a dica em português.
- [ ] Na caixa de texto, Tab insere dois espaços; Esc e depois Tab saem da caixa.
- [ ] A prática de um módulo de SQL mistura "Escreva a consulta" com os outros tipos; no modo estudo, depois de responder, aparecem o resultado esperado e uma resposta certa.
- [ ] Sem internet (DevTools → Network → Offline) e com a página recarregada: a aula avisa que o banco de dados não carregou, e a prática começa sem as perguntas de escrever SQL, com um aviso.
- [ ] No celular (390 px), a caixa de texto cabe na tela e as tabelas rolam para o lado, sem rolar a página inteira.

## Flashcards
- [ ] A carta vira com animação 3D; Revisão do dia, estudo livre e "Meus erros" funcionam; atalhos 1/2/3 e Espaço.
- [ ] O número de pendentes no menu bate com o da tela de flashcards.

## Perfil e certificado
- [ ] Calendário de atividade, conquistas, histórico e "Refazer erradas" aparecem bem no computador e no celular.
- [ ] O certificado só aparece com tudo concluído; "Imprimir ou salvar PDF" mostra só o certificado, em paisagem.

## Dados e backup
- [ ] Recarregar a página mantém todo o progresso.
- [ ] Duas abas: concluir uma aula numa aba e voltar à outra mostra o progresso atualizado.
- [ ] DevTools → Application → Local Storage: trocar o valor de `central-linguagens:state` por `{quebrado` e recarregar mostra o aviso de dados danificados, cria a chave `central-linguagens:corrupt:...` e começa do zero.
- [ ] Trocar o `schema` salvo para `99` e recarregar mostra o aviso de versão mais nova, e nada é sobrescrito.
- [ ] Com o backup automático ativo, corromper o Local Storage e recarregar **não** regrava o arquivo de backup (a data de modificação do arquivo não muda, mesmo depois de concluir uma aula). Zerar o progresso também não grava um estado vazio no arquivo.
- [ ] Exportar baixa o arquivo `progresso-<nome>-<data>.json`; importar mostra o resumo e "Desfazer importação" restaura o anterior.
- [ ] Backup automático: ativar escolhe o arquivo, ele é regravado uns 5 s depois de cada mudança, "Reconectar" funciona depois de recarregar e "Desativar" para de gravar.
- [ ] No celular (ou com toque emulado), "Exportar" abre o menu de compartilhamento.
- [ ] Numa janela anônima do Firefox, o site funciona; se o armazenamento falhar, aparece a faixa "Seu progresso não está sendo salvo".
- [ ] Lembrete: com progresso e sem backup há 7 dias (simule mudando `lastExportAt` e `createdAt` no Local Storage), a faixa aparece; "Depois" some por 3 dias.

## Conteúdo
- [ ] `node tools/verify-java.mjs` com o JDK 21: 234/234.
````

- [ ] **Step 3: Rodar tudo e fazer o commit**

Run: `npm test`
Expected: PASS (550 testes).

Run (PowerShell): `$env:JAVA_HOME = "$env:USERPROFILE\tools\jdk-21.0.12.1+1"; node tools/verify-java.mjs`
Expected: `234/234 trechos conferidos.` O Java não mudou; é só para confirmar.

```bash
git add tests/data/content-real.test.js README.md docs/verificacao-manual.md
git commit -m "SQL: teste de fumaça do conteúdo real, créditos e roteiro manual" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
