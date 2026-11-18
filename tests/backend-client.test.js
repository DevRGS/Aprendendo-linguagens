import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const moduleUrl = new URL('../content/javascript/projetos/api-estudos/public/cliente.js', import.meta.url);

test('cliente da aula usa sessão/CSRF e trata 204, HTTP, JSON inválido e falha de rede', async () => {
  assert.ok(existsSync(moduleUrl), 'falta o cliente fetch do projeto');
  const { createApiClient } = await import(moduleUrl.href);
  let sent;
  const client = createApiClient({ fetchImpl: async (url, options) => {
    sent = { url, options };
    return new Response(null, { status: 204 });
  } });
  client.setCsrf('a'.repeat(64));
  assert.equal(await client.request('/api/tarefas/1', { method: 'DELETE' }), null);
  assert.equal(sent.options.credentials, 'same-origin');
  assert.equal(sent.options.headers['X-CSRF-Token'], 'a'.repeat(64));
  const invalid = createApiClient({ fetchImpl: async () => new Response('{', { status: 200 }) });
  await assert.rejects(invalid.request('/api/tarefas'), /JSON|resposta/i);
  const denied = createApiClient({ fetchImpl: async () => new Response('{"erro":{"codigo":"SESSAO","mensagem":"Entre novamente."}}', { status: 401 }) });
  await assert.rejects(denied.request('/api/tarefas'), (error) => error.status === 401 && error.message === 'Entre novamente.');
  const offline = createApiClient({ fetchImpl: async () => { throw new TypeError('offline'); } });
  await assert.rejects(offline.request('/api/tarefas'), /conexão|rede/i);
});
