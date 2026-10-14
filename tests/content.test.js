import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync, statSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { countBlanks } from '../js/core/grading.js';
import { ACHIEVEMENT_IDS } from '../js/core/achievements.js';
import { RESERVED_ROUTES } from '../js/router.js';

const ROOT = new URL('../content/', import.meta.url);
const exists = (rel) => existsSync(new URL(rel, ROOT));
const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, ROOT), 'utf8'));

const TYPES = new Set(['multiple', 'truefalse', 'fill', 'order']);
const ENGINES = new Set(['sqlite']);
const DATASET_FILES = ['schema.sql', 'data.sql', 'hidden-data.sql'];
const BANNED_OPTION = /todas as (anteriores|alternativas)|nenhuma das (anteriores|alternativas)/i;
const ID_PART = /^[a-z0-9-]+$/;
const MIN_QUESTIONS = 12;
const MIN_TYPES = 3;
const MIN_CARDS = 8;
const MIN_SQL_QUESTIONS = 3;
const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

// Campos dos exercícios de SQL (perguntas "sql" e desafios): especificação de SQL, seções 4.3 e 4.4.
export function validateSqlFields(item, ctx, err) {
  if (!ctx.datasets?.has(item.dataset)) err(`conjunto de tabelas inexistente: ${item.dataset}`);
  if (!nonEmpty(item.answer)) err('answer (a consulta de referência) vazio');
  for (const flag of ['ordered', 'columnNames']) {
    if (item[flag] !== undefined && typeof item[flag] !== 'boolean') err(`${flag} deve ser booleano`);
  }
  if (item.check !== undefined && !nonEmpty(item.check)) err('check deve ser uma consulta');
  if (item.accepted !== undefined && !(Array.isArray(item.accepted) && item.accepted.every(nonEmpty))) err('accepted deve ser uma lista de consultas');
  if (!Array.isArray(item.rejected) || item.rejected.length === 0 || !item.rejected.every(nonEmpty)) {
    err('rejected precisa de pelo menos uma consulta errada');
  }
}

export function validateQuestion(q, ctx, errors) {
  const err = (msg) => errors.push(`${ctx.file} → ${q.id ?? '(sem id)'}: ${msg}`);
  if (!new RegExp(`^${ctx.lang}\\.${ctx.module}\\.q\\d{2,}$`).test(q.id ?? '')) err(`id deve seguir ${ctx.lang}.${ctx.module}.qNN`);
  if (ctx.ids.has(q.id)) err('id repetido');
  ctx.ids.add(q.id);
  if (q.type === 'code') err('o tipo "code" é da Fase 2 e ainda não é aceito');
  else if (q.type === 'sql') {
    if (ctx.engine !== 'sqlite') err('o tipo "sql" só vale em linguagem com "engine": "sqlite"');
  } else if (!TYPES.has(q.type)) err(`tipo inválido: ${q.type}`);
  if (![1, 2, 3].includes(q.difficulty)) err('difficulty deve ser 1, 2 ou 3');
  if (!ctx.lessons.has(q.lesson)) err(`aula inexistente: ${q.lesson}`);
  if (!nonEmpty(q.prompt)) err('prompt vazio');
  if (!nonEmpty(q.explanation)) err('explanation vazia');
  if (q.type === 'multiple') {
    if (!Array.isArray(q.options) || q.options.length < 3 || q.options.length > 5) err('multiple precisa de 3 a 5 opções');
    else {
      if (!q.options.every(nonEmpty)) err('opção vazia');
      if (new Set(q.options).size !== q.options.length) err('opções repetidas');
      if (q.options.some((o) => BANNED_OPTION.test(o))) err('opção proibida (todas/nenhuma das anteriores)');
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) err('answer fora da faixa');
    }
  }
  if (q.type === 'truefalse' && typeof q.answer !== 'boolean') err('answer deve ser true ou false');
  if (q.type === 'fill') {
    if (!nonEmpty(q.code)) err('fill precisa de code');
    else if (!Array.isArray(q.blanks) || countBlanks(q.code) !== q.blanks.length) err('número de ___ diferente do tamanho de blanks');
    else if (!q.blanks.every((b) => Array.isArray(b) && b.length > 0 && b.every(nonEmpty))) err('blanks precisa de respostas não vazias');
    if (q.caseInsensitive !== undefined && typeof q.caseInsensitive !== 'boolean') err('caseInsensitive deve ser booleano');
  }
  if (q.type === 'order' && (!Array.isArray(q.lines) || q.lines.length < 3 || !q.lines.every(nonEmpty))) {
    err('order precisa de pelo menos 3 linhas não vazias');
  }
  if (q.type === 'sql') validateSqlFields(q, ctx, err);
}

