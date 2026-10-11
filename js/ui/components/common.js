import { h } from '../dom.js';

export function errorPanel(message, onRetry) {
  return h('section', { class: 'panel panel-error', role: 'alert' },
    h('p', { text: message }),
    onRetry ? h('button', { type: 'button', class: 'btn', onClick: onRetry, text: 'Tentar de novo' }) : null);
}

export function statCard(label, value, extra = null) {
  return h('div', { class: 'panel stat' },
    h('span', { class: 'stat-label', text: label }),
    h('strong', { class: 'stat-value', text: value }),
    typeof extra === 'string' ? h('span', { class: 'muted small', text: extra }) : extra);
}

export function findModule(app, moduleKey) {
  const [langId, moduleId] = String(moduleKey).split('.');
  const language = app.getLanguage(langId);
  const module = language?.modules.find((m) => m.id === moduleId);
  return module ? { language, module } : null;
}

export function findLesson(app, key) {
  const [langId, moduleId, lessonId] = String(key).split('.');
  const found = findModule(app, `${langId}.${moduleId}`);
  const lesson = found?.module.lessons.find((l) => l.id === lessonId);
  return lesson ? { ...found, lesson } : null;
}
