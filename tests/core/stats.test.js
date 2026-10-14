import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../../js/core/state.js';
import {
  languageAccuracy, moduleAccuracy, weakModules, weakestLesson, masteredCount, activityGrid, activityLevel, totals,
} from '../../js/core/stats.js';

function sample() {
  const s = createInitialState();
  s.questions = {
    'java.a.q01': { seen: 4, correct: 3 },
    'java.b.q01': { seen: 4, correct: 0 },
    'java.b.q02': { seen: 2, correct: 1 },
    'java.c.q01': { seen: 6, correct: 6 },
    'sql.x.q01': { seen: 1, correct: 1 },
  };
  return s;
}

test('acerto por linguagem e por módulo', () => {
  const s = sample();
  assert.deepEqual(languageAccuracy(s, 'java'), { seen: 16, correct: 10, rate: 10 / 16 });
  assert.deepEqual(moduleAccuracy(s, 'java.a'), { seen: 4, correct: 3, rate: 0.75 });
  assert.deepEqual(languageAccuracy(s, 'go'), { seen: 0, correct: 0, rate: null });
});

test('pontos fracos: mínimo de respostas, sem módulos perfeitos, do pior ao melhor', () => {
  const s = sample();
  const weak = weakModules(s, ['java.a', 'java.b', 'java.c', 'sql.x'], { minAnswers: 4 });
  assert.deepEqual(weak.map((w) => w.moduleKey), ['java.b', 'java.a']);
  assert.deepEqual(weakModules(s, ['java.a', 'java.b'], { minAnswers: 5 }).map((w) => w.moduleKey), ['java.b']);
  assert.equal(weakModules(s, ['java.b', 'java.a'], { minAnswers: 1, limit: 1 }).length, 1);
});

test('weakestLesson aponta a aula com mais erros', () => {
  const s = sample();
  const questions = [
    { id: 'java.b.q01', lesson: 'laços' },
    { id: 'java.b.q02', lesson: 'arrays' },
    { id: 'java.b.q03', lesson: 'arrays' },
  ];
  assert.equal(weakestLesson(s, questions), 'laços');
  assert.equal(weakestLesson(createInitialState(), questions), null);
});

test('masteredCount com prefixo', () => {
  const s = createInitialState();
  s.cards = { 'java.a.f01': { box: 5 }, 'java.a.f02': { box: 2 }, 'sql.x.f01': { box: 6 } };
  assert.equal(masteredCount(s), 2);
  assert.equal(masteredCount(s, 'java.'), 1);
});

test('activityGrid cobre 12 semanas terminando hoje', () => {
  const grid = activityGrid({ '2026-10-11': 30, '2026-10-01': 0 }, '2026-10-11');
  assert.equal(grid.length, 84);
  assert.deepEqual(grid.at(-1), { day: '2026-10-11', xp: 30 });
  assert.equal(grid[0].day, '2026-07-20');
  assert.equal(grid.find((c) => c.day === '2026-10-01').xp, 0);
  assert.equal(grid.find((c) => c.day === '2026-10-02').xp, null);
});

test('activityLevel em 5 faixas', () => {
  assert.equal(activityLevel(null, 50), 0);
  assert.equal(activityLevel(0, 50), 1);
  assert.equal(activityLevel(10, 50), 2);
  assert.equal(activityLevel(30, 50), 3);
  assert.equal(activityLevel(50, 50), 4);
});

test('totals', () => {
  const s = sample();
  s.counters.answered = 17;
  s.counters.cardReviews = 9;
  s.xp.byDay = { '2026-10-10': 0, '2026-10-11': 20 };
  assert.deepEqual(totals(s), { answered: 17, accuracy: 11 / 17, cardReviews: 9, daysStudied: 2 });
});
