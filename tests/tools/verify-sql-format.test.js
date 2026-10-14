import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { tmpdir } from 'node:os';
import {
  parseTable, parseSqlSnippet, formatCell, formatTable, judgeSqlSnippet, listSqlFiles,
} from '../../tools/verify-sql-format.mjs';

test('parseTable lê os nomes das colunas e as linhas, sem os espaços em volta', () => {
  assert.deepEqual(parseTable(['nome | nota', 'Ana  | 9.5', 'Bia  | NULL']), { columns: ['nome', 'nota'], rows: [['Ana', '9.5'], ['Bia', 'NULL']] });
  assert.deepEqual(parseTable(['nome']), { columns: ['nome'], rows: [] });
});

test('parseSqlSnippet entende banco, saída esperada e o SQL depois do cabeçalho', () => {
  const src = '-- verifica: a aula where\r\n-- banco: escola\r\n-- saida:\r\n-- nome | nota\r\n-- Ana  | 9.5\r\nSELECT nome, nota\r\nFROM alunos;\r\n';
  assert.deepEqual(parseSqlSnippet(src), {
    bank: { dataset: 'escola', hidden: false },
    sql: 'SELECT nome, nota\nFROM alunos;',
    expect: { kind: 'table', columns: ['nome', 'nota'], rows: [['Ana', '9.5']] },
  });
  assert.deepEqual(parseSqlSnippet('-- banco: dados-ocultos:escola\n-- saida:\n-- n\nSELECT 1 AS n;').bank, { dataset: 'escola', hidden: true });
  assert.equal(parseSqlSnippet('-- banco: vazio\n-- saida:\n-- n\nSELECT 1 AS n;').bank, null);
});

test('parseSqlSnippet: uma linha em branco separa o cabeçalho de um SQL que começa com comentário', () => {
  const src = '-- banco: vazio\n-- saida:\n-- n\n\n-- comentário do exemplo\nSELECT 1 AS n;';
  const snippet = parseSqlSnippet(src);
  assert.deepEqual(snippet.expect.rows, []);
  assert.equal(snippet.sql, '-- comentário do exemplo\nSELECT 1 AS n;');
});

test('parseSqlSnippet entende erro esperado, com ou sem texto', () => {
  assert.deepEqual(parseSqlSnippet('-- banco: vazio\n-- espera: erro no such table: x\nSELECT * FROM x;').expect, { kind: 'error', contains: 'no such table: x' });
  assert.deepEqual(parseSqlSnippet('-- banco: vazio\n-- espera: erro\nSELEC 1;').expect, { kind: 'error', contains: null });
});

test('parseSqlSnippet recusa cabeçalhos incompletos', () => {
  assert.throws(() => parseSqlSnippet('-- saida:\n-- n\nSELECT 1;'), /sem "-- banco:"/);
  assert.throws(() => parseSqlSnippet('-- banco: Escola\n-- saida:\n-- n\nSELECT 1;'), /"-- banco:" inválido/);
  assert.throws(() => parseSqlSnippet('-- banco: vazio\n-- saida:\n-- n\n'), /sem SQL/);
  assert.throws(() => parseSqlSnippet('-- banco: vazio\nSELECT 1;'), /sem "-- saida:" nem "-- espera:"/);
  assert.throws(() => parseSqlSnippet('-- banco: vazio\n-- espera: talvez\nSELECT 1;'), /"-- espera:" desconhecido/);
  assert.throws(() => parseSqlSnippet('-- banco: vazio\n-- saida:\nSELECT 1;'), /sem a linha dos nomes/);
});

test('formatCell e formatTable escrevem como no cabeçalho', () => {
  assert.equal(formatCell(null), 'NULL');
  assert.equal(formatCell(9.5), '9.5');
  assert.equal(formatCell(7), '7');
  assert.equal(formatCell('Ana'), 'Ana');
  assert.equal(formatTable({ columns: ['a', 'b'], rows: [['1', 'NULL']] }), 'a | b\n1 | NULL');
});

test('judgeSqlSnippet compara a tabela e o erro', () => {
  const table = { kind: 'table', columns: ['nome', 'nota'], rows: [['Ana', '9.5'], ['Davi', 'NULL']] };
  assert.equal(judgeSqlSnippet(table, { result: { columns: ['nome', 'nota'], values: [['Ana', 9.5], ['Davi', null]] } }), null);
  assert.match(judgeSqlSnippet(table, { result: { columns: ['nome', 'nota'], values: [['Ana', 9.5]] } }), /resultado diferente/);
  assert.match(judgeSqlSnippet(table, { error: 'no such column: nme' }), /a consulta deu erro: no such column: nme/);
  assert.match(judgeSqlSnippet(table, { result: null }), /não devolveu uma tabela/);
  const err = { kind: 'error', contains: 'no such table' };
  assert.equal(judgeSqlSnippet(err, { error: 'no such table: x' }), null);
  assert.match(judgeSqlSnippet(err, { error: 'incomplete input' }), /não contém "no such table"/);
  assert.match(judgeSqlSnippet(err, { result: { columns: ['x'], values: [] } }), /esperava um erro/);
  assert.equal(judgeSqlSnippet({ kind: 'error', contains: null }, { error: 'qualquer' }), null);
});

test('listSqlFiles acha .sql em subpastas e aceita pasta inexistente', () => {
  const dir = mkdtempSync(join(tmpdir(), 'verify-sql-'));
  try {
    mkdirSync(join(dir, 'consultas'));
    writeFileSync(join(dir, 'consultas', 'a.sql'), '');
    writeFileSync(join(dir, 'b.sql'), '');
    writeFileSync(join(dir, 'leia-me.txt'), '');
    assert.deepEqual(listSqlFiles(dir).map((f) => basename(f)).sort(), ['a.sql', 'b.sql']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.deepEqual(listSqlFiles(join(tmpdir(), 'nao-existe-mesmo')), []);
});
