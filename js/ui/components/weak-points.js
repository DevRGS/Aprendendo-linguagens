import { h, pct } from '../dom.js';
import { weakModules, weakestLesson } from '../../core/stats.js';
import { loadBanks } from '../../data/content.js';
import { findModule } from './common.js';

export async function weakPointsSection(app, state) {
  const keys = app.languages.flatMap((l) => l.modules.map((m) => m.key));
  const weak = weakModules(state, keys);
  const title = h('h2', { text: 'Pontos fracos' });
  if (!weak.length) {
    return h('section', { class: 'panel' }, title,
      h('p', { class: 'muted', text: 'Responda pelo menos 5 perguntas de um módulo para ver aqui onde vale a pena revisar.' }));
  }
  const bank = await loadBanks(app.languages, weak.map((w) => w.moduleKey));
  return h('section', { class: 'panel' }, title,
    h('ul', { class: 'weak-list' }, weak.map((w) => {
      const found = findModule(app, w.moduleKey);
      if (!found) return null;
      const { language, module } = found;
      const lessonId = weakestLesson(state, bank.questions.filter((q) => q.module === w.moduleKey));
      return h('li', {},
        h('span', { text: `${language.icon} ${language.name} › ${module.title}` }),
        h('span', { class: 'badge danger', text: `${pct(w.rate)} de acerto` }),
        lessonId ? h('a', { class: 'btn btn-sm', href: `#/${language.id}/${module.id}/${lessonId}`, text: 'Revisar aula' }) : null,
        h('a', { class: 'btn btn-sm btn-ghost', href: `#/quiz?modulo=${encodeURIComponent(w.moduleKey)}&foco=1`, text: 'Quiz focado' }));
    })));
}
