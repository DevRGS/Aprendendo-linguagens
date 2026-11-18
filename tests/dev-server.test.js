import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

test('servidor local entrega a central, módulos e download sem executar a API do curso', async () => {
  const entry = new URL('../tools/dev-server.mjs', import.meta.url);
  assert.ok(existsSync(entry), 'falta o servidor para npm run dev');
  const { createDevServer } = await import(entry);
  const server = createDevServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const home = await fetch(origin);
    assert.equal(home.status, 200);
    assert.match(home.headers.get('content-type'), /text\/html/);
    assert.match(await home.text(), /Central de Linguagens/);
    const main = await fetch(`${origin}/js/main.js`);
    assert.equal(main.status, 200);
    assert.match(main.headers.get('content-type'), /javascript/);
    const catalog = await (await fetch(`${origin}/content/catalog.json`)).json();
    assert.ok(catalog.languages.some((language) => language.id === 'javascript'));
    assert.ok(catalog.languages.some((language) => language.id === 'linux'));
    const lesson = await fetch(`${origin}/content/javascript/09-node/01-instalacao-node.md`);
    assert.equal(lesson.status, 200);
    assert.match(await lesson.text(), /^# /);
    const zip = await fetch(`${origin}/content/javascript/projetos/api-estudos.zip`);
    assert.equal(zip.status, 200);
    assert.equal(Buffer.from(await zip.arrayBuffer()).subarray(0, 2).toString(), 'PK');
    assert.equal((await fetch(`${origin}/nao-existe`)).status, 404);
    assert.notEqual((await fetch(`${origin}/.git/config`)).status, 200);
    assert.equal((await fetch(`${origin}/api/saude`)).status, 404);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
});
