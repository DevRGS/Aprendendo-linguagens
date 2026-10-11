export const PRACTICE_PASS = 0.6;
export const EXAM_PASS = 0.7;
export const PRACTICE_QUESTIONS = 5;
export const EXAM_QUESTIONS = 40;

export const moduleKey = (langId, moduleId) => `${langId}.${moduleId}`;
export const lessonKey = (langId, moduleId, lessonId) => `${langId}.${moduleId}.${lessonId}`;
export const isLessonDone = (state, key) => Boolean(state.lessons[key]);

export function moduleLessonsDone(state, language, module) {
  return module.lessons.filter((l) => isLessonDone(state, lessonKey(language.id, module.id, l.id))).length;
}

export function isModuleComplete(state, language, module) {
  const practice = state.modules[moduleKey(language.id, module.id)]?.bestPractice ?? 0;
  return moduleLessonsDone(state, language, module) === module.lessons.length && practice >= PRACTICE_PASS;
}

export const hasStudiedModule = (state, language, module) => moduleLessonsDone(state, language, module) > 0;

export function languageProgress(state, language) {
  let lessonsDone = 0;
  let lessonsTotal = 0;
  let modulesDone = 0;
  for (const m of language.modules) {
    lessonsDone += moduleLessonsDone(state, language, m);
    lessonsTotal += m.lessons.length;
    if (isModuleComplete(state, language, m)) modulesDone += 1;
  }
  return {
    lessonsDone,
    lessonsTotal,
    percent: lessonsTotal ? lessonsDone / lessonsTotal : 0,
    modulesDone,
    modulesTotal: language.modules.length,
  };
}

export function isLanguageComplete(state, language) {
  return language.modules.every((m) => isModuleComplete(state, language, m))
    && (state.exams[language.id]?.best ?? 0) >= EXAM_PASS;
}

export function languageCompletionDay(state, language) {
  if (!isLanguageComplete(state, language)) return null;
  const days = [
    state.exams[language.id].passedAt,
    ...language.modules.map((m) => state.modules[moduleKey(language.id, m.id)]?.completedAt),
  ].filter(Boolean).sort();
  return days.at(-1) ?? null;
}

export function totalMinutes(language) {
  return language.modules.flatMap((m) => m.lessons).reduce((sum, l) => sum + l.minutes, 0);
}
