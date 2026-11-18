import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:http';

const entry = new URL('../content/javascript/projetos/api-estudos/src/app.mjs', import.meta.url);

test('título com NUL é rejeitado sem truncar texto nem alterar a tarefa existente', async () => {
  const lab = await laboratory();
  try {
    const ana = await lab.account();
    const created = await lab.request('/api/tarefas', { method: 'POST', body: { titulo: 'Original' }, ...ana });
    const path = `/api/tarefas/${created.data.id}`;
    for (const titulo of ['ab\u0000cd', '\u0000start']) {
      for (const [url, method] of [['/api/tarefas', 'POST'], [path, 'PATCH']]) {
        const result = await lab.request(url, { method, body: { titulo }, ...ana });
        assert.equal(result.status, 400);
        assert.equal(result.data.erro.codigo, 'VALIDACAO');
      }
    }
    assert.equal((await lab.request(path, ana)).data.titulo, 'Original');
    assert.equal((await lab.request('/api/tarefas', ana)).data.total, 1);
  } finally { await lab.close(); }
});

test('id de tarefa excluída não passa a identificar uma tarefa nova', async () => {
  const lab = await laboratory();
  try {
    const ana = await lab.account();
    const old = await lab.request('/api/tarefas', { method: 'POST', body: { titulo: 'Antiga' }, ...ana });
    const path = `/api/tarefas/${old.data.id}`;
    assert.equal((await lab.request(path, { method: 'DELETE', ...ana })).status, 204);
    const created = await lab.request('/api/tarefas', { method: 'POST', body: { titulo: 'Nova' }, ...ana });
    assert.notEqual(created.data.id, old.data.id);
    assert.equal((await lab.request(path, { method: 'PATCH', body: { titulo: 'Aba antiga' }, ...ana })).status, 404);
    assert.equal((await lab.request(path, { method: 'DELETE', ...ana })).status, 404);
    assert.equal((await lab.request(`/api/tarefas/${created.data.id}`, ana)).data.titulo, 'Nova');
  } finally { await lab.close(); }
});

test('migração do esquema 1 preserva contas, sessões e tarefas e evita reutilizar ids', async () => {
  const { DatabaseSync } = await import('node:sqlite');
  const { openDatabase } = await import(new URL('database.mjs', entry));
  const dir = mkdtempSync(join(tmpdir(), 'trilha-migracao-'));
  const path = join(dir, 'antigo.sqlite');
  const legacy = new DatabaseSync(path);
  legacy.exec(`
    CREATE TABLE usuarios(id INTEGER PRIMARY KEY, usuario TEXT NOT NULL UNIQUE COLLATE NOCASE, sal TEXT NOT NULL, hash TEXT NOT NULL) STRICT;
    CREATE TABLE sessoes(token_hash TEXT PRIMARY KEY, usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE, csrf TEXT NOT NULL, expira_em INTEGER NOT NULL) STRICT;
    CREATE TABLE tarefas(id INTEGER PRIMARY KEY, usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE, titulo TEXT NOT NULL CHECK(length(trim(titulo)) BETWEEN 1 AND 120), concluida INTEGER NOT NULL DEFAULT 0 CHECK(concluida IN (0,1))) STRICT;
    CREATE INDEX tarefas_por_usuario ON tarefas(usuario_id, id DESC);
    CREATE INDEX sessoes_por_expiracao ON sessoes(expira_em);
    INSERT INTO usuarios VALUES(7, 'ana', 'sal', 'hash');
    INSERT INTO sessoes VALUES('token', 7, 'csrf', 99999);
    INSERT INTO tarefas VALUES(42, 7, 'Preservada', 1);
    PRAGMA user_version = 1;
  `);
  legacy.close();
  let repository;
  try {
    repository = openDatabase(path);
    assert.equal(repository.db.prepare('PRAGMA user_version').get().user_version, 2);
    assert.equal(repository.userByName('ana').id, 7);
    assert.equal(repository.session('token', 1).csrf, 'csrf');
    assert.deepEqual(repository.task(7, 42), { id: 42, titulo: 'Preservada', concluida: true });
    assert.deepEqual(repository.db.prepare('PRAGMA foreign_key_check').all(), []);
    repository.deleteTask(7, 42);
    const next = repository.createTask(7, 'Depois');
    assert.ok(next.id > 42);
    repository.close(); repository = openDatabase(path);
    assert.equal(repository.task(7, next.id).titulo, 'Depois');
  } finally { repository?.close(); rmSync(dir, { recursive: true, force: true }); }
});

