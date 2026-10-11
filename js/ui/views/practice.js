import { loadModuleBank } from '../../data/content.js';
import { selectQuestions, prepareQuestion } from '../../core/quiz.js';
import { PRACTICE_QUESTIONS } from '../../core/progress.js';
import { runQuiz } from '../components/quiz-runner.js';
import { renderNotFound } from './not-found.js';

export async function renderPractice(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  const module = language?.modules.find((m) => m.id === route.params.module);
  if (!module) return renderNotFound(container);
  const bank = await loadModuleBank(language, module);
  const state = app.store.get();
  const { questions } = selectQuestions({
    pool: bank.questions,
    count: PRACTICE_QUESTIONS,
    filters: { moduleKeys: [module.key] },
    questionStats: state.questions,
    lastQuizIds: state.lastQuizIds,
    today: app.ctx().today,
  });
  runQuiz(container, app, {
    questions: questions.map((q) => prepareQuestion(q)),
    mode: 'estudo',
    kind: 'practice',
    title: `Prática: ${module.title}`,
    language,
    moduleId: module.id,
    scopeLabel: `${language.name} › ${module.title}`,
    moduleKeys: [module.key],
    resultActions: [
      { label: 'Nova prática', onClick: () => app.refresh() },
      { label: `Voltar para ${language.name}`, href: `#/${language.id}` },
    ],
  });
}
