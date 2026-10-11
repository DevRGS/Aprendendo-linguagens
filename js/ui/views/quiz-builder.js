import { h, mount, plural } from '../dom.js';
import { loadBanks } from '../../data/content.js';
import { filterPool, selectQuestions, prepareQuestion, pickExisting } from '../../core/quiz.js';
import { createScopeTree, describeScope } from '../components/scope-tree.js';
import { runQuiz } from '../components/quiz-runner.js';

const COUNTS = [10, 20, 30, 50];
const DIFFICULTIES = [[1, 'Fácil'], [2, 'Médio'], [3, 'Difícil']];
const TYPES = [['multiple', 'Múltipla escolha'], ['truefalse', 'Verdadeiro ou falso'], ['fill', 'Lacuna'], ['order', 'Ordenar linhas']];

const fieldset = (legend, ...children) => h('fieldset', { class: 'field' }, h('legend', { text: legend }), children);

function checkbox(label, checked, onChange) {
  const input = h('input', { type: 'checkbox' });
  input.checked = checked;
  input.addEventListener('change', () => onChange(input.checked));
  return h('label', { class: 'check' }, input, ` ${label}`);
}

function radioGroup(name, options, current, onChange) {
  return h('div', { class: 'radio-group' }, options.map(([value, label]) => {
    const input = h('input', { type: 'radio', name });
    input.checked = value === current;
    input.addEventListener('change', () => { if (input.checked) onChange(value); });
    return h('label', { class: 'check' }, input, ` ${label}`);
  }));
}

const toggle = (set, value, on) => (on ? set.add(value) : set.delete(value));

function retake(container, app, bank, historyId) {
  const entry = app.store.get().history.find((e) => e.id === historyId);
  const questions = entry ? pickExisting(entry.wrongIds, bank.questions) : [];
  if (!questions.length) {
    mount(container, h('section', { class: 'panel' },
      h('h1', { text: 'Nada para refazer' }),
      h('p', { text: 'Não encontramos as perguntas desse quiz. Elas podem ter sido removidas do conteúdo.' }),
      h('a', { class: 'btn', href: '#/quiz', text: 'Montar um quiz' })));
    return;
  }
  runQuiz(container, app, {
    questions: questions.map((q) => prepareQuestion(q)),
    mode: 'estudo', kind: 'review', title: 'Refazendo as erradas',
    scopeLabel: entry.scopeLabel, moduleKeys: entry.moduleKeys ?? [],
    resultActions: [{ label: 'Ver histórico', href: '#/perfil' }],
  });
}

export async function renderQuizBuilder(container, app, route) {
  const bank = await loadBanks(app.languages);
  if (route.query.refazer) return retake(container, app, bank, route.query.refazer);
  const state = app.store.get();
  const preset = route.query.modulo ? [route.query.modulo] : null;
  const tree = createScopeTree(app, { state, selected: preset });
  const choice = {
    count: 10,
    difficulties: new Set([1, 2, 3]),
    types: new Set(TYPES.map(([t]) => t)),
    mode: 'estudo',
    timer: false,
    focusWeak: route.query.foco === '1',
  };
  const filters = () => ({ moduleKeys: tree.getSelected(), difficulties: [...choice.difficulties], types: [...choice.types] });
  const available = h('p', { class: 'muted', 'aria-live': 'polite' });
  const startBtn = h('button', { type: 'submit', class: 'btn btn-primary', text: 'Começar quiz' });
  const timerBox = checkbox('Mostrar cronômetro', choice.timer, (on) => { choice.timer = on; });
  const timerInput = timerBox.querySelector('input');
  timerInput.disabled = true;

  function updateAvailable() {
    const n = filterPool(bank.questions, filters()).length;
    available.textContent = `${n} ${plural(n, 'pergunta disponível', 'perguntas disponíveis')} com esses filtros.`;
    startBtn.disabled = n === 0;
  }
  tree.onChange(updateAvailable);

  const form = h('form', { class: 'quiz-builder' },
    h('h1', { text: '🎯 Monte seu quiz' }),
    fieldset('Escopo', tree.el),
    fieldset('Quantidade', radioGroup('quantidade', COUNTS.map((n) => [n, `${n} perguntas`]), choice.count, (v) => { choice.count = v; })),
    fieldset('Dificuldade', DIFFICULTIES.map(([v, label]) => checkbox(label, true, (on) => { toggle(choice.difficulties, v, on); updateAvailable(); }))),
    fieldset('Tipos de pergunta', TYPES.map(([v, label]) => checkbox(label, true, (on) => { toggle(choice.types, v, on); updateAvailable(); }))),
    fieldset('Modo',
      radioGroup('modo', [['estudo', 'Estudo: correção a cada pergunta'], ['simulado', 'Simulado: correção só no final']], choice.mode, (v) => {
        choice.mode = v;
        timerInput.disabled = v !== 'simulado';
      }),
      timerBox),
    fieldset('Preferência', checkbox('Focar nos meus pontos fracos', choice.focusWeak, (on) => { choice.focusWeak = on; })),
    available,
    startBtn);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const s = app.store.get();
    const { questions, available: n } = selectQuestions({
      pool: bank.questions,
      count: choice.count,
      filters: filters(),
      questionStats: s.questions,
      lastQuizIds: s.lastQuizIds,
      focusWeak: choice.focusWeak,
      today: app.ctx().today,
    });
    if (!questions.length) return;
    if (n < choice.count) app.layout.toast(`Só havia ${n} ${plural(n, 'pergunta', 'perguntas')} com esses filtros; o quiz vai usar todas.`);
    const keys = tree.getSelected();
    runQuiz(container, app, {
      questions: questions.map((q) => prepareQuestion(q)),
      mode: choice.mode,
      kind: 'quiz',
      timer: choice.mode === 'simulado' && choice.timer,
      title: 'Quiz personalizado',
      scopeLabel: describeScope(app, keys),
      moduleKeys: keys,
      resultActions: [{ label: 'Montar outro quiz', onClick: () => app.go('#/quiz') }],
    });
  });

  mount(container, form);
  updateAvailable();
}
