import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mulberry32, shuffle, weightedSample } from '../../js/core/random.js';

test('mulberry32 é determinístico e fica em [0, 1)', () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  for (let i = 0; i < 100; i++) {
    const x = a();
    assert.equal(x, b());
    assert.ok(x >= 0 && x < 1);
  }
});

test('shuffle mantém os elementos e não altera o original', () => {
  const original = [1, 2, 3, 4, 5];
  const out = shuffle(original, mulberry32(1));
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
  assert.deepEqual([...out].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(shuffle(original, mulberry32(1)), out);
});

test('weightedSample respeita os pesos', () => {
  const items = [{ id: 'leve', w: 1 }, { id: 'pesado', w: 100 }];
  assert.deepEqual(weightedSample(items, (i) => i.w, 1, () => 0.5).map((i) => i.id), ['pesado']);
  assert.deepEqual(weightedSample(items, (i) => i.w, 1, () => 0).map((i) => i.id), ['leve']);
});

test('weightedSample não repete e devolve no máximo o que existe', () => {
  const items = ['a', 'b', 'c'];
  const out = weightedSample(items, () => 1, 10, mulberry32(3));
  assert.equal(out.length, 3);
  assert.equal(new Set(out).size, 3);
});

test('weightedSample com pesos zerados sorteia de forma uniforme', () => {
  const out = weightedSample(['a', 'b'], () => 0, 2, mulberry32(9));
  assert.deepEqual([...out].sort(), ['a', 'b']);
});
