# Central de Linguagens — Fase 1A (Plataforma + módulo piloto) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir a plataforma completa da Central de Linguagens (aulas, quiz, flashcards, perfil, gamificação, backup) em JavaScript puro, publicada no GitHub Pages, com o módulo **Fundamentos de Java** como piloto, migrado e conferido com o JDK 21.

**Architecture:** Site estático sem build. `js/core/` guarda as regras puras (sem DOM), testadas com `node --test`. `js/data/` conversa com o navegador (fetch, localStorage, IndexedDB, File System Access). `js/ui/` monta as telas. O conteúdo fica em `content/` (Markdown + JSON) e é validado por um teste. Os trechos de código Java citados no conteúdo são executados de verdade por `tools/verify-java.mjs`.

**Tech Stack:** HTML, CSS, JavaScript (módulos ES), Node 22 (`node --test`), marked 12.0.2 e highlight.js 11.9.0 via CDN jsDelivr, JDK 21 (Temurin) para conferir conteúdo, GitHub Actions + GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-10-11-central-linguagens-design.md`

**Divisão da Fase 1:** este plano (1A) entrega a plataforma inteira com **um** módulo de Java (Fundamentos). O plano 1B, escrito depois, migra e confere os outros seis módulos (Introdução, POO, Coleções, Exceções, Strings e Entrada, Java Moderno) usando o mesmo formato e as mesmas ferramentas.

## Global Constraints

- Sem etapa de build e sem dependências npm: `package.json` só tem `"type": "module"` e o script de teste.
- Bibliotecas externas apenas via CDN com versão fixa: `marked@12.0.2` e `@highlightjs/cdn-assets@11.9.0` (URLs em `js/config.js`).
- Todos os caminhos são relativos (o site roda em `<usuario>.github.io/<repo>/`).
- Arquivos em `js/core/` não usam `window`, `document`, `fetch` nem `localStorage`; recebem data, conteúdo e aleatoriedade por parâmetro.
- Datas de dia sempre no calendário **local**, formato `YYYY-MM-DD` (nunca UTC). Momentos exatos em ISO 8601.
- Nome do produto em um só lugar: `APP_NAME` em `js/config.js` ("Central de Linguagens", provisório).
- Textos da interface em português do Brasil, com linguagem neutra em gênero (nada de "aprovado(a)"; prefira "Você passou").
- Dados da pessoa ou de arquivo importado são sempre inseridos como **texto** (`textContent`/nós de texto), nunca como HTML.
- IDs: aula `<lang>.<modulo>.<aula>`, pergunta `<lang>.<modulo>.qNN`, carta `<lang>.<modulo>.fNN`.
- Limiares: prática do módulo ≥ 0,6; prova ≥ 0,7; prova com 40 perguntas; prática com 5.
- Versão de referência do Java: 21 (LTS). Todo trecho citado como saída, erro de compilação ou exceção é conferido em `verify/java/`.
- Todo commit termina com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (use `git commit -m "<mensagem>" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"`).
- Testes: `npm test` (equivale a `node --test "tests/**/*.test.js"`) precisa passar ao fim de cada tarefa.

## Review Focus

1. **Virada do dia no fuso do Brasil:** às 21h30 em São Paulo ainda é o mesmo dia; sequência, meta e vencimento de cartas não podem "pular" um dia. Teste na Tarefa 1 (`dates.test.js`, fuso `America/Sao_Paulo`).
2. **Conteúdo editado depois que a pessoa já tem progresso:** ids salvos em `mistakes`, `history[].wrongIds` e `cards` que não existem mais no conteúdo não podem quebrar telas. Teste de `pickExisting` na Tarefa 4; as telas usam `pickExisting` (Tarefas 17–19).
3. **Lacuna digitada com espaços extras ou com maiúsculas diferentes:** espaços nas pontas e repetidos são ignorados; maiúsculas contam, exceto com `caseInsensitive`. Teste na Tarefa 3.
4. **Ordenar linhas com linhas idênticas e com recuo:** a correção compara o texto sem recuo, e linhas iguais são intercambiáveis. Teste na Tarefa 3; o embaralhamento com linhas todas iguais não pode travar (Tarefa 4).
5. **Progresso salvo corrompido, de outro app ou de versão mais nova:** nada é apagado; o arquivo é recusado com o motivo certo; e o arquivo do backup automático **não** é sobrescrito pelo estado recomeçado (o backup automático fica pausado nessa carga e nunca grava um estado sem progresso). Testes em `state.test.js` e `backup-format.test.js` (Tarefa 5, incluindo `hasProgress`) e roteiro manual (Tarefa 22).

---

## Estrutura de arquivos

```
index.html                      casca única (Tarefa 13)
.nojekyll  .gitattributes  package.json  README.md
legado/java-crash-course.html   arquivo antigo, guardado como fonte da migração
css/tokens.css  base.css  components.css
js/config.js                    constantes, chaves de armazenamento, URLs de CDN
js/main.js                      inicialização, dispatch, rotas, banners
js/router.js                    parseRoute (puro) + navegação por hash
js/core/dates.js  random.js  srs.js  grading.js  quiz.js  state.js
js/core/backup-format.js  progress.js  gamification.js  achievements.js  stats.js  actions.js
js/data/content.js  storage.js  idb.js  backup.js
js/ui/dom.js  store.js  markdown.js  layout.js  backup-flow.js
js/ui/components/common.js  profile-fields.js  weak-points.js  question.js
js/ui/components/quiz-runner.js  scope-tree.js
js/ui/views/index.js  onboarding.js  not-found.js  home.js  language.js  lesson.js
js/ui/views/reference.js  practice.js  quiz-builder.js  exam.js  flashcards.js
js/ui/views/profile.js  certificate.js  settings.js
content/catalog.json  achievements.json
content/java/language.json  referencia.md
content/java/02-fundamentos/01-variaveis-e-tipos.md ... 06-arrays.md
content/java/02-fundamentos/questions.json  flashcards.json
tools/verify-format.mjs  verify-java.mjs
verify/java/fundamentos/*.java
tests/core/*.test.js  tests/content.test.js  tests/ui-imports.test.js  tests/tools/verify-format.test.js
.github/workflows/pages.yml
docs/verificacao-manual.md
```

---

### Task 1: Fundação do repositório, datas e aleatoriedade

**Files:**
- Move: `java-crash-course.html` → `legado/java-crash-course.html`
- Create: `package.json`, `.gitattributes`, `.nojekyll`, `js/config.js`, `js/core/dates.js`, `js/core/random.js`
- Test: `tests/core/dates.test.js`, `tests/core/random.test.js`

**Interfaces:**
- Produces: `toDayKey(date) → 'YYYY-MM-DD'`, `addDays(key, n) → key`, `diffDays(from, to) → number`, `isDayKey(value) → boolean` (dates.js); `mulberry32(seed) → () => number`, `shuffle(items, rng?) → novo array`, `weightedSample(items, weightOf, k, rng?) → array` (random.js); constantes de `js/config.js`.

- [ ] **Step 1: Guardar o arquivo antigo e criar a base do repositório**

```bash
mkdir legado
mv java-crash-course.html legado/java-crash-course.html
```
(O arquivo ainda não está no git, então o `mv` comum basta.)

`package.json`:
```json
{
  "name": "central-de-linguagens",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test \"tests/**/*.test.js\""
  }
}
```

`.gitattributes`:
```
* text=auto eol=lf
*.png binary
*.jpg binary
```

`.nojekyll`: arquivo vazio.

`js/config.js`:
```js
// Constantes da aplicação. O nome do produto vive só aqui.
export const APP_NAME = 'Central de Linguagens';

export const STORAGE_KEY = 'central-linguagens:state';
export const CORRUPT_KEY_PREFIX = 'central-linguagens:corrupt:';
export const PRE_IMPORT_KEY = 'central-linguagens:pre-import';
export const REMINDER_DISMISS_KEY = 'central-linguagens:reminder-dismissed-until';
export const IDB_NAME = 'central-linguagens';
export const IDB_STORE = 'handles';

export const SAVE_DEBOUNCE_MS = 300;
export const AUTO_BACKUP_DEBOUNCE_MS = 5000;
export const AUTO_BACKUP_FILE_NAME = 'central-linguagens-backup.json';
export const REMINDER_SNOOZE_DAYS = 3;

export const AVATARS = ['🧑‍💻', '👩‍💻', '👨‍💻', '🦊', '🐱', '🐼', '🦉', '🐙', '🚀', '⭐', '🌱', '🎧'];
export const GOAL_OPTIONS = [
  { xp: 20, label: 'Leve', hint: '20 XP por dia' },
  { xp: 50, label: 'Normal', hint: '50 XP por dia' },
  { xp: 100, label: 'Intenso', hint: '100 XP por dia' },
];

export const MARKED_URL = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js';
export const HLJS_URL = 'https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/es/highlight.min.js';
```

- [ ] **Step 2: Escrever os testes de datas e aleatoriedade (falhando)**

`tests/core/dates.test.js`:
```js
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
```

`tests/core/random.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mulberry32, shuffle, weightedSample } from '../../js/core/random.js';

test('mulberry32 é determinístico e fica em [0, 1)', () => {
  const a = mulberry32(42);
  const b = mulberry32(42);
  for (let i = 0; i < 100; i++) {
    const x = a();
    assert.equal(x, b());
    assert.ok(x >= 0 && x < 1);
  }
});

test('shuffle mantém os elementos e não altera o original', () => {
  const original = [1, 2, 3, 4, 5];
  const out = shuffle(original, mulberry32(1));
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
  assert.deepEqual([...out].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(shuffle(original, mulberry32(1)), out);
});

test('weightedSample respeita os pesos', () => {
  const items = [{ id: 'leve', w: 1 }, { id: 'pesado', w: 100 }];
  assert.deepEqual(weightedSample(items, (i) => i.w, 1, () => 0.5).map((i) => i.id), ['pesado']);
  assert.deepEqual(weightedSample(items, (i) => i.w, 1, () => 0).map((i) => i.id), ['leve']);
});

test('weightedSample não repete e devolve no máximo o que existe', () => {
  const items = ['a', 'b', 'c'];
  const out = weightedSample(items, () => 1, 10, mulberry32(3));
  assert.equal(out.length, 3);
  assert.equal(new Set(out).size, 3);
});

test('weightedSample com pesos zerados sorteia de forma uniforme', () => {
  const out = weightedSample(['a', 'b'], () => 0, 2, mulberry32(9));
  assert.deepEqual([...out].sort(), ['a', 'b']);
});
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `node --test tests/core/dates.test.js tests/core/random.test.js`
Expected: FAIL com `Cannot find module '.../js/core/dates.js'`.

- [ ] **Step 4: Implementar**

`js/core/dates.js`:
```js
// Datas como "dia local" no formato YYYY-MM-DD (nunca UTC).
const pad = (n) => String(n).padStart(2, '0');

export function toDayKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toUtcMs(key) {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, m - 1, d);
}

