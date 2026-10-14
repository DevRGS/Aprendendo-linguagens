import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AVATARS } from '../js/config.js';

// Sequências unidas por U+200D (como 🧑‍💻) aparecem como dois desenhos no Windows 10.
test('todo avatar é um emoji de um código só, e nenhum se repete', () => {
  for (const a of AVATARS) assert.equal([...a].length, 1, `${a} tem ${[...a].length} códigos`);
  assert.equal(new Set(AVATARS).size, AVATARS.length);
});
