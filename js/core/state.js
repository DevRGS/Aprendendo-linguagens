import { isDayKey } from './dates.js';

export const CURRENT_SCHEMA = 1;
export const HISTORY_LIMIT = 200;
export const XP_DAYS_KEPT = 400;

export function createInitialState() {
  return {
    schema: CURRENT_SCHEMA,
    profile: null,
    lessons: {},
    modules: {},
    exams: {},
    questions: {},
    cards: {},
    mistakes: [],
    counters: { answered: 0, cardReviews: 0, mistakesFixed: 0, goalDays: 0, quizzes: 0 },
    xp: { total: 0, byDay: {} },
    streak: { current: 0, best: 0, lastDay: null },
    achievements: {},
    history: [],
    lastLesson: null,
    lastQuizIds: [],
    backup: { lastExportAt: null, autoFileEnabled: false, lastAutoWriteAt: null, autoFileError: null },
  };
}

const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
const OBJECT_FIELDS = ['lessons', 'modules', 'exams', 'questions', 'cards', 'counters', 'xp', 'streak', 'achievements', 'backup'];
const ARRAY_FIELDS = ['mistakes', 'history', 'lastQuizIds'];

export function validateState(s) {
  if (!isObj(s)) return 'o conteúdo não é um objeto';
  if (!Number.isInteger(s.schema)) return 'campo schema ausente';
  if (s.profile !== null && s.profile !== undefined) {
    if (!isObj(s.profile) || typeof s.profile.name !== 'string') return 'perfil inválido';
  }
  for (const f of OBJECT_FIELDS) if (f in s && !isObj(s[f])) return `campo ${f} inválido`;
  for (const f of ARRAY_FIELDS) if (f in s && !Array.isArray(s[f])) return `campo ${f} inválido`;
  if (isObj(s.xp) && 'total' in s.xp && typeof s.xp.total !== 'number') return 'campo xp inválido';
  return null;
}

// Conserta ou descarta entradas internas inválidas (backup editado à mão, armazenamento danificado):
// o que não dá para aproveitar some, para nenhuma tela travar com um valor de tipo inesperado.
const DEFAULT_AVATAR = '🧑‍💻';
const GOALS = [20, 50, 100];
const isCount = (v) => Number.isInteger(v) && v >= 0;
const isRate = (v) => typeof v === 'number' && v >= 0 && v <= 1;
const dayOrNull = (v) => (isDayKey(v) ? v : null);
const strOrNull = (v) => (typeof v === 'string' ? v : null);
const strings = (list) => [...new Set((Array.isArray(list) ? list : []).filter((v) => typeof v === 'string'))];

function cleanMap(map, clean) {
  const out = {};
  for (const [key, value] of Object.entries(isObj(map) ? map : {})) {
    const cleaned = isObj(value) ? clean(value) : null;
    if (cleaned) out[key] = cleaned;
  }
  return out;
}

function withOptional(base, entries) {
  for (const [key, value, ok] of entries) if (ok(value)) base[key] = value;
  return base;
}

const cleanProfile = (p) => (isObj(p) && typeof p.name === 'string'
  ? {
    name: p.name,
    avatar: typeof p.avatar === 'string' && p.avatar ? p.avatar : DEFAULT_AVATAR,
    dailyGoal: GOALS.includes(p.dailyGoal) ? p.dailyGoal : 50,
    createdAt: strOrNull(p.createdAt),
  }
  : null);

const cleanLesson = (l) => (isDayKey(l.doneAt) ? { doneAt: l.doneAt } : null);
const cleanModule = (m) => withOptional({}, [
  ['bestPractice', m.bestPractice, isRate],
  ['completedAt', m.completedAt, isDayKey],
  ['cardsActivated', m.cardsActivated, (v) => typeof v === 'boolean'],
]);
const cleanExam = (e) => (isRate(e.best) ? withOptional({ best: e.best }, [['passedAt', e.passedAt, isDayKey]]) : null);
const cleanQuestion = (q) => (isCount(q.seen) && isCount(q.correct)
  ? { seen: q.seen, correct: q.correct, lastDay: dayOrNull(q.lastDay), lastOk: typeof q.lastOk === 'boolean' ? q.lastOk : null, xpDay: dayOrNull(q.xpDay) }
  : null);