export function addDays(key, n) {
  const dt = new Date(toUtcMs(key) + n * 86400000);
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function diffDays(from, to) {
  return Math.round((toUtcMs(to) - toUtcMs(from)) / 86400000);
}

export function isDayKey(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
```

`js/core/random.js`:
```js
// Aleatoriedade injetável: as funções recebem rng para os testes serem determinísticos.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(items, rng = Math.random) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function weightedSample(items, weightOf, k, rng = Math.random) {
  const pool = items.map((item) => ({ item, w: Math.max(0, weightOf(item)) }));
  const out = [];
  while (out.length < k && pool.length > 0) {
    const total = pool.reduce((sum, p) => sum + p.w, 0);
    let idx = pool.length - 1;
    if (total <= 0) {
      idx = Math.floor(rng() * pool.length);
    } else {
      let r = rng() * total;
      for (let i = 0; i < pool.length; i++) {
        r -= pool[i].w;
        if (r < 0) { idx = i; break; }
      }
    }
    out.push(pool[idx].item);
    pool.splice(idx, 1);
  }
  return out;
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `npm test`
Expected: PASS (todos os testes de dates e random).

- [ ] **Step 6: Commit**

```bash
git add package.json .gitattributes .nojekyll legado/java-crash-course.html js/config.js js/core/dates.js js/core/random.js tests/core/dates.test.js tests/core/random.test.js
git add --renormalize .
git commit -m "Cria base do repositório, datas locais e aleatoriedade determinística" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Repetição espaçada (Leitner com 7 níveis)

**Files:**
- Create: `js/core/srs.js`
- Test: `tests/core/srs.test.js`

**Interfaces:**
- Consumes: `addDays` (dates.js).
- Produces: `INTERVALS = [0,1,3,7,14,30,60]`, `MAX_BOX = 6`, `MASTERED_BOX = 5`, `RATING = { AGAIN: 1, HARD: 2, EASY: 3 }`, `newCard(today) → { box, due, reviews, lapses, xpDay }`, `rateCard(card, rating, today) → novo card`, `isDue(card, today) → boolean`, `isMastered(card) → boolean`.

- [ ] **Step 1: Escrever o teste (falhando)**

`tests/core/srs.test.js`:
```js
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/core/srs.test.js`
Expected: FAIL com `Cannot find module`.

- [ ] **Step 3: Implementar**

`js/core/srs.js`:
```js
import { addDays } from './dates.js';

export const INTERVALS = [0, 1, 3, 7, 14, 30, 60];
export const MAX_BOX = INTERVALS.length - 1;
export const MASTERED_BOX = 5;
export const RATING = Object.freeze({ AGAIN: 1, HARD: 2, EASY: 3 });

export function newCard(today) {
  return { box: 0, due: today, reviews: 0, lapses: 0, xpDay: null };
}

export function rateCard(card, rating, today) {
  const reviews = card.reviews + 1;
  if (rating === RATING.AGAIN) {
    return { ...card, box: 0, due: today, reviews, lapses: card.lapses + 1 };
  }
  if (rating === RATING.HARD) {
    const wait = Math.max(1, Math.floor(INTERVALS[card.box] / 2));
    return { ...card, due: addDays(today, wait), reviews };
  }
  if (rating === RATING.EASY) {
    const box = Math.min(MAX_BOX, card.box + 1);
    return { ...card, box, due: addDays(today, INTERVALS[box]), reviews };
  }
  throw new Error(`Avaliação inválida: ${rating}`);
}

export const isDue = (card, today) => card.due <= today;
export const isMastered = (card) => card.box >= MASTERED_BOX;
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/srs.js tests/core/srs.test.js
git commit -m "Adiciona repetição espaçada Leitner com 7 níveis" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Correção dos quatro tipos de pergunta

**Files:**
- Create: `js/core/grading.js`
- Test: `tests/core/grading.test.js`

**Interfaces:**
- Produces: `BLANK = '___'`, `countBlanks(code) → number`, `normalizeAnswer(text, caseInsensitive?) → string`, `orderLine(line) → string` (sem recuo), `isBlankCorrect(question, index, value) → boolean`, `gradeQuestion(question, response) → boolean`. Formato de `response`: `multiple` → índice na lista **original** de opções; `truefalse` → boolean; `fill` → array de strings (uma por lacuna); `order` → array com o texto das linhas na ordem escolhida.

- [ ] **Step 1: Escrever o teste (falhando)**

`tests/core/grading.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countBlanks, normalizeAnswer, orderLine, isBlankCorrect, gradeQuestion } from '../../js/core/grading.js';

test('countBlanks conta as lacunas', () => {
  assert.equal(countBlanks('a ___ b ___'), 2);
  assert.equal(countBlanks('sem lacuna'), 0);
});

test('normalizeAnswer tira espaços das pontas e junta espaços repetidos', () => {
  assert.equal(normalizeAnswer('  String...   args '), 'String... args');
  assert.equal(normalizeAnswer('SeLeCt', true), 'select');
  assert.equal(normalizeAnswer(undefined), '');
});

test('orderLine remove o recuo', () => {
  assert.equal(orderLine('        soma += i;'), 'soma += i;');
});

test('múltipla escolha compara com o índice original', () => {
  const q = { type: 'multiple', options: ['a', 'b', 'c'], answer: 1 };
  assert.equal(gradeQuestion(q, 1), true);
  assert.equal(gradeQuestion(q, 0), false);
});

test('verdadeiro ou falso', () => {
  const q = { type: 'truefalse', answer: false };
  assert.equal(gradeQuestion(q, false), true);
  assert.equal(gradeQuestion(q, true), false);
});

test('lacuna aceita alternativas, ignora espaços extras e diferencia maiúsculas', () => {
  const q = { type: 'fill', code: 'public static void main(___) {}', blanks: [['String[] args', 'String... args']] };
  assert.equal(gradeQuestion(q, ['String[] args']), true);
  assert.equal(gradeQuestion(q, ['  String...   args ']), true);
  assert.equal(gradeQuestion(q, ['String[]args']), false);
  assert.equal(gradeQuestion(q, ['string[] args']), false);
});

test('lacuna com caseInsensitive aceita outra caixa', () => {
  const q = { type: 'fill', code: '___ * FROM alunos;', blanks: [['SELECT']], caseInsensitive: true };
  assert.equal(gradeQuestion(q, ['select']), true);
});

test('várias lacunas: todas precisam estar certas', () => {
  const q = { type: 'fill', code: '___ x = ___;', blanks: [['int'], ['5']] };
  assert.equal(gradeQuestion(q, ['int', '5']), true);
  assert.equal(gradeQuestion(q, ['int', '6']), false);
  assert.equal(gradeQuestion(q, ['int']), false);
  assert.equal(isBlankCorrect(q, 1, ' 5 '), true);
  assert.equal(isBlankCorrect(q, 1, '6'), false);
});

test('ordenar compara o texto sem recuo e aceita linhas idênticas em qualquer posição', () => {
  const q = { type: 'order', lines: ['if (x) {', '    a();', '}', 'while (y) {', '    b();', '}'] };
  const resposta = ['if (x) {', 'a();', '}', 'while (y) {', 'b();', '}'];
  assert.equal(gradeQuestion(q, resposta), true);
  assert.equal(gradeQuestion(q, ['if (x) {', 'b();', '}', 'while (y) {', 'a();', '}']), false);
  assert.equal(gradeQuestion(q, ['if (x) {', 'a();', '}']), false);
});

test('tipo desconhecido lança erro', () => {
  assert.throws(() => gradeQuestion({ type: 'code' }, 'x'), /Tipo de pergunta desconhecido/);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/core/grading.test.js`
Expected: FAIL com `Cannot find module`.

- [ ] **Step 3: Implementar**

`js/core/grading.js`:
```js
export const BLANK = '___';

export function countBlanks(code) {
  return code.split(BLANK).length - 1;
}

export function normalizeAnswer(text, caseInsensitive = false) {
  const t = String(text ?? '').trim().replace(/\s+/g, ' ');
  return caseInsensitive ? t.toLowerCase() : t;
}

export const orderLine = (line) => String(line).trim();

export function isBlankCorrect(question, index, value) {
  const ci = question.caseInsensitive === true;
  const given = normalizeAnswer(value, ci);
  return question.blanks[index].some((accepted) => normalizeAnswer(accepted, ci) === given);
}

export function gradeQuestion(question, response) {
  switch (question.type) {
    case 'multiple':
    case 'truefalse':
      return response === question.answer;
    case 'fill':
      return Array.isArray(response)
        && response.length === question.blanks.length
        && response.every((value, i) => isBlankCorrect(question, i, value));
    case 'order': {
      const expected = question.lines.map(orderLine);
      return Array.isArray(response)
        && response.length === expected.length
        && response.every((line, i) => orderLine(line) === expected[i]);
    }
    default:
      throw new Error(`Tipo de pergunta desconhecido: ${question.type}`);
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/grading.js tests/core/grading.test.js
git commit -m "Adiciona correção de múltipla escolha, V/F, lacuna e ordenar" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Sorteio de perguntas por escopo

**Files:**
- Create: `js/core/quiz.js`
- Test: `tests/core/quiz.test.js`

**Interfaces:**
- Consumes: `diffDays` (dates.js), `shuffle`, `weightedSample` (random.js), `orderLine` (grading.js).
- Produces:
  - `WEIGHTS`, `RECENT_DAYS = 3`
  - `filterPool(pool, { moduleKeys?, difficulties?, types? }) → questions` (filtro ausente = não filtra; array vazio = nada passa)
  - `distribute(n, buckets: {key, cap}[], rng) → Map<key, number>`
  - `questionWeight(question, stat, { focusWeak, today, lastQuizIds: Set }) → number`
  - `selectQuestions({ pool, count, filters, questionStats, lastQuizIds, focusWeak, today, rng }) → { questions, available }`
  - `prepareQuestion(question, rng?) → { ...question, optionOrder? , shuffledLines? }`
  - `pickExisting(ids, questions) → questions` (na ordem de `ids`, ignorando os que não existem)
- Cada pergunta do `pool` tem, além dos campos do JSON, `lang` (ex.: `'java'`) e `module` (ex.: `'java.fundamentos'`), que o carregador de conteúdo acrescenta.

- [ ] **Step 1: Escrever o teste (falhando)**

`tests/core/quiz.test.js`:
```js
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

test('pickExisting ignora ids que não existem mais no conteúdo', () => {
  const qs = [{ id: 'java.a.q01' }, { id: 'java.a.q02' }];
  assert.deepEqual(pickExisting(['java.a.q02', 'java.a.q99', 'java.a.q01'], qs).map((q) => q.id), ['java.a.q02', 'java.a.q01']);
  assert.deepEqual(pickExisting([], qs), []);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/core/quiz.test.js`
Expected: FAIL com `Cannot find module`.

- [ ] **Step 3: Implementar**

`js/core/quiz.js`:
```js
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
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/quiz.js tests/core/quiz.test.js
git commit -m "Adiciona sorteio de perguntas com divisão por linguagem/módulo e pesos" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Formato do estado, migração e envelope de backup

**Files:**
- Create: `js/core/state.js`, `js/core/backup-format.js`
- Test: `tests/core/state.test.js`, `tests/core/backup-format.test.js`

**Interfaces:**
- Consumes: `diffDays`, `toDayKey` (dates.js).
- Produces (state.js): `CURRENT_SCHEMA = 1`, `HISTORY_LIMIT = 200`, `XP_DAYS_KEPT = 400`, `MIGRATIONS`, `createInitialState()`, `validateState(s) → string|null`, `normalizeState(s)`, `runMigrations(raw, migrations, target)`, `migrate(raw, { migrations?, target? }) → { ok: true, state } | { ok: false, reason: 'invalid'|'newer', error? }`.
- Produces (backup-format.js): `APP_ID = 'central-linguagens'`, `REMINDER_DAYS = 7`, `makeEnvelope(state, now?)`, `parseEnvelope(text) → { ok: true, state, exportedAt } | { ok: false, reason: 'json'|'app'|'newer'|'invalid' }`, `slugify(name)`, `backupFileName(name, dayKey)`, `hasProgress(state)`, `needsBackupReminder({ state, today, dismissedUntil, autoHealthy }) → boolean`.
- `counters` ganha o campo `quizzes` (contador usado para gerar ids únicos do histórico), além dos quatro da especificação.

- [ ] **Step 1: Escrever os testes (falhando)**

`tests/core/state.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CURRENT_SCHEMA, createInitialState, validateState, normalizeState, runMigrations, migrate } from '../../js/core/state.js';

test('estado inicial é válido e passa pela migração', () => {
  const s = createInitialState();
  assert.equal(s.schema, CURRENT_SCHEMA);
  assert.equal(s.profile, null);
  assert.equal(validateState(s), null);
  const r = migrate(JSON.parse(JSON.stringify(s)));
  assert.equal(r.ok, true);
  assert.deepEqual(r.state, s);
});

test('estado de versão mais nova é recusado como "newer"', () => {
  assert.deepEqual(migrate({ ...createInitialState(), schema: CURRENT_SCHEMA + 1 }), { ok: false, reason: 'newer' });
});

test('lixo é recusado como "invalid"', () => {
  assert.equal(migrate(null).reason, 'invalid');
  assert.equal(migrate('texto').reason, 'invalid');
  assert.equal(migrate({ lessons: {} }).reason, 'invalid');
  assert.equal(migrate({ schema: 0 }).reason, 'invalid');
  assert.equal(migrate({ ...createInitialState(), history: 'x' }).reason, 'invalid');
  assert.equal(migrate({ ...createInitialState(), profile: { name: 42 } }).reason, 'invalid');
  assert.equal(migrate({ ...createInitialState(), xp: { total: 'muito' } }).reason, 'invalid');
});

test('runMigrations aplica os passos em ordem', () => {
  const migrations = {
    1: (s) => ({ ...s, schema: 2, passo1: true }),
    2: (s) => ({ ...s, schema: 3, passo2: true }),
  };
  const out = runMigrations({ schema: 1 }, migrations, 3);
  assert.deepEqual(out, { schema: 3, passo1: true, passo2: true });
  assert.throws(() => runMigrations({ schema: 1 }, {}, 2), /Sem migração/);
});

test('normalizeState completa campos ausentes', () => {
  const s = normalizeState({ schema: 1, counters: { answered: 5 } });
  assert.equal(s.counters.answered, 5);
  assert.equal(s.counters.goalDays, 0);
  assert.equal(s.counters.quizzes, 0);
  assert.deepEqual(s.mistakes, []);
  assert.deepEqual(s.backup.autoFileEnabled, false);
});
```

`tests/core/backup-format.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, CURRENT_SCHEMA } from '../../js/core/state.js';
import { APP_ID, makeEnvelope, parseEnvelope, slugify, backupFileName, hasProgress, needsBackupReminder } from '../../js/core/backup-format.js';

const withProfile = (createdAt = new Date(2026, 9, 1, 12).toISOString()) => ({
  ...createInitialState(),
  profile: { name: 'Rafa', avatar: '🦊', dailyGoal: 50, createdAt },
});

test('envelope vai e volta sem perder nada', () => {
  const s = withProfile();
  const env = makeEnvelope(s, new Date('2026-10-11T12:00:00Z'));
  assert.equal(env.app, APP_ID);
  assert.equal(env.exportedAt, '2026-10-11T12:00:00.000Z');
  const r = parseEnvelope(JSON.stringify(env));
  assert.equal(r.ok, true);
  assert.deepEqual(r.state, s);
  assert.equal(r.exportedAt, '2026-10-11T12:00:00.000Z');
});

test('parseEnvelope recusa com o motivo certo', () => {
  assert.deepEqual(parseEnvelope('{ quebrado'), { ok: false, reason: 'json' });
  assert.deepEqual(parseEnvelope(JSON.stringify({ app: 'outro-app', data: {} })), { ok: false, reason: 'app' });
  assert.deepEqual(parseEnvelope(JSON.stringify({ app: APP_ID, schema: CURRENT_SCHEMA + 1, data: {} })), { ok: false, reason: 'newer' });
  assert.deepEqual(parseEnvelope(JSON.stringify({ app: APP_ID, schema: 1, data: { schema: 1, history: 'x' } })), { ok: false, reason: 'invalid' });
  assert.deepEqual(parseEnvelope('null'), { ok: false, reason: 'app' });
});

test('slugify e nome do arquivo', () => {
  assert.equal(slugify('Rafael Gonçalves'), 'rafael-goncalves');
  assert.equal(slugify('  !!! '), 'perfil');
  assert.equal(slugify(undefined), 'perfil');
  assert.equal(backupFileName('Ana Júlia', '2026-10-11'), 'progresso-ana-julia-2026-10-11.json');
});

test('hasProgress', () => {
  const s = withProfile();
  assert.equal(hasProgress(s), false);
  assert.equal(hasProgress({ ...s, counters: { ...s.counters, answered: 1 } }), true);
});

test('lembrete de backup depois de 7 dias com progresso', () => {
  const s = { ...withProfile(), xp: { total: 10, byDay: {} } };
  assert.equal(needsBackupReminder({ state: s, today: '2026-10-07' }), false);
  assert.equal(needsBackupReminder({ state: s, today: '2026-10-08' }), true);
  const exported = { ...s, backup: { ...s.backup, lastExportAt: new Date(2026, 9, 5, 9).toISOString() } };
  assert.equal(needsBackupReminder({ state: exported, today: '2026-10-11' }), false);
  assert.equal(needsBackupReminder({ state: exported, today: '2026-10-12' }), true);
  assert.equal(needsBackupReminder({ state: exported, today: '2026-10-12', dismissedUntil: '2026-10-14' }), false);
  assert.equal(needsBackupReminder({ state: exported, today: '2026-10-14', dismissedUntil: '2026-10-14' }), true);
  assert.equal(needsBackupReminder({ state: exported, today: '2026-10-12', autoHealthy: true }), false);
  assert.equal(needsBackupReminder({ state: withProfile(), today: '2026-12-01' }), false);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/core/state.test.js tests/core/backup-format.test.js`
Expected: FAIL com `Cannot find module`.

- [ ] **Step 3: Implementar**

`js/core/state.js`:
```js
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
```

`js/core/backup-format.js`:
```js
import { CURRENT_SCHEMA, migrate } from './state.js';
import { diffDays, toDayKey } from './dates.js';

export const APP_ID = 'central-linguagens';
export const REMINDER_DAYS = 7;

export function makeEnvelope(state, now = new Date()) {
  return { app: APP_ID, schema: state.schema, exportedAt: now.toISOString(), data: state };
}

export function parseEnvelope(text) {
  let obj;
  try {
    obj = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'json' };
  }
  if (!obj || typeof obj !== 'object' || obj.app !== APP_ID) return { ok: false, reason: 'app' };
  if (typeof obj.schema === 'number' && obj.schema > CURRENT_SCHEMA) return { ok: false, reason: 'newer' };
  const result = migrate(obj.data);
  if (!result.ok) return { ok: false, reason: result.reason === 'newer' ? 'newer' : 'invalid' };
  return { ok: true, state: result.state, exportedAt: obj.exportedAt ?? null };
}

export function slugify(name) {
  const s = String(name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'perfil';
}

export function backupFileName(name, dayKey) {
  return `progresso-${slugify(name)}-${dayKey}.json`;
}

export function hasProgress(state) {
  return Object.keys(state.lessons).length > 0 || state.counters.answered > 0 || state.xp.total > 0;
}

export function needsBackupReminder({ state, today, dismissedUntil = null, autoHealthy = false }) {
  if (autoHealthy || !state.profile || !hasProgress(state)) return false;
  if (dismissedUntil && today < dismissedUntil) return false;
  const ref = state.backup.lastExportAt || state.profile.createdAt;
  if (!ref) return true;
  return diffDays(toDayKey(new Date(ref)), today) >= REMINDER_DAYS;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/state.js js/core/backup-format.js tests/core/state.test.js tests/core/backup-format.test.js
git commit -m "Adiciona formato do estado, migração e envelope de backup" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Regras de progresso, XP, níveis e sequência

**Files:**
- Create: `js/core/progress.js`, `js/core/gamification.js`
- Test: `tests/core/progress.test.js`, `tests/core/gamification.test.js`

**Interfaces:**
- Consumes: `diffDays`, `addDays` (dates.js), `XP_DAYS_KEPT` (state.js).
- Produces (progress.js): `PRACTICE_PASS = 0.6`, `EXAM_PASS = 0.7`, `PRACTICE_QUESTIONS = 5`, `EXAM_QUESTIONS = 40`, `moduleKey(langId, moduleId)`, `lessonKey(langId, moduleId, lessonId)`, `isLessonDone(state, key)`, `moduleLessonsDone(state, language, module)`, `isModuleComplete(state, language, module)`, `hasStudiedModule(state, language, module)`, `languageProgress(state, language) → { lessonsDone, lessonsTotal, percent, modulesDone, modulesTotal }`, `isLanguageComplete(state, language)`, `languageCompletionDay(state, language) → 'YYYY-MM-DD'|null`, `totalMinutes(language)`.
- Produces (gamification.js): `XP = { lesson: 20, perDifficulty: 5, card: 2, module: 50, exam: 200 }`, `xpForLevel(level)`, `levelForXp(total)`, `titleForLevel(level)`, `levelInfo(total) → { level, title, current, needed, progress }`, `updateStreak(streak, today)`, `displayStreak(streak, today)`, `addXp(xp, amount, today)`, `crossedGoal(xpBefore, xpAfter, goal, today)`.
- `language` tem a forma de `language.json` (com `id` e `modules[].lessons[]`); `module.lessons[].minutes` é inteiro.

- [ ] **Step 1: Escrever os testes (falhando)**

`tests/core/progress.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../../js/core/state.js';
import {
  moduleKey, lessonKey, isModuleComplete, hasStudiedModule, languageProgress,
  isLanguageComplete, languageCompletionDay, totalMinutes,
} from '../../js/core/progress.js';

const language = {
  id: 'java',
  modules: [
    { id: 'm1', lessons: [{ id: 'a', minutes: 10 }, { id: 'b', minutes: 20 }] },
    { id: 'm2', lessons: [{ id: 'c', minutes: 45 }] },
  ],
};
const [m1, m2] = language.modules;

function state({ lessons = [], practice = {}, exam = null, completed = {} } = {}) {
  const s = createInitialState();
  for (const key of lessons) s.lessons[key] = { doneAt: '2026-10-01' };
  for (const [mod, best] of Object.entries(practice)) s.modules[mod] = { bestPractice: best, completedAt: completed[mod] };
  if (exam) s.exams.java = exam;
  return s;
}

test('chaves', () => {
  assert.equal(moduleKey('java', 'm1'), 'java.m1');
  assert.equal(lessonKey('java', 'm1', 'a'), 'java.m1.a');
});

test('módulo exige todas as aulas e 60% na prática', () => {
  assert.equal(isModuleComplete(state({ lessons: ['java.m1.a'], practice: { 'java.m1': 1 } }), language, m1), false);
  assert.equal(isModuleComplete(state({ lessons: ['java.m1.a', 'java.m1.b'], practice: { 'java.m1': 0.59 } }), language, m1), false);
  assert.equal(isModuleComplete(state({ lessons: ['java.m1.a', 'java.m1.b'], practice: { 'java.m1': 0.6 } }), language, m1), true);
});

test('hasStudiedModule e languageProgress', () => {
  const s = state({ lessons: ['java.m1.a', 'java.m1.b'], practice: { 'java.m1': 0.8 } });
  assert.equal(hasStudiedModule(s, language, m1), true);
  assert.equal(hasStudiedModule(s, language, m2), false);
  const p = languageProgress(s, language);
  assert.deepEqual({ ...p, percent: Number(p.percent.toFixed(3)) },
    { lessonsDone: 2, lessonsTotal: 3, percent: 0.667, modulesDone: 1, modulesTotal: 2 });
});

test('linguagem concluída exige módulos e prova com 70%', () => {
  const all = ['java.m1.a', 'java.m1.b', 'java.m2.c'];
  const practice = { 'java.m1': 0.8, 'java.m2': 0.6 };
  const completed = { 'java.m1': '2026-10-02', 'java.m2': '2026-10-05' };
  assert.equal(isLanguageComplete(state({ lessons: all, practice }), language), false);
  assert.equal(isLanguageComplete(state({ lessons: all, practice, exam: { best: 0.69 } }), language), false);
  const done = state({ lessons: all, practice, completed, exam: { best: 0.7, passedAt: '2026-10-03' } });
  assert.equal(isLanguageComplete(done, language), true);
  assert.equal(languageCompletionDay(done, language), '2026-10-05');
  assert.equal(languageCompletionDay(state({ lessons: all, practice }), language), null);
});

test('totalMinutes soma as aulas', () => {
  assert.equal(totalMinutes(language), 75);
});
```

`tests/core/gamification.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { xpForLevel, levelForXp, titleForLevel, levelInfo, updateStreak, displayStreak, addXp, crossedGoal } from '../../js/core/gamification.js';

test('níveis: 100 × N para passar do N ao N+1', () => {
  assert.equal(xpForLevel(1), 0);
  assert.equal(xpForLevel(2), 100);
  assert.equal(xpForLevel(5), 1000);
  assert.equal(xpForLevel(10), 4500);
  const casos = [[0, 1], [99, 1], [100, 2], [299, 2], [300, 3], [999, 4], [1000, 5], [4499, 9], [4500, 10], [1e6, 141]];
  for (const [xp, nivel] of casos) assert.equal(levelForXp(xp), nivel, `xp ${xp}`);
});

test('títulos por faixa de nível', () => {
  assert.equal(titleForLevel(1), 'Iniciante');
  assert.equal(titleForLevel(4), 'Iniciante');
  assert.equal(titleForLevel(5), 'Aprendiz');
  assert.equal(titleForLevel(10), 'Praticante');
  assert.equal(titleForLevel(15), 'Especialista');
  assert.equal(titleForLevel(20), 'Referência');
  assert.equal(titleForLevel(60), 'Referência');
});

test('levelInfo mostra o andamento até o próximo nível', () => {
  assert.deepEqual(levelInfo(150), { level: 2, title: 'Iniciante', current: 50, needed: 200, progress: 0.25 });
});

test('sequência: ontem soma, hoje mantém, dia pulado recomeça', () => {
  const zero = { current: 0, best: 0, lastDay: null };
  const d1 = updateStreak(zero, '2026-10-11');
  assert.deepEqual(d1, { current: 1, best: 1, lastDay: '2026-10-11' });
  assert.equal(updateStreak(d1, '2026-10-11'), d1);
  const d2 = updateStreak(d1, '2026-10-12');
  assert.deepEqual(d2, { current: 2, best: 2, lastDay: '2026-10-12' });
  assert.deepEqual(updateStreak(d2, '2026-10-15'), { current: 1, best: 2, lastDay: '2026-10-15' });
});

test('displayStreak zera quando a sequência já quebrou', () => {
  const s = { current: 5, best: 5, lastDay: '2026-10-10' };
  assert.equal(displayStreak(s, '2026-10-10'), 5);
  assert.equal(displayStreak(s, '2026-10-11'), 5);
  assert.equal(displayStreak(s, '2026-10-12'), 0);
  assert.equal(displayStreak({ current: 0, best: 0, lastDay: null }, '2026-10-12'), 0);
});

test('addXp soma no total e no dia e descarta dias antigos', () => {
  const xp = { total: 30, byDay: { '2025-01-01': 10, '2026-10-10': 20 } };
  assert.deepEqual(addXp(xp, 15, '2026-10-11'), { total: 45, byDay: { '2026-10-10': 20, '2026-10-11': 15 } });
  assert.deepEqual(addXp({ total: 0, byDay: {} }, 0, '2026-10-11'), { total: 0, byDay: { '2026-10-11': 0 } });
});

test('crossedGoal só é verdadeiro na passagem', () => {
  const before = { total: 40, byDay: { '2026-10-11': 40 } };
  const after = { total: 55, byDay: { '2026-10-11': 55 } };
  const later = { total: 60, byDay: { '2026-10-11': 60 } };
  assert.equal(crossedGoal(before, after, 50, '2026-10-11'), true);
  assert.equal(crossedGoal(after, later, 50, '2026-10-11'), false);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/core/progress.test.js tests/core/gamification.test.js`
Expected: FAIL com `Cannot find module`.

- [ ] **Step 3: Implementar**

`js/core/progress.js`:
```js
export const PRACTICE_PASS = 0.6;
export const EXAM_PASS = 0.7;
export const PRACTICE_QUESTIONS = 5;
export const EXAM_QUESTIONS = 40;

export const moduleKey = (langId, moduleId) => `${langId}.${moduleId}`;
export const lessonKey = (langId, moduleId, lessonId) => `${langId}.${moduleId}.${lessonId}`;
export const isLessonDone = (state, key) => Boolean(state.lessons[key]);

export function moduleLessonsDone(state, language, module) {
  return module.lessons.filter((l) => isLessonDone(state, lessonKey(language.id, module.id, l.id))).length;
}

export function isModuleComplete(state, language, module) {
  const practice = state.modules[moduleKey(language.id, module.id)]?.bestPractice ?? 0;
  return moduleLessonsDone(state, language, module) === module.lessons.length && practice >= PRACTICE_PASS;
}

export const hasStudiedModule = (state, language, module) => moduleLessonsDone(state, language, module) > 0;

export function languageProgress(state, language) {
  let lessonsDone = 0;
  let lessonsTotal = 0;
  let modulesDone = 0;
  for (const m of language.modules) {
    lessonsDone += moduleLessonsDone(state, language, m);
    lessonsTotal += m.lessons.length;
    if (isModuleComplete(state, language, m)) modulesDone += 1;
  }
  return {
    lessonsDone,
    lessonsTotal,
    percent: lessonsTotal ? lessonsDone / lessonsTotal : 0,
    modulesDone,
    modulesTotal: language.modules.length,
  };
}

export function isLanguageComplete(state, language) {
  return language.modules.every((m) => isModuleComplete(state, language, m))
    && (state.exams[language.id]?.best ?? 0) >= EXAM_PASS;
}

export function languageCompletionDay(state, language) {
  if (!isLanguageComplete(state, language)) return null;
  const days = [
    state.exams[language.id].passedAt,
    ...language.modules.map((m) => state.modules[moduleKey(language.id, m.id)]?.completedAt),
  ].filter(Boolean).sort();
  return days.at(-1) ?? null;
}

export function totalMinutes(language) {
  return language.modules.flatMap((m) => m.lessons).reduce((sum, l) => sum + l.minutes, 0);
}
```

`js/core/gamification.js`:
```js
import { addDays, diffDays } from './dates.js';
import { XP_DAYS_KEPT } from './state.js';

export const XP = Object.freeze({ lesson: 20, perDifficulty: 5, card: 2, module: 50, exam: 200 });
const TITLES = [[20, 'Referência'], [15, 'Especialista'], [10, 'Praticante'], [5, 'Aprendiz'], [1, 'Iniciante']];

export const xpForLevel = (level) => 50 * level * (level - 1);

export function levelForXp(total) {
  let level = Math.max(1, Math.floor((1 + Math.sqrt(1 + 0.08 * Math.max(0, total))) / 2));
  while (xpForLevel(level + 1) <= total) level += 1;
  while (level > 1 && xpForLevel(level) > total) level -= 1;
  return level;
}

export const titleForLevel = (level) => TITLES.find(([min]) => level >= min)[1];

export function levelInfo(total) {
  const level = levelForXp(total);
  const current = total - xpForLevel(level);
  const needed = 100 * level;
  return { level, title: titleForLevel(level), current, needed, progress: current / needed };
}

export function updateStreak(streak, today) {
  if (streak.lastDay === today) return streak;
  const current = streak.lastDay && diffDays(streak.lastDay, today) === 1 ? streak.current + 1 : 1;
  return { current, best: Math.max(streak.best, current), lastDay: today };
}

export function displayStreak(streak, today) {
  if (!streak.lastDay) return 0;
  return diffDays(streak.lastDay, today) <= 1 ? streak.current : 0;
}

export function addXp(xp, amount, today) {
  const byDay = { ...xp.byDay, [today]: (xp.byDay[today] ?? 0) + amount };
  const oldest = addDays(today, -(XP_DAYS_KEPT - 1));
  for (const day of Object.keys(byDay)) if (day < oldest) delete byDay[day];
  return { total: xp.total + amount, byDay };
}

export function crossedGoal(xpBefore, xpAfter, goal, today) {
  return (xpBefore.byDay[today] ?? 0) < goal && (xpAfter.byDay[today] ?? 0) >= goal;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/progress.js js/core/gamification.js tests/core/progress.test.js tests/core/gamification.test.js
git commit -m "Adiciona regras de progresso, XP, níveis e sequência" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Conquistas

**Files:**
- Create: `js/core/achievements.js`
- Test: `tests/core/achievements.test.js`

**Interfaces:**
- Consumes: `levelForXp` (gamification.js), `isMastered` (srs.js), `isLanguageComplete` (progress.js).
- Produces: `ACHIEVEMENT_RULES: { id, test(state, ctx) }[]`, `ACHIEVEMENT_IDS: string[]` (21 ids), `checkAchievements(state, ctx) → string[]` (ids ainda não ganhos cuja regra passa).
- `ctx = { now: Date, languages: Language[], event: null | { type, study?, kind?, mode?, total?, correct? } }`. `event.study === true` em ações de estudo (aula, resposta, carta). `event.type === 'quizFinished'` traz `kind`, `mode`, `total`, `correct`.

- [ ] **Step 1: Escrever o teste (falhando)**

`tests/core/achievements.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../../js/core/state.js';
import { ACHIEVEMENT_IDS, checkAchievements } from '../../js/core/achievements.js';

const base = () => createInitialState();
const ctx = (extra = {}) => ({ now: new Date(2026, 9, 11, 12), languages: [], event: null, ...extra });
const quiz = (total, correct, mode = 'estudo') => ({ type: 'quizFinished', kind: 'quiz', mode, total, correct });

test('são 21 conquistas com ids únicos', () => {
  assert.equal(ACHIEVEMENT_IDS.length, 21);
  assert.equal(new Set(ACHIEVEMENT_IDS).size, 21);
});

test('conquistas por contadores e sequência', () => {
  const s = base();
  Object.assign(s.counters, { answered: 100, cardReviews: 500, mistakesFixed: 20, goalDays: 7 });
  s.streak.best = 30;
  const got = checkAchievements(s, ctx());
  for (const id of ['centena', 'revisor', 'persistente', 'meta-7', 'sequencia-7', 'sequencia-30']) assert.ok(got.includes(id), id);
  for (const id of ['mil-respostas', 'sequencia-100', 'primeiros-passos']) assert.ok(!got.includes(id), id);
});

test('conquista já ganha não volta', () => {
  const s = base();
  s.lessons['java.m.a'] = { doneAt: '2026-10-01' };
  assert.ok(checkAchievements(s, ctx()).includes('primeiros-passos'));
  s.achievements['primeiros-passos'] = '2026-10-01';
  assert.ok(!checkAchievements(s, ctx()).includes('primeiros-passos'));
});

test('gabaritou e simulado-de-respeito dependem do quiz terminado', () => {
  assert.ok(checkAchievements(base(), ctx({ event: quiz(10, 10) })).includes('gabaritou'));
  assert.ok(!checkAchievements(base(), ctx({ event: quiz(9, 9) })).includes('gabaritou'));
  assert.ok(checkAchievements(base(), ctx({ event: quiz(20, 16, 'simulado') })).includes('simulado-de-respeito'));
  assert.ok(!checkAchievements(base(), ctx({ event: quiz(20, 16, 'estudo') })).includes('simulado-de-respeito'));
  assert.ok(!checkAchievements(base(), ctx({ event: quiz(19, 19, 'simulado') })).includes('simulado-de-respeito'));
});

test('coruja e madrugador só contam estudo no horário', () => {
  const at = (h) => new Date(2026, 9, 11, h);
  const study = { type: 'answer', study: true };
  assert.ok(checkAchievements(base(), ctx({ now: at(3), event: study })).includes('coruja'));
  assert.ok(!checkAchievements(base(), ctx({ now: at(3), event: { type: 'backup' } })).includes('coruja'));
  assert.ok(checkAchievements(base(), ctx({ now: at(6), event: study })).includes('madrugador'));
  const seteHoras = checkAchievements(base(), ctx({ now: at(7), event: study }));
  assert.ok(!seteHoras.includes('madrugador') && !seteHoras.includes('coruja'));
});

test('poliglota conta linguagens diferentes nas aulas concluídas', () => {
  const s = base();
  s.lessons = { 'java.m.a': {}, 'sql.m.b': {} };
  assert.ok(!checkAchievements(s, ctx()).includes('poliglota'));
  s.lessons['go.m.c'] = {};
  assert.ok(checkAchievements(s, ctx()).includes('poliglota'));
});

test('cartas dominadas', () => {
  const s = base();
  s.cards['java.m.f01'] = { box: 5 };
  assert.ok(checkAchievements(s, ctx()).includes('na-ponta-da-lingua'));
  for (let i = 0; i < 100; i++) s.cards[`java.m.f${i + 10}`] = { box: 6 };
  assert.ok(checkAchievements(s, ctx()).includes('memoria-de-elefante'));
});

test('níveis, backup e módulo', () => {
  const s = base();
  s.xp.total = 4500;
  s.backup.lastExportAt = '2026-10-11T12:00:00.000Z';
  s.modules['java.m'] = { completedAt: '2026-10-11' };
  const got = checkAchievements(s, ctx());
  for (const id of ['subindo-de-nivel', 'dois-digitos', 'seguro-morreu-de-velho', 'modulo-na-conta']) assert.ok(got.includes(id), id);
});

test('formatura usa o conteúdo das linguagens', () => {
  const language = { id: 'java', modules: [{ id: 'm', lessons: [{ id: 'a', minutes: 5 }] }] };
  const s = base();
  s.lessons['java.m.a'] = { doneAt: '2026-10-01' };
  s.modules['java.m'] = { bestPractice: 1, completedAt: '2026-10-01' };
  s.exams.java = { best: 0.7, passedAt: '2026-10-02' };
  assert.ok(checkAchievements(s, ctx({ languages: [language] })).includes('formatura'));
  s.exams.java.best = 0.5;
  assert.ok(!checkAchievements(s, ctx({ languages: [language] })).includes('formatura'));
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/core/achievements.test.js`
Expected: FAIL com `Cannot find module`.

- [ ] **Step 3: Implementar**

`js/core/achievements.js`:
```js
import { levelForXp } from './gamification.js';
import { isMastered } from './srs.js';
import { isLanguageComplete } from './progress.js';

const masteredCount = (s) => Object.values(s.cards).filter(isMastered).length;
const languagesStudied = (s) => new Set(Object.keys(s.lessons).map((key) => key.split('.')[0])).size;
const finished = (ev) => Boolean(ev) && ev.type === 'quizFinished';
const studyHour = (c) => (c.event?.study ? c.now.getHours() : null);

export const ACHIEVEMENT_RULES = [
  { id: 'primeiros-passos', test: (s) => Object.keys(s.lessons).length >= 1 },
  { id: 'modulo-na-conta', test: (s) => Object.values(s.modules).some((m) => m.completedAt) },
  { id: 'formatura', test: (s, c) => (c.languages ?? []).some((l) => isLanguageComplete(s, l)) },
  { id: 'gabaritou', test: (s, c) => finished(c.event) && c.event.total >= 10 && c.event.correct === c.event.total },
  { id: 'centena', test: (s) => s.counters.answered >= 100 },
  { id: 'mil-respostas', test: (s) => s.counters.answered >= 1000 },
  { id: 'sequencia-7', test: (s) => s.streak.best >= 7 },
  { id: 'sequencia-30', test: (s) => s.streak.best >= 30 },
  { id: 'sequencia-100', test: (s) => s.streak.best >= 100 },
  { id: 'meta-7', test: (s) => s.counters.goalDays >= 7 },
  { id: 'poliglota', test: (s) => languagesStudied(s) >= 3 },
  { id: 'na-ponta-da-lingua', test: (s) => masteredCount(s) >= 1 },
  { id: 'memoria-de-elefante', test: (s) => masteredCount(s) >= 100 },
  { id: 'revisor', test: (s) => s.counters.cardReviews >= 500 },
  { id: 'persistente', test: (s) => s.counters.mistakesFixed >= 20 },
  {
    id: 'simulado-de-respeito',
    test: (s, c) => finished(c.event) && c.event.mode === 'simulado' && c.event.total >= 20 && c.event.correct / c.event.total >= 0.8,
  },
  { id: 'coruja', test: (s, c) => { const h = studyHour(c); return h !== null && h <= 4; } },
  { id: 'madrugador', test: (s, c) => { const h = studyHour(c); return h !== null && h >= 5 && h <= 6; } },
  { id: 'seguro-morreu-de-velho', test: (s) => Boolean(s.backup.lastExportAt || s.backup.autoFileEnabled) },
  { id: 'subindo-de-nivel', test: (s) => levelForXp(s.xp.total) >= 5 },
  { id: 'dois-digitos', test: (s) => levelForXp(s.xp.total) >= 10 },
];

export const ACHIEVEMENT_IDS = ACHIEVEMENT_RULES.map((r) => r.id);

export function checkAchievements(state, ctx) {
  return ACHIEVEMENT_RULES.filter((r) => !state.achievements[r.id] && r.test(state, ctx)).map((r) => r.id);
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/achievements.js tests/core/achievements.test.js
git commit -m "Adiciona as 21 conquistas" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Estatísticas

**Files:**
- Create: `js/core/stats.js`
- Test: `tests/core/stats.test.js`

**Interfaces:**
- Consumes: `addDays` (dates.js), `isMastered` (srs.js).
- Produces: `languageAccuracy(state, langId) → { seen, correct, rate|null }`, `moduleAccuracy(state, moduleKey)`, `weakModules(state, moduleKeys, { minAnswers = 5, limit = 3 }) → { moduleKey, seen, correct, rate }[]` (só módulos com acerto abaixo de 100%), `weakestLesson(state, questionsDoModulo) → lessonId|null`, `masteredCount(state, prefix?)`, `activityGrid(byDay, today, weeks = 12) → { day, xp|null }[]`, `activityLevel(xp, goal) → 0..4`, `totals(state) → { answered, accuracy, cardReviews, daysStudied }`.

- [ ] **Step 1: Escrever o teste (falhando)**

`tests/core/stats.test.js`:
```js
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/core/stats.test.js`
Expected: FAIL com `Cannot find module`.

- [ ] **Step 3: Implementar**

`js/core/stats.js`:
```js
import { addDays } from './dates.js';
import { isMastered } from './srs.js';

function accuracyFor(state, prefix) {
  let seen = 0;
  let correct = 0;
  for (const [id, st] of Object.entries(state.questions)) {
    if (!id.startsWith(prefix)) continue;
    seen += st.seen;
    correct += st.correct;
  }
  return { seen, correct, rate: seen ? correct / seen : null };
}

export const languageAccuracy = (state, langId) => accuracyFor(state, `${langId}.`);
export const moduleAccuracy = (state, modKey) => accuracyFor(state, `${modKey}.`);

export function weakModules(state, moduleKeys, { minAnswers = 5, limit = 3 } = {}) {
  return moduleKeys
    .map((moduleKey) => ({ moduleKey, ...moduleAccuracy(state, moduleKey) }))
    .filter((m) => m.seen >= minAnswers && m.rate < 1)
    .sort((a, b) => a.rate - b.rate || b.seen - a.seen)
    .slice(0, limit);
}

export function weakestLesson(state, questions) {
  const wrongByLesson = new Map();
  for (const q of questions) {
    const st = state.questions[q.id];
    if (!st) continue;
    wrongByLesson.set(q.lesson, (wrongByLesson.get(q.lesson) ?? 0) + (st.seen - st.correct));
  }
  let best = null;
  let max = 0;
  for (const [lesson, wrong] of wrongByLesson) {
    if (wrong > max) { best = lesson; max = wrong; }
  }
  return best;
}

export function masteredCount(state, prefix = '') {
  return Object.entries(state.cards).filter(([id, card]) => id.startsWith(prefix) && isMastered(card)).length;
}

export function activityGrid(byDay, today, weeks = 12) {
  const days = weeks * 7;
  const start = addDays(today, -(days - 1));
  return Array.from({ length: days }, (_, i) => {
    const day = addDays(start, i);
    return { day, xp: byDay[day] ?? null };
  });
}

export function activityLevel(xp, goal) {
  if (xp === null || xp === undefined) return 0;
  if (xp <= 0) return 1;
  if (xp < goal / 2) return 2;
  if (xp < goal) return 3;
  return 4;
}

export function totals(state) {
  const acc = accuracyFor(state, '');
  return {
    answered: state.counters.answered,
    accuracy: acc.rate,
    cardReviews: state.counters.cardReviews,
    daysStudied: Object.keys(state.xp.byDay).length,
  };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/stats.js tests/core/stats.test.js
git commit -m "Adiciona estatísticas, pontos fracos e calendário de atividade" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Ações (transições puras de estado)

**Files:**
- Create: `js/core/actions.js`
- Test: `tests/core/actions.test.js`

**Interfaces:**
- Consumes: `newCard`, `rateCard` (srs.js); `XP`, `addXp`, `updateStreak`, `crossedGoal`, `levelForXp` (gamification.js); `checkAchievements` (achievements.js); `lessonKey`, `moduleKey`, `isModuleComplete`, `EXAM_PASS` (progress.js); `createInitialState`, `HISTORY_LIMIT` (state.js).
- Produces: toda ação tem a assinatura `action(state, payload, ctx) → { state, events }`, com `ctx = { today, now, languages }` e `events = { xpGained, achievements: string[], levelUp: number|null, moduleCompleted: string|null, examPassed: boolean }`. Ações: `setProfile`, `openLesson`, `completeLesson`, `activateModuleCards`, `recordAnswer`, `finishQuiz`, `reviewCard`, `updateBackupMeta`, `replaceState`, `resetProgress`. Quando nada muda, a ação devolve o **mesmo** objeto `state`.
- Payloads:
  - `setProfile`: `{ name, avatar, dailyGoal }`
  - `openLesson`: `{ key }`
  - `completeLesson`: `{ language, moduleId, lessonId, cards }` (cards = cartas do módulo)
  - `activateModuleCards`: `{ language, moduleId, cards }`
  - `recordAnswer`: `{ question, correct }` (question precisa de `id` e `difficulty`)
  - `finishQuiz`: `{ kind: 'practice'|'quiz'|'exam'|'review', mode: 'estudo'|'simulado', scopeLabel, moduleKeys, questionIds, wrongIds, total, correct, durationSec, language?, moduleId? }`
  - `reviewCard`: `{ cardId, rating }`
  - `updateBackupMeta`: objeto parcial de `state.backup`
  - `replaceState`: `{ state }`

- [ ] **Step 1: Escrever o teste (falhando)**

`tests/core/actions.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../../js/core/state.js';
import { RATING } from '../../js/core/srs.js';
import * as A from '../../js/core/actions.js';

const language = { id: 'java', modules: [{ id: 'fund', lessons: [{ id: 'a', minutes: 5 }, { id: 'b', minutes: 5 }] }] };
const cards = [{ id: 'java.fund.f01', lesson: 'a' }, { id: 'java.fund.f02', lesson: 'b' }];
const ctxAt = (today = '2026-10-11', hour = 12) => {
  const [y, m, d] = today.split('-').map(Number);
  return { today, now: new Date(y, m - 1, d, hour), languages: [language] };
};
const withProfile = () => A.setProfile(createInitialState(), { name: '  Rafa  ', avatar: '🦊', dailyGoal: 50 }, ctxAt()).state;
const q = (n, difficulty = 1) => ({ id: `java.fund.q0${n}`, difficulty });
const quiz = (extra) => ({ kind: 'quiz', mode: 'estudo', scopeLabel: 'x', moduleKeys: ['java.fund'], questionIds: [], wrongIds: [], total: 1, correct: 1, durationSec: 1, ...extra });

test('setProfile limpa o nome e preserva createdAt na edição', () => {
  const s = withProfile();
  assert.equal(s.profile.name, 'Rafa');
  const edited = A.setProfile(s, { name: 'Rafael', avatar: '🚀', dailyGoal: 100 }, ctxAt('2026-12-01')).state;
  assert.equal(edited.profile.createdAt, s.profile.createdAt);
  assert.equal(edited.profile.dailyGoal, 100);
});

test('openLesson guarda a última aula e não muda nada se for a mesma', () => {
  const s = A.openLesson(withProfile(), { key: 'java.fund.a' }).state;
  assert.equal(s.lastLesson, 'java.fund.a');
  assert.equal(A.openLesson(s, { key: 'java.fund.a' }).state, s);
});

test('completeLesson registra, libera só as cartas da aula, dá XP e inicia a sequência', () => {
  const { state, events } = A.completeLesson(withProfile(), { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt());
  assert.deepEqual(state.lessons['java.fund.a'], { doneAt: '2026-10-11' });
  assert.deepEqual(state.cards['java.fund.f01'], { box: 0, due: '2026-10-11', reviews: 0, lapses: 0, xpDay: null });
  assert.equal(state.cards['java.fund.f02'], undefined);
  assert.equal(state.xp.total, 20);
  assert.equal(state.streak.current, 1);
  assert.equal(events.xpGained, 20);
  assert.deepEqual(events.achievements, ['primeiros-passos']);
  assert.equal(state.achievements['primeiros-passos'], '2026-10-11');
});

test('completeLesson repetida não muda nada', () => {
  const s = A.completeLesson(withProfile(), { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state;
  assert.equal(A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state, s);
});

test('a última aula conclui o módulo quando a prática já passou', () => {
  let s = withProfile();
  s = A.finishQuiz(s, quiz({ kind: 'practice', total: 5, correct: 3, language, moduleId: 'fund' }), ctxAt()).state;
  s = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state;
  const r = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'b', cards }, ctxAt());
  assert.equal(r.events.moduleCompleted, 'java.fund');
  assert.equal(r.state.modules['java.fund'].completedAt, '2026-10-11');
  assert.equal(r.state.xp.total, 20 + 20 + 50);
  assert.ok(r.events.achievements.includes('modulo-na-conta'));
});

test('recordAnswer: erros, correção, XP uma vez por dia e dificuldade', () => {
  let s = withProfile();
  s = A.recordAnswer(s, { question: q(1, 2), correct: false }, ctxAt()).state;
  s = A.recordAnswer(s, { question: q(1, 2), correct: false }, ctxAt()).state;
  assert.deepEqual(s.mistakes, ['java.fund.q01']);
  assert.equal(s.xp.total, 0);
  s = A.recordAnswer(s, { question: q(1, 2), correct: true }, ctxAt()).state;
  assert.deepEqual(s.mistakes, []);
  assert.equal(s.counters.mistakesFixed, 1);
  assert.equal(s.xp.total, 10);
  s = A.recordAnswer(s, { question: q(1, 2), correct: true }, ctxAt()).state;
  assert.equal(s.xp.total, 10);
  s = A.recordAnswer(s, { question: q(1, 2), correct: true }, ctxAt('2026-10-12')).state;
  assert.equal(s.xp.total, 20);
  assert.deepEqual(s.questions['java.fund.q01'], { seen: 5, correct: 3, lastDay: '2026-10-12', lastOk: true, xpDay: '2026-10-12' });
  assert.equal(s.counters.answered, 5);
  assert.equal(s.streak.current, 2);
  assert.equal(s.xp.byDay['2026-10-11'], 10);
});

test('resposta errada também conta como dia de estudo', () => {
  const s = A.recordAnswer(withProfile(), { question: q(1), correct: false }, ctxAt()).state;
  assert.equal(s.streak.current, 1);
  assert.equal(s.xp.byDay['2026-10-11'], 0);
});

test('meta diária conta uma vez por dia', () => {
  let s = withProfile();
  s = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state;
  s = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'b', cards }, ctxAt()).state;
  assert.equal(s.counters.goalDays, 0);
  s = A.recordAnswer(s, { question: q(1, 3), correct: true }, ctxAt()).state;
  assert.equal(s.counters.goalDays, 1);
  s = A.recordAnswer(s, { question: q(2, 1), correct: true }, ctxAt()).state;
  assert.equal(s.counters.goalDays, 1);
});

test('finishQuiz guarda histórico (até 200), ids únicos e o último quiz', () => {
  let s = withProfile();
  for (let i = 0; i < 205; i++) s = A.finishQuiz(s, quiz({ questionIds: [`id${i}`] }), ctxAt()).state;
  assert.equal(s.history.length, 200);
  assert.deepEqual(s.lastQuizIds, ['id204']);
  assert.equal(new Set(s.history.map((h) => h.id)).size, 200);
  assert.equal(s.history[0].id, 'q205');
});

test('prova: aprovação na primeira vez dá 200 XP; depois só melhora a nota', () => {
  let r = A.finishQuiz(withProfile(), quiz({ kind: 'exam', mode: 'simulado', total: 10, correct: 6, language }), ctxAt());
  assert.equal(r.state.exams.java.best, 0.6);
  assert.equal(r.state.exams.java.passedAt, undefined);
  assert.equal(r.events.examPassed, false);
  r = A.finishQuiz(r.state, quiz({ kind: 'exam', mode: 'simulado', total: 10, correct: 8, language }), ctxAt('2026-10-12'));
  assert.equal(r.state.exams.java.passedAt, '2026-10-12');
  assert.equal(r.events.examPassed, true);
  assert.equal(r.state.xp.total, 200);
  const again = A.finishQuiz(r.state, quiz({ kind: 'exam', mode: 'simulado', total: 10, correct: 10, language }), ctxAt('2026-10-13'));
  assert.equal(again.state.exams.java.passedAt, '2026-10-12');
  assert.equal(again.state.exams.java.best, 1);
  assert.equal(again.state.xp.total, 200);
  assert.ok(again.events.achievements.includes('gabaritou'));
});

test('revisão (kind review) não altera prática nem prova', () => {
  const s = A.finishQuiz(withProfile(), quiz({ kind: 'review', total: 2, correct: 2, language, moduleId: 'fund' }), ctxAt()).state;
  assert.deepEqual(s.modules, {});
  assert.deepEqual(s.exams, {});
  assert.equal(s.history.length, 1);
});

test('formatura quando tudo está concluído', () => {
  let s = withProfile();
  s = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state;
  s = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'b', cards }, ctxAt()).state;
  s = A.finishQuiz(s, quiz({ kind: 'practice', total: 5, correct: 5, language, moduleId: 'fund' }), ctxAt()).state;
  const r = A.finishQuiz(s, quiz({ kind: 'exam', mode: 'simulado', total: 10, correct: 7, language }), ctxAt());
  assert.ok(r.events.achievements.includes('formatura'));
});

test('reviewCard reagenda, conta revisão e dá XP uma vez por carta por dia', () => {
  let s = A.completeLesson(withProfile(), { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt()).state;
  const xp0 = s.xp.total;
  s = A.reviewCard(s, { cardId: 'java.fund.f01', rating: RATING.AGAIN }, ctxAt()).state;
  assert.equal(s.xp.total, xp0 + 2);
  s = A.reviewCard(s, { cardId: 'java.fund.f01', rating: RATING.EASY }, ctxAt()).state;
  assert.equal(s.xp.total, xp0 + 2);
  assert.deepEqual(s.cards['java.fund.f01'], { box: 1, due: '2026-10-12', reviews: 2, lapses: 1, xpDay: '2026-10-11' });
  assert.equal(s.counters.cardReviews, 2);
  assert.equal(A.reviewCard(s, { cardId: 'nao.existe.f01', rating: RATING.EASY }, ctxAt()).state, s);
});

test('subir de nível gera evento', () => {
  let s = withProfile();
  s.xp = { total: 90, byDay: {} };
  const r = A.completeLesson(s, { language, moduleId: 'fund', lessonId: 'a', cards }, ctxAt());
  assert.equal(r.events.levelUp, 2);
});

test('estudar de madrugada dá a conquista coruja', () => {
  const r = A.recordAnswer(withProfile(), { question: q(1), correct: false }, ctxAt('2026-10-11', 2));
  assert.ok(r.events.achievements.includes('coruja'));
});

test('activateModuleCards libera todas as cartas do módulo', () => {
  const s = A.activateModuleCards(withProfile(), { language, moduleId: 'fund', cards }, ctxAt()).state;
  assert.equal(s.modules['java.fund'].cardsActivated, true);
  assert.ok(s.cards['java.fund.f01'] && s.cards['java.fund.f02']);
});

test('updateBackupMeta grava e libera a conquista do backup', () => {
  const r = A.updateBackupMeta(withProfile(), { lastExportAt: '2026-10-11T12:00:00.000Z' }, ctxAt());
  assert.equal(r.state.backup.lastExportAt, '2026-10-11T12:00:00.000Z');
  assert.ok(r.events.achievements.includes('seguro-morreu-de-velho'));
});

test('replaceState e resetProgress', () => {
  const other = { ...createInitialState(), lastLesson: 'x' };
  assert.equal(A.replaceState(withProfile(), { state: other }).state, other);
  assert.deepEqual(A.resetProgress().state, createInitialState());
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/core/actions.test.js`
Expected: FAIL com `Cannot find module`.

- [ ] **Step 3: Implementar**

`js/core/actions.js`:
```js
import { newCard, rateCard } from './srs.js';
import { XP, addXp, updateStreak, crossedGoal, levelForXp } from './gamification.js';
import { checkAchievements } from './achievements.js';
import { lessonKey, moduleKey, isModuleComplete, EXAM_PASS } from './progress.js';
import { createInitialState, HISTORY_LIMIT } from './state.js';

const noEvents = () => ({ xpGained: 0, achievements: [], levelUp: null, moduleCompleted: null, examPassed: false });

function gainXp(s, amount, today) {
  const goal = s.profile?.dailyGoal ?? 50;
  const next = addXp(s.xp, amount, today);
  if (crossedGoal(s.xp, next, goal, today)) s.counters.goalDays += 1;
  s.xp = next;
}

// Dia com estudo de verdade: atualiza a sequência e marca o dia no calendário.
function touchStudy(s, today) {
  s.streak = updateStreak(s.streak, today);
  if (!(today in s.xp.byDay)) s.xp = addXp(s.xp, 0, today);
}

function unlockCards(s, cards, today) {
  for (const card of cards) if (!s.cards[card.id]) s.cards[card.id] = newCard(today);
}

function checkModuleCompletion(s, language, moduleId, today) {
  const module = language.modules.find((m) => m.id === moduleId);
  const key = moduleKey(language.id, moduleId);
  const entry = s.modules[key] ?? {};
  if (!module || entry.completedAt || !isModuleComplete(s, language, module)) return null;
  s.modules[key] = { ...entry, completedAt: today };
  gainXp(s, XP.module, today);
  return key;
}

function finalize(prev, s, ctx, extra = {}) {
  const unlocked = checkAchievements(s, ctx);
  for (const id of unlocked) s.achievements[id] = ctx.today;
  const before = levelForXp(prev.xp.total);
  const after = levelForXp(s.xp.total);
  return {
    state: s,
    events: { ...noEvents(), ...extra, xpGained: s.xp.total - prev.xp.total, achievements: unlocked, levelUp: after > before ? after : null },
  };
}

export function setProfile(state, { name, avatar, dailyGoal }, ctx) {
  const s = structuredClone(state);
  s.profile = {
    name: String(name).trim().slice(0, 60),
    avatar,
    dailyGoal,
    createdAt: state.profile?.createdAt ?? ctx.now.toISOString(),
  };
  return { state: s, events: noEvents() };
}

export function openLesson(state, { key }) {
  if (state.lastLesson === key) return { state, events: noEvents() };
  return { state: { ...state, lastLesson: key }, events: noEvents() };
}

export function completeLesson(state, { language, moduleId, lessonId, cards }, ctx) {
  const key = lessonKey(language.id, moduleId, lessonId);
  if (state.lessons[key]) return { state, events: noEvents() };
  const s = structuredClone(state);
  s.lessons[key] = { doneAt: ctx.today };
  unlockCards(s, cards.filter((c) => c.lesson === lessonId), ctx.today);
  touchStudy(s, ctx.today);
  gainXp(s, XP.lesson, ctx.today);
  const moduleCompleted = checkModuleCompletion(s, language, moduleId, ctx.today);
  return finalize(state, s, { ...ctx, event: { type: 'lessonCompleted', study: true } }, { moduleCompleted });
}

export function activateModuleCards(state, { language, moduleId, cards }, ctx) {
  const s = structuredClone(state);
  const key = moduleKey(language.id, moduleId);
  s.modules[key] = { ...(s.modules[key] ?? {}), cardsActivated: true };
  unlockCards(s, cards, ctx.today);
  return { state: s, events: noEvents() };
}

export function recordAnswer(state, { question, correct }, ctx) {
  const s = structuredClone(state);
  const { today } = ctx;
  const prev = s.questions[question.id] ?? { seen: 0, correct: 0, lastDay: null, lastOk: null, xpDay: null };
  const stat = { ...prev, seen: prev.seen + 1, correct: prev.correct + (correct ? 1 : 0), lastDay: today, lastOk: correct };
  s.counters.answered += 1;
  touchStudy(s, today);
  if (correct) {
    const idx = s.mistakes.indexOf(question.id);
    if (idx >= 0) {
      s.mistakes.splice(idx, 1);
      s.counters.mistakesFixed += 1;
    }
    if (prev.xpDay !== today) {
      gainXp(s, XP.perDifficulty * question.difficulty, today);
      stat.xpDay = today;
    }
  } else if (!s.mistakes.includes(question.id)) {
    s.mistakes.push(question.id);
  }
  s.questions[question.id] = stat;
  return finalize(state, s, { ...ctx, event: { type: 'answer', study: true } });
}

export function finishQuiz(state, payload, ctx) {
  const { kind, mode, scopeLabel, moduleKeys, questionIds, wrongIds, total, correct, durationSec, language, moduleId } = payload;
  const s = structuredClone(state);
  const { today } = ctx;
  const extra = {};
  s.counters.quizzes += 1;
  s.history.unshift({
    id: `q${s.counters.quizzes}`, at: ctx.now.toISOString(), kind, mode, scopeLabel, moduleKeys, total, correct, durationSec, wrongIds,
  });
  s.history = s.history.slice(0, HISTORY_LIMIT);
  s.lastQuizIds = questionIds;
  const rate = total ? correct / total : 0;
  if (kind === 'practice') {
    const key = moduleKey(language.id, moduleId);
    const entry = s.modules[key] ?? {};
    s.modules[key] = { ...entry, bestPractice: Math.max(entry.bestPractice ?? 0, rate) };
    extra.moduleCompleted = checkModuleCompletion(s, language, moduleId, today);
  }
  if (kind === 'exam') {
    const entry = s.exams[language.id] ?? {};
    const next = { ...entry, best: Math.max(entry.best ?? 0, rate) };
    if (rate >= EXAM_PASS && !entry.passedAt) {
      next.passedAt = today;
      gainXp(s, XP.exam, today);
      extra.examPassed = true;
    }
    s.exams[language.id] = next;
  }
  return finalize(state, s, { ...ctx, event: { type: 'quizFinished', kind, mode, total, correct } }, extra);
}

export function reviewCard(state, { cardId, rating }, ctx) {
  const card = state.cards[cardId];
  if (!card) return { state, events: noEvents() };
  const s = structuredClone(state);
  const firstToday = card.xpDay !== ctx.today;
  s.cards[cardId] = { ...rateCard(card, rating, ctx.today), xpDay: ctx.today };
  s.counters.cardReviews += 1;
  touchStudy(s, ctx.today);
  if (firstToday) gainXp(s, XP.card, ctx.today);
  return finalize(state, s, { ...ctx, event: { type: 'cardReviewed', study: true } });
}

export function updateBackupMeta(state, patch, ctx) {
  const s = structuredClone(state);
  s.backup = { ...s.backup, ...patch };
  return finalize(state, s, { ...ctx, event: { type: 'backup' } });
}

export function replaceState(_state, { state }) {
  return { state, events: noEvents() };
}

export function resetProgress() {
  return { state: createInitialState(), events: noEvents() };
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/core/actions.js tests/core/actions.test.js
git commit -m "Adiciona ações puras: aulas, respostas, quizzes, cartas e backup" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Rotas por hash

**Files:**
- Create: `js/router.js`
- Test: `tests/core/router.test.js`

**Interfaces:**
- Produces: `RESERVED_ROUTES: Set<string>` (`quiz`, `flashcards`, `perfil`, `config`), `parseRoute(hash) → { name, params, query }`, `startRouter(onRoute)`, `navigate(hash)`, `refresh()`, `setLeaveGuard(fn|null)`, `hasLeaveGuard()`.
- Nomes de rota: `home`, `quiz`, `flashcards`, `perfil`, `config`, `language {lang}`, `reference {lang}`, `exam {lang}`, `certificate {lang}`, `practice {lang, module}`, `lesson {lang, module, lesson}`, `notFound`.
- O guarda de saída (`setLeaveGuard`) é uma função que devolve `true` para permitir sair. É limpo a cada troca de rota permitida e em `refresh()`.

- [ ] **Step 1: Escrever o teste (falhando)**

`tests/core/router.test.js`:
```js
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/core/router.test.js`
Expected: FAIL com `Cannot find module`.

- [ ] **Step 3: Implementar**

`js/router.js`:
```js
export const RESERVED_ROUTES = new Set(['quiz', 'flashcards', 'perfil', 'config']);

export function parseRoute(hash) {
  const raw = String(hash ?? '').replace(/^#/, '');
  const [pathPart, queryPart = ''] = raw.split('?');
  const query = Object.fromEntries(new URLSearchParams(queryPart));
  const route = (name, params = {}) => ({ name, params, query });
  let parts;
  try {
    parts = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  } catch {
    return route('notFound');
  }
  if (parts.length === 0) return route('home');
  if (RESERVED_ROUTES.has(parts[0])) return parts.length === 1 ? route(parts[0]) : route('notFound');
  const [lang, a, b] = parts;
  if (parts.length === 1) return route('language', { lang });
  if (parts.length === 2) {
    if (a === 'referencia') return route('reference', { lang });
    if (a === 'prova') return route('exam', { lang });
    if (a === 'certificado') return route('certificate', { lang });
    return route('notFound');
  }
  if (parts.length === 3) {
    if (b === 'pratica') return route('practice', { lang, module: a });
    return route('lesson', { lang, module: a, lesson: b });
  }
  return route('notFound');
}

let onRouteHandler = null;
let guard = null;
let currentHash = null;
let ignoreNext = false;

export function setLeaveGuard(fn) {
  guard = fn;
}

export const hasLeaveGuard = () => Boolean(guard);

function handleHashChange() {
  if (ignoreNext) {
    ignoreNext = false;
    return;
  }
  if (guard && currentHash !== null && location.hash !== currentHash && !guard()) {
    ignoreNext = true;
    location.hash = currentHash;
    return;
  }
  guard = null;
  currentHash = location.hash;
  onRouteHandler(parseRoute(location.hash));
}

export function startRouter(onRoute) {
  onRouteHandler = onRoute;
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

export function navigate(hash) {
  location.hash = hash;
}

export function refresh() {
  guard = null;
  if (onRouteHandler) onRouteHandler(parseRoute(location.hash));
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add js/router.js tests/core/router.test.js
git commit -m "Adiciona rotas por hash com guarda de saída" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Conteúdo piloto (Java › Fundamentos) e validador de conteúdo

**Files:**
- Create: `content/catalog.json`, `content/achievements.json`, `content/java/language.json`, `content/java/referencia.md`
- Create: `content/java/02-fundamentos/01-variaveis-e-tipos.md`, `02-conversoes.md`, `03-operadores.md`, `04-condicionais.md`, `05-lacos.md`, `06-arrays.md`, `questions.json`, `flashcards.json`
- Test: `tests/content.test.js`

**Interfaces:**
- Consumes: `countBlanks` (grading.js), `ACHIEVEMENT_IDS` (achievements.js), `RESERVED_ROUTES` (router.js).
- Produces: o formato de conteúdo da especificação (seção 4), que `js/data/content.js` (Tarefa 14) carrega. O validador exporta `validateQuestion(q, ctx, errors)` e `validateCard(c, ctx, errors)` só para o próprio teste.

> **Rigor do conteúdo:** os textos abaixo já foram revisados contra o checklist da especificação (seção 12). Nesta tarefa, **não altere** o sentido técnico de nenhuma frase sem conferir; a Tarefa 12 executa cada trecho de código citado com o JDK 21 e é ela que dá a palavra final.

- [ ] **Step 1: Escrever o validador (falhando)**

`tests/content.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { countBlanks } from '../js/core/grading.js';
import { ACHIEVEMENT_IDS } from '../js/core/achievements.js';
import { RESERVED_ROUTES } from '../js/router.js';

const ROOT = new URL('../content/', import.meta.url);
const exists = (rel) => existsSync(new URL(rel, ROOT));
const readJson = (rel) => JSON.parse(readFileSync(new URL(rel, ROOT), 'utf8'));

const TYPES = new Set(['multiple', 'truefalse', 'fill', 'order']);
const BANNED_OPTION = /todas as (anteriores|alternativas)|nenhuma das (anteriores|alternativas)/i;
const ID_PART = /^[a-z0-9-]+$/;
const MIN_QUESTIONS = 12;
const MIN_TYPES = 3;
const MIN_CARDS = 8;
const nonEmpty = (v) => typeof v === 'string' && v.trim().length > 0;

export function validateQuestion(q, ctx, errors) {
  const err = (msg) => errors.push(`${ctx.file} → ${q.id ?? '(sem id)'}: ${msg}`);
  if (!new RegExp(`^${ctx.lang}\\.${ctx.module}\\.q\\d{2,}$`).test(q.id ?? '')) err(`id deve seguir ${ctx.lang}.${ctx.module}.qNN`);
  if (ctx.ids.has(q.id)) err('id repetido');
  ctx.ids.add(q.id);
  if (q.type === 'code') err('o tipo "code" é da Fase 2 e ainda não é aceito');
  else if (!TYPES.has(q.type)) err(`tipo inválido: ${q.type}`);
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
}

export function validateCard(c, ctx, errors) {
  const err = (msg) => errors.push(`${ctx.file} → ${c.id ?? '(sem id)'}: ${msg}`);
  if (!new RegExp(`^${ctx.lang}\\.${ctx.module}\\.f\\d{2,}$`).test(c.id ?? '')) err(`id deve seguir ${ctx.lang}.${ctx.module}.fNN`);
  if (ctx.ids.has(c.id)) err('id repetido');
  ctx.ids.add(c.id);
  if (!ctx.lessons.has(c.lesson)) err(`aula inexistente: ${c.lesson}`);
  if (!nonEmpty(c.front) || !nonEmpty(c.back)) err('front/back vazios');
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
    if (!exists(qFile) || !exists(cFile)) {
      err(`módulo ${m.id} sem questions.json ou flashcards.json`);
      continue;
    }
    const ctx = { lang: lang.id, module: m.id, lessons, ids };
    const questions = readJson(qFile).questions ?? [];
    const cards = readJson(cFile).cards ?? [];
    questions.forEach((q) => validateQuestion(q, { ...ctx, file: qFile }, errors));
    cards.forEach((c) => validateCard(c, { ...ctx, file: cFile }, errors));
    if (questions.length < MIN_QUESTIONS) errors.push(`${qFile}: precisa de pelo menos ${MIN_QUESTIONS} perguntas (tem ${questions.length})`);
    if (new Set(questions.map((q) => q.type)).size < MIN_TYPES) errors.push(`${qFile}: precisa cobrir pelo menos ${MIN_TYPES} tipos de pergunta`);
    if (cards.length < MIN_CARDS) errors.push(`${cFile}: precisa de pelo menos ${MIN_CARDS} cartas (tem ${cards.length})`);
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
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/content.test.js`
Expected: o primeiro teste passa; os outros dois FALHAM com `ENOENT ... content/catalog.json` e `... achievements.json`.

- [ ] **Step 3: Criar catálogo, conquistas e metadados da linguagem**

`content/catalog.json`:
```json
{ "languages": [ { "id": "java", "dir": "java" } ] }
```

`content/achievements.json`:
```json
[
  { "id": "primeiros-passos", "name": "Primeiros passos", "icon": "👣", "description": "Concluiu a primeira aula.", "hint": "Conclua qualquer aula." },
  { "id": "modulo-na-conta", "name": "Módulo na conta", "icon": "📦", "description": "Concluiu o primeiro módulo.", "hint": "Termine todas as aulas de um módulo e tire 60% ou mais na prática." },
  { "id": "formatura", "name": "Formatura", "icon": "🎓", "description": "Concluiu uma linguagem inteira.", "hint": "Conclua todos os módulos de uma linguagem e passe na prova." },
  { "id": "gabaritou", "name": "Gabaritou", "icon": "💯", "description": "Acertou 100% de um quiz ou prova com 10 perguntas ou mais.", "hint": "Acerte tudo num quiz de pelo menos 10 perguntas." },
  { "id": "centena", "name": "Centena", "icon": "📈", "description": "Respondeu 100 perguntas.", "hint": "Responda 100 perguntas." },
  { "id": "mil-respostas", "name": "Mil respostas", "icon": "🏔️", "description": "Respondeu 1.000 perguntas.", "hint": "Responda 1.000 perguntas." },
  { "id": "sequencia-7", "name": "Uma semana firme", "icon": "🔥", "description": "Estudou 7 dias seguidos.", "hint": "Estude 7 dias seguidos." },
  { "id": "sequencia-30", "name": "Um mês firme", "icon": "📅", "description": "Estudou 30 dias seguidos.", "hint": "Estude 30 dias seguidos." },
  { "id": "sequencia-100", "name": "Cem dias", "icon": "💎", "description": "Estudou 100 dias seguidos.", "hint": "Estude 100 dias seguidos." },
  { "id": "meta-7", "name": "Meta cumprida", "icon": "🎯", "description": "Bateu a meta diária em 7 dias.", "hint": "Bata sua meta diária de XP em 7 dias (não precisam ser seguidos)." },
  { "id": "poliglota", "name": "Poliglota", "icon": "🌎", "description": "Concluiu aulas de 3 linguagens diferentes.", "hint": "Conclua aulas em 3 linguagens." },
  { "id": "na-ponta-da-lingua", "name": "Na ponta da língua", "icon": "👅", "description": "Dominou a primeira carta.", "hint": "Leve uma carta ao nível 6 respondendo \"Fácil\" nas revisões." },
  { "id": "memoria-de-elefante", "name": "Memória de elefante", "icon": "🐘", "description": "Dominou 100 cartas.", "hint": "Domine 100 cartas." },
  { "id": "revisor", "name": "Revisor", "icon": "🔁", "description": "Fez 500 revisões de cartas.", "hint": "Revise 500 cartas." },
  { "id": "persistente", "name": "Persistente", "icon": "💪", "description": "Corrigiu 20 perguntas que tinha errado.", "hint": "Acerte 20 perguntas que estavam em \"Meus erros\"." },
  { "id": "simulado-de-respeito", "name": "Simulado de respeito", "icon": "📝", "description": "Fez 80% ou mais num simulado de 20 perguntas ou mais.", "hint": "Tire 80% num simulado com pelo menos 20 perguntas." },
  { "id": "coruja", "name": "Coruja", "icon": "🦉", "description": "Estudou de madrugada (entre 0h e 4h59).", "hint": "Estude entre meia-noite e 4h59." },
  { "id": "madrugador", "name": "Madrugador", "icon": "🌅", "description": "Estudou bem cedo (entre 5h e 6h59).", "hint": "Estude entre 5h e 6h59." },
  { "id": "seguro-morreu-de-velho", "name": "Seguro morreu de velho", "icon": "🛟", "description": "Fez o primeiro backup do progresso.", "hint": "Exporte um backup ou ative o backup automático." },
  { "id": "subindo-de-nivel", "name": "Subindo de nível", "icon": "⬆️", "description": "Chegou ao nível 5.", "hint": "Acumule 1.000 XP." },
  { "id": "dois-digitos", "name": "Dois dígitos", "icon": "🔟", "description": "Chegou ao nível 10.", "hint": "Acumule 4.500 XP." }
]
```

`content/java/language.json`:
```json
{
  "id": "java",
  "name": "Java",
  "color": "#f89820",
  "icon": "☕",
  "highlight": "java",
  "reference": "referencia.md",
  "modules": [
    {
      "id": "fundamentos",
      "dir": "02-fundamentos",
      "title": "Fundamentos",
      "description": "Tipos, variáveis, conversões, operadores, condicionais, laços e arrays: a base de todo programa Java.",
      "lessons": [
        { "id": "variaveis-e-tipos", "file": "01-variaveis-e-tipos.md", "title": "Variáveis e tipos primitivos", "minutes": 10 },
        { "id": "conversoes", "file": "02-conversoes.md", "title": "Conversões entre tipos", "minutes": 8 },
        { "id": "operadores", "file": "03-operadores.md", "title": "Operadores", "minutes": 10 },
        { "id": "condicionais", "file": "04-condicionais.md", "title": "Condicionais: if e switch", "minutes": 9 },
        { "id": "lacos", "file": "05-lacos.md", "title": "Laços de repetição", "minutes": 8 },
        { "id": "arrays", "file": "06-arrays.md", "title": "Arrays", "minutes": 9 }
      ]
    }
  ]
}
```

- [ ] **Step 4: Escrever as seis aulas**

`content/java/02-fundamentos/01-variaveis-e-tipos.md`:
````markdown
# Variáveis e tipos primitivos

Uma **variável** é um espaço na memória com um **nome**, um **tipo** e um **valor**. Em Java, o tipo vem antes do nome e não muda depois:

```java
int idade = 25;          // número inteiro
double altura = 1.75;    // número com casas decimais
boolean estudando = true;
char inicial = 'R';      // um único caractere, entre aspas simples
String nome = "Rafael";  // texto, entre aspas duplas
```

> [!NOTE]
> Java é **estaticamente tipado**: o compilador confere os tipos antes de o programa rodar. Guardar um texto numa variável `int` é erro de compilação.

## Os 8 tipos primitivos

| Tipo | Tamanho | Faixa / uso | Exemplo |
|---|---|---|---|
| `byte` | 8 bits | −128 a 127 | `byte b = 100;` |
| `short` | 16 bits | −32.768 a 32.767 | `short s = 2000;` |
| `int` | 32 bits | cerca de −2,1 bilhões a 2,1 bilhões (uso geral) | `int x = 42;` |
| `long` | 64 bits | inteiros enormes; use o sufixo `L` | `long n = 10_000_000_000L;` |
| `float` | 32 bits | decimal com menos precisão; sufixo `f` | `float f = 1.5f;` |
| `double` | 64 bits | decimal padrão do Java | `double d = 3.14;` |
| `char` | 16 bits | um caractere (padrão Unicode) | `char c = 'A';` |
| `boolean` | não definido pela especificação | `true` ou `false` | `boolean ok = true;` |

> [!TIP]
> O `_` dentro de números, como em `10_000_000_000L`, só facilita a leitura. Ele é aceito desde o Java 7.

## `String` não é primitivo

`String` é uma **classe** (`java.lang.String`). É por isso que ela tem métodos, como `nome.length()` e `nome.toUpperCase()`. Na aula sobre Strings você vai ver por que textos se comparam com `.equals()`, e não com `==`.

## Variáveis locais precisam de valor antes do uso

Uma variável declarada dentro de um método (variável **local**) não recebe valor automático. Ler a variável antes de dar um valor a ela é erro de compilação:

```java
int total;
System.out.println(total); // erro: variable total might not have been initialized
```

> [!WARNING]
> Valores padrão (como `0` para `int` e `false` para `boolean`) só existem para **atributos de classes** e **posições de arrays**, nunca para variáveis locais.

## Constantes com `final`

```java
final double PI = 3.14159;
PI = 3; // erro de compilação: uma variável final não pode receber outro valor
```
````

`content/java/02-fundamentos/02-conversoes.md`:
````markdown
# Conversões entre tipos

## Conversão automática (widening)

Quando o tipo de destino comporta o valor de origem, o Java converte sozinho:

```java
int inteiro = 42;
long grande = inteiro;    // int → long
double decimal = inteiro; // int → double: vale 42.0
```

A ordem é `byte → short → int → long → float → double`. Um `char` também vira `int` automaticamente.

## Conversão manual (cast, ou narrowing)

No caminho contrário pode haver perda de informação, então o Java exige um **cast** explícito:

```java
double preco = 9.99;
int reais = (int) preco;      // 9: o cast TRUNCA, não arredonda
int valor = 130;
byte pequeno = (byte) valor;  // -126: 130 não cabe em byte e "dá a volta"
```

> [!WARNING]
> `(int) 9.99` resulta em `9`, não em `10`. Para arredondar, use `Math.round(9.99)`, que devolve `10` (um `long`).

## Texto ↔ número

```java
int idade = Integer.parseInt("42");
double nota = Double.parseDouble("7.5");
String texto = String.valueOf(42);   // "42"
String outro = "" + 42;              // também vira "42"
```

Se o texto não for um número válido, `Integer.parseInt("abc")` lança `NumberFormatException` enquanto o programa roda.

## Autoboxing

Cada primitivo tem uma **classe empacotadora** (*wrapper*): `int` ↔ `Integer`, `double` ↔ `Double`, `char` ↔ `Character`, `boolean` ↔ `Boolean`, e assim por diante. O Java converte entre eles automaticamente:

```java
Integer caixa = 10;   // autoboxing: int → Integer
int solto = caixa;    // unboxing: Integer → int
```

> [!TIP]
> As coleções do Java (como `ArrayList`) só guardam objetos. Por isso se escreve `ArrayList<Integer>`, e não `ArrayList<int>`.
````

`content/java/02-fundamentos/03-operadores.md`:
````markdown
# Operadores

## Aritméticos

```java
int a = 7, b = 2;
System.out.println(a + b);   // 9
System.out.println(a - b);   // 5
System.out.println(a * b);   // 14
System.out.println(a / b);   // 3   ← int dividido por int dá int!
System.out.println(a % b);   // 1   ← resto da divisão
System.out.println(7.0 / 2); // 3.5 ← basta um lado ser decimal
```

> [!WARNING]
> Divisão entre dois inteiros **descarta a parte decimal**: `7 / 2` é `3`, e `1 / 2` é `0`.

## Incremento e decremento

```java
int i = 5;
System.out.println(i++); // imprime 5; depois i vira 6  (pós-incremento)
System.out.println(++i); // i vira 7; depois imprime 7  (pré-incremento)
```

O `--` funciona do mesmo jeito, subtraindo 1.

## Atribuição composta

`x += 3` é um atalho para `x = x + 3`. Também existem `-=`, `*=`, `/=` e `%=`.

> [!NOTE]
> A atribuição composta já inclui um cast: com `int x = 10;`, a linha `x += 2.5;` compila e deixa `x` valendo `12`. Já `x = x + 2.5;` não compila, porque o resultado é `double`.

## Relacionais

`==`, `!=`, `>`, `<`, `>=` e `<=` comparam valores e sempre resultam em `boolean`.

## Lógicos

- `&&` (E): se o lado esquerdo for `false`, o lado direito **nem é avaliado** (curto-circuito).
- `||` (OU): se o lado esquerdo for `true`, o lado direito **nem é avaliado** (curto-circuito).
- `!` (NÃO): inverte o valor.
- `&` e `|` também funcionam com `boolean`, mas **sem** curto-circuito: avaliam os dois lados sempre.

```java
String nome = null;
if (nome != null && nome.length() > 3) { // seguro: length() não roda se nome for null
    System.out.println("Nome longo");
}
```

Com `&` no lugar de `&&`, o `nome.length()` rodaria mesmo com `nome` nulo e lançaria `NullPointerException`.

## Ternário

```java
int nota = 75;
String situacao = (nota >= 60) ? "Aprovado" : "Reprovado";
```

## Concatenação com `+`

Quando um dos lados do `+` é uma `String`, o resultado vira texto. A avaliação acontece da esquerda para a direita:

```java
System.out.println(1 + 2 + "3"); // "33": primeiro 1 + 2 = 3, depois 3 + "3"
System.out.println("1" + 2 + 3); // "123": desde o início já é texto
```
````

`content/java/02-fundamentos/04-condicionais.md`:
````markdown
# Condicionais: if e switch

## if / else if / else

```java
int nota = 85;
if (nota >= 90) {
    System.out.println("A");
} else if (nota >= 70) {
    System.out.println("B");   // este bloco roda
} else {
    System.out.println("C");
}
```

Só **um** dos blocos é executado: o primeiro cuja condição for verdadeira.

> [!TIP]
> Use sempre chaves `{ }`, mesmo com uma linha só. Sem chaves, apenas a primeira instrução fica "dentro" do `if`, e isso causa bugs difíceis de ver.

## switch clássico (com `:`)

```java
int dia = 2;
switch (dia) {
    case 1:
        System.out.println("Domingo");
        break;
    case 2:
        System.out.println("Segunda");
        break;
    default:
        System.out.println("Outro dia");
}
```

> [!CAUTION]
> **Fall-through:** sem `break`, a execução continua nos `case` seguintes, mesmo que o valor não combine com eles. É uma das pegadinhas mais famosas do Java.

```java
int x = 2;
switch (x) {
    case 1: System.out.print("A");
    case 2: System.out.print("B");
    case 3: System.out.print("C");
        break;
    default: System.out.print("D");
}
// imprime BC
```

## switch com seta (Java 14+)

A forma moderna usa `->`: não tem fall-through e pode **produzir um valor**:

```java
int dia = 1;
String nome = switch (dia) {
    case 1 -> "Domingo";
    case 7 -> "Sábado";
    default -> "Dia útil";
};
System.out.println(nome); // Domingo
```

O `switch` aceita `int` e os inteiros menores (`byte`, `short`), `char`, `String`, enums e as classes empacotadoras desses tipos. Ele **não** aceita `long`, `float`, `double` nem `boolean`.
````

`content/java/02-fundamentos/05-lacos.md`:
````markdown
# Laços de repetição

## for

```java
for (int i = 1; i <= 3; i++) {
    System.out.println("Volta " + i);
}
```

O `for` tem três partes: **início** (`int i = 1`), **condição** (`i <= 3`, testada antes de cada volta) e **passo** (`i++`, executado ao fim de cada volta).

## while

Testa a condição **antes** de cada volta. Se ela começar falsa, o corpo nunca roda:

```java
int contador = 0;
while (contador < 3) {
    contador++;
}
```

## do-while

Testa a condição **depois** de cada volta, então o corpo roda **pelo menos uma vez**:

```java
int n = 10;
do {
    System.out.println("Rodou uma vez"); // imprime mesmo com n >= 5
} while (n < 5);
```

## for-each (for aprimorado)

Percorre todos os elementos de um array ou de uma coleção, sem índice:

```java
int[] notas = {7, 9, 10};
for (int nota : notas) {
    System.out.println(nota);
}
```

## break e continue

- `break` **encerra** o laço imediatamente.
- `continue` **pula** o resto da volta atual e vai para a próxima.

```java
for (int i = 0; i < 5; i++) {
    if (i == 1) continue; // pula o 1
    if (i == 3) break;    // para no 3
    System.out.print(i);
}
// imprime 02
```

> [!WARNING]
> Cuidado com o **laço infinito**: se a condição nunca ficar falsa (por exemplo, esquecer o `contador++` no `while`), o programa nunca sai do laço.
````

`content/java/02-fundamentos/06-arrays.md`:
````markdown
# Arrays

Um **array** guarda vários valores do **mesmo tipo**, com **tamanho fixo** definido na criação.

```java
int[] numeros = new int[5];             // [0, 0, 0, 0, 0]
String[] nomes = {"Ana", "Bia", "Caio"};
```

## Índices começam em 0

```java
String[] nomes = {"Ana", "Bia", "Caio"};
System.out.println(nomes[0]);                // Ana (primeiro)
System.out.println(nomes[nomes.length - 1]); // Caio (último)
System.out.println(nomes.length);            // 3
```

> [!IMPORTANT]
> Em array, `length` é um **atributo** e se escreve **sem parênteses**. Em `String`, `length()` é um **método**, com parênteses.

> [!CAUTION]
> Num array de tamanho 5, os índices válidos vão de **0 a 4**. Acessar `numeros[5]` lança `ArrayIndexOutOfBoundsException` enquanto o programa roda.

## Valores padrão

Um array criado com `new` já vem preenchido: `0` para números, `false` para `boolean`, o caractere nulo (`'\u0000'`) para `char` e `null` para objetos, como `String`.

## Arrays de duas dimensões

```java
int[][] matriz = {
    {1, 2},
    {3, 4}
};
System.out.println(matriz[1][0]); // 3 (linha 1, coluna 0)
```

## A classe utilitária `Arrays`

```java
import java.util.Arrays;

int[] valores = {3, 1, 2};
Arrays.sort(valores);                         // ordena: [1, 2, 3]
System.out.println(Arrays.toString(valores)); // [1, 2, 3]
int[] copia = Arrays.copyOf(valores, 2);      // [1, 2]
Arrays.fill(valores, 7);                      // [7, 7, 7]
```

> [!TIP]
> `System.out.println(valores)` **não** mostra os elementos: imprime algo como `[I@1b6d3586` (o tipo e um código de identificação). Para ver o conteúdo, use `Arrays.toString(valores)`.
````

- [ ] **Step 5: Escrever as perguntas**

`content/java/02-fundamentos/questions.json`:
```json
{
  "questions": [
    {
      "id": "java.fundamentos.q01", "type": "multiple", "difficulty": 1, "lesson": "operadores",
      "prompt": "Qual é a saída de `System.out.println(7 / 2);`?",
      "options": ["3.5", "3", "4", "Erro de compilação"], "answer": 1,
      "explanation": "Divisão entre dois `int` descarta a parte decimal: `7 / 2` é `3`. Para obter `3.5`, pelo menos um lado precisa ser decimal, como em `7.0 / 2`."
    },
    {
      "id": "java.fundamentos.q02", "type": "truefalse", "difficulty": 1, "lesson": "variaveis-e-tipos",
      "prompt": "`String` é um dos tipos primitivos do Java.",
      "answer": false,
      "explanation": "`String` é uma classe (`java.lang.String`). Os 8 primitivos são `byte`, `short`, `int`, `long`, `float`, `double`, `char` e `boolean`."
    },
    {
      "id": "java.fundamentos.q03", "type": "multiple", "difficulty": 1, "lesson": "variaveis-e-tipos",
      "prompt": "Quantos tipos primitivos existem em Java?",
      "options": ["4", "6", "8", "10"], "answer": 2,
      "explanation": "São 8: `byte`, `short`, `int`, `long`, `float`, `double`, `char` e `boolean`."
    },
    {
      "id": "java.fundamentos.q04", "type": "multiple", "difficulty": 1, "lesson": "conversoes",
      "prompt": "O que este código imprime?\n\n```java\ndouble x = 9.99;\nint n = (int) x;\nSystem.out.println(n);\n```",
      "options": ["9.99", "10", "9", "Erro de compilação"], "answer": 2,
      "explanation": "O cast para `int` **trunca**: descarta a parte decimal sem arredondar. Para arredondar, use `Math.round(x)`."
    },
    {
      "id": "java.fundamentos.q05", "type": "fill", "difficulty": 1, "lesson": "conversoes",
      "prompt": "Complete para converter o texto `\"42\"` em um `int`:",
      "code": "int idade = Integer.___(\"42\");",
      "blanks": [["parseInt", "valueOf"]],
      "explanation": "`Integer.parseInt(\"42\")` devolve diretamente um `int`. `Integer.valueOf(\"42\")` também funciona aqui: devolve um `Integer`, que é convertido para `int` automaticamente (unboxing)."
    },
    {
      "id": "java.fundamentos.q06", "type": "multiple", "difficulty": 3, "lesson": "operadores",
      "prompt": "O que este código imprime?\n\n```java\nint i = 5;\nSystem.out.println(i++ + ++i);\n```",
      "options": ["10", "11", "12", "13"], "answer": 2,
      "explanation": "`i++` vale 5 (e `i` passa a 6); depois `++i` faz `i` virar 7 e vale 7. A soma é 5 + 7 = 12."
    },
    {
      "id": "java.fundamentos.q07", "type": "truefalse", "difficulty": 2, "lesson": "operadores",
      "prompt": "Em `a && b`, se `a` for `false`, a expressão `b` nem chega a ser avaliada.",
      "answer": true,
      "explanation": "É o curto-circuito: com `&&`, se o lado esquerdo é `false`, o resultado já é `false`, então o direito é ignorado. O operador `&` avalia os dois lados sempre."
    },
    {
      "id": "java.fundamentos.q08", "type": "multiple", "difficulty": 2, "lesson": "operadores",
      "prompt": "Qual é a saída de `System.out.println(1 + 2 + \"3\");`?",
      "options": ["6", "123", "33", "Erro de compilação"], "answer": 2,
      "explanation": "A avaliação é da esquerda para a direita: `1 + 2` dá `3` (soma de números) e depois `3 + \"3\"` vira o texto `\"33\"`."
    },
    {
      "id": "java.fundamentos.q09", "type": "multiple", "difficulty": 2, "lesson": "condicionais",
      "prompt": "O que este código imprime?\n\n```java\nint x = 2;\nswitch (x) {\n    case 1: System.out.print(\"A\");\n    case 2: System.out.print(\"B\");\n    case 3: System.out.print(\"C\");\n        break;\n    default: System.out.print(\"D\");\n}\n```",
      "options": ["B", "BC", "BCD", "ABC"], "answer": 1,
      "explanation": "Sem `break` no `case 2`, a execução continua no `case 3` (fall-through) e imprime `C`. O `break` do `case 3` encerra o `switch` antes do `default`."
    },
    {
      "id": "java.fundamentos.q10", "type": "fill", "difficulty": 2, "lesson": "condicionais",
      "prompt": "Com `x` valendo 2, complete para que a saída seja `B!`:",
      "code": "switch (x) {\n    case 1: System.out.print(\"A\"); break;\n    case 2: System.out.print(\"B\"); ___;\n    case 3: System.out.print(\"C\"); break;\n}\nSystem.out.print(\"!\");",
      "blanks": [["break"]],
      "explanation": "`break` encerra o `switch` e a execução segue para a linha seguinte, que imprime `!`. Sem ele, o `case 3` também rodaria (fall-through) e a saída seria `BC!`."
    },
    {
      "id": "java.fundamentos.q11", "type": "order", "difficulty": 1, "lesson": "lacos",
      "prompt": "Ordene as linhas para que o programa imprima **apenas a soma final** de 1 + 2 + 3 (ou seja, `6`):",
      "lines": ["int soma = 0;", "for (int i = 1; i <= 3; i++) {", "    soma += i;", "}", "System.out.println(soma);"],
      "explanation": "A variável é criada antes do laço, o laço acumula os valores e só depois de fechar a chave o total é impresso. Se o `println` ficasse dentro do laço, imprimiria 1, 3 e 6."
    },
    {
      "id": "java.fundamentos.q12", "type": "multiple", "difficulty": 1, "lesson": "lacos",
      "prompt": "Qual laço garante que o corpo seja executado pelo menos uma vez?",
      "options": ["for", "while", "do-while", "for-each"], "answer": 2,
      "explanation": "O `do-while` testa a condição só **depois** de cada volta, então o corpo roda pelo menos uma vez. O `for` e o `while` testam antes."
    },
    {
      "id": "java.fundamentos.q13", "type": "multiple", "difficulty": 2, "lesson": "lacos",
      "prompt": "O que este código imprime?\n\n```java\nfor (int i = 0; i < 5; i++) {\n    if (i == 3) break;\n    System.out.print(i);\n}\n```",
      "options": ["012", "0123", "01234", "0124"], "answer": 0,
      "explanation": "Quando `i` chega a 3, o `break` encerra o laço antes do `print`. Por isso só 0, 1 e 2 são impressos."
    },
    {
      "id": "java.fundamentos.q14", "type": "truefalse", "difficulty": 1, "lesson": "arrays",
      "prompt": "Em um array de tamanho 5, o último índice válido é 5.",
      "answer": false,
      "explanation": "Os índices começam em 0 e vão até 4. O último é sempre `length - 1`; acessar o índice 5 lança `ArrayIndexOutOfBoundsException`."
    },
    {
      "id": "java.fundamentos.q15", "type": "multiple", "difficulty": 1, "lesson": "arrays",
      "prompt": "O que este código imprime?\n\n```java\nint[] arr = new int[5];\nSystem.out.println(arr[2]);\n```",
      "options": ["null", "0", "-1", "Erro de compilação"], "answer": 1,
      "explanation": "Arrays criados com `new` já vêm preenchidos com o valor padrão do tipo: `0` para números, `false` para `boolean` e `null` para objetos."
    },
    {
      "id": "java.fundamentos.q16", "type": "fill", "difficulty": 1, "lesson": "arrays",
      "prompt": "Complete para imprimir quantos elementos o array tem:",
      "code": "int[] numeros = {4, 8, 15};\nSystem.out.println(numeros.___);",
      "blanks": [["length"]],
      "explanation": "Em arrays, `length` é um atributo, sem parênteses. O `length()` com parênteses é método de `String`."
    },
    {
      "id": "java.fundamentos.q17", "type": "multiple", "difficulty": 2, "lesson": "arrays",
      "prompt": "Considerando `import java.util.Arrays;` no topo do arquivo, o que este código imprime?\n\n```java\nint[] a = {3, 1, 2};\nArrays.sort(a);\nSystem.out.println(Arrays.toString(a));\n```",
      "options": ["[3, 1, 2]", "[1, 2, 3]", "123", "Um código como `[I@1b6d3586`"], "answer": 1,
      "explanation": "`Arrays.sort` ordena o próprio array e `Arrays.toString` monta o texto `[1, 2, 3]`. Imprimir o array direto, sem `Arrays.toString`, é que mostraria algo como `[I@1b6d3586`."
    },
    {
      "id": "java.fundamentos.q18", "type": "order", "difficulty": 2, "lesson": "condicionais",
      "prompt": "Ordene as linhas para que notas a partir de 90 imprimam `A`, notas a partir de 70 imprimam `B` e as demais imprimam `C`:",
      "lines": ["if (nota >= 90) {", "    System.out.println(\"A\");", "} else if (nota >= 70) {", "    System.out.println(\"B\");", "} else {", "    System.out.println(\"C\");", "}"],
      "explanation": "O `if` testa primeiro a condição mais exigente. Se `>= 70` viesse antes de `>= 90`, uma nota 95 cairia no `B`."
    },
    {
      "id": "java.fundamentos.q19", "type": "multiple", "difficulty": 3, "lesson": "conversoes",
      "prompt": "Qual é a saída de `System.out.println((byte) 130);`?",
      "options": ["130", "127", "-126", "Erro de compilação"], "answer": 2,
      "explanation": "`byte` vai de −128 a 127. O cast força o valor a caber em 8 bits: 130 − 256 = −126. O cast explícito compila, mas perde informação."
    },
    {
      "id": "java.fundamentos.q20", "type": "truefalse", "difficulty": 2, "lesson": "variaveis-e-tipos",
      "prompt": "Este trecho compila sem erros:\n\n```java\nint total;\nSystem.out.println(total);\n```",
      "answer": false,
      "explanation": "Variáveis locais não recebem valor padrão. Ler `total` antes de dar um valor a ela gera o erro de compilação *variable total might not have been initialized*."
    }
  ]
}
```

- [ ] **Step 6: Escrever os flashcards e a referência rápida**

`content/java/02-fundamentos/flashcards.json`:
```json
{
  "cards": [
    { "id": "java.fundamentos.f01", "lesson": "variaveis-e-tipos", "front": "Quais são os 8 tipos primitivos do Java?", "back": "`byte`, `short`, `int`, `long`, `float`, `double`, `char` e `boolean`." },
    { "id": "java.fundamentos.f02", "lesson": "variaveis-e-tipos", "front": "`String` é um tipo primitivo?", "back": "Não. `String` é uma **classe** (`java.lang.String`), por isso tem métodos como `length()` e `toUpperCase()`." },
    { "id": "java.fundamentos.f03", "lesson": "variaveis-e-tipos", "front": "Uma variável local recebe valor padrão?", "back": "Não. Ela precisa receber um valor antes de ser lida; senão, o código não compila. Valores padrão só existem para atributos e posições de arrays." },
    { "id": "java.fundamentos.f04", "lesson": "operadores", "front": "Quanto vale `10 / 3` com dois `int`?", "back": "`3`. Divisão entre inteiros descarta a parte decimal. Para ter `3.333...`, use um decimal: `10.0 / 3`." },
    { "id": "java.fundamentos.f05", "lesson": "operadores", "front": "Qual a diferença entre `i++` e `++i`?", "back": "`i++` (pós) usa o valor atual e depois incrementa. `++i` (pré) incrementa antes e usa o valor novo." },
    { "id": "java.fundamentos.f06", "lesson": "operadores", "front": "O que é curto-circuito em `&&` e `||`?", "back": "Com `&&`, se o lado esquerdo for `false`, o direito não é avaliado. Com `||`, se o esquerdo for `true`, o direito não é avaliado." },
    { "id": "java.fundamentos.f07", "lesson": "conversoes", "front": "Qual a diferença entre widening e narrowing?", "back": "Widening (ex.: `int` → `double`) é automático e sem perda. Narrowing (ex.: `double` → `int`) exige cast e pode perder informação: `(int) 9.99` dá `9`." },
    { "id": "java.fundamentos.f08", "lesson": "conversoes", "front": "Como converter o texto `\"42\"` em `int`?", "back": "`Integer.parseInt(\"42\")`. Se o texto não for um número válido, é lançada `NumberFormatException`." },
    { "id": "java.fundamentos.f09", "lesson": "condicionais", "front": "O que é fall-through no `switch`?", "back": "No `switch` com `:`, sem `break`, a execução continua nos `case` seguintes, mesmo que o valor não combine com eles." },
    { "id": "java.fundamentos.f10", "lesson": "condicionais", "front": "O que muda no `switch` com seta (`->`, Java 14+)?", "back": "Não há fall-through e o `switch` pode produzir um valor:\n\n```java\nString nome = switch (dia) {\n    case 1 -> \"Domingo\";\n    default -> \"Outro\";\n};\n```" },
    { "id": "java.fundamentos.f11", "lesson": "lacos", "front": "Qual a diferença entre `while` e `do-while`?", "back": "O `while` testa a condição antes de cada volta (pode nunca rodar). O `do-while` testa depois, então roda pelo menos uma vez." },
    { "id": "java.fundamentos.f12", "lesson": "lacos", "front": "Qual a diferença entre `break` e `continue`?", "back": "`break` encerra o laço. `continue` pula o resto da volta atual e segue para a próxima." },
    { "id": "java.fundamentos.f13", "lesson": "arrays", "front": "Como saber o tamanho de um array `arr` e qual é o último índice?", "back": "`arr.length` (sem parênteses). O último índice é `arr.length - 1`, porque os índices começam em 0." },
    { "id": "java.fundamentos.f14", "lesson": "arrays", "front": "Como imprimir o conteúdo de um array de forma legível?", "back": "Com `Arrays.toString(arr)`, que mostra algo como `[1, 2, 3]`. Imprimir o array direto mostra algo como `[I@1b6d3586`." }
  ]
}
```

`content/java/referencia.md`:
````markdown
# Referência rápida de Java

Resumo para consultar durante os estudos. Os detalhes de cada assunto estão nas aulas.

## Tipos primitivos

| Tipo | Tamanho | Observação |
|---|---|---|
| `byte` | 8 bits | −128 a 127 |
| `short` | 16 bits | −32.768 a 32.767 |
| `int` | 32 bits | inteiro padrão |
| `long` | 64 bits | sufixo `L` |
| `float` | 32 bits | sufixo `f` |
| `double` | 64 bits | decimal padrão |
| `char` | 16 bits | aspas simples: `'A'` |
| `boolean` | não definido | `true` ou `false` |

## Modificadores de acesso

| Modificador | Mesma classe | Mesmo pacote | Subclasse em outro pacote | Qualquer lugar |
|---|---|---|---|---|
| `public` | ✓ | ✓ | ✓ | ✓ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| *(nenhum)* | ✓ | ✓ | ✗ | ✗ |
| `private` | ✓ | ✗ | ✗ | ✗ |

## Palavras-chave de orientação a objetos

- `extends`: herda de **uma** classe.
- `implements`: implementa uma ou mais interfaces.
- `abstract`: classe que não pode ser instanciada, ou método sem corpo.
- `final`: variável que não muda, método que não pode ser sobrescrito ou classe que não pode ser herdada.
- `static`: pertence à classe, não a cada objeto.
- `this`: referência ao objeto atual. `super`: referência à superclasse.
- `instanceof`: testa o tipo de um objeto.

## Exceções

- `Throwable` é a raiz. Abaixo dela ficam `Error` (problemas graves, em geral da JVM, que não se costuma tratar) e `Exception`.
- **Checked:** subclasses de `Exception` que não são `RuntimeException`. O compilador exige tratar (`try`/`catch`) ou declarar (`throws`).
- **Unchecked:** subclasses de `RuntimeException`. O tratamento é opcional.
- `throw` lança uma exceção; `throws` declara na assinatura do método que ela pode ser lançada.
- `finally` executa com ou sem exceção.

## Coleções: quando usar

| Coleção | Use quando |
|---|---|
| `ArrayList` | lista de uso geral; acesso rápido por índice |
| `LinkedList` | muitas inserções e remoções nas pontas |
| `HashSet` | valores únicos, sem ordem garantida |
| `TreeSet` | valores únicos, em ordem crescente |
| `HashMap` | pares chave → valor, sem ordem garantida |
| `TreeMap` | pares chave → valor, ordenados pela chave |

## Interfaces funcionais (Java 8+)

| Interface | Formato |
|---|---|
| `Predicate<T>` | `T → boolean` |
| `Function<T, R>` | `T → R` |
| `Consumer<T>` | `T → void` |
| `Supplier<T>` | `() → T` |
| `BiFunction<A, B, R>` | `(A, B) → R` |
| `Comparator<T>` | `(T, T) → int` |

## Streams

- Operações intermediárias (só rodam quando há uma terminal): `filter`, `map`, `sorted`, `distinct`, `limit`, `skip`.
- Operações terminais: `forEach`, `collect`, `toList()` (Java 16+), `count`, `anyMatch`, `allMatch`, `reduce`.
- `sum()` e `average()` existem nos streams numéricos, como `IntStream`.

## Pegadinhas clássicas

- `10 / 3` dá `3` (divisão entre inteiros).
- Compare textos com `.equals()`, nunca com `==`.
- `switch` com `:` e sem `break` continua nos `case` seguintes (fall-through).
- `arr.length` não tem parênteses; `texto.length()` tem.
- `s.toUpperCase()` não altera `s`: `String` é imutável, então reatribua (`s = s.toUpperCase();`).
- `i++` usa o valor atual e só depois incrementa.
- `Optional.get()` lança `NoSuchElementException` se estiver vazio; prefira `orElse`.
````

- [ ] **Step 7: Rodar e ver passar**

Run: `npm test`
Expected: PASS (os três testes de `content.test.js` e todos os anteriores).

- [ ] **Step 8: Commit**

```bash
git add content tests/content.test.js
git commit -m "Adiciona módulo piloto Java › Fundamentos, conquistas e validador de conteúdo" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Conferência do conteúdo com o JDK 21

**Files:**
- Create: `tools/verify-format.mjs`, `tools/verify-java.mjs`, `verify/java/fundamentos/*.java` (30 arquivos listados abaixo)
- Test: `tests/tools/verify-format.test.js`

**Interfaces:**
- Produces: `parseExpectation(source) → { kind: 'output', output } | { kind: 'compile-error' } | { kind: 'exception', name }` (verify-format.mjs). Formato do cabeçalho de cada `.java`: linhas `//` no topo; `// saida:` seguido das linhas esperadas (cada uma prefixada com `// `, linha vazia como `//`), ou `// espera: erro-de-compilacao`, ou `// espera: excecao NomeDaExcecao`.
- `node tools/verify-java.mjs` executa cada arquivo com `java <arquivo>.java` (modo de arquivo único, Java 11+) e sai com código 1 se algum falhar, 2 se o Java for menor que 21.

- [ ] **Step 1: Instalar o JDK 21 portátil (sem mexer no Java 8 do sistema)**

Confirme com a pessoa antes de baixar (cerca de 200 MB). Em PowerShell:
```powershell
$dest = "$env:USERPROFILE\tools"
New-Item -ItemType Directory -Force $dest | Out-Null
Invoke-WebRequest -Uri 'https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse?project=jdk' -OutFile "$dest\jdk21.zip"
Expand-Archive "$dest\jdk21.zip" -DestinationPath $dest -Force
Remove-Item "$dest\jdk21.zip"
(Get-ChildItem $dest -Directory -Filter 'jdk-21*' | Select-Object -First 1).FullName
```
Expected: imprime algo como `C:\Users\nitron\tools\jdk-21.0.x+y`. Nada é adicionado ao PATH do sistema; o JDK só é usado via `JAVA_HOME` na hora de conferir.

- [ ] **Step 2: Escrever o teste do formato (falhando)**

`tests/tools/verify-format.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseExpectation } from '../../tools/verify-format.mjs';

test('saída esperada com linha vazia', () => {
  const src = '// verifica: x\n// saida:\n// 3\n//\n// fim\nclass Main {}\n// saida: ignorado\n';
  assert.deepEqual(parseExpectation(src), { kind: 'output', output: '3\n\nfim' });
});

test('erro de compilação e exceção', () => {
  assert.deepEqual(parseExpectation('// espera: erro-de-compilacao\nclass Main {}'), { kind: 'compile-error' });
  assert.deepEqual(parseExpectation('// espera: excecao NumberFormatException\nclass Main {}'), { kind: 'exception', name: 'NumberFormatException' });
});

test('cabeçalho ausente ou desconhecido lança erro', () => {
  assert.throws(() => parseExpectation('class Main {}'), /cabeçalho/);
  assert.throws(() => parseExpectation('// espera: talvez\nclass Main {}'), /desconhecido/);
});

test('aceita quebras de linha do Windows', () => {
  assert.deepEqual(parseExpectation('// saida:\r\n// ok\r\nclass Main {}'), { kind: 'output', output: 'ok' });
});
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `node --test tests/tools/verify-format.test.js`
Expected: FAIL com `Cannot find module`.

- [ ] **Step 4: Implementar o formato e o executor**

`tools/verify-format.mjs`:
```js
// Lê o cabeçalho de comentários de um trecho Java e diz o que se espera dele.
export function parseExpectation(source) {
  const header = [];
  for (const line of source.split(/\r?\n/)) {
    if (!line.startsWith('//')) break;
    header.push(line);
  }
  const expect = header.find((l) => l.startsWith('// espera:'));
  if (expect) {
    const value = expect.slice('// espera:'.length).trim();
    if (value === 'erro-de-compilacao') return { kind: 'compile-error' };
    const m = /^excecao\s+(\S+)$/.exec(value);
    if (m) return { kind: 'exception', name: m[1] };
    throw new Error(`"// espera:" desconhecido: ${value}`);
  }
  const start = header.findIndex((l) => l.trim() === '// saida:');
  if (start < 0) throw new Error('cabeçalho sem "// saida:" nem "// espera:"');
  const output = header.slice(start + 1).map((l) => (l === '//' ? '' : l.replace(/^\/\/ ?/, '')));
  return { kind: 'output', output: output.join('\n') };
}
```

`tools/verify-java.mjs`:
```js
// Executa os trechos de verify/java com o JDK 21+ e compara com o cabeçalho de cada arquivo.
// Uso: node tools/verify-java.mjs  (usa JAVA_HOME se definido; senão, o "java" do PATH)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseExpectation } from './verify-format.mjs';

const ROOT = fileURLToPath(new URL('../verify/java/', import.meta.url));
const java = process.env.JAVA_HOME ? join(process.env.JAVA_HOME, 'bin', 'java') : 'java';

function javaMajor() {
  const r = spawnSync(java, ['-version'], { encoding: 'utf8' });
  const m = /version "(\d+)(?:\.(\d+))?/.exec(`${r.stderr ?? ''}${r.stdout ?? ''}`);
  if (!m) return 0;
  return m[1] === '1' ? Number(m[2]) : Number(m[1]);
}

function listJavaFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return listJavaFiles(p);
    return name.endsWith('.java') ? [p] : [];
  });
}

function run(file) {
  const r = spawnSync(java, ['-Dstdout.encoding=UTF-8', '-Dstderr.encoding=UTF-8', file], { encoding: 'utf8', timeout: 60000 });
  return { code: r.status, stdout: (r.stdout ?? '').replace(/\r\n/g, '\n').trimEnd(), stderr: r.stderr ?? '' };
}

function check(file) {
  const exp = parseExpectation(readFileSync(file, 'utf8'));
  const r = run(file);
  const compileFailed = /compilation failed/.test(r.stderr);
  if (exp.kind === 'compile-error') {
    return r.code !== 0 && compileFailed ? null : `esperava erro de compilação; código ${r.code}\n${r.stderr}`;
  }
  if (exp.kind === 'exception') {
    return r.code !== 0 && !compileFailed && r.stderr.includes(exp.name) ? null : `esperava a exceção ${exp.name}; código ${r.code}\n${r.stderr}`;
  }
  if (r.code !== 0) return `terminou com código ${r.code}\n${r.stderr}`;
  return r.stdout === exp.output ? null : `saída diferente.\nEsperado:\n${exp.output}\nObtido:\n${r.stdout}`;
}

const major = javaMajor();
if (major < 21) {
  console.error(`É preciso o JDK 21 ou superior (encontrado: ${major || 'nenhum'}). Defina JAVA_HOME apontando para o JDK 21.`);
  process.exit(2);
}
const files = listJavaFiles(ROOT);
let failures = 0;
for (const file of files) {
  const name = relative(ROOT, file).replaceAll('\\', '/');
  let problem;
  try {
    problem = check(file);
  } catch (e) {
    problem = e.message;
  }
  if (problem) {
    failures += 1;
    console.log(`✗ ${name}\n  ${problem.replace(/\n/g, '\n  ')}`);
  } else {
    console.log(`✓ ${name}`);
  }
}
console.log(`\n${files.length - failures}/${files.length} trechos conferidos.`);
process.exit(failures ? 1 : 0);
```

- [ ] **Step 5: Rodar o teste do formato**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Escrever os trechos de conferência**

Cada arquivo abaixo fica em `verify/java/fundamentos/`. O nome da classe não precisa bater com o nome do arquivo no modo de arquivo único.

`q01-divisao-inteira.java`:
```java
// verifica: java.fundamentos.q01, f04 e a aula operadores
// saida:
// 3
// 0
// 3.5
class Main {
    public static void main(String[] args) {
        System.out.println(7 / 2);
        System.out.println(1 / 2);
        System.out.println(7.0 / 2);
    }
}
```

`q04-cast-trunca.java`:
```java
// verifica: java.fundamentos.q04 e a aula conversoes (cast trunca; Math.round arredonda)
// saida:
// 9
// 10
class Main {
    public static void main(String[] args) {
        double x = 9.99;
        int n = (int) x;
        System.out.println(n);
        System.out.println(Math.round(9.99));
    }
}
```

`q05-parse.java`:
```java
// verifica: java.fundamentos.q05 (parseInt e valueOf funcionam) e a aula conversoes
// saida:
// 42
// 42
// 7.5
// 42
// 42
class Main {
    public static void main(String[] args) {
        int a = Integer.parseInt("42");
        int b = Integer.valueOf("42");
        System.out.println(a);
        System.out.println(b);
        System.out.println(Double.parseDouble("7.5"));
        System.out.println(String.valueOf(42));
        System.out.println("" + 42);
    }
}
```

`q06-incremento.java`:
```java
// verifica: java.fundamentos.q06, f05 e a aula operadores
// saida:
// 12
// 5
// 7
class Main {
    public static void main(String[] args) {
        int i = 5;
        System.out.println(i++ + ++i);
        int j = 5;
        System.out.println(j++);
        System.out.println(++j);
    }
}
```

`q08-concatenacao.java`:
```java
// verifica: java.fundamentos.q08 e a aula operadores
// saida:
// 33
// 123
class Main {
    public static void main(String[] args) {
        System.out.println(1 + 2 + "3");
        System.out.println("1" + 2 + 3);
    }
}
```

`q09-fall-through.java`:
```java
// verifica: java.fundamentos.q09 e a aula condicionais
// saida:
// BC
class Main {
    public static void main(String[] args) {
        int x = 2;
        switch (x) {
            case 1: System.out.print("A");
            case 2: System.out.print("B");
            case 3: System.out.print("C");
                break;
            default: System.out.print("D");
        }
        System.out.println();
    }
}
```

`q10-break.java`:
```java
// verifica: java.fundamentos.q10 (com break, a saída é B!)
// saida:
// B!
class Main {
    public static void main(String[] args) {
        int x = 2;
        switch (x) {
            case 1: System.out.print("A"); break;
            case 2: System.out.print("B"); break;
            case 3: System.out.print("C"); break;
        }
        System.out.println("!");
    }
}
```

`q11-soma.java`:
```java
// verifica: java.fundamentos.q11 (ordem correta imprime só 6)
// saida:
// 6
class Main {
    public static void main(String[] args) {
        int soma = 0;
        for (int i = 1; i <= 3; i++) {
            soma += i;
        }
        System.out.println(soma);
    }
}
```

`q13-break-laco.java`:
```java
// verifica: java.fundamentos.q13
// saida:
// 012
class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            if (i == 3) break;
            System.out.print(i);
        }
        System.out.println();
    }
}
```

`q15-valores-padrao.java`:
```java
// verifica: java.fundamentos.q15 e a aula arrays (valores padrão)
// saida:
// 0
// false
// null
// true
class Main {
    public static void main(String[] args) {
        int[] arr = new int[5];
        System.out.println(arr[2]);
        boolean[] b = new boolean[1];
        System.out.println(b[0]);
        String[] s = new String[1];
        System.out.println(s[0]);
        char[] c = new char[1];
        System.out.println(c[0] == '\u0000');
    }
}
```

`q16-length.java`:
```java
// verifica: java.fundamentos.q16
// saida:
// 3
class Main {
    public static void main(String[] args) {
        int[] numeros = {4, 8, 15};
        System.out.println(numeros.length);
    }
}
```

`q17-arrays-utilitarios.java`:
```java
// verifica: java.fundamentos.q17, f14 e a aula arrays (sort, toString, copyOf, fill)
// saida:
// [1, 2, 3]
// [1, 2]
// [7, 7, 7]
import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        int[] valores = {3, 1, 2};
        Arrays.sort(valores);
        System.out.println(Arrays.toString(valores));
        int[] copia = Arrays.copyOf(valores, 2);
        System.out.println(Arrays.toString(copia));
        Arrays.fill(valores, 7);
        System.out.println(Arrays.toString(valores));
    }
}
```

`q18-if-else.java`:
```java
// verifica: java.fundamentos.q18 e a aula condicionais
// saida:
// A
// B
// C
class Main {
    static void classificar(int nota) {
        if (nota >= 90) {
            System.out.println("A");
        } else if (nota >= 70) {
            System.out.println("B");
        } else {
            System.out.println("C");
        }
    }

