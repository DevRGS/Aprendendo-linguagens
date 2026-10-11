import { renderHome } from './home.js';
import { renderNotFound } from './not-found.js';
import { renderLanguage } from './language.js';
import { renderLesson } from './lesson.js';
import { renderReference } from './reference.js';
import { renderPractice } from './practice.js';
import { renderQuizBuilder } from './quiz-builder.js';
import { renderExam } from './exam.js';

// Cada tarefa seguinte registra suas telas aqui.
export const VIEWS = {
  home: renderHome,
  notFound: renderNotFound,
  language: renderLanguage,
  lesson: renderLesson,
  reference: renderReference,
  practice: renderPractice,
  quiz: renderQuizBuilder,
  exam: renderExam,
};
