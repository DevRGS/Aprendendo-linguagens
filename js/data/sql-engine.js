// Motor de SQL: carrega o sql.js sob demanda (uma vez por página) e executa cada SQL num banco novo.
import { SQLJS_URL, SQLJS_WASM_URL } from '../config.js';

function runStatements(db, sql) {
  const results = [];
  // iterateStatements (e não db.exec): o exec omite as consultas que não devolvem nenhuma linha.
  for (const stmt of db.iterateStatements(sql)) {
    try {
      const columns = stmt.getColumnNames();
      const values = [];
      while (stmt.step()) values.push(stmt.get());
      if (columns.length) results.push({ columns, values });
    } finally {
      stmt.free();
    }
  }
  return results;
}

// Cria um banco com `setup`, roda `sql` e, se houver, `check` no mesmo banco. Devolve toda instrução
// que tem colunas, mesmo sem linhas; os resultados de `check` vêm por último. Erros do SQLite são lançados.
export function executeSql(SQL, setup, sql, check = null) {
  const db = new SQL.Database();
  try {
    db.exec(setup);
    const results = runStatements(db, sql);
    if (check) results.push(...runStatements(db, check));
    return results;
  } finally {
    db.close();
  }
}

export function loadScript(src, doc = document) {
  return new Promise((resolve, reject) => {
    const el = doc.createElement('script');
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => {
      el.remove();
      reject(new Error(`Não foi possível carregar ${src}`));
    };
    doc.head.append(el);
  });
}

// O pacote do sql.js não traz módulo ES: o script define a função global initSqlJs.
export async function loadSqlJsFromCdn({ inject = loadScript, scope = globalThis } = {}) {
  if (typeof scope.initSqlJs !== 'function') await inject(SQLJS_URL);
  if (typeof scope.initSqlJs !== 'function') throw new Error('O sql.js não ficou disponível.');
  try {
    return await scope.initSqlJs({ locateFile: () => SQLJS_WASM_URL });
  } catch (err) {
    // O initSqlJs guarda a promessa, mesmo rejeitada. Sem ele, a próxima tentativa roda o script de novo,
    // e o script recomeça do zero.
    scope.initSqlJs = undefined;
    throw err;
  }
}

// Rejeita se `promise` não terminar em `ms`; o relógio é desligado assim que ela termina.
function withTimeout(promise, ms, message) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), ms); });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export function createSqlEngine({ load = () => loadSqlJsFromCdn(), timeoutMs = 45_000 } = {}) {
  let SQL = null;
  let pending = null;
  return {
    // Carrega uma vez; se falhar ou demorar demais, a próxima chamada tenta de novo. Um carregamento
    // que termina depois do tempo limite ainda vale: as próximas chamadas já encontram o banco pronto.
    ready() {
      if (SQL) return Promise.resolve();
      if (!pending) {
        const loading = Promise.resolve().then(load).then((mod) => { SQL = mod; });
        pending = withTimeout(loading, timeoutMs, 'O banco de dados demorou demais para carregar.')
          .catch((err) => {
            pending = null;
            throw err;
          });
      }
      return pending;
    },
    isReady: () => SQL !== null,
    run(setup, sql, check = null) {
      if (!SQL) throw new Error('O motor de SQL ainda não foi carregado.');
      return executeSql(SQL, setup, sql, check);
    },
  };
}
