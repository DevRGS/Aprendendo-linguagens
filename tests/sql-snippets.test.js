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
