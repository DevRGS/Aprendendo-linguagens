import { h, mount, formatDay } from '../dom.js';
import { md } from '../markdown.js';
import { loadLesson, loadModuleBank } from '../../data/content.js';
import { lessonKey } from '../../core/progress.js';
import { openLesson, completeLesson } from '../../core/actions.js';
import { renderNotFound } from './not-found.js';

export async function renderLesson(container, app, route) {
  const { lang, module: moduleId, lesson: lessonId } = route.params;
  const language = app.getLanguage(lang);
  const module = language?.modules.find((m) => m.id === moduleId);
  const index = module ? module.lessons.findIndex((l) => l.id === lessonId) : -1;
  if (index < 0) return renderNotFound(container);
  const lesson = module.lessons[index];
  const key = lessonKey(lang, moduleId, lessonId);
  const text = await loadLesson(language, module, lesson);
  app.dispatch(openLesson, { key });
  const prev = module.lessons[index - 1];
  const next = module.lessons[index + 1];

  function footer() {
    const doneAt = app.store.get().lessons[key]?.doneAt;
    return h('footer', { class: 'lesson-foot' },
      prev ? h('a', { class: 'btn btn-ghost', href: `#/${lang}/${moduleId}/${prev.id}`, text: `← ${prev.title}` }) : h('span'),
      doneAt
        ? h('span', { class: 'badge success', text: `✓ Concluída em ${formatDay(doneAt)}` })
        : h('button', { type: 'button', class: 'btn btn-primary', onClick: complete, text: 'Concluir aula' }),
      next
        ? h('a', { class: 'btn', href: `#/${lang}/${moduleId}/${next.id}`, text: `${next.title} →` })
        : h('a', { class: 'btn', href: `#/${lang}/${moduleId}/pratica`, text: 'Praticar o módulo →' }));
  }

  let foot = footer();
  async function complete() {
    const bank = await loadModuleBank(language, module);
    const events = app.dispatch(completeLesson, { language, moduleId, lessonId, cards: bank.cards });
    app.layout.toast(`Aula concluída! +${events.xpGained} XP`, { tone: 'success' });
    const fresh = footer();
    foot.replaceWith(fresh);
    foot = fresh;
  }

  mount(container, h('article', { class: 'lesson', style: { '--accent': language.color } },
    h('nav', { class: 'breadcrumb', 'aria-label': 'Você está em' },
      h('a', { href: `#/${lang}`, text: `${language.icon} ${language.name}` }), ` › ${module.title}`),
    h('p', { class: 'eyebrow', text: `Aula ${index + 1} de ${module.lessons.length} · ${lesson.minutes} min` }),
    md(text, { lang: language.highlight }),
    foot));
}
