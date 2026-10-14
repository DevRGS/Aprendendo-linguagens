import { h } from '../dom.js';
import { md, mdInline } from '../markdown.js';
import { BLANK, isBlankCorrect } from '../../core/grading.js';
import { createSqlExercise } from './sql-exercise.js';

const TYPE_LABEL = {
  multiple: 'Múltipla escolha',
  truefalse: 'Verdadeiro ou falso',
  fill: 'Complete a lacuna',
  order: 'Ordene as linhas',
  sql: 'Escreva a consulta',
};
const LETTERS = 'ABCDE';

function multiple(root, q, onSubmit) {
  const buttons = q.optionOrder.map((orig, i) => {
    const btn = h('button', { type: 'button', class: 'opt', 'data-orig': orig },
      h('span', { class: 'opt-letter', text: LETTERS[i] }), mdInline(q.options[orig]));
    btn.addEventListener('click', () => { lock(); onSubmit(orig); });
    return btn;
  });
  const lock = () => buttons.forEach((b) => { b.disabled = true; });
  root.append(h('div', { class: 'opts' }, buttons));
  return {
    reveal({ response, showCorrect }) {
      lock();
      for (const b of buttons) {
        const orig = Number(b.dataset.orig);
        if (orig === response) b.classList.add('chosen');
        if (showCorrect && orig === q.answer) b.classList.add('ok');
        else if (showCorrect && orig === response) b.classList.add('err');
      }
    },
    focus: () => buttons[0]?.focus(),
  };
}

function trueFalse(root, q, onSubmit) {
  const make = (value, label) => {
    const btn = h('button', { type: 'button', class: 'opt', 'data-value': String(value), text: label });
    btn.addEventListener('click', () => { lock(); onSubmit(value); });
    return btn;
  };
  const buttons = [make(true, 'Verdadeiro'), make(false, 'Falso')];
  const lock = () => buttons.forEach((b) => { b.disabled = true; });
  root.append(h('div', { class: 'opts opts-row' }, buttons));
  return {
    reveal({ response, showCorrect }) {
      lock();
      for (const b of buttons) {
        const value = b.dataset.value === 'true';
        if (value === response) b.classList.add('chosen');
        if (showCorrect && value === q.answer) b.classList.add('ok');
        else if (showCorrect && value === response) b.classList.add('err');
      }
    },
    focus: () => buttons[0].focus(),
  };
}

