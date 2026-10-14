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
