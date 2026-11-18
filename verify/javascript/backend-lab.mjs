import { createServer } from 'node:http';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createApplication } from '../../content/javascript/projetos/api-estudos/src/app.mjs';

export async function laboratory(action) {
  const dir = mkdtempSync(join(tmpdir(), 'exemplo-api-'));
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const project = createApplication({ databasePath: join(dir, 'estudos.sqlite'), origin, authLimit: 100 });
  server.on('request', project.app);
  const request = (path, { method = 'GET', body, cookie, csrf } = {}) => fetch(origin + path, {
    method, headers: { Origin: origin, ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}), ...(csrf ? { 'X-CSRF-Token': csrf } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const account = async (usuario) => {
    const body = { usuario, senha: 'senha-do-laboratorio-123' };
    await request('/api/usuarios', { method: 'POST', body });
    const response = await request('/api/sessao', { method: 'POST', body });
    const data = await response.json();
    return { cookie: response.headers.get('set-cookie').split(';')[0], csrf: data.csrf };
  };
  try { await action({ origin, request, account }); }
  finally {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    project.close(); rmSync(dir, { recursive: true, force: true });
  }
}
