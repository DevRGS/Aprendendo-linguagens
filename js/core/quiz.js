import { diffDays } from './dates.js';
import { shuffle, weightedSample } from './random.js';
import { orderLine } from './grading.js';

export const WEIGHTS = Object.freeze({ unseen: 3, wrong: 3, wrongFocus: 5, right: 1, rightRecent: 0.5, inLastQuiz: 0.2 });
export const RECENT_DAYS = 3;

export function filterPool(pool, { moduleKeys, difficulties, types } = {}) {
  const mods = moduleKeys ? new Set(moduleKeys) : null;
  const diffs = difficulties ? new Set(difficulties) : null;
  const tps = types ? new Set(types) : null;
  return pool.filter((q) => (!mods || mods.has(q.module))
    && (!diffs || diffs.has(q.difficulty))
    && (!tps || tps.has(q.type)));
}

// Divide n entre baldes por igual; quem não comporta a cota repassa a sobra para os outros.
export function distribute(n, buckets, rng = Math.random) {
  const result = new Map(buckets.map((b) => [b.key, 0]));
  let remaining = Math.min(n, buckets.reduce((sum, b) => sum + b.cap, 0));
  while (remaining > 0) {
    const open = buckets.filter((b) => result.get(b.key) < b.cap);
    const base = Math.floor(remaining / open.length);
    let extra = remaining % open.length;
    for (const b of shuffle(open, rng)) {
      const want = base + (extra > 0 ? 1 : 0);
      if (extra > 0) extra -= 1;
      const give = Math.min(want, b.cap - result.get(b.key));
      result.set(b.key, result.get(b.key) + give);
      remaining -= give;
    }
  }
  return result;
}

export function questionWeight(question, stat, { focusWeak = false, today, lastQuizIds = new Set() } = {}) {
  let w;
  if (!stat || !stat.seen) w = WEIGHTS.unseen;
  else if (!stat.lastOk) w = focusWeak ? WEIGHTS.wrongFocus : WEIGHTS.wrong;
  else if (today && stat.lastDay && diffDays(stat.lastDay, today) < RECENT_DAYS) w = WEIGHTS.rightRecent;
  else w = WEIGHTS.right;
  if (lastQuizIds.has(question.id)) w *= WEIGHTS.inLastQuiz;
  return w;
}

function groupBy(items, keyOf) {
  const map = new Map();
  for (const item of items) {
    const key = keyOf(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
}

export function selectQuestions({
  pool, count, filters = {}, questionStats = {}, lastQuizIds = [], focusWeak = false, today, rng = Math.random,
}) {
  const eligible = filterPool(pool, filters);
  const ctx = { focusWeak, today, lastQuizIds: new Set(lastQuizIds) };
  const byLang = groupBy(eligible, (q) => q.lang);
  const langAlloc = distribute(count, [...byLang].map(([key, qs]) => ({ key, cap: qs.length })), rng);
  const picked = [];
  for (const [lang, qs] of byLang) {
    const byModule = groupBy(qs, (q) => q.module);
    const modAlloc = distribute(langAlloc.get(lang), [...byModule].map(([key, list]) => ({ key, cap: list.length })), rng);
    for (const [mod, list] of byModule) {
      picked.push(...weightedSample(list, (q) => questionWeight(q, questionStats[q.id], ctx), modAlloc.get(mod), rng));
    }
  }
  return { questions: shuffle(picked, rng), available: eligible.length };
}

export function prepareQuestion(question, rng = Math.random) {
  if (question.type === 'multiple') {
    return { ...question, optionOrder: shuffle(question.options.map((_, i) => i), rng) };
  }
  if (question.type === 'order') {
    const correct = question.lines.map(orderLine);
    const same = (lines) => lines.join('\n') === correct.join('\n');
    let lines = correct;
    for (let i = 0; i < 20 && same(lines); i++) lines = shuffle(correct, rng);
    if (same(lines)) lines = [...correct.slice(1), correct[0]];
    return { ...question, shuffledLines: lines };
  }
  return { ...question };
}

export function pickExisting(ids, questions) {
  const byId = new Map(questions.map((q) => [q.id, q]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}