export function validateChallenge(c, ctx, errors) {
  const err = (msg) => errors.push(`${ctx.file} → ${c.id ?? '(sem id)'}: ${msg}`);
  if (!new RegExp(`^${ctx.lang}\\.${ctx.module}\\.d\\d{2,}$`).test(c.id ?? '')) err(`id deve seguir ${ctx.lang}.${ctx.module}.dNN`);
  if (ctx.ids.has(c.id)) err('id repetido');
  ctx.ids.add(c.id);
  if (!ctx.lessons.has(c.lesson)) err(`aula inexistente: ${c.lesson}`);
  if (!nonEmpty(c.prompt)) err('prompt vazio');
  if (!nonEmpty(c.explanation)) err('explanation vazia');
  validateSqlFields(c, ctx, err);
}

export function validateCard(c, ctx, errors) {
  const err = (msg) => errors.push(`${ctx.file} → ${c.id ?? '(sem id)'}: ${msg}`);
  if (!new RegExp(`^${ctx.lang}\\.${ctx.module}\\.f\\d{2,}$`).test(c.id ?? '')) err(`id deve seguir ${ctx.lang}.${ctx.module}.fNN`);
  if (ctx.ids.has(c.id)) err('id repetido');
  ctx.ids.add(c.id);
  if (!ctx.lessons.has(c.lesson)) err(`aula inexistente: ${c.lesson}`);
  if (!nonEmpty(c.front) || !nonEmpty(c.back)) err('front/back vazios');
}

// Aulas que não aparecem em nenhum item da lista (perguntas ou desafios).
export function lessonsWithoutQuestions(lessonIds, items) {
  const used = new Set(items.map((q) => q.lesson));
  return lessonIds.filter((id) => !used.has(id));
}

// Conjuntos de tabelas de uma linguagem: cada pasta de datasets/ precisa dos três arquivos.
export function readDatasets(dir) {
  const datasets = new Set();
  const errors = [];
  if (!existsSync(dir)) return { datasets, errors };
  for (const name of readdirSync(dir)) {
    if (!statSync(join(dir, name)).isDirectory()) continue;
    if (!ID_PART.test(name)) errors.push(`datasets/${name}: nome inválido`);
    const missing = DATASET_FILES.filter((f) => !existsSync(join(dir, name, f)));
    if (missing.length) errors.push(`datasets/${name}: faltam ${missing.join(', ')}`);
    else datasets.add(name);
  }
  return { datasets, errors };
}