    public static void main(String[] args) {
        classificar(95);
        classificar(85);
        classificar(50);
    }
}
```

`q19-byte.java`:
```java
// verifica: java.fundamentos.q19 e a aula conversoes
// saida:
// -126
// -126
class Main {
    public static void main(String[] args) {
        System.out.println((byte) 130);
        int valor = 130;
        byte pequeno = (byte) valor;
        System.out.println(pequeno);
    }
}
```

`q20-local-sem-valor.java`:
```java
// verifica: java.fundamentos.q20, f03 e a aula variaveis-e-tipos
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
        int total;
        System.out.println(total);
    }
}
```

`aula-tipos.java`:
```java
// verifica: os exemplos da tabela de tipos (aula variaveis-e-tipos)
// saida:
// 100 2000 42 10000000000 1.5 3.14 A true
class Main {
    public static void main(String[] args) {
        byte b = 100;
        short s = 2000;
        int x = 42;
        long n = 10_000_000_000L;
        float f = 1.5f;
        double d = 3.14;
        char c = 'A';
        boolean ok = true;
        System.out.println(b + " " + s + " " + x + " " + n + " " + f + " " + d + " " + c + " " + ok);
    }
}
```

`aula-final.java`:
```java
// verifica: a aula variaveis-e-tipos (final não aceita outro valor)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
        final double PI = 3.14159;
        PI = 3;
    }
}
```

`aula-widening.java`:
```java
// verifica: a aula conversoes (widening automático)
// saida:
// 42
// 42.0
// 65
class Main {
    public static void main(String[] args) {
        int inteiro = 42;
        long grande = inteiro;
        double decimal = inteiro;
        char letra = 'A';
        int codigo = letra;
        System.out.println(grande);
        System.out.println(decimal);
        System.out.println(codigo);
    }
}
```

`aula-parse-invalido.java`:
```java
// verifica: a aula conversoes e f08 (texto inválido)
// espera: excecao NumberFormatException
class Main {
    public static void main(String[] args) {
        Integer.parseInt("abc");
    }
}
```

`aula-boxing.java`:
```java
// verifica: a aula conversoes (autoboxing e unboxing)
// saida:
// 10
class Main {
    public static void main(String[] args) {
        Integer caixa = 10;
        int solto = caixa;
        System.out.println(solto);
    }
}
```

`aula-composta.java`:
```java
// verifica: a aula operadores (atribuição composta já faz o cast)
// saida:
// 12
class Main {
    public static void main(String[] args) {
        int x = 10;
        x += 2.5;
        System.out.println(x);
    }
}
```

`aula-composta-erro.java`:
```java
// verifica: a aula operadores (x = x + 2.5 não compila com int)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
        int x = 10;
        x = x + 2.5;
    }
}
```

`aula-curto-circuito.java`:
```java
// verifica: a aula operadores e q07 (com && o lado direito não roda)
// saida:
// seguro
class Main {
    public static void main(String[] args) {
        String nome = null;
        if (nome != null && nome.length() > 3) {
            System.out.println("Nome longo");
        }
        System.out.println("seguro");
    }
}
```

`aula-sem-curto-circuito.java`:
```java
// verifica: a aula operadores (com & o lado direito roda e estoura)
// espera: excecao NullPointerException
class Main {
    public static void main(String[] args) {
        String nome = null;
        if (nome != null & nome.length() > 3) {
            System.out.println("Nome longo");
        }
    }
}
```

`aula-switch-seta.java`:
```java
// verifica: a aula condicionais e f10 (switch com seta produz valor)
// saida:
// Domingo
class Main {
    public static void main(String[] args) {
        int dia = 1;
        String nome = switch (dia) {
            case 1 -> "Domingo";
            case 7 -> "Sábado";
            default -> "Dia útil";
        };
        System.out.println(nome);
    }
}
```

`aula-switch-long.java`:
```java
// verifica: a aula condicionais (switch não aceita long)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
        long codigo = 1L;
        switch (codigo) {
            case 1: System.out.println("um"); break;
        }
    }
}
```

`aula-do-while.java`:
```java
// verifica: a aula lacos (do-while roda pelo menos uma vez)
// saida:
// Rodou uma vez
class Main {
    public static void main(String[] args) {
        int n = 10;
        do {
            System.out.println("Rodou uma vez");
        } while (n < 5);
    }
}
```

`aula-continue-break.java`:
```java
// verifica: a aula lacos e f12 (continue pula, break para)
// saida:
// 02
class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            if (i == 1) continue;
            if (i == 3) break;
            System.out.print(i);
        }
        System.out.println();
    }
}
```

`aula-indice-invalido.java`:
```java
// verifica: a aula arrays e q14 (índice 5 num array de tamanho 5)
// espera: excecao ArrayIndexOutOfBoundsException
class Main {
    public static void main(String[] args) {
        int[] numeros = new int[5];
        System.out.println(numeros[5]);
    }
}
```

`aula-matriz-e-impressao.java`:
```java
// verifica: a aula arrays (matriz e impressão direta do array)
// saida:
// 3
// true
class Main {
    public static void main(String[] args) {
        int[][] matriz = {
            {1, 2},
            {3, 4}
        };
        System.out.println(matriz[1][0]);
        int[] valores = {1, 2, 3};
        System.out.println(String.valueOf(valores).startsWith("[I@"));
    }
}
```

- [ ] **Step 7: Rodar a conferência com o JDK 21**

Run (PowerShell):
```powershell
$env:JAVA_HOME = (Get-ChildItem "$env:USERPROFILE\tools" -Directory -Filter 'jdk-21*' | Select-Object -First 1).FullName
node tools/verify-java.mjs
```
Expected: `30/30 trechos conferidos.` e código de saída 0. **Se algum trecho falhar, o erro está no conteúdo ou no trecho:** descubra qual dos dois diverge da realidade, corrija a aula, a pergunta ou a carta correspondente (e o trecho, se for o caso) e rode de novo até tudo passar. Nunca ajuste a saída esperada só para o teste passar sem entender a diferença.

- [ ] **Step 8: Commit**

```bash
git add tools verify tests/tools/verify-format.test.js
git commit -m "Adiciona conferência dos trechos Java com o JDK 21" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Casca HTML e estilos

