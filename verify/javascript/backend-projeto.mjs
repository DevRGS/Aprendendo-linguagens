import assert from 'node:assert/strict';
import { createApplication } from '../../content/javascript/projetos/api-estudos/src/app.mjs';
import { laboratory } from './backend-lab.mjs';
assert.throws(() => createApplication({ databasePath: ':memory:', origin: 'http://127.0.0.1:3000', secureCookies: true }));
await laboratory(async ({ request }) => {
  const health = await request('/api/saude');
  assert.equal(health.status, 200);
  assert.match(health.headers.get('content-security-policy'), /default-src 'self'/);
  assert.equal((await request('/src/app.mjs')).status, 404);
  assert.equal((await request('/.env')).status, 404);
  assert.equal((await request('/data/estudos.sqlite')).status, 404);
});
console.log('Configuração e arquivos privados conferidos.');