function validateLanguage(entry, ids, errors) {
  const base = `${entry.dir}/`;
  if (!exists(`${base}language.json`)) {
    errors.push(`${base}language.json não existe`);
    return;
  }
  const lang = readJson(`${base}language.json`);
  const err = (msg) => errors.push(`${base}language.json: ${msg}`);
  if (lang.id !== entry.id) err(`id "${lang.id}" diferente do catálogo "${entry.id}"`);
  if (RESERVED_ROUTES.has(lang.id) || !ID_PART.test(lang.id ?? '')) err('id reservado ou inválido');
  for (const f of ['name', 'color', 'icon', 'highlight', 'reference']) if (!nonEmpty(lang[f])) err(`campo ${f} ausente`);
  if (nonEmpty(lang.reference) && !exists(base + lang.reference)) err(`referência ${lang.reference} não existe`);
  if (lang.engine !== undefined && !ENGINES.has(lang.engine)) err(`engine desconhecido: ${lang.engine}`);
  const { datasets, errors: datasetErrors } = readDatasets(fileURLToPath(new URL(`${base}datasets/`, ROOT)));
  datasetErrors.forEach((e) => err(e));
  if (!Array.isArray(lang.modules) || lang.modules.length === 0) {
    err('sem módulos');
    return;
  }
  const moduleIds = new Set();
  for (const m of lang.modules) {
    const mbase = `${base}${m.dir}/`;
    if (!ID_PART.test(m.id ?? '') || moduleIds.has(m.id)) err(`módulo com id inválido ou repetido: ${m.id}`);
    moduleIds.add(m.id);
    if (!nonEmpty(m.title) || !nonEmpty(m.description)) err(`módulo ${m.id} sem título ou descrição`);
    if (!exists(mbase)) {
      err(`pasta ${m.dir} não existe`);
      continue;
    }
    const lessons = new Set();
    for (const l of m.lessons ?? []) {
      if (!ID_PART.test(l.id ?? '') || l.id === 'pratica' || lessons.has(l.id)) err(`aula com id inválido, reservado ou repetido: ${m.id}/${l.id}`);
      lessons.add(l.id);
      if (!nonEmpty(l.title)) err(`aula ${l.id} sem título`);
      if (!Number.isInteger(l.minutes) || l.minutes <= 0) err(`aula ${l.id} com minutes inválido`);
      if (!exists(mbase + l.file)) err(`arquivo ${m.dir}/${l.file} não existe`);
    }
    if (lessons.size === 0) err(`módulo ${m.id} sem aulas`);
    const qFile = `${mbase}questions.json`;
    const cFile = `${mbase}flashcards.json`;
    const dFile = `${mbase}challenges.json`;
    if (!exists(qFile) || !exists(cFile)) {
      err(`módulo ${m.id} sem questions.json ou flashcards.json`);
      continue;
    }
    const ctx = { lang: lang.id, module: m.id, lessons, ids, engine: lang.engine, datasets };
    const questions = readJson(qFile).questions ?? [];
    const cards = readJson(cFile).cards ?? [];
    questions.forEach((q) => validateQuestion(q, { ...ctx, file: qFile }, errors));
    cards.forEach((c) => validateCard(c, { ...ctx, file: cFile }, errors));
    if (questions.length < MIN_QUESTIONS) errors.push(`${qFile}: precisa de pelo menos ${MIN_QUESTIONS} perguntas (tem ${questions.length})`);
    if (new Set(questions.map((q) => q.type)).size < MIN_TYPES) errors.push(`${qFile}: precisa cobrir pelo menos ${MIN_TYPES} tipos de pergunta`);
    if (cards.length < MIN_CARDS) errors.push(`${cFile}: precisa de pelo menos ${MIN_CARDS} cartas (tem ${cards.length})`);
    for (const id of lessonsWithoutQuestions([...lessons], questions)) errors.push(`${qFile}: a aula ${id} não tem nenhuma pergunta`);
    if (!lang.engine) {
      if (exists(dFile)) errors.push(`${dFile}: desafios só existem em linguagem com engine`);
      continue;
    }
    const sqlCount = questions.filter((q) => q.type === 'sql').length;
    if (sqlCount < MIN_SQL_QUESTIONS) errors.push(`${qFile}: precisa de pelo menos ${MIN_SQL_QUESTIONS} perguntas sql (tem ${sqlCount})`);
    if (!exists(dFile)) {
      errors.push(`${dFile}: não existe`);
      continue;
    }
    const challenges = readJson(dFile).challenges ?? [];
    challenges.forEach((c) => validateChallenge(c, { ...ctx, file: dFile }, errors));
    for (const id of lessonsWithoutQuestions([...lessons], challenges)) errors.push(`${dFile}: a aula ${id} não tem nenhum desafio`);
  }
}

test('o validador encontra problemas de propósito', () => {
  const errors = [];
  const ctx = { lang: 'java', module: 'fund', lessons: new Set(['a']), ids: new Set(), file: 'x.json' };
  validateQuestion({ id: 'java.fund.q01', type: 'multiple', difficulty: 1, lesson: 'a', prompt: 'p', explanation: 'e', options: ['1', 'Todas as anteriores', '3'], answer: 0 }, ctx, errors);
  validateQuestion({ id: 'java.fund.q01', type: 'fill', difficulty: 4, lesson: 'z', prompt: 'p', explanation: 'e', code: 'a ___ b ___', blanks: [['x']] }, ctx, errors);
  validateQuestion({ id: 'java.fund.q03', type: 'code', difficulty: 1, lesson: 'a', prompt: 'p', explanation: 'e' }, ctx, errors);
  validateCard({ id: 'java.outro.f01', lesson: 'a', front: 'f', back: '' }, ctx, errors);
  const text = errors.join('\n');
  for (const trecho of ['opção proibida', 'id repetido', 'difficulty', 'aula inexistente', 'número de ___', 'Fase 2', 'fNN', 'front/back']) {
    assert.ok(text.includes(trecho), `deveria acusar: ${trecho}`);
  }
});

