import { renderHome } from './home.js';
import { renderNotFound } from './not-found.js';

// Cada tarefa seguinte registra suas telas aqui.
export const VIEWS = {
  home: renderHome,
  notFound: renderNotFound,
};
