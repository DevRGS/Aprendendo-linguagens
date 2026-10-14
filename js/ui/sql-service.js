// Junta o motor (data/sql-engine), os conjuntos de tabelas (data/content) e a correção (core/sql-grading)
// para as telas: executar, mostrar tabelas, calcular o esperado e corrigir.
import { loadDataset } from '../data/content.js';
import { gradeSql, runQuery, sqlErrorHint } from '../core/sql-grading.js';

const TABLES_SQL = "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name";
const quoteName = (name) => `"${String(name).replaceAll('"', '""')}"`;
const visibleSetup = (ds) => `${ds.schema}\n${ds.data}`;

export function createSqlService({ engine, getLanguage }) {
  const dataset = (ex) => loadDataset(getLanguage(ex.lang), ex.dataset);
  const run = (setup, sql, check) => engine.run(setup, sql, check);
  async function prepared(ex) {
    const [, ds] = await Promise.all([engine.ready(), dataset(ex)]);
    return ds;
  }
  return {
    ready: () => engine.ready(),
    preload: prepared,
    // As tabelas do banco visível, com todas as linhas.
    async tables(ex) {
      const setup = visibleSetup(await prepared(ex));
      const names = engine.run(setup, TABLES_SQL)[0].values.map(([name]) => name);
      return names.map((name) => ({ name, result: engine.run(setup, `SELECT * FROM ${quoteName(name)}`)[0] }));
    },
    async expected(ex) {
      return runQuery(run, visibleSetup(await prepared(ex)), ex.answer, ex.check ?? null).result;
    },
    // Só executa nos dados visíveis (o botão "Executar" das perguntas), sem dizer se está certo.
    async execute(ex, sql) {
      const out = runQuery(run, visibleSetup(await prepared(ex)), sql, ex.check ?? null);
      return out.error ? { ...out, hint: sqlErrorHint(out.error) } : out;
    },
    async grade(ex, sql) {
      return gradeSql(ex, sql, { run, dataset: await prepared(ex) });
    },
  };
}

export const hasSqlQuestions = (questions) => questions.some((q) => q.type === 'sql');

// Antes de um quiz: carrega o motor e as tabelas das perguntas "sql". Se não der, elas saem e um aviso explica.
// Quem chama só espera (await) quando hasSqlQuestions: sem SQL, o quiz começa na hora, como antes.
export async function usableQuestions(app, questions) {
  const sqlQuestions = questions.filter((q) => q.type === 'sql');
  if (!sqlQuestions.length) return questions;
  try {
    await Promise.all(sqlQuestions.map((q) => app.sql.preload(q)));
    return questions;
  } catch {
    app.layout.toast('As perguntas de escrever SQL ficaram de fora: não foi possível carregar o banco de dados. Confira sua conexão.', { tone: 'danger', timeout: 8000 });
    return questions.filter((q) => q.type !== 'sql');
  }
}
