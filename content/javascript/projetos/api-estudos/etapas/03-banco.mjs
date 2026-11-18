import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
try {
  db.exec('CREATE TABLE tarefas (id INTEGER PRIMARY KEY, titulo TEXT NOT NULL) STRICT');
  db.prepare('INSERT INTO tarefas(titulo) VALUES (?)').run('Estudar SQL');
  console.log(JSON.stringify(db.prepare('SELECT id, titulo FROM tarefas ORDER BY id').all()));
} finally { db.close(); }
