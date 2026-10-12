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

test('a ordem natural de textos não é vendida como alfabética (acentos vão depois do z)', () => {
  const conjuntos = read('04-colecoes/02-conjuntos.md');
  const ordenacao = read('04-colecoes/05-ordenacao.md');
  for (const aula of [conjuntos, ordenacao]) assert.doesNotMatch(aula, /textos em ordem alfabética/);
  assert.match(conjuntos, /letras acentuadas/);
  assert.match(ordenacao, /Collator/);
  assert.doesNotMatch(question('04-colecoes', 'java.colecoes.q09').explanation, /as maiúsculas vêm antes de todas as minúsculas/);
  const q14 = question('04-colecoes', 'java.colecoes.q14');
  assert.doesNotMatch(`${q14.prompt} ${q14.explanation}`, /alfabética/);
});

test('a assinatura do main não é apresentada como a única possível', () => {
  const aula = read('01-introducao/04-primeiro-programa.md');
  assert.doesNotMatch(aula, /precisa ser exatamente essa/);
  assert.match(aula, /No Java 21, é assim que se escreve o `main`/);
});

test('comandos copiáveis da primeira aula não trazem anotações entre parênteses', () => {
  const comandos = read('01-introducao/04-primeiro-programa.md').split('\n').filter((l) => /^(javac|java) /.test(l));
  assert.ok(comandos.length >= 3);
  for (const c of comandos) assert.doesNotMatch(c, /\(/, c);
});

test('herança não diz que construtores são herdados', () => {
  const aula = read('03-poo/04-heranca-e-polimorfismo.md');
  assert.doesNotMatch(aula, /herdam tudo o que não é/);
  assert.match(aula, /construtores não são herdados/i);
});

test('a q06 de Exceções declara a variável que usa', () => {
  assert.match(question('05-excecoes', 'java.excecoes.q06').prompt, /int zero = 0;/);
});

test('a q15 de Exceções só afirma o getMessage de quem repassa a mensagem', () => {
  assert.match(question('05-excecoes', 'java.excecoes.q15').prompt, /super\(mensagem\)/);
});

test('o groupingBy da aula imprime um mapa com ordem garantida', () => {
  const aula = read('07-java-moderno/02-streams.md');
  assert.match(aula, /TreeMap::new/);
  assert.doesNotMatch(aula, /O mapa é um `HashMap`/);
});
