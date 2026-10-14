import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nodeRun } from '../helpers/sql.js';
import {
  sameValue, compareResults, runQuery, sqlErrorHint, verdictMessage, gradeSql,
} from '../../js/core/sql-grading.js';

const dataset = {
  schema: 'CREATE TABLE alunos (id INTEGER PRIMARY KEY, nome TEXT, nota REAL, cidade TEXT);',
  data: "INSERT INTO alunos VALUES (1, 'Ana', 9.5, 'Recife'), (2, 'Bia', 7, 'Natal'), (3, 'Caio', 8.5, 'Recife'), (4, 'Davi', 6, NULL);",
  hidden: "INSERT INTO alunos VALUES (1, 'Eva', 5, 'Natal'), (2, 'Fábio', 9, 'Recife'), (3, 'Gil', 8.5, NULL), (4, 'Hana', 10, 'Natal');",
};
const notaAlta = { id: 'teste.q01', answer: 'SELECT nome FROM alunos WHERE nota > 8;' };
const r = (columns, values) => ({ columns, values });

test('sameValue: números pelo valor, com folga mínima; texto, NULL e tipos exatos', () => {
  assert.equal(sameValue(5, 5.0), true);
  assert.equal(sameValue(0.1 + 0.2, 0.3), true);
  assert.equal(sameValue(1e12, 1e12 + 1), true);
  assert.equal(sameValue(1e12, 1e12 + 1e4), false);
  assert.equal(sameValue(8.5, 8.49), false);
  assert.equal(sameValue(7, '7'), false);
  assert.equal(sameValue(null, null), true);
  assert.equal(sameValue(null, 0), false);
  assert.equal(sameValue('a', 'A'), false);
});

test('compareResults aponta colunas, nomes, linhas, conteúdo e ordem, nessa prioridade', () => {
  const exp = r(['nome', 'nota'], [['Ana', 9.5], ['Caio', 8.5]]);
  assert.deepEqual(compareResults(exp, r(['nome'], [['Ana']])), { reason: 'colunas', expectedCount: 2, actualCount: 1 });
  assert.equal(compareResults(exp, r(['n', 'x'], [['Caio', 8.5], ['Ana', 9.5]])), null);
  assert.deepEqual(compareResults(exp, r(['n', 'x'], [['Ana', 9.5], ['Caio', 8.5]]), { columnNames: true }),
    { reason: 'nomes', expectedNames: ['nome', 'nota'] });
  assert.equal(compareResults(exp, r([' NOME ', 'Nota'], [['Ana', 9.5], ['Caio', 8.5]]), { columnNames: true }), null);
  assert.deepEqual(compareResults(exp, r(['nome', 'nota'], [['Ana', 9.5]])), { reason: 'linhas', expectedCount: 2, actualCount: 1 });
  assert.deepEqual(compareResults(exp, r(['nome', 'nota'], [['Ana', 9.5], ['Caio', 8]])), { reason: 'conteudo' });
  assert.deepEqual(compareResults(exp, r(['nome', 'nota'], [['Caio', 8.5], ['Ana', 9.5]]), { ordered: true }), { reason: 'ordem' });
  assert.equal(compareResults(exp, r(['nome', 'nota'], [['Ana', 9.5], ['Caio', 8.5]]), { ordered: true }), null);
});

test('compareResults conta repetições e não confunde número com texto', () => {
  assert.deepEqual(compareResults(r(['x'], [[1], [1], [2]]), r(['x'], [[1], [2], [2]])), { reason: 'conteudo' });
  assert.deepEqual(compareResults(r(['x'], [[7]]), r(['x'], [['7']])), { reason: 'conteudo' });
  assert.equal(compareResults(r(['x'], [[null], [5]]), r(['x'], [[5.0], [null]])), null);
});

test('runQuery pega o resultado da última instrução com colunas, ou null, ou o erro', async () => {
  const run = await nodeRun();
  const setup = `${dataset.schema}\n${dataset.data}`;
  assert.deepEqual(runQuery(run, setup, 'SELECT 1 AS a; SELECT 2 AS b').result, r(['b'], [[2]]));
  assert.deepEqual(runQuery(run, setup, "UPDATE alunos SET nota = 0 WHERE id = 1"), { result: null });
  assert.deepEqual(runQuery(run, setup, 'SELEC 1'), { error: 'near "SELEC": syntax error' });
});

