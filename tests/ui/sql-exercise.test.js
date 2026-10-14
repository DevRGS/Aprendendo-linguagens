import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, waitFor } from '../helpers/dom.js';
import { makeTestApp, profileState, texts } from '../helpers/app.js';
import { loadBanks, loadChallenges } from '../../js/data/content.js';
import { createSqlEngine } from '../../js/data/sql-engine.js';
import { createSqlExercise, resultTable, sqlEditor, errorBox, MAX_ROWS } from '../../js/ui/components/sql-exercise.js';

setupDom();

async function setup(options = {}) {
  const app = await makeTestApp({ state: profileState(), fixture: 'sql-ui', ...options });
  const [sql] = app.languages;
  const challenges = await loadChallenges(sql, sql.modules[0]);
  const byId = new Map((await loadBanks(app.languages)).questions.map((q) => [q.id, q]));
  return { app, challenges, byId };
}

async function mountExercise(app, exercise, opts) {
  const ex = createSqlExercise(exercise, { service: app.sql, lang: 'sql', ...opts });
  document.body.append(ex.el);
  await ex.loaded;
  return ex;
}

const type = (ex, sql) => {
  const area = ex.el.querySelector('textarea');
  area.value = sql;
  area.dispatchEvent(new window.Event('input', { bubbles: true }));
};
const button = (ex, label) => [...ex.el.querySelectorAll('button')].find((b) => b.textContent === label);

test('desafio: mostra as tabelas visíveis e o resultado esperado; os dados ocultos nunca aparecem', async () => {
  const { app, challenges } = await setup();
  const ex = await mountExercise(app, challenges[1], { mode: 'challenge', title: 'Desafio 2' });
  assert.equal(ex.el.querySelector('.sql-title').textContent, 'Desafio 2');
  assert.equal(ex.el.querySelector('.sql-tables summary').textContent, 'Tabelas deste exercício');
  const tableText = ex.el.querySelector('.sql-tables').textContent;
  assert.match(tableText, /Ana.*Bruno.*Carla.*Davi/s);
  assert.doesNotMatch(ex.el.textContent, /Elisa|Fábio|Gabi|Hugo/);
  assert.deepEqual(texts(ex.el, '.sql-expected td'), ['Ana', 'Carla']);
  assert.equal(button(ex, 'Executar').disabled, false);
  ex.el.remove();
});

test('desafio: cada execução corrige; "Ver uma resposta" aparece depois da primeira', async () => {
  const { app, challenges } = await setup();
  const ex = await mountExercise(app, challenges[1], { mode: 'challenge' });
  assert.equal(button(ex, 'Ver uma resposta').hidden, true);
  type(ex, 'SELECT nome FROM pessoas WHERE id IN (1, 3)');
  button(ex, 'Executar').click();
  await waitFor(() => ex.el.querySelector('.sql-status'));
  assert.match(ex.el.querySelector('.sql-status').textContent, /^❌ Seu resultado bate nestas tabelas/);
  type(ex, 'SELECT nome FROM pessoas WHERE idade > 30');
  button(ex, 'Executar').click();
  await waitFor(() => /✅/.test(ex.el.querySelector('.sql-status').textContent));
  assert.equal(ex.el.querySelector('.sql-status').textContent, '✅ Resultado certo!');
  assert.deepEqual(texts(ex.el, '.sql-output td'), ['Ana', 'Carla']);
  button(ex, 'Ver uma resposta').click();
  assert.equal(ex.el.querySelector('.sql-answer').hidden, false);
  assert.match(ex.el.querySelector('.sql-answer').textContent, /SELECT nome FROM pessoas WHERE idade > 30;/);
  ex.el.remove();
});

test('desafio: erro do SQLite aparece com a dica; caixa vazia pede uma consulta', async () => {
  const { app, challenges } = await setup();
  const ex = await mountExercise(app, challenges[0], { mode: 'challenge' });
  button(ex, 'Executar').click();
  assert.equal(ex.el.querySelector('.sql-output').textContent, 'Escreva uma consulta antes de executar.');
  type(ex, 'SELECT * FROM pessoa');
  button(ex, 'Executar').click();
  await waitFor(() => ex.el.querySelector('.sql-error'));
  assert.equal(ex.el.querySelector('.sql-error').getAttribute('role'), 'alert');
  assert.match(ex.el.querySelector('.sql-error').textContent, /no such table: pessoa.*A tabela pessoa não existe/s);
  ex.el.remove();
});

test('pergunta: Executar só mostra o resultado; Responder envia e trava a caixa', async () => {
  const { app, byId } = await setup();
  const sent = [];
  const ex = await mountExercise(app, byId.get('sql.teste.q01'), { mode: 'question', onSubmit: (sql) => sent.push(sql) });
  assert.equal(button(ex, 'Responder').disabled, true);
  type(ex, 'SELECT nome FROM pessoas WHERE idade < 20');
  assert.equal(button(ex, 'Responder').disabled, false);
  button(ex, 'Executar').click();
  await waitFor(() => ex.el.querySelector('.sql-output td'));
  assert.deepEqual(texts(ex.el, '.sql-output td'), ['Davi']);
  assert.equal(ex.el.querySelector('.sql-status'), null);
  button(ex, 'Responder').click();
  assert.deepEqual(sent, ['SELECT nome FROM pessoas WHERE idade < 20']);
  assert.equal(ex.el.querySelector('textarea').readOnly, true);
  assert.equal(button(ex, 'Executar').disabled, true);
  ex.unlock();
  assert.equal(ex.el.querySelector('textarea').readOnly, false);
  ex.el.remove();
});

