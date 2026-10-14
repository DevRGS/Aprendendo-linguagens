import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import { loadLanguages, loadChallenges, loadDataset } from '../../js/data/content.js';

installFetchFromDisk({ overlay: 'sql-ui' });

test('loadChallenges marca linguagem e módulo; sem engine, não há desafios', async () => {
  const [sql] = await loadLanguages();
  const challenges = await loadChallenges(sql, sql.modules[0]);
  assert.deepEqual(challenges.map((c) => [c.id, c.lesson, c.lang, c.module]), [
    ['sql.teste.d01', 'selecionar', 'sql', 'sql.teste'],
    ['sql.teste.d02', 'filtrar', 'sql', 'sql.teste'],
  ]);
  assert.deepEqual(await loadChallenges({ ...sql, engine: undefined }, sql.modules[0]), []);
});

test('loadDataset traz o esquema, os dados visíveis e os ocultos', async () => {
  const [sql] = await loadLanguages();
  const ds = await loadDataset(sql, 'pessoas');
  assert.match(ds.schema, /^CREATE TABLE pessoas/);
  assert.match(ds.data, /'Ana', 34/);
  assert.match(ds.hidden, /'Elisa', 25/);
  await assert.rejects(loadDataset(sql, 'nao-existe'), /HTTP 404/);
});
