import assert from 'node:assert/strict';
import { createHttpExample } from '../../content/javascript/projetos/api-estudos/etapas/01-http.mjs';
import { createExpressExample } from '../../content/javascript/projetos/api-estudos/etapas/02-express.mjs';
import { createServer } from 'node:http';

for (const [server, path, expected] of [
  [createHttpExample(), '/api/saude', { ok: true }],
  [createServer(createExpressExample()), '/api/ola/Ana', { mensagem: 'Olá, Ana!' }],
]) {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), expected);
    assert.equal((await fetch(base + '/ausente')).status, 404);
  } finally { server.closeAllConnections(); await new Promise((resolve) => server.close(resolve)); }
}
console.log('HTTP e Express conferidos.');
