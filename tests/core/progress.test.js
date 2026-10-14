import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../../js/core/state.js';
import {
  moduleKey, lessonKey, isLessonDone, moduleLessonsDone, isModuleComplete, hasStudiedModule, languageProgress,
  isLanguageComplete, languageCompletionDay, totalMinutes,
} from '../../js/core/progress.js';

const language = {
  id: 'java',
  modules: [
    { id: 'm1', lessons: [{ id: 'a', minutes: 10 }, { id: 'b', minutes: 20 }] },
    { id: 'm2', lessons: [{ id: 'c', minutes: 45 }] },
  ],
};
const [m1, m2] = language.modules;

function state({ lessons = [], practice = {}, exam = null, completed = {} } = {}) {
  const s = createInitialState();
  for (const key of lessons) s.lessons[key] = { doneAt: '2026-10-01' };
  for (const [mod, best] of Object.entries(practice)) s.modules[mod] = { bestPractice: best, completedAt: completed[mod] };
  if (exam) s.exams.java = exam;
  return s;
}

test('chaves', () => {
  assert.equal(moduleKey('java', 'm1'), 'java.m1');
  assert.equal(lessonKey('java', 'm1', 'a'), 'java.m1.a');
});

test('isLessonDone e moduleLessonsDone', () => {
  const s = state({ lessons: ['java.m1.a'] });
  assert.equal(isLessonDone(s, 'java.m1.a'), true);
  assert.equal(isLessonDone(s, 'java.m1.b'), false);
  assert.equal(moduleLessonsDone(s, language, m1), 1);
  assert.equal(moduleLessonsDone(s, language, m2), 0);
});

test('módulo exige todas as aulas e 60% na prática', () => {
  assert.equal(isModuleComplete(state({ lessons: ['java.m1.a'], practice: { 'java.m1': 1 } }), language, m1), false);
  assert.equal(isModuleComplete(state({ lessons: ['java.m1.a', 'java.m1.b'], practice: { 'java.m1': 0.59 } }), language, m1), false);
  assert.equal(isModuleComplete(state({ lessons: ['java.m1.a', 'java.m1.b'], practice: { 'java.m1': 0.6 } }), language, m1), true);
});

test('hasStudiedModule e languageProgress', () => {
  const s = state({ lessons: ['java.m1.a', 'java.m1.b'], practice: { 'java.m1': 0.8 } });
  assert.equal(hasStudiedModule(s, language, m1), true);
  assert.equal(hasStudiedModule(s, language, m2), false);
  const p = languageProgress(s, language);
  assert.deepEqual({ ...p, percent: Number(p.percent.toFixed(3)) },
    { lessonsDone: 2, lessonsTotal: 3, percent: 0.667, modulesDone: 1, modulesTotal: 2 });
});

test('linguagem concluída exige módulos e prova com 70%', () => {
  const all = ['java.m1.a', 'java.m1.b', 'java.m2.c'];
  const practice = { 'java.m1': 0.8, 'java.m2': 0.6 };
  const completed = { 'java.m1': '2026-10-02', 'java.m2': '2026-10-05' };
  assert.equal(isLanguageComplete(state({ lessons: all, practice }), language), false);
  assert.equal(isLanguageComplete(state({ lessons: all, practice, exam: { best: 0.69 } }), language), false);
  const done = state({ lessons: all, practice, completed, exam: { best: 0.7, passedAt: '2026-10-03' } });
  assert.equal(isLanguageComplete(done, language), true);
  assert.equal(languageCompletionDay(done, language), '2026-10-05');
  assert.equal(languageCompletionDay(state({ lessons: all, practice }), language), null);
});

test('totalMinutes soma as aulas', () => {
  assert.equal(totalMinutes(language), 75);
});
