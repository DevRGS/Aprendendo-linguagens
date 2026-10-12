// Erros de conteúdo já encontrados em revisão: estes testes impedem que voltem.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (rel) => readFileSync(new URL(`../content/java/${rel}`, import.meta.url), 'utf8');
const json = (rel) => JSON.parse(read(rel));
const question = (dir, id) => json(`${dir}/questions.json`).questions.find((q) => q.id === id);

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

test('a carta de interfaces cita métodos abstratos e os métodos private do Java 9+', () => {
  const f12 = json('03-poo/flashcards.json').cards.find((c) => c.id === 'java.poo.f12');
  assert.match(f12.back, /abstratos/);
  assert.match(f12.back, /`private` \(Java 9\+\)/);
});

test('exceção unchecked personalizada: Error fica fora das alternativas (seria uma segunda resposta certa)', () => {
  const q13 = question('05-excecoes', 'java.excecoes.q13');
  assert.equal(q13.options[q13.answer], '`RuntimeException`');
  assert.ok(!q13.options.some((o) => o.includes('Error')));
});

test('lacunas aceitam todas as respostas que compilam', () => {
  assert.deepEqual([...question('04-colecoes', 'java.colecoes.q18').blanks[0]].sort(), ['comparing', 'comparingDouble', 'comparingInt', 'comparingLong']);
  assert.deepEqual([...question('05-excecoes', 'java.excecoes.q18').blanks[0]].sort(), ['AutoCloseable', 'Closeable', 'java.io.Closeable', 'java.lang.AutoCloseable']);
  assert.ok(question('04-colecoes', 'java.colecoes.q04').blanks[0].includes('java.util.List.of'));
});

test('regras de construtor que mudaram depois do Java 21 são ditas como "no Java 21"', () => {
  assert.match(question('03-poo', 'java.poo.q07').prompt, /^No Java 21/);
  assert.match(question('03-poo', 'java.poo.q18').prompt, /^No Java 21/);
  assert.match(read('03-poo/02-construtores.md'), /No Java 21, `this\(\.\.\.\)` precisa ser a \*\*primeira instrução\*\*/);
});

test('a referência rápida trata Error como unchecked, como o módulo Exceções', () => {
  assert.match(read('referencia.md'), /\*\*Unchecked:\*\* `RuntimeException`, `Error` e as subclasses deles/);
});
