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

export function normalizeState(s) {
  const base = createInitialState();
  return {
    ...base,
    ...s,
    counters: { ...base.counters, ...(s.counters || {}) },
    xp: { total: s.xp?.total ?? 0, byDay: { ...(s.xp?.byDay || {}) } },
    streak: { ...base.streak, ...(s.streak || {}) },
    backup: { ...base.backup, ...(s.backup || {}) },
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
