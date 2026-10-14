// Correção de exercícios de SQL pelo resultado (especificação de SQL, seção 6). Não conhece o sql.js:
// recebe run(setup, sql, check), que devolve [{ columns, values }] ou lança o erro do SQLite.

export const NUMBER_TOLERANCE = 1e-9;

export function sameValue(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return Math.abs(a - b) <= NUMBER_TOLERANCE * Math.max(1, Math.abs(a), Math.abs(b));
  }
  return a === b;
}

const cellKey = (v) => {
  if (v === null) return ['z'];
  if (typeof v === 'number') return ['n', Number(v.toPrecision(12))];
  return ['s', String(v)];
};
const rowKey = (row) => JSON.stringify(row.map(cellKey));
const sortRows = (rows) => [...rows].sort((a, b) => (rowKey(a) < rowKey(b) ? -1 : rowKey(a) > rowKey(b) ? 1 : 0));
const sameRows = (xs, ys) => xs.every((row, i) => row.every((v, j) => sameValue(v, ys[i][j])));
const sameName = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase();

// Devolve null se os resultados batem, ou { reason, ... } com o primeiro motivo da diferença.
export function compareResults(expected, actual, { ordered = false, columnNames = false } = {}) {
  if (actual.columns.length !== expected.columns.length) {
    return { reason: 'colunas', expectedCount: expected.columns.length, actualCount: actual.columns.length };
  }
  if (columnNames && !expected.columns.every((c, i) => sameName(c, actual.columns[i]))) {
    return { reason: 'nomes', expectedNames: expected.columns };
  }
  if (actual.values.length !== expected.values.length) {
    return { reason: 'linhas', expectedCount: expected.values.length, actualCount: actual.values.length };
  }
  const asMultiset = sameRows(sortRows(actual.values), sortRows(expected.values));
  if (!ordered) return asMultiset ? null : { reason: 'conteudo' };
  if (sameRows(actual.values, expected.values)) return null;
  return asMultiset ? { reason: 'ordem' } : { reason: 'conteudo' };
}

// Roda e devolve { result } (o da última instrução com colunas, ou null se nenhuma tem) ou { error }.
export function runQuery(run, setup, sql, check = null) {
  try {
    const results = run(setup, sql, check);
    return { result: results.length ? results[results.length - 1] : null };
  } catch (err) {
    return { error: String(err?.message ?? err) };
  }
}

const HINTS = [
  [/^no such table: (.+)$/, (m) => `A tabela ${m[1]} não existe. Confira o nome em "Tabelas deste exercício".`],
  [/^no such column: (.+)$/, (m) => `A coluna ${m[1]} não existe nessas tabelas. Confira o nome e de qual tabela ela é.`],
  [/^near "(.+)": syntax error$/, (m) => `Erro de sintaxe perto de ${m[1]}. Confira vírgulas, aspas e a ordem das cláusulas.`],
  [/^incomplete input$/, () => 'A consulta terminou antes da hora. Falta fechar parênteses ou aspas?'],
  [/^unrecognized token: "'/, () => "Uma aspa simples ficou aberta: feche o texto com outra ', como em 'Recife'."],
  [/^unrecognized token: ""/, () => 'Umas aspas duplas ficaram abertas: feche o nome com outras ".'],
  [/^ambiguous column name: (.+)$/, (m) => `A coluna ${m[1]} existe em mais de uma tabela. Diga de qual: tabela.${m[1]}.`],
];

// Aspas curvas (o celular costuma trocar ' e " por elas): o SQLite as trata como letras de um nome.
const CURLY_QUOTES = /[‘’“”]/;

// sql é o texto digitado: com aspas curvas, a mensagem do SQLite nem sempre as mostra.
export function sqlErrorHint(message, sql = '') {
  if (CURLY_QUOTES.test(String(message ?? '')) || CURLY_QUOTES.test(String(sql ?? ''))) {
    return 'Use aspas retas: \' para textos e " para nomes. As aspas curvas (‘ ’ “ ”), que o celular costuma colocar, o SQL não entende.';
  }
  for (const [re, hint] of HINTS) {
    const m = re.exec(String(message ?? ''));
    if (m) return hint(m);
  }
  return null;
}

const count = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const expectedIs = (n, one, many) => `o esperado ${n === 1 ? 'é' : 'são'} ${count(n, one, many)}`;

export function verdictMessage(reason, detail = {}) {
  switch (reason) {
    case 'ok': return 'Resultado certo!';
    case 'erro': return 'A consulta deu erro.';
    case 'sem-resultado': return 'Sua consulta não devolveu uma tabela. Termine com um SELECT.';
    case 'colunas':
      return `Sua consulta devolveu ${count(detail.actualCount, 'coluna', 'colunas')}; ${expectedIs(detail.expectedCount, 'coluna', 'colunas')}.`;
    case 'nomes': return `As colunas devem se chamar: ${detail.expectedNames.join(', ')}.`;
    case 'linhas':
      return `Sua consulta devolveu ${count(detail.actualCount, 'linha', 'linhas')}; ${expectedIs(detail.expectedCount, 'linha', 'linhas')}.`;
    case 'conteudo': return 'Algumas linhas não são as esperadas.';
    case 'ordem': return 'As linhas estão certas, mas a ordem não: o enunciado pede ordenação.';
    case 'coincidencia':
      if (detail.order) {
        return 'Seu resultado bate nestas tabelas, mas com outros dados a ordem sairia errada. Confira o ORDER BY: sem ele, o banco não garante a ordem das linhas.';
      }
      return 'Seu resultado bate nestas tabelas, mas a consulta não funcionaria com outros dados. Confira o filtro.';
    default: return '';
  }
}

// Corrige `sql` contra a resposta de referência do exercício: primeiro nos dados visíveis, depois nos ocultos.
// dataset = { schema, data, hidden } (textos SQL). actual e expected são sempre os do banco visível.
export function gradeSql(exercise, sql, { run, dataset }) {
  const check = exercise.check ?? null;
  const banks = [`${dataset.schema}\n${dataset.data}`, `${dataset.schema}\n${dataset.hidden}`];
  let shown = null;
  for (let i = 0; i < banks.length; i++) {
    const ref = runQuery(run, banks[i], exercise.answer, check);
    if (ref.error) throw new Error(`A resposta de referência de ${exercise.id} falhou: ${ref.error}`);
    const mine = runQuery(run, banks[i], sql, check);
    const hidden = i === 1;
    if (!hidden) shown = { actual: mine.result ?? null, expected: ref.result };
    let reason = null;
    let detail = {};
    if (mine.error) reason = 'erro';
    else if (!mine.result) reason = 'sem-resultado';
    else {
      const diff = compareResults(ref.result, mine.result, exercise);
      if (diff) ({ reason, ...detail } = diff);
    }
    if (reason) {
      if (hidden) {
        detail = { order: reason === 'ordem' };
        reason = 'coincidencia';
      }
      const error = hidden ? null : mine.error ?? null;
      return {
        ok: false, reason, message: verdictMessage(reason, detail), ...shown,
        error, hint: error ? sqlErrorHint(error, sql) : null,
      };
    }
  }
  return { ok: true, reason: 'ok', message: verdictMessage('ok'), ...shown, error: null, hint: null };
}
