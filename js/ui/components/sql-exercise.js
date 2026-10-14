// Exercício de SQL: enunciado, "Tabelas deste exercício", caixa de texto, Executar e resultado.
// mode 'challenge' (desafio da aula): cada execução corrige, com o esperado ao lado e "Ver uma resposta".
// mode 'question' (pergunta do quiz): Executar só mostra o resultado; Responder envia para a correção.
import { h, plural } from '../dom.js';
import { md } from '../markdown.js';

export const MAX_ROWS = 100;

export function resultTable(result, { label = null } = {}) {
  const shown = result.values.slice(0, MAX_ROWS);
  const hiddenRows = result.values.length - shown.length;
  return h('div', { class: 'sql-result' },
    label ? h('p', { class: 'sql-label', text: label }) : null,
    h('div', { class: 'sql-table-wrap' },
      h('table', { class: 'sql-table' },
        h('thead', {}, h('tr', {}, result.columns.map((c) => h('th', { scope: 'col', text: c })))),
        h('tbody', {}, shown.map((row) => h('tr', {}, row.map((v) => h('td', { class: v === null ? 'sql-null' : null, text: v === null ? 'NULL' : String(v) }))))))),
    result.values.length === 0 ? h('p', { class: 'muted small', text: 'A consulta não devolveu nenhuma linha.' }) : null,
    hiddenRows > 0 ? h('p', { class: 'muted small', text: `e mais ${hiddenRows} ${plural(hiddenRows, 'linha', 'linhas')}` }) : null);
}

export function errorBox(error, hint) {
  return h('div', { class: 'sql-error', role: 'alert' },
    h('p', {}, h('strong', { text: 'Erro do SQLite: ' }), h('code', { text: error })),
    hint ? h('p', { text: hint }) : null);
}

// Caixa de texto para SQL: Tab insere dois espaços; Esc libera o Tab para sair da caixa; Ctrl+Enter executa.
export function sqlEditor({ label, onRun }) {
  const area = h('textarea', {
    class: 'sql-input', rows: '5', 'aria-label': label, spellcheck: 'false',
    autocapitalize: 'off', autocomplete: 'off', autocorrect: 'off',
  });
  let tabIndents = true;
  area.addEventListener('focus', () => { tabIndents = true; });
  area.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      onRun();
    } else if (event.key === 'Escape') {
      tabIndents = false;
    } else if (event.key === 'Tab' && !event.shiftKey && tabIndents && !area.readOnly) {
      event.preventDefault();
      const { selectionStart: start, selectionEnd: end, value } = area;
      area.value = `${value.slice(0, start)}  ${value.slice(end)}`;
      area.selectionStart = start + 2;
      area.selectionEnd = start + 2;
      area.dispatchEvent(new window.Event('input', { bubbles: true }));
    }
  });
  return area;
}

const answerBlock = (exercise, lang) => md(`\`\`\`sql\n${exercise.answer}\n\`\`\``, { lang });
const statusLine = (verdict) => h('p', { class: `sql-status ${verdict.ok ? 'ok' : 'err'}`, text: `${verdict.ok ? '✅' : '❌'} ${verdict.message}` });

function verdictBody(verdict) {
  if (verdict.error) return errorBox(verdict.error, verdict.hint);
  return verdict.actual ? resultTable(verdict.actual, { label: 'Seu resultado' }) : null;
}