**Files:**
- Create: `index.html`, `css/tokens.css`, `css/base.css`, `css/components.css`

**Interfaces:**
- Produces: os elementos fixos que `js/ui/layout.js` e `js/main.js` usam: `#topbar`, `#sidebar`, `#banners`, `#main`, `#tabbar`, `#toasts`, `#sr-live`, `.skip-link`. As classes CSS usadas por todas as telas (lista completa nos arquivos abaixo).
- Escala do calendário de atividade (`--hm-1` a `--hm-4`): azul sequencial `#184f95`, `#256abf`, `#3987e5`, `#86b6ef`, validada com o script do skill dataviz contra o fundo `#161b22` (todas as verificações passaram). O nível 0 usa `--sf2`.

- [ ] **Step 1: Conferir que as URLs de CDN existem**

Run:
```bash
curl -s -o /dev/null -w "%{http_code}\n" https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.esm.js
curl -s -o /dev/null -w "%{http_code}\n" https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/es/highlight.min.js
curl -s -o /dev/null -w "%{http_code}\n" https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/styles/github-dark.min.css
```
Expected: `200` nas três. Se alguma não responder 200, procure a versão publicada mais próxima no jsDelivr, ajuste a URL em `js/config.js` e no `index.html`, e registre a troca na mensagem de commit.

- [ ] **Step 2: Escrever o HTML**

`index.html`:
```html
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Central de Linguagens</title>
  <meta name="description" content="Central gratuita para aprender programação com aulas curtas, quizzes e flashcards.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💻</text></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.9.0/styles/github-dark.min.css">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <script type="module" src="js/main.js"></script>
</head>
<body>
  <button type="button" class="skip-link">Pular para o conteúdo</button>
  <header id="topbar" class="topbar"></header>
  <div class="shell">
    <nav id="sidebar" class="sidebar" aria-label="Navegação principal"></nav>
    <div class="content">
      <div id="banners" class="banners"></div>
      <main id="main" tabindex="-1"></main>
    </div>
  </div>
  <nav id="tabbar" class="tabbar" aria-label="Navegação"></nav>
  <div id="toasts" class="toasts" aria-live="polite"></div>
  <div id="sr-live" class="sr-only" aria-live="assertive"></div>
  <noscript><p style="padding:24px">Esta página precisa de JavaScript ativado.</p></noscript>
</body>
</html>
```

- [ ] **Step 3: Escrever os estilos**

`css/tokens.css`:
```css
:root {
  color-scheme: dark;
  --bg: #0d1117;
  --sf: #161b22;
  --sf2: #21262d;
  --sf3: #2d333b;
  --bd: #30363d;
  --bd2: #444c56;
  --tx: #e6edf3;
  --mt: #8b949e;
  --mt2: #6e7681;
  --accent: #f89820;
  --orange: #f89820;
  --blue: #5b9bd5;
  --green: #3fb950;
  --yellow: #d29922;
  --red: #f85149;
  --purple: #bc8cff;
  --cyan: #79c0ff;
  --hm-0: #21262d;
  --hm-1: #184f95;
  --hm-2: #256abf;
  --hm-3: #3987e5;
  --hm-4: #86b6ef;
  --radius: 12px;
  --radius-sm: 8px;
  --font: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;
  --topbar-h: 60px;
  --sidebar-w: 220px;
}
```

`css/base.css`:
```css
*, *::before, *::after { box-sizing: border-box; }
[hidden] { display: none !important; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; min-height: 100vh; font-family: var(--font); font-size: 15px; line-height: 1.6; background: var(--bg); color: var(--tx); }
a { color: var(--cyan); }
h1, h2, h3 { line-height: 1.25; margin: 0 0 .5em; }
h1 { font-size: 1.75rem; font-weight: 900; }
h2 { font-size: 1.25rem; margin-top: 1.5em; }
p { margin: 0 0 .75em; }
:focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.skip-link { position: absolute; left: 8px; top: -60px; z-index: 1000; padding: 8px 12px; background: var(--sf2); color: var(--tx); border: 1px solid var(--bd); border-radius: var(--radius-sm); font: inherit; }
.skip-link:focus { top: 8px; }
.muted { color: var(--mt); }
.small { font-size: .85rem; }
.center { text-align: center; }
.eyebrow { font-size: .72rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin: 0 0 .25em; }
.loading { color: var(--mt); padding: 40px 0; text-align: center; }

.topbar { position: sticky; top: 0; z-index: 100; height: var(--topbar-h); display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0 20px; background: rgba(13, 17, 23, .95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--bd); }
.shell { display: grid; grid-template-columns: var(--sidebar-w) minmax(0, 1fr); gap: 28px; max-width: 1200px; margin: 0 auto; padding: 24px 20px 80px; }
.sidebar { position: sticky; top: calc(var(--topbar-h) + 24px); align-self: start; display: flex; flex-direction: column; gap: 2px; }
.content { min-width: 0; }
main { outline: none; }
.tabbar { display: none; }

@media (max-width: 800px) {
  .shell { grid-template-columns: minmax(0, 1fr); padding: 16px 16px 96px; }
  .sidebar { display: none; }
  .tabbar { display: flex; justify-content: space-around; position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: rgba(13, 17, 23, .97); border-top: 1px solid var(--bd); padding: 6px 4px calc(6px + env(safe-area-inset-bottom)); }
  .topbar { padding: 0 16px; }
  .brand-name { display: none; }
  h1 { font-size: 1.45rem; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}

@media print {
  body { background: #fff; color: #000; }
  .topbar, .sidebar, .tabbar, .banners, .toasts, .no-print, .skip-link { display: none !important; }
  .shell { display: block; max-width: none; padding: 0; }
}
```

