import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function openDatabase(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 3000;');
  const version = db.prepare('PRAGMA user_version').get().user_version;
  if (version > 2) { db.close(); throw new Error('Banco criado por uma versão mais nova do projeto.'); }
  if (version === 0) {
    db.exec(`
      BEGIN IMMEDIATE;
      CREATE TABLE usuarios (
        id INTEGER PRIMARY KEY,
        usuario TEXT NOT NULL UNIQUE COLLATE NOCASE,
        sal TEXT NOT NULL,
        hash TEXT NOT NULL
      ) STRICT;
      CREATE TABLE sessoes (
        token_hash TEXT PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        csrf TEXT NOT NULL,
        expira_em INTEGER NOT NULL
      ) STRICT;
      CREATE TABLE tarefas (
        id INTEGER PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        titulo TEXT NOT NULL CHECK(length(trim(titulo)) BETWEEN 1 AND 120),
        concluida INTEGER NOT NULL DEFAULT 0 CHECK(concluida IN (0, 1))
      ) STRICT;
      CREATE INDEX tarefas_por_usuario ON tarefas(usuario_id, id DESC);
      CREATE INDEX sessoes_por_expiracao ON sessoes(expira_em);
      PRAGMA user_version = 1;
      COMMIT;
    `);
  }
  if (version <= 1) {
    // A migração preserva ids e relações existentes. AUTOINCREMENT impede que
    // URLs antigas voltem a apontar para novas tarefas após uma exclusão.
    db.exec('BEGIN IMMEDIATE');
    try {
      db.exec(`
        CREATE TABLE tarefas_v2 (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
          titulo TEXT NOT NULL CHECK(length(trim(titulo)) BETWEEN 1 AND 120),
          concluida INTEGER NOT NULL DEFAULT 0 CHECK(concluida IN (0, 1))
        ) STRICT;
        INSERT INTO tarefas_v2(id, usuario_id, titulo, concluida)
          SELECT id, usuario_id, titulo, concluida FROM tarefas;
        DROP TABLE tarefas;
        ALTER TABLE tarefas_v2 RENAME TO tarefas;
        CREATE INDEX tarefas_por_usuario ON tarefas(usuario_id, id DESC);
        PRAGMA user_version = 2;
      `);
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); db.close(); throw error; }
  }
  const publicTask = (row) => row ? { id: row.id, titulo: row.titulo, concluida: Boolean(row.concluida) } : null;
  return {
    db,
    userByName: (name) => db.prepare('SELECT id, usuario, sal, hash FROM usuarios WHERE usuario = ?').get(name),
    createUser(name, salt, hash) {
      const result = db.prepare('INSERT INTO usuarios(usuario, sal, hash) VALUES (?, ?, ?)').run(name, salt, hash);
      return { id: Number(result.lastInsertRowid), usuario: name };
    },
    session(tokenHash, now) {
      return db.prepare(`SELECT s.usuario_id AS id, u.usuario, s.csrf FROM sessoes AS s
        JOIN usuarios AS u ON u.id = s.usuario_id WHERE s.token_hash = ? AND s.expira_em > ?`).get(tokenHash, now);
    },
    rotateSession(previous, tokenHash, userId, csrf, expires, now) {
      db.exec('BEGIN IMMEDIATE');
      try {
        db.prepare('DELETE FROM sessoes WHERE expira_em <= ?').run(now);
        if (previous) db.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(previous);
        db.prepare('INSERT INTO sessoes(token_hash, usuario_id, csrf, expira_em) VALUES (?, ?, ?, ?)').run(tokenHash, userId, csrf, expires);
        db.exec('COMMIT');
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    },
    deleteSession: (tokenHash) => db.prepare('DELETE FROM sessoes WHERE token_hash = ?').run(tokenHash),
    tasks(userId, limit, offset) {
      const total = db.prepare('SELECT COUNT(*) AS total FROM tarefas WHERE usuario_id = ?').get(userId).total;
      const itens = db.prepare('SELECT id, titulo, concluida FROM tarefas WHERE usuario_id = ? ORDER BY id DESC LIMIT ? OFFSET ?')
        .all(userId, limit, offset).map(publicTask);
      return { itens, total, limit, offset };
    },
    task: (userId, id) => publicTask(db.prepare('SELECT id, titulo, concluida FROM tarefas WHERE usuario_id = ? AND id = ?').get(userId, id)),
    createTask(userId, title) {
      const result = db.prepare('INSERT INTO tarefas(usuario_id, titulo) VALUES (?, ?)').run(userId, title);
      return this.task(userId, Number(result.lastInsertRowid));
    },
    updateTask(userId, id, value) {
      const previous = this.task(userId, id);
      if (!previous) return null;
      db.prepare('UPDATE tarefas SET titulo = ?, concluida = ? WHERE usuario_id = ? AND id = ?')
        .run(value.titulo ?? previous.titulo, Number(value.concluida ?? previous.concluida), userId, id);
      return this.task(userId, id);
    },
    deleteTask: (userId, id) => db.prepare('DELETE FROM tarefas WHERE usuario_id = ? AND id = ?').run(userId, id).changes > 0,
    close: () => db.close(),
  };
}
