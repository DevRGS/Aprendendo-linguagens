import { test } from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { idbGet, idbSet, idbDelete } from '../../js/data/idb.js';

test('idbSet guarda, idbGet lê e idbDelete apaga', async () => {
  assert.equal(await idbGet('nada'), undefined);
  await idbSet('arquivo', { nome: 'backup.json', tamanho: 3 });
  assert.deepEqual(await idbGet('arquivo'), { nome: 'backup.json', tamanho: 3 });
  await idbSet('arquivo', { nome: 'outro.json' });
  assert.deepEqual(await idbGet('arquivo'), { nome: 'outro.json' });
  await idbDelete('arquivo');
  assert.equal(await idbGet('arquivo'), undefined);
});