`css/components.css`:
```css
/* Botões e controles */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-height: 40px; padding: 8px 16px; border-radius: var(--radius-sm); border: 1px solid var(--bd); background: var(--sf2); color: var(--tx); font: inherit; font-size: .9rem; font-weight: 600; text-decoration: none; cursor: pointer; transition: border-color .15s, background .15s; }
.btn:hover:not(:disabled) { border-color: var(--accent); }
.btn:disabled { opacity: .5; cursor: not-allowed; }
.btn-primary { background: var(--accent); border-color: var(--accent); color: #0d1117; }
.btn-primary:hover:not(:disabled) { filter: brightness(1.1); }
.btn-ghost { background: transparent; }
.btn-danger { background: transparent; border-color: var(--red); color: var(--red); }
.btn-sm { min-height: 32px; padding: 4px 12px; font-size: .8rem; }
.link { color: var(--cyan); font-weight: 600; }
.link-btn { background: none; border: none; padding: 0; color: var(--cyan); font: inherit; text-decoration: underline; cursor: pointer; }
.chip { border: 1px solid var(--bd); background: var(--sf2); color: var(--mt); border-radius: 999px; padding: 4px 12px; font: inherit; font-size: .8rem; cursor: pointer; }
.chip:hover { color: var(--tx); border-color: var(--purple); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 16px 0; }
.icon-btn { width: 32px; height: 32px; border-radius: var(--radius-sm); border: 1px solid var(--bd); background: var(--sf2); color: var(--tx); font: inherit; cursor: pointer; }
.icon-btn:disabled { opacity: .35; cursor: default; }
input[type="text"] { width: 100%; padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--bd); background: var(--bg); color: var(--tx); font: inherit; }
.field-label { display: block; font-weight: 600; margin: 14px 0 6px; }
.field-error { color: var(--red); font-size: .85rem; min-height: 1.2em; margin: 4px 0 0; }
.check { display: inline-flex; align-items: center; gap: 6px; margin: 4px 14px 4px 0; cursor: pointer; }
.check.strong { font-weight: 700; }

/* Painéis, grades e números */
.panel { background: var(--sf); border: 1px solid var(--bd); border-radius: var(--radius); padding: 18px; margin-bottom: 14px; }
.panel-error { border-color: rgba(248, 81, 73, .5); }
.grid { display: grid; gap: 12px; margin-bottom: 14px; }
.grid.stats { grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); }
.grid.langs { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.grid.achievements { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
.stat { display: flex; flex-direction: column; gap: 4px; margin: 0; }
.stat-label { font-size: .72rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--mt); }
.stat-value { font-size: 1.35rem; }
.badge { display: inline-flex; align-items: center; gap: 4px; padding: 2px 10px; border-radius: 999px; border: 1px solid var(--bd); font-size: .75rem; font-weight: 600; color: var(--mt); white-space: nowrap; }
.badge.success { color: var(--green); border-color: rgba(63, 185, 80, .4); background: rgba(63, 185, 80, .08); }
.badge.warning { color: var(--yellow); border-color: rgba(210, 153, 34, .4); background: rgba(210, 153, 34, .08); }
.badge.danger { color: var(--red); border-color: rgba(248, 81, 73, .4); background: rgba(248, 81, 73, .08); }
.bar { height: 6px; margin: 6px 0; background: var(--sf2); border-radius: 999px; overflow: hidden; }
.bar-fill { height: 100%; background: var(--accent); border-radius: 999px; transition: width .4s; }
.bar-fill.tone-success { background: var(--green); }
.bar-fill.tone-warning { background: var(--yellow); }
.bar-fill.tone-danger { background: var(--red); }
.big-emoji { font-size: 3rem; }

/* Topo e navegação */
.brand { display: flex; align-items: center; gap: 10px; color: var(--tx); text-decoration: none; font-weight: 700; }
.brand-icon { width: 32px; height: 32px; display: grid; place-items: center; border-radius: 8px; background: var(--accent); color: #0d1117; font-family: var(--mono); font-size: .8rem; font-weight: 700; }
.topbar-stats { display: flex; align-items: center; gap: 10px; }
.pill { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border: 1px solid var(--bd); background: var(--sf2); border-radius: 999px; font-size: .8rem; }
.avatar { font-size: 1.4rem; text-decoration: none; }
.goal { display: flex; align-items: center; gap: 6px; font-size: .8rem; color: var(--mt); }
.goal strong { color: var(--tx); }
.ring-bg { fill: none; stroke: var(--sf3); stroke-width: 4; }
.ring-fg { fill: none; stroke: var(--green); stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset .4s; }
.nav-link { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--radius-sm); border: 1px solid transparent; color: var(--mt); text-decoration: none; font-size: .9rem; }
.nav-link:hover { color: var(--tx); background: var(--sf); }
.nav-link.active { color: var(--tx); background: var(--sf2); border-color: var(--bd); }
.nav-badge { margin-left: auto; padding: 0 8px; border-radius: 999px; background: rgba(188, 140, 255, .15); color: var(--purple); font-size: .75rem; font-weight: 700; }
.nav-section { margin: 18px 0 4px 10px; font-size: .7rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--mt2); }
.tabbar .nav-link { position: relative; flex-direction: column; gap: 0; padding: 4px 8px; font-size: .7rem; }
.tabbar .nav-icon { font-size: 1.2rem; }
.tabbar .nav-badge { position: absolute; top: 0; right: 0; margin: 0; }
@media (max-width: 800px) { .topbar-stats .pill-level { display: none; } }

/* Avisos */
.banners:empty { display: none; }
.banner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; padding: 10px 14px; border: 1px solid var(--bd); border-radius: var(--radius-sm); background: var(--sf); font-size: .9rem; }
.banner-warning { border-color: rgba(210, 153, 34, .5); }
.banner-danger { border-color: rgba(248, 81, 73, .6); }
.banner-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.toasts { position: fixed; right: 16px; bottom: 16px; z-index: 300; display: flex; flex-direction: column; gap: 8px; max-width: min(380px, calc(100vw - 32px)); }
.toast { padding: 10px 14px; border: 1px solid var(--bd); border-radius: var(--radius-sm); background: var(--sf2); box-shadow: 0 8px 24px rgba(0, 0, 0, .4); font-size: .9rem; animation: toast-in .2s ease; }
.toast-success { border-color: rgba(63, 185, 80, .5); }
.toast-danger { border-color: rgba(248, 81, 73, .6); }
.toast.leaving { opacity: 0; transition: opacity .3s; }
@keyframes toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@media (max-width: 800px) { .toasts { left: 16px; right: 16px; bottom: 84px; max-width: none; } }

/* Markdown e quadros de destaque */
.md { line-height: 1.7; }
.md h1 { margin-top: 0; }
.md code { font-family: var(--mono); font-size: .85em; background: rgba(255, 255, 255, .07); padding: 1px 5px; border-radius: 4px; }
.md pre { position: relative; overflow-x: auto; padding: 14px 16px; background: var(--bg); border: 1px solid var(--bd); border-radius: var(--radius-sm); }
.md pre code { padding: 0; background: none; font-size: .85rem; line-height: 1.65; }
.md table { display: block; overflow-x: auto; width: 100%; margin: 12px 0; border-collapse: collapse; font-size: .88rem; }
.md th, .md td { padding: 6px 10px; border: 1px solid var(--bd); text-align: left; vertical-align: top; }
.md th { background: var(--sf2); color: var(--mt); font-size: .75rem; letter-spacing: .05em; text-transform: uppercase; }
.copy-btn { position: absolute; top: 6px; right: 6px; padding: 2px 8px; border: 1px solid var(--bd); border-radius: 4px; background: var(--sf2); color: var(--mt); font: inherit; font-size: .7rem; cursor: pointer; }
.callout { margin: 12px 0; padding: 10px 14px; border-left: 3px solid var(--blue); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; background: rgba(91, 155, 213, .07); }
.callout p:last-child { margin-bottom: 0; }
.callout-title { display: block; margin-bottom: 4px; font-size: .72rem; letter-spacing: .06em; text-transform: uppercase; color: var(--blue); }
.callout-tip { border-color: var(--green); background: rgba(63, 185, 80, .07); }
.callout-tip .callout-title { color: var(--green); }
.callout-important { border-color: var(--purple); background: rgba(188, 140, 255, .07); }
.callout-important .callout-title { color: var(--purple); }
.callout-warning { border-color: var(--orange); background: rgba(248, 152, 32, .07); }
.callout-warning .callout-title { color: var(--orange); }
.callout-caution { border-color: var(--red); background: rgba(248, 81, 73, .07); }
.callout-caution .callout-title { color: var(--red); }

/* Início, linguagem e aula */
.hero h1 { font-size: 1.9rem; }
.continue { display: flex; flex-direction: column; gap: 4px; color: var(--tx); text-decoration: none; border-color: var(--bd2); }
.continue:hover, .lang-card:hover { border-color: var(--accent); }
.lang-card { display: flex; flex-direction: column; gap: 4px; margin: 0; color: var(--tx); text-decoration: none; border-top: 3px solid var(--accent); }
.lang-icon { font-size: 1.8rem; }
.lang-hero { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.lang-hero > div:last-child { flex: 1; }
.lang-hero .lang-icon { font-size: 2.6rem; }
.lang-links { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 18px; }
.module-card.done { border-color: rgba(63, 185, 80, .4); }
.module-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.module-head h2 { margin: 0 0 4px; }
.lesson-list { display: flex; flex-direction: column; gap: 2px; margin: 12px 0; padding: 0; list-style: none; }
.lesson-list a { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: var(--radius-sm); color: var(--tx); text-decoration: none; }
.lesson-list a:hover { background: var(--sf2); }
.lesson-list .muted { margin-left: auto; }
.lesson-check { width: 20px; text-align: center; color: var(--mt); }
.lesson-list li.done .lesson-check { color: var(--green); }
.breadcrumb { margin-bottom: 8px; font-size: .85rem; color: var(--mt); }
.breadcrumb a { color: var(--mt); }
.lesson { max-width: 780px; }
.lesson-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-top: 28px; padding-top: 18px; border-top: 1px solid var(--bd); }
.weak-list { display: flex; flex-direction: column; gap: 8px; margin: 0; padding: 0; list-style: none; }
.weak-list li { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.weak-list li > span:first-child { flex: 1; min-width: 180px; }

/* Quiz */
.quiz-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.quiz-title { margin: 0; font-size: 1.3rem; }
.timer { padding: 4px 10px; border: 1px solid var(--bd); border-radius: 999px; color: var(--mt); font-family: var(--mono); }
.q-type { margin-bottom: 6px; font-size: .72rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--purple); }
.opts { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.opts-row { flex-direction: row; }
.opts-row .opt { flex: 1; justify-content: center; }
.opt { display: flex; align-items: center; gap: 10px; width: 100%; min-height: 44px; padding: 10px 14px; border: 1px solid var(--bd); border-radius: var(--radius-sm); background: var(--sf2); color: var(--tx); font: inherit; text-align: left; cursor: pointer; }
.opt:hover:not(:disabled) { border-color: var(--blue); }
.opt:disabled { cursor: default; }
.opt code { font-family: var(--mono); font-size: .85em; }
.opt-letter { flex-shrink: 0; width: 24px; height: 24px; display: grid; place-items: center; border-radius: 50%; background: var(--sf3); font-size: .75rem; font-weight: 700; }
.opt.chosen { border-color: var(--bd2); }
.opt.ok { border-color: var(--green); background: rgba(63, 185, 80, .1); }
.opt.err { border-color: var(--red); background: rgba(248, 81, 73, .1); }
.fill-form { display: flex; flex-direction: column; align-items: flex-start; gap: 12px; margin-top: 12px; }
.fill-code { width: 100%; margin: 0; overflow-x: auto; padding: 14px; border: 1px solid var(--bd); border-radius: var(--radius-sm); background: var(--bg); font-family: var(--mono); font-size: .9rem; white-space: pre; }
.fill-code input.blank { width: 10ch; padding: 2px 6px; border: 1px dashed var(--bd2); border-radius: 4px; background: var(--sf2); color: var(--tx); font: inherit; }
.fill-code input.blank.ok { border: 1px solid var(--green); }
.fill-code input.blank.err { border: 1px solid var(--red); }
.fill-answer code { font-family: var(--mono); }
.order-list { display: flex; flex-direction: column; gap: 6px; margin: 12px 0; padding: 0; list-style: none; }
.order-item { display: flex; align-items: center; gap: 8px; }
.order-item.dragging { opacity: .5; }
.order-line { flex: 1; overflow-x: auto; padding: 8px 12px; border: 1px solid var(--bd); border-radius: var(--radius-sm); background: var(--bg); color: var(--tx); font: inherit; text-align: left; cursor: pointer; }
.order-line code { font-family: var(--mono); font-size: .85rem; white-space: pre; }
.order-item.selected .order-line { border-color: var(--purple); background: rgba(188, 140, 255, .08); }
.order-moves { display: flex; gap: 4px; }
.feedback { margin-top: 14px; }
.feedback.ok, .feedback.err { padding: 12px 14px; border-radius: var(--radius-sm); }
.feedback.ok { background: rgba(63, 185, 80, .08); border: 1px solid rgba(63, 185, 80, .3); }
.feedback.err { background: rgba(248, 81, 73, .08); border: 1px solid rgba(248, 81, 73, .3); }
.quiz-nav { display: flex; justify-content: flex-end; margin-top: 14px; }
.big-score { font-size: 3rem; font-weight: 900; color: var(--accent); }
.headline { font-weight: 700; }
.module-bar { margin-bottom: 10px; }
.module-bar-label { display: flex; justify-content: space-between; gap: 10px; font-size: .9rem; }
.review-answer { margin: 6px 0; }
.field { margin: 0 0 12px; padding: 12px 16px; border: 1px solid var(--bd); border-radius: var(--radius); background: var(--sf); }
.field legend { padding: 0 6px; font-weight: 700; }
.radio-group { display: flex; flex-wrap: wrap; }
.scope-lang { margin-bottom: 8px; }
.scope-mods { display: flex; flex-wrap: wrap; padding-left: 24px; }

/* Flashcards */
.fc-session { max-width: 600px; margin: 0 auto; }
.flashcard { display: block; width: 100%; height: 320px; margin: 12px 0; border-radius: 16px; perspective: 1400px; cursor: pointer; }
.flashcard-inner { position: relative; width: 100%; height: 100%; transform-style: preserve-3d; transition: transform .55s cubic-bezier(.4, .2, .2, 1); }
.flashcard.flipped .flashcard-inner { transform: rotateY(180deg); }
.flashcard-face { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: auto; padding: 28px; border: 1px solid var(--bd); border-radius: 16px; text-align: center; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
.flashcard-face.front { background: linear-gradient(135deg, var(--sf), var(--sf2)); font-size: 1.1rem; font-weight: 600; }
.flashcard-face.back { background: linear-gradient(135deg, rgba(248, 152, 32, .08), rgba(91, 155, 213, .08)), var(--sf); transform: rotateY(180deg); }
.fc-tag { margin-bottom: 12px; font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--purple); }
.fc-level { position: absolute; top: 12px; right: 14px; font-size: .7rem; color: var(--mt2); }
.fc-hint { position: absolute; bottom: 12px; left: 0; right: 0; font-size: .7rem; font-weight: 400; letter-spacing: .06em; text-transform: uppercase; color: var(--mt2); }
.rate { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.rate-btn { padding: 12px 8px; border: 1px solid var(--bd); border-radius: var(--radius-sm); background: var(--sf2); color: var(--tx); font: inherit; font-weight: 700; cursor: pointer; }
.rate-btn small { display: block; font-size: .7rem; font-weight: 400; opacity: .75; }
.rate-btn.bad { border-color: rgba(248, 81, 73, .5); }
.rate-btn.mid { border-color: rgba(210, 153, 34, .5); }
.rate-btn.good { border-color: rgba(63, 185, 80, .5); }

/* Perfil */
.profile-head { display: flex; align-items: center; gap: 18px; }
.profile-head > div:last-child { flex: 1; }
.avatar-big { font-size: 3.2rem; }
.heatmap { display: grid; grid-template-rows: repeat(7, 14px); grid-auto-flow: column; grid-auto-columns: 14px; gap: 3px; overflow-x: auto; padding-bottom: 4px; }
.hm-cell { display: inline-block; width: 14px; height: 14px; border-radius: 3px; background: var(--hm-0); }
.hm-1 { background: var(--hm-1); }
.hm-2 { background: var(--hm-2); }
.hm-3 { background: var(--hm-3); }
.hm-4 { background: var(--hm-4); }
.hm-legend { display: flex; align-items: center; gap: 3px; margin-top: 8px; }
.achievement { display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid var(--bd); border-radius: var(--radius-sm); background: var(--sf); }
.achievement.locked { opacity: .55; filter: grayscale(1); }
.achievement p { margin: 2px 0 0; }
.ach-icon { font-size: 1.6rem; }
.history { margin: 0; padding: 0; list-style: none; }
.history-item { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px; padding: 12px 16px; }
.history-item > div { flex: 1; min-width: 200px; }
.history-item p { margin: 0; }

/* Primeira visita e configurações */
.onboarding { max-width: 560px; margin: 24px auto; }
.avatar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(48px, 1fr)); gap: 8px; }
.avatar-opt { height: 48px; border: 1px solid var(--bd); border-radius: var(--radius-sm); background: var(--sf2); font-size: 1.5rem; cursor: pointer; }
.goal-options { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.goal-opt { display: flex; flex-direction: column; padding: 10px; border: 1px solid var(--bd); border-radius: var(--radius-sm); background: var(--sf2); color: var(--tx); font: inherit; cursor: pointer; }
.goal-opt small { color: var(--mt); }
.avatar-opt.selected, .goal-opt.selected { border-color: var(--accent); background: rgba(248, 152, 32, .12); }
.danger-zone { border-color: rgba(248, 81, 73, .4); }
.exam-intro ul { padding-left: 20px; }

/* Certificado */
.cert-actions { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 16px; }
.certificate { max-width: 820px; margin: 0 auto; padding: 48px 40px; border: 6px double var(--accent); border-radius: 6px; background: #fdfcf8; color: #1b1f24; text-align: center; }
.certificate h1 { color: #1b1f24; font-size: 2.2rem; letter-spacing: .04em; }
.cert-brand { color: #6b5b3e; font-size: .8rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; }
.cert-lead { font-size: 1.05rem; }
.cert-name { display: inline-block; margin: 8px 0 16px; padding: 0 24px 6px; border-bottom: 1px solid #c9c3b4; font-size: 2rem; font-weight: 900; }
.cert-modules .eyebrow { color: #6b5b3e; }
.cert-modules ul { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px 14px; padding: 0; list-style: none; }
.cert-code { color: #555; font-family: var(--mono); font-size: .85rem; }
.cert-foot { margin-top: 24px; color: #666; font-size: .8rem; }
@media (max-width: 600px) { .certificate { padding: 28px 18px; } .cert-name { font-size: 1.5rem; } }
@media print {
  .certificate { max-width: none; }
  @page { size: A4 landscape; margin: 12mm; }
}
```

- [ ] **Step 4: Conferir que a página abre**

Run (em outro terminal, na raiz do projeto): `python -m http.server 8000`
Abra `http://localhost:8000/` e confira que a página carrega sem erros 404 no DevTools (aba Rede). Ainda não há JavaScript da interface; a tela fica vazia, com o fundo escuro. O erro de módulo `js/main.js` não encontrado é esperado até a Tarefa 15.

- [ ] **Step 5: Commit**

```bash
git add index.html css
git commit -m "Adiciona casca HTML e estilos do tema escuro" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Camada de dados (conteúdo, armazenamento e backup)

**Files:**
- Create: `js/data/content.js`, `js/data/storage.js`, `js/data/idb.js`, `js/data/backup.js`

**Interfaces:**
- Consumes: `migrate` (state.js); `makeEnvelope`, `parseEnvelope`, `backupFileName` (backup-format.js); `toDayKey` (dates.js); constantes de `config.js`.
- Produces:
  - content.js: `loadLanguages() → Language[]` (cada módulo ganha `key = '<lang>.<modulo>'`; cada linguagem mantém `dir`), `loadModuleBank(language, module) → { questions, cards }` (cada item ganha `lang` e `module`), `loadBanks(languages, moduleKeys?) → { questions, cards }`, `loadLesson(language, module, lesson) → string`, `loadReference(language) → string`, `loadAchievementTexts() → { id, name, description, hint, icon }[]`.
  - storage.js: `createStorage({ onExternalChange, onSaveError }) → { available, load(), save(state), flush(), disable(), keepCorrupt(raw), getItem(key), setItem(key, value) → boolean, removeItem(key) }`. `load()` devolve `{ status: 'ok', state } | { status: 'empty' } | { status: 'corrupt', raw } | { status: 'newer', raw } | { status: 'unavailable' }`.
  - idb.js: `idbGet(key)`, `idbSet(key, value)`, `idbDelete(key)`.
  - backup.js: `exportBackup(state) → 'shared'|'downloaded'|'cancelled'`, `readBackupFile(file) → resultado de parseEnvelope`, `createAutoBackup({ onWrite(isoString), onError(message) }) → { supported, status(), init(), enable(state), reconnect(state), disable(), schedule(state) }`; `status()` devolve `'unsupported' | 'off' | 'needs-permission' | 'on'`.

- [ ] **Step 1: Escrever os quatro módulos**

`js/data/content.js`:
```js
// Carrega o conteúdo sob demanda e guarda em memória. "no-cache" revalida no servidor a cada visita.
const cache = new Map();

function get(path, as) {
  const key = `${as}:${path}`;
  if (!cache.has(key)) {
    const promise = fetch(path, { cache: 'no-cache' }).then((res) => {
      if (!res.ok) throw new Error(`Não foi possível carregar ${path} (HTTP ${res.status})`);
      return as === 'json' ? res.json() : res.text();
    });
    cache.set(key, promise);
    promise.catch(() => cache.delete(key));
  }
  return cache.get(key);
}

export async function loadLanguages() {
  const catalog = await get('content/catalog.json', 'json');
  return Promise.all(catalog.languages.map(async ({ id, dir }) => {
    const lang = await get(`content/${dir}/language.json`, 'json');
    return { ...lang, id, dir, modules: lang.modules.map((m) => ({ ...m, key: `${id}.${m.id}` })) };
  }));
}

export async function loadModuleBank(language, module) {
  const base = `content/${language.dir}/${module.dir}`;
  const [q, c] = await Promise.all([get(`${base}/questions.json`, 'json'), get(`${base}/flashcards.json`, 'json')]);
  const tag = (item) => ({ ...item, lang: language.id, module: module.key });
  return { questions: q.questions.map(tag), cards: c.cards.map(tag) };
}

export async function loadBanks(languages, moduleKeys = null) {
  const wanted = moduleKeys ? new Set(moduleKeys) : null;
  const jobs = [];
  for (const language of languages) {
    for (const module of language.modules) {
      if (!wanted || wanted.has(module.key)) jobs.push(loadModuleBank(language, module));
    }
  }
  const banks = await Promise.all(jobs);
  return { questions: banks.flatMap((b) => b.questions), cards: banks.flatMap((b) => b.cards) };
}

export const loadLesson = (language, module, lesson) => get(`content/${language.dir}/${module.dir}/${lesson.file}`, 'text');
export const loadReference = (language) => get(`content/${language.dir}/${language.reference}`, 'text');
export const loadAchievementTexts = () => get('content/achievements.json', 'json');
```

`js/data/storage.js`:
```js
import { migrate } from '../core/state.js';
import { STORAGE_KEY, CORRUPT_KEY_PREFIX, SAVE_DEBOUNCE_MS } from '../config.js';

export function createStorage({ onExternalChange, onSaveError } = {}) {
  let available = true;
  try {
    const probe = `${STORAGE_KEY}:probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
  } catch {
    available = false;
  }
  let pending = null;
  let timer = null;

  function writeNow() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!pending || !available) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
      pending = null;
    } catch (err) {
      available = false;
      onSaveError?.(err);
    }
  }

  if (available) {
    window.addEventListener('pagehide', writeNow);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') writeNow();
    });
    window.addEventListener('storage', (event) => {
      if (event.key !== STORAGE_KEY || event.newValue === null) return;
      try {
        const result = migrate(JSON.parse(event.newValue));
        if (result.ok) onExternalChange?.(result.state);
      } catch {
        // outra aba gravou algo ilegível: ignoramos e seguimos com o estado atual
      }
    });
  }

  return {
    get available() { return available; },
    load() {
      if (!available) return { status: 'unavailable' };
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return { status: 'empty' };
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return { status: 'corrupt', raw };
      }
      const result = migrate(parsed);
      if (result.ok) return { status: 'ok', state: result.state };
      return result.reason === 'newer' ? { status: 'newer', raw } : { status: 'corrupt', raw };
    },
    save(state) {
      pending = state;
      if (timer) clearTimeout(timer);
      timer = setTimeout(writeNow, SAVE_DEBOUNCE_MS);
    },
    flush: writeNow,
    disable() {
      available = false;
      pending = null;
    },
    keepCorrupt(raw) {
      const key = `${CORRUPT_KEY_PREFIX}${new Date().toISOString()}`;
      try { localStorage.setItem(key, raw); } catch { /* sem espaço: não há o que fazer */ }
      return key;
    },
    getItem(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    setItem(key, value) {
      try { localStorage.setItem(key, value); return true; } catch { return false; }
    },
    removeItem(key) {
      try { localStorage.removeItem(key); } catch { /* ignora */ }
    },
  };
}
```

`js/data/idb.js`:
```js
import { IDB_NAME, IDB_STORE } from '../config.js';

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run(mode, fn) {
  const db = await open();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, mode);
      const req = fn(tx.objectStore(IDB_STORE));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export const idbGet = (key) => run('readonly', (store) => store.get(key));
export const idbSet = (key, value) => run('readwrite', (store) => store.put(value, key));
export const idbDelete = (key) => run('readwrite', (store) => store.delete(key));
```

`js/data/backup.js`:
```js
import { makeEnvelope, parseEnvelope, backupFileName } from '../core/backup-format.js';
import { toDayKey } from '../core/dates.js';
import { idbGet, idbSet, idbDelete } from './idb.js';
import { APP_NAME, AUTO_BACKUP_DEBOUNCE_MS, AUTO_BACKUP_FILE_NAME } from '../config.js';

const HANDLE_KEY = 'auto-backup-file';

const envelopeBlob = (state) => new Blob([JSON.stringify(makeEnvelope(state), null, 2)], { type: 'application/json' });

export async function exportBackup(state) {
  const name = backupFileName(state.profile?.name, toDayKey(new Date()));
  const blob = envelopeBlob(state);
  const file = new File([blob], name, { type: 'application/json' });
  const touch = window.matchMedia?.('(pointer: coarse)').matches;
  if (touch && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: `Backup — ${APP_NAME}` });
      return 'shared';
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled';
      // compartilhamento falhou: segue para o download
    }
  }
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return 'downloaded';
}

export async function readBackupFile(file) {
  return parseEnvelope(await file.text());
}

export function createAutoBackup({ onWrite, onError }) {
  const supported = typeof window.showSaveFilePicker === 'function';
  let handle = null;
  let granted = false;
  let timer = null;

  async function write(state) {
    if (!handle || !granted) return;
    try {
      const writable = await handle.createWritable();
      await writable.write(envelopeBlob(state));
      await writable.close();
      onWrite(new Date().toISOString());
    } catch (err) {
      onError(err?.message || String(err));
    }
  }

  return {
    supported,
    status() {
      if (!supported) return 'unsupported';
      if (!handle) return 'off';
      return granted ? 'on' : 'needs-permission';
    },
    async init() {
      if (!supported) return this.status();
      try {
        handle = (await idbGet(HANDLE_KEY)) ?? null;
        if (handle) granted = (await handle.queryPermission({ mode: 'readwrite' })) === 'granted';
      } catch {
        handle = null;
        granted = false;
      }
      return this.status();
    },
    async enable(state) {
      handle = await window.showSaveFilePicker({
        suggestedName: AUTO_BACKUP_FILE_NAME,
        types: [{ description: 'Backup em JSON', accept: { 'application/json': ['.json'] } }],
      });
      granted = true;
      await idbSet(HANDLE_KEY, handle);
      await write(state);
      return this.status();
    },
    async reconnect(state) {
      if (!handle) return this.status();
      granted = (await handle.requestPermission({ mode: 'readwrite' })) === 'granted';
      if (granted) await write(state);
      return this.status();
    },
    async disable() {
      if (timer) clearTimeout(timer);
      handle = null;
      granted = false;
      await idbDelete(HANDLE_KEY);
      return this.status();
    },
    schedule(state) {
      if (!handle || !granted) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        write(state);
      }, AUTO_BACKUP_DEBOUNCE_MS);
    },
  };
}
```

- [ ] **Step 2: Conferir a sintaxe**

Run: `node --check js/data/content.js && node --check js/data/storage.js && node --check js/data/idb.js && node --check js/data/backup.js && npm test`
Expected: nenhum erro de sintaxe; testes PASS. (Estes módulos usam APIs do navegador; o teste automático de importação entra na Tarefa 15 e a verificação de uso real fica no roteiro manual da Tarefa 22.)

- [ ] **Step 3: Commit**

```bash
git add js/data
git commit -m "Adiciona camada de dados: conteúdo, armazenamento e backup" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Base da interface, primeira visita e tela inicial

**Files:**
- Create: `js/ui/dom.js`, `js/ui/store.js`, `js/ui/markdown.js`, `js/ui/layout.js`, `js/ui/backup-flow.js`
- Create: `js/ui/components/common.js`, `js/ui/components/profile-fields.js`, `js/ui/components/weak-points.js`
- Create: `js/ui/views/index.js`, `js/ui/views/onboarding.js`, `js/ui/views/not-found.js`, `js/ui/views/home.js`
- Create: `js/main.js`
- Test: `tests/ui-imports.test.js`

**Interfaces:**
- Produces:
  - dom.js: `h(tag, props, ...children)` (props especiais: `class`, `text`, `html` — só para conteúdo confiável —, `style` como objeto com nomes CSS, `onX` vira `addEventListener('x')`; `true` vira atributo vazio; `null`/`false`/`undefined` são ignorados), `mount(container, ...children)`, `bar(value, { tone?, label? })`, `pct(v)`, `toneFor(rate) → 'success'|'warning'|'danger'`, `plural(n, one, many)`, `formatDay(dayKey)`, `formatDateTime(iso)`, `formatDuration(sec)`.
  - store.js: `createStore(initial) → { get(), set(state, meta?), subscribe(fn(state, meta)) }`.
  - markdown.js: `initMarkdown()`, `md(text, { lang? }) → HTMLElement`, `mdInline(text) → HTMLElement`.
  - layout.js: `createLayout(app) → { render(state, routeName), setBanner(id, { text, tone?, actions? }), clearBanner(id), toast(text, { tone?, timeout? }), announce(text) }`.
  - common.js: `errorPanel(message, onRetry)`, `statCard(label, value, extra?)`, `findModule(app, moduleKey) → { language, module } | null`, `findLesson(app, lessonKey) → { language, module, lesson } | null`.
  - profile-fields.js: `profileFields(profile?) → { el, read() → { name, avatar, dailyGoal } | null }`.
  - weak-points.js: `weakPointsSection(app, state) → Promise<HTMLElement>`.
  - backup-flow.js: `BACKUP_ERRORS`, `exportNow(app)`, `importFromFile(app, file) → boolean`, `canUndoImport(app)`, `undoImport(app) → boolean`.
  - O objeto `app` (montado em main.js) que toda tela recebe: `{ languages, achievementTexts, getLanguage(id), store, storage, layout, autoBackup, dispatch(action, payload?, meta?) → events, ctx() → { now, today, languages }, navigate(hash), go(hash), refresh(), setLeaveGuard(fn), updateBanners(state) }`.
  - Toda tela é `async render(container, app, route)` e pode devolver uma função de limpeza.

- [ ] **Step 1: Escrever o teste de importação dos módulos (falhando)**

`tests/ui-imports.test.js`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Carregar cada módulo confere sintaxe e se todo "import { x }" existe de verdade.
const JS = fileURLToPath(new URL('../js/', import.meta.url));
const listJs = (dir) => readdirSync(dir).flatMap((name) => {
  const p = join(dir, name);
  if (statSync(p).isDirectory()) return listJs(p);
  return name.endsWith('.js') ? [p] : [];
});

for (const file of listJs(JS)) {
  const name = relative(JS, file).replaceAll('\\', '/');
  if (name === 'main.js') continue; // toca no DOM ao carregar; conferido com node --check
  test(`módulo ${name} carrega e resolve seus imports`, async () => {
    await assert.doesNotReject(import(pathToFileURL(file).href));
  });
}

test('existem as telas obrigatórias', async () => {
  const { VIEWS } = await import(pathToFileURL(join(JS, 'ui/views/index.js')).href);
  for (const name of ['home', 'notFound']) assert.equal(typeof VIEWS[name], 'function', name);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/ui-imports.test.js`
Expected: FAIL no teste "existem as telas obrigatórias" (`Cannot find module .../ui/views/index.js`).

- [ ] **Step 3: Escrever os utilitários de interface**

`js/ui/dom.js`:
```js
function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else if (key === 'html') el.innerHTML = value; // só para conteúdo confiável (content/ ou SVG gerado aqui)
    else if (key === 'style' && typeof value === 'object') {
      for (const [prop, v] of Object.entries(value)) el.style.setProperty(prop, v);
    } else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (value === true) el.setAttribute(key, '');
    else el.setAttribute(key, String(value));
  }
  append(el, children);
  return el;
}

export function mount(container, ...children) {
  container.replaceChildren();
  append(container, children);
}

export function bar(value, { tone = null, label = null } = {}) {
  const v = Math.max(0, Math.min(1, value || 0));
  return h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(v * 100), 'aria-label': label },
    h('div', { class: `bar-fill${tone ? ` tone-${tone}` : ''}`, style: { width: `${v * 100}%` } }));
}

export const pct = (v) => `${Math.round((v || 0) * 100)}%`;
export const toneFor = (rate) => (rate >= 0.8 ? 'success' : rate >= 0.6 ? 'warning' : 'danger');
export const plural = (n, one, many) => (n === 1 ? one : many);

export function formatDay(dayKey) {
  const [y, m, d] = dayKey.split('-');
  return `${d}/${m}/${y}`;
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function formatDuration(totalSec) {
  const s = Math.max(0, Math.round(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m ? `${m} min ${String(r).padStart(2, '0')} s` : `${r} s`;
}
```

`js/ui/store.js`:
```js
export function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    get: () => state,
    set(next, meta = {}) {
      state = next;
      for (const fn of listeners) fn(state, meta);
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}
```

`js/ui/markdown.js`:
```js
import { MARKED_URL, HLJS_URL } from '../config.js';

let lib = null;

export async function initMarkdown() {
  if (lib) return;
  const [markedModule, hljsModule] = await Promise.all([import(MARKED_URL), import(HLJS_URL)]);
  lib = { marked: markedModule.marked, hljs: hljsModule.default };
}

function requireLib() {
  if (!lib) throw new Error('Markdown ainda não foi carregado: chame initMarkdown() antes.');
  return lib;
}

const CALLOUTS = {
  NOTE: ['note', 'Nota'],
  TIP: ['tip', 'Dica'],
  IMPORTANT: ['important', 'Importante'],
  WARNING: ['warning', 'Atenção'],
  CAUTION: ['caution', 'Cuidado'],
};

function decorateCallouts(root) {
  for (const quote of root.querySelectorAll('blockquote')) {
    const first = quote.querySelector('p');
    const match = first && /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/.exec(first.innerHTML);
    if (!match) continue;
    const [cls, label] = CALLOUTS[match[1]];
    first.innerHTML = first.innerHTML.slice(match[0].length);
    if (!first.innerHTML.trim()) first.remove();
    const box = document.createElement('div');
    box.className = `callout callout-${cls}`;
    const title = document.createElement('strong');
    title.className = 'callout-title';
    title.textContent = label;
    box.append(title, ...quote.childNodes);
    quote.replaceWith(box);
  }
}

function addCopyButton(pre) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'copy-btn';
  btn.textContent = 'copiar';
  btn.addEventListener('click', async (event) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(pre.querySelector('code').textContent);
      btn.textContent = 'copiado!';
    } catch {
      btn.textContent = 'não deu';
    }
    setTimeout(() => { btn.textContent = 'copiar'; }, 1500);
  });
  pre.append(btn);
}

function decorateCode(root, hljs, defaultLang) {
  for (const code of root.querySelectorAll('pre > code')) {
    const m = /language-([\w-]+)/.exec(code.className);
    const language = m ? m[1] : defaultLang;
    if (language && hljs.getLanguage(language)) {
      code.innerHTML = hljs.highlight(code.textContent, { language }).value;
      code.classList.add('hljs');
    }
    addCopyButton(code.parentElement);
  }
}

export function md(text, { lang } = {}) {
  const { marked, hljs } = requireLib();
  const div = document.createElement('div');
  div.className = 'md';
  div.innerHTML = marked.parse(String(text ?? ''), { gfm: true });
  decorateCallouts(div);
  decorateCode(div, hljs, lang);
  return div;
}

export function mdInline(text) {
  const { marked } = requireLib();
  const span = document.createElement('span');
  span.innerHTML = marked.parseInline(String(text ?? ''));
  return span;
}
```

`js/ui/layout.js`:
```js
import { h, mount } from './dom.js';
import { APP_NAME } from '../config.js';
import { levelInfo, displayStreak } from '../core/gamification.js';
import { isDue } from '../core/srs.js';
import { toDayKey } from '../core/dates.js';

const NAV = [
  { route: 'home', href: '#/', icon: '🏠', label: 'Início' },
  { route: 'quiz', href: '#/quiz', icon: '🎯', label: 'Quiz' },
  { route: 'flashcards', href: '#/flashcards', icon: '🧠', label: 'Flashcards', badge: true },
  { route: 'perfil', href: '#/perfil', icon: '👤', label: 'Perfil' },
  { route: 'config', href: '#/config', icon: '⚙️', label: 'Config' },
];

function goalRing(value, goal) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, goal ? value / goal : 0);
  const svg = `<svg viewBox="0 0 36 36" width="34" height="34"><circle cx="18" cy="18" r="${r}" class="ring-bg"/>`
    + `<circle cx="18" cy="18" r="${r}" class="ring-fg" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c * (1 - p)).toFixed(2)}" transform="rotate(-90 18 18)"/></svg>`;
  return h('div', { class: 'goal', title: `Meta do dia: ${value}/${goal} XP` },
    h('span', { 'aria-hidden': 'true', html: svg }),
    h('span', {}, h('strong', { text: String(value) }), `/${goal} XP`));
}

