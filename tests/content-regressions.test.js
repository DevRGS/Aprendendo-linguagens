// Erros de conteúdo já encontrados em revisão: estes testes impedem que voltem.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (rel) => readFileSync(new URL(`../content/java/${rel}`, import.meta.url), 'utf8');
const json = (rel) => JSON.parse(read(rel));

test('widening não é apresentado como sempre sem perda', () => {
  const f07 = json('02-fundamentos/flashcards.json').cards.find((c) => c.id === 'java.fundamentos.f07');
  assert.doesNotMatch(f07.back, /sem perda/);
  assert.match(f07.back, /podem perder precisão/);
  const aula = read('02-fundamentos/02-conversoes.md');
  assert.match(aula, /podem perder precisão/);
  assert.match(aula, /1\.6777216E7/);
});

test('q05 aceita todas as formas que compilam e dão 42', () => {
  const q05 = json('02-fundamentos/questions.json').questions.find((q) => q.id === 'java.fundamentos.q05');
  assert.deepEqual([...q05.blanks[0]].sort(), ['decode', 'parseInt', 'parseUnsignedInt', 'valueOf']);
});

test('a lista de tipos do switch deixa claro o que muda com pattern matching (Java 21)', () => {
  const aula = read('02-fundamentos/04-condicionais.md');
  assert.match(aula, /pattern matching/);
  assert.match(aula, /primitivos `long`, `float`, `double` nem `boolean`/);
});