function fill(root, q, onSubmit) {
  const parts = q.code.split(BLANK);
  const inputs = [];
  const code = h('code');
  parts.forEach((part, i) => {
    code.append(document.createTextNode(part));
    if (i < parts.length - 1) {
      const input = h('input', { type: 'text', class: 'blank', 'aria-label': `Lacuna ${i + 1}`, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
      inputs.push(input);
      code.append(input);
    }
  });
  const submit = h('button', { type: 'submit', class: 'btn btn-primary', text: 'Responder' });
  const form = h('form', { class: 'fill-form' }, h('pre', { class: 'fill-code' }, code), submit);
  const lock = () => {
    inputs.forEach((i) => { i.readOnly = true; });
    submit.disabled = true;
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const empty = inputs.find((i) => !i.value.trim());
    if (empty) {
      empty.focus();
      return;
    }
    lock();
    onSubmit(inputs.map((i) => i.value));
  });
  root.append(form);
  return {
    reveal({ response, showCorrect, correct }) {
      lock();
      if (!showCorrect) return;
      inputs.forEach((input, i) => input.classList.add(isBlankCorrect(q, i, response[i]) ? 'ok' : 'err'));
      if (!correct) {
        root.append(h('p', { class: 'fill-answer' }, 'Resposta esperada: ',
          q.blanks.map((accepted, i) => [i ? ' · ' : '', h('code', { text: accepted[0] })])));
      }
    },
    focus: () => inputs[0]?.focus(),
  };
}

function order(root, q, onSubmit, lang) {
  const lines = q.shuffledLines.slice();
  let selected = null;
  let locked = false;
  const list = h('ol', { class: 'order-list' });
  const submit = h('button', { type: 'button', class: 'btn btn-primary', text: 'Confirmar ordem' });

  function move(i, delta) {
    const j = i + delta;
    if (locked || j < 0 || j >= lines.length) return;
    [lines[i], lines[j]] = [lines[j], lines[i]];
    selected = j;
    draw();
    list.children[j]?.querySelector('.order-line')?.focus();
  }

  function draw() {
    list.replaceChildren(...lines.map((line, i) => {
      const item = h('li', { class: `order-item${selected === i ? ' selected' : ''}`, draggable: locked ? null : 'true' },
        h('button', {
          type: 'button', class: 'order-line', disabled: locked || null, 'aria-pressed': String(selected === i),
          'aria-label': `Linha ${i + 1}: ${line}. Use as setas para mover.`,
          onClick: () => { selected = selected === i ? null : i; draw(); list.children[i]?.querySelector('.order-line')?.focus(); },
          onKeydown: (event) => {
            if (event.key === 'ArrowUp') { event.preventDefault(); move(i, -1); }
            if (event.key === 'ArrowDown') { event.preventDefault(); move(i, 1); }
          },
        }, h('code', { text: line })),
        h('span', { class: 'order-moves' },
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Mover para cima', disabled: locked || i === 0 || null, onClick: () => move(i, -1), text: '↑' }),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Mover para baixo', disabled: locked || i === lines.length - 1 || null, onClick: () => move(i, 1), text: '↓' })));
      item.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', String(i));
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', () => item.classList.remove('dragging'));
      item.addEventListener('dragover', (event) => event.preventDefault());
      item.addEventListener('drop', (event) => {
        event.preventDefault();
        const from = Number(event.dataTransfer.getData('text/plain'));
        if (locked || Number.isNaN(from) || from === i) return;
        const [moved] = lines.splice(from, 1);
        lines.splice(i, 0, moved);
        selected = i;
        draw();
      });
      return item;
    }));
  }

  draw();
  submit.addEventListener('click', () => {
    locked = true;
    selected = null;
    submit.disabled = true;
    draw();
    onSubmit(lines.slice());
  });
  root.append(
    h('p', { class: 'muted small', text: 'Toque numa linha e use ↑ ↓ (ou as setas do teclado). No computador, também dá para arrastar.' }),
    list, submit);
  return {
    reveal({ showCorrect, correct }) {
      locked = true;
      submit.disabled = true;
      draw();
      if (showCorrect && !correct) {
        root.append(h('div', { class: 'order-answer' }, h('p', { text: 'Ordem correta:' }),
          md(`\`\`\`${lang ?? ''}\n${q.lines.join('\n')}\n\`\`\``, { lang })));
      }
    },
    focus: () => list.querySelector('.order-line')?.focus(),
  };
}

// O enunciado já vem da pergunta; o exercício cuida das tabelas, da caixa e do Executar.
function sqlQuestion(root, q, onSubmit, lang, sql) {
  const ex = createSqlExercise(q, { service: sql, lang, mode: 'question', showPrompt: false, onSubmit });
  root.append(ex.el);
  return { reveal: ex.reveal, focus: ex.focus, unlock: ex.unlock };
}

export function createQuestionView(question, { lang, onSubmit, sql = null }) {
  const root = h('div', { class: `question q-${question.type}`, 'data-qid': question.id },
    h('div', { class: 'q-type', text: TYPE_LABEL[question.type] }),
    md(question.prompt, { lang }));
  const builders = { multiple, truefalse: trueFalse, fill, order, sql: sqlQuestion };
  const { reveal, focus, unlock = () => {} } = builders[question.type](root, question, onSubmit, lang, sql);
  return { el: root, reveal, focus, unlock };
}

export function describeResponse(question, response) {
  if (response === undefined || response === null) return h('em', { text: 'sem resposta' });
  switch (question.type) {
    case 'multiple': return mdInline(question.options[response]);
    case 'truefalse': return h('span', { text: response ? 'Verdadeiro' : 'Falso' });
    case 'fill': return h('code', { text: response.join(' · ') });
    case 'order': return h('pre', {}, h('code', { text: response.join('\n') }));
    case 'sql': return h('pre', {}, h('code', { text: response }));
    default: return h('span', { text: String(response) });
  }
}

export function describeAnswer(question, lang) {
  switch (question.type) {
    case 'multiple': return mdInline(question.options[question.answer]);
    case 'truefalse': return h('span', { text: question.answer ? 'Verdadeiro' : 'Falso' });
    case 'fill': return h('code', { text: question.blanks.map((b) => b[0]).join(' · ') });
    case 'order': return md(`\`\`\`${lang ?? ''}\n${question.lines.join('\n')}\n\`\`\``, { lang });
    case 'sql': return md(`\`\`\`sql\n${question.answer}\n\`\`\``, { lang });
    default: return h('span', { text: '' });
  }
}
