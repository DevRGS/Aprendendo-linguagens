import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mulberry32 } from '../../js/core/random.js';
import { filterPool, distribute, questionWeight, selectQuestions, prepareQuestion, pickExisting } from '../../js/core/quiz.js';

const today = '2026-10-11';

function makePool(spec) {
  const pool = [];
  for (const [module, n] of Object.entries(spec)) {
    for (let i = 1; i <= n; i++) {
      pool.push({ id: `${module}.q${String(i).padStart(2, '0')}`, lang: module.split('.')[0], module, type: 'multiple', difficulty: 1 });
    }
  }
  return pool;
}
const countBy = (qs, key) => qs.reduce((acc, q) => ({ ...acc, [q[key]]: (acc[q[key]] || 0) + 1 }), {});
const toObj = (map) => Object.fromEntries(map);

test('distribute divide por igual e respeita capacidades', () => {
  const rng = mulberry32(1);
  assert.deepEqual(toObj(distribute(10, [{ key: 'a', cap: 100 }, { key: 'b', cap: 100 }], rng)), { a: 5, b: 5 });
  assert.deepEqual(toObj(distribute(10, [{ key: 'a', cap: 2 }, { key: 'b', cap: 100 }], rng)), { a: 2, b: 8 });
  assert.deepEqual(toObj(distribute(50, [{ key: 'a', cap: 3 }, { key: 'b', cap: 4 }], rng)), { a: 3, b: 4 });
  const odd = toObj(distribute(5, [{ key: 'a', cap: 100 }, { key: 'b', cap: 100 }], rng));
  assert.equal(odd.a + odd.b, 5);
  assert.equal(Math.abs(odd.a - odd.b), 1);
  assert.deepEqual(toObj(distribute(5, [], rng)), {});
});

test('selectQuestions divide entre linguagens e depois entre módulos', () => {
  const pool = makePool({ 'java.a': 10, 'java.b': 10, 'sql.x': 10 });
  const { questions } = selectQuestions({ pool, count: 20, today, rng: mulberry32(7) });
  assert.deepEqual(countBy(questions, 'module'), { 'java.a': 5, 'java.b': 5, 'sql.x': 10 });
});

test('módulo com poucas perguntas: a sobra vai para outro módulo da mesma linguagem', () => {
  const pool = makePool({ 'java.a': 2, 'java.b': 10, 'sql.x': 10 });
  const { questions } = selectQuestions({ pool, count: 20, today, rng: mulberry32(7) });
  assert.deepEqual(countBy(questions, 'module'), { 'java.a': 2, 'java.b': 8, 'sql.x': 10 });
});

test('linguagem com poucas perguntas: a sobra vai para outra linguagem', () => {
  const pool = makePool({ 'java.a': 3, 'sql.x': 30 });
  const { questions } = selectQuestions({ pool, count: 20, today, rng: mulberry32(7) });
  assert.deepEqual(countBy(questions, 'module'), { 'java.a': 3, 'sql.x': 17 });
});

test('banco menor que o pedido usa tudo e informa quantas havia', () => {
  const pool = makePool({ 'java.a': 4, 'java.b': 3 });
  const { questions, available } = selectQuestions({ pool, count: 50, today, rng: mulberry32(7) });
  assert.equal(questions.length, 7);
  assert.equal(available, 7);
});

test('não repete perguntas', () => {
  const pool = makePool({ 'java.a': 30 });
  const { questions } = selectQuestions({ pool, count: 30, today, rng: mulberry32(3) });
  assert.equal(new Set(questions.map((q) => q.id)).size, 30);
});