export function createLayout(app) {
  const topbar = document.getElementById('topbar');
  const sidebar = document.getElementById('sidebar');
  const tabbar = document.getElementById('tabbar');
  const bannerBox = document.getElementById('banners');
  const toastBox = document.getElementById('toasts');
  const live = document.getElementById('sr-live');
  const banners = new Map();

  const navLinks = (routeName, due) => NAV.map((item) => h('a', {
    href: item.href,
    class: `nav-link${item.route === routeName ? ' active' : ''}`,
    'aria-current': item.route === routeName ? 'page' : null,
  },
  h('span', { class: 'nav-icon', 'aria-hidden': 'true', text: item.icon }),
  h('span', { class: 'nav-label', text: item.label }),
  item.badge && due ? h('span', { class: 'nav-badge', 'aria-label': `${due} cartas pendentes`, text: String(due) }) : null));

  function render(state, routeName) {
    const today = toDayKey(new Date());
    const { profile } = state;
    const due = Object.values(state.cards).filter((c) => isDue(c, today)).length;
    const info = levelInfo(state.xp.total);
    mount(topbar,
      h('a', { class: 'brand', href: '#/' },
        h('span', { class: 'brand-icon', 'aria-hidden': 'true', text: '</>' }),
        h('span', { class: 'brand-name', text: APP_NAME })),
      profile ? h('div', { class: 'topbar-stats' },
        goalRing(state.xp.byDay[today] ?? 0, profile.dailyGoal),
        h('span', { class: 'pill', title: 'Sequência de dias' }, '🔥 ', h('strong', { text: String(displayStreak(state.streak, today)) })),
        h('span', { class: 'pill pill-level', title: `${info.title} · ${state.xp.total} XP` }, '⭐ Nv ', h('strong', { text: String(info.level) })),
        h('a', { class: 'avatar', href: '#/perfil', 'aria-label': `Perfil de ${profile.name}`, text: profile.avatar })) : null);
    if (!profile) {
      sidebar.replaceChildren();
      tabbar.replaceChildren();
      return;
    }
    mount(sidebar,
      navLinks(routeName, due),
      h('p', { class: 'nav-section', text: 'Linguagens' }),
      app.languages.map((l) => h('a', { href: `#/${l.id}`, class: 'nav-link' },
        h('span', { class: 'nav-icon', 'aria-hidden': 'true', text: l.icon }),
        h('span', { class: 'nav-label', text: l.name }))));
    mount(tabbar, navLinks(routeName, due));
  }

  function renderBanners() {
    mount(bannerBox, [...banners.values()].map((b) => h('div', { class: `banner banner-${b.tone ?? 'info'}`, role: 'status' },
      h('span', { text: b.text }),
      h('span', { class: 'banner-actions' }, (b.actions ?? []).map((a) => h('button', { type: 'button', class: 'btn btn-sm', onClick: a.onClick, text: a.label }))))));
  }

  function setBanner(id, banner) {
    const current = banners.get(id);
    if (current && current.text === banner.text && current.tone === banner.tone) return;
    banners.set(id, banner);
    renderBanners();
  }

  function clearBanner(id) {
    if (banners.delete(id)) renderBanners();
  }

  function toast(text, { tone = 'info', timeout = 4000 } = {}) {
    const el = h('div', { class: `toast toast-${tone}`, text });
    toastBox.append(el);
    setTimeout(() => {
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 300);
    }, timeout);
  }

  function announce(text) {
    live.textContent = '';
    setTimeout(() => { live.textContent = text; }, 50);
  }

  return { render, setBanner, clearBanner, toast, announce };
}
```

`js/ui/components/common.js`:
```js
import { h } from '../dom.js';

export function errorPanel(message, onRetry) {
  return h('section', { class: 'panel panel-error', role: 'alert' },
    h('p', { text: message }),
    onRetry ? h('button', { type: 'button', class: 'btn', onClick: onRetry, text: 'Tentar de novo' }) : null);
}

export function statCard(label, value, extra = null) {
  return h('div', { class: 'panel stat' },
    h('span', { class: 'stat-label', text: label }),
    h('strong', { class: 'stat-value', text: value }),
    typeof extra === 'string' ? h('span', { class: 'muted small', text: extra }) : extra);
}

export function findModule(app, moduleKey) {
  const [langId, moduleId] = String(moduleKey).split('.');
  const language = app.getLanguage(langId);
  const module = language?.modules.find((m) => m.id === moduleId);
  return module ? { language, module } : null;
}

export function findLesson(app, key) {
  const [langId, moduleId, lessonId] = String(key).split('.');
  const found = findModule(app, `${langId}.${moduleId}`);
  const lesson = found?.module.lessons.find((l) => l.id === lessonId);
  return lesson ? { ...found, lesson } : null;
}
```

`js/ui/components/profile-fields.js`:
```js
import { h } from '../dom.js';
import { AVATARS, GOAL_OPTIONS } from '../../config.js';

export function profileFields(profile = null) {
  let avatar = profile?.avatar ?? AVATARS[0];
  let goal = profile?.dailyGoal ?? 50;
  const nameInput = h('input', { id: 'pf-name', type: 'text', maxlength: 60, autocomplete: 'nickname', required: true });
  nameInput.value = profile?.name ?? '';
  const error = h('p', { class: 'field-error', 'aria-live': 'polite' });
  const avatarGroup = h('div', { class: 'avatar-grid', role: 'radiogroup', 'aria-label': 'Avatar' });
  const goalGroup = h('div', { class: 'goal-options', role: 'radiogroup', 'aria-label': 'Meta diária' });

  function drawAvatars(focus = false) {
    avatarGroup.replaceChildren(...AVATARS.map((a) => h('button', {
      type: 'button', class: `avatar-opt${a === avatar ? ' selected' : ''}`, role: 'radio', 'aria-checked': String(a === avatar), 'aria-label': `Avatar ${a}`,
      onClick: () => { avatar = a; drawAvatars(true); },
    }, a)));
    if (focus) avatarGroup.querySelector('.selected')?.focus();
  }

  function drawGoals(focus = false) {
    goalGroup.replaceChildren(...GOAL_OPTIONS.map((g) => h('button', {
      type: 'button', class: `goal-opt${g.xp === goal ? ' selected' : ''}`, role: 'radio', 'aria-checked': String(g.xp === goal),
      onClick: () => { goal = g.xp; drawGoals(true); },
    }, h('strong', { text: g.label }), h('small', { text: g.hint }))));
    if (focus) goalGroup.querySelector('.selected')?.focus();
  }

  drawAvatars();
  drawGoals();
  const el = h('div', { class: 'profile-fields' },
    h('label', { for: 'pf-name', class: 'field-label', text: 'Seu nome (aparece no certificado)' }), nameInput, error,
    h('p', { class: 'field-label', text: 'Escolha um avatar' }), avatarGroup,
    h('p', { class: 'field-label', text: 'Meta diária' }), goalGroup);

  return {
    el,
    read() {
      const name = nameInput.value.trim();
      if (!name) {
        error.textContent = 'Digite seu nome.';
        nameInput.focus();
        return null;
      }
      error.textContent = '';
      return { name, avatar, dailyGoal: goal };
    },
  };
}
```

`js/ui/components/weak-points.js`:
```js
import { h, pct } from '../dom.js';
import { weakModules, weakestLesson } from '../../core/stats.js';
import { loadBanks } from '../../data/content.js';
import { findModule } from './common.js';

export async function weakPointsSection(app, state) {
  const keys = app.languages.flatMap((l) => l.modules.map((m) => m.key));
  const weak = weakModules(state, keys);
  const title = h('h2', { text: 'Pontos fracos' });
  if (!weak.length) {
    return h('section', { class: 'panel' }, title,
      h('p', { class: 'muted', text: 'Responda pelo menos 5 perguntas de um módulo para ver aqui onde vale a pena revisar.' }));
  }
  const bank = await loadBanks(app.languages, weak.map((w) => w.moduleKey));
  return h('section', { class: 'panel' }, title,
    h('ul', { class: 'weak-list' }, weak.map((w) => {
      const found = findModule(app, w.moduleKey);
      if (!found) return null;
      const { language, module } = found;
      const lessonId = weakestLesson(state, bank.questions.filter((q) => q.module === w.moduleKey));
      return h('li', {},
        h('span', { text: `${language.icon} ${language.name} › ${module.title}` }),
        h('span', { class: 'badge danger', text: `${pct(w.rate)} de acerto` }),
        lessonId ? h('a', { class: 'btn btn-sm', href: `#/${language.id}/${module.id}/${lessonId}`, text: 'Revisar aula' }) : null,
        h('a', { class: 'btn btn-sm btn-ghost', href: `#/quiz?modulo=${encodeURIComponent(w.moduleKey)}&foco=1`, text: 'Quiz focado' }));
    })));
}
```

`js/ui/backup-flow.js`:
```js
import { exportBackup, readBackupFile } from '../data/backup.js';
import { replaceState, updateBackupMeta } from '../core/actions.js';
import { migrate } from '../core/state.js';
import { levelForXp } from '../core/gamification.js';
import { APP_NAME, PRE_IMPORT_KEY } from '../config.js';
import { formatDateTime } from './dom.js';

export const BACKUP_ERRORS = {
  json: 'O arquivo não é um JSON válido ou está danificado.',
  app: `Este arquivo não é um backup da ${APP_NAME}.`,
  newer: 'Este backup veio de uma versão mais nova do site. Recarregue a página e tente de novo.',
  invalid: 'O backup está incompleto ou danificado.',
};

export async function exportNow(app) {
  try {
    const result = await exportBackup(app.store.get());
    if (result === 'cancelled') return false;
    app.dispatch(updateBackupMeta, { lastExportAt: new Date().toISOString() });
    app.layout.toast(result === 'shared' ? 'Backup compartilhado.' : 'Backup baixado. Guarde o arquivo em um lugar seguro.', { tone: 'success' });
    return true;
  } catch (err) {
    app.layout.toast(`Não foi possível exportar: ${err.message}`, { tone: 'danger' });
    return false;
  }
}

export async function importFromFile(app, file) {
  const result = await readBackupFile(file);
  if (!result.ok) {
    alert(BACKUP_ERRORS[result.reason]);
    return false;
  }
  const s = result.state;
  const lines = [
    `Perfil: ${s.profile?.name ?? '(sem nome)'}`,
    `Nível ${levelForXp(s.xp.total)} · ${Object.keys(s.lessons).length} aulas concluídas`,
    result.exportedAt ? `Exportado em ${formatDateTime(result.exportedAt)}` : null,
  ].filter(Boolean);
  if (!confirm(`Importar este backup?\n\n${lines.join('\n')}\n\nO progresso atual será substituído. Você poderá desfazer em Configurações.`)) return false;
  const saved = app.storage.setItem(PRE_IMPORT_KEY, JSON.stringify(app.store.get()));
  if (!saved && !confirm('Não foi possível guardar uma cópia para desfazer a importação. Continuar mesmo assim?')) return false;
  app.dispatch(replaceState, { state: s });
  app.storage.flush();
  return true;
}

export const canUndoImport = (app) => Boolean(app.storage.getItem(PRE_IMPORT_KEY));

export function undoImport(app) {
  const raw = app.storage.getItem(PRE_IMPORT_KEY);
  if (!raw) return false;
  let result;
  try {
    result = migrate(JSON.parse(raw));
  } catch {
    result = { ok: false };
  }
  if (!result.ok) {
    alert('A cópia anterior está danificada e não pode ser restaurada.');
    return false;
  }
  app.dispatch(replaceState, { state: result.state });
  app.storage.removeItem(PRE_IMPORT_KEY);
  app.storage.flush();
  return true;
}
```

- [ ] **Step 4: Escrever as primeiras telas e o registro de telas**

`js/ui/views/not-found.js`:
```js
import { h, mount } from '../dom.js';

export function renderNotFound(container) {
  mount(container, h('section', { class: 'panel center' },
    h('h1', { text: 'Página não encontrada' }),
    h('p', { class: 'muted', text: 'O endereço que você abriu não existe.' }),
    h('a', { class: 'btn', href: '#/', text: 'Voltar ao início' })));
}
```

`js/ui/views/onboarding.js`:
```js
import { h, mount } from '../dom.js';
import { APP_NAME } from '../../config.js';
import { setProfile } from '../../core/actions.js';
import { profileFields } from '../components/profile-fields.js';
import { importFromFile } from '../backup-flow.js';

export function renderOnboarding(container, app) {
  const fields = profileFields();
  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    fileInput.value = '';
    if (file && (await importFromFile(app, file))) app.refresh();
  });
  const form = h('form', { class: 'panel onboarding' },
    h('h1', { text: `Boas-vindas à ${APP_NAME}! 👋` }),
    h('p', { class: 'muted', text: 'Aulas curtas, quizzes e flashcards para aprender programação. É gratuito, e o seu progresso fica salvo neste navegador.' }),
    fields.el,
    h('div', { class: 'actions' }, h('button', { type: 'submit', class: 'btn btn-primary', text: 'Começar a estudar' })),
    h('p', { class: 'small muted' }, 'Já estudou aqui em outro aparelho? ',
      h('button', { type: 'button', class: 'link-btn', onClick: () => fileInput.click(), text: 'Importe seu backup' }), '.'),
    fileInput);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = fields.read();
    if (!data) return;
    app.dispatch(setProfile, data);
    app.refresh();
  });
  mount(container, form);
}
```

`js/ui/views/home.js`:
```js
import { h, mount, bar, pct, plural } from '../dom.js';
import { displayStreak } from '../../core/gamification.js';
import { isDue } from '../../core/srs.js';
import { languageProgress } from '../../core/progress.js';
import { findLesson, statCard } from '../components/common.js';
import { weakPointsSection } from '../components/weak-points.js';

export async function renderHome(container, app) {
  const state = app.store.get();
  const { today } = app.ctx();
  const goal = state.profile.dailyGoal;
  const xpToday = state.xp.byDay[today] ?? 0;
  const streak = displayStreak(state.streak, today);
  const due = Object.values(state.cards).filter((c) => isDue(c, today)).length;
  const last = state.lastLesson ? findLesson(app, state.lastLesson) : null;
  const weak = await weakPointsSection(app, state);
  mount(container,
    h('section', { class: 'hero' },
      h('h1', {}, `${state.profile.avatar} Olá, ${state.profile.name}!`),
      h('p', { class: 'muted', text: 'Um pouquinho por dia já faz diferença. Bora?' })),
    h('div', { class: 'grid stats' },
      statCard('Meta do dia', `${xpToday}/${goal} XP`, bar(xpToday / goal, { label: 'Meta do dia' })),
      statCard('Sequência', `🔥 ${streak} ${plural(streak, 'dia', 'dias')}`, `Recorde: ${state.streak.best} ${plural(state.streak.best, 'dia', 'dias')}`),
      statCard('Revisão do dia', `🧠 ${due} ${plural(due, 'carta', 'cartas')}`,
        h('a', { class: 'link', href: '#/flashcards', text: due ? 'Revisar agora →' : 'Abrir flashcards →' }))),
    last ? h('a', { class: 'panel continue', href: `#/${last.language.id}/${last.module.id}/${last.lesson.id}` },
      h('span', { class: 'eyebrow', text: 'Continuar de onde parou' }),
      h('strong', { text: `${last.language.icon} ${last.language.name} › ${last.module.title} › ${last.lesson.title}` })) : null,
    h('h2', { text: 'Linguagens' }),
    h('div', { class: 'grid langs' }, app.languages.map((l) => {
      const p = languageProgress(state, l);
      return h('a', { class: 'panel lang-card', href: `#/${l.id}`, style: { '--accent': l.color } },
        h('span', { class: 'lang-icon', text: l.icon }),
        h('strong', { text: l.name }),
        h('span', { class: 'muted small', text: `${p.lessonsDone}/${p.lessonsTotal} aulas · ${pct(p.percent)}` }),
        bar(p.percent, { label: `Progresso em ${l.name}` }));
    })),
    weak);
}
```

`js/ui/views/index.js`:
```js
import { renderHome } from './home.js';
import { renderNotFound } from './not-found.js';

// Cada tarefa seguinte registra suas telas aqui.
export const VIEWS = {
  home: renderHome,
  notFound: renderNotFound,
};
```

- [ ] **Step 5: Escrever o `main.js`**

`js/main.js`:
```js
import { createInitialState } from './core/state.js';
import { toDayKey, addDays } from './core/dates.js';
import { needsBackupReminder, hasProgress } from './core/backup-format.js';
import { levelInfo } from './core/gamification.js';
import { updateBackupMeta } from './core/actions.js';
import { createStore } from './ui/store.js';
import { createStorage } from './data/storage.js';
import { createAutoBackup } from './data/backup.js';
import { loadLanguages, loadAchievementTexts } from './data/content.js';
import { initMarkdown } from './ui/markdown.js';
import { createLayout } from './ui/layout.js';
import { h, mount } from './ui/dom.js';
import { errorPanel } from './ui/components/common.js';
import { exportNow } from './ui/backup-flow.js';
import { VIEWS } from './ui/views/index.js';
import { renderOnboarding } from './ui/views/onboarding.js';
import { startRouter, navigate, refresh, setLeaveGuard, hasLeaveGuard } from './router.js';
import { APP_NAME, REMINDER_DISMISS_KEY, REMINDER_SNOOZE_DAYS } from './config.js';

const main = document.getElementById('main');
const loading = () => h('p', { class: 'loading', text: 'Carregando…' });
document.title = APP_NAME;
document.querySelector('.skip-link')?.addEventListener('click', () => main.focus());

async function boot() {
  mount(main, loading());
  let languages;
  let achievementTexts;
  try {
    [languages, achievementTexts] = await Promise.all([loadLanguages(), loadAchievementTexts(), initMarkdown()]);
  } catch (err) {
    console.error(err);
    mount(main, errorPanel('Não foi possível carregar a Central. Confira sua conexão com a internet.', boot));
    return;
  }
  start(languages, achievementTexts);
}

function start(languages, achievementTexts) {
  const app = { languages, achievementTexts, getLanguage: (id) => languages.find((l) => l.id === id) };
  const layout = createLayout(app);
  const noStorage = () => layout.setBanner('storage', {
    tone: 'danger',
    text: 'Seu progresso não está sendo salvo neste navegador. Exporte um backup antes de fechar a página.',
  });

  const storage = createStorage({
    onExternalChange: (state) => {
      store.set(state, { external: true });
      if (!hasLeaveGuard()) refresh();
    },
    onSaveError: noStorage,
  });
  const loaded = storage.load();
  const store = createStore(loaded.status === 'ok' ? loaded.state : createInitialState());

  if (loaded.status === 'unavailable') noStorage();
  if (loaded.status === 'corrupt') {
    storage.keepCorrupt(loaded.raw);
    layout.setBanner('corrupt', {
      tone: 'warning',
      text: 'Seu progresso salvo estava danificado. Guardamos uma cópia e começamos do zero. Se você tiver um backup, importe-o em Configurações.',
      actions: [{ label: 'Abrir Configurações', onClick: () => navigate('#/config') }],
    });
  }
  if (loaded.status === 'newer') {
    storage.disable();
    layout.setBanner('newer', {
      tone: 'danger',
      text: 'Seu progresso foi salvo por uma versão mais nova do site. Recarregue a página para atualizar. Até lá, nada será salvo.',
    });
  }

  const ctx = () => {
    const now = new Date();
    return { now, today: toDayKey(now), languages };
  };
  const achievementName = (id) => achievementTexts.find((a) => a.id === id)?.name ?? id;

  function announce(events) {
    if (events.moduleCompleted) layout.toast('🎉 Módulo concluído! +50 XP', { tone: 'success' });
    if (events.examPassed) layout.toast('🏆 Você passou na prova! +200 XP', { tone: 'success' });
    if (events.levelUp) layout.toast(`⬆️ Nível ${events.levelUp}: ${levelInfo(store.get().xp.total).title}!`, { tone: 'success' });
    for (const id of events.achievements) layout.toast(`🏅 Conquista desbloqueada: ${achievementName(id)}`, { tone: 'success', timeout: 6000 });
  }

  function dispatch(action, payload = {}, meta = {}) {
    const { state, events } = action(store.get(), payload, ctx());
    if (state !== store.get()) store.set(state, meta);
    announce(events);
    return events;
  }

  const autoBackup = createAutoBackup({
    onWrite: (at) => dispatch(updateBackupMeta, { lastAutoWriteAt: at, autoFileError: null }, { backupMeta: true }),
    onError: (message) => dispatch(updateBackupMeta, { autoFileError: message }, { backupMeta: true }),
  });

  function updateBanners(state) {
    const status = autoBackup.status();
    if (status === 'needs-permission') {
      layout.setBanner('reconnect', {
        text: 'O backup automático precisa da sua permissão para continuar gravando.',
        actions: [{
          label: 'Reconectar backup automático',
          onClick: async () => {
            await autoBackup.reconnect(store.get());
            updateBanners(store.get());
          },
        }],
      });
    } else {
      layout.clearBanner('reconnect');
    }
    const today = toDayKey(new Date());
    const remind = needsBackupReminder({
      state,
      today,
      dismissedUntil: storage.getItem(REMINDER_DISMISS_KEY),
      autoHealthy: status === 'on' && !state.backup.autoFileError,
    });
    if (remind) {
      layout.setBanner('reminder', {
        text: 'Já faz um tempo desde o seu último backup. Que tal exportar o progresso agora?',
        actions: [
          { label: 'Exportar agora', onClick: () => exportNow(app) },
          {
            label: 'Depois',
            onClick: () => {
              storage.setItem(REMINDER_DISMISS_KEY, addDays(today, REMINDER_SNOOZE_DAYS));
              layout.clearBanner('reminder');
            },
          },
        ],
      });
    } else {
      layout.clearBanner('reminder');
    }
  }

  Object.assign(app, {
    store, storage, layout, autoBackup, dispatch, ctx, navigate, refresh, setLeaveGuard, updateBanners,
    go: (hash) => (location.hash === hash ? refresh() : navigate(hash)),
  });

  let currentRoute = null;
  store.subscribe((state, meta) => {
    if (!meta.external) storage.save(state);
    // Um estado sem progresso (recém-zerado ou recomeçado após dados danificados) nunca sobrescreve o arquivo de backup.
    if (!meta.external && !meta.backupMeta && hasProgress(state)) autoBackup.schedule(state);
    layout.render(state, currentRoute?.name);
    updateBanners(state);
  });

  let renderToken = 0;
  let cleanup = null;
  async function onRoute(route) {
    currentRoute = route;
    const token = ++renderToken;
    cleanup?.();
    cleanup = null;
    layout.render(store.get(), route.name);
    mount(main, loading());
    const target = h('div', { class: 'view' });
    try {
      const view = store.get().profile ? (VIEWS[route.name] ?? VIEWS.notFound) : renderOnboarding;
      const result = await view(target, app, route);
      if (token !== renderToken) {
        if (typeof result === 'function') result();
        return;
      }
      cleanup = typeof result === 'function' ? result : null;
      mount(main, target);
    } catch (err) {
      console.error(err);
      if (token === renderToken) mount(main, errorPanel('Não foi possível carregar esta página. Confira sua conexão.', () => onRoute(route)));
    }
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  const oops = () => layout.toast('Algo deu errado. Seu progresso salvo não foi afetado.', { tone: 'danger' });
  window.addEventListener('error', oops);
  window.addEventListener('unhandledrejection', oops);

  updateBanners(store.get());
  // Com dados danificados ou de versão mais nova, o backup automático fica pausado até a próxima carga:
  // o arquivo em disco pode ser justamente a cópia boa que a pessoa vai querer importar.
  const pauseAutoBackup = loaded.status === 'corrupt' || loaded.status === 'newer';
  if (!pauseAutoBackup) autoBackup.init().catch(() => {}).finally(() => updateBanners(store.get()));
  startRouter(onRoute);
}

boot();
```

- [ ] **Step 6: Rodar os testes e a checagem de sintaxe**

Run: `npm test && node --check js/main.js`
Expected: PASS em todos os testes (inclusive `ui-imports.test.js` para cada módulo) e nenhum erro de sintaxe.

- [ ] **Step 7: Conferir no navegador**

Run: `python -m http.server 8000` e abra `http://localhost:8000/`.
Expected: a tela de boas-vindas aparece; preencher nome, avatar e meta e clicar em "Começar a estudar" leva à tela inicial com "Olá, <nome>!", os três cartões (meta, sequência, revisão), o cartão da linguagem Java com 0/6 aulas e o painel "Pontos fracos" com a mensagem de orientação. O topo mostra o anel da meta, 🔥 0, Nv 1 e o avatar. Clicar em "Java" mostra "Página não encontrada" (a tela da linguagem entra na próxima tarefa). Nenhum erro no console.

- [ ] **Step 8: Commit**

```bash
git add js/main.js js/ui tests/ui-imports.test.js
git commit -m "Adiciona base da interface, primeira visita e tela inicial" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: Telas de linguagem, aula e referência rápida

**Files:**
- Create: `js/ui/views/language.js`, `js/ui/views/lesson.js`, `js/ui/views/reference.js`
- Modify: `js/ui/views/index.js` (registrar `language`, `lesson`, `reference`)
- Modify: `tests/ui-imports.test.js` (incluir as novas telas obrigatórias)

**Interfaces:**
- Consumes: `languageProgress`, `isModuleComplete`, `isLanguageComplete`, `moduleLessonsDone`, `lessonKey`, `moduleKey`, `PRACTICE_PASS` (progress.js); `activateModuleCards`, `openLesson`, `completeLesson` (actions.js); `loadModuleBank`, `loadLesson`, `loadReference` (content.js); `md` (markdown.js); `renderNotFound`.
- Produces: `renderLanguage`, `renderLesson`, `renderReference` com a assinatura padrão de tela.

- [ ] **Step 1: Ampliar o teste de telas obrigatórias (falhando)**

Em `tests/ui-imports.test.js`, troque a lista do último teste:
```js
  for (const name of ['home', 'notFound', 'language', 'lesson', 'reference']) assert.equal(typeof VIEWS[name], 'function', name);
```

Run: `node --test tests/ui-imports.test.js`
Expected: FAIL em `language`.

- [ ] **Step 2: Escrever as telas**

`js/ui/views/language.js`:
```js
import { h, mount, bar, pct } from '../dom.js';
import {
  languageProgress, isModuleComplete, isLanguageComplete, moduleLessonsDone, lessonKey, moduleKey, PRACTICE_PASS,
} from '../../core/progress.js';
import { activateModuleCards } from '../../core/actions.js';
import { loadModuleBank } from '../../data/content.js';
import { renderNotFound } from './not-found.js';

function moduleCard(app, state, language, module, index) {
  const entry = state.modules[moduleKey(language.id, module.id)] ?? {};
  const done = isModuleComplete(state, language, module);
  const lessonsDone = moduleLessonsDone(state, language, module);
  const activate = async () => {
    const bank = await loadModuleBank(language, module);
    app.dispatch(activateModuleCards, { language, moduleId: module.id, cards: bank.cards });
    app.layout.toast(`Cartas de "${module.title}" ativadas.`, { tone: 'success' });
    app.refresh();
  };
  return h('section', { class: `panel module-card${done ? ' done' : ''}` },
    h('header', { class: 'module-head' },
      h('div', {},
        h('p', { class: 'eyebrow', text: `Módulo ${index + 1}` }),
        h('h2', { text: module.title }),
        h('p', { class: 'muted', text: module.description })),
      done ? h('span', { class: 'badge success', text: '✓ Concluído' }) : h('span', { class: 'badge', text: `${lessonsDone}/${module.lessons.length} aulas` })),
    h('ol', { class: 'lesson-list' }, module.lessons.map((l) => {
      const ok = Boolean(state.lessons[lessonKey(language.id, module.id, l.id)]);
      return h('li', { class: ok ? 'done' : null },
        h('a', { href: `#/${language.id}/${module.id}/${l.id}` },
          h('span', { class: 'lesson-check', 'aria-hidden': 'true', text: ok ? '✓' : '○' }),
          h('span', { text: l.title }),
          ok ? h('span', { class: 'sr-only', text: '(concluída)' }) : null,
          h('span', { class: 'muted small', text: `${l.minutes} min` })));
    })),
    h('div', { class: 'actions' },
      h('a', { class: 'btn btn-primary', href: `#/${language.id}/${module.id}/pratica`, text: 'Praticar o módulo' }),
      entry.bestPractice !== undefined
        ? h('span', { class: `badge ${entry.bestPractice >= PRACTICE_PASS ? 'success' : 'warning'}`, text: `Melhor prática: ${pct(entry.bestPractice)}` })
        : h('span', { class: 'muted small', text: `Para concluir: todas as aulas e ${pct(PRACTICE_PASS)} na prática` }),
      entry.cardsActivated
        ? h('span', { class: 'muted small', text: '🧠 Cartas do módulo ativadas' })
        : h('button', { type: 'button', class: 'btn btn-ghost', onClick: activate, text: '🧠 Ativar todas as cartas deste módulo' })));
}

export async function renderLanguage(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  if (!language) return renderNotFound(container);
  const state = app.store.get();
  const progress = languageProgress(state, language);
  const exam = state.exams[language.id];
  const complete = isLanguageComplete(state, language);
  mount(container, h('div', { class: 'lang-page', style: { '--accent': language.color } },
    h('section', { class: 'lang-hero' },
      h('div', { class: 'lang-icon', text: language.icon }),
      h('div', {},
        h('h1', { text: language.name }),
        h('p', { class: 'muted', text: `${progress.lessonsDone}/${progress.lessonsTotal} aulas · ${progress.modulesDone}/${progress.modulesTotal} módulos concluídos` }),
        bar(progress.percent, { label: `Progresso em ${language.name}` }))),
    h('div', { class: 'lang-links' },
      h('a', { class: 'btn', href: `#/${language.id}/referencia`, text: '📋 Referência rápida' }),
      h('a', { class: 'btn', href: `#/${language.id}/prova`, text: exam?.best !== undefined ? `🎯 Prova (melhor nota: ${pct(exam.best)})` : '🎯 Prova' }),
      h('a', { class: `btn${complete ? ' btn-primary' : ' btn-ghost'}`, href: `#/${language.id}/certificado`, text: complete ? '🎓 Ver certificado' : '🔒 Certificado' })),
    language.modules.map((m, i) => moduleCard(app, state, language, m, i))));
}
```

`js/ui/views/lesson.js`:
```js
import { h, mount, formatDay } from '../dom.js';
import { md } from '../markdown.js';
import { loadLesson, loadModuleBank } from '../../data/content.js';
import { lessonKey } from '../../core/progress.js';
import { openLesson, completeLesson } from '../../core/actions.js';
import { renderNotFound } from './not-found.js';

export async function renderLesson(container, app, route) {
  const { lang, module: moduleId, lesson: lessonId } = route.params;
  const language = app.getLanguage(lang);
  const module = language?.modules.find((m) => m.id === moduleId);
  const index = module ? module.lessons.findIndex((l) => l.id === lessonId) : -1;
  if (index < 0) return renderNotFound(container);
  const lesson = module.lessons[index];
  const key = lessonKey(lang, moduleId, lessonId);
  const text = await loadLesson(language, module, lesson);
  app.dispatch(openLesson, { key });
  const prev = module.lessons[index - 1];
  const next = module.lessons[index + 1];

  function footer() {
    const doneAt = app.store.get().lessons[key]?.doneAt;
    return h('footer', { class: 'lesson-foot' },
      prev ? h('a', { class: 'btn btn-ghost', href: `#/${lang}/${moduleId}/${prev.id}`, text: `← ${prev.title}` }) : h('span'),
      doneAt
        ? h('span', { class: 'badge success', text: `✓ Concluída em ${formatDay(doneAt)}` })
        : h('button', { type: 'button', class: 'btn btn-primary', onClick: complete, text: 'Concluir aula' }),
      next
        ? h('a', { class: 'btn', href: `#/${lang}/${moduleId}/${next.id}`, text: `${next.title} →` })
        : h('a', { class: 'btn', href: `#/${lang}/${moduleId}/pratica`, text: 'Praticar o módulo →' }));
  }

  let foot = footer();
  async function complete() {
    const bank = await loadModuleBank(language, module);
    const events = app.dispatch(completeLesson, { language, moduleId, lessonId, cards: bank.cards });
    app.layout.toast(`Aula concluída! +${events.xpGained} XP`, { tone: 'success' });
    const fresh = footer();
    foot.replaceWith(fresh);
    foot = fresh;
  }

  mount(container, h('article', { class: 'lesson', style: { '--accent': language.color } },
    h('nav', { class: 'breadcrumb', 'aria-label': 'Você está em' },
      h('a', { href: `#/${lang}`, text: `${language.icon} ${language.name}` }), ` › ${module.title}`),
    h('p', { class: 'eyebrow', text: `Aula ${index + 1} de ${module.lessons.length} · ${lesson.minutes} min` }),
    md(text, { lang: language.highlight }),
    foot));
}
```

`js/ui/views/reference.js`:
```js
import { h, mount } from '../dom.js';
import { md } from '../markdown.js';
import { loadReference } from '../../data/content.js';
import { renderNotFound } from './not-found.js';

export async function renderReference(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  if (!language) return renderNotFound(container);
  const text = await loadReference(language);
  mount(container, h('article', { class: 'lesson', style: { '--accent': language.color } },
    h('nav', { class: 'breadcrumb', 'aria-label': 'Você está em' },
      h('a', { href: `#/${language.id}`, text: `${language.icon} ${language.name}` }), ' › Referência rápida'),
    md(text, { lang: language.highlight })));
}
```

Atualize `js/ui/views/index.js`:
```js
import { renderHome } from './home.js';
import { renderNotFound } from './not-found.js';
import { renderLanguage } from './language.js';
import { renderLesson } from './lesson.js';
import { renderReference } from './reference.js';

// Cada tarefa seguinte registra suas telas aqui.
export const VIEWS = {
  home: renderHome,
  notFound: renderNotFound,
  language: renderLanguage,
  lesson: renderLesson,
  reference: renderReference,
};
```

- [ ] **Step 3: Rodar os testes**

Run: `npm test && node --check js/main.js`
Expected: PASS.

- [ ] **Step 4: Conferir no navegador**

Com `python -m http.server 8000`, abra `http://localhost:8000/#/java`.
Expected: cabeçalho de Java (☕, 0/6 aulas), botões de referência, prova e certificado (🔒), o card do módulo "Fundamentos" com as 6 aulas. Abrir "Variáveis e tipos primitivos" mostra a aula com tabelas, código colorido, botões "copiar" e os quadros "Nota", "Dica" e "Atenção" coloridos. "Concluir aula" mostra o aviso "+20 XP", a conquista "Primeiros passos", troca o botão por "✓ Concluída em <data>", e o topo passa a mostrar 🔥 1 e 20/50 XP. A tela inicial mostra "Continuar de onde parou". `#/java/referencia` mostra a referência. `#/cobol` mostra "Página não encontrada".

- [ ] **Step 5: Commit**

```bash
git add js/ui/views tests/ui-imports.test.js
git commit -m "Adiciona telas de linguagem, aula e referência rápida" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: Componente de pergunta, executor de quiz e prática do módulo

**Files:**
- Create: `js/ui/components/question.js`, `js/ui/components/quiz-runner.js`, `js/ui/views/practice.js`
- Modify: `js/ui/views/index.js` (registrar `practice`), `tests/ui-imports.test.js` (incluir `practice`)

**Interfaces:**
- Consumes: `gradeQuestion`, `isBlankCorrect`, `BLANK` (grading.js); `prepareQuestion`, `selectQuestions` (quiz.js); `recordAnswer`, `finishQuiz` (actions.js); `PRACTICE_QUESTIONS` (progress.js); `md`, `mdInline`; `findModule`.
- Produces:
  - question.js: `createQuestionView(question, { lang, onSubmit(response) }) → { el, reveal({ response, correct, showCorrect }), focus() }` (a pergunta precisa vir de `prepareQuestion`), `describeResponse(question, response, lang)`, `describeAnswer(question, lang)`.
  - quiz-runner.js: `runQuiz(container, app, { questions, mode: 'estudo'|'simulado', kind, title, timer?, language?, moduleId?, scopeLabel, moduleKeys, resultActions?: { label, href? , onClick? }[], headline?: (rate) => string })`. Grava cada resposta com `recordAnswer` na hora, chama `finishQuiz` no fim, mostra o resultado, liga o guarda de saída enquanto houver respostas e oferece "Refazer só as erradas" (sessão `kind: 'review'`).
  - practice.js: `renderPractice`.

- [ ] **Step 1: Ampliar o teste de telas obrigatórias (falhando)**

Em `tests/ui-imports.test.js`, a lista vira:
```js
  for (const name of ['home', 'notFound', 'language', 'lesson', 'reference', 'practice']) assert.equal(typeof VIEWS[name], 'function', name);
```
Run: `node --test tests/ui-imports.test.js`
Expected: FAIL em `practice`.

- [ ] **Step 2: Escrever o componente de pergunta**

`js/ui/components/question.js`:
```js
import { h } from '../dom.js';
import { md, mdInline } from '../markdown.js';
import { BLANK, isBlankCorrect } from '../../core/grading.js';

const TYPE_LABEL = {
  multiple: 'Múltipla escolha',
  truefalse: 'Verdadeiro ou falso',
  fill: 'Complete a lacuna',
  order: 'Ordene as linhas',
};
const LETTERS = 'ABCDE';

function multiple(root, q, onSubmit) {
  const buttons = q.optionOrder.map((orig, i) => {
    const btn = h('button', { type: 'button', class: 'opt', 'data-orig': orig },
      h('span', { class: 'opt-letter', text: LETTERS[i] }), mdInline(q.options[orig]));
    btn.addEventListener('click', () => { lock(); onSubmit(orig); });
    return btn;
  });
  const lock = () => buttons.forEach((b) => { b.disabled = true; });
  root.append(h('div', { class: 'opts' }, buttons));
  return {
    reveal({ response, showCorrect }) {
      lock();
      for (const b of buttons) {
        const orig = Number(b.dataset.orig);
        if (orig === response) b.classList.add('chosen');
        if (showCorrect && orig === q.answer) b.classList.add('ok');
        else if (showCorrect && orig === response) b.classList.add('err');
      }
    },
    focus: () => buttons[0]?.focus(),
  };
}

function trueFalse(root, q, onSubmit) {
  const make = (value, label) => {
    const btn = h('button', { type: 'button', class: 'opt', 'data-value': String(value), text: label });
    btn.addEventListener('click', () => { lock(); onSubmit(value); });
    return btn;
  };
  const buttons = [make(true, 'Verdadeiro'), make(false, 'Falso')];
  const lock = () => buttons.forEach((b) => { b.disabled = true; });
  root.append(h('div', { class: 'opts opts-row' }, buttons));
  return {
    reveal({ response, showCorrect }) {
      lock();
      for (const b of buttons) {
        const value = b.dataset.value === 'true';
        if (value === response) b.classList.add('chosen');
        if (showCorrect && value === q.answer) b.classList.add('ok');
        else if (showCorrect && value === response) b.classList.add('err');
      }
    },
    focus: () => buttons[0].focus(),
  };
}

function fill(root, q, onSubmit) {
  const parts = q.code.split(BLANK);
  const inputs = [];
  const code = h('code');
  parts.forEach((part, i) => {
    code.append(document.createTextNode(part));
    if (i < parts.length - 1) {
      const input = h('input', { type: 'text', class: 'blank', 'aria-label': `Lacuna ${i + 1}`, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false' });
      inputs.push(input);
      code.append(input);
    }
  });
  const submit = h('button', { type: 'submit', class: 'btn btn-primary', text: 'Responder' });
  const form = h('form', { class: 'fill-form' }, h('pre', { class: 'fill-code' }, code), submit);
  const lock = () => {
    inputs.forEach((i) => { i.readOnly = true; });
    submit.disabled = true;
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const empty = inputs.find((i) => !i.value.trim());
    if (empty) {
      empty.focus();
      return;
    }
    lock();
    onSubmit(inputs.map((i) => i.value));
  });
  root.append(form);
  return {
    reveal({ response, showCorrect, correct }) {
      lock();
      if (!showCorrect) return;
      inputs.forEach((input, i) => input.classList.add(isBlankCorrect(q, i, response[i]) ? 'ok' : 'err'));
      if (!correct) {
        root.append(h('p', { class: 'fill-answer' }, 'Resposta esperada: ',
          q.blanks.map((accepted, i) => [i ? ' · ' : '', h('code', { text: accepted[0] })])));
      }
    },
    focus: () => inputs[0]?.focus(),
  };
}

function order(root, q, onSubmit, lang) {
  const lines = q.shuffledLines.slice();
  let selected = null;
  let locked = false;
  const list = h('ol', { class: 'order-list' });
  const submit = h('button', { type: 'button', class: 'btn btn-primary', text: 'Confirmar ordem' });

  function move(i, delta) {
    const j = i + delta;
    if (locked || j < 0 || j >= lines.length) return;
    [lines[i], lines[j]] = [lines[j], lines[i]];
    selected = j;
    draw();
    list.children[j]?.querySelector('.order-line')?.focus();
  }

  function draw() {
    list.replaceChildren(...lines.map((line, i) => {
      const item = h('li', { class: `order-item${selected === i ? ' selected' : ''}`, draggable: locked ? null : 'true' },
        h('button', {
          type: 'button', class: 'order-line', disabled: locked || null, 'aria-pressed': String(selected === i),
          'aria-label': `Linha ${i + 1}: ${line}. Use as setas para mover.`,
          onClick: () => { selected = selected === i ? null : i; draw(); list.children[i]?.querySelector('.order-line')?.focus(); },
          onKeydown: (event) => {
            if (event.key === 'ArrowUp') { event.preventDefault(); move(i, -1); }
            if (event.key === 'ArrowDown') { event.preventDefault(); move(i, 1); }
          },
        }, h('code', { text: line })),
        h('span', { class: 'order-moves' },
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Mover para cima', disabled: locked || i === 0 || null, onClick: () => move(i, -1), text: '↑' }),
          h('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Mover para baixo', disabled: locked || i === lines.length - 1 || null, onClick: () => move(i, 1), text: '↓' })));
      item.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', String(i));
        item.classList.add('dragging');
      });
      item.addEventListener('dragend', () => item.classList.remove('dragging'));
      item.addEventListener('dragover', (event) => event.preventDefault());
      item.addEventListener('drop', (event) => {
        event.preventDefault();
        const from = Number(event.dataTransfer.getData('text/plain'));
        if (locked || Number.isNaN(from) || from === i) return;
        const [moved] = lines.splice(from, 1);
        lines.splice(i, 0, moved);
        selected = i;
        draw();
      });
      return item;
    }));
  }

  draw();
  submit.addEventListener('click', () => {
    locked = true;
    selected = null;
    submit.disabled = true;
    draw();
    onSubmit(lines.slice());
  });
  root.append(
    h('p', { class: 'muted small', text: 'Toque numa linha e use ↑ ↓ (ou as setas do teclado). No computador, também dá para arrastar.' }),
    list, submit);
  return {
    reveal({ showCorrect, correct }) {
      locked = true;
      submit.disabled = true;
      draw();
      if (showCorrect && !correct) {
        root.append(h('div', { class: 'order-answer' }, h('p', { text: 'Ordem correta:' }),
          md(`\`\`\`${lang ?? ''}\n${q.lines.join('\n')}\n\`\`\``, { lang })));
      }
    },
    focus: () => list.querySelector('.order-line')?.focus(),
  };
}

