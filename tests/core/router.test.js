import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, RESERVED_ROUTES } from '../../js/router.js';

const r = (name, params = {}, query = {}) => ({ name, params, query });

test('rotas fixas', () => {
  assert.deepEqual(parseRoute(''), r('home'));
  assert.deepEqual(parseRoute('#/'), r('home'));
  for (const name of ['quiz', 'flashcards', 'perfil', 'config']) assert.deepEqual(parseRoute(`#/${name}`), r(name));
  assert.ok(RESERVED_ROUTES.has('quiz'));
});

test('rotas de linguagem, módulo e aula', () => {
  assert.deepEqual(parseRoute('#/java'), r('language', { lang: 'java' }));
  assert.deepEqual(parseRoute('#/java/referencia'), r('reference', { lang: 'java' }));
  assert.deepEqual(parseRoute('#/java/prova'), r('exam', { lang: 'java' }));
  assert.deepEqual(parseRoute('#/java/certificado'), r('certificate', { lang: 'java' }));
  assert.deepEqual(parseRoute('#/java/fundamentos/pratica'), r('practice', { lang: 'java', module: 'fundamentos' }));
  assert.deepEqual(parseRoute('#/java/fundamentos/arrays'), r('lesson', { lang: 'java', module: 'fundamentos', lesson: 'arrays' }));
});

test('query string', () => {
  assert.deepEqual(parseRoute('#/quiz?modulo=java.fundamentos&foco=1'), r('quiz', {}, { modulo: 'java.fundamentos', foco: '1' }));
  assert.deepEqual(parseRoute('#/flashcards?modo=erros'), r('flashcards', {}, { modo: 'erros' }));
});

test('endereços inválidos viram notFound', () => {
  assert.equal(parseRoute('#/java/xyz').name, 'notFound');
  assert.equal(parseRoute('#/quiz/extra').name, 'notFound');
  assert.equal(parseRoute('#/a/b/c/d').name, 'notFound');
  assert.equal(parseRoute('#/%E0%A4%A').name, 'notFound');
});