async function laboratory({ databasePath, authLimit = 100, clock = () => Date.now() } = {}) {
  assert.ok(existsSync(entry), 'falta o projeto executável de API/SQLite');
  const { createApplication } = await import(entry.href);
  const dir = mkdtempSync(join(tmpdir(), 'trilha-api-'));
  const server = createServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const created = createApplication({ databasePath: databasePath ?? join(dir, 'teste.sqlite'), origin, authLimit, clock });
  server.on('request', created.app);
  const request = async (path, { method = 'GET', body, raw, cookie, csrf, headers = {} } = {}) => {
    const response = await fetch(origin + path, {
      method,
      headers: { Origin: origin, ...(body !== undefined || raw !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}), ...(csrf ? { 'X-CSRF-Token': csrf } : {}), ...headers },
      body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
    });
    const text = await response.text();
    return { status: response.status, headers: response.headers, text, data: text ? JSON.parse(text) : null };
  };
  const account = async (usuario = 'ana') => {
    const body = { usuario, senha: 'senha-de-estudos-123' };
    assert.equal((await request('/api/usuarios', { method: 'POST', body })).status, 201);
    const session = await request('/api/sessao', { method: 'POST', body });
    assert.equal(session.status, 200);
    const cookie = session.headers.get('set-cookie').split(';')[0];
    return { cookie, csrf: session.data.csrf, usuario: session.data.usuario };
  };
  return {
    origin, request, account, databasePath: databasePath ?? join(dir, 'teste.sqlite'),
    async close() {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
      created.close();
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

test('API real autentica e executa CRUD parametrizado com paginação e respostas corretas', async () => {
  const lab = await laboratory();
  try {
    assert.equal((await lab.request('/api/saude')).status, 200);
    assert.equal((await lab.request('/api/tarefas')).status, 401);
    const ana = await lab.account();
    const title = "Estudar SQL '); DROP TABLE usuarios;--";
    const added = await lab.request('/api/tarefas', { method: 'POST', body: { titulo: title }, ...ana });
    assert.equal(added.status, 201);
    assert.equal(added.data.titulo, title);
    assert.equal(added.data.concluida, false);
    assert.equal(added.headers.get('location'), `/api/tarefas/${added.data.id}`);
    const id = added.data.id;
    assert.equal((await lab.request(`/api/tarefas/${id}`, ana)).data.titulo, title);
    const updated = await lab.request(`/api/tarefas/${id}`, { method: 'PATCH', body: { titulo: 'Revisar Node', concluida: true }, ...ana });
    assert.equal(updated.status, 200);
    assert.equal(updated.data.concluida, true);
    await lab.request('/api/tarefas', { method: 'POST', body: { titulo: 'Outra tarefa' }, ...ana });
    const list = await lab.request('/api/tarefas?limit=1&offset=0', ana);
    assert.equal(list.data.total, 2);
    assert.equal(list.data.itens.length, 1);
    assert.equal(list.data.itens[0].titulo, 'Outra tarefa');
    const removed = await lab.request(`/api/tarefas/${id}`, { method: 'DELETE', ...ana });
    assert.equal(removed.status, 204);
    assert.equal(removed.text, '');
    assert.equal((await lab.request(`/api/tarefas/${id}`, ana)).status, 404);
    assert.equal((await lab.request('/api/tarefas', ana)).data.total, 1);
  } finally { await lab.close(); }
});

test('cada usuário só acessa suas tarefas; sessão/CSRF/origem e logout são validados', async () => {
  const lab = await laboratory();
  try {
    const ana = await lab.account('ana');
    const bia = await lab.account('bia');
    const task = await lab.request('/api/tarefas', { method: 'POST', body: { titulo: 'Privada' }, ...ana });
    const path = `/api/tarefas/${task.data.id}`;
    assert.equal((await lab.request(path, bia)).status, 404);
    assert.equal((await lab.request(path, { method: 'PATCH', body: { titulo: 'Roubar' }, ...bia })).status, 404);
    assert.equal((await lab.request(path, { method: 'DELETE', ...bia })).status, 404);
    assert.equal((await lab.request('/api/tarefas', bia)).data.total, 0);
    assert.equal((await lab.request(path, { method: 'PATCH', body: { concluida: true }, cookie: ana.cookie })).status, 403);
    assert.equal((await lab.request(path, { method: 'PATCH', body: { concluida: true }, ...ana, headers: { Origin: 'https://outro.test' } })).status, 403);
    const me = await lab.request('/api/sessao', ana);
    assert.equal(me.data.usuario.usuario, 'ana');
    assert.doesNotMatch(me.text, /senha|hash|sal:/i);
    const logout = await lab.request('/api/sessao', { method: 'DELETE', ...ana });
    assert.equal(logout.status, 204);
    assert.equal((await lab.request('/api/tarefas', ana)).status, 401);
  } finally { await lab.close(); }
});

test('API rejeita JSON/campos/tipos/IDs inválidos, mídia errada e corpo grande sem expor SQL', async () => {
  const lab = await laboratory();
  try {
    const ana = await lab.account();
    for (const body of [{ titulo: ' ' }, { titulo: 2 }, { titulo: 'x'.repeat(121) }, { titulo: 'teste', usuario_id: 99 }]) {
      const result = await lab.request('/api/tarefas', { method: 'POST', body, ...ana });
      assert.equal(result.status, 400);
      assert.ok(result.data.erro.codigo);
      assert.doesNotMatch(result.text, /SQLITE|stack|at file:/);
    }
    assert.equal((await lab.request('/api/tarefas', { method: 'POST', raw: '{', ...ana })).status, 400);
    assert.equal((await lab.request('/api/tarefas', { method: 'POST', raw: 'texto', ...ana, headers: { 'Content-Type': 'text/plain' } })).status, 415);
    assert.equal((await lab.request('/api/tarefas', { method: 'POST', body: { titulo: 'x'.repeat(20000) }, ...ana })).status, 413);
    for (const path of ['/api/tarefas/1abc', '/api/tarefas/0', '/api/tarefas?limit=999', '/api/tarefas?offset=-1']) assert.equal((await lab.request(path, ana)).status, 400, path);
    const task = await lab.request('/api/tarefas', { method: 'POST', body: { titulo: 'Válida' }, ...ana });
    assert.equal((await lab.request(`/api/tarefas/${task.data.id}`, { method: 'PATCH', body: {}, ...ana })).status, 400);
    assert.equal((await lab.request(`/api/tarefas/${task.data.id}`, { method: 'PATCH', body: { concluida: 'false' }, ...ana })).status, 400);
    assert.equal((await lab.request('/api/nao-existe', ana)).status, 404);
    assert.equal((await lab.request('/src/app.mjs')).status, 404);
  } finally { await lab.close(); }
});

test('SQLite persiste os dados/sessão no arquivo e expiração bloqueia acesso', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'trilha-api-persist-'));
  const databasePath = join(dir, 'estudos.sqlite');
  let now = 1_800_000_000_000;
  let lab;
  try {
    lab = await laboratory({ databasePath, clock: () => now });
    const ana = await lab.account();
    await lab.request('/api/tarefas', { method: 'POST', body: { titulo: 'Persistida' }, ...ana });
    await lab.close(); lab = null;
    assert.ok(readFileSync(databasePath).length > 0);
    lab = await laboratory({ databasePath, clock: () => now });
    assert.equal((await lab.request('/api/tarefas', ana)).data.itens[0].titulo, 'Persistida');
    now += 8 * 60 * 60 * 1000 + 1;
    assert.equal((await lab.request('/api/tarefas', ana)).status, 401);
  } finally { if (lab) await lab.close(); rmSync(dir, { recursive: true, force: true }); }
});