export function createQuestionView(question, { lang, onSubmit }) {
  const root = h('div', { class: `question q-${question.type}` },
    h('div', { class: 'q-type', text: TYPE_LABEL[question.type] }),
    md(question.prompt, { lang }));
  const builders = { multiple, truefalse: trueFalse, fill, order };
  const { reveal, focus } = builders[question.type](root, question, onSubmit, lang);
  return { el: root, reveal, focus };
}

export function describeResponse(question, response, lang) {
  if (response === undefined || response === null) return h('em', { text: 'sem resposta' });
  switch (question.type) {
    case 'multiple': return mdInline(question.options[response]);
    case 'truefalse': return h('span', { text: response ? 'Verdadeiro' : 'Falso' });
    case 'fill': return h('code', { text: response.join(' · ') });
    case 'order': return h('pre', {}, h('code', { text: response.join('\n') }));
    default: return h('span', { text: String(response) });
  }
}

export function describeAnswer(question, lang) {
  switch (question.type) {
    case 'multiple': return mdInline(question.options[question.answer]);
    case 'truefalse': return h('span', { text: question.answer ? 'Verdadeiro' : 'Falso' });
    case 'fill': return h('code', { text: question.blanks.map((b) => b[0]).join(' · ') });
    case 'order': return md(`\`\`\`${lang ?? ''}\n${question.lines.join('\n')}\n\`\`\``, { lang });
    default: return h('span', { text: '' });
  }
}
```

- [ ] **Step 3: Escrever o executor de quiz**

`js/ui/components/quiz-runner.js`:
```js
import { h, mount, bar, pct, formatDuration, toneFor } from '../dom.js';
import { md } from '../markdown.js';
import { gradeQuestion } from '../../core/grading.js';
import { prepareQuestion } from '../../core/quiz.js';
import { recordAnswer, finishQuiz } from '../../core/actions.js';
import { createQuestionView, describeResponse, describeAnswer } from './question.js';
import { findModule } from './common.js';

export function runQuiz(container, app, opts) {
  const {
    questions, mode, kind, title, timer = false, language = null, moduleId = null,
    scopeLabel = '', moduleKeys = [], resultActions = [], headline = null,
  } = opts;
  if (!questions.length) {
    mount(container, h('section', { class: 'panel' },
      h('h1', { text: title }),
      h('p', { text: 'Não há perguntas disponíveis para este quiz.' })));
    return;
  }
  const answers = [];
  const startedAt = Date.now();
  let index = 0;
  let finished = false;
  app.setLeaveGuard(() => finished || answers.length === 0 || confirm('Sair do quiz? O progresso deste quiz será perdido.'));

  const elapsed = h('span', { class: 'timer', 'aria-label': 'Tempo decorrido', text: '0 s' });
  const tick = timer ? setInterval(() => {
    if (finished || !container.isConnected) {
      clearInterval(tick);
      return;
    }
    elapsed.textContent = formatDuration((Date.now() - startedAt) / 1000);
  }, 1000) : null;

  const lessonLink = (q) => {
    const found = findModule(app, q.module);
    const lesson = found?.module.lessons.find((l) => l.id === q.lesson);
    return lesson
      ? h('a', { class: 'link', href: `#/${found.language.id}/${found.module.id}/${lesson.id}`, text: `📖 Revise a aula "${lesson.title}"` })
      : null;
  };

  function showQuestion() {
    const q = questions[index];
    const hl = app.getLanguage(q.lang)?.highlight;
    const feedback = h('div', { class: 'feedback', 'aria-live': 'polite' });
    const next = h('button', { type: 'button', class: 'btn btn-primary', hidden: true, text: index === questions.length - 1 ? 'Ver resultado' : 'Próxima →' });
    next.addEventListener('click', () => {
      index += 1;
      if (index < questions.length) showQuestion();
      else finish();
    });
    const view = createQuestionView(q, { lang: hl, onSubmit: (response) => submit(q, response, view, feedback, next, hl) });
    mount(container, h('section', { class: 'quiz' },
      h('header', { class: 'quiz-head' },
        h('div', {},
          h('h1', { class: 'quiz-title', text: title }),
          h('p', { class: 'muted', text: `Pergunta ${index + 1} de ${questions.length}${mode === 'simulado' ? ' · Simulado' : ''}` })),
        timer ? elapsed : null),
      bar(index / questions.length, { label: 'Andamento do quiz' }),
      h('div', { class: 'panel' }, view.el, feedback, h('div', { class: 'quiz-nav' }, next))));
    requestAnimationFrame(() => view.focus());
  }

  function submit(q, response, view, feedback, next, hl) {
    const correct = gradeQuestion(q, response);
    answers[index] = { response, correct };
    app.dispatch(recordAnswer, { question: q, correct });
    const study = mode === 'estudo';
    view.reveal({ response, correct, showCorrect: study });
    if (study) {
      feedback.className = `feedback ${correct ? 'ok' : 'err'}`;
      mount(feedback,
        h('strong', { text: correct ? '✅ Correto!' : '❌ Não foi dessa vez.' }),
        md(q.explanation, { lang: hl }),
        correct ? null : lessonLink(q));
      app.layout.announce(correct ? 'Resposta correta.' : 'Resposta incorreta.');
    } else {
      mount(feedback, h('p', { class: 'muted', text: 'Resposta registrada.' }));
    }
    next.hidden = false;
    next.focus();
  }

  function finish() {
    finished = true;
    if (tick) clearInterval(tick);
    app.setLeaveGuard(null);
    const total = questions.length;
    const correct = answers.filter((a) => a.correct).length;
    const wrongIdx = questions.map((_, i) => i).filter((i) => !answers[i].correct);
    const durationSec = Math.round((Date.now() - startedAt) / 1000);
    app.dispatch(finishQuiz, {
      kind, mode, scopeLabel, moduleKeys, total, correct, durationSec, language, moduleId,
      questionIds: questions.map((q) => q.id),
      wrongIds: wrongIdx.map((i) => questions[i].id),
    });
    renderResult({ total, correct, durationSec, wrongIdx });
  }

  function reviewItem(i) {
    const q = questions[i];
    const found = findModule(app, q.module);
    const hl = found?.language.highlight;
    return h('article', { class: 'panel review-item' },
      h('span', { class: 'badge danger', text: found ? `${found.language.name} › ${found.module.title}` : q.module }),
      md(q.prompt, { lang: hl }),
      q.type === 'fill' ? h('pre', { class: 'fill-code' }, h('code', { text: q.code })) : null,
      h('div', { class: 'review-answer' }, h('span', { class: 'muted', text: 'Sua resposta: ' }), describeResponse(q, answers[i].response, hl)),
      h('div', { class: 'review-answer' }, h('span', { class: 'muted', text: 'Resposta certa: ' }), describeAnswer(q, hl)),
      md(q.explanation, { lang: hl }),
      lessonLink(q));
  }

  function renderResult({ total, correct, durationSec, wrongIdx }) {
    const rate = correct / total;
    const byModule = new Map();
    questions.forEach((q, i) => {
      const entry = byModule.get(q.module) ?? { ok: 0, total: 0 };
      entry.total += 1;
      if (answers[i].correct) entry.ok += 1;
      byModule.set(q.module, entry);
    });
    const retryWrong = () => runQuiz(container, app, {
      ...opts,
      questions: wrongIdx.map((i) => prepareQuestion(questions[i])),
      kind: 'review', mode: 'estudo', title: 'Refazendo as erradas', timer: false, headline: null,
    });
    mount(container, h('section', { class: 'quiz-result' },
      h('div', { class: 'panel center' },
        h('p', { class: 'muted', text: title }),
        h('div', { class: 'big-score', text: `${correct}/${total}` }),
        h('p', { text: `${pct(rate)} de acerto · ${formatDuration(durationSec)}` }),
        headline ? h('p', { class: 'headline', text: headline(rate) }) : null),
      h('h2', { text: 'Desempenho por módulo' }),
      h('div', { class: 'panel' }, [...byModule].map(([key, e]) => {
        const found = findModule(app, key);
        const label = found ? `${found.language.name} › ${found.module.title}` : key;
        return h('div', { class: 'module-bar' },
          h('div', { class: 'module-bar-label' }, h('span', { text: label }), h('span', { class: 'muted', text: `${e.ok}/${e.total} (${pct(e.ok / e.total)})` })),
          bar(e.ok / e.total, { tone: toneFor(e.ok / e.total), label }));
      })),
      wrongIdx.length ? h('h2', { text: 'Revise o que você errou' }) : h('p', { class: 'panel center', text: '🏆 Nenhum erro. Mandou bem!' }),
      wrongIdx.map(reviewItem),
      h('div', { class: 'actions' },
        wrongIdx.length ? h('button', { type: 'button', class: 'btn btn-primary', onClick: retryWrong, text: 'Refazer só as erradas' }) : null,
        wrongIdx.length ? h('a', { class: 'btn', href: '#/flashcards?modo=erros', text: 'Treinar erros nos flashcards' }) : null,
        resultActions.map((a) => (a.href
          ? h('a', { class: 'btn btn-ghost', href: a.href, text: a.label })
          : h('button', { type: 'button', class: 'btn btn-ghost', onClick: a.onClick, text: a.label }))))));
    app.layout.announce(`Quiz concluído: ${correct} de ${total}.`);
  }

  showQuestion();
}
```

- [ ] **Step 4: Escrever a tela de prática e registrar**

`js/ui/views/practice.js`:
```js
import { loadModuleBank } from '../../data/content.js';
import { selectQuestions, prepareQuestion } from '../../core/quiz.js';
import { PRACTICE_QUESTIONS } from '../../core/progress.js';
import { runQuiz } from '../components/quiz-runner.js';
import { renderNotFound } from './not-found.js';

export async function renderPractice(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  const module = language?.modules.find((m) => m.id === route.params.module);
  if (!module) return renderNotFound(container);
  const bank = await loadModuleBank(language, module);
  const state = app.store.get();
  const { questions } = selectQuestions({
    pool: bank.questions,
    count: PRACTICE_QUESTIONS,
    filters: { moduleKeys: [module.key] },
    questionStats: state.questions,
    lastQuizIds: state.lastQuizIds,
    today: app.ctx().today,
  });
  runQuiz(container, app, {
    questions: questions.map((q) => prepareQuestion(q)),
    mode: 'estudo',
    kind: 'practice',
    title: `Prática: ${module.title}`,
    language,
    moduleId: module.id,
    scopeLabel: `${language.name} › ${module.title}`,
    moduleKeys: [module.key],
    resultActions: [
      { label: 'Nova prática', onClick: () => app.refresh() },
      { label: `Voltar para ${language.name}`, href: `#/${language.id}` },
    ],
  });
}
```

Em `js/ui/views/index.js`, acrescente `import { renderPractice } from './practice.js';` e a entrada `practice: renderPractice,`.

- [ ] **Step 5: Rodar os testes**

Run: `npm test && node --check js/main.js`
Expected: PASS.

- [ ] **Step 6: Conferir no navegador**

Abra `#/java/fundamentos/pratica`.
Expected: 5 perguntas, com a ordem das opções embaralhada a cada tentativa. Múltipla escolha e V/F marcam a opção certa em verde e a errada em vermelho, mostram a explicação e, no erro, o link "Revise a aula". A lacuna aceita Enter para responder; "ParseInt" (com P maiúsculo) conta como erro e mostra "Resposta esperada: parseInt". Em "Ordenar", tocar numa linha e usar ↑/↓ ou as setas do teclado move a linha; no computador, arrastar também funciona; errar mostra a ordem correta colorida. Tentar sair no meio (clicar em "Início") pede confirmação. O resultado mostra a nota, a barra por módulo, a revisão das erradas e os botões. "Refazer só as erradas" roda só as erradas. Na página de Java, o módulo passa a mostrar "Melhor prática: X%".

- [ ] **Step 7: Commit**

```bash
git add js/ui tests/ui-imports.test.js
git commit -m "Adiciona perguntas interativas, executor de quiz e prática do módulo" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: Quiz personalizado, árvore de escopo e prova da linguagem

**Files:**
- Create: `js/ui/components/scope-tree.js`, `js/ui/views/quiz-builder.js`, `js/ui/views/exam.js`
- Modify: `js/ui/views/index.js` (registrar `quiz` e `exam`), `tests/ui-imports.test.js` (incluir `quiz`, `exam`)

**Interfaces:**
- Consumes: `hasStudiedModule`, `EXAM_QUESTIONS`, `EXAM_PASS` (progress.js); `filterPool`, `selectQuestions`, `prepareQuestion`, `pickExisting` (quiz.js); `loadBanks` (content.js); `runQuiz`.
- Produces:
  - scope-tree.js: `createScopeTree(app, { state, selected? }) → { el, getSelected() → moduleKeys[], onChange(fn(keys)) }` (sem `selected`, tudo vem marcado); `describeScope(app, keys) → string`.
  - quiz-builder.js: `renderQuizBuilder` (query `?modulo=<key>&foco=1` pré-configura; `?refazer=<historyId>` refaz as erradas de um item do histórico).
  - exam.js: `renderExam`.

- [ ] **Step 1: Ampliar o teste de telas obrigatórias (falhando)**

```js
  for (const name of ['home', 'notFound', 'language', 'lesson', 'reference', 'practice', 'quiz', 'exam']) assert.equal(typeof VIEWS[name], 'function', name);
```
Run: `node --test tests/ui-imports.test.js`
Expected: FAIL em `quiz`.

- [ ] **Step 2: Escrever a árvore de escopo**

`js/ui/components/scope-tree.js`:
```js
import { h } from '../dom.js';
import { hasStudiedModule } from '../../core/progress.js';

export function createScopeTree(app, { state, selected = null } = {}) {
  const allKeys = app.languages.flatMap((l) => l.modules.map((m) => m.key));
  const chosen = new Set(selected ?? allKeys);
  const listeners = [];
  const moduleBoxes = new Map();
  const langBoxes = new Map();

  function sync() {
    for (const [key, box] of moduleBoxes) box.checked = chosen.has(key);
    for (const l of app.languages) {
      const keys = l.modules.map((m) => m.key);
      const count = keys.filter((k) => chosen.has(k)).length;
      const box = langBoxes.get(l.id);
      box.checked = count === keys.length;
      box.indeterminate = count > 0 && count < keys.length;
    }
  }

  function changed() {
    sync();
    for (const fn of listeners) fn([...chosen]);
  }

  function setTo(keys) {
    chosen.clear();
    keys.forEach((k) => chosen.add(k));
    changed();
  }

  const studied = () => app.languages.flatMap((l) => l.modules.filter((m) => hasStudiedModule(state, l, m)).map((m) => m.key));
  const chip = (label, onClick) => h('button', { type: 'button', class: 'chip', onClick, text: label });

  const el = h('div', { class: 'scope-tree' },
    h('div', { class: 'chips' },
      chip('Tudo', () => setTo(allKeys)),
      chip('Só o que já estudei', () => setTo(studied())),
      app.languages.map((l) => chip(`${l.name} inteiro`, () => setTo(l.modules.map((m) => m.key))))),
    app.languages.map((l) => {
      const keys = l.modules.map((m) => m.key);
      const langBox = h('input', { type: 'checkbox' });
      langBoxes.set(l.id, langBox);
      langBox.addEventListener('change', () => {
        keys.forEach((k) => (langBox.checked ? chosen.add(k) : chosen.delete(k)));
        changed();
      });
      return h('div', { class: 'scope-lang' },
        h('label', { class: 'check strong' }, langBox, ` ${l.icon} ${l.name}`),
        h('div', { class: 'scope-mods' }, l.modules.map((m) => {
          const box = h('input', { type: 'checkbox' });
          moduleBoxes.set(m.key, box);
          box.addEventListener('change', () => {
            if (box.checked) chosen.add(m.key);
            else chosen.delete(m.key);
            changed();
          });
          return h('label', { class: 'check' }, box, ` ${m.title}`);
        })));
    }));
  sync();
  return { el, getSelected: () => [...chosen], onChange: (fn) => listeners.push(fn) };
}

export function describeScope(app, keys) {
  const set = new Set(keys);
  const parts = [];
  let everything = true;
  for (const l of app.languages) {
    const mods = l.modules.filter((m) => set.has(m.key));
    if (mods.length !== l.modules.length) everything = false;
    if (!mods.length) continue;
    parts.push(mods.length === l.modules.length ? `${l.name} inteiro` : `${l.name} › ${mods.map((m) => m.title).join(', ')}`);
  }
  if (everything && app.languages.length > 1) return 'Tudo';
  return parts.join(' + ') || '—';
}
```

- [ ] **Step 3: Escrever o quiz personalizado**

`js/ui/views/quiz-builder.js`:
```js
import { h, mount, plural } from '../dom.js';
import { loadBanks } from '../../data/content.js';
import { filterPool, selectQuestions, prepareQuestion, pickExisting } from '../../core/quiz.js';
import { createScopeTree, describeScope } from '../components/scope-tree.js';
import { runQuiz } from '../components/quiz-runner.js';

const COUNTS = [10, 20, 30, 50];
const DIFFICULTIES = [[1, 'Fácil'], [2, 'Médio'], [3, 'Difícil']];
const TYPES = [['multiple', 'Múltipla escolha'], ['truefalse', 'Verdadeiro ou falso'], ['fill', 'Lacuna'], ['order', 'Ordenar linhas']];

const fieldset = (legend, ...children) => h('fieldset', { class: 'field' }, h('legend', { text: legend }), children);

function checkbox(label, checked, onChange) {
  const input = h('input', { type: 'checkbox' });
  input.checked = checked;
  input.addEventListener('change', () => onChange(input.checked));
  return h('label', { class: 'check' }, input, ` ${label}`);
}

function radioGroup(name, options, current, onChange) {
  return h('div', { class: 'radio-group' }, options.map(([value, label]) => {
    const input = h('input', { type: 'radio', name });
    input.checked = value === current;
    input.addEventListener('change', () => { if (input.checked) onChange(value); });
    return h('label', { class: 'check' }, input, ` ${label}`);
  }));
}

const toggle = (set, value, on) => (on ? set.add(value) : set.delete(value));

function retake(container, app, bank, historyId) {
  const entry = app.store.get().history.find((e) => e.id === historyId);
  const questions = entry ? pickExisting(entry.wrongIds, bank.questions) : [];
  if (!questions.length) {
    mount(container, h('section', { class: 'panel' },
      h('h1', { text: 'Nada para refazer' }),
      h('p', { text: 'Não encontramos as perguntas desse quiz. Elas podem ter sido removidas do conteúdo.' }),
      h('a', { class: 'btn', href: '#/quiz', text: 'Montar um quiz' })));
    return;
  }
  runQuiz(container, app, {
    questions: questions.map((q) => prepareQuestion(q)),
    mode: 'estudo', kind: 'review', title: 'Refazendo as erradas',
    scopeLabel: entry.scopeLabel, moduleKeys: entry.moduleKeys ?? [],
    resultActions: [{ label: 'Ver histórico', href: '#/perfil' }],
  });
}

export async function renderQuizBuilder(container, app, route) {
  const bank = await loadBanks(app.languages);
  if (route.query.refazer) return retake(container, app, bank, route.query.refazer);
  const state = app.store.get();
  const preset = route.query.modulo ? [route.query.modulo] : null;
  const tree = createScopeTree(app, { state, selected: preset });
  const choice = {
    count: 10,
    difficulties: new Set([1, 2, 3]),
    types: new Set(TYPES.map(([t]) => t)),
    mode: 'estudo',
    timer: false,
    focusWeak: route.query.foco === '1',
  };
  const filters = () => ({ moduleKeys: tree.getSelected(), difficulties: [...choice.difficulties], types: [...choice.types] });
  const available = h('p', { class: 'muted', 'aria-live': 'polite' });
  const startBtn = h('button', { type: 'submit', class: 'btn btn-primary', text: 'Começar quiz' });
  const timerBox = checkbox('Mostrar cronômetro', choice.timer, (on) => { choice.timer = on; });
  const timerInput = timerBox.querySelector('input');
  timerInput.disabled = true;

  function updateAvailable() {
    const n = filterPool(bank.questions, filters()).length;
    available.textContent = `${n} ${plural(n, 'pergunta disponível', 'perguntas disponíveis')} com esses filtros.`;
    startBtn.disabled = n === 0;
  }
  tree.onChange(updateAvailable);

  const form = h('form', { class: 'quiz-builder' },
    h('h1', { text: '🎯 Monte seu quiz' }),
    fieldset('Escopo', tree.el),
    fieldset('Quantidade', radioGroup('quantidade', COUNTS.map((n) => [n, `${n} perguntas`]), choice.count, (v) => { choice.count = v; })),
    fieldset('Dificuldade', DIFFICULTIES.map(([v, label]) => checkbox(label, true, (on) => { toggle(choice.difficulties, v, on); updateAvailable(); }))),
    fieldset('Tipos de pergunta', TYPES.map(([v, label]) => checkbox(label, true, (on) => { toggle(choice.types, v, on); updateAvailable(); }))),
    fieldset('Modo',
      radioGroup('modo', [['estudo', 'Estudo: correção a cada pergunta'], ['simulado', 'Simulado: correção só no final']], choice.mode, (v) => {
        choice.mode = v;
        timerInput.disabled = v !== 'simulado';
      }),
      timerBox),
    fieldset('Preferência', checkbox('Focar nos meus pontos fracos', choice.focusWeak, (on) => { choice.focusWeak = on; })),
    available,
    startBtn);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const s = app.store.get();
    const { questions, available: n } = selectQuestions({
      pool: bank.questions,
      count: choice.count,
      filters: filters(),
      questionStats: s.questions,
      lastQuizIds: s.lastQuizIds,
      focusWeak: choice.focusWeak,
      today: app.ctx().today,
    });
    if (!questions.length) return;
    if (n < choice.count) app.layout.toast(`Só havia ${n} ${plural(n, 'pergunta', 'perguntas')} com esses filtros; o quiz vai usar todas.`);
    const keys = tree.getSelected();
    runQuiz(container, app, {
      questions: questions.map((q) => prepareQuestion(q)),
      mode: choice.mode,
      kind: 'quiz',
      timer: choice.mode === 'simulado' && choice.timer,
      title: 'Quiz personalizado',
      scopeLabel: describeScope(app, keys),
      moduleKeys: keys,
      resultActions: [{ label: 'Montar outro quiz', onClick: () => app.go('#/quiz') }],
    });
  });

  mount(container, form);
  updateAvailable();
}
```

- [ ] **Step 4: Escrever a prova**

`js/ui/views/exam.js`:
```js
import { h, mount, pct, formatDay } from '../dom.js';
import { loadBanks } from '../../data/content.js';
import { selectQuestions, prepareQuestion } from '../../core/quiz.js';
import { EXAM_QUESTIONS, EXAM_PASS } from '../../core/progress.js';
import { runQuiz } from '../components/quiz-runner.js';
import { renderNotFound } from './not-found.js';

export async function renderExam(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  if (!language) return renderNotFound(container);
  const bank = await loadBanks([language]);
  const best = app.store.get().exams[language.id];
  const count = Math.min(EXAM_QUESTIONS, bank.questions.length);
  const moduleKeys = language.modules.map((m) => m.key);

  const start = () => {
    // Sem histórico nem "último quiz": a prova sorteia todas as perguntas com o mesmo peso.
    const { questions } = selectQuestions({ pool: bank.questions, count: EXAM_QUESTIONS, filters: { moduleKeys }, today: app.ctx().today });
    runQuiz(container, app, {
      questions: questions.map((q) => prepareQuestion(q)),
      mode: 'simulado',
      kind: 'exam',
      timer: true,
      title: `Prova de ${language.name}`,
      language,
      scopeLabel: `${language.name} inteiro`,
      moduleKeys,
      headline: (rate) => (rate >= EXAM_PASS
        ? '🎉 Você passou na prova!'
        : `Ainda não foi dessa vez: são necessários ${pct(EXAM_PASS)}. Revise os pontos fracos e tente de novo.`),
      resultActions: [{ label: `Voltar para ${language.name}`, href: `#/${language.id}` }],
    });
  };

  mount(container, h('section', { class: 'panel exam-intro', style: { '--accent': language.color } },
    h('h1', { text: `🎯 Prova de ${language.name}` }),
    h('ul', {},
      h('li', { text: `${count} perguntas de todos os módulos` }),
      h('li', { text: 'Correção só no final (modo simulado)' }),
      h('li', { text: `Aprovação com ${pct(EXAM_PASS)} ou mais` }),
      h('li', { text: 'O tempo aparece na tela, mas não há limite' })),
    best ? h('p', { text: `Sua melhor nota: ${pct(best.best)}${best.passedAt ? ` · prova aprovada em ${formatDay(best.passedAt)}` : ''}` }) : null,
    h('button', { type: 'button', class: 'btn btn-primary', onClick: start, text: 'Começar a prova' })));
}
```

Em `js/ui/views/index.js`, acrescente:
```js
import { renderQuizBuilder } from './quiz-builder.js';
import { renderExam } from './exam.js';
```
e as entradas `quiz: renderQuizBuilder,` e `exam: renderExam,`.

- [ ] **Step 5: Rodar os testes**

Run: `npm test && node --check js/main.js`
Expected: PASS.

- [ ] **Step 6: Conferir no navegador**

Abra `#/quiz`.
Expected: a árvore mostra "Java" e "Fundamentos" marcados e "20 perguntas disponíveis com esses filtros". Desmarcar todos os tipos mostra "0 perguntas disponíveis" e desativa o botão. Marcar só "Lacuna" mostra 3. Pedir 50 perguntas avisa "Só havia 20 perguntas..." e roda as 20. "Só o que já estudei" sem aulas concluídas desmarca tudo. No modo Simulado com cronômetro, o tempo corre e a correção só aparece no resultado. `#/quiz?modulo=java.fundamentos&foco=1` abre com o módulo e o foco marcados. `#/java/prova` mostra a introdução com "20 perguntas" (o piloto tem 20) e roda em modo simulado com cronômetro; o resultado diz se passou. Depois de um quiz com erros, `#/quiz?refazer=q1` (troque pelo id do histórico) refaz só as erradas.

- [ ] **Step 7: Commit**

```bash
git add js/ui tests/ui-imports.test.js
git commit -m "Adiciona quiz personalizado com escopo livre e prova da linguagem" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 19: Flashcards

**Files:**
- Create: `js/ui/views/flashcards.js`
- Modify: `js/ui/views/index.js` (registrar `flashcards`), `tests/ui-imports.test.js` (incluir `flashcards`)

**Interfaces:**
- Consumes: `isDue`, `isMastered`, `RATING` (srs.js); `reviewCard` (actions.js); `shuffle` (random.js); `prepareQuestion`, `pickExisting` (quiz.js); `loadBanks`; `createScopeTree`; `runQuiz`; `findModule`; `md`.
- Produces: `renderFlashcards` (query `?modo=erros` abre direto o treino de erros). Devolve uma função de limpeza que remove o atalho de teclado.

- [ ] **Step 1: Ampliar o teste de telas obrigatórias (falhando)**

```js
  for (const name of ['home', 'notFound', 'language', 'lesson', 'reference', 'practice', 'quiz', 'exam', 'flashcards']) assert.equal(typeof VIEWS[name], 'function', name);
```
Run: `node --test tests/ui-imports.test.js`
Expected: FAIL em `flashcards`.

- [ ] **Step 2: Escrever a tela**

`js/ui/views/flashcards.js`:
```js
import { h, mount, plural } from '../dom.js';
import { md } from '../markdown.js';
import { loadBanks } from '../../data/content.js';
import { isDue, isMastered, RATING } from '../../core/srs.js';
import { reviewCard } from '../../core/actions.js';
import { shuffle } from '../../core/random.js';
import { prepareQuestion, pickExisting } from '../../core/quiz.js';
import { createScopeTree } from '../components/scope-tree.js';
import { runQuiz } from '../components/quiz-runner.js';
import { findModule, statCard } from '../components/common.js';

const MAX_REQUEUE = 2;

