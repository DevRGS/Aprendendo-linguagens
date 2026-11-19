import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../../js/core/state.js';
import { addDays } from '../../js/core/dates.js';
import { resumoIntensiva, startGoalDay, markGoal } from '../../js/core/intensiva.js';
import { finishQuiz, recordAnswer, setProfile } from '../../js/core/actions.js';
import { makeEnvelope, parseEnvelope } from '../../js/core/backup-format.js';

const ctx = today => ({ today, now: new Date(today + 'T12:00:00') });
const edit = (state, dailyGoal, settings) => setProfile(state, { name: 'Lia', avatar: '🚀', dailyGoal, settings }, ctx('2026-12-31')).state;
const answer = (state, today, id, correct = true) => recordAnswer(state, { question: { id, difficulty: 2 }, correct }, ctx(today));
const restore = state => parseEnvelope(JSON.stringify(makeEnvelope(state))).state;

test('dia com zero XP congela meta; edição, backup e repetição conservam a primeira marca', () => {
  let state = edit(createInitialState(), 20, { byte: 'still' });
  const day = '2026-12-31';
  state = answer(state, day, 'a', false).state;
  state = restore(edit(state, 100));
  assert.equal(state.profile.settings.byte, 'still');
  assert.equal(resumoIntensiva(state, day).days.at(-1).status, 'studied');
  assert.equal(resumoIntensiva(state, day).goal, 20);
  state = answer(state, day, 'a').state;
  const result = answer(state, day, 'b');
  assert.equal(result.events.goalReached, true);
  assert.equal(answer(restore(result.state), day, 'b').events.goalReached, false);
  assert.equal(result.state.counters.goalDays, 1);
  assert.equal(resumoIntensiva(result.state, '2027-01-01').goal, 100);
});

test('importar perfil anterior à Intensiva distingue atividade histórica e protege contador legado', () => {
  const legacy = edit(createInitialState(), 20);
  delete legacy.intensiva;
  legacy.schema = 1;
  legacy.xp = { total: 50, byDay: { '2026-04-30': 0, '2026-05-01': 50 } };
  legacy.counters.goalDays = 12;
  const migrated = restore(legacy);
  assert.deepEqual(resumoIntensiva(migrated, '2026-05-01').days.slice(-2).map(d => d.status), ['unknown','unknown']);
  const { state, events } = answer(migrated, '2026-05-01', 'a', false);
  assert.equal(events.goalReached, true);
  assert.equal(state.counters.goalDays, 12);
  const next = answer(answer(restore(state), '2026-05-02', 'a').state, '2026-05-02', 'b').state;
  assert.equal(next.counters.goalDays, 13);
  assert.equal(next.intensiva.current, 2);
});

test('401 metas preservam o recorde após poda; retorno após dia perdido reinicia a contagem', () => {
  let state = edit(createInitialState(), 20);
  const start = '2025-12-28';
  for (let i = 0; i < 401; i++) {
    const day = addDays(start,i);
    state = answer(state, day, 'a').state;
    const result = answer(state, day, 'b');
    assert.equal(result.events.achievements.includes('intensiva-7'), i === 6);
    state = result.state;
  }
  state = restore(state);
  assert.equal(Object.keys(state.intensiva.days).length, 400);
  assert.equal(resumoIntensiva(state, addDays(start,401)).current, 401);
  const later = addDays(start,402);
  assert.equal(resumoIntensiva(state, later).current, 0);
  state = answer(answer(state, later, 'a').state, later, 'b').state;
  assert.equal(state.intensiva.current, 1);
  assert.equal(state.intensiva.best, 401);
});

test('o registro do dia conserva o alvo e concede uma única marca sobre o total creditado', () => {
  const day = '2026-05-05';
  const state = edit(createInitialState(), 50);
  startGoalDay(state, day);
  assert.equal(markGoal(state, day), false);
  state.profile.dailyGoal = 100;
  startGoalDay(state, day);
  assert.equal(state.intensiva.days[day].goal, 50);
  state.xp.byDay[day] = 60;
  assert.equal(markGoal(state, day), true);
  assert.equal(markGoal(state, day), false);
  assert.equal(state.counters.goalDays, 1);
});

test('prova encerrada após a meia-noite contabiliza bônus e meta no novo dia local', () => {
  const state = answer(edit(createInitialState(), 100), '2026-12-31', 'a').state;
  const result = finishQuiz(state, {
    kind: 'exam', mode: 'simulado', scopeLabel: 'Git', moduleKeys: [], questionIds: ['a'],
    wrongIds: [], total: 1, correct: 1, durationSec: 20, language: { id: 'git', modules: [] },
  }, ctx('2027-01-01'));
  assert.equal(result.events.goalReached, true);
  assert.equal(result.state.xp.byDay['2027-01-01'], 200);
  assert.equal(result.state.streak.current, 2);
  assert.equal(result.state.intensiva.current, 1);
});
