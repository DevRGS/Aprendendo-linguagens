import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const yml = readFileSync(new URL('../../.github/workflows/pages.yml', import.meta.url), 'utf8');

test('a publicação só acontece depois dos testes e da conferência Java', () => {
  for (const trecho of ['npm ci', 'npm test', 'node tools/verify-java.mjs', "java-version: '21'", 'needs: testes', 'actions/deploy-pages']) {
    assert.ok(yml.includes(trecho), `o workflow precisa conter: ${trecho}`);
  }
});

test('o site publicado leva tudo o que o index.html usa, e só isso', () => {
  const copy = /cp -r (.+) _site\//.exec(yml)[1].split(/\s+/);
  assert.deepEqual(copy.sort(), ['.nojekyll', 'content', 'css', 'index.html', 'js'].sort());
  for (const item of copy) assert.ok(existsSync(new URL(`../../${item}`, import.meta.url)), `${item} não existe`);
});

test('só o job de publicação recebe permissão para publicar (o de testes roda npm ci)', () => {
  const top = /^permissions:\n((?: {2}.+\n)+)/m.exec(yml)[1];
  assert.match(top, /contents: read/);
  assert.doesNotMatch(top, /pages: write|id-token: write/);
  const testes = yml.slice(yml.indexOf('  testes:'), yml.indexOf('  publicar:'));
  assert.doesNotMatch(testes, /pages: write|id-token: write/);
  const publicar = yml.slice(yml.indexOf('  publicar:'));
  assert.match(publicar, /permissions:\n\s+contents: read\n\s+pages: write\n\s+id-token: write/);
});
