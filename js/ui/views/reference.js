import { h, mount } from '../dom.js';
import { md } from '../markdown.js';
import { loadReference } from '../../data/content.js';
import { renderNotFound } from './not-found.js';

export async function renderReference(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  if (!language) return renderNotFound(container);
  const text = await loadReference(language);
  mount(container, h('article', { class: 'lesson', style: { '--accent': language.color } },
    h('nav', { class: 'breadcrumb', 'aria-label': 'Você está em' },
      h('a', { href: `#/${language.id}`, text: `${language.icon} ${language.name}` }), ' › Referência rápida'),
    md(text, { lang: language.highlight })));
}