test('sqlErrorHint traduz os erros comuns e devolve null para os outros', () => {
  assert.match(sqlErrorHint('no such table: aluno'), /A tabela aluno não existe/);
  assert.match(sqlErrorHint('no such column: nme'), /A coluna nme não existe/);
  assert.match(sqlErrorHint('near "FORM": syntax error'), /Erro de sintaxe perto de FORM/);
  assert.match(sqlErrorHint('incomplete input'), /terminou antes da hora/);
  assert.match(sqlErrorHint('ambiguous column name: id'), /Diga de qual: tabela\.id/);
  assert.equal(sqlErrorHint('UNIQUE constraint failed: alunos.id'), null);
});

test('verdictMessage concorda número e plural', () => {
  assert.equal(verdictMessage('colunas', { actualCount: 3, expectedCount: 1 }), 'Sua consulta devolveu 3 colunas; o esperado é 1 coluna.');
  assert.equal(verdictMessage('linhas', { actualCount: 1, expectedCount: 0 }), 'Sua consulta devolveu 1 linha; o esperado são 0 linhas.');
  assert.equal(verdictMessage('nomes', { expectedNames: ['nome', 'media'] }), 'As colunas devem se chamar: nome, media.');
});

test('gradeSql aceita outro caminho para o mesmo resultado, nos dados visíveis e nos ocultos', async () => {
  const run = await nodeRun();
  const v = gradeSql(notaAlta, 'select NOME from alunos where 8 < nota', { run, dataset });
  assert.equal(v.ok, true);
  assert.equal(v.message, 'Resultado certo!');
  assert.deepEqual(v.expected, r(['nome'], [['Ana'], ['Caio']]));
});

test('gradeSql recusa quem acerta por coincidência só nos dados visíveis', async () => {
  const run = await nodeRun();
  const v = gradeSql(notaAlta, 'SELECT nome FROM alunos WHERE id IN (1, 3)', { run, dataset });
  assert.equal(v.ok, false);
  assert.equal(v.reason, 'coincidencia');
  assert.match(v.message, /não funcionaria com outros dados/);
  assert.deepEqual(v.actual, v.expected);
});

test('gradeSql explica erro, falta de tabela e diferença de colunas', async () => {
  const run = await nodeRun();
  const erro = gradeSql(notaAlta, 'SELECT nme FROM alunos', { run, dataset });
  assert.deepEqual([erro.ok, erro.reason, erro.error], [false, 'erro', 'no such column: nme']);
  assert.match(erro.hint, /A coluna nme não existe/);
  assert.equal(erro.actual, null);
  const semTabela = gradeSql(notaAlta, "UPDATE alunos SET nota = 10", { run, dataset });
  assert.equal(semTabela.reason, 'sem-resultado');
  const colunas = gradeSql(notaAlta, 'SELECT nome, nota FROM alunos WHERE nota > 8', { run, dataset });
  assert.equal(colunas.reason, 'colunas');
  assert.equal(colunas.message, 'Sua consulta devolveu 2 colunas; o esperado é 1 coluna.');
});

test('gradeSql com check compara o estado da tabela depois da alteração', async () => {
  const run = await nodeRun();
  const insere = {
    id: 'teste.q02',
    answer: "INSERT INTO alunos (id, nome, nota, cidade) VALUES (5, 'Íris', 8, 'Natal');",
    check: 'SELECT id, nome, nota, cidade FROM alunos ORDER BY id',
  };
  assert.equal(gradeSql(insere, "INSERT INTO alunos VALUES (5, 'Íris', 8, 'Natal')", { run, dataset }).ok, true);
  assert.equal(gradeSql(insere, "INSERT INTO alunos VALUES (5, 'Iris', 8, 'Natal')", { run, dataset }).reason, 'conteudo');
});

test('gradeSql avisa quando a própria resposta de referência falha', async () => {
  const run = await nodeRun();
  assert.throws(() => gradeSql({ id: 'teste.q03', answer: 'SELECT x FROM nada' }, 'SELECT 1', { run, dataset }),
    /A resposta de referência de teste\.q03 falhou: no such table: nada/);
});