export function createSqlExercise(exercise, {
  service, lang, mode = 'challenge', title = null, showPrompt = true, onSubmit = () => {},
}) {
  const isChallenge = mode === 'challenge';
  const status = h('p', { class: 'muted small', text: 'Carregando o banco de dados…' });
  const tablesBox = h('div', { class: 'sql-tables-body' });
  const tables = h('details', { class: 'sql-tables' }, h('summary', { text: 'Tabelas deste exercício' }), tablesBox);
  const output = h('div', { class: 'sql-output', 'aria-live': 'polite' });
  const expectedBox = h('div', { class: 'sql-expected' });
  const answerBox = h('div', { class: 'sql-answer', hidden: true });
  const runBtn = h('button', { type: 'button', class: 'btn', disabled: true, text: 'Executar' });
  const showAnswerBtn = h('button', { type: 'button', class: 'btn btn-ghost', hidden: true, text: 'Ver uma resposta' });
  const submitBtn = h('button', { type: 'button', class: 'btn btn-primary', disabled: true, text: 'Responder' });
  const editor = sqlEditor({ label: 'Sua consulta SQL', onRun: () => run() });
  let ready = false;
  let locked = false;

  const refreshButtons = () => {
    runBtn.disabled = !ready || locked;
    submitBtn.disabled = !ready || locked || !editor.value.trim();
  };
  editor.addEventListener('input', refreshButtons);

  async function run() {
    if (!ready || locked) return;
    if (!editor.value.trim()) {
      output.replaceChildren(h('p', { class: 'muted small', text: 'Escreva uma consulta antes de executar.' }));
      return;
    }
    runBtn.disabled = true;
    try {
      if (isChallenge) {
        const verdict = await service.grade(exercise, editor.value);
        output.replaceChildren(statusLine(verdict), verdictBody(verdict) ?? '');
        showAnswerBtn.hidden = false;
      } else {
        const out = await service.execute(exercise, editor.value);
        if (out.error) output.replaceChildren(errorBox(out.error, out.hint));
        else if (out.result) output.replaceChildren(resultTable(out.result, { label: 'Resultado' }));
        else output.replaceChildren(h('p', { class: 'muted small', text: 'Sua consulta não devolveu uma tabela.' }));
      }
    } finally {
      refreshButtons();
    }
  }

  runBtn.addEventListener('click', run);
  showAnswerBtn.addEventListener('click', () => {
    answerBox.hidden = false;
    showAnswerBtn.hidden = true;
  });
  submitBtn.addEventListener('click', () => {
    if (submitBtn.disabled) return;
    lock();
    onSubmit(editor.value);
  });

  function lock() {
    locked = true;
    editor.readOnly = true;
    refreshButtons();
  }

  answerBox.append(h('p', { class: 'sql-label', text: 'Uma resposta certa:' }), answerBlock(exercise, lang),
    exercise.explanation ? md(exercise.explanation, { lang }) : '');

  const root = h('div', { class: `sql-exercise sql-${mode}` },
    title ? h('h3', { class: 'sql-title', text: title }) : null,
    showPrompt ? md(exercise.prompt, { lang }) : null,
    status,
    tables,
    editor,
    h('div', { class: 'sql-actions' }, runBtn, isChallenge ? showAnswerBtn : submitBtn),
    output,
    isChallenge ? expectedBox : null,
    isChallenge ? answerBox : null);

  const loaded = (async () => {
    try {
      const list = await service.tables(exercise);
      tablesBox.replaceChildren(...list.map((t) => resultTable(t.result, { label: t.name })));
      if (isChallenge) expectedBox.replaceChildren(resultTable(await service.expected(exercise), { label: 'Resultado esperado' }));
      ready = true;
      status.remove();
    } catch {
      status.className = 'sql-unavailable';
      status.textContent = 'Não foi possível carregar o banco de dados. Confira sua conexão e recarregue a página.';
    }
    refreshButtons();
  })();

  return {
    el: root,
    loaded,
    focus: () => editor.focus(),
    unlock() {
      locked = false;
      editor.readOnly = false;
      refreshButtons();
    },
    // Depois de Responder: no modo estudo mostra veredito, resultados e uma resposta certa.
    reveal({ verdict = null, showCorrect }) {
      lock();
      if (!showCorrect || !verdict) return;
      output.replaceChildren(statusLine(verdict), verdictBody(verdict) ?? '',
        verdict.expected ? resultTable(verdict.expected, { label: 'Resultado esperado' }) : '',
        h('p', { class: 'sql-label', text: 'Uma resposta certa:' }), answerBlock(exercise, lang));
    },
  };
}
