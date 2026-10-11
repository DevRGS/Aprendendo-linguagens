import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Carregar cada módulo confere sintaxe e se todo "import { x }" existe de verdade.
const JS = fileURLToPath(new URL('../../js/', import.meta.url));
const listJs = (dir) => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name);
  if (statSync(p).isDirectory()) return listJs(p);
  return name.endsWith('.js') ? [p] : [];
});

for (const file of listJs(JS)) {
  const name = relative(JS, file).replaceAll('\\', '/');
  if (name === 'main.js') continue; // chama boot() ao carregar
  test(`módulo ${name} carrega e resolve seus imports`, async () => {
    await assert.doesNotReject(import(pathToFileURL(file).href));
  });
}

test('existem as telas obrigatórias', async () => {
  const { VIEWS } = await import(pathToFileURL(join(JS, 'ui/views/index.js')).href);
  for (const name of ['home', 'notFound', 'language', 'lesson', 'reference']) assert.equal(typeof VIEWS[name], 'function', name);
});
