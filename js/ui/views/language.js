import { h, mount, bar, pct } from '../dom.js';
import {
  languageProgress, isModuleComplete, isLanguageComplete, moduleLessonsDone, lessonKey, moduleKey, PRACTICE_PASS,
} from '../../core/progress.js';
import { activateModuleCards } from '../../core/actions.js';
import { loadModuleBank } from '../../data/content.js';
import { renderNotFound } from './not-found.js';

function moduleCard(app, state, language, module, index) {
  const entry = state.modules[moduleKey(language.id, module.id)] ?? {};
  const done = isModuleComplete(state, language, module);
  const lessonsDone = moduleLessonsDone(state, language, module);
  const activate = async () => {
    const bank = await loadModuleBank(language, module);
    app.dispatch(activateModuleCards, { language, moduleId: module.id, cards: bank.cards });
    app.layout.toast(`Cartas de "${module.title}" ativadas.`, { tone: 'success' });
    app.refresh();
  };
  return h('section', { class: `panel module-card${done ? ' done' : ''}` },
    h('header', { class: 'module-head' },
      h('div', {},
        h('p', { class: 'eyebrow', text: `Módulo ${index + 1}` }),
        h('h2', { text: module.title }),
        h('p', { class: 'muted', text: module.description })),
      done ? h('span', { class: 'badge success', text: '✓ Concluído' }) : h('span', { class: 'badge', text: `${lessonsDone}/${module.lessons.length} aulas` })),
    h('ol', { class: 'lesson-list' }, module.lessons.map((l) => {
      const ok = Boolean(state.lessons[lessonKey(language.id, module.id, l.id)]);
      return h('li', { class: ok ? 'done' : null },
        h('a', { href: `#/${language.id}/${module.id}/${l.id}` },
          h('span', { class: 'lesson-check', 'aria-hidden': 'true', text: ok ? '✓' : '○' }),
          h('span', { text: l.title }),
          ok ? h('span', { class: 'sr-only', text: '(concluída)' }) : null,
          h('span', { class: 'muted small', text: `${l.minutes} min` })));
    })),
    h('div', { class: 'actions' },
      h('a', { class: 'btn btn-primary', href: `#/${language.id}/${module.id}/pratica`, text: 'Praticar o módulo' }),
      entry.bestPractice !== undefined
        ? h('span', { class: `badge ${entry.bestPractice >= PRACTICE_PASS ? 'success' : 'warning'}`, text: `Melhor prática: ${pct(entry.bestPractice)}` })
        : h('span', { class: 'muted small', text: `Para concluir: todas as aulas e ${pct(PRACTICE_PASS)} na prática` }),
      entry.cardsActivated
        ? h('span', { class: 'muted small', text: '🧠 Cartas do módulo ativadas' })
        : h('button', { type: 'button', class: 'btn btn-ghost', onClick: activate, text: '🧠 Ativar todas as cartas deste módulo' })));
}

export async function renderLanguage(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  if (!language) return renderNotFound(container);
  const state = app.store.get();
  const progress = languageProgress(state, language);
  const exam = state.exams[language.id];
  const complete = isLanguageComplete(state, language);
  mount(container, h('div', { class: 'lang-page', style: { '--accent': language.color } },
    h('section', { class: 'lang-hero' },
      h('div', { class: 'lang-icon', text: language.icon }),
      h('div', {},
        h('h1', { text: language.name }),
        h('p', { class: 'muted', text: `${progress.lessonsDone}/${progress.lessonsTotal} aulas · ${progress.modulesDone}/${progress.modulesTotal} módulos concluídos` }),
        bar(progress.percent, { label: `Progresso em ${language.name}` }))),
    h('div', { class: 'lang-links' },
      h('a', { class: 'btn', href: `#/${language.id}/referencia`, text: '📋 Referência rápida' }),
      h('a', { class: 'btn', href: `#/${language.id}/prova`, text: exam?.best !== undefined ? `🎯 Prova (melhor nota: ${pct(exam.best)})` : '🎯 Prova' }),
      h('a', { class: `btn${complete ? ' btn-primary' : ' btn-ghost'}`, href: `#/${language.id}/certificado`, text: complete ? '🎓 Ver certificado' : '🔒 Certificado' })),
    language.modules.map((m, i) => moduleCard(app, state, language, m, i))));
}
