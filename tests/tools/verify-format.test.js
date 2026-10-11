import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { parseExpectation, parseJavaMajor, judge, listJavaFiles } from '../../tools/verify-format.mjs';

test('parseJavaMajor entende o formato antigo e o novo', () => {
  assert.equal(parseJavaMajor('java version "1.8.0_401"'), 8);
  assert.equal(parseJavaMajor('openjdk version "21.0.5" 2024-10-15 LTS'), 21);
  assert.equal(parseJavaMajor('openjdk version "25" 2025-09-16'), 25);
  assert.equal(parseJavaMajor(''), 0);
});

test('judge aceita a saída igual e recusa a diferente', () => {
  const exp = { kind: 'output', output: '3\n0' };
  assert.equal(judge(exp, { code: 0, stdout: '3\r\n0\r\n', stderr: '' }), null);
  assert.match(judge(exp, { code: 0, stdout: '3\n1', stderr: '' }), /saída diferente/);
  assert.match(judge(exp, { code: 1, stdout: '', stderr: 'boom' }), /código 1/);
});

test('judge de erro de compilação exige "compilation failed"', () => {
  const exp = { kind: 'compile-error' };
  assert.equal(judge(exp, { code: 1, stdout: '', stderr: 'Main.java:3: error: x\nerror: compilation failed' }), null);
  assert.match(judge(exp, { code: 0, stdout: 'ok', stderr: '' }), /esperava erro de compilação/);
  assert.match(judge(exp, { code: 1, stdout: '', stderr: 'Exception in thread "main" java.lang.RuntimeException' }), /esperava erro de compilação/);
});

test('judge de exceção exige o nome e que tenha compilado', () => {
  const exp = { kind: 'exception', name: 'NumberFormatException' };
  assert.equal(judge(exp, { code: 1, stdout: '', stderr: 'Exception in thread "main" java.lang.NumberFormatException: For input string: "abc"' }), null);
  assert.match(judge(exp, { code: 1, stdout: '', stderr: 'java.lang.NullPointerException' }), /esperava a exceção/);
  assert.match(judge(exp, { code: 1, stdout: '', stderr: 'error: compilation failed NumberFormatException' }), /esperava a exceção/);
  assert.match(judge(exp, { code: 0, stdout: '', stderr: '' }), /esperava a exceção/);
});

test('listJavaFiles encontra .java em subpastas e ignora o resto', () => {
  const dir = mkdtempSync(join(tmpdir(), 'verify-'));
  try {
    mkdirSync(join(dir, 'fundamentos'));
    writeFileSync(join(dir, 'fundamentos', 'a.java'), '');
    writeFileSync(join(dir, 'b.java'), '');
    writeFileSync(join(dir, 'leia-me.txt'), '');
    assert.deepEqual(listJavaFiles(dir).map((f) => basename(f)).sort(), ['a.java', 'b.java']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('saída esperada com linha vazia', () => {
  const src = '// verifica: x\n// saida:\n// 3\n//\n// fim\nclass Main {}\n// saida: ignorado\n';
  assert.deepEqual(parseExpectation(src), { kind: 'output', output: '3\n\nfim' });
});

test('erro de compilação e exceção', () => {
  assert.deepEqual(parseExpectation('// espera: erro-de-compilacao\nclass Main {}'), { kind: 'compile-error' });
  assert.deepEqual(parseExpectation('// espera: excecao NumberFormatException\nclass Main {}'), { kind: 'exception', name: 'NumberFormatException' });
});

test('cabeçalho ausente ou desconhecido lança erro', () => {
  assert.throws(() => parseExpectation('class Main {}'), /cabeçalho/);
  assert.throws(() => parseExpectation('// espera: talvez\nclass Main {}'), /desconhecido/);
});

test('aceita quebras de linha do Windows', () => {
  assert.deepEqual(parseExpectation('// saida:\r\n// ok\r\nclass Main {}'), { kind: 'output', output: 'ok' });
});
