import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { existsSync } from 'node:fs';
import pg from 'pg';
import { openDatabase } from '../src/database.mjs';
if (existsSync('.env')) process.loadEnvFile('.env');

test('falha ao criar nova sessão desfaz a exclusão da anterior', async () => {
  const schema = 'central_teste_' + randomBytes(8).toString('hex');
  const db = openDatabase(process.env.DATABASE_URL, schema);
  try {
    await db.migrar();
    const ana = await db.createUser('ana', 'sal-ficticio', 'hash-ficticio');
    await db.rotateSession(null, 'original', ana.id, 'protecao', 1000, 1);
    await assert.rejects(db.rotateSession('original', 'nova', -1, 'outra', 1000, 2), { code: '23503' });
    assert.equal((await db.session('original', 3)).usuario, 'ana');
    assert.equal(await db.session('nova', 3), null);
  } finally {
    await db.close();
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    try { await pool.query('DROP SCHEMA IF EXISTS ' + schema + ' CASCADE'); } finally { await pool.end(); }
  }
});

test('variação: a colisão com sessão de outra conta preserva as duas sessões', async () => {
  const schema = 'central_teste_' + randomBytes(8).toString('hex');
  const db = openDatabase(process.env.DATABASE_URL, schema);
  try {
    await db.migrar();
    const ana = await db.createUser('ana', 'sal-a', 'hash-a');
    const bia = await db.createUser('bia', 'sal-b', 'hash-b');
    await db.rotateSession(null, 'token-a', ana.id, 'csrf-a', 1000, 1);
    await db.rotateSession(null, 'token-b', bia.id, 'csrf-b', 1000, 1);
    await assert.rejects(db.rotateSession('token-a', 'token-b', ana.id, 'novo', 1000, 2), { code: '23505' });
    assert.equal((await db.session('token-a', 3)).usuario, 'ana');
    assert.equal((await db.session('token-b', 3)).usuario, 'bia');
  } finally {
    await db.close();
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    try { await pool.query('DROP SCHEMA IF EXISTS ' + schema + ' CASCADE'); } finally { await pool.end(); }
  }
});
