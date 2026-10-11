import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INTERVALS, MASTERED_BOX, RATING, newCard, rateCard, isDue, isMastered } from '../../js/core/srs.js';

const today = '2026-10-11';
const card = (box, extra = {}) => ({ box, due: today, reviews: 0, lapses: 0, xpDay: null, ...extra });

test('carta nova começa no nível 0 vencendo hoje', () => {
  assert.deepEqual(newCard(today), { box: 0, due: today, reviews: 0, lapses: 0, xpDay: null });
});

test('Errei volta ao nível 0, vence hoje e conta um lapso', () => {
  assert.deepEqual(rateCard(card(4, { reviews: 3 }), RATING.AGAIN, today),
    { box: 0, due: today, reviews: 4, lapses: 1, xpDay: null });
});

test('Difícil mantém o nível e espera metade do intervalo (mínimo 1 dia)', () => {
  assert.deepEqual(rateCard(card(0), RATING.HARD, today), { ...card(0), due: '2026-10-12', reviews: 1 });
  assert.equal(rateCard(card(1), RATING.HARD, today).due, '2026-10-12');
  assert.equal(rateCard(card(3), RATING.HARD, today).due, '2026-10-14');
  assert.equal(rateCard(card(4), RATING.HARD, today).due, '2026-10-18');
  assert.equal(rateCard(card(6), RATING.HARD, today).due, '2026-11-10');
  assert.equal(rateCard(card(3), RATING.HARD, today).box, 3);
});

test('Fácil sobe um nível e usa o intervalo do novo nível', () => {
  const r = rateCard(card(0), RATING.EASY, today);
  assert.equal(r.box, 1);
  assert.equal(r.due, '2026-10-12');
  assert.equal(rateCard(card(2), RATING.EASY, today).due, '2026-10-18');
  assert.equal(rateCard(card(5), RATING.EASY, today).due, '2026-12-10');
});

test('Fácil no nível máximo continua no 6', () => {
  const r = rateCard(card(6), RATING.EASY, today);
  assert.equal(r.box, 6);
  assert.equal(r.due, '2026-12-10');
});

test('isDue, isMastered e a tabela de intervalos', () => {
  assert.equal(isDue(card(0, { due: '2026-10-11' }), today), true);
  assert.equal(isDue(card(0, { due: '2026-10-10' }), today), true);
  assert.equal(isDue(card(0, { due: '2026-10-12' }), today), false);
  assert.equal(isMastered(card(4)), false);
  assert.equal(isMastered(card(MASTERED_BOX)), true);
  assert.deepEqual(INTERVALS, [0, 1, 3, 7, 14, 30, 60]);
});

test('avaliação inválida lança erro', () => {
  assert.throws(() => rateCard(card(0), 9, today), /Avaliação inválida/);
});