const cleanCard = (c) => (Number.isInteger(c.box) && c.box >= 0 && c.box <= 6 && isDayKey(c.due)
  ? { box: c.box, due: c.due, reviews: isCount(c.reviews) ? c.reviews : 0, lapses: isCount(c.lapses) ? c.lapses : 0, xpDay: dayOrNull(c.xpDay) }
  : null);

function cleanHistoryEntry(e) {
  if (!isObj(e) || typeof e.id !== 'string' || typeof e.at !== 'string' || typeof e.kind !== 'string') return null;
  if (!isCount(e.total) || !isCount(e.correct) || typeof e.durationSec !== 'number' || !Array.isArray(e.wrongIds)) return null;
  return {
    id: e.id,
    at: e.at,
    kind: e.kind,
    mode: typeof e.mode === 'string' ? e.mode : 'estudo',
    scopeLabel: typeof e.scopeLabel === 'string' ? e.scopeLabel : '',
    moduleKeys: strings(e.moduleKeys),
    total: e.total,
    correct: e.correct,
    durationSec: e.durationSec,
    wrongIds: strings(e.wrongIds),
  };
}

export function normalizeState(s) {
  const base = createInitialState();
  const counters = { ...base.counters };
  for (const key of Object.keys(counters)) if (isCount(s.counters?.[key])) counters[key] = s.counters[key];
  const byDay = {};
  for (const [day, value] of Object.entries(isObj(s.xp?.byDay) ? s.xp.byDay : {})) {
    if (isDayKey(day) && Number.isFinite(value)) byDay[day] = value;
  }
  const achievements = {};
  for (const [id, day] of Object.entries(isObj(s.achievements) ? s.achievements : {})) if (isDayKey(day)) achievements[id] = day;
  const backup = isObj(s.backup) ? s.backup : {};
  return {
    ...base,
    ...s,
    profile: cleanProfile(s.profile),
    lessons: cleanMap(s.lessons, cleanLesson),
    modules: cleanMap(s.modules, cleanModule),
    exams: cleanMap(s.exams, cleanExam),
    questions: cleanMap(s.questions, cleanQuestion),
    cards: cleanMap(s.cards, cleanCard),
    mistakes: strings(s.mistakes),
    counters,
    xp: { total: typeof s.xp?.total === 'number' && s.xp.total >= 0 ? s.xp.total : 0, byDay },
    streak: {
      current: isCount(s.streak?.current) ? s.streak.current : 0,
      best: isCount(s.streak?.best) ? s.streak.best : 0,
      lastDay: dayOrNull(s.streak?.lastDay),
    },
    achievements,
    history: (Array.isArray(s.history) ? s.history : []).map(cleanHistoryEntry).filter(Boolean),
    lastLesson: strOrNull(s.lastLesson),
    lastQuizIds: strings(s.lastQuizIds),
    backup: {
      lastExportAt: strOrNull(backup.lastExportAt),
      autoFileEnabled: backup.autoFileEnabled === true,
      lastAutoWriteAt: strOrNull(backup.lastAutoWriteAt),
      autoFileError: strOrNull(backup.autoFileError),
    },
  };
}

// Cada versão nova do formato ganha uma entrada aqui: de N para N+1.
export const MIGRATIONS = {};

export function runMigrations(raw, migrations, target) {
  let s = raw;
  while (s.schema < target) {
    const step = migrations[s.schema];
    if (!step) throw new Error(`Sem migração a partir da versão ${s.schema}`);
    s = step(s);
  }
  return s;
}

export function migrate(raw, { migrations = MIGRATIONS, target = CURRENT_SCHEMA } = {}) {
  if (!isObj(raw) || !Number.isInteger(raw.schema)) return { ok: false, reason: 'invalid', error: 'formato desconhecido' };
  if (raw.schema > target) return { ok: false, reason: 'newer' };
  let s;
  try {
    s = runMigrations(raw, migrations, target);
  } catch (e) {
    return { ok: false, reason: 'invalid', error: e.message };
  }
  const problem = validateState(s);
  if (problem) return { ok: false, reason: 'invalid', error: problem };
  return { ok: true, state: normalizeState(s) };
}
