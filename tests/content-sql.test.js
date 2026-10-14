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
