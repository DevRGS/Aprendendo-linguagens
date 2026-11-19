import { isModuleComplete, isLanguageComplete, lessonKey } from '../../core/progress.js';

// Depois da última aula, percorre o manifesto uma vez, inclusive o trecho anterior a ela.
export function nextStudyStep(state, language) {
  const path = language.modules.flatMap((module) => module.lessons.map((lesson) => ({
    module, lesson, key: lessonKey(language.id, module.id, lesson.id),
  })));
  const start = Math.max(0, path.findIndex(({ key }) => key === state.lastLesson));
  const pending = [...path.slice(start), ...path.slice(0, start)].find(({ key }) => !state.lessons[key]);
  if (pending) {
    const { module, lesson } = pending;
    return { module, title: lesson.title, detail: module.title, minutes: lesson.minutes,
      href: `#/${language.id}/${module.id}/${lesson.id}`, action: 'Continuar estudando' };
  }
  const module = language.modules.find((m) => !isModuleComplete(state, language, m));
  if (module) return { module, title: 'Praticar o módulo', detail: module.title,
    href: `#/${language.id}/${module.id}/pratica`, action: 'Iniciar prática' };
  if (!isLanguageComplete(state, language)) return { title: 'Prova da trilha', href: `#/${language.id}/prova`, action: 'Abrir prova' };
  return { title: 'Certificado da trilha', href: `#/${language.id}/certificado`, action: 'Ver certificado' };
}