test('cadastro duplicado, login inválido, flags do cookie e limite de autenticação', async () => {
  const lab = await laboratory();
  try {
    const ana = await lab.account();
    assert.equal((await lab.request('/api/usuarios', { method: 'POST', body: { usuario: 'ana', senha: 'senha-de-estudos-123' } })).status, 409);
    const invalid = await lab.request('/api/sessao', { method: 'POST', body: { usuario: 'ana', senha: 'senha-errada-123' } });
    assert.equal(invalid.status, 401);
    assert.equal((await lab.request('/api/sessao', { method: 'POST', body: { usuario: 'ausente', senha: 'senha-errada-123' } })).text, invalid.text);
    const response = await lab.request('/api/sessao', { method: 'POST', body: { usuario: 'ana', senha: 'senha-de-estudos-123' }, cookie: ana.cookie });
    assert.match(response.headers.get('set-cookie'), /HttpOnly/);
    assert.match(response.headers.get('set-cookie'), /SameSite=Strict/);
    assert.equal((await lab.request('/api/tarefas', ana)).status, 401, 'login rotaciona a sessão anterior deste navegador');
  } finally { await lab.close(); }
  const limited = await laboratory({ authLimit: 2 });
  try {
    const body = { usuario: 'ausente', senha: 'senha-errada-123' };
    assert.equal((await limited.request('/api/sessao', { method: 'POST', body })).status, 401);
    assert.equal((await limited.request('/api/sessao', { method: 'POST', body })).status, 401);
    const result = await limited.request('/api/sessao', { method: 'POST', body });
    assert.equal(result.status, 429);
    assert.ok(result.headers.get('retry-after'));
  } finally { await limited.close(); }
});
