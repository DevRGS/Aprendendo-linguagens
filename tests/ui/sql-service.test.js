import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from '../helpers/dom.js';
import { makeTestApp, profileState, texts } from '../helpers/app.js';
import { loadBanks, loadChallenges } from '../../js/data/content.js';
import { createSqlEngine } from '../../js/data/sql-engine.js';
import { usableQuestions, createSqlService, hasSqlQuestions } from '../../js/ui/sql-service.js';

setupDom();

async function setup(options = {}) {
  const app = await makeTestApp({ state: profileState(), fixture: 'sql-ui', ...options });
  const [sql] = app.languages;
  const bank = await loadBanks(app.languages);
  const byId = new Map(bank.questions.map((q) => [q.id, q]));
  const challenges = await loadChallenges(sql, sql.modules[0]);
  return { app, byId, challenges };
}

const failingEngine = () => createSqlEngine({ load: async () => { throw new Error('rede'); } });

test('tables mostra as tabelas do banco visível, sem os dados ocultos', async () => {
  const { app, challenges } = await setup();
  const tables = await app.sql.tables(challenges[0]);
  assert.deepEqual(tables.map((t) => t.name), ['pessoas']);
  assert.deepEqual(tables[0].result.columns, ['id', 'nome', 'idade']);
  assert.deepEqual(tables[0].result.values.map((row) => row[1]), ['Ana', 'Bruno', 'Carla', 'Davi']);
});

test('expected roda a resposta de referência nos dados visíveis', async () => {
  const { app, challenges } = await setup();
  assert.deepEqual(await app.sql.expected(challenges[1]), { columns: ['nome'], values: [['Ana'], ['Carla']] });
});

test('execute só executa: devolve o resultado ou o erro com a dica', async () => {
  const { app, byId } = await setup();
  const q = byId.get('sql.teste.q01');
  assert.deepEqual(await app.sql.execute(q, 'SELECT nome FROM pessoas WHERE idade < 20'), { result: { columns: ['nome'], values: [['Davi']] } });
  const erro = await app.sql.execute(q, 'SELECT nme FROM pessoas');
  assert.equal(erro.error, 'no such column: nme');
  assert.match(erro.hint, /A coluna nme não existe/);
});

test('grade corrige com o teste escondido', async () => {
  const { app, byId } = await setup();
  const q = byId.get('sql.teste.q01');
  assert.equal((await app.sql.grade(q, 'SELECT nome FROM pessoas WHERE 30 < idade')).ok, true);
  assert.equal((await app.sql.grade(q, 'SELECT nome FROM pessoas WHERE id IN (1, 3)')).reason, 'coincidencia');
});

test('usableQuestions mantém as perguntas sql quando o motor carrega', async () => {
  const { app, byId } = await setup();
  const questions = [...byId.values()];
  assert.equal((await usableQuestions(app, questions)).length, 3);
});

test('usableQuestions tira as perguntas sql e avisa quando o motor não carrega', async () => {
  const { app, byId } = await setup({ sqlEngine: failingEngine() });
  const kept = await usableQuestions(app, [...byId.values()]);
  assert.deepEqual(kept.map((q) => q.id), ['sql.teste.q03']);
  assert.ok(texts(document, '#toasts .toast').some((t) => /As perguntas de escrever SQL ficaram de fora/.test(t)));
});

test('usableQuestions nem tenta carregar o motor quando não há perguntas sql', async () => {
  let loads = 0;
  const engine = createSqlEngine({ load: async () => { loads += 1; throw new Error('rede'); } });
  const service = createSqlService({ engine, getLanguage: () => null });
  const app = { sql: service, layout: { toast() { throw new Error('não devia avisar'); } } };
  const only = [{ id: 'x.q01', type: 'multiple' }];
  assert.equal(await usableQuestions(app, only), only);
  assert.equal(loads, 0);
});

test('hasSqlQuestions diz se há alguma pergunta sql na lista', () => {
  assert.equal(hasSqlQuestions([{ type: 'multiple' }, { type: 'sql' }]), true);
  assert.equal(hasSqlQuestions([{ type: 'fill' }]), false);
  assert.equal(hasSqlQuestions([]), false);
});

test('execute dá a dica das aspas curvas olhando também o SQL digitado', async () => {
  const { app, byId } = await setup();
  const out = await app.sql.execute(byId.get('sql.teste.q01'), 'SELECT nome AS “Nome da pessoa” FROM pessoas');
  assert.match(out.hint, /aspas retas/);
});
