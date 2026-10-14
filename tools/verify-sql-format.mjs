// Lógica pura da conferência dos trechos SQL (verify/sql), testada em tests/tools/verify-sql-format.test.js.
// Cabeçalho, em comentários "--" no início do arquivo:
//   -- verifica: o que o trecho prova
//   -- banco: escola | vazio | dados-ocultos:escola
//   -- espera: erro <texto que a mensagem contém>      (ou, no lugar do "espera":)
//   -- saida:                                          (sempre a última diretiva)
//   -- coluna1 | coluna2                               (primeira linha: os nomes das colunas)
//   -- valor   | NULL                                  (valores separados por |; nomes e valores sem |)
// O cabeçalho termina na primeira linha que não começa com "--". Se o SQL começa com um comentário,
// deixe uma linha em branco entre o cabeçalho e o SQL.
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export function parseTable(lines) {
  const [columns = [], ...rows] = lines.map((line) => line.split('|').map((cell) => cell.trim()));
  return { columns, rows };
}

export function parseSqlSnippet(source) {
  const lines = source.split(/\r?\n/);
  const header = [];
  for (const line of lines) {
    if (!line.startsWith('--')) break;
    header.push(line);
  }
  const directive = (prefix) => header.find((l) => l.startsWith(prefix))?.slice(prefix.length).trim();
  const bankText = directive('-- banco:');
  if (bankText === undefined) throw new Error('cabeçalho sem "-- banco:"');
  let bank = null;
  if (bankText !== 'vazio') {
    const m = /^(dados-ocultos:)?([a-z0-9-]+)$/.exec(bankText);
    if (!m) throw new Error(`"-- banco:" inválido: ${bankText}`);
    bank = { dataset: m[2], hidden: Boolean(m[1]) };
  }
  const sql = lines.slice(header.length).join('\n').trim();
  if (!sql) throw new Error('trecho sem SQL depois do cabeçalho');
  const expect = directive('-- espera:');
  if (expect !== undefined) {
    const m = /^erro(?:\s+(.+))?$/.exec(expect);
    if (!m) throw new Error(`"-- espera:" desconhecido: ${expect}`);
    return { bank, sql, expect: { kind: 'error', contains: m[1] ?? null } };
  }
  const start = header.findIndex((l) => l.trim() === '-- saida:');
  if (start < 0) throw new Error('cabeçalho sem "-- saida:" nem "-- espera:"');
  const tableLines = header.slice(start + 1).map((l) => l.replace(/^-- ?/, ''));
  if (!tableLines.length) throw new Error('"-- saida:" sem a linha dos nomes das colunas');
  return { bank, sql, expect: { kind: 'table', ...parseTable(tableLines) } };
}

export function formatCell(value) {
  return value === null ? 'NULL' : String(value);
}

export function formatTable({ columns, rows }) {
  return [columns, ...rows].map((row) => row.join(' | ')).join('\n');
}

// outcome = { result } ou { error }, como o runQuery de core/sql-grading. Devolve null se bateu.
export function judgeSqlSnippet(expect, outcome) {
  if (expect.kind === 'error') {
    if (!outcome.error) return 'esperava um erro, mas a consulta rodou';
    return expect.contains && !outcome.error.includes(expect.contains) ? `o erro não contém "${expect.contains}": ${outcome.error}` : null;
  }
  if (outcome.error) return `a consulta deu erro: ${outcome.error}`;
  if (!outcome.result) return 'a consulta não devolveu uma tabela';
  const got = { columns: outcome.result.columns.map(String), rows: outcome.result.values.map((row) => row.map(formatCell)) };
  const want = { columns: expect.columns, rows: expect.rows };
  return JSON.stringify(got) === JSON.stringify(want) ? null : `resultado diferente.\nEsperado:\n${formatTable(want)}\nObtido:\n${formatTable(got)}`;
}

export function listSqlFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return listSqlFiles(p);
    return name.endsWith('.sql') ? [p] : [];
  });
}
