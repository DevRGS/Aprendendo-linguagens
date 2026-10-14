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
