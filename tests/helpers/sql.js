// O sql.js dos testes é o mesmo pacote (e a mesma versão) que o site carrega do jsdelivr.
import { createRequire } from 'node:module';
import { createSqlEngine, executeSql } from '../../js/data/sql-engine.js';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
let loading = null;

export const loadNodeSqlJs = () => {
  loading ??= initSqlJs();
  return loading;
};

export const nodeSqlEngine = () => createSqlEngine({ load: loadNodeSqlJs });

// Função run(setup, sql, check) pronta para a correção, com o sql.js já carregado.
export async function nodeRun() {
  const SQL = await loadNodeSqlJs();
  return (setup, sql, check = null) => executeSql(SQL, setup, sql, check);
}
