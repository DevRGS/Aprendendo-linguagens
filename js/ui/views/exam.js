import { h, mount, pct, formatDay } from '../dom.js';
import { loadBanks } from '../../data/content.js';
import { selectQuestions, prepareQuestion } from '../../core/quiz.js';
import { EXAM_QUESTIONS, EXAM_PASS } from '../../core/progress.js';
import { runQuiz } from '../components/quiz-runner.js';
import { usableQuestions, hasSqlQuestions } from '../sql-service.js';
import { renderNotFound } from './not-found.js';

export async function renderExam(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  if (!language) return renderNotFound(container);
  const bank = await loadBanks([language]);
  const best = app.store.get().exams[language.id];
  const count = Math.min(EXAM_QUESTIONS, bank.questions.length);
  const moduleKeys = language.modules.map((m) => m.key);

  const start = async () => {
    let pool = bank.questions;
    if (hasSqlQuestions(pool)) {
      // O primeiro carregamento do banco leva alguns segundos: o botão avisa e não aceita outro clique.
      startBtn.disabled = true;
      startBtn.textContent = 'Preparando o banco de dados…';
      // Sem o banco de SQL, as vagas das perguntas sql vão para outros tipos (a prova mantém o tamanho).
      pool = await usableQuestions(app, pool);
    }
    // Sem histórico nem "último quiz": a prova sorteia todas as perguntas com o mesmo peso.
    const { questions } = selectQuestions({ pool, count: EXAM_QUESTIONS, filters: { moduleKeys }, today: app.ctx().today });
    runQuiz(container, app, {
      questions: questions.map((q) => prepareQuestion(q)),
      mode: 'simulado',
      kind: 'exam',
      timer: true,
      title: `Prova de ${language.name}`,
      language,
      scopeLabel: `${language.name} inteiro`,
      moduleKeys,
      headline: (rate) => (rate >= EXAM_PASS
        ? '🎉 Você passou na prova!'
        : `Ainda não foi dessa vez: são necessários ${pct(EXAM_PASS)}. Revise os pontos fracos e tente de novo.`),
      resultActions: [{ label: `Voltar para ${language.name}`, href: `#/${language.id}` }],
    });
  };

  const startBtn = h('button', { type: 'button', class: 'btn btn-primary', onClick: start, text: 'Começar a prova' });
  mount(container, h('section', { class: 'panel exam-intro', style: { '--accent': language.color } },
    h('h1', { text: `🎯 Prova de ${language.name}` }),
    h('ul', {},
      h('li', { text: `${count} perguntas de todos os módulos` }),
      h('li', { text: 'Correção só no final (modo simulado)' }),
      h('li', { text: `Aprovação com ${pct(EXAM_PASS)} ou mais` }),
      h('li', { text: 'O tempo aparece na tela, mas não há limite' })),
    best ? h('p', { text: `Sua melhor nota: ${pct(best.best)}${best.passedAt ? ` · prova aprovada em ${formatDay(best.passedAt)}` : ''}` }) : null,
    startBtn));
}
