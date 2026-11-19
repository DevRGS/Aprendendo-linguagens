import test from 'node:test';
import assert from 'node:assert/strict';
import { converter } from '../dist/tarefas.js';

test('variação: array e campo de conclusão na criação são inválidos', () => {
  for (const entrada of [[], { titulo: 'x', concluida: true }]) {
    assert.equal(converter(entrada).ok, false);
  }
  assert.deepEqual(converter({ titulo: '  Nova  ' }), { ok: true, valor: { titulo: 'Nova' } });
});
