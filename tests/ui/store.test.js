import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStore } from '../../js/ui/store.js';

test('createStore guarda o estado e avisa quem assinou, com o meta', () => {
  const store = createStore({ n: 1 });
  const seen = [];
  const unsubscribe = store.subscribe((state, meta) => seen.push([state.n, meta]));
  store.set({ n: 2 }, { external: true });
  store.set({ n: 3 });
  assert.deepEqual(store.get(), { n: 3 });
  assert.deepEqual(seen, [[2, { external: true }], [3, {}]]);
  unsubscribe();
  store.set({ n: 4 });
  assert.equal(seen.length, 2);
});
