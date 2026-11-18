import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { openDatabase } from '../../content/javascript/projetos/api-estudos/src/database.mjs';
const dir = mkdtempSync(join(tmpdir(), 'exemplo-sqlite-'));
const path = join(dir, 'banco.sqlite');
let store = openDatabase(path);
try {
  const user = store.createUser('ana', 'salt-de-teste', 'hash-de-teste');
  const title = "Anotação com ' e SQL literal";
  const task = store.createTask(user.id, title);
  assert.equal(store.task(user.id, task.id).titulo, title);
  assert.equal(store.tasks(user.id, 1, 0).total, 1);
  store.db.exec('BEGIN IMMEDIATE');
  store.createTask(user.id, 'não confirmar');
  store.db.exec('ROLLBACK');
  assert.equal(store.tasks(user.id, 20, 0).total, 1);
  store.close(); store = openDatabase(path);
  assert.equal(store.task(user.id, task.id).titulo, title);
  assert.throws(() => store.createTask(99999, 'sem dono'));
} finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
console.log('SQL, transação e persistência conferidos.');
