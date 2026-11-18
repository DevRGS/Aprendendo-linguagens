import assert from 'node:assert/strict';
import { laboratory } from './backend-lab.mjs';
import { passwordRecord, verifyPassword } from '../../content/javascript/projetos/api-estudos/src/security.mjs';
const record = await passwordRecord('senha-do-laboratorio-123');
assert.equal(await verifyPassword('senha-do-laboratorio-123', record), true);
assert.equal(await verifyPassword('outra-senha-123', record), false);
await laboratory(async ({ request, account }) => {
  const ana = await account('ana'); const bia = await account('bia');
  const task = await (await request('/api/tarefas', { method: 'POST', body: { titulo: 'Privada' }, ...ana })).json();
  assert.equal((await request(`/api/tarefas/${task.id}`, bia)).status, 404);
  assert.equal((await request(`/api/tarefas/${task.id}`, { method: 'DELETE', cookie: ana.cookie })).status, 403);
  assert.equal((await request('/api/sessao', { method: 'DELETE', ...ana })).status, 204);
  assert.equal((await request('/api/tarefas', ana)).status, 401);
});
console.log('Senha, sessão, CSRF e proprietário conferidos.');
