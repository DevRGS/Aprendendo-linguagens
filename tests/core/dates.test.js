import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toDayKey, addDays, diffDays, isDayKey } from '../../js/core/dates.js';

test('toDayKey usa o calendário local', () => {
  assert.equal(toDayKey(new Date(2026, 9, 11, 23, 59)), '2026-10-11');
  assert.equal(toDayKey(new Date(2026, 0, 5, 0, 0)), '2026-01-05');
});

test('no Brasil, 21h30 ainda é o mesmo dia (não vira por causa do UTC)', () => {
  const original = process.env.TZ;
  process.env.TZ = 'America/Sao_Paulo';
  try {
    assert.equal(toDayKey(new Date('2026-10-12T00:30:00Z')), '2026-10-11');
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
});

test('addDays atravessa mês, ano e fevereiro bissexto', () => {
  assert.equal(addDays('2026-10-31', 1), '2026-11-01');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addDays('2024-02-28', 1), '2024-02-29');
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(addDays('2026-10-11', 0), '2026-10-11');
});

test('diffDays conta dias inteiros nos dois sentidos', () => {
  assert.equal(diffDays('2026-10-11', '2026-10-14'), 3);
  assert.equal(diffDays('2026-10-14', '2026-10-11'), -3);
  assert.equal(diffDays('2026-12-31', '2027-01-01'), 1);
});

test('isDayKey reconhece o formato', () => {
  assert.equal(isDayKey('2026-10-11'), true);
  assert.equal(isDayKey('11/10/2026'), false);
  assert.equal(isDayKey(null), false);
});
