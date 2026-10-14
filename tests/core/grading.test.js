import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countBlanks, normalizeAnswer, orderLine, isBlankCorrect, gradeQuestion } from '../../js/core/grading.js';

test('countBlanks conta as lacunas', () => {
  assert.equal(countBlanks('a ___ b ___'), 2);
  assert.equal(countBlanks('sem lacuna'), 0);
});

test('normalizeAnswer tira espaços das pontas e junta espaços repetidos', () => {
  assert.equal(normalizeAnswer('  String...   args '), 'String... args');
  assert.equal(normalizeAnswer('SeLeCt', true), 'select');
  assert.equal(normalizeAnswer(undefined), '');
});

test('orderLine remove o recuo', () => {
  assert.equal(orderLine('        soma += i;'), 'soma += i;');
});

test('múltipla escolha compara com o índice original', () => {
  const q = { type: 'multiple', options: ['a', 'b', 'c'], answer: 1 };
  assert.equal(gradeQuestion(q, 1), true);
  assert.equal(gradeQuestion(q, 0), false);
});

test('verdadeiro ou falso', () => {
  const q = { type: 'truefalse', answer: false };
  assert.equal(gradeQuestion(q, false), true);
  assert.equal(gradeQuestion(q, true), false);
});

test('lacuna aceita alternativas, ignora espaços extras e diferencia maiúsculas', () => {
  const q = { type: 'fill', code: 'public static void main(___) {}', blanks: [['String[] args', 'String... args']] };
  assert.equal(gradeQuestion(q, ['String[] args']), true);
  assert.equal(gradeQuestion(q, ['  String...   args ']), true);
  assert.equal(gradeQuestion(q, ['String[]args']), false);
  assert.equal(gradeQuestion(q, ['string[] args']), false);
});

test('lacuna com caseInsensitive aceita outra caixa', () => {
  const q = { type: 'fill', code: '___ * FROM alunos;', blanks: [['SELECT']], caseInsensitive: true };
  assert.equal(gradeQuestion(q, ['select']), true);
});

test('várias lacunas: todas precisam estar certas', () => {
  const q = { type: 'fill', code: '___ x = ___;', blanks: [['int'], ['5']] };
  assert.equal(gradeQuestion(q, ['int', '5']), true);
  assert.equal(gradeQuestion(q, ['int', '6']), false);
  assert.equal(gradeQuestion(q, ['int']), false);
  assert.equal(isBlankCorrect(q, 1, ' 5 '), true);
  assert.equal(isBlankCorrect(q, 1, '6'), false);
});

test('ordenar compara o texto sem recuo e aceita linhas idênticas em qualquer posição', () => {
  const q = { type: 'order', lines: ['if (x) {', '    a();', '}', 'while (y) {', '    b();', '}'] };
  const resposta = ['if (x) {', 'a();', '}', 'while (y) {', 'b();', '}'];
  assert.equal(gradeQuestion(q, resposta), true);
  assert.equal(gradeQuestion(q, ['if (x) {', 'b();', '}', 'while (y) {', 'a();', '}']), false);
  assert.equal(gradeQuestion(q, ['if (x) {', 'a();', '}']), false);
});

test('tipo desconhecido lança erro', () => {
  assert.throws(() => gradeQuestion({ type: 'code' }, 'x'), /Tipo de pergunta desconhecido/);
});
