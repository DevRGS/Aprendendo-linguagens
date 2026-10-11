import { h, mount, bar, pct, formatDuration, toneFor } from '../dom.js';
import { md } from '../markdown.js';
import { gradeQuestion } from '../../core/grading.js';
import { prepareQuestion } from '../../core/quiz.js';
import { recordAnswer, finishQuiz } from '../../core/actions.js';
import { createQuestionView, describeResponse, describeAnswer } from './question.js';
import { findModule } from './common.js';

export function runQuiz(container, app, opts) {
  const {
    questions, mode, kind, title, timer = false, language = null, moduleId = null,
    scopeLabel = '', moduleKeys = [], resultActions = [], headline = null,
  } = opts;
  if (!questions.length) {
    mount(container, h('section', { class: 'panel' },
      h('h1', { text: title }),
      h('p', { text: 'Não há perguntas disponíveis para este quiz.' })));
    return;
  }
  const answers = [];
  const startedAt = Date.now();
  let index = 0;
  let finished = false;
  app.setLeaveGuard(() => finished || answers.length === 0 || confirm('Sair do quiz? O progresso deste quiz será perdido.'));

  const elapsed = h('span', { class: 'timer', 'aria-label': 'Tempo decorrido', text: '0 s' });
  const tick = timer ? setInterval(() => {
    if (finished || !container.isConnected) {
      clearInterval(tick);
      return;
    }
    elapsed.textContent = formatDuration((Date.now() - startedAt) / 1000);
  }, 1000) : null;

  const lessonLink = (q) => {
    const found = findModule(app, q.module);
    const lesson = found?.module.lessons.find((l) => l.id === q.lesson);
    return lesson
      ? h('a', { class: 'link', href: `#/${found.language.id}/${found.module.id}/${lesson.id}`, text: `📖 Revise a aula "${lesson.title}"` })
      : null;
  };

  function showQuestion() {
    const q = questions[index];
    const hl = app.getLanguage(q.lang)?.highlight;
    const feedback = h('div', { class: 'feedback', 'aria-live': 'polite' });
    const next = h('button', { type: 'button', class: 'btn btn-primary', hidden: true, text: index === questions.length - 1 ? 'Ver resultado' : 'Próxima →' });
    next.addEventListener('click', () => {
      index += 1;
      if (index < questions.length) showQuestion();
      else finish();
    });
    const view = createQuestionView(q, { lang: hl, onSubmit: (response) => submit(q, response, view, feedback, next, hl) });
    mount(container, h('section', { class: 'quiz' },
      h('header', { class: 'quiz-head' },
        h('div', {},
          h('h1', { class: 'quiz-title', text: title }),
          h('p', { class: 'muted', text: `Pergunta ${index + 1} de ${questions.length}${mode === 'simulado' ? ' · Simulado' : ''}` })),
        timer ? elapsed : null),
      bar(index / questions.length, { label: 'Andamento do quiz' }),
      h('div', { class: 'panel' }, view.el, feedback, h('div', { class: 'quiz-nav' }, next))));
    requestAnimationFrame(() => view.focus());
  }

  function submit(q, response, view, feedback, next, hl) {
    const correct = gradeQuestion(q, response);
    answers[index] = { response, correct };
    app.dispatch(recordAnswer, { question: q, correct });
    const study = mode === 'estudo';
    view.reveal({ response, correct, showCorrect: study });
    if (study) {
      feedback.className = `feedback ${correct ? 'ok' : 'err'}`;
      mount(feedback,
        h('strong', { text: correct ? '✅ Correto!' : '❌ Não foi dessa vez.' }),
        md(q.explanation, { lang: hl }),
        correct ? null : lessonLink(q));
      app.layout.announce(correct ? 'Resposta correta.' : 'Resposta incorreta.');
    } else {
      mount(feedback, h('p', { class: 'muted', text: 'Resposta registrada.' }));
    }
    next.hidden = false;
    next.focus();
  }

  function finish() {
    finished = true;
    if (tick) clearInterval(tick);
    app.setLeaveGuard(null);
    const total = questions.length;
    const correct = answers.filter((a) => a.correct).length;
    const wrongIdx = questions.map((_, i) => i).filter((i) => !answers[i].correct);
    const durationSec = Math.round((Date.now() - startedAt) / 1000);
    app.dispatch(finishQuiz, {
      kind, mode, scopeLabel, moduleKeys, total, correct, durationSec, language, moduleId,
      questionIds: questions.map((q) => q.id),
      wrongIds: wrongIdx.map((i) => questions[i].id),
    });
    renderResult({ total, correct, durationSec, wrongIdx });
  }

  function reviewItem(i) {
    const q = questions[i];
    const found = findModule(app, q.module);
    const hl = found?.language.highlight;
    return h('article', { class: 'panel review-item' },
      h('span', { class: 'badge danger', text: found ? `${found.language.name} › ${found.module.title}` : q.module }),
      md(q.prompt, { lang: hl }),
      q.type === 'fill' ? h('pre', { class: 'fill-code' }, h('code', { text: q.code })) : null,
      h('div', { class: 'review-answer' }, h('span', { class: 'muted', text: 'Sua resposta: ' }), describeResponse(q, answers[i].response)),
      h('div', { class: 'review-answer' }, h('span', { class: 'muted', text: 'Resposta certa: ' }), describeAnswer(q, hl)),
      md(q.explanation, { lang: hl }),
      lessonLink(q));
  }

  function renderResult({ total, correct, durationSec, wrongIdx }) {
    const rate = correct / total;
    const byModule = new Map();
    questions.forEach((q, i) => {
      const entry = byModule.get(q.module) ?? { ok: 0, total: 0 };
      entry.total += 1;
      if (answers[i].correct) entry.ok += 1;
      byModule.set(q.module, entry);
    });
    const retryWrong = () => runQuiz(container, app, {
      ...opts,
      questions: wrongIdx.map((i) => prepareQuestion(questions[i])),
      kind: 'review', mode: 'estudo', title: 'Refazendo as erradas', timer: false, headline: null,
    });
    mount(container, h('section', { class: 'quiz-result' },
      h('div', { class: 'panel center' },
        h('p', { class: 'muted', text: title }),
        h('div', { class: 'big-score', text: `${correct}/${total}` }),
        h('p', { text: `${pct(rate)} de acerto · ${formatDuration(durationSec)}` }),
        headline ? h('p', { class: 'headline', text: headline(rate) }) : null),
      h('h2', { text: 'Desempenho por módulo' }),
      h('div', { class: 'panel' }, [...byModule].map(([key, e]) => {
        const found = findModule(app, key);
        const label = found ? `${found.language.name} › ${found.module.title}` : key;
        return h('div', { class: 'module-bar' },
          h('div', { class: 'module-bar-label' }, h('span', { text: label }), h('span', { class: 'muted', text: `${e.ok}/${e.total} (${pct(e.ok / e.total)})` })),
          bar(e.ok / e.total, { tone: toneFor(e.ok / e.total), label }));
      })),
      wrongIdx.length ? h('h2', { text: 'Revise o que você errou' }) : h('p', { class: 'panel center', text: '🏆 Nenhum erro. Mandou bem!' }),
      wrongIdx.map(reviewItem),
      h('div', { class: 'actions' },
        wrongIdx.length ? h('button', { type: 'button', class: 'btn btn-primary', onClick: retryWrong, text: 'Refazer só as erradas' }) : null,
        wrongIdx.length ? h('a', { class: 'btn', href: '#/flashcards?modo=erros', text: 'Treinar erros nos flashcards' }) : null,
        resultActions.map((a) => (a.href
          ? h('a', { class: 'btn btn-ghost', href: a.href, text: a.label })
          : h('button', { type: 'button', class: 'btn btn-ghost', onClick: a.onClick, text: a.label }))))));
    app.layout.announce(`Quiz concluído: ${correct} de ${total}.`);
  }

  showQuestion();
}