test('filtros de escopo, dificuldade e tipo (array vazio não deixa passar nada)', () => {
  const pool = [
    { id: 'java.a.q01', lang: 'java', module: 'java.a', type: 'multiple', difficulty: 1 },
    { id: 'java.a.q02', lang: 'java', module: 'java.a', type: 'fill', difficulty: 2 },
    { id: 'java.b.q01', lang: 'java', module: 'java.b', type: 'multiple', difficulty: 3 },
    { id: 'sql.x.q01', lang: 'sql', module: 'sql.x', type: 'order', difficulty: 1 },
  ];
  assert.deepEqual(filterPool(pool, { moduleKeys: ['java.a'] }).map((q) => q.id), ['java.a.q01', 'java.a.q02']);
  assert.deepEqual(filterPool(pool, { difficulties: [1] }).map((q) => q.id), ['java.a.q01', 'sql.x.q01']);
  assert.deepEqual(filterPool(pool, { types: ['fill', 'order'] }).map((q) => q.id), ['java.a.q02', 'sql.x.q01']);
  assert.equal(filterPool(pool, { moduleKeys: [] }).length, 0);
  assert.equal(filterPool(pool, { types: [] }).length, 0);
  assert.equal(filterPool(pool, {}).length, 4);
});

test('questionWeight segue a tabela de pesos', () => {
  const q = { id: 'x' };
  const ctx = { today, lastQuizIds: new Set() };
  assert.equal(questionWeight(q, undefined, ctx), 3);
  assert.equal(questionWeight(q, { seen: 2, lastOk: false, lastDay: '2026-10-01' }, ctx), 3);
  assert.equal(questionWeight(q, { seen: 2, lastOk: false, lastDay: '2026-10-01' }, { ...ctx, focusWeak: true }), 5);
  assert.equal(questionWeight(q, { seen: 1, lastOk: true, lastDay: '2026-10-01' }, ctx), 1);
  assert.equal(questionWeight(q, { seen: 1, lastOk: true, lastDay: '2026-10-10' }, ctx), 0.5);
  assert.equal(questionWeight(q, undefined, { ...ctx, lastQuizIds: new Set(['x']) }), 3 * 0.2);
});

test('perguntas nunca vistas saem muito mais do que as acertadas ontem', () => {
  const pool = makePool({ 'java.a': 2 });
  const questionStats = { 'java.a.q02': { seen: 1, correct: 1, lastOk: true, lastDay: '2026-10-10' } };
  const rng = mulberry32(42);
  let unseen = 0;
  for (let i = 0; i < 1000; i++) {
    const { questions } = selectQuestions({ pool, count: 1, questionStats, today, rng });
    if (questions[0].id === 'java.a.q01') unseen += 1;
  }
  assert.ok(unseen > 800, `a nunca vista saiu ${unseen} vezes em 1000`);
});

test('prepareQuestion embaralha opções e linhas sem alterar o original', () => {
  const rng = mulberry32(5);
  const mq = { id: 'm', type: 'multiple', options: ['a', 'b', 'c', 'd'], answer: 2 };
  const pm = prepareQuestion(mq, rng);
  assert.deepEqual([...pm.optionOrder].sort(), [0, 1, 2, 3]);
  assert.equal(mq.optionOrder, undefined);
  const oq = { id: 'o', type: 'order', lines: ['a {', '    b;', '}'] };
  const po = prepareQuestion(oq, rng);
  assert.deepEqual([...po.shuffledLines].sort(), ['a {', 'b;', '}'].sort());
  assert.notDeepEqual(po.shuffledLines, ['a {', 'b;', '}']);
});

test('prepareQuestion com linhas todas iguais não trava', () => {
  const po = prepareQuestion({ id: 'o', type: 'order', lines: ['}', '}', '}'] }, mulberry32(1));
  assert.deepEqual(po.shuffledLines, ['}', '}', '}']);
});

test('prepareQuestion devolve cópia para os outros tipos', () => {
  const tf = { id: 't', type: 'truefalse', answer: true };
  const out = prepareQuestion(tf);
  assert.deepEqual(out, tf);
  assert.notEqual(out, tf);
});

test('pickExisting ignora ids que não existem mais no conteúdo', () => {
  const qs = [{ id: 'java.a.q01' }, { id: 'java.a.q02' }];
  assert.deepEqual(pickExisting(['java.a.q02', 'java.a.q99', 'java.a.q01'], qs).map((q) => q.id), ['java.a.q02', 'java.a.q01']);
  assert.deepEqual(pickExisting([], qs), []);
});