test('o validador aponta aulas sem nenhuma pergunta', () => {
  assert.deepEqual(lessonsWithoutQuestions(['a', 'b', 'c'], [{ lesson: 'a' }, { lesson: 'c' }, { lesson: 'a' }]), ['b']);
  assert.deepEqual(lessonsWithoutQuestions(['a'], [{ lesson: 'a' }]), []);
});

test('o validador cuida das perguntas sql e dos desafios', () => {
  const sqlQ = {
    id: 'sql.cons.q01', type: 'sql', difficulty: 1, lesson: 'a', prompt: 'p', explanation: 'e',
    dataset: 'escola', answer: 'SELECT 1', rejected: ['SELECT 2'],
  };
  const base = { lang: 'sql', module: 'cons', lessons: new Set(['a']), file: 'x.json', datasets: new Set(['escola']) };
  const run = (fn, item, ctx) => {
    const errors = [];
    fn(item, { ids: new Set(), ...ctx }, errors);
    return errors.join('\n');
  };
  assert.equal(run(validateQuestion, sqlQ, { ...base, engine: 'sqlite' }), '');
  assert.match(run(validateQuestion, sqlQ, { ...base, engine: undefined }), /o tipo "sql" só vale em linguagem com "engine": "sqlite"/);
  const bad = run(validateQuestion, {
    ...sqlQ, dataset: 'loja', answer: ' ', ordered: 'sim', check: '', accepted: [1], rejected: [],
  }, { ...base, engine: 'sqlite' });
  for (const trecho of ['conjunto de tabelas inexistente: loja', 'answer (a consulta de referência) vazio', 'ordered deve ser booleano',
    'check deve ser uma consulta', 'accepted deve ser uma lista de consultas', 'rejected precisa de pelo menos uma consulta errada']) {
    assert.ok(bad.includes(trecho), `deveria acusar: ${trecho}`);
  }
  const challenge = { id: 'sql.cons.d01', lesson: 'a', prompt: 'p', explanation: 'e', dataset: 'escola', answer: 'SELECT 1', rejected: ['SELECT 2'] };
  assert.equal(run(validateChallenge, challenge, base), '');
  assert.match(run(validateChallenge, { ...challenge, id: 'sql.cons.q01', lesson: 'z', explanation: '' }, base),
    /id deve seguir sql\.cons\.dNN[\s\S]*aula inexistente: z[\s\S]*explanation vazia/);
});

test('readDatasets aceita pastas com os três arquivos e acusa as incompletas', () => {
  const ok = readDatasets(fileURLToPath(new URL('fixtures/sql-ui/content/sql/datasets/', import.meta.url)));
  assert.deepEqual([...ok.datasets], ['pessoas']);
  assert.deepEqual(ok.errors, []);
  const dir = mkdtempSync(join(tmpdir(), 'datasets-'));
  try {
    mkdirSync(join(dir, 'Loja'));
    writeFileSync(join(dir, 'Loja', 'schema.sql'), '');
    const bad = readDatasets(dir);
    assert.deepEqual(bad.errors, ['datasets/Loja: nome inválido', 'datasets/Loja: faltam data.sql, hidden-data.sql']);
    assert.equal(bad.datasets.size, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  assert.deepEqual(readDatasets(join(tmpdir(), 'nao-existe-mesmo')), { datasets: new Set(), errors: [] });
});

test('conteúdo de todas as linguagens é válido', () => {
  const catalog = readJson('catalog.json');
  const errors = [];
  const ids = new Set();
  const langIds = new Set();
  for (const entry of catalog.languages) {
    if (langIds.has(entry.id)) errors.push(`catalog.json: linguagem repetida ${entry.id}`);
    langIds.add(entry.id);
    validateLanguage(entry, ids, errors);
  }
  assert.deepEqual(errors, []);
});

test('toda conquista tem texto e todo texto tem regra', () => {
  const texts = readJson('achievements.json');
  const errors = [];
  for (const a of texts) {
    for (const f of ['id', 'name', 'description', 'hint', 'icon']) if (!nonEmpty(a[f])) errors.push(`achievements.json: ${a.id ?? '?'} sem ${f}`);
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(texts.map((a) => a.id).sort(), [...ACHIEVEMENT_IDS].sort());
});
