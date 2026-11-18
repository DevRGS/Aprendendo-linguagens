import assert from 'node:assert/strict';
import { laboratory } from './backend-lab.mjs';
await laboratory(async ({ request, account }) => {
  const session = await account('ana');
  const created = await request('/api/tarefas', { method: 'POST', body: { titulo: 'Revisar' }, ...session });
  assert.equal(created.status, 201);
  const task = await created.json();
  const updated = await request(`/api/tarefas/${task.id}`, { method: 'PATCH', body: { concluida: true }, ...session });
  assert.equal((await updated.json()).concluida, true);
  assert.equal((await request('/api/tarefas', { method: 'POST', body: { titulo: ' ' }, ...session })).status, 400);
  const removed = await request(`/api/tarefas/${task.id}`, { method: 'DELETE', ...session });
  assert.equal(removed.status, 204); assert.equal(await removed.text(), '');
});
console.log('CRUD e erros HTTP conferidos.');
