import assert from 'node:assert/strict';
import { createApiClient } from '../../content/javascript/projetos/api-estudos/public/cliente.js';
import { laboratory } from './backend-lab.mjs';
await laboratory(async ({ origin, account }) => {
  const session = await account('ana');
  const api = createApiClient({ fetchImpl: (path, options) => fetch(origin + path, { ...options, headers: { ...options.headers, Origin: origin, Cookie: session.cookie } }) });
  api.setCsrf(session.csrf);
  const task = await api.request('/api/tarefas', { method: 'POST', body: { titulo: '<b>Texto literal</b>' } });
  assert.equal(task.titulo, '<b>Texto literal</b>');
  assert.equal((await api.request('/api/tarefas')).total, 1);
  await api.request(`/api/tarefas/${task.id}`, { method: 'PATCH', body: { titulo: 'Novo título' } });
  assert.equal(await api.request(`/api/tarefas/${task.id}`, { method: 'DELETE' }), null);
  await api.request('/api/sessao', { method: 'DELETE' });
  await assert.rejects(api.request('/api/tarefas'), (error) => error.status === 401);
});
console.log('Cliente fetch e API real conferidos.');
