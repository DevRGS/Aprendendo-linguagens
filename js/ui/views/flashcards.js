import { h, mount, plural } from '../dom.js';
import { md } from '../markdown.js';
import { loadBanks } from '../../data/content.js';
import { isDue, isMastered, RATING } from '../../core/srs.js';
import { reviewCard } from '../../core/actions.js';
import { shuffle } from '../../core/random.js';
import { prepareQuestion, pickExisting } from '../../core/quiz.js';
import { createScopeTree } from '../components/scope-tree.js';
import { runQuiz } from '../components/quiz-runner.js';
import { findModule, statCard } from '../components/common.js';

const MAX_REQUEUE = 2;

export async function renderFlashcards(container, app, route) {
  const bank = await loadBanks(app.languages);
  const tree = createScopeTree(app, { state: app.store.get() });
  let keyHandler = null;
  let filterOpen = false;

  const stopKeys = () => {
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  };
  const unlockedInScope = () => {
    const state = app.store.get();
    const scope = new Set(tree.getSelected());
    return bank.cards.filter((c) => state.cards[c.id] && scope.has(c.module));
  };

  function home() {
    stopKeys();
    const state = app.store.get();
    const { today } = app.ctx();
    const cards = unlockedInScope();
    const due = cards.filter((c) => isDue(state.cards[c.id], today));
    const mastered = cards.filter((c) => isMastered(state.cards[c.id]));
    const mistakes = pickExisting(state.mistakes, bank.questions);
    mount(container,
      h('section', {},
        h('h1', { text: '🧠 Flashcards' }),
        h('p', { class: 'muted', text: 'Tente lembrar a resposta antes de virar a carta. As cartas voltam no intervalo certo para fixar de vez.' })),
      h('div', { class: 'grid stats' },
        statCard('Para revisar hoje', String(due.length)),
        statCard('Aprendendo', String(cards.length - mastered.length)),
        statCard('Dominadas', String(mastered.length)),
        statCard('Liberadas', String(cards.length))),
      h('details', { class: 'panel', open: filterOpen || null, onToggle: (e) => { filterOpen = e.target.open; } },
        h('summary', { text: 'Filtrar por linguagem e módulo' }), tree.el),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn btn-primary', disabled: !due.length || null, onClick: () => session(shuffle(due), true), text: `Revisar pendentes (${due.length})` }),
        h('button', { type: 'button', class: 'btn', disabled: !cards.length || null, onClick: () => session(shuffle(cards), false), text: 'Estudo livre' }),
        h('button', { type: 'button', class: 'btn', disabled: !mistakes.length || null, onClick: startErrors, text: `Meus erros (${mistakes.length})` })),
      cards.length ? null : h('div', { class: 'callout callout-tip' },
        h('strong', { class: 'callout-title', text: 'Nenhuma carta liberada ainda' }),
        h('p', { text: 'As cartas aparecem quando você conclui as aulas. Se já conhece o assunto, use "Ativar todas as cartas deste módulo" na página da linguagem.' })),
      h('div', { class: 'callout callout-note' },
        h('strong', { class: 'callout-title', text: 'Como funciona' }),
        h('p', { text: 'Errei: a carta volta ao começo e reaparece no fim da sessão. Difícil: fica no mesmo nível e volta mais cedo. Fácil: sobe de nível e só volta depois de 1, 3, 7, 14, 30 ou 60 dias. A partir do nível 6, a carta conta como dominada.' })));
  }

  function session(queue, scheduled) {
    const requeued = new Map();
    const tally = { [RATING.AGAIN]: 0, [RATING.HARD]: 0, [RATING.EASY]: 0 };
    let pos = 0;
    let flipped = false;
    let cardEl = null;
    let rateEl = null;
    let flipBtn = null;

    function show() {
      flipped = false;
      const card = queue[pos];
      const found = findModule(app, card.module);
      const hl = found?.language.highlight;
      const st = app.store.get().cards[card.id];
      // A carta não é um botão: assim os leitores de tela leem a pergunta. Quem vira é o botão "Virar carta".
      cardEl = h('div', { class: 'flashcard', onClick: flip },
        h('div', { class: 'flashcard-inner' },
          h('div', { class: 'flashcard-face front', 'aria-hidden': 'false' },
            h('span', { class: 'fc-tag', text: found ? `${found.language.name} › ${found.module.title}` : '' }),
            st ? h('span', { class: 'fc-level', text: `Nível ${st.box + 1}/7` }) : null,
            md(card.front, { lang: hl }),
            h('span', { class: 'fc-hint', text: 'Toque ou aperte Espaço para virar' })),
          h('div', { class: 'flashcard-face back', 'aria-hidden': 'true' },
            h('span', { class: 'fc-tag', text: 'Resposta' }),
            md(card.back, { lang: hl }))));
      const rateBtn = (value, label, hint, tone) => h('button', { type: 'button', class: `rate-btn ${tone}`, onClick: () => answer(value) }, label, h('small', { text: hint }));
      flipBtn = h('button', { type: 'button', class: 'btn btn-primary fc-flip', onClick: flip, text: 'Virar carta' });
      rateEl = h('div', { class: 'rate', hidden: true },
        rateBtn(RATING.AGAIN, '🔴 Errei', 'recomeça', 'bad'),
        rateBtn(RATING.HARD, '🟡 Difícil', 'volta antes', 'mid'),
        rateBtn(RATING.EASY, '🟢 Fácil', 'sobe de nível', 'good'));
      mount(container, h('section', { class: 'fc-session' },
        h('p', { class: 'muted center', text: `Carta ${pos + 1} de ${queue.length}${scheduled ? '' : ' · estudo livre'}` }),
        cardEl,
        flipBtn,
        rateEl,
        h('p', { class: 'muted center small', text: 'Teclas: Espaço vira · 1 Errei · 2 Difícil · 3 Fácil' }),
        h('div', { class: 'center' }, h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onClick: done, text: 'Encerrar sessão' }))));
      requestAnimationFrame(() => flipBtn.focus());
    }

    function flip() {
      if (flipped) return;
      flipped = true;
      cardEl.classList.add('flipped');
      cardEl.querySelector('.front').setAttribute('aria-hidden', 'true');
      cardEl.querySelector('.back').setAttribute('aria-hidden', 'false');
      flipBtn.hidden = true;
      rateEl.hidden = false;
      app.layout.announce('Resposta revelada. Avalie: Errei, Difícil ou Fácil.');
      rateEl.querySelector('button').focus();
    }

    function answer(value) {
      const card = queue[pos];
      tally[value] += 1;
      if (scheduled) app.dispatch(reviewCard, { cardId: card.id, rating: value });
      const times = requeued.get(card.id) ?? 0;
      if (value === RATING.AGAIN && times < MAX_REQUEUE) {
        requeued.set(card.id, times + 1);
        queue.push(card);
      }
      pos += 1;
      if (pos < queue.length) show();
      else done();
    }

    function done() {
      stopKeys();
      const total = tally[RATING.AGAIN] + tally[RATING.HARD] + tally[RATING.EASY];
      mount(container, h('section', { class: 'panel center' },
        h('div', { class: 'big-emoji', text: '🎉' }),
        h('h1', { text: 'Sessão concluída!' }),
        h('p', { text: `Você revisou ${total} ${plural(total, 'carta', 'cartas')}: 🟢 ${tally[RATING.EASY]} fáceis · 🟡 ${tally[RATING.HARD]} difíceis · 🔴 ${tally[RATING.AGAIN]} erradas.` }),
        h('p', { class: 'muted', text: scheduled ? 'As cartas voltam no intervalo certo. Volte amanhã para manter a sequência!' : 'No estudo livre, o agendamento das cartas não muda.' }),
        h('button', { type: 'button', class: 'btn btn-primary', onClick: home, text: 'Voltar ao painel' })));
    }

    stopKeys();
    keyHandler = (event) => {
      if (!container.isConnected) {
        stopKeys();
        return;
      }
      if (!flipped && event.key === ' ') {
        event.preventDefault();
        flip();
        return;
      }
      if (flipped && ['1', '2', '3'].includes(event.key)) {
        event.preventDefault();
        answer(Number(event.key));
      }
    };
    document.addEventListener('keydown', keyHandler);
    show();
  }

  function startErrors() {
    stopKeys();
    const questions = shuffle(pickExisting(app.store.get().mistakes, bank.questions));
    if (!questions.length) {
      home();
      return;
    }
    runQuiz(container, app, {
      questions: questions.map((q) => prepareQuestion(q)),
      mode: 'estudo',
      kind: 'review',
      title: 'Meus erros',
      scopeLabel: 'Meus erros',
      moduleKeys: [...new Set(questions.map((q) => q.module))],
      resultActions: [{ label: 'Voltar aos flashcards', onClick: () => app.go('#/flashcards') }],
    });
  }

  tree.onChange(() => home());
  if (route.query.modo === 'erros') startErrors();
  else home();
  return stopKeys;
}