export async function renderFlashcards(container, app, route) {
  const bank = await loadBanks(app.languages);
  const tree = createScopeTree(app, { state: app.store.get() });
  let keyHandler = null;
  let filterOpen = false;

  const stopKeys = () => {
    if (keyHandler) document.removeEventListener('keydown', keyHandler);
    keyHandler = null;
  };
  const unlockedInScope = () => {
    const state = app.store.get();
    const scope = new Set(tree.getSelected());
    return bank.cards.filter((c) => state.cards[c.id] && scope.has(c.module));
  };

  function home() {
    stopKeys();
    const state = app.store.get();
    const { today } = app.ctx();
    const cards = unlockedInScope();
    const due = cards.filter((c) => isDue(state.cards[c.id], today));
    const mastered = cards.filter((c) => isMastered(state.cards[c.id]));
    const mistakes = pickExisting(state.mistakes, bank.questions);
    mount(container,
      h('section', {},
        h('h1', { text: '🧠 Flashcards' }),
        h('p', { class: 'muted', text: 'Tente lembrar a resposta antes de virar a carta. As cartas voltam no intervalo certo para fixar de vez.' })),
      h('div', { class: 'grid stats' },
        statCard('Para revisar hoje', String(due.length)),
        statCard('Aprendendo', String(cards.length - mastered.length)),
        statCard('Dominadas', String(mastered.length)),
        statCard('Liberadas', String(cards.length))),
      h('details', { class: 'panel', open: filterOpen || null, onToggle: (e) => { filterOpen = e.target.open; } },
        h('summary', { text: 'Filtrar por linguagem e módulo' }), tree.el),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn btn-primary', disabled: !due.length || null, onClick: () => session(shuffle(due), true), text: `Revisar pendentes (${due.length})` }),
        h('button', { type: 'button', class: 'btn', disabled: !cards.length || null, onClick: () => session(shuffle(cards), false), text: 'Estudo livre' }),
        h('button', { type: 'button', class: 'btn', disabled: !mistakes.length || null, onClick: startErrors, text: `Meus erros (${mistakes.length})` })),
      cards.length ? null : h('div', { class: 'callout callout-tip' },
        h('strong', { class: 'callout-title', text: 'Nenhuma carta liberada ainda' }),
        h('p', { text: 'As cartas aparecem quando você conclui as aulas. Se já conhece o assunto, use "Ativar todas as cartas deste módulo" na página da linguagem.' })),
      h('div', { class: 'callout callout-note' },
        h('strong', { class: 'callout-title', text: 'Como funciona' }),
        h('p', { text: 'Errei: a carta volta ao começo e reaparece no fim da sessão. Difícil: fica no mesmo nível e volta mais cedo. Fácil: sobe de nível e só volta depois de 1, 3, 7, 14, 30 ou 60 dias. A partir do nível 6, a carta conta como dominada.' })));
  }

  function session(queue, scheduled) {
    const requeued = new Map();
    const tally = { [RATING.AGAIN]: 0, [RATING.HARD]: 0, [RATING.EASY]: 0 };
    let pos = 0;
    let flipped = false;
    let cardEl = null;
    let rateEl = null;

    function show() {
      flipped = false;
      const card = queue[pos];
      const found = findModule(app, card.module);
      const hl = found?.language.highlight;
      const st = app.store.get().cards[card.id];
      cardEl = h('div', { class: 'flashcard', role: 'button', tabindex: 0, 'aria-label': 'Carta. Aperte Espaço ou Enter para virar.', onClick: flip },
        h('div', { class: 'flashcard-inner' },
          h('div', { class: 'flashcard-face front' },
            h('span', { class: 'fc-tag', text: found ? `${found.language.name} › ${found.module.title}` : '' }),
            st ? h('span', { class: 'fc-level', text: `Nível ${st.box + 1}/7` }) : null,
            md(card.front, { lang: hl }),
            h('span', { class: 'fc-hint', text: 'Toque ou aperte Espaço para virar' })),
          h('div', { class: 'flashcard-face back' },
            h('span', { class: 'fc-tag', text: 'Resposta' }),
            md(card.back, { lang: hl }))));
      const rateBtn = (value, label, hint, tone) => h('button', { type: 'button', class: `rate-btn ${tone}`, onClick: () => answer(value) }, label, h('small', { text: hint }));
      rateEl = h('div', { class: 'rate', hidden: true },
        rateBtn(RATING.AGAIN, '🔴 Errei', 'recomeça', 'bad'),
        rateBtn(RATING.HARD, '🟡 Difícil', 'volta antes', 'mid'),
        rateBtn(RATING.EASY, '🟢 Fácil', 'sobe de nível', 'good'));
      mount(container, h('section', { class: 'fc-session' },
        h('p', { class: 'muted center', text: `Carta ${pos + 1} de ${queue.length}${scheduled ? '' : ' · estudo livre'}` }),
        cardEl,
        rateEl,
        h('p', { class: 'muted center small', text: 'Teclas: Espaço vira · 1 Errei · 2 Difícil · 3 Fácil' }),
        h('div', { class: 'center' }, h('button', { type: 'button', class: 'btn btn-ghost btn-sm', onClick: done, text: 'Encerrar sessão' }))));
      requestAnimationFrame(() => cardEl.focus());
    }

    function flip() {
      if (flipped) return;
      flipped = true;
      cardEl.classList.add('flipped');
      rateEl.hidden = false;
      app.layout.announce('Resposta revelada. Avalie: Errei, Difícil ou Fácil.');
      rateEl.querySelector('button').focus();
    }

    function answer(value) {
      const card = queue[pos];
      tally[value] += 1;
      if (scheduled) app.dispatch(reviewCard, { cardId: card.id, rating: value });
      const times = requeued.get(card.id) ?? 0;
      if (value === RATING.AGAIN && times < MAX_REQUEUE) {
        requeued.set(card.id, times + 1);
        queue.push(card);
      }
      pos += 1;
      if (pos < queue.length) show();
      else done();
    }

    function done() {
      stopKeys();
      const total = tally[RATING.AGAIN] + tally[RATING.HARD] + tally[RATING.EASY];
      mount(container, h('section', { class: 'panel center' },
        h('div', { class: 'big-emoji', text: '🎉' }),
        h('h1', { text: 'Sessão concluída!' }),
        h('p', { text: `Você revisou ${total} ${plural(total, 'carta', 'cartas')}: 🟢 ${tally[RATING.EASY]} fáceis · 🟡 ${tally[RATING.HARD]} difíceis · 🔴 ${tally[RATING.AGAIN]} erradas.` }),
        h('p', { class: 'muted', text: scheduled ? 'As cartas voltam no intervalo certo. Volte amanhã para manter a sequência!' : 'No estudo livre, o agendamento das cartas não muda.' }),
        h('button', { type: 'button', class: 'btn btn-primary', onClick: home, text: 'Voltar ao painel' })));
    }

    stopKeys();
    keyHandler = (event) => {
      if (!container.isConnected) {
        stopKeys();
        return;
      }
      if (!flipped && (event.key === ' ' || (event.key === 'Enter' && event.target === cardEl))) {
        event.preventDefault();
        flip();
        return;
      }
      if (flipped && ['1', '2', '3'].includes(event.key)) {
        event.preventDefault();
        answer(Number(event.key));
      }
    };
    document.addEventListener('keydown', keyHandler);
    show();
  }

  function startErrors() {
    stopKeys();
    const questions = shuffle(pickExisting(app.store.get().mistakes, bank.questions));
    if (!questions.length) {
      home();
      return;
    }
    runQuiz(container, app, {
      questions: questions.map((q) => prepareQuestion(q)),
      mode: 'estudo',
      kind: 'review',
      title: 'Meus erros',
      scopeLabel: 'Meus erros',
      moduleKeys: [...new Set(questions.map((q) => q.module))],
      resultActions: [{ label: 'Voltar aos flashcards', onClick: () => app.go('#/flashcards') }],
    });
  }

  tree.onChange(() => home());
  if (route.query.modo === 'erros') startErrors();
  else home();
  return stopKeys;
}
```

Em `js/ui/views/index.js`, acrescente `import { renderFlashcards } from './flashcards.js';` e `flashcards: renderFlashcards,`.

- [ ] **Step 3: Rodar os testes**

Run: `npm test && node --check js/main.js`
Expected: PASS.

- [ ] **Step 4: Conferir no navegador**

Abra `#/flashcards` sem aulas concluídas.
Expected: "Liberadas: 0" e o aviso "Nenhuma carta liberada ainda". Conclua a aula "Operadores" e volte: "Para revisar hoje: 3" e o menu mostra o número 3. Em "Revisar pendentes", Espaço vira a carta e 1/2/3 avaliam. Uma carta marcada como "Errei" reaparece no fim da sessão. O resumo mostra as contagens, e o topo ganha +2 XP por carta (só na primeira revisão do dia). "Estudo livre" não muda o número de pendentes. "Meus erros" refaz as perguntas erradas no tipo original, e acertar remove a pergunta da contagem. `#/flashcards?modo=erros` abre direto o treino de erros. Trocar de página no meio da sessão e apertar Espaço não causa erro no console.

- [ ] **Step 5: Commit**

```bash
git add js/ui tests/ui-imports.test.js
git commit -m "Adiciona flashcards com revisão do dia, estudo livre e meus erros" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 20: Perfil e certificado

**Files:**
- Create: `js/ui/views/profile.js`, `js/ui/views/certificate.js`
- Modify: `js/ui/views/index.js` (registrar `perfil` e `certificate`), `tests/ui-imports.test.js` (incluir `perfil`, `certificate`)

**Interfaces:**
- Consumes: `levelInfo`, `displayStreak` (gamification.js); `languageProgress`, `isLanguageComplete`, `languageCompletionDay`, `isModuleComplete`, `moduleLessonsDone`, `totalMinutes`, `PRACTICE_PASS`, `EXAM_PASS` (progress.js); `languageAccuracy`, `masteredCount`, `activityGrid`, `activityLevel`, `totals` (stats.js); `weakPointsSection`; `statCard`.
- Produces: `renderProfile`, `renderCertificate`, `certificateCode(name, langId, day) → Promise<'CL-<LANG>-<8 hex>'>`.

- [ ] **Step 1: Ampliar o teste de telas obrigatórias (falhando)**

```js
  for (const name of ['home', 'notFound', 'language', 'lesson', 'reference', 'practice', 'quiz', 'exam', 'flashcards', 'perfil', 'certificate']) assert.equal(typeof VIEWS[name], 'function', name);
```
Run: `node --test tests/ui-imports.test.js`
Expected: FAIL em `perfil`.

- [ ] **Step 2: Escrever o perfil**

`js/ui/views/profile.js`:
```js
import { h, mount, bar, pct, plural, formatDay, formatDateTime, formatDuration, toneFor } from '../dom.js';
import { levelInfo, displayStreak } from '../../core/gamification.js';
import { languageProgress } from '../../core/progress.js';
import { languageAccuracy, masteredCount, activityGrid, activityLevel, totals } from '../../core/stats.js';
import { weakPointsSection } from '../components/weak-points.js';
import { statCard } from '../components/common.js';

const KIND_LABEL = { practice: 'Prática', quiz: 'Quiz', exam: 'Prova', review: 'Revisão de erros' };

function heatmap(state, today) {
  const goal = state.profile.dailyGoal;
  const cells = activityGrid(state.xp.byDay, today, 12);
  const describe = (c) => `${formatDay(c.day)}: ${c.xp === null ? 'sem estudo' : `${c.xp} XP`}`;
  return h('section', { class: 'panel' },
    h('div', { class: 'heatmap', role: 'img', 'aria-label': `Calendário de atividade das últimas 12 semanas: ${cells.filter((c) => c.xp !== null).length} dias com estudo.` },
      cells.map((c) => h('span', { class: `hm-cell hm-${activityLevel(c.xp, goal)}`, title: describe(c) }))),
    h('div', { class: 'hm-legend muted small' },
      'Menos ', [0, 1, 2, 3, 4].map((n) => h('span', { class: `hm-cell hm-${n}` })), ' Mais'));
}

function languageCards(app, state) {
  return h('div', { class: 'grid langs' }, app.languages.map((l) => {
    const p = languageProgress(state, l);
    const acc = languageAccuracy(state, l.id);
    return h('div', { class: 'panel lang-card', style: { '--accent': l.color } },
      h('span', { class: 'lang-icon', text: l.icon }),
      h('strong', { text: l.name }),
      bar(p.percent, { label: `Progresso em ${l.name}` }),
      h('span', { class: 'small', text: `${p.lessonsDone}/${p.lessonsTotal} aulas · ${p.modulesDone}/${p.modulesTotal} módulos` }),
      h('span', { class: 'small muted', text: acc.rate === null ? 'Sem respostas ainda' : `${pct(acc.rate)} de acerto em ${acc.seen} respostas` }),
      h('span', { class: 'small muted', text: `${masteredCount(state, `${l.id}.`)} cartas dominadas` }));
  }));
}

function achievementsGrid(app, state) {
  return h('div', { class: 'grid achievements' }, app.achievementTexts.map((a) => {
    const at = state.achievements[a.id];
    return h('div', { class: `achievement ${at ? 'unlocked' : 'locked'}` },
      h('span', { class: 'ach-icon', 'aria-hidden': 'true', text: a.icon }),
      h('div', {},
        h('strong', { text: a.name }),
        at ? null : h('span', { class: 'sr-only', text: '(bloqueada)' }),
        h('p', { class: 'small', text: at ? a.description : a.hint }),
        at ? h('p', { class: 'small muted', text: `Desbloqueada em ${formatDay(at)}` }) : null));
  }));
}

function historyList(state) {
  if (!state.history.length) return h('p', { class: 'muted', text: 'Seus quizzes, práticas e provas aparecem aqui.' });
  return h('ul', { class: 'history' }, state.history.map((e) => h('li', { class: 'panel history-item' },
    h('div', {},
      h('strong', { text: `${KIND_LABEL[e.kind] ?? e.kind}${e.kind === 'quiz' && e.mode === 'simulado' ? ' (simulado)' : ''}` }),
      h('p', { class: 'small muted', text: `${formatDateTime(e.at)} · ${e.scopeLabel || '—'} · ${formatDuration(e.durationSec)}` })),
    h('span', { class: `badge ${toneFor(e.total ? e.correct / e.total : 0)}`, text: `${e.correct}/${e.total}` }),
    e.wrongIds.length ? h('a', { class: 'btn btn-sm btn-ghost', href: `#/quiz?refazer=${encodeURIComponent(e.id)}`, text: 'Refazer erradas' }) : null)));
}

export async function renderProfile(container, app) {
  const state = app.store.get();
  const { today } = app.ctx();
  const info = levelInfo(state.xp.total);
  const t = totals(state);
  const streak = displayStreak(state.streak, today);
  const weak = await weakPointsSection(app, state);
  mount(container,
    h('section', { class: 'panel profile-head' },
      h('div', { class: 'avatar-big', 'aria-hidden': 'true', text: state.profile.avatar }),
      h('div', {},
        h('h1', { text: state.profile.name }),
        h('p', { class: 'muted', text: `Nível ${info.level} · ${info.title} · ${state.xp.total} XP no total` }),
        bar(info.progress, { label: 'Progresso para o próximo nível' }),
        h('p', { class: 'small muted', text: `${info.current}/${info.needed} XP para o nível ${info.level + 1}` }))),
    h('div', { class: 'grid stats' },
      statCard('Sequência', `🔥 ${streak} ${plural(streak, 'dia', 'dias')}`, `Recorde: ${state.streak.best} ${plural(state.streak.best, 'dia', 'dias')}`),
      statCard('Meta diária', `${state.profile.dailyGoal} XP`, `Cumprida em ${state.counters.goalDays} ${plural(state.counters.goalDays, 'dia', 'dias')}`),
      statCard('Perguntas', String(t.answered), t.accuracy === null ? 'Sem respostas ainda' : `${pct(t.accuracy)} de acerto`),
      statCard('Cartas revisadas', String(t.cardReviews), `${t.daysStudied} ${plural(t.daysStudied, 'dia', 'dias')} de estudo`)),
    h('h2', { text: 'Por linguagem' }),
    languageCards(app, state),
    weak,
    h('h2', { text: 'Atividade nas últimas 12 semanas' }),
    heatmap(state, today),
    h('h2', { text: 'Conquistas' }),
    achievementsGrid(app, state),
    h('h2', { text: 'Histórico' }),
    historyList(state));
}
```

- [ ] **Step 3: Escrever o certificado**

`js/ui/views/certificate.js`:
```js
import { h, mount, pct, formatDay } from '../dom.js';
import { APP_NAME } from '../../config.js';
import {
  isLanguageComplete, languageCompletionDay, isModuleComplete, moduleLessonsDone, totalMinutes, PRACTICE_PASS, EXAM_PASS,
} from '../../core/progress.js';
import { renderNotFound } from './not-found.js';

export async function certificateCode(name, langId, day) {
  const data = new TextEncoder().encode(`${name}|${langId}|${day}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 8).toUpperCase();
  return `CL-${langId.toUpperCase()}-${hex}`;
}

function renderLocked(container, state, language) {
  const pending = language.modules.filter((m) => !isModuleComplete(state, language, m));
  const examBest = state.exams[language.id]?.best;
  const examOk = examBest !== undefined && examBest >= EXAM_PASS;
  mount(container, h('section', { class: 'panel' },
    h('h1', { text: `🔒 Certificado de ${language.name}` }),
    h('p', { text: 'Para liberar o certificado, falta concluir:' }),
    h('ul', {},
      pending.map((m) => h('li', { text: `${m.title}: ${moduleLessonsDone(state, language, m)}/${m.lessons.length} aulas e pelo menos ${pct(PRACTICE_PASS)} na prática` })),
      examOk ? null : h('li', { text: `A prova de ${language.name}, com ${pct(EXAM_PASS)} ou mais${examBest !== undefined ? ` (sua melhor nota: ${pct(examBest)})` : ''}` })),
    h('a', { class: 'btn', href: `#/${language.id}`, text: `Voltar para ${language.name}` })));
}

export async function renderCertificate(container, app, route) {
  const language = app.getLanguage(route.params.lang);
  if (!language) return renderNotFound(container);
  const state = app.store.get();
  if (!isLanguageComplete(state, language)) return renderLocked(container, state, language);
  const day = languageCompletionDay(state, language);
  const code = await certificateCode(state.profile.name, language.id, day);
  const hours = Math.max(1, Math.ceil(totalMinutes(language) / 60));
  mount(container,
    h('div', { class: 'cert-actions no-print' },
      h('a', { class: 'btn btn-ghost', href: `#/${language.id}`, text: `← ${language.name}` }),
      h('button', { type: 'button', class: 'btn btn-primary', onClick: () => window.print(), text: '🖨️ Imprimir ou salvar PDF' })),
    h('article', { class: 'certificate', style: { '--accent': language.color } },
      h('p', { class: 'cert-brand', text: APP_NAME }),
      h('h1', { text: 'Certificado de Conclusão' }),
      h('p', { class: 'cert-lead', text: 'Certificamos que' }),
      h('p', { class: 'cert-name', text: state.profile.name }),
      h('p', { class: 'cert-lead' },
        'concluiu os estudos de ', h('strong', { text: `${language.icon} ${language.name}` }),
        `, com carga horária aproximada de ${hours} ${hours === 1 ? 'hora' : 'horas'}, em ${formatDay(day)}.`),
      h('div', { class: 'cert-modules' },
        h('p', { class: 'eyebrow', text: 'Módulos concluídos' }),
        h('ul', {}, language.modules.map((m) => h('li', { text: m.title })))),
      h('p', { text: `Nota na prova final: ${pct(state.exams[language.id].best)}` }),
      h('p', { class: 'cert-code', text: `Código: ${code}` }),
      h('p', { class: 'cert-foot', text: 'Certificado de estudo livre, emitido localmente.' })));
}
```

Em `js/ui/views/index.js`, acrescente:
```js
import { renderProfile } from './profile.js';
import { renderCertificate } from './certificate.js';
```
e as entradas `perfil: renderProfile,` e `certificate: renderCertificate,`.

- [ ] **Step 4: Rodar os testes**

Run: `npm test && node --check js/main.js`
Expected: PASS.

- [ ] **Step 5: Conferir no navegador**

Abra `#/perfil`.
Expected: avatar, nome, nível e título, barra para o próximo nível; os cartões de sequência, meta, perguntas e cartas; o cartão de Java com acerto e cartas dominadas; pontos fracos; o calendário de 12 semanas com o dia de hoje colorido e a legenda; as 21 conquistas (as ganhas com data, as bloqueadas em cinza com a dica); o histórico com "Refazer erradas" nos itens com erro. `#/java/certificado` mostra o que falta. Para ver o certificado liberado: conclua as 6 aulas, tire 60% ou mais na prática e 70% ou mais na prova. Ele mostra nome, carga horária "1 hora", data, módulos, nota, código `CL-JAVA-XXXXXXXX` e o rodapé. "Imprimir ou salvar PDF" abre a impressão só com o certificado, em paisagem.

- [ ] **Step 6: Commit**

```bash
git add js/ui tests/ui-imports.test.js
git commit -m "Adiciona perfil com estatísticas, conquistas, histórico e certificado" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 21: Configurações e backup

**Files:**
- Create: `js/ui/views/settings.js`
- Modify: `js/ui/views/index.js` (registrar `config`), `tests/ui-imports.test.js` (incluir `config`)

**Interfaces:**
- Consumes: `setProfile`, `updateBackupMeta`, `resetProgress` (actions.js); `exportNow`, `importFromFile`, `canUndoImport`, `undoImport` (backup-flow.js); `profileFields`; `APP_NAME`, `PRE_IMPORT_KEY` (config.js); `app.autoBackup`.
- Produces: `renderSettings`.

- [ ] **Step 1: Ampliar o teste de telas obrigatórias (falhando)**

```js
  for (const name of ['home', 'notFound', 'language', 'lesson', 'reference', 'practice', 'quiz', 'exam', 'flashcards', 'perfil', 'certificate', 'config']) assert.equal(typeof VIEWS[name], 'function', name);
```
Run: `node --test tests/ui-imports.test.js`
Expected: FAIL em `config`.

- [ ] **Step 2: Escrever a tela**

`js/ui/views/settings.js`:
```js
import { h, mount, formatDateTime } from '../dom.js';
import { APP_NAME, PRE_IMPORT_KEY } from '../../config.js';
import { setProfile, updateBackupMeta, resetProgress } from '../../core/actions.js';
import { exportNow, importFromFile, canUndoImport, undoImport } from '../backup-flow.js';
import { profileFields } from '../components/profile-fields.js';

function autoBackupSection(app) {
  const { autoBackup } = app;
  const { backup } = app.store.get();
  const status = autoBackup.status();
  const rerender = () => {
    app.updateBanners(app.store.get());
    app.refresh();
  };
  const run = (fn) => async () => {
    try {
      await fn();
    } catch (err) {
      if (err?.name !== 'AbortError') app.layout.toast(`Não foi possível configurar o backup automático: ${err.message}`, { tone: 'danger' });
    }
    rerender();
  };
  const disableBtn = () => h('button', {
    type: 'button', class: 'btn btn-ghost', text: 'Desativar',
    onClick: run(async () => {
      await autoBackup.disable();
      app.dispatch(updateBackupMeta, { autoFileEnabled: false, autoFileError: null });
    }),
  });

  let body;
  if (status === 'unsupported') {
    body = [h('p', { class: 'muted', text: 'Disponível no Chrome e no Edge para computador. Neste navegador, use o backup manual acima.' })];
  } else if (status === 'off') {
    body = [
      h('p', { class: 'muted', text: 'Escolha um arquivo no seu computador. O progresso será gravado nele automaticamente, poucos segundos depois de cada mudança.' }),
      h('button', {
        type: 'button', class: 'btn btn-primary', text: 'Ativar backup automático',
        onClick: run(async () => {
          await autoBackup.enable(app.store.get());
          app.dispatch(updateBackupMeta, { autoFileEnabled: true, autoFileError: null });
        }),
      }),
    ];
  } else if (status === 'needs-permission') {
    body = [
      h('p', { class: 'muted', text: 'O navegador pediu sua autorização de novo para gravar no arquivo de backup.' }),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn btn-primary', onClick: run(() => autoBackup.reconnect(app.store.get())), text: 'Reconectar backup automático' }),
        disableBtn()),
    ];
  } else {
    body = [
      h('p', { text: backup.lastAutoWriteAt ? `✅ Ativo. Último backup automático: ${formatDateTime(backup.lastAutoWriteAt)}.` : '✅ Ativo.' }),
      backup.autoFileError ? h('p', { class: 'field-error', text: `A última gravação falhou: ${backup.autoFileError}. Por segurança, exporte um backup manual.` }) : null,
      disableBtn(),
    ];
  }
  return h('section', { class: 'panel' }, h('h2', { text: 'Backup automático em arquivo' }), body);
}

async function reset(app) {
  if (confirm('Quer exportar um backup antes de zerar? (Recomendado)')) await exportNow(app);
  if (!confirm('Tem certeza? Todo o progresso deste navegador será apagado.')) return;
  app.dispatch(resetProgress);
  app.storage.removeItem(PRE_IMPORT_KEY);
  app.storage.flush();
  app.go('#/');
}

export function renderSettings(container, app) {
  const state = app.store.get();
  const fields = profileFields(state.profile);
  const saveProfile = () => {
    const data = fields.read();
    if (!data) return;
    app.dispatch(setProfile, data);
    app.layout.toast('Perfil atualizado.', { tone: 'success' });
  };
  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    fileInput.value = '';
    if (file && (await importFromFile(app, file))) {
      app.layout.toast('Progresso importado.', { tone: 'success' });
      app.refresh();
    }
  });
  const undo = () => {
    if (undoImport(app)) {
      app.layout.toast('Importação desfeita.', { tone: 'success' });
      app.refresh();
    }
  };
  mount(container,
    h('h1', { text: '⚙️ Configurações' }),
    h('section', { class: 'panel' },
      h('h2', { text: 'Perfil' }),
      fields.el,
      h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn btn-primary', onClick: saveProfile, text: 'Salvar perfil' }))),
    h('section', { class: 'panel' },
      h('h2', { text: 'Backup manual' }),
      h('p', { class: 'muted', text: state.backup.lastExportAt ? `Último backup exportado em ${formatDateTime(state.backup.lastExportAt)}.` : 'Você ainda não exportou nenhum backup.' }),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn btn-primary', onClick: async () => { await exportNow(app); app.refresh(); }, text: 'Exportar progresso' }),
        h('button', { type: 'button', class: 'btn', onClick: () => fileInput.click(), text: 'Importar progresso' }),
        canUndoImport(app) ? h('button', { type: 'button', class: 'btn btn-ghost', onClick: undo, text: 'Desfazer importação' }) : null),
      fileInput),
    autoBackupSection(app),
    h('section', { class: 'panel danger-zone' },
      h('h2', { text: 'Zerar progresso' }),
      h('p', { class: 'muted', text: 'Apaga perfil, progresso, cartas, conquistas e histórico deste navegador.' }),
      h('button', { type: 'button', class: 'btn btn-danger', onClick: () => reset(app), text: 'Zerar progresso' })),
    h('p', { class: 'small muted', text: `Privacidade: nenhum dado sai do seu aparelho. A ${APP_NAME} não usa rastreamento nem estatísticas de uso.` }));
}
```

Em `js/ui/views/index.js`, acrescente `import { renderSettings } from './settings.js';` e `config: renderSettings,`.

- [ ] **Step 3: Rodar os testes**

Run: `npm test && node --check js/main.js`
Expected: PASS.

- [ ] **Step 4: Conferir no navegador (Chrome no computador)**

Abra `#/config`.
Expected:
- **Editar perfil:** mudar nome, avatar e meta e salvar atualiza o topo.
- **Exportar:** baixa `progresso-<nome>-<data>.json`, mostra o aviso e libera a conquista "Seguro morreu de velho".
- **Importar:** importar esse arquivo mostra o resumo e pede confirmação. Depois aparece "Desfazer importação", que restaura o estado anterior.
- **Arquivo inválido:** importar um JSON qualquer mostra "Este arquivo não é um backup da Central de Linguagens.".
- **Backup automático:** "Ativar backup automático" abre a janela para escolher o arquivo. Depois de concluir uma aula, o arquivo é regravado em cerca de 5 s e o indicador mostra a hora.
- **Permissão:** recarregar a página pode exibir a faixa "Reconectar backup automático", conforme o Chrome lembre ou não a permissão.
- **Zerar progresso:** oferece exportar antes e, confirmado, volta à tela de boas-vindas.
- **No Firefox:** a seção automática mostra "Disponível no Chrome e no Edge para computador".

- [ ] **Step 5: Commit**

```bash
git add js/ui tests/ui-imports.test.js
git commit -m "Adiciona configurações com perfil, backup manual, backup automático e zerar" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 22: Publicação, documentação e verificação manual completa

**Files:**
- Create: `.github/workflows/pages.yml`, `README.md`, `docs/verificacao-manual.md`

**Interfaces:**
- Consumes: `npm test`, `tools/verify-java.mjs`.
- Produces: publicação automática no GitHub Pages **somente** quando testes e conferência Java passam.

- [ ] **Step 1: Escrever o workflow**

`.github/workflows/pages.yml`:
```yaml
name: Testes e publicação

on:
  push:
    branches: [main]
  pull_request:
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  testes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
      - name: Testes de regras e validador de conteúdo
        run: npm test
      - name: Conferência dos trechos Java
        run: node tools/verify-java.mjs

  publicar:
    if: github.event_name != 'pull_request'
    needs: testes
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - name: Montar a pasta do site
        run: |
          mkdir _site
          cp -r index.html .nojekyll css js content _site/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Escrever o README**

`README.md`:
````markdown
# Central de Linguagens

Central gratuita e didática para aprender programação: aulas curtas, quizzes com perguntas aleatórias, flashcards com repetição espaçada, perfil com progresso, conquistas e certificado. Tudo roda no navegador; o progresso fica salvo no aparelho de cada pessoa, com backup manual e automático.

Inspirada no trabalho de Gustavo Guanabara de abrir portas para quem está começando. Sem fins comerciais.

## Rodar no seu computador

```bash
python -m http.server 8000
```

Abra `http://localhost:8000/`. Abrir o `index.html` com dois cliques não funciona: o navegador bloqueia o carregamento do conteúdo fora de um servidor.

## Testes

```bash
npm test
```

Roda os testes das regras (`tests/core`), o validador de conteúdo (`tests/content.test.js`) e a checagem de importação dos módulos. Não há dependências para instalar; basta o Node 18 ou superior.

## Conferir os códigos Java

Todo trecho Java citado nas aulas e perguntas (saídas, erros de compilação, exceções) tem uma cópia executável em `verify/java/`. Para conferir, é preciso o JDK 21:

```powershell
$env:JAVA_HOME = "C:\caminho\para\jdk-21"
node tools/verify-java.mjs
```

## Como o conteúdo é organizado

```
content/
  catalog.json                 lista de linguagens
  achievements.json            textos das conquistas
  <linguagem>/
    language.json              nome, cor, ícone e módulos (com as aulas de cada um)
    referencia.md              referência rápida
    <NN-modulo>/
      <NN-aula>.md             aulas em Markdown (alertas: > [!TIP], > [!WARNING]...)
      questions.json           perguntas: multiple, truefalse, fill, order
      flashcards.json          cartas: front, back, lesson
```

O formato completo está em `docs/superpowers/specs/2026-10-11-central-linguagens-design.md`, seção 4. O validador recusa conteúdo fora do padrão.

## Publicar

No GitHub: **Settings → Pages → Source: GitHub Actions**. A cada `push` na `main`, o workflow roda os testes e a conferência Java e só publica se tudo passar.
````

- [ ] **Step 3: Escrever o roteiro de verificação manual**

`docs/verificacao-manual.md`:
````markdown
# Roteiro de verificação manual

Use um servidor local (`python -m http.server 8000`) e o Chrome. Marque cada item.

## Primeira visita e navegação
- [ ] Sem dados salvos, aparece a tela de boas-vindas; sem nome, aparece "Digite seu nome."
- [ ] Um nome com HTML, como `<img src=x onerror=alert(1)>`, aparece como texto puro no topo, no perfil e no certificado (nenhum alerta abre).
- [ ] Menu lateral no computador; barra de abas embaixo na largura de celular (DevTools, 390 px), sem rolagem horizontal.
- [ ] Toda a navegação funciona só com o teclado (Tab, Enter, Espaço, setas na ordenação); o foco é sempre visível.
- [ ] `#/qualquer-coisa` mostra "Página não encontrada".

## Aulas, prática, quiz e prova
- [ ] Concluir uma aula dá XP, libera as cartas da aula e atualiza o anel da meta e a sequência.
- [ ] A prática do módulo mostra os 4 tipos de pergunta ao longo de algumas tentativas; sair no meio pede confirmação.
- [ ] O quiz personalizado respeita escopo, dificuldade, tipo e quantidade; "0 perguntas" desativa o botão.
- [ ] A prova roda em modo simulado com cronômetro; 70% ou mais mostra "Você passou na prova!".
- [ ] Com o sistema configurado para reduzir movimento, a carta vira sem animação.

## Flashcards
- [ ] Revisão do dia, estudo livre (sem mudar o agendamento) e "Meus erros" funcionam; atalhos 1/2/3 e Espaço.
- [ ] O número de pendentes no menu bate com o da tela de flashcards.

## Perfil e certificado
- [ ] Calendário, conquistas, histórico e "Refazer erradas" funcionam.
- [ ] O certificado só aparece com tudo concluído; a impressão mostra só o certificado.

## Dados e backup
- [ ] Recarregar a página mantém todo o progresso.
- [ ] Duas abas: concluir uma aula numa aba e voltar à outra mostra o progresso atualizado.
- [ ] DevTools → Application → Local Storage: trocar o valor de `central-linguagens:state` por `{quebrado` e recarregar mostra o aviso de dados danificados, cria a chave `central-linguagens:corrupt:...` e começa do zero.
- [ ] Trocar o `schema` salvo para `99` e recarregar mostra o aviso de versão mais nova, e nada é sobrescrito.
- [ ] Com o backup automático ativo, corromper o Local Storage e recarregar **não** regrava o arquivo de backup (a data de modificação do arquivo não muda, mesmo depois de concluir uma aula). Zerar o progresso também não grava um estado vazio no arquivo.
- [ ] Exportar, importar, desfazer importação e importar arquivo inválido funcionam como descrito na Tarefa 21.
- [ ] Backup automático: ativar, gravar depois de uma mudança, reconectar depois de recarregar, desativar.
- [ ] Numa janela anônima do Firefox, o site funciona; se o armazenamento falhar, aparece a faixa "Seu progresso não está sendo salvo".
- [ ] Lembrete: com progresso e sem backup há 7 dias (simule mudando `lastExportAt` e `createdAt` no Local Storage), a faixa aparece; "Depois" some por 3 dias.

## Conteúdo
- [ ] Ler as 6 aulas de Fundamentos inteiras: textos, tabelas, código colorido e quadros de destaque sem erros de formatação.
- [ ] `node tools/verify-java.mjs` com o JDK 21: 30/30.
````

- [ ] **Step 4: Rodar tudo uma última vez**

Run: `npm test && node --check js/main.js`
Expected: PASS.

Run (PowerShell): `$env:JAVA_HOME = (Get-ChildItem "$env:USERPROFILE\tools" -Directory -Filter 'jdk-21*' | Select-Object -First 1).FullName; node tools/verify-java.mjs`
Expected: `30/30 trechos conferidos.`

- [ ] **Step 5: Percorrer o roteiro manual**

Siga `docs/verificacao-manual.md` no Chrome e marque os itens. Qualquer item que falhar volta para a tarefa dona do código, com um teste quando a regra estiver em `js/core/`. Se você não tiver um navegador à disposição, peça à pessoa que percorra o roteiro e relate o resultado.

- [ ] **Step 6: Commit**

```bash
git add .github README.md docs/verificacao-manual.md
git commit -m "Adiciona publicação no GitHub Pages, README e roteiro de verificação manual" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 7: Publicar (somente com o OK da pessoa)**

Publicar é uma ação visível para fora. Pergunte antes. Com o OK:
1. A pessoa cria um repositório vazio no GitHub (por exemplo, `central-de-linguagens`).
2. `git remote add origin https://github.com/<usuario>/<repo>.git` e `git push -u origin main`.
3. No GitHub: Settings → Pages → Source: **GitHub Actions**.
4. Acompanhar a aba Actions até "Testes e publicação" ficar verde e abrir a URL publicada.

---

## Notas da autorrevisão (diferenças pequenas em relação à especificação)

- `counters` ganhou o campo `quizzes`, usado para gerar ids únicos e estáveis no histórico (`q1`, `q2`...). Um backup sem o campo é completado por `normalizeState`.
- "Pontos fracos" ignora módulos com 100% de acerto: um módulo perfeito não é ponto fraco, mesmo que esteja entre os três com mais respostas.
- O backup automático não grava estado sem progresso e fica pausado na carga em que os dados salvos estavam danificados ou eram de versão mais nova. A especificação não tratava esse caso; sem isso, o arquivo bom seria sobrescrito justamente quando é mais necessário.
- A prova sorteia sem pesos (não usa o histórico da pessoa), para que a nota não dependa do que já foi visto.

## Fora deste plano (próximos planos)

- **Plano 1B:** módulos Introdução, POO, Coleções, Exceções, Strings e Entrada, e Java Moderno, no mesmo formato e com a mesma conferência (aulas + perguntas + cartas + `verify/java/<modulo>/`). Correções já conhecidas do arquivo legado a aplicar lá: a pergunta de lista imutável com duas respostas defensáveis, o flashcard de interface sem métodos abstratos e `private`.
- **Fase 2:** exercícios com código executado no navegador (especificação própria).
- **Fases 3+:** conteúdo de JavaScript, SQL, Go, PHP.