test('pergunta: reveal mostra veredito, esperado e uma resposta certa só no modo estudo', async () => {
  const { app, byId } = await setup();
  const q = byId.get('sql.teste.q01');
  const verdict = await app.sql.grade(q, 'SELECT nome FROM pessoas');
  const estudo = await mountExercise(app, q, { mode: 'question' });
  estudo.reveal({ verdict, showCorrect: true });
  assert.match(estudo.el.querySelector('.sql-status').textContent, /^❌ Sua consulta devolveu 4 linhas; o esperado são 2 linhas\./);
  assert.match(estudo.el.querySelector('.sql-output').textContent, /Resultado esperado.*Uma resposta certa:.*WHERE idade > 30/s);
  const simulado = await mountExercise(app, q, { mode: 'question' });
  simulado.reveal({ verdict, showCorrect: false });
  assert.equal(simulado.el.querySelector('.sql-output').textContent, '');
  assert.equal(simulado.el.querySelector('textarea').readOnly, true);
  estudo.el.remove();
  simulado.el.remove();
});

test('sem o motor, o exercício avisa e não deixa executar', async () => {
  const { app, challenges } = await setup({ sqlEngine: createSqlEngine({ load: async () => { throw new Error('rede'); } }) });
  const ex = await mountExercise(app, challenges[0], { mode: 'challenge' });
  assert.equal(ex.el.querySelector('.sql-unavailable').textContent,
    'Não foi possível carregar o banco de dados. Confira sua conexão e recarregue a página.');
  assert.equal(button(ex, 'Executar').disabled, true);
  ex.el.remove();
});

test(`resultTable mostra até ${MAX_ROWS} linhas, NULL e o aviso de linhas a mais ou de nenhuma linha`, () => {
  const many = resultTable({ columns: ['x'], values: Array.from({ length: 150 }, (_, i) => [i]) }, { label: 'Resultado' });
  assert.equal(many.querySelectorAll('tbody tr').length, MAX_ROWS);
  assert.equal(many.querySelector('.sql-label').textContent, 'Resultado');
  assert.match(many.textContent, /e mais 50 linhas/);
  const one = resultTable({ columns: ['x'], values: Array.from({ length: 101 }, () => [null]) });
  assert.match(one.textContent, /e mais 1 linha$/);
  assert.equal(one.querySelector('td').className, 'sql-null');
  assert.equal(one.querySelector('td').textContent, 'NULL');
  const empty = resultTable({ columns: ['nome'], values: [] });
  assert.deepEqual(texts(empty, 'th'), ['nome']);
  assert.match(empty.textContent, /A consulta não devolveu nenhuma linha\./);
  assert.match(errorBox('incomplete input', null).textContent, /^Erro do SQLite: incomplete input$/);
});

test('sqlEditor: Tab indenta, Esc libera o Tab para sair e Ctrl+Enter executa', () => {
  let runs = 0;
  const area = sqlEditor({ label: 'Sua consulta SQL', onRun: () => { runs += 1; } });
  document.body.append(area);
  assert.equal(area.getAttribute('aria-label'), 'Sua consulta SQL');
  assert.equal(area.getAttribute('spellcheck'), 'false');
  area.value = 'SELECT';
  area.selectionStart = 0;
  area.selectionEnd = 0;
  const tab = new window.KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
  area.dispatchEvent(tab);
  assert.equal(tab.defaultPrevented, true);
  assert.equal(area.value, '  SELECT');
  assert.equal(area.selectionStart, 2);
  area.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape' }));
  const tabOut = new window.KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
  area.dispatchEvent(tabOut);
  assert.equal(tabOut.defaultPrevented, false);
  area.dispatchEvent(new window.Event('focus'));
  const tabAgain = new window.KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
  area.dispatchEvent(tabAgain);
  assert.equal(tabAgain.defaultPrevented, true);
  area.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, cancelable: true }));
  area.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', metaKey: true, cancelable: true }));
  assert.equal(runs, 2);
  area.remove();
});

test('se a correção ou a execução falha, o exercício avisa e deixa tentar de novo', async () => {
  const { app, challenges, byId } = await setup();
  const broken = { ...app.sql, grade: async () => { throw new Error('quebrou'); }, execute: async () => { throw new Error('quebrou'); } };
  for (const [exercise, mode] of [[challenges[0], 'challenge'], [byId.get('sql.teste.q01'), 'question']]) {
    const ex = createSqlExercise(exercise, { service: broken, lang: 'sql', mode });
    document.body.append(ex.el);
    await ex.loaded;
    type(ex, 'SELECT nome FROM pessoas');
    button(ex, 'Executar').click();
    await waitFor(() => /Não foi possível executar agora/.test(ex.el.querySelector('.sql-output').textContent));
    assert.equal(button(ex, 'Executar').disabled, false);
    ex.el.remove();
  }
});

test('cada caixa de SQL tem um nome próprio para o leitor de tela', async () => {
  const { app, challenges } = await setup();
  const one = await mountExercise(app, challenges[0], { mode: 'challenge', title: 'Desafio 1' });
  const two = await mountExercise(app, challenges[1], { mode: 'challenge', title: 'Desafio 2' });
  const plain = await mountExercise(app, challenges[0], { mode: 'challenge' });
  assert.equal(one.el.querySelector('textarea').getAttribute('aria-label'), 'Sua consulta SQL, Desafio 1');
  assert.equal(two.el.querySelector('textarea').getAttribute('aria-label'), 'Sua consulta SQL, Desafio 2');
  assert.equal(plain.el.querySelector('textarea').getAttribute('aria-label'), 'Sua consulta SQL');
  for (const ex of [one, two, plain]) ex.el.remove();
});
