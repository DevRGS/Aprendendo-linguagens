import { h, mount, pct, formatDay } from '../dom.js';
import { APP_NAME } from '../../config.js';
import {
  isLanguageComplete, languageCompletionDay, isModuleComplete, moduleLessonsDone, totalMinutes, PRACTICE_PASS, EXAM_PASS,
} from '../../core/progress.js';
import { renderNotFound } from './not-found.js';

export async function certificateCode(name, langId, day) {
  const data = new TextEncoder().encode(`${name}|${langId}|${day}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 8).toUpperCase();
  return `CL-${langId.toUpperCase()}-${hex}`;
}

function renderLocked(container, state, language) {
  const pending = language.modules.filter((m) => !isModuleComplete(state, language, m));
  const examBest = state.exams[language.id]?.best;
  const examOk = examBest !== undefined && examBest >= EXAM_PASS;
  mount(container, h('section', { class: 'panel' },
    h('h1', { text: `🔒 Certificado de ${language.name}` }),
    h('p', { text: 'Para liberar o certificado, falta concluir:' }),
    h('ul', {},
      pending.map((m) => h('li', { text: `${m.title}: ${moduleLessonsDone(state, language, m)}/${m.lessons.length} aulas e pelo menos ${pct(PRACTICE_PASS)} na prática` })),
      examOk ? null : h('li', { text: `A prova de ${language.name}, com ${pct(EXAM_PASS)} ou mais${examBest !== undefined ? ` (sua melhor nota: ${pct(examBest)})` : ''}` })),
    h('a', { class: 'btn', href: `#/${language.id}`, text: `Voltar para ${language.name}` })));
}

export async function renderCertificate(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  if (!language) return renderNotFound(container);
  const state = app.store.get();
  if (!isLanguageComplete(state, language)) return renderLocked(container, state, language);
  const day = languageCompletionDay(state, language);
  const code = await certificateCode(state.profile.name, language.id, day);
  const hours = Math.max(1, Math.ceil(totalMinutes(language) / 60));
  mount(container,
    h('div', { class: 'cert-actions no-print' },
      h('a', { class: 'btn btn-ghost', href: `#/${language.id}`, text: `← ${language.name}` }),
      h('button', { type: 'button', class: 'btn btn-primary', onClick: () => window.print(), text: '🖨️ Imprimir ou salvar PDF' })),
    h('article', { class: 'certificate', style: { '--accent': language.color } },
      h('p', { class: 'cert-brand', text: APP_NAME }),
      h('h1', { text: 'Certificado de Conclusão' }),
      h('p', { class: 'cert-lead', text: 'Certificamos que' }),
      h('p', { class: 'cert-name', text: state.profile.name }),
      h('p', { class: 'cert-lead' },
        'concluiu os estudos de ', h('strong', { text: `${language.icon} ${language.name}` }),
        `, com carga horária aproximada de ${hours} ${hours === 1 ? 'hora' : 'horas'}, em ${formatDay(day)}.`),
      h('div', { class: 'cert-modules' },
        h('p', { class: 'eyebrow', text: 'Módulos concluídos' }),
        h('ul', {}, language.modules.map((m) => h('li', { text: m.title })))),
      h('p', { text: `Nota na prova final: ${pct(state.exams[language.id].best)}` }),
      h('p', { class: 'cert-code', text: `Código: ${code}` }),
      h('p', { class: 'cert-foot', text: 'Certificado de estudo livre, emitido localmente.' })));
}
