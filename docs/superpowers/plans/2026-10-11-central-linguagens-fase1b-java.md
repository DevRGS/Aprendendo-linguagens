# Central de Linguagens — Fase 1B (demais módulos de Java) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar o curso de Java da Central com os seis módulos que faltam: Introdução, Orientação a Objetos, Coleções, Exceções, Strings e Entrada, e Java Moderno. Cada um tem aulas, perguntas dos quatro tipos e flashcards, e todo código citado é conferido com o JDK 21.

**Architecture:** Só conteúdo, ferramentas de conferência e testes; o código do site (`js/`, Fase 1A) não muda. Antes do primeiro módulo, os testes da plataforma passam a ler um manifesto de Java congelado (Task 2), para não dependerem do tamanho do curso. Cada módulo é uma pasta em `content/java/`, registrada em `language.json` e validada por `tests/content.test.js`. Cada afirmação sobre código (saída, erro de compilação, exceção) tem uma cópia executável em `verify/java/<modulo>/`, executada por `tools/verify-java.mjs`. O conferidor ganha um modo `javac`, para provar regras que o modo de arquivo único não enxerga (como "nome do arquivo = nome da classe pública"), e passa a conferir o texto da mensagem de erro.

**Tech Stack:** Markdown e JSON (conteúdo), Node 22 (`node --test`), JDK 21 Temurin em `C:\Users\nitron\tools\jdk-21.0.12.1+1` (no CI, `actions/setup-java`).

**Spec:** `docs/superpowers/specs/2026-10-11-central-linguagens-design.md` (seções 4, 12 e 12.1). Este plano dá continuidade a `docs/superpowers/plans/2026-10-11-central-linguagens-fase1a-plataforma.md`.

## Global Constraints

- Formato do conteúdo: seção 4 da especificação, garantido por `tests/content.test.js`. Por módulo: pelo menos 12 perguntas, pelo menos 3 tipos de pergunta e pelo menos 8 cartas. IDs `java.<modulo>.qNN` e `java.<modulo>.fNN`.
- Ordem final dos módulos em `content/java/language.json`: `introducao` (pasta `01-introducao`), `fundamentos` (`02-fundamentos`), `poo` (`03-poo`), `colecoes` (`04-colecoes`), `excecoes` (`05-excecoes`), `strings` (`06-strings`), `java-moderno` (`07-java-moderno`).
- Versão de referência: **Java 21**. Recurso posterior ao Java 8 leva a versão no texto ("Java 16+"). Nada de recursos do Java 22 ou mais novos; regras que mudaram depois do 21 são ditas como "no Java 21" e "versões mais novas flexibilizaram".
- Toda afirmação sobre código (saída, "não compila", "lança tal exceção") tem um trecho em `verify/java/<modulo>/` e passa em `node tools/verify-java.mjs` com o JDK 21. Erros de compilação e exceções conferem também o texto da mensagem (`// erro-contem:`) quando o conteúdo cita a mensagem.
- No modo de arquivo único (`java Arquivo.java`), o Java executa a **primeira** classe do arquivo: `class Main` vem sempre primeiro. Classes cujo acesso `private` importa para a afirmação ficam como classes separadas no topo do arquivo, nunca aninhadas em `Main`.
- Múltipla escolha: exatamente uma resposta defensável, sem "todas/nenhuma das anteriores". Lacuna: aceitar **toda** resposta que compila e cumpre o enunciado. Ordenar: o enunciado garante uma única ordem válida, sem contar linhas idênticas.
- Textos em português do Brasil, linguagem neutra em gênero, alertas `> [!NOTE]`/`[!TIP]`/`[!IMPORTANT]`/`[!WARNING]`/`[!CAUTION]`. Nada de `|` dentro de células de tabela Markdown.
- Testes de tela e da camada de dados usam o manifesto congelado da Task 2 (`tests/fixtures/content/java/language.json`). Só o validador, o teste de fumaça da Task 9 e o conferidor Java olham o conteúdo real.
- Ao fim da Task 9, toda aula tem pelo menos uma pergunta (o validador passa a exigir).
- Arquivos de conteúdo e trechos Java são gravados com a ferramenta de escrever arquivos, nunca com heredoc do shell: na Fase 1A e na preparação deste plano, o heredoc engoliu barras invertidas.
- Todo commit termina com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- `npm test` e `node tools/verify-java.mjs` (com `JAVA_HOME` apontando para o JDK 21) passam ao fim de cada tarefa.

## Review Focus

1. **Múltipla escolha com duas respostas defensáveis** (por exemplo, "estender `Error`" também gera exceção unchecked). Cada pergunta da lista foi montada contra isso; a revisão final relê todas.
2. **Lacuna que recusa resposta válida** (por exemplo, `comparingLong` também ordena por idade, e `Integer.decode` também converte "42"). Os trechos `q18-comparators.java` (Tarefa 5) e `q05-parse.java` (1A) executam todas as alternativas aceitas.
3. **Ordenar com mais de uma ordem válida** (a ordem de classes de topo não importa em Java; criar o `Scanner` antes ou depois do `print` dá no mesmo). As perguntas de ordenar usam enunciados que fixam uma ordem única, e cada uma tem um trecho que roda a ordem correta.
4. **Regras que mudaram depois do Java 21** (corpo de construtor antes de `super(...)`, padrões de tipos primitivos). O texto diz "no Java 21", e os trechos `q07-this-primeiro.java` e `q18-super-depois.java` (Tarefa 4) provam o comportamento no 21.
5. **Saída que depende do ambiente** (ordem do `HashMap`/`HashSet`, código de identificação em `toString`, idioma do sistema no `Scanner`). Os trechos usam `TreeMap`, `LinkedHashSet` e `Locale` explícito, para não depender da máquina; nenhum trecho confere saída não determinística.

## Como os arquivos aparecem neste plano

Cada arquivo de conteúdo aparece como uma linha com o caminho entre crases seguida de dois-pontos e, logo abaixo, um bloco cercado com o conteúdo exato. Na execução, os arquivos de cada tarefa podem ser extraídos mecanicamente da *brief* da tarefa: cada bloco precedido por uma linha `` `caminho`: `` vira o arquivo daquele caminho, com o conteúdo do bloco mais uma quebra de linha final. Os blocos de aulas usam quatro crases (````` ````markdown `````), porque contêm blocos de código de três crases; o bloco termina na próxima linha com quatro crases. As edições em arquivos que já existem (`language.json`, testes, README) são descritas como edições.

Todas as mensagens de erro e saídas citadas foram conferidas com o JDK 21 durante a preparação do plano (em `java` com `-Duser.language=en`, como o conferidor roda).

---

### Task 1: Conferidor com modo `javac` e conferência da mensagem de erro

**Files:**
- Modify: `tools/verify-format.mjs`, `tools/verify-java.mjs`, `README.md`
- Test: `tests/tools/verify-format.test.js`

**Interfaces:**
- Consumes: `parseExpectation`, `judge`, `parseJavaMajor`, `listJavaFiles` (Fase 1A).
- Produces: `parseExpectation(source)` passa a devolver também `mode: 'source' | 'javac'` e, quando houver, `mainClass` (diretiva `// classe:`) e `contains` (diretiva `// erro-contem:`). `judge(exp, run)` passa a exigir que `stderr` contenha `exp.contains` em erros de compilação e exceções. Diretivas do cabeçalho: `// modo: javac`, `// classe: Nome`, `// erro-contem: texto`, `// espera: ...` ou `// saida:`. **`// saida:` é sempre a última diretiva**, porque as linhas seguintes formam a saída esperada. No modo `javac`, o executor compila com `javac -d <pasta temporária>` (o nome do arquivo passa a importar) e roda `java -cp <pasta> <classe>`. Os dois modos forçam mensagens em inglês (`-Duser.language=en`).

- [ ] **Step 1: Atualizar os testes do formato (falhando)**

Substitua o conteúdo de `tests/tools/verify-format.test.js` por:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { parseExpectation, parseJavaMajor, judge, listJavaFiles } from '../../tools/verify-format.mjs';

test('saída esperada com linha vazia; modo padrão é o de arquivo único', () => {
  const src = '// verifica: x\n// saida:\n// 3\n//\n// fim\nclass Main {}\n// saida: ignorado\n';
  assert.deepEqual(parseExpectation(src), { kind: 'output', output: '3\n\nfim', mode: 'source' });
});

test('erro de compilação e exceção, com ou sem texto obrigatório', () => {
  assert.deepEqual(parseExpectation('// espera: erro-de-compilacao\nclass Main {}'), { kind: 'compile-error', mode: 'source' });
  assert.deepEqual(parseExpectation('// espera: excecao NumberFormatException\nclass Main {}'), { kind: 'exception', name: 'NumberFormatException', mode: 'source' });
  assert.deepEqual(
    parseExpectation('// espera: erro-de-compilacao\n// erro-contem: has private access in Conta\nclass Main {}'),
    { kind: 'compile-error', mode: 'source', contains: 'has private access in Conta' },
  );
});

test('modo javac com classe principal', () => {
  const src = '// modo: javac\n// classe: Ola\n// saida:\n// Olá!\npublic class Ola {}';
  assert.deepEqual(parseExpectation(src), { kind: 'output', output: 'Olá!', mode: 'javac', mainClass: 'Ola' });
  assert.deepEqual(
    parseExpectation('// modo: javac\n// espera: erro-de-compilacao\npublic class Ola {}'),
    { kind: 'compile-error', mode: 'javac' },
  );
});

test('cabeçalho inválido lança erro', () => {
  assert.throws(() => parseExpectation('class Main {}'), /cabeçalho/);
  assert.throws(() => parseExpectation('// espera: talvez\nclass Main {}'), /desconhecido/);
  assert.throws(() => parseExpectation('// modo: gradle\n// saida:\n// x\nclass Main {}'), /modo/);
  assert.throws(() => parseExpectation('// modo: javac\n// saida:\n// x\nclass Main {}'), /classe/);
});

test('aceita quebras de linha do Windows', () => {
  assert.deepEqual(parseExpectation('// saida:\r\n// ok\r\nclass Main {}'), { kind: 'output', output: 'ok', mode: 'source' });
});

test('parseJavaMajor entende o formato antigo e o novo', () => {
  assert.equal(parseJavaMajor('java version "1.8.0_401"'), 8);
  assert.equal(parseJavaMajor('openjdk version "21.0.5" 2024-10-15 LTS'), 21);
  assert.equal(parseJavaMajor('openjdk version "25" 2025-09-16'), 25);
  assert.equal(parseJavaMajor(''), 0);
});

test('judge aceita a saída igual e recusa a diferente', () => {
  const exp = { kind: 'output', output: '3\n0' };
  assert.equal(judge(exp, { code: 0, stdout: '3\r\n0\r\n', stderr: '' }), null);
  assert.match(judge(exp, { code: 0, stdout: '3\n1', stderr: '' }), /saída diferente/);
  assert.match(judge(exp, { code: 1, stdout: '', stderr: 'boom' }), /código 1/);
});

test('judge de erro de compilação exige "compilation failed" e, se pedido, o texto do erro', () => {
  const exp = { kind: 'compile-error' };
  assert.equal(judge(exp, { code: 1, stdout: '', stderr: 'Main.java:3: error: x\nerror: compilation failed' }), null);
  assert.match(judge(exp, { code: 0, stdout: 'ok', stderr: '' }), /esperava erro de compilação/);
  assert.match(judge(exp, { code: 1, stdout: '', stderr: 'Exception in thread "main" java.lang.RuntimeException' }), /esperava erro de compilação/);
  const withText = { kind: 'compile-error', contains: 'has private access' };
  assert.equal(judge(withText, { code: 1, stdout: '', stderr: 'x has private access in Conta\nerror: compilation failed' }), null);
  assert.match(judge(withText, { code: 1, stdout: '', stderr: 'cannot find symbol\nerror: compilation failed' }), /não contém "has private access"/);
});

test('judge de exceção exige o nome, que tenha compilado e, se pedido, o texto', () => {
  const exp = { kind: 'exception', name: 'NumberFormatException' };
  assert.equal(judge(exp, { code: 1, stdout: '', stderr: 'Exception in thread "main" java.lang.NumberFormatException: For input string: "abc"' }), null);
  assert.match(judge(exp, { code: 1, stdout: '', stderr: 'java.lang.NullPointerException' }), /esperava a exceção/);
  assert.match(judge(exp, { code: 1, stdout: '', stderr: 'error: compilation failed NumberFormatException' }), /esperava a exceção/);
  assert.match(judge(exp, { code: 0, stdout: '', stderr: '' }), /esperava a exceção/);
  const withText = { kind: 'exception', name: 'ArithmeticException', contains: '/ by zero' };
  assert.equal(judge(withText, { code: 1, stdout: '', stderr: 'java.lang.ArithmeticException: / by zero' }), null);
  assert.match(judge(withText, { code: 1, stdout: '', stderr: 'java.lang.ArithmeticException: outra' }), /não contém "\/ by zero"/);
});

test('listJavaFiles encontra .java em subpastas e ignora o resto', () => {
  const dir = mkdtempSync(join(tmpdir(), 'verify-'));
  try {
    mkdirSync(join(dir, 'fundamentos'));
    writeFileSync(join(dir, 'fundamentos', 'a.java'), '');
    writeFileSync(join(dir, 'b.java'), '');
    writeFileSync(join(dir, 'leia-me.txt'), '');
    assert.deepEqual(listJavaFiles(dir).map((f) => basename(f)).sort(), ['a.java', 'b.java']);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/tools/verify-format.test.js`
Expected: FAIL nos testes que esperam `mode`, `contains` e `mainClass`.

- [ ] **Step 3: Implementar no formato**

Em `tools/verify-format.mjs`, substitua a função `parseExpectation` por:

```js
// Lê o cabeçalho de comentários de um trecho Java e diz o que se espera dele.
// Diretivas: // modo: javac, // classe: Nome, // erro-contem: texto, // espera: ..., // saida: (sempre a última).
export function parseExpectation(source) {
  const header = [];
  for (const line of source.split(/\r?\n/)) {
    if (!line.startsWith('//')) break;
    header.push(line);
  }
  const directive = (prefix) => header.find((l) => l.startsWith(prefix))?.slice(prefix.length).trim();
  const mode = directive('// modo:') ?? 'source';
  if (!['source', 'javac'].includes(mode)) throw new Error(`"// modo:" desconhecido: ${mode}`);
  const extra = { mode };
  const mainClass = directive('// classe:');
  if (mainClass) extra.mainClass = mainClass;
  const contains = directive('// erro-contem:');
  if (contains) extra.contains = contains;

  let result;
  const expect = directive('// espera:');
  if (expect !== undefined) {
    const m = /^excecao\s+(\S+)$/.exec(expect);
    if (expect === 'erro-de-compilacao') result = { kind: 'compile-error' };
    else if (m) result = { kind: 'exception', name: m[1] };
    else throw new Error(`"// espera:" desconhecido: ${expect}`);
  } else {
    const start = header.findIndex((l) => l.trim() === '// saida:');
    if (start < 0) throw new Error('cabeçalho sem "// saida:" nem "// espera:"');
    const output = header.slice(start + 1).map((l) => (l === '//' ? '' : l.replace(/^\/\/ ?/, '')));
    result = { kind: 'output', output: output.join('\n') };
  }
  if (mode === 'javac' && result.kind !== 'compile-error' && !extra.mainClass) {
    throw new Error('o modo javac precisa de "// classe:" para saber o que executar');
  }
  return { ...result, ...extra };
}
```

E substitua a função `judge` por:

```js
// Compara o resultado da execução com o esperado; devolve null se bateu ou a explicação do problema.
export function judge(exp, { code, stdout, stderr }) {
  const out = String(stdout ?? '').replace(/\r\n/g, '\n').trimEnd();
  const err = String(stderr ?? '');
  const compileFailed = /compilation failed/.test(err);
  const missingText = () => (exp.contains && !err.includes(exp.contains) ? `a mensagem não contém "${exp.contains}"\n${err}` : null);
  if (exp.kind === 'compile-error') {
    return code !== 0 && compileFailed ? missingText() : `esperava erro de compilação; código ${code}\n${err}`;
  }
  if (exp.kind === 'exception') {
    return code !== 0 && !compileFailed && err.includes(exp.name) ? missingText() : `esperava a exceção ${exp.name}; código ${code}\n${err}`;
  }
  if (code !== 0) return `terminou com código ${code}\n${err}`;
  return out === exp.output ? null : `saída diferente.\nEsperado:\n${exp.output}\nObtido:\n${out}`;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `node --test tests/tools/verify-format.test.js`
Expected: PASS.

- [ ] **Step 5: Ensinar o executor a usar o modo javac**

Substitua o conteúdo de `tools/verify-java.mjs` por:

```js
// Executa os trechos de verify/java com o JDK 21+ e compara com o cabeçalho de cada arquivo.
// Uso: node tools/verify-java.mjs  (usa JAVA_HOME se definido; senão, o "java" do PATH)
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseExpectation, parseJavaMajor, judge, listJavaFiles } from './verify-format.mjs';

const ROOT = fileURLToPath(new URL('../verify/java/', import.meta.url));
const bin = (name) => (process.env.JAVA_HOME ? join(process.env.JAVA_HOME, 'bin', name) : name);
const java = bin('java');
const javac = bin('javac');
const ENGLISH = ['-Duser.language=en', '-Duser.country=US'];
const UTF8 = ['-Dstdout.encoding=UTF-8', '-Dstderr.encoding=UTF-8'];
const OPTS = { encoding: 'utf8', timeout: 60000 };

const toResult = (r) => ({ code: r.status, stdout: r.stdout ?? '', stderr: r.stderr ?? '' });

function runSource(file) {
  return toResult(spawnSync(java, [...ENGLISH, ...UTF8, file], OPTS));
}

// Compila de verdade (o nome do arquivo passa a importar) e executa a classe indicada.
function runJavac(file, exp) {
  const out = mkdtempSync(join(tmpdir(), 'verify-java-'));
  try {
    const compiled = spawnSync(javac, ['-J-Duser.language=en', '-J-Duser.country=US', '-encoding', 'UTF-8', '-d', out, file], OPTS);
    if (compiled.status !== 0) return { code: compiled.status, stdout: '', stderr: `${compiled.stderr ?? ''}\nerror: compilation failed` };
    if (exp.kind === 'compile-error') return { code: 0, stdout: '', stderr: '' };
    return toResult(spawnSync(java, [...ENGLISH, ...UTF8, '-cp', out, exp.mainClass], OPTS));
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

const version = spawnSync(java, ['-version'], { encoding: 'utf8' });
const major = parseJavaMajor(`${version.stderr ?? ''}${version.stdout ?? ''}`);
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
    const exp = parseExpectation(readFileSync(file, 'utf8'));
    problem = judge(exp, exp.mode === 'javac' ? runJavac(file, exp) : runSource(file));
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

- [ ] **Step 6: Conferir que os 32 trechos da 1A continuam passando**

Run (PowerShell): `$env:JAVA_HOME = "$env:USERPROFILE\tools\jdk-21.0.12.1+1"; node tools/verify-java.mjs`
Expected: `32/32 trechos conferidos.`

- [ ] **Step 7: Documentar as diretivas no README**

Em `README.md`, logo depois do bloco de comando da seção "Conferir os códigos Java", acrescente:

````markdown
Cada trecho começa com um cabeçalho de comentários:

```java
// verifica: o que este trecho prova (ids de perguntas, cartas ou aulas)
// modo: javac                 (opcional: compila de verdade; o nome do arquivo importa)
// classe: Ola                 (obrigatório no modo javac quando o trecho executa)
// erro-contem: texto          (opcional: trecho que a mensagem de erro precisa ter)
// espera: erro-de-compilacao  (ou: // espera: excecao NomeDaExcecao)
// saida:                      (alternativa ao "espera"; sempre a última diretiva)
// linha 1 esperada
// linha 2 esperada
```

No modo padrão (`java Arquivo.java`), o Java executa a **primeira** classe do arquivo, então `class Main` vem primeiro.
````

- [ ] **Step 8: Rodar tudo e fazer o commit**

Run: `npm test`
Expected: PASS.

```bash
git add tools tests/tools/verify-format.test.js README.md
git commit -m "Conferidor Java ganha modo javac e conferência do texto do erro" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Testes da plataforma independentes do tamanho do curso

Hoje, vários testes de tela e da camada de dados leem o conteúdo real e conferem números que só valem enquanto Java tem um módulo: `0/6 aulas · 0/1 módulos` (`tests/ui/views-language.test.js`, `views-profile.test.js`, `views-basic.test.js`), `20 perguntas disponíveis` (`views-quiz.test.js`), 14 cartas (`views-language.test.js`, `tests/data/content.test.js`), `java.modules[0]` igual a Fundamentos (`tests/data/content.test.js`) e a lista de requisitos do certificado (`views-profile.test.js`). O primeiro módulo novo quebraria todos eles. Em vez de reescrever esses números a cada módulo, os testes passam a ler um **manifesto de Java congelado** (só Fundamentos); o resto (aulas, perguntas, cartas, conquistas, referência) continua vindo do conteúdo real.

**Files:**
- Create: `tests/fixtures/content/java/language.json` (cópia exata do `content/java/language.json` de agora, só com Fundamentos)
- Modify: `tests/helpers/fetch-from-disk.js`, `README.md`
- Test: `tests/data/fetch-from-disk.test.js`

**Interfaces:**
- Consumes: `installFetchFromDisk({ fail })` da Fase 1A, usado por `tests/helpers/app.js` (`makeTestApp`), `tests/data/content.test.js`, `tests/ui/app-boot.test.js` e `tests/ui/app-start.test.js`.
- Produces: `installFetchFromDisk({ fail = () => false, overlay = true } = {})`. Com `overlay` ligado (o padrão), um caminho `content/...` é lido primeiro de `tests/fixtures/content/...` e, se não existir lá, do conteúdo real. Com `overlay: false`, só do conteúdo real. As Tasks 3 a 8 dependem disso para mudar o `language.json` real sem quebrar os testes de tela; a Task 9 usa `overlay: false` no teste de fumaça.

- [ ] **Step 1: Escrever os testes do carregador (falhando)**

Crie `tests/data/fetch-from-disk.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';

const fromRoot = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');

test('por padrão, o manifesto de Java vem da fixture congelada (só Fundamentos)', async () => {
  installFetchFromDisk();
  const served = await (await fetch('content/java/language.json')).json();
  assert.deepEqual(served, JSON.parse(fromRoot('tests/fixtures/content/java/language.json')));
  assert.deepEqual(served.modules.map((m) => m.id), ['fundamentos']);
});

test('o que não está na fixture vem do conteúdo real', async () => {
  installFetchFromDisk();
  const text = await (await fetch('content/java/02-fundamentos/questions.json')).text();
  assert.equal(text, fromRoot('content/java/02-fundamentos/questions.json'));
});

test('com overlay: false, tudo vem do conteúdo real', async () => {
  installFetchFromDisk({ overlay: false });
  const text = await (await fetch('content/java/language.json')).text();
  assert.equal(text, fromRoot('content/java/language.json'));
});

test('caminho inexistente dá 404, e fail continua simulando erro de rede', async () => {
  installFetchFromDisk({ fail: (p) => p.endsWith('catalog.json') });
  assert.equal((await fetch('content/nao-existe.json')).status, 404);
  assert.equal((await fetch('content/catalog.json')).status, 500);
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `node --test tests/data/fetch-from-disk.test.js`
Expected: FAIL em "por padrão, o manifesto de Java vem da fixture congelada", com `ENOENT` (a fixture ainda não existe).

- [ ] **Step 3: Criar a fixture com o manifesto de agora**

Run: `node -e "const fs=require('fs');fs.mkdirSync('tests/fixtures/content/java',{recursive:true});fs.copyFileSync('content/java/language.json','tests/fixtures/content/java/language.json')"`

A cópia precisa acontecer **antes** da Task 3, que muda o manifesto real. Confira com `git diff --no-index content/java/language.json tests/fixtures/content/java/language.json` (Expected: nenhuma diferença).

- [ ] **Step 4: Ensinar o carregador a usar a fixture**

Substitua o conteúdo de `tests/helpers/fetch-from-disk.js` por:

```js
// Substitui fetch() nos testes: 'content/...' é lido do disco, a partir da raiz do projeto.
// Com overlay (o padrão), um arquivo que existe em tests/fixtures/ tem prioridade. Assim o manifesto
// de Java fica congelado em Fundamentos, e os testes de tela não quebram quando o curso ganha módulos.
import { readFile } from 'node:fs/promises';

const ROOT = new URL('../../', import.meta.url);
const FIXTURES = new URL('../fixtures/', import.meta.url);

async function readFirst(urls) {
  for (const url of urls) {
    try {
      return await readFile(url);
    } catch {
      // não existe aqui: tenta o próximo
    }
  }
  return null;
}

export function installFetchFromDisk({ fail = () => false, overlay = true } = {}) {
  const calls = [];
  globalThis.fetch = async (path, init) => {
    calls.push({ path: String(path), init });
    if (fail(String(path))) return new Response('erro simulado', { status: 500 });
    const real = new URL(String(path), ROOT);
    const body = await readFirst(overlay ? [new URL(String(path), FIXTURES), real] : [real]);
    return body === null ? new Response('não encontrado', { status: 404 }) : new Response(body, { status: 200 });
  };
  return calls;
}
```

- [ ] **Step 5: Rodar e ver passar**

Run: `node --test tests/data/fetch-from-disk.test.js`
Expected: PASS.

Run: `npm test`
Expected: PASS (com a fixture igual ao manifesto real, nada muda para os outros testes).

- [ ] **Step 6: Documentar no README**

Em `README.md`, na seção "Testes", depois do parágrafo que termina em "falha se alguém criar uma função exportada sem teste.", acrescente o parágrafo:

```markdown
Os testes de telas e da camada de dados leem um manifesto de Java congelado, `tests/fixtures/content/java/language.json` (só o módulo Fundamentos), para não quebrarem quando o curso ganha módulos. O conteúdo real é conferido pelo validador (`tests/content.test.js`).
```

- [ ] **Step 7: Commit**

```bash
git add tests/fixtures tests/helpers/fetch-from-disk.js tests/data/fetch-from-disk.test.js README.md
git commit -m "Congela o manifesto de Java usado pelos testes da plataforma" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Módulo Introdução

**Files:**
- Modify: `content/java/language.json` (novo módulo, **antes** de `fundamentos`)
- Create: `content/java/01-introducao/01-o-que-e-java.md`, `02-jdk-jre-jvm.md`, `03-instalacao.md`, `04-primeiro-programa.md`, `questions.json`, `flashcards.json`
- Create: `verify/java/introducao/ola/Ola.java`, `q09-arquivo-com-outro-nome.java`, `q10-maiusculas.java`, `aula-print-println.java`, `aula-comentarios.java`

**Interfaces:**
- Consumes: formato de conteúdo (spec seção 4); diretivas do conferidor (Task 1).
- Produces: módulo `java.introducao`, com as aulas `o-que-e-java`, `jdk-jre-jvm`, `instalacao` e `primeiro-programa`.

- [ ] **Step 1: Registrar o módulo (o validador passa a falhar)**

Em `content/java/language.json`, insira como **primeiro** item de `modules`:

```json
    {
      "id": "introducao",
      "dir": "01-introducao",
      "title": "Introdução",
      "description": "O que é Java, como ele roda, a instalação do JDK e o seu primeiro programa.",
      "lessons": [
        { "id": "o-que-e-java", "file": "01-o-que-e-java.md", "title": "O que é Java", "minutes": 7 },
        { "id": "jdk-jre-jvm", "file": "02-jdk-jre-jvm.md", "title": "JDK, JRE e JVM", "minutes": 7 },
        { "id": "instalacao", "file": "03-instalacao.md", "title": "Instalando o JDK e escolhendo um editor", "minutes": 10 },
        { "id": "primeiro-programa", "file": "04-primeiro-programa.md", "title": "Seu primeiro programa", "minutes": 10 }
      ]
    },
```

Run: `npm test`
Expected: FAIL só em "conteúdo de todas as linguagens é válido" (os testes de tela seguem passando, por causa da fixture da Task 2), com `pasta 01-introducao não existe`.

- [ ] **Step 2: Escrever as aulas**

`content/java/01-introducao/01-o-que-e-java.md`:
````markdown
# O que é Java

Java é uma linguagem de programação criada nos anos 1990 pela Sun Microsystems, hoje parte da Oracle. Ela roda em sistemas de bancos, lojas virtuais, aplicativos Android, servidores e muito mais.

## Compilada para bytecode

Em muitas linguagens, o código vira instruções para um processador específico. Em Java é diferente:

1. Você escreve o código-fonte em arquivos `.java`.
2. O compilador `javac` transforma esse código em **bytecode**, guardado em arquivos `.class`.
3. A **JVM** (Java Virtual Machine) lê e executa esse bytecode.

```text
Ola.java  --javac-->  Ola.class (bytecode)  --JVM-->  programa rodando
```

> [!NOTE]
> Enquanto o programa roda, a JVM traduz as partes mais usadas do bytecode para código de máquina. Esse tradutor é o compilador JIT, e é um dos motivos de Java ser rápido.

## Escreva uma vez, rode em qualquer lugar

Como o bytecode não depende do processador nem do sistema operacional, o mesmo `.class` roda no Windows, no Linux e no macOS. Basta ter uma JVM instalada. Esse é o lema *write once, run anywhere*.

## Versões e LTS

Sai uma versão nova do Java a cada seis meses. Algumas são **LTS** (*Long-Term Support*, suporte de longo prazo) e recebem correções por muitos anos: 8, 11, 17, 21 e 25.

> [!TIP]
> Este curso usa o **Java 21**, uma versão LTS muito usada no mercado. Quando um recurso só existir a partir de certa versão, a aula avisa, por exemplo: "Java 16+".
````

`content/java/01-introducao/02-jdk-jre-jvm.md`:
````markdown
# JDK, JRE e JVM

Três siglas aparecem o tempo todo quando se fala de Java. Uma está dentro da outra:

| Sigla | Nome | O que é |
|---|---|---|
| **JVM** | Java Virtual Machine | A máquina virtual que executa o bytecode |
| **JRE** | Java Runtime Environment | JVM + bibliotecas padrão: o necessário para *rodar* programas |
| **JDK** | Java Development Kit | JRE + ferramentas para *desenvolver*: `javac`, `jar`, `jshell`, `javadoc`... |

> [!IMPORTANT]
> Para programar, instale sempre o **JDK**. Só com a JRE não há o compilador `javac`.

A partir do Java 11, a Oracle deixou de distribuir uma JRE separada. Hoje o caminho normal é instalar o JDK, que já traz tudo.

## O que a JVM faz por você

- **Executa o bytecode** no sistema em que está instalada.
- **Gerencia a memória:** o *garbage collector* (coletor de lixo) libera sozinho a memória de objetos que o programa não usa mais. Em Java, você não precisa liberar memória manualmente.
- **Verifica o bytecode** antes de executar, o que traz mais segurança.

## As ferramentas do JDK que você vai usar

- `javac`: compila arquivos `.java` em `.class`.
- `java`: executa um programa e, desde o Java 11, roda direto um programa de um arquivo `.java` só.
- `jshell`: terminal interativo para testar trechos de código (Java 9+).
- `jar`: empacota vários `.class` num arquivo `.jar`.
````

`content/java/01-introducao/03-instalacao.md`:
````markdown
# Instalando o JDK e escolhendo um editor

## 1. Instale o JDK 21

Duas opções gratuitas e confiáveis:

- **Eclipse Temurin**, no site adoptium.net: escolha a versão 21 (LTS) para o seu sistema.
- **Oracle JDK**, no site oracle.com/java.

No Windows e no macOS, o instalador cuida de quase tudo. No Linux, o gerenciador de pacotes da distribuição costuma ter o JDK 21.

## 2. Confira no terminal

Abra um terminal novo (o Prompt de Comando ou o PowerShell, no Windows) e digite:

```text
java -version
javac -version
```

Os dois comandos devem mostrar a versão 21. Se o `javac` não for encontrado, o JDK não está instalado ou a pasta `bin` dele não está no **PATH**, a lista de pastas onde o sistema procura programas.

> [!TIP]
> Muitas ferramentas também procuram a variável de ambiente `JAVA_HOME`, que deve apontar para a pasta do JDK (sem o `bin` no final).

## 3. Escolha onde escrever o código

- **IntelliJ IDEA Community:** gratuito, completo e feito para Java.
- **VS Code** com o *Extension Pack for Java*: leve, bom para quem já usa o VS Code.
- **Eclipse IDE:** gratuito e tradicional em empresas.

Qualquer um serve. Até um editor de texto simples funciona, desde que você compile pelo terminal.

## 4. Teste rápido com o jshell

```text
jshell
jshell> 1 + 2
$1 ==> 3
jshell> /exit
```

O `jshell` mostra o resultado de cada linha na hora. É ótimo para experimentar enquanto você estuda.
````

`content/java/01-introducao/04-primeiro-programa.md`:
````markdown
# Seu primeiro programa

## O código

Crie um arquivo chamado **`Ola.java`** com este conteúdo:

```java
public class Ola {
    public static void main(String[] args) {
        System.out.println("Olá!");
    }
}
```

- `public class Ola`: declara uma classe pública chamada `Ola`. Em Java, todo código fica dentro de classes.
- `public static void main(String[] args)`: o método por onde o programa começa. A assinatura precisa ser exatamente essa.
- `System.out.println("Olá!");`: imprime o texto e pula uma linha. Toda instrução termina com `;`.

> [!IMPORTANT]
> Uma classe `public` precisa estar num arquivo com **o mesmo nome**, inclusive nas maiúsculas: `public class Ola` vai em `Ola.java`. Se o nome não bater, o `javac` acusa: *class Ola is public, should be declared in a file named Ola.java*.

## Compilar e executar

No terminal, dentro da pasta do arquivo:

```text
javac Ola.java     (gera Ola.class)
java Ola           (executa, sem a extensão)
```

Desde o Java 11, para programas de um arquivo só, dá para pular o `javac`:

```text
java Ola.java
```

## print, println e comentários

```java
System.out.print("a");     // imprime sem pular linha
System.out.println("b");   // imprime e pula linha
System.out.println("c");
// saída:
// ab
// c

/* comentário de
   várias linhas */

/** comentário de documentação (Javadoc) */
```

## Erros comuns de quem está começando

- **Esquecer o `;`** no fim da instrução.
- **Trocar maiúsculas e minúsculas:** Java diferencia `System` de `system`, e `system.out.println` não compila.
- **Dar ao arquivo um nome diferente do da classe pública.**
- **Esquecer de salvar** o arquivo antes de compilar.
````

- [ ] **Step 3: Escrever perguntas e cartas**

`content/java/01-introducao/questions.json`:
```json
{
  "questions": [
    {
      "id": "java.introducao.q01", "type": "multiple", "difficulty": 1, "lesson": "o-que-e-java",
      "prompt": "O compilador `javac` transforma o código-fonte Java em quê?",
      "options": ["Bytecode, guardado em arquivos `.class`", "Código de máquina de um processador específico", "Código JavaScript", "Um arquivo `.exe` do Windows"], "answer": 0,
      "explanation": "O `javac` gera **bytecode** (arquivos `.class`). Quem executa esse bytecode é a JVM, que durante a execução ainda traduz as partes mais usadas para código de máquina."
    },
    {
      "id": "java.introducao.q02", "type": "truefalse", "difficulty": 1, "lesson": "o-que-e-java",
      "prompt": "O mesmo arquivo `.class` pode rodar no Windows, no Linux e no macOS, desde que haja uma JVM instalada.",
      "answer": true,
      "explanation": "É o lema *escreva uma vez, rode em qualquer lugar*: o bytecode não depende do sistema operacional, e cada sistema tem a sua JVM."
    },
    {
      "id": "java.introducao.q03", "type": "multiple", "difficulty": 1, "lesson": "jdk-jre-jvm",
      "prompt": "Qual é o papel da JVM?",
      "options": ["Executar o bytecode", "Compilar arquivos `.java`", "Editar o código-fonte", "Controlar as versões do código"], "answer": 0,
      "explanation": "A JVM (Java Virtual Machine) executa o bytecode. Quem compila é o `javac`, que vem no JDK."
    },
    {
      "id": "java.introducao.q04", "type": "multiple", "difficulty": 1, "lesson": "jdk-jre-jvm",
      "prompt": "Para **compilar** programas Java, o que você precisa instalar?",
      "options": ["O JDK", "Só a JRE", "Só um editor de texto", "O Node.js"], "answer": 0,
      "explanation": "O JDK traz o compilador `javac`. A JRE serve só para rodar programas, e um editor de texto não compila nada sozinho."
    },
    {
      "id": "java.introducao.q05", "type": "truefalse", "difficulty": 2, "lesson": "jdk-jre-jvm",
      "prompt": "O `javac` faz parte do JDK, mas não faz parte da JRE.",
      "answer": true,
      "explanation": "A JRE tem a JVM e as bibliotecas para executar programas. As ferramentas de desenvolvimento, como o `javac`, só vêm no JDK."
    },
    {
      "id": "java.introducao.q06", "type": "multiple", "difficulty": 1, "lesson": "instalacao",
      "prompt": "Qual comando mostra a versão do compilador Java instalado?",
      "options": ["`javac -version`", "`java --compile`", "`jdk -v`", "`javac --start`"], "answer": 0,
      "explanation": "`javac -version` mostra a versão do compilador. Se o comando não for encontrado, o JDK não está instalado ou não está no PATH."
    },
    {
      "id": "java.introducao.q07", "type": "fill", "difficulty": 1, "lesson": "primeiro-programa",
      "prompt": "Complete a assinatura do método por onde todo programa Java começa:",
      "code": "public static ___ main(String[] args) {",
      "blanks": [["void"]],
      "explanation": "O `main` não devolve nada, por isso o tipo de retorno é `void`. A assinatura completa é `public static void main(String[] args)`."
    },
    {
      "id": "java.introducao.q08", "type": "order", "difficulty": 1, "lesson": "primeiro-programa",
      "prompt": "Coloque as linhas na ordem certa para formar o primeiro programa:",
      "lines": ["public class Ola {", "    public static void main(String[] args) {", "        System.out.println(\"Olá!\");", "    }", "}"],
      "explanation": "A classe envolve o método `main`, que envolve a instrução. Cada `{` aberto é fechado na ordem inversa."
    },
    {
      "id": "java.introducao.q09", "type": "multiple", "difficulty": 2, "lesson": "primeiro-programa",
      "prompt": "O arquivo se chama `Programa.java` e contém `public class Ola { ... }`. O que acontece ao rodar `javac Programa.java`?",
      "options": ["Erro de compilação: a classe pública `Ola` precisa estar em `Ola.java`", "Compila e gera `Programa.class`", "Compila e gera `Ola.class` sem nenhum aviso", "Compila, mas dá erro ao executar"], "answer": 0,
      "explanation": "Uma classe `public` precisa estar num arquivo com o mesmo nome. O `javac` acusa: *class Ola is public, should be declared in a file named Ola.java*."
    },
    {
      "id": "java.introducao.q10", "type": "truefalse", "difficulty": 1, "lesson": "primeiro-programa",
      "prompt": "Java diferencia maiúsculas de minúsculas: `System` e `system` são nomes diferentes.",
      "answer": true,
      "explanation": "Java é *case sensitive*. `system.out.println(...)` não compila, porque não existe nada chamado `system`."
    },
    {
      "id": "java.introducao.q11", "type": "multiple", "difficulty": 2, "lesson": "primeiro-programa",
      "prompt": "Desde o Java 11, qual comando roda um programa de um único arquivo `Ola.java` sem chamar o `javac` antes?",
      "options": ["`java Ola.java`", "`javac Ola`", "`java -compile Ola`", "`run Ola.java`"], "answer": 0,
      "explanation": "Desde o Java 11, `java Ola.java` compila o arquivo na memória e executa na hora. Em projetos com vários arquivos, continua valendo compilar com `javac` e executar com `java`."
    },
    {
      "id": "java.introducao.q12", "type": "multiple", "difficulty": 1, "lesson": "o-que-e-java",
      "prompt": "Qual destas versões do Java é LTS (suporte de longo prazo)?",
      "options": ["21", "19", "20", "22"], "answer": 0,
      "explanation": "As versões LTS recentes são 8, 11, 17, 21 e 25. As versões 19, 20 e 22 tiveram suporte só até a versão seguinte sair."
    },
    {
      "id": "java.introducao.q13", "type": "fill", "difficulty": 1, "lesson": "primeiro-programa",
      "prompt": "Complete para imprimir o texto e pular uma linha depois dele:",
      "code": "System.out.___(\"Olá, mundo!\");",
      "blanks": [["println"]],
      "explanation": "`println` imprime e pula linha; `print` imprime sem pular."
    },
    {
      "id": "java.introducao.q14", "type": "truefalse", "difficulty": 2, "lesson": "jdk-jre-jvm",
      "prompt": "O *garbage collector* da JVM libera automaticamente a memória de objetos que o programa não usa mais.",
      "answer": true,
      "explanation": "Em Java, você não libera memória manualmente: o coletor de lixo encontra objetos sem referências e recupera a memória."
    },
    {
      "id": "java.introducao.q15", "type": "multiple", "difficulty": 2, "lesson": "primeiro-programa",
      "prompt": "Que tipo de comentário é `/** ... */`?",
      "options": ["Comentário de documentação (Javadoc)", "Comentário de uma linha", "Um erro de sintaxe", "Um comentário que é executado"], "answer": 0,
      "explanation": "`//` comenta uma linha, `/* ... */` comenta várias, e `/** ... */` é o comentário de documentação usado pela ferramenta `javadoc`."
    }
  ]
}
```

`content/java/01-introducao/flashcards.json`:
```json
{
  "cards": [
    { "id": "java.introducao.f01", "lesson": "o-que-e-java", "front": "O que significa \"escreva uma vez, rode em qualquer lugar\"?", "back": "O código vira bytecode, que roda em qualquer sistema com uma JVM, sem precisar recompilar." },
    { "id": "java.introducao.f02", "lesson": "o-que-e-java", "front": "O que é bytecode?", "back": "O código intermediário (arquivos `.class`) gerado pelo `javac` e executado pela JVM." },
    { "id": "java.introducao.f03", "lesson": "jdk-jre-jvm", "front": "Qual a diferença entre JDK, JRE e JVM?", "back": "JVM executa o bytecode. JRE = JVM + bibliotecas para rodar programas. JDK = JRE + ferramentas de desenvolvimento, como `javac`, `jar` e `jshell`." },
    { "id": "java.introducao.f04", "lesson": "jdk-jre-jvm", "front": "O que faz o garbage collector?", "back": "Libera automaticamente a memória de objetos que não têm mais nenhuma referência." },
    { "id": "java.introducao.f05", "lesson": "instalacao", "front": "Como conferir se o JDK está instalado?", "back": "Com `java -version` e `javac -version` no terminal. Se o `javac` não for encontrado, falta o JDK ou ele não está no PATH." },
    { "id": "java.introducao.f06", "lesson": "instalacao", "front": "Para que serve o `jshell`?", "back": "É um terminal interativo (Java 9+) para testar trechos de código sem criar classe nem compilar." },
    { "id": "java.introducao.f07", "lesson": "primeiro-programa", "front": "Qual é a assinatura do método `main`?", "back": "`public static void main(String[] args)`" },
    { "id": "java.introducao.f08", "lesson": "primeiro-programa", "front": "Que regra liga o nome do arquivo à classe?", "back": "Uma classe `public` precisa estar num arquivo com o mesmo nome, inclusive nas maiúsculas: `public class Ola` vai em `Ola.java`." },
    { "id": "java.introducao.f09", "lesson": "primeiro-programa", "front": "Quais são os dois passos clássicos para rodar um programa?", "back": "Compilar com `javac Ola.java` (gera `Ola.class`) e executar com `java Ola`, sem a extensão." },
    { "id": "java.introducao.f10", "lesson": "primeiro-programa", "front": "Qual a diferença entre `print` e `println`?", "back": "`println` pula uma linha depois do texto; `print` não pula." }
  ]
}
```

- [ ] **Step 4: Rodar o validador**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Escrever os trechos de conferência**

`verify/java/introducao/ola/Ola.java`:
```java
// verifica: a aula primeiro-programa, q08 e f09 (javac + java, com o arquivo de mesmo nome da classe)
// modo: javac
// classe: Ola
// saida:
// Olá!
public class Ola {
    public static void main(String[] args) {
        System.out.println("Olá!");
    }
}
```

`verify/java/introducao/q09-arquivo-com-outro-nome.java`:
```java
// verifica: java.introducao.q09 e f08 (classe pública num arquivo de outro nome)
// modo: javac
// espera: erro-de-compilacao
// erro-contem: class Ola is public, should be declared in a file named Ola.java
public class Ola {
    public static void main(String[] args) {
        System.out.println("Olá!");
    }
}
```

`verify/java/introducao/q10-maiusculas.java`:
```java
// verifica: java.introducao.q10 e a aula primeiro-programa (system com minúscula não compila)
// espera: erro-de-compilacao
// erro-contem: package system does not exist
class Main {
    public static void main(String[] args) {
        system.out.println("x");
    }
}
```

`verify/java/introducao/aula-print-println.java`:
```java
// verifica: q13, f10 e a aula primeiro-programa (print não pula linha; println pula)
// saida:
// ab
// c
class Main {
    public static void main(String[] args) {
        System.out.print("a");
        System.out.println("b");
        System.out.println("c");
    }
}
```

`verify/java/introducao/aula-comentarios.java`:
```java
// verifica: q15 e a aula primeiro-programa (os três tipos de comentário não executam)
// saida:
// comentários não executam
class Main {
    /** comentário de documentação (Javadoc) */
    public static void main(String[] args) {
        // comentário de uma linha
        /* comentário de
           várias linhas */
        System.out.println("comentários não executam");
    }
}
```

- [ ] **Step 6: Conferir com o JDK 21**

Run (PowerShell): `$env:JAVA_HOME = "$env:USERPROFILE\tools\jdk-21.0.12.1+1"; node tools/verify-java.mjs`
Expected: todos passam (`37/37 trechos conferidos.`). Se algum falhar, descubra se o erro está no conteúdo ou no trecho, corrija e rode de novo. Nunca ajuste a saída esperada sem entender a diferença.

- [ ] **Step 7: Commit**

```bash
git add content verify
git commit -m "Adiciona módulo Java › Introdução" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Módulo Orientação a Objetos

**Files:**
- Modify: `content/java/language.json` (novo módulo, **depois** de `fundamentos`)
- Create: `content/java/03-poo/01-classes-e-objetos.md`, `02-construtores.md`, `03-encapsulamento.md`, `04-heranca-e-polimorfismo.md`, `05-abstratas-e-interfaces.md`, `06-static-e-final.md`, `questions.json`, `flashcards.json`
- Create: 51 trechos em `verify/java/poo/` (listados no Step 5)

**Interfaces:**
- Consumes: formato de conteúdo (spec seção 4); diretivas do conferidor (Task 1).
- Produces: módulo `java.poo`, com as aulas `classes-e-objetos`, `construtores`, `encapsulamento`, `heranca-e-polimorfismo`, `abstratas-e-interfaces` e `static-e-final`. A carta `java.poo.f12` cita métodos abstratos e `private` (Java 9+); a Task 9 trava isso num teste de regressão.

- [ ] **Step 1: Registrar o módulo (o validador passa a falhar)**

Em `content/java/language.json`, acrescente depois do módulo `fundamentos`:

```json
    {
      "id": "poo",
      "dir": "03-poo",
      "title": "Orientação a Objetos",
      "description": "Classes, objetos, construtores, encapsulamento, herança, polimorfismo, classes abstratas, interfaces, static e final.",
      "lessons": [
        { "id": "classes-e-objetos", "file": "01-classes-e-objetos.md", "title": "Classes e objetos", "minutes": 10 },
        { "id": "construtores", "file": "02-construtores.md", "title": "Construtores", "minutes": 9 },
        { "id": "encapsulamento", "file": "03-encapsulamento.md", "title": "Encapsulamento", "minutes": 9 },
        { "id": "heranca-e-polimorfismo", "file": "04-heranca-e-polimorfismo.md", "title": "Herança e polimorfismo", "minutes": 12 },
        { "id": "abstratas-e-interfaces", "file": "05-abstratas-e-interfaces.md", "title": "Classes abstratas e interfaces", "minutes": 11 },
        { "id": "static-e-final", "file": "06-static-e-final.md", "title": "static e final", "minutes": 8 }
      ]
    }
```

Run: `npm test`
Expected: FAIL só em "conteúdo de todas as linguagens é válido" (os testes de tela seguem passando, por causa da fixture da Task 2), com `pasta 03-poo não existe`.

- [ ] **Step 2: Escrever as aulas**

`content/java/03-poo/01-classes-e-objetos.md`:
````markdown
# Classes e objetos

Até aqui, todo o código ficou dentro do `main`. Programas maiores organizam dados e comportamentos em **classes**.

- **Classe** é o molde: diz quais dados (**atributos**) e quais ações (**métodos**) uma coisa tem.
- **Objeto** é uma coisa concreta feita a partir do molde. Cada objeto guarda os próprios valores.

```java
class Pessoa {
    String nome;   // atributo
    int idade;     // atributo

    void apresentar() {   // método
        System.out.println("Oi, eu sou " + nome + " e tenho " + idade + " anos.");
    }
}
```

## Criando objetos com `new`

```java
Pessoa ana = new Pessoa();
ana.nome = "Ana";
ana.idade = 30;
ana.apresentar();   // Oi, eu sou Ana e tenho 30 anos.

Pessoa caio = new Pessoa();
caio.nome = "Caio";
caio.apresentar();  // Oi, eu sou Caio e tenho 0 anos.
```

O operador `new` cria o objeto na memória e devolve uma **referência** para ele. O ponto (`.`) acessa os atributos e os métodos daquele objeto.

> [!NOTE]
> Atributos que não recebem valor começam com o **valor padrão**: `0` para números, `false` para `boolean`, o caractere nulo para `char` e `null` para objetos (como `String`). Por isso `caio.idade` vale `0`. Já as variáveis locais, declaradas dentro de métodos, não têm valor padrão.

## Variáveis guardam referências

Uma variável cujo tipo é uma classe não guarda o objeto em si, e sim o "endereço" dele. Copiar a variável copia o endereço:

```java
Pessoa a = new Pessoa();
a.nome = "Ana";
Pessoa b = a;          // b aponta para o MESMO objeto
b.nome = "Bia";
System.out.println(a.nome);  // Bia
```

Pelo mesmo motivo, `==` entre objetos compara referências: dois objetos criados com `new` são diferentes para o `==`, mesmo que tenham os mesmos dados.

## `null`: nenhuma referência

```java
Pessoa p = null;   // p não aponta para objeto nenhum
p.apresentar();    // lança NullPointerException
```

> [!CAUTION]
> Chamar um método ou acessar um atributo por uma referência `null` compila, mas lança `NullPointerException` quando o programa roda.

## Imprimindo um objeto

`System.out.println(ana)` chama o método `toString()` do objeto. Se a classe não define o seu, o padrão mostra o nome da classe, um `@` e um código, algo como `Pessoa@1b6d3586`. Na aula de herança você vai ver como escrever o seu próprio `toString()`.
````

`content/java/03-poo/02-construtores.md`:
````markdown
# Construtores

Criar o objeto e depois preencher atributo por atributo é cansativo e fácil de esquecer. O **construtor** recebe os dados já na criação.

```java
class Pessoa {
    String nome;
    int idade;

    Pessoa(String nome, int idade) {   // construtor
        this.nome = nome;
        this.idade = idade;
    }
}

Pessoa ana = new Pessoa("Ana", 30);
```

- O construtor tem **o mesmo nome da classe** e **nenhum tipo de retorno** (nem `void`).
- Ele roda automaticamente a cada `new`.

## `this`: o próprio objeto

Dentro da classe, `this` é a referência ao objeto que está sendo usado. Em `this.nome = nome`, `this.nome` é o atributo e `nome` é o parâmetro.

> [!WARNING]
> Sem o `this`, a linha `nome = nome;` atribui o parâmetro a ele mesmo, e o atributo continua `null`. O código compila, mas não faz o que você queria.

## O construtor padrão

Se a classe **não declara nenhum** construtor, o compilador cria um sem parâmetros, que não faz nada. Por isso `new Pessoa()` funcionava na aula anterior.

> [!IMPORTANT]
> Assim que você declara um construtor, o padrão deixa de existir. Na classe acima, que só declara `Pessoa(String nome, int idade)`, `new Pessoa()` não compila: *constructor Pessoa in class Pessoa cannot be applied to given types*.

## Vários construtores

Uma classe pode ter vários construtores, desde que os parâmetros sejam diferentes (isso se chama **sobrecarga**). Um construtor pode chamar outro com `this(...)`:

```java
class Pessoa {
    String nome;
    int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    Pessoa(String nome) {
        this(nome, 0);    // chama o construtor de cima
    }
}

Pessoa bia = new Pessoa("Bia");
System.out.println(bia.nome + ", " + bia.idade);  // Bia, 0
```

> [!NOTE]
> No Java 21, `this(...)` precisa ser a **primeira instrução** do construtor. Se vier depois de outra linha, o `javac` acusa: *call to this must be first statement in constructor*. Versões mais novas do Java passaram a permitir algumas instruções antes dessa chamada, mas este curso segue o Java 21.
````

`content/java/03-poo/03-encapsulamento.md`:
````markdown
# Encapsulamento

Se qualquer parte do programa pode mexer direto nos atributos, nada impede um saldo negativo ou uma idade de -5. **Encapsular** é esconder os atributos e oferecer métodos que controlam o acesso a eles.

## Modificadores de acesso

| Modificador | A própria classe | Mesmo pacote | Subclasse em outro pacote | Qualquer classe |
|---|---|---|---|---|
| `private` | sim | não | não | não |
| (nenhum) | sim | sim | não | não |
| `protected` | sim | sim | sim | não |
| `public` | sim | sim | sim | sim |

> [!NOTE]
> **Pacote** é um grupo de classes relacionadas, como `java.util`. Sem modificador, o acesso fica restrito ao pacote; por isso esse nível se chama *acesso de pacote*.

## Atributos privados, métodos públicos

```java
public class Conta {
    private double saldo;

    public double getSaldo() {      // lê o saldo
        return saldo;
    }

    public void depositar(double valor) {
        if (valor > 0) {            // a regra fica num lugar só
            saldo += valor;
        }
    }
}
```

```java
Conta c = new Conta();
c.depositar(100);
c.depositar(-50);                    // ignorado pela validação
System.out.println(c.getSaldo());    // 100.0
c.saldo = 1000;                      // não compila: saldo has private access in Conta
```

## Getters e setters

A convenção do Java (chamada JavaBeans) usa `getAtributo()` para ler e `setAtributo(valor)` para alterar. Para `boolean`, o getter costuma começar com `is`, como `isAtivo()`.

```java
public class Pessoa {
    private String nome;
    private int idade;

    public Pessoa(String nome) {
        this.nome = nome;
    }

    public String getNome() { return nome; }

    public int getIdade() { return idade; }

    public void setIdade(int idade) {
        if (idade < 0) {
            System.out.println("Idade inválida: " + idade);
            return;
        }
        this.idade = idade;
    }
}
```

```java
Pessoa p = new Pessoa("Ana");
p.setIdade(-5);     // Idade inválida: -5
p.setIdade(20);
System.out.println(p.getNome() + ", " + p.getIdade());  // Ana, 20
```

> [!TIP]
> Não crie um setter para cada atributo por hábito. Se um dado não deve mudar depois da criação (como o nome acima), receba-o no construtor e ofereça só o getter.
````

`content/java/03-poo/04-heranca-e-polimorfismo.md`:
````markdown
# Herança e polimorfismo

## Herança com `extends`

Quando várias classes têm dados e comportamentos em comum, a parte comum pode ficar numa **superclasse**. As **subclasses** herdam tudo o que não é `private` e acrescentam o que é delas.

```java
class Animal {
    protected String nome;

    Animal(String nome) {
        this.nome = nome;
    }

    String som() {
        return "...";
    }

    String apresentar() {
        return nome + " faz " + som();
    }
}

class Cachorro extends Animal {
    Cachorro(String nome) {
        super(nome);           // chama o construtor de Animal
    }

    @Override
    String som() {
        return "Au";
    }
}
```

```java
Cachorro rex = new Cachorro("Rex");
System.out.println(rex.apresentar());  // Rex faz Au
```

- Em Java, uma classe estende **uma única** classe: `class C extends A, B` não compila.
- Uma classe que não estende nenhuma outra estende `Object` sem você escrever nada. Por isso todo objeto tem métodos como `toString()`.

## `super`

- `super(...)` chama o construtor da superclasse. No Java 21, precisa ser a **primeira instrução** do construtor.
- Se você não escrever, o compilador coloca `super()`, sem argumentos. Quando a superclasse não tem construtor sem parâmetros (como `Animal` acima), a subclasse **precisa** chamar `super(...)` com os argumentos; senão, o código não compila.
- `super.metodo()` chama a versão da superclasse de um método sobrescrito.

Como o construtor da superclasse roda primeiro, a construção vai "de cima para baixo":

```java
class A {
    A() { System.out.print("A"); }
}

class B extends A {
    B() { System.out.print("B"); }
}

new B();   // imprime AB
```

## Sobrescrita e `@Override`

A subclasse pode **sobrescrever** um método herdado: mesmo nome, mesmos parâmetros, comportamento novo. A anotação `@Override` é opcional, mas pede ao compilador que confira: se você errar o nome (`Som()` em vez de `som()`), ele acusa *method does not override or implement a method from a supertype*.

```java
class Gato extends Animal {
    Gato(String nome) {
        super(nome);
    }

    @Override
    String som() {
        return "Miau";
    }

    @Override
    public String toString() {        // sobrescreve o toString() de Object
        return "Gato " + nome;
    }
}

class Filhote extends Cachorro {
    Filhote(String nome) {
        super(nome);
    }

    @Override
    String som() {
        return super.som() + " (fininho)";   // usa a versão de Cachorro
    }
}
```

```java
System.out.println(new Gato("Mimi"));          // Gato Mimi
System.out.println(new Filhote("Toby").som());  // Au (fininho)
```

> [!NOTE]
> O `toString()` de `Object` é `public`, então a versão sobrescrita também precisa ser `public`. Ao sobrescrever, não dá para diminuir o acesso: sem o `public`, o `javac` acusa *attempting to assign weaker access privileges; was public*.

## Sobrecarga não é sobrescrita

**Sobrecarga** (*overload*) é ter métodos com o mesmo nome e parâmetros diferentes; o compilador escolhe pela lista de argumentos.

```java
class Calculadora {
    int somar(int a, int b) { return a + b; }
    double somar(double a, double b) { return a + b; }
    int somar(int a, int b, int c) { return a + b + c; }
}

Calculadora calc = new Calculadora();
System.out.println(calc.somar(1, 2));     // 3
System.out.println(calc.somar(1.5, 2));   // 3.5
System.out.println(calc.somar(1, 2, 3));  // 6
```

## Polimorfismo

Uma variável do tipo da superclasse pode guardar um objeto de qualquer subclasse. Na hora de chamar um método sobrescrito, vale o **objeto real**, não o tipo da variável:

```java
Animal[] animais = { new Cachorro("Rex"), new Gato("Mimi"), new Animal("Bicho") };
for (Animal a : animais) {
    System.out.println(a.som());
}
// Au
// Miau
// ...
```

O mesmo laço funciona para qualquer tipo de animal, inclusive os que ainda vão ser criados.

> [!WARNING]
> Pela variável `Animal a`, só dá para chamar o que `Animal` declara. Se só `Cachorro` tem o método `buscarBolinha()`, então `a.buscarBolinha()` não compila (*cannot find symbol*), mesmo que o objeto seja um cachorro.

Para usar o que só a subclasse tem, converta a referência (*cast*), de preferência depois de conferir o tipo com `instanceof`:

```java
if (a instanceof Cachorro) {
    Cachorro c = (Cachorro) a;
    c.buscarBolinha();
}
```

Se o objeto não for mesmo um `Cachorro`, o cast lança `ClassCastException`. No módulo Java Moderno você vai ver um jeito mais curto de escrever esse `if` (Java 16+).
````

`content/java/03-poo/05-abstratas-e-interfaces.md`:
````markdown
# Classes abstratas e interfaces

## Classes abstratas

Algumas classes existem só para servir de base: não faz sentido criar uma "forma" qualquer, só retângulos, círculos etc. Uma classe **abstrata** não pode ser instanciada e pode ter métodos **abstratos**, sem corpo, que as subclasses são obrigadas a implementar.

```java
abstract class Forma {
    private String nome;

    Forma(String nome) {          // classe abstrata pode ter construtor
        this.nome = nome;
    }

    abstract double area();       // método abstrato: sem corpo

    String descrever() {          // método concreto: com corpo
        return nome + " com área " + area();
    }
}

class Retangulo extends Forma {
    private double largura;
    private double altura;

    Retangulo(double largura, double altura) {
        super("Retângulo");
        this.largura = largura;
        this.altura = altura;
    }

    @Override
    double area() {
        return largura * altura;
    }
}
```

```java
Forma f = new Retangulo(3, 4);
System.out.println(f.descrever());  // Retângulo com área 12.0
Forma g = new Forma("?");           // não compila: Forma is abstract; cannot be instantiated
```

- Uma classe abstrata pode ter atributos, construtores e métodos com corpo, como uma classe comum.
- Toda subclasse **concreta** (não abstrata) precisa implementar todos os métodos abstratos. Se esquecer um, o código não compila: *Circulo is not abstract and does not override abstract method area() in Forma*.

## Interfaces

Uma **interface** define um contrato: o que uma classe sabe fazer, sem dizer como.

```java
interface Voador {
    void voar();      // public e abstract, mesmo sem escrever
}

interface Nadador {
    void nadar();
}

class Pato implements Voador, Nadador {
    @Override
    public void voar() { System.out.println("Pato voando"); }

    @Override
    public void nadar() { System.out.println("Pato nadando"); }
}
```

```java
Voador v = new Pato();   // a interface também serve de tipo
v.voar();                // Pato voando
```

- Uma classe estende **uma** classe, mas pode implementar **várias** interfaces.
- Métodos de interface são `public` mesmo sem escrever. Por isso, ao implementar, o método precisa ser `public`; sem isso, o `javac` acusa *attempting to assign weaker access privileges; was public*.

## O que mais cabe numa interface

```java
interface Saudacao {
    String PREFIXO = "Olá, ";              // constante: public static final

    String nome();                          // abstrato

    default String saudar() {               // Java 8+: tem corpo e é herdado
        return PREFIXO + formatar(nome());
    }

    static String saudacaoPadrao() {        // Java 8+: chamado pela interface
        return PREFIXO + "mundo";
    }

    private String formatar(String s) {     // Java 9+: ajuda os outros métodos
        return s.toUpperCase();
    }
}

class Visitante implements Saudacao {
    @Override
    public String nome() {
        return "Ana";
    }
}
```

```java
System.out.println(new Visitante().saudar());     // Olá, ANA
System.out.println(Saudacao.saudacaoPadrao());     // Olá, mundo
```

Uma interface não tem construtor nem atributos de instância: todo atributo declarado nela é uma constante (`public static final`).

## Abstrata ou interface?

| Característica | Classe abstrata | Interface |
|---|---|---|
| Quantas uma classe pode usar | uma (`extends`) | várias (`implements`) |
| Atributos de instância | pode ter | não tem (só constantes) |
| Construtor | pode ter | não tem |
| Ideia | "é um tipo de" (base comum) | "sabe fazer" (contrato) |

> [!TIP]
> Na dúvida, comece pela interface: ela não prende a classe a uma hierarquia, e a classe continua livre para estender outra.
````

`content/java/03-poo/06-static-e-final.md`:
````markdown
# static e final

## `static`: da classe, não do objeto

Um atributo comum existe em cada objeto. Um atributo `static` existe **uma vez só**, na classe, e é compartilhado por todos os objetos.

```java
class Contador {
    static int total = 0;   // um só, da classe
    int id;                 // um em cada objeto

    Contador() {
        total++;
        id = total;
    }
}
```

```java
Contador a = new Contador();
Contador b = new Contador();
Contador c = new Contador();
System.out.println(Contador.total);  // 3
System.out.println(b.id);            // 2
```

Um método `static` também é da classe e é chamado pelo nome dela, sem criar objeto: `Math.max(3, 7)` e `Integer.parseInt("42")` são exemplos. O `main` é `static` porque a JVM o chama antes de existir qualquer objeto.

> [!CAUTION]
> Um método `static` não tem `this`, porque não há um objeto "atual". Por isso ele não usa diretamente atributos e métodos de instância. Em `Contador`, um método `static` que tentasse ler `id` daria *non-static variable id cannot be referenced from a static context*.

## `final`: não muda mais

| Onde | O que `final` impede |
|---|---|
| Variável ou atributo | receber outro valor depois do primeiro |
| Método | ser sobrescrito por subclasses |
| Classe | ser estendida (`String` é `final`, por exemplo) |

```java
final double taxa = 0.1;
taxa = 0.2;   // não compila: cannot assign a value to final variable taxa
```

Um atributo `final` precisa receber valor na declaração ou no construtor. Se um construtor deixar de atribuir, o código não compila.

`final` numa variável de objeto trava a **referência**, não o objeto:

```java
final int[] numeros = {1, 2, 3};
numeros[0] = 10;          // pode: muda o conteúdo do array
numeros = new int[3];     // não compila: tentaria trocar a referência
```

## Constantes

`static final` cria uma constante da classe. Por convenção, o nome fica em maiúsculas, com `_` entre as palavras:

```java
class Config {
    static final int MAX_TENTATIVAS = 3;
    static final String NOME_DO_APP = "Central";
}

System.out.println(Config.MAX_TENTATIVAS);  // 3
```
````

- [ ] **Step 3: Escrever perguntas e cartas**

`content/java/03-poo/questions.json`:
```json
{
  "questions": [
    {
      "id": "java.poo.q01", "type": "multiple", "difficulty": 1, "lesson": "classes-e-objetos",
      "prompt": "Qual palavra-chave cria um objeto a partir de uma classe?",
      "options": ["`class`", "`new`", "`this`", "`object`"], "answer": 1,
      "explanation": "`new` cria o objeto na memória, executa o construtor e devolve uma referência para ele, como em `Pessoa ana = new Pessoa();`."
    },
    {
      "id": "java.poo.q02", "type": "multiple", "difficulty": 2, "lesson": "classes-e-objetos",
      "prompt": "Com `class Pessoa { String nome; }`, o que este código imprime?\n\n```java\nPessoa a = new Pessoa();\na.nome = \"Ana\";\nPessoa b = a;\nb.nome = \"Bia\";\nSystem.out.println(a.nome);\n```",
      "options": ["Ana", "Bia", "null", "Erro de compilação"], "answer": 1,
      "explanation": "`Pessoa b = a;` copia a **referência**, não o objeto. `a` e `b` apontam para o mesmo objeto, então mudar o nome por `b` muda o que se vê por `a`."
    },
    {
      "id": "java.poo.q03", "type": "truefalse", "difficulty": 1, "lesson": "classes-e-objetos",
      "prompt": "Um atributo `int` que não recebe valor começa valendo `0`.",
      "answer": true,
      "explanation": "Atributos recebem valor padrão: `0` para números, `false` para `boolean` e `null` para objetos. Já as variáveis locais, declaradas dentro de métodos, precisam receber um valor antes de serem usadas."
    },
    {
      "id": "java.poo.q04", "type": "multiple", "difficulty": 2, "lesson": "classes-e-objetos",
      "prompt": "O que acontece ao executar este trecho?\n\n```java\nPessoa p = null;\np.apresentar();\n```",
      "options": ["Lança `NullPointerException`", "Imprime `null`", "Erro de compilação", "Não acontece nada"], "answer": 0,
      "explanation": "O código compila, mas `p` não aponta para objeto nenhum. Chamar um método por uma referência `null` lança `NullPointerException` durante a execução."
    },
    {
      "id": "java.poo.q05", "type": "truefalse", "difficulty": 2, "lesson": "construtores",
      "prompt": "Se uma classe declara só o construtor `Pessoa(String nome)`, ainda dá para criar um objeto com `new Pessoa()`.",
      "answer": false,
      "explanation": "O compilador só cria o construtor padrão (sem parâmetros) quando a classe não declara **nenhum** construtor. Aqui, `new Pessoa()` dá o erro *constructor Pessoa in class Pessoa cannot be applied to given types*."
    },
    {
      "id": "java.poo.q06", "type": "multiple", "difficulty": 2, "lesson": "construtores",
      "prompt": "O que este código imprime?\n\n```java\nclass Pessoa {\n    String nome;\n\n    Pessoa(String nome) {\n        nome = nome;\n    }\n}\n\n// no main:\nSystem.out.println(new Pessoa(\"Ana\").nome);\n```",
      "options": ["Ana", "null", "Erro de compilação", "Uma linha vazia"], "answer": 1,
      "explanation": "Sem `this.`, `nome = nome` atribui o parâmetro a ele mesmo, e o atributo continua com o valor padrão `null`. O certo é `this.nome = nome;`."
    },
    {
      "id": "java.poo.q07", "type": "truefalse", "difficulty": 3, "lesson": "construtores",
      "prompt": "No Java 21, a chamada `this(...)` para outro construtor pode aparecer depois de outras instruções do construtor.",
      "answer": false,
      "explanation": "No Java 21, `this(...)` (e também `super(...)`) precisa ser a primeira instrução do construtor; senão, o `javac` acusa *call to this must be first statement in constructor*. Versões mais novas do Java passaram a permitir algumas instruções antes dessa chamada."
    },
    {
      "id": "java.poo.q08", "type": "fill", "difficulty": 1, "lesson": "construtores",
      "prompt": "Complete para guardar o parâmetro no atributo de mesmo nome:",
      "code": "Pessoa(String nome) {\n    ___.nome = nome;\n}",
      "blanks": [["this"]],
      "explanation": "`this` é a referência ao próprio objeto: `this.nome` é o atributo, e `nome` sozinho é o parâmetro."
    },
    {
      "id": "java.poo.q09", "type": "multiple", "difficulty": 1, "lesson": "encapsulamento",
      "prompt": "Qual modificador deixa um atributo acessível **somente** dentro da própria classe?",
      "options": ["`public`", "`protected`", "`private`", "Nenhum modificador (acesso de pacote)"], "answer": 2,
      "explanation": "`private` restringe à própria classe. Sem modificador, o acesso vale para o pacote inteiro; `protected` libera também para subclasses; `public` libera para todos."
    },
    {
      "id": "java.poo.q10", "type": "multiple", "difficulty": 2, "lesson": "encapsulamento",
      "prompt": "A classe `Conta` declara `private double saldo;`. O que acontece quando outra classe faz isto?\n\n```java\nConta c = new Conta();\nc.saldo = 1000;\n```",
      "options": ["Erro de compilação: `saldo` é privado", "Funciona, e o saldo passa a ser 1000", "Compila, mas lança exceção ao executar", "Compila, mas a atribuição é ignorada"], "answer": 0,
      "explanation": "Atributos `private` só podem ser acessados dentro da própria classe. O `javac` acusa *saldo has private access in Conta*. De fora, use os métodos públicos, como `depositar`."
    },
    {
      "id": "java.poo.q11", "type": "truefalse", "difficulty": 2, "lesson": "encapsulamento",
      "prompt": "Um atributo `protected` pode ser acessado por outras classes do mesmo pacote, mesmo que elas não sejam subclasses.",
      "answer": true,
      "explanation": "`protected` inclui tudo o que o acesso de pacote permite e ainda libera para subclasses em outros pacotes."
    },
    {
      "id": "java.poo.q12", "type": "fill", "difficulty": 1, "lesson": "encapsulamento",
      "prompt": "Complete o *getter* do atributo `saldo`, seguindo a convenção de nomes do Java:",
      "code": "public double ___() {\n    return saldo;\n}",
      "blanks": [["getSaldo"]],
      "explanation": "Pela convenção JavaBeans, o método que lê um atributo se chama `get` mais o nome do atributo com inicial maiúscula: `getSaldo()`. Para `boolean`, usa-se `is`, como em `isAtivo()`."
    },
    {
      "id": "java.poo.q13", "type": "multiple", "difficulty": 1, "lesson": "heranca-e-polimorfismo",
      "prompt": "Qual palavra-chave faz uma classe herdar de outra classe?",
      "options": ["`implements`", "`extends`", "`inherits`", "`super`"], "answer": 1,
      "explanation": "`class Cachorro extends Animal` faz `Cachorro` herdar de `Animal`. `implements` é usado com interfaces."
    },
    {
      "id": "java.poo.q14", "type": "multiple", "difficulty": 2, "lesson": "heranca-e-polimorfismo",
      "prompt": "O que este código imprime?\n\n```java\nclass Animal {\n    String som() { return \"...\"; }\n}\n\nclass Cachorro extends Animal {\n    @Override\n    String som() { return \"Au\"; }\n}\n\n// no main:\nAnimal a = new Cachorro();\nSystem.out.println(a.som());\n```",
      "options": ["...", "Au", "Erro de compilação", "Au..."], "answer": 1,
      "explanation": "É o polimorfismo: o método executado é escolhido pelo **objeto real** (`Cachorro`), não pelo tipo da variável (`Animal`)."
    },
    {
      "id": "java.poo.q15", "type": "truefalse", "difficulty": 1, "lesson": "heranca-e-polimorfismo",
      "prompt": "Uma classe Java pode estender duas classes ao mesmo tempo, como em `class C extends A, B`.",
      "answer": false,
      "explanation": "Em Java, uma classe estende uma única classe. Para assumir vários contratos, ela pode implementar várias interfaces."
    },
    {
      "id": "java.poo.q16", "type": "multiple", "difficulty": 2, "lesson": "heranca-e-polimorfismo",
      "prompt": "Para que serve marcar um método com `@Override`?",
      "options": ["Para o compilador acusar erro se o método não sobrescrever nenhum método herdado", "Para o método rodar mais rápido", "Para impedir que subclasses sobrescrevam o método", "Sem `@Override`, a sobrescrita não acontece"], "answer": 0,
      "explanation": "A sobrescrita acontece com ou sem a anotação, mas `@Override` pede ao compilador que confira. Um nome digitado errado, como `Som()` no lugar de `som()`, vira o erro *method does not override or implement a method from a supertype*, em vez de um método novo que ninguém chama. Quem impede a sobrescrita é `final`."
    },
    {
      "id": "java.poo.q17", "type": "multiple", "difficulty": 3, "lesson": "heranca-e-polimorfismo",
      "prompt": "O que `new Cachorro();` imprime?\n\n```java\nclass Animal {\n    Animal() { System.out.print(\"A\"); }\n}\n\nclass Cachorro extends Animal {\n    Cachorro() { System.out.print(\"C\"); }\n}\n```",
      "options": ["C", "CA", "AC", "A"], "answer": 2,
      "explanation": "O compilador coloca `super()` como primeira instrução do construtor de `Cachorro`. Então o construtor de `Animal` roda antes e imprime `A`; só depois vem o `C`."
    },
    {
      "id": "java.poo.q18", "type": "order", "difficulty": 2, "lesson": "heranca-e-polimorfismo",
      "prompt": "No Java 21, monte o construtor de `Cachorro`, que repassa o nome ao construtor de `Animal` e depois guarda a raça:",
      "lines": ["Cachorro(String nome, String raca) {", "    super(nome);", "    this.raca = raca;", "}"],
      "explanation": "No Java 21, `super(...)` precisa ser a primeira instrução do construtor; só depois vêm as linhas da própria subclasse."
    },
    {
      "id": "java.poo.q19", "type": "truefalse", "difficulty": 1, "lesson": "abstratas-e-interfaces",
      "prompt": "Dá para criar um objeto de uma classe abstrata diretamente com `new`.",
      "answer": false,
      "explanation": "Classe abstrata serve de base: `new Forma(\"?\")` dá *Forma is abstract; cannot be instantiated*. O que se cria são objetos das subclasses concretas, como `new Retangulo(3, 4)`."
    },
    {
      "id": "java.poo.q20", "type": "multiple", "difficulty": 2, "lesson": "abstratas-e-interfaces",
      "prompt": "Uma classe **não abstrata** implementa uma interface, mas não implementa um dos métodos dela. O que acontece?",
      "options": ["Erro de compilação", "Compila, e o método devolve `null`", "Compila, e o erro só aparece quando o método é chamado", "Compila, e o método fica sem fazer nada"], "answer": 0,
      "explanation": "Uma classe concreta precisa implementar todos os métodos abstratos que recebeu. O `javac` acusa algo como *Pato is not abstract and does not override abstract method nadar() in Nadador*."
    },
    {
      "id": "java.poo.q21", "type": "fill", "difficulty": 1, "lesson": "abstratas-e-interfaces",
      "prompt": "`Voador` e `Nadador` são interfaces. Complete para que `Pato` assuma os dois contratos:",
      "code": "class Pato ___ Voador, Nadador {",
      "blanks": [["implements"]],
      "explanation": "Classes usam `implements` com interfaces e podem implementar várias, separadas por vírgula. `extends` serve para estender uma classe (só uma)."
    },
    {
      "id": "java.poo.q22", "type": "multiple", "difficulty": 2, "lesson": "abstratas-e-interfaces",
      "prompt": "Desde o Java 8, que tipo de método de interface tem corpo e é herdado pelas classes que implementam a interface, sem obrigá-las a sobrescrevê-lo?",
      "options": ["`abstract`", "`default`", "`final`", "`protected`"], "answer": 1,
      "explanation": "Métodos `default` têm implementação e são herdados. Métodos `abstract` não têm corpo, e os modificadores `final` e `protected` nem são permitidos em métodos de interface."
    },
    {
      "id": "java.poo.q23", "type": "multiple", "difficulty": 2, "lesson": "static-e-final",
      "prompt": "O que este código imprime?\n\n```java\nclass Contador {\n    static int total = 0;\n\n    Contador() {\n        total++;\n    }\n}\n\n// no main:\nnew Contador();\nnew Contador();\nnew Contador();\nSystem.out.println(Contador.total);\n```",
      "options": ["0", "1", "3", "Erro de compilação"], "answer": 2,
      "explanation": "`total` é `static`: existe uma vez só, compartilhado por todos os objetos. Cada construtor soma 1 ao mesmo contador, então o total é 3."
    },
    {
      "id": "java.poo.q24", "type": "truefalse", "difficulty": 2, "lesson": "static-e-final",
      "prompt": "Um método `static` pode usar diretamente um atributo de instância (não `static`) da mesma classe.",
      "answer": false,
      "explanation": "Um método `static` pertence à classe e não tem `this`, então não há objeto de onde ler o atributo. O `javac` acusa *non-static variable ... cannot be referenced from a static context*."
    },
    {
      "id": "java.poo.q25", "type": "multiple", "difficulty": 3, "lesson": "static-e-final",
      "prompt": "O que este código faz?\n\n```java\nfinal int[] numeros = {1, 2, 3};\nnumeros[0] = 10;\nSystem.out.println(numeros[0]);\n```",
      "options": ["Imprime 10", "Imprime 1", "Erro de compilação, porque `numeros` é `final`", "Lança exceção ao executar"], "answer": 0,
      "explanation": "`final` impede trocar a referência (`numeros = new int[3]` não compila), mas o conteúdo do array ainda pode mudar."
    },
    {
      "id": "java.poo.q26", "type": "fill", "difficulty": 2, "lesson": "static-e-final",
      "prompt": "Complete para que nenhuma outra classe possa estender `Moeda`:",
      "code": "public ___ class Moeda {",
      "blanks": [["final"]],
      "explanation": "Uma classe `final` não pode ser estendida: `class Real extends Moeda` daria *cannot inherit from final Moeda*. `String` é um exemplo de classe `final` da biblioteca padrão."
    }
  ]
}
```

`content/java/03-poo/flashcards.json`:
```json
{
  "cards": [
    { "id": "java.poo.f01", "lesson": "classes-e-objetos", "front": "Qual a diferença entre classe e objeto?", "back": "Classe é o molde (atributos e métodos). Objeto é uma instância concreta, criada a partir da classe com `new`." },
    { "id": "java.poo.f02", "lesson": "classes-e-objetos", "front": "O que acontece em `Pessoa b = a;`?", "back": "Copia a referência: `a` e `b` passam a apontar para o mesmo objeto. Mudar o objeto por uma muda o que se vê pela outra." },
    { "id": "java.poo.f03", "lesson": "classes-e-objetos", "front": "Quais valores padrão os atributos recebem?", "back": "`0` para números, `false` para `boolean`, o caractere nulo para `char` e `null` para objetos. Variáveis locais não recebem valor padrão." },
    { "id": "java.poo.f04", "lesson": "construtores", "front": "Quando o compilador cria o construtor padrão (sem parâmetros)?", "back": "Só quando a classe não declara nenhum construtor." },
    { "id": "java.poo.f05", "lesson": "construtores", "front": "Para que serve `this`?", "back": "É a referência ao próprio objeto. `this.nome = nome` separa o atributo do parâmetro de mesmo nome; `this(...)` chama outro construtor da mesma classe." },
    { "id": "java.poo.f06", "lesson": "encapsulamento", "front": "Quais são os níveis de acesso, do mais fechado ao mais aberto?", "back": "`private` (só a classe), sem modificador (o pacote), `protected` (pacote e subclasses) e `public` (todos)." },
    { "id": "java.poo.f07", "lesson": "encapsulamento", "front": "O que é encapsulamento?", "back": "Esconder os atributos (`private`) e expor métodos que controlam o acesso, como getters e setters com validação." },
    { "id": "java.poo.f08", "lesson": "heranca-e-polimorfismo", "front": "O que é polimorfismo?", "back": "Uma variável do tipo da superclasse pode guardar um objeto de uma subclasse, e o método sobrescrito executado é o do objeto real." },
    { "id": "java.poo.f09", "lesson": "heranca-e-polimorfismo", "front": "Qual a diferença entre sobrecarga e sobrescrita?", "back": "Sobrecarga (*overload*): mesmo nome, parâmetros diferentes. Sobrescrita (*override*): a subclasse redefine um método herdado, com o mesmo nome e os mesmos parâmetros." },
    { "id": "java.poo.f10", "lesson": "heranca-e-polimorfismo", "front": "Para que serve `super`?", "back": "`super(...)` chama o construtor da superclasse (no Java 21, como primeira instrução). `super.metodo()` chama a versão da superclasse de um método sobrescrito." },
    { "id": "java.poo.f11", "lesson": "abstratas-e-interfaces", "front": "O que é uma classe abstrata?", "back": "Uma classe que não pode ser instanciada. Pode ter métodos abstratos (sem corpo), que as subclasses concretas precisam implementar, e também atributos, construtores e métodos com corpo." },
    { "id": "java.poo.f12", "lesson": "abstratas-e-interfaces", "front": "O que uma interface pode ter?", "back": "Métodos abstratos (o contrato), métodos `default` e `static` (Java 8+), métodos `private` (Java 9+) e constantes. Uma classe pode implementar várias interfaces." },
    { "id": "java.poo.f13", "lesson": "static-e-final", "front": "O que significa `static`?", "back": "O membro pertence à classe, não a cada objeto: é compartilhado e acessado pelo nome da classe, como em `Contador.total`." },
    { "id": "java.poo.f14", "lesson": "static-e-final", "front": "O que `final` impede numa variável, num método e numa classe?", "back": "Variável: receber outro valor. Método: ser sobrescrito. Classe: ser estendida." }
  ]
}
```

- [ ] **Step 4: Rodar o validador**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Escrever os trechos de conferência**

Aula `classes-e-objetos`:

`verify/java/poo/aula-classes-e-objetos.java`:
```java
// verifica: q01, f01 e a aula classes-e-objetos (new, atributos e idade com valor padrão)
// saida:
// Oi, eu sou Ana e tenho 30 anos.
// Oi, eu sou Caio e tenho 0 anos.
class Main {
    public static void main(String[] args) {
        Pessoa ana = new Pessoa();
        ana.nome = "Ana";
        ana.idade = 30;
        ana.apresentar();

        Pessoa caio = new Pessoa();
        caio.nome = "Caio";
        caio.apresentar();
    }
}

class Pessoa {
    String nome;
    int idade;

    void apresentar() {
        System.out.println("Oi, eu sou " + nome + " e tenho " + idade + " anos.");
    }
}
```

`verify/java/poo/q02-referencias.java`:
```java
// verifica: java.poo.q02, f02 e a aula classes-e-objetos (cópia de referência; == compara referências)
// saida:
// Bia
// true
// false
class Main {
    public static void main(String[] args) {
        Pessoa a = new Pessoa();
        a.nome = "Ana";
        Pessoa b = a;
        b.nome = "Bia";
        System.out.println(a.nome);
        System.out.println(a == b);

        Pessoa x = new Pessoa();
        x.nome = "Ana";
        Pessoa y = new Pessoa();
        y.nome = "Ana";
        System.out.println(x == y);
    }
}

class Pessoa {
    String nome;
}
```

`verify/java/poo/aula-valores-padrao-atributos.java`:
```java
// verifica: java.poo.q03, f03 e a aula classes-e-objetos (valores padrão de atributos; char começa no caractere nulo)
// saida:
// 0
// 0.0
// false
// 0
// null
class Main {
    public static void main(String[] args) {
        Exemplo e = new Exemplo();
        System.out.println(e.inteiro);
        System.out.println(e.decimal);
        System.out.println(e.logico);
        System.out.println((int) e.letra);
        System.out.println(e.texto);
    }
}

class Exemplo {
    int inteiro;
    double decimal;
    boolean logico;
    char letra;
    String texto;
}
```

`verify/java/poo/q04-null-pointer.java`:
```java
// verifica: java.poo.q04 e a aula classes-e-objetos (método chamado por uma referência null)
// espera: excecao NullPointerException
class Main {
    public static void main(String[] args) {
        Pessoa p = null;
        p.apresentar();
    }
}

class Pessoa {
    void apresentar() {
        System.out.println("Oi");
    }
}
```

`verify/java/poo/aula-tostring-padrao.java`:
```java
// verifica: a aula classes-e-objetos (o toString padrão começa com o nome da classe e @)
// saida:
// true
class Main {
    public static void main(String[] args) {
        Pessoa ana = new Pessoa();
        System.out.println(String.valueOf(ana).startsWith("Pessoa@"));
    }
}

class Pessoa {
    String nome;
}
```

Aula `construtores`:

`verify/java/poo/aula-construtores.java`:
```java
// verifica: java.poo.q08, f05 e a aula construtores (this.nome = nome; this(...) chama outro construtor)
// saida:
// Ana, 30
// Bia, 0
class Main {
    public static void main(String[] args) {
        Pessoa ana = new Pessoa("Ana", 30);
        Pessoa bia = new Pessoa("Bia");
        System.out.println(ana.nome + ", " + ana.idade);
        System.out.println(bia.nome + ", " + bia.idade);
    }
}

class Pessoa {
    String nome;
    int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    Pessoa(String nome) {
        this(nome, 0);
    }
}
```

`verify/java/poo/aula-sem-construtor-padrao.java`:
```java
// verifica: f04 e a aula construtores (com Pessoa(String, int) declarado, new Pessoa() não compila)
// espera: erro-de-compilacao
// erro-contem: constructor Pessoa in class Pessoa cannot be applied to given types
class Main {
    public static void main(String[] args) {
        new Pessoa();
    }
}

class Pessoa {
    String nome;
    int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }
}
```

`verify/java/poo/q05-sem-construtor-padrao.java`:
```java
// verifica: java.poo.q05 (com só Pessoa(String nome) declarado, new Pessoa() não compila)
// espera: erro-de-compilacao
// erro-contem: constructor Pessoa in class Pessoa cannot be applied to given types
class Main {
    public static void main(String[] args) {
        new Pessoa();
    }
}

class Pessoa {
    String nome;

    Pessoa(String nome) {
        this.nome = nome;
    }
}
```

`verify/java/poo/q06-sombra.java`:
```java
// verifica: java.poo.q06 e a aula construtores (nome = nome sem this deixa o atributo null)
// saida:
// null
class Main {
    public static void main(String[] args) {
        System.out.println(new Pessoa("Ana").nome);
    }
}

class Pessoa {
    String nome;

    Pessoa(String nome) {
        nome = nome;
    }
}
```

`verify/java/poo/q07-this-primeiro.java`:
```java
// verifica: java.poo.q07 e a aula construtores (no Java 21, this(...) precisa ser a primeira instrução)
// espera: erro-de-compilacao
// erro-contem: call to this must be first statement in constructor
class Main {
    public static void main(String[] args) {
        new Pessoa("Ana");
    }
}

class Pessoa {
    String nome;
    int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    Pessoa(String nome) {
        System.out.println("criando");
        this(nome, 0);
    }
}
```

Aula `encapsulamento`:

`verify/java/poo/aula-conta-encapsulada.java`:
```java
// verifica: java.poo.q12, f07 e a aula encapsulamento (getter e depósito com validação)
// saida:
// 100.0
class Main {
    public static void main(String[] args) {
        Conta c = new Conta();
        c.depositar(100);
        c.depositar(-50);
        System.out.println(c.getSaldo());
    }
}

class Conta {
    private double saldo;

    public double getSaldo() {
        return saldo;
    }

    public void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
        }
    }
}
```

`verify/java/poo/q10-acesso-privado.java`:
```java
// verifica: java.poo.q10, q09 e a aula encapsulamento (atributo private acessado de fora da classe)
// espera: erro-de-compilacao
// erro-contem: saldo has private access in Conta
class Main {
    public static void main(String[] args) {
        Conta c = new Conta();
        c.saldo = 1000;
    }
}

class Conta {
    private double saldo;
}
```

`verify/java/poo/aula-getter-setter.java`:
```java
// verifica: a aula encapsulamento (setter com validação e getters)
// saida:
// Idade inválida: -5
// Ana, 20
class Main {
    public static void main(String[] args) {
        Pessoa p = new Pessoa("Ana");
        p.setIdade(-5);
        p.setIdade(20);
        System.out.println(p.getNome() + ", " + p.getIdade());
    }
}

class Pessoa {
    private String nome;
    private int idade;

    public Pessoa(String nome) {
        this.nome = nome;
    }

    public String getNome() { return nome; }

    public int getIdade() { return idade; }

    public void setIdade(int idade) {
        if (idade < 0) {
            System.out.println("Idade inválida: " + idade);
            return;
        }
        this.idade = idade;
    }
}
```

`verify/java/poo/q11-protected-pacote.java`:
```java
// verifica: java.poo.q11, f06 e a tabela da aula encapsulamento (protected e sem modificador valem no mesmo pacote)
// saida:
// Rex
// 3
class Main {
    public static void main(String[] args) {
        Animal a = new Animal();
        a.nome = "Rex";
        a.idade = 3;
        System.out.println(a.nome);
        System.out.println(a.idade);
    }
}

class Animal {
    protected String nome;
    int idade;
}
```

`verify/java/poo/aula-private-subclasse.java`:
```java
// verifica: a tabela da aula encapsulamento e a aula heranca-e-polimorfismo (subclasse não enxerga o que é private)
// espera: erro-de-compilacao
// erro-contem: nome has private access in Animal
class Main {
    public static void main(String[] args) {
        System.out.println(new Cachorro().descrever());
    }
}

class Animal {
    private String nome = "Rex";
}

class Cachorro extends Animal {
    String descrever() {
        return nome;
    }
}
```

Aula `heranca-e-polimorfismo`:

`verify/java/poo/aula-heranca.java`:
```java
// verifica: q13, f08, f10 e a aula heranca-e-polimorfismo (extends, super, @Override, polimorfismo, super.metodo, toString e Object)
// saida:
// Rex faz Au
// Au
// Miau
// ...
// Au (fininho)
// Gato Mimi
// true
class Main {
    public static void main(String[] args) {
        Cachorro rex = new Cachorro("Rex");
        System.out.println(rex.apresentar());

        Animal[] animais = { new Cachorro("Rex"), new Gato("Mimi"), new Animal("Bicho") };
        for (Animal a : animais) {
            System.out.println(a.som());
        }

        System.out.println(new Filhote("Toby").som());
        System.out.println(new Gato("Mimi"));
        System.out.println(new Animal("Bicho") instanceof Object);
    }
}

class Animal {
    protected String nome;

    Animal(String nome) {
        this.nome = nome;
    }

    String som() {
        return "...";
    }

    String apresentar() {
        return nome + " faz " + som();
    }
}

class Cachorro extends Animal {
    Cachorro(String nome) {
        super(nome);
    }

    @Override
    String som() {
        return "Au";
    }
}

class Gato extends Animal {
    Gato(String nome) {
        super(nome);
    }

    @Override
    String som() {
        return "Miau";
    }

    @Override
    public String toString() {
        return "Gato " + nome;
    }
}

class Filhote extends Cachorro {
    Filhote(String nome) {
        super(nome);
    }

    @Override
    String som() {
        return super.som() + " (fininho)";
    }
}
```

`verify/java/poo/q15-heranca-multipla.java`:
```java
// verifica: java.poo.q15 e a aula heranca-e-polimorfismo (uma classe estende uma só classe)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
        System.out.println(new C());
    }
}

class A {}

class B {}

class C extends A, B {}
```

`verify/java/poo/aula-super-obrigatorio.java`:
```java
// verifica: a aula heranca-e-polimorfismo (sem construtor vazio na superclasse, a subclasse precisa chamar super(...))
// espera: erro-de-compilacao
// erro-contem: constructor Animal in class Animal cannot be applied to given types
class Main {
    public static void main(String[] args) {
        new Cachorro();
    }
}

class Animal {
    protected String nome;

    Animal(String nome) {
        this.nome = nome;
    }
}

class Cachorro extends Animal {
    Cachorro() {
        System.out.println("sem super(nome)");
    }
}
```

`verify/java/poo/aula-ordem-construtores.java`:
```java
// verifica: a aula heranca-e-polimorfismo (o construtor da superclasse roda primeiro)
// saida:
// AB
class Main {
    public static void main(String[] args) {
        new B();
    }
}

class A {
    A() { System.out.print("A"); }
}

class B extends A {
    B() { System.out.print("B"); }
}
```

`verify/java/poo/q17-ordem-construtores.java`:
```java
// verifica: java.poo.q17 (super() implícito: Animal antes de Cachorro)
// saida:
// AC
class Main {
    public static void main(String[] args) {
        new Cachorro();
    }
}

class Animal {
    Animal() { System.out.print("A"); }
}

class Cachorro extends Animal {
    Cachorro() { System.out.print("C"); }
}
```

`verify/java/poo/q14-polimorfismo.java`:
```java
// verifica: java.poo.q14 (vale o método do objeto real)
// saida:
// Au
class Main {
    public static void main(String[] args) {
        Animal a = new Cachorro();
        System.out.println(a.som());
    }
}

class Animal {
    String som() { return "..."; }
}

class Cachorro extends Animal {
    @Override
    String som() { return "Au"; }
}
```

`verify/java/poo/q16-override-erro.java`:
```java
// verifica: java.poo.q16 e a aula heranca-e-polimorfismo (@Override acusa nome errado)
// espera: erro-de-compilacao
// erro-contem: method does not override or implement a method from a supertype
class Main {
    public static void main(String[] args) {
        System.out.println(new Cachorro().som());
    }
}

class Animal {
    String som() { return "..."; }
}

class Cachorro extends Animal {
    @Override
    String Som() { return "Au"; }
}
```

`verify/java/poo/q16-sem-anotacao.java`:
```java
// verifica: java.poo.q16 (a sobrescrita acontece mesmo sem @Override)
// saida:
// Au
class Main {
    public static void main(String[] args) {
        Animal a = new Cachorro();
        System.out.println(a.som());
    }
}

class Animal {
    String som() { return "..."; }
}

class Cachorro extends Animal {
    String som() { return "Au"; }
}
```

`verify/java/poo/aula-tostring-publico.java`:
```java
// verifica: a aula heranca-e-polimorfismo (toString sobrescrito sem public diminui o acesso)
// espera: erro-de-compilacao
// erro-contem: attempting to assign weaker access privileges; was public
class Main {
    public static void main(String[] args) {
        System.out.println(new Gato());
    }
}

class Gato {
    @Override
    String toString() {
        return "Gato";
    }
}
```

`verify/java/poo/aula-sobrecarga.java`:
```java
// verifica: f09 e a aula heranca-e-polimorfismo (sobrecarga escolhida pelos argumentos)
// saida:
// 3
// 3.5
// 6
class Main {
    public static void main(String[] args) {
        Calculadora calc = new Calculadora();
        System.out.println(calc.somar(1, 2));
        System.out.println(calc.somar(1.5, 2));
        System.out.println(calc.somar(1, 2, 3));
    }
}

class Calculadora {
    int somar(int a, int b) { return a + b; }
    double somar(double a, double b) { return a + b; }
    int somar(int a, int b, int c) { return a + b + c; }
}
```

`verify/java/poo/aula-metodo-so-da-subclasse.java`:
```java
// verifica: a aula heranca-e-polimorfismo (pela variável Animal, só se chama o que Animal declara)
// espera: erro-de-compilacao
// erro-contem: cannot find symbol
class Main {
    public static void main(String[] args) {
        Animal a = new Cachorro();
        a.buscarBolinha();
    }
}

class Animal {}

class Cachorro extends Animal {
    void buscarBolinha() {
        System.out.println("Buscando!");
    }
}
```

`verify/java/poo/aula-instanceof.java`:
```java
// verifica: a aula heranca-e-polimorfismo (instanceof antes do cast)
// saida:
// true
// Buscando!
// false
class Main {
    public static void main(String[] args) {
        Animal a = new Cachorro();
        System.out.println(a instanceof Cachorro);
        if (a instanceof Cachorro) {
            Cachorro c = (Cachorro) a;
            c.buscarBolinha();
        }
        Animal g = new Gato();
        System.out.println(g instanceof Cachorro);
    }
}

class Animal {}

class Cachorro extends Animal {
    void buscarBolinha() {
        System.out.println("Buscando!");
    }
}

class Gato extends Animal {}
```

`verify/java/poo/aula-cast-invalido.java`:
```java
// verifica: a aula heranca-e-polimorfismo (cast para o tipo errado)
// espera: excecao ClassCastException
class Main {
    public static void main(String[] args) {
        Animal a = new Gato();
        Cachorro c = (Cachorro) a;
        System.out.println(c);
    }
}

class Animal {}

class Cachorro extends Animal {}

class Gato extends Animal {}
```

`verify/java/poo/q18-super-primeiro.java`:
```java
// verifica: java.poo.q18 e f10 (a ordem certa compila: super(...) primeiro)
// saida:
// Rex, vira-lata
class Main {
    public static void main(String[] args) {
        Cachorro c = new Cachorro("Rex", "vira-lata");
        System.out.println(c.nome + ", " + c.raca);
    }
}

class Animal {
    protected String nome;

    Animal(String nome) {
        this.nome = nome;
    }
}

class Cachorro extends Animal {
    String raca;

    Cachorro(String nome, String raca) {
        super(nome);
        this.raca = raca;
    }
}
```

`verify/java/poo/q18-super-depois.java`:
```java
// verifica: java.poo.q18 e a aula heranca-e-polimorfismo (no Java 21, super(...) depois de outra linha não compila)
// espera: erro-de-compilacao
// erro-contem: call to super must be first statement in constructor
class Main {
    public static void main(String[] args) {
        new Cachorro("Rex", "vira-lata");
    }
}

class Animal {
    protected String nome;

    Animal(String nome) {
        this.nome = nome;
    }
}

class Cachorro extends Animal {
    String raca;

    Cachorro(String nome, String raca) {
        this.raca = raca;
        super(nome);
    }
}
```

Aula `abstratas-e-interfaces`:

`verify/java/poo/aula-forma.java`:
```java
// verifica: f11 e a aula abstratas-e-interfaces (classe abstrata com atributo, construtor e método abstrato)
// saida:
// Retângulo com área 12.0
class Main {
    public static void main(String[] args) {
        Forma f = new Retangulo(3, 4);
        System.out.println(f.descrever());
    }
}

abstract class Forma {
    private String nome;

    Forma(String nome) {
        this.nome = nome;
    }

    abstract double area();

    String descrever() {
        return nome + " com área " + area();
    }
}

class Retangulo extends Forma {
    private double largura;
    private double altura;

    Retangulo(double largura, double altura) {
        super("Retângulo");
        this.largura = largura;
        this.altura = altura;
    }

    @Override
    double area() {
        return largura * altura;
    }
}
```

`verify/java/poo/q19-abstrata-new.java`:
```java
// verifica: java.poo.q19 e a aula abstratas-e-interfaces (classe abstrata não é instanciada)
// espera: erro-de-compilacao
// erro-contem: Forma is abstract; cannot be instantiated
class Main {
    public static void main(String[] args) {
        Forma g = new Forma("?");
    }
}

abstract class Forma {
    private String nome;

    Forma(String nome) {
        this.nome = nome;
    }

    abstract double area();
}
```

`verify/java/poo/aula-esquece-abstrato.java`:
```java
// verifica: f11 e a aula abstratas-e-interfaces (subclasse concreta sem implementar o método abstrato)
// espera: erro-de-compilacao
// erro-contem: Circulo is not abstract and does not override abstract method area() in Forma
class Main {
    public static void main(String[] args) {
        System.out.println(new Circulo());
    }
}

abstract class Forma {
    abstract double area();
}

class Circulo extends Forma {
}
```

`verify/java/poo/aula-pato.java`:
```java
// verifica: java.poo.q21 e a aula abstratas-e-interfaces (várias interfaces; interface como tipo)
// saida:
// Pato voando
// Pato nadando
// Pato voando
class Main {
    public static void main(String[] args) {
        Pato p = new Pato();
        p.voar();
        p.nadar();
        Voador v = new Pato();
        v.voar();
    }
}

interface Voador {
    void voar();
}

interface Nadador {
    void nadar();
}

class Pato implements Voador, Nadador {
    @Override
    public void voar() { System.out.println("Pato voando"); }

    @Override
    public void nadar() { System.out.println("Pato nadando"); }
}
```

`verify/java/poo/q20-nao-implementa.java`:
```java
// verifica: java.poo.q20 (classe concreta que não implementa um método da interface)
// espera: erro-de-compilacao
// erro-contem: Pato is not abstract and does not override abstract method nadar() in Nadador
class Main {
    public static void main(String[] args) {
        new Pato().voar();
    }
}

interface Voador {
    void voar();
}

interface Nadador {
    void nadar();
}

class Pato implements Voador, Nadador {
    @Override
    public void voar() { System.out.println("Pato voando"); }
}
```

`verify/java/poo/aula-implementa-sem-public.java`:
```java
// verifica: a aula abstratas-e-interfaces (método de interface implementado sem public)
// espera: erro-de-compilacao
// erro-contem: attempting to assign weaker access privileges; was public
class Main {
    public static void main(String[] args) {
        new Pato().voar();
    }
}

interface Voador {
    void voar();
}

class Pato implements Voador {
    void voar() { System.out.println("Pato voando"); }
}
```

`verify/java/poo/q22-default.java`:
```java
// verifica: java.poo.q22, f12 e a aula abstratas-e-interfaces (default, static, private e constante numa interface)
// saida:
// Olá, ANA
// Olá, mundo
class Main {
    public static void main(String[] args) {
        System.out.println(new Visitante().saudar());
        System.out.println(Saudacao.saudacaoPadrao());
    }
}

interface Saudacao {
    String PREFIXO = "Olá, ";

    String nome();

    default String saudar() {
        return PREFIXO + formatar(nome());
    }

    static String saudacaoPadrao() {
        return PREFIXO + "mundo";
    }

    private String formatar(String s) {
        return s.toUpperCase();
    }
}

class Visitante implements Saudacao {
    @Override
    public String nome() {
        return "Ana";
    }
}
```

`verify/java/poo/q22-final-em-interface.java`:
```java
// verifica: java.poo.q22 (final não é permitido em método de interface)
// espera: erro-de-compilacao
// erro-contem: modifier final not allowed here
class Main {
    public static void main(String[] args) {
    }
}

interface Saudacao {
    default final String saudar() {
        return "Olá";
    }
}
```

`verify/java/poo/q22-protected-em-interface.java`:
```java
// verifica: java.poo.q22 (protected não é permitido em método de interface)
// espera: erro-de-compilacao
// erro-contem: modifier protected not allowed here
class Main {
    public static void main(String[] args) {
    }
}

interface Saudacao {
    protected String nome();
}
```

`verify/java/poo/aula-interface-constante.java`:
```java
// verifica: f12 e a aula abstratas-e-interfaces (atributo de interface é constante)
// espera: erro-de-compilacao
// erro-contem: cannot assign a value to static final variable PREFIXO
class Main {
    public static void main(String[] args) {
        Saudacao.PREFIXO = "Oi, ";
    }
}

interface Saudacao {
    String PREFIXO = "Olá, ";
}
```

`verify/java/poo/aula-interface-sem-construtor.java`:
```java
// verifica: a tabela da aula abstratas-e-interfaces (interface não tem construtor)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
    }
}

interface Voador {
    Voador() {
    }
}
```

Aula `static-e-final`:

`verify/java/poo/q23-static-contador.java`:
```java
// verifica: java.poo.q23, f13 e a aula static-e-final (atributo static compartilhado)
// saida:
// 3
// 2
class Main {
    public static void main(String[] args) {
        Contador a = new Contador();
        Contador b = new Contador();
        Contador c = new Contador();
        System.out.println(Contador.total);
        System.out.println(b.id);
    }
}

class Contador {
    static int total = 0;
    int id;

    Contador() {
        total++;
        id = total;
    }
}
```

`verify/java/poo/q24-static-contexto.java`:
```java
// verifica: java.poo.q24 e a aula static-e-final (método static não usa atributo de instância)
// espera: erro-de-compilacao
// erro-contem: non-static variable id cannot be referenced from a static context
class Main {
    public static void main(String[] args) {
        Contador.mostrar();
    }
}

class Contador {
    static int total = 0;
    int id;

    static void mostrar() {
        System.out.println(id);
    }
}
```

`verify/java/poo/aula-final-variavel.java`:
```java
// verifica: f14 e a aula static-e-final (variável final não recebe outro valor)
// espera: erro-de-compilacao
// erro-contem: cannot assign a value to final variable taxa
class Main {
    public static void main(String[] args) {
        final double taxa = 0.1;
        taxa = 0.2;
    }
}
```

`verify/java/poo/aula-final-atributo.java`:
```java
// verifica: a aula static-e-final (atributo final precisa receber valor em todo construtor)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
        System.out.println(new Config().limite);
    }
}

class Config {
    final int limite;

    Config(int limite) {
        this.limite = limite;
    }

    Config() {
    }
}
```

`verify/java/poo/q25-final-referencia.java`:
```java
// verifica: java.poo.q25 e a aula static-e-final (final trava a referência, não o conteúdo)
// saida:
// 10
class Main {
    public static void main(String[] args) {
        final int[] numeros = {1, 2, 3};
        numeros[0] = 10;
        System.out.println(numeros[0]);
    }
}
```

`verify/java/poo/aula-final-referencia-reatribuir.java`:
```java
// verifica: java.poo.q25 e a aula static-e-final (trocar a referência final não compila)
// espera: erro-de-compilacao
// erro-contem: cannot assign a value to final variable numeros
class Main {
    public static void main(String[] args) {
        final int[] numeros = {1, 2, 3};
        numeros = new int[3];
    }
}
```

`verify/java/poo/aula-final-metodo.java`:
```java
// verifica: f14 e a aula static-e-final (método final não é sobrescrito)
// espera: erro-de-compilacao
// erro-contem: overridden method is final
class Main {
    public static void main(String[] args) {
        System.out.println(new Filha().nome());
    }
}

class Mae {
    final String nome() {
        return "Mãe";
    }
}

class Filha extends Mae {
    String nome() {
        return "Filha";
    }
}
```

`verify/java/poo/q26-final-classe.java`:
```java
// verifica: java.poo.q26 e f14 (classe final não é estendida)
// espera: erro-de-compilacao
// erro-contem: cannot inherit from final Moeda
class Main {
    public static void main(String[] args) {
        System.out.println(new Real());
    }
}

final class Moeda {
}

class Real extends Moeda {
}
```

`verify/java/poo/aula-final-string.java`:
```java
// verifica: java.poo.q26 e a aula static-e-final (String é final)
// espera: erro-de-compilacao
// erro-contem: cannot inherit from final String
class Main {
    public static void main(String[] args) {
    }
}

class MinhaString extends String {
}
```

`verify/java/poo/aula-constantes.java`:
```java
// verifica: a aula static-e-final (constante static final acessada pelo nome da classe)
// saida:
// 3
// Central
class Main {
    public static void main(String[] args) {
        System.out.println(Config.MAX_TENTATIVAS);
        System.out.println(Config.NOME_DO_APP);
    }
}

class Config {
    static final int MAX_TENTATIVAS = 3;
    static final String NOME_DO_APP = "Central";
}
```

- [ ] **Step 6: Conferir com o JDK 21**

Run (PowerShell): `$env:JAVA_HOME = "$env:USERPROFILE\tools\jdk-21.0.12.1+1"; node tools/verify-java.mjs`
Expected: todos passam (`88/88 trechos conferidos.`). Se algum falhar, descubra se o erro está no conteúdo ou no trecho, corrija e rode de novo. Nunca ajuste a saída esperada sem entender a diferença.

- [ ] **Step 7: Commit**

```bash
git add content verify
git commit -m "Adiciona módulo Java › Orientação a Objetos" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Módulo Coleções

**Files:**
- Modify: `content/java/language.json` (novo módulo, **depois** de `poo`)
- Create: `content/java/04-colecoes/01-listas.md`, `02-conjuntos.md`, `03-mapas.md`, `04-iteracao.md`, `05-ordenacao.md`, `questions.json`, `flashcards.json`
- Create: 30 trechos em `verify/java/colecoes/` (listados no Step 5)

**Interfaces:**
- Consumes: formato de conteúdo (spec seção 4); diretivas do conferidor (Task 1).
- Produces: módulo `java.colecoes`, com as aulas `listas`, `conjuntos`, `mapas`, `iteracao` e `ordenacao`.

- [ ] **Step 1: Registrar o módulo (o validador passa a falhar)**

Em `content/java/language.json`, acrescente depois do módulo `poo`:

```json
    {
      "id": "colecoes",
      "dir": "04-colecoes",
      "title": "Coleções",
      "description": "Listas, conjuntos e mapas para guardar dados que crescem, e como percorrer e ordenar cada um.",
      "lessons": [
        { "id": "listas", "file": "01-listas.md", "title": "Listas", "minutes": 10 },
        { "id": "conjuntos", "file": "02-conjuntos.md", "title": "Conjuntos", "minutes": 8 },
        { "id": "mapas", "file": "03-mapas.md", "title": "Mapas", "minutes": 9 },
        { "id": "iteracao", "file": "04-iteracao.md", "title": "Percorrendo coleções", "minutes": 8 },
        { "id": "ordenacao", "file": "05-ordenacao.md", "title": "Ordenação", "minutes": 10 }
      ]
    }
```

Run: `npm test`
Expected: FAIL só em "conteúdo de todas as linguagens é válido" (os testes de tela seguem passando, por causa da fixture da Task 2), com `pasta 04-colecoes não existe`.

- [ ] **Step 2: Escrever as aulas**

`content/java/04-colecoes/01-listas.md`:
````markdown
# Listas

Arrays têm tamanho fixo. Quando você não sabe quantos itens virão (os nomes de uma turma, os produtos de um carrinho), use uma **coleção**. A mais usada é a lista.

```java
import java.util.ArrayList;
import java.util.List;

List<String> nomes = new ArrayList<>();
nomes.add("Ana");
nomes.add("Bia");
nomes.add("Caio");
System.out.println(nomes);          // [Ana, Bia, Caio]
System.out.println(nomes.size());   // 3
System.out.println(nomes.get(0));   // Ana
```

- `List` é a interface (o contrato) e `ArrayList` é a implementação mais comum. Declarar a variável como `List` permite trocar a implementação depois sem mexer no resto do código.
- O tipo entre `< >` é o **genérico**: `List<String>` só aceita `String`. O `<>` vazio à direita (o "diamante", Java 7+) repete o tipo da esquerda.
- As coleções ficam no pacote `java.util`. Nos próximos exemplos, considere `import java.util.*;` no topo do arquivo, que importa tudo desse pacote.

## Operações comuns

| Método | O que faz |
|---|---|
| `add(x)` | acrescenta no fim |
| `add(i, x)` | insere na posição `i`, empurrando os outros |
| `get(i)` | devolve o item da posição `i` |
| `set(i, x)` | troca o item da posição `i` |
| `remove(i)` ou `remove(x)` | remove pela posição ou pelo valor |
| `size()` | quantos itens há |
| `contains(x)` | `true` se o item está na lista |
| `indexOf(x)` | a posição da primeira ocorrência, ou `-1` |
| `isEmpty()` | `true` se a lista está vazia |

```java
List<String> frutas = new ArrayList<>();
frutas.add("maçã");
frutas.add("uva");
frutas.add(0, "pera");                        // [pera, maçã, uva]
frutas.set(2, "kiwi");                        // [pera, maçã, kiwi]
frutas.remove("maçã");                        // [pera, kiwi]
System.out.println(frutas.contains("kiwi"));  // true
System.out.println(frutas.indexOf("uva"));    // -1
```

## Listas de números: as classes *wrapper*

Genéricos só aceitam objetos, então `List<int>` não compila (*unexpected type*). Use a classe *wrapper* correspondente: `Integer` para `int`, `Double` para `double`, `Character` para `char` e `Boolean` para `boolean`. A conversão entre `int` e `Integer` é automática (*autoboxing*).

```java
List<Integer> notas = new ArrayList<>();
notas.add(7);                  // o int 7 vira Integer sozinho
int primeira = notas.get(0);   // e volta a ser int
```

> [!CAUTION]
> Em `List<Integer>`, `remove(1)` remove o item da **posição** 1, e não o número 1. Para remover pelo valor, use `remove(Integer.valueOf(1))`.

```java
List<Integer> numeros = new ArrayList<>(List.of(10, 20, 1));
numeros.remove(1);                    // remove a posição 1: [10, 1]
numeros.remove(Integer.valueOf(1));   // remove o valor 1: [10]
```

## Listas que não mudam: `List.of` (Java 9+)

```java
List<String> cores = List.of("azul", "verde");
cores.add("roxo");   // lança UnsupportedOperationException
```

`List.of` cria uma lista **imutável**: `add`, `remove` e `set` lançam `UnsupportedOperationException`. Ela também recusa `null`: `List.of("a", null)` lança `NullPointerException`. Para uma lista que já começa com itens e pode mudar, copie: `new ArrayList<>(List.of("azul", "verde"))`.
````

`content/java/04-colecoes/02-conjuntos.md`:
````markdown
# Conjuntos

Um **conjunto** (`Set`) não guarda repetidos. É a coleção certa para perguntas como "esse e-mail já foi cadastrado?".

```java
Set<String> tags = new HashSet<>();
tags.add("java");
tags.add("sql");
boolean entrou = tags.add("java");         // false: já existia
System.out.println(tags.size());           // 2
System.out.println(tags.contains("sql"));  // true
```

`add` devolve `true` se o item entrou e `false` se ele já estava lá.

## Três implementações, três ordens

| Implementação | Ordem ao percorrer |
|---|---|
| `HashSet` | nenhuma ordem garantida (a mais rápida) |
| `LinkedHashSet` | a ordem de inserção |
| `TreeSet` | a ordem natural (números crescentes, textos em ordem alfabética) |

```java
List<String> entrada = List.of("uva", "maçã", "banana", "uva");

System.out.println(new LinkedHashSet<>(entrada));  // [uva, maçã, banana]
System.out.println(new TreeSet<>(entrada));        // [banana, maçã, uva]
```

> [!WARNING]
> Não conte com a ordem de um `HashSet`: ela depende dos itens e pode mudar entre versões do Java. Se a ordem importa, use `LinkedHashSet` ou `TreeSet`.

> [!NOTE]
> A ordem natural de textos compara os códigos dos caracteres, e todas as letras **maiúsculas vêm antes** das minúsculas. Por isso, um `TreeSet` com `"ana"`, `"Bia"` e `"Caio"` fica `[Bia, Caio, ana]`.

## Tirando os repetidos de uma lista

```java
List<Integer> comRepetidos = List.of(3, 1, 3, 2, 1);
Set<Integer> unicos = new LinkedHashSet<>(comRepetidos);
System.out.println(unicos);   // [3, 1, 2]
```

## Objetos das suas classes: `equals` e `hashCode`

O `HashSet` decide se dois objetos são "o mesmo" com os métodos `equals` e `hashCode`. `String`, `Integer` e as outras classes da biblioteca já os definem. Numa classe sua que não sobrescreve esses dois métodos, dois objetos com os mesmos dados contam como **diferentes**, e o conjunto guarda os dois. Os *records*, do módulo Java Moderno, já vêm com `equals` e `hashCode` prontos.
````

`content/java/04-colecoes/03-mapas.md`:
````markdown
# Mapas

Um **mapa** (`Map`) guarda pares **chave e valor**, como um dicionário: a partir da chave, você encontra o valor. As chaves não se repetem.

```java
Map<String, Integer> estoque = new HashMap<>();
estoque.put("caneta", 10);
estoque.put("caderno", 5);
estoque.put("caneta", 7);                     // chave repetida: troca o valor

System.out.println(estoque.get("caneta"));    // 7
System.out.println(estoque.get("borracha"));  // null (a chave não existe)
System.out.println(estoque.size());           // 2
```

## Operações comuns

| Método | O que faz |
|---|---|
| `put(k, v)` | guarda o par; se a chave já existe, troca o valor |
| `get(k)` | devolve o valor, ou `null` se a chave não existe |
| `getOrDefault(k, padrao)` | devolve o valor, ou `padrao` se a chave não existe |
| `containsKey(k)` | `true` se a chave existe |
| `remove(k)` | remove o par |
| `keySet()`, `values()`, `entrySet()` | as chaves, os valores e os pares |

## Contando ocorrências

Um uso clássico: contar quantas vezes cada palavra aparece.

```java
String[] palavras = {"sol", "lua", "sol", "mar", "sol"};
Map<String, Integer> contagem = new TreeMap<>();
for (String p : palavras) {
    contagem.put(p, contagem.getOrDefault(p, 0) + 1);
}
System.out.println(contagem);   // {lua=1, mar=1, sol=3}
```

## Percorrendo um mapa

```java
for (Map.Entry<String, Integer> par : contagem.entrySet()) {
    System.out.println(par.getKey() + ": " + par.getValue());
}
// lua: 1
// mar: 1
// sol: 3
```

## Qual implementação?

As mesmas três ideias dos conjuntos, agora para as chaves:

| Implementação | Ordem das chaves |
|---|---|
| `HashMap` | nenhuma ordem garantida (a mais usada) |
| `LinkedHashMap` | a ordem de inserção |
| `TreeMap` | a ordem natural das chaves |

> [!TIP]
> `Map.of("a", 1, "b", 2)` (Java 9+) cria um mapa pequeno que não pode ser alterado, como o `List.of`.
````

`content/java/04-colecoes/04-iteracao.md`:
````markdown
# Percorrendo coleções

## for-each

O jeito mais comum. Funciona com listas, conjuntos e com o `entrySet()` dos mapas:

```java
List<String> nomes = List.of("Ana", "Bia", "Caio");
for (String nome : nomes) {
    System.out.println(nome);
}
```

## for com índice

Útil em listas, quando você precisa da posição:

```java
for (int i = 0; i < nomes.size(); i++) {
    System.out.println(i + ": " + nomes.get(i));
}
// 0: Ana
// 1: Bia
// 2: Caio
```

## Não remova dentro do for-each

```java
List<String> nomes = new ArrayList<>(List.of("", "Ana", "", "Bia"));
for (String n : nomes) {
    if (n.isEmpty()) {
        nomes.remove(n);     // lança ConcurrentModificationException
    }
}
```

> [!CAUTION]
> Alterar uma lista enquanto o for-each a percorre é um erro. Na maioria dos casos, o Java lança `ConcurrentModificationException`. Nos outros, o laço termina antes da hora e pula itens sem avisar: começando com `["Ana", "", ""]`, sobra `[Ana, ]`.

## Removendo do jeito certo

Com um `Iterator`, que sabe remover o item atual com segurança:

```java
Iterator<String> it = nomes.iterator();
while (it.hasNext()) {
    String n = it.next();
    if (n.isEmpty()) {
        it.remove();
    }
}
System.out.println(nomes);   // [Ana, Bia]
```

Ou, mais curto (Java 8+), com `removeIf`:

```java
nomes.removeIf(n -> n.isEmpty());
```

O trecho `n -> n.isEmpty()` é uma **lambda**: uma pequena função que diz "remova cada `n` para o qual `n.isEmpty()` for verdadeiro". O módulo Java Moderno explica as lambdas em detalhe.
````

`content/java/04-colecoes/05-ordenacao.md`:
````markdown
# Ordenação

## Ordem natural

`Collections.sort(lista)` ordena pela **ordem natural**: números em ordem crescente e textos em ordem alfabética (com as maiúsculas antes das minúsculas).

```java
List<Integer> numeros = new ArrayList<>(List.of(5, 2, 9, 1));
Collections.sort(numeros);
System.out.println(numeros);   // [1, 2, 5, 9]
```

Para arrays, use `Arrays.sort(array)`.

> [!NOTE]
> `Collections.sort` altera a própria lista. Com uma lista imutável, como a de `List.of`, ele lança `UnsupportedOperationException`; copie antes para um `ArrayList`.

## Uma ordem que você escolhe: `Comparator`

```java
class Pessoa {
    private String nome;
    private int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    String getNome() { return nome; }

    int getIdade() { return idade; }

    @Override
    public String toString() { return nome + " (" + idade + ")"; }
}
```

Não existe uma ordem natural para pessoas: `Collections.sort(pessoas)` nem compila (*no suitable method found for sort*). Você diz como comparar com um **`Comparator`**:

```java
List<Pessoa> pessoas = new ArrayList<>(List.of(
    new Pessoa("Caio", 30), new Pessoa("Ana", 25), new Pessoa("Bia", 30)));

pessoas.sort(Comparator.comparing(Pessoa::getNome));
System.out.println(pessoas);   // [Ana (25), Bia (30), Caio (30)]

pessoas.sort(Comparator.comparingInt(Pessoa::getIdade).reversed());
System.out.println(pessoas);   // [Bia (30), Caio (30), Ana (25)]

pessoas.sort(Comparator.comparingInt(Pessoa::getIdade).thenComparing(Pessoa::getNome));
System.out.println(pessoas);   // [Ana (25), Bia (30), Caio (30)]
```

- `Pessoa::getNome` é uma **referência de método**: "use o `getNome` de cada pessoa". O módulo Java Moderno explica esse recurso.
- `Comparator.comparing(...)` compara pelo valor que a função devolve. `comparingInt`, `comparingLong` e `comparingDouble` fazem o mesmo com números, sem convertê-los em objetos.
- `.reversed()` inverte a ordem, e `.thenComparing(...)` desempata.

> [!NOTE]
> A ordenação de listas é **estável**: elementos empatados mantêm a ordem em que já estavam. Por isso, no segundo exemplo, Bia continua antes de Caio.

## Ordem natural para a sua classe: `Comparable`

Se a classe tem uma ordem "óbvia", ela pode implementar `Comparable` e definir o método `compareTo`, que devolve um número **negativo** se `this` vem antes, **zero** se empatam e **positivo** se `this` vem depois:

```java
class Produto implements Comparable<Produto> {
    private String nome;
    private double preco;

    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    @Override
    public int compareTo(Produto outro) {
        return Double.compare(this.preco, outro.preco);   // pelo preço
    }

    @Override
    public String toString() { return nome; }
}

List<Produto> produtos = new ArrayList<>(List.of(
    new Produto("caderno", 20.0), new Produto("caneta", 3.5), new Produto("mochila", 120.0)));
Collections.sort(produtos);
System.out.println(produtos);   // [caneta, caderno, mochila]
```

`Double.compare(a, b)` e `Integer.compare(a, b)` já devolvem negativo, zero ou positivo.
````

- [ ] **Step 3: Escrever perguntas e cartas**

`content/java/04-colecoes/questions.json`:
```json
{
  "questions": [
    {
      "id": "java.colecoes.q01", "type": "multiple", "difficulty": 1, "lesson": "listas",
      "prompt": "Qual é a principal vantagem de um `ArrayList` sobre um array?",
      "options": ["O tamanho cresce conforme você adiciona itens", "Aceita tipos primitivos, como `int`, diretamente", "Dispensa o `import`", "Guarda os itens já ordenados"], "answer": 0,
      "explanation": "Um array tem tamanho fixo; um `ArrayList` cresce sozinho a cada `add`. Ele só aceita objetos (`List<Integer>`, não `List<int>`), precisa de `import java.util.ArrayList;` e guarda os itens na ordem em que entraram."
    },
    {
      "id": "java.colecoes.q02", "type": "multiple", "difficulty": 2, "lesson": "listas",
      "prompt": "O que este código imprime?\n\n```java\nList<Integer> numeros = new ArrayList<>(List.of(5, 7, 1));\nnumeros.remove(1);\nSystem.out.println(numeros);\n```",
      "options": ["[5, 1]", "[5, 7]", "[7, 1]", "Erro de compilação"], "answer": 0,
      "explanation": "Com um `int`, `remove(1)` remove a **posição** 1 (o 7). Para remover o valor 1, seria `remove(Integer.valueOf(1))`, que deixaria `[5, 7]`."
    },
    {
      "id": "java.colecoes.q03", "type": "truefalse", "difficulty": 1, "lesson": "listas",
      "prompt": "`List<int> notas = new ArrayList<>();` é uma declaração válida.",
      "answer": false,
      "explanation": "Genéricos só aceitam objetos: o `javac` acusa *unexpected type*. Use a classe wrapper: `List<Integer>`."
    },
    {
      "id": "java.colecoes.q04", "type": "fill", "difficulty": 1, "lesson": "listas",
      "prompt": "Complete para criar uma lista imutável (Java 9+) com três cores:",
      "code": "List<String> cores = ___(\"azul\", \"verde\", \"roxo\");",
      "blanks": [["List.of", "java.util.List.of"]],
      "explanation": "`List.of(...)` cria uma lista que não pode ser alterada: `add`, `remove` e `set` lançam `UnsupportedOperationException`."
    },
    {
      "id": "java.colecoes.q05", "type": "multiple", "difficulty": 2, "lesson": "listas",
      "prompt": "O que acontece ao executar este trecho?\n\n```java\nList<String> cores = List.of(\"azul\", \"verde\");\ncores.add(\"roxo\");\n```",
      "options": ["Lança `UnsupportedOperationException`", "A lista passa a ter três cores", "Erro de compilação", "O `add` é ignorado, sem erro"], "answer": 0,
      "explanation": "Listas criadas com `List.of` são imutáveis. O código compila, porque `add` existe na interface `List`, mas lança `UnsupportedOperationException` ao executar."
    },
    {
      "id": "java.colecoes.q06", "type": "fill", "difficulty": 1, "lesson": "listas",
      "prompt": "Complete para guardar em `total` quantos itens a lista `nomes` tem:",
      "code": "int total = nomes.___();",
      "blanks": [["size"]],
      "explanation": "Coleções usam `size()`. Arrays usam o atributo `length`, e Strings, o método `length()`."
    },
    {
      "id": "java.colecoes.q07", "type": "multiple", "difficulty": 1, "lesson": "conjuntos",
      "prompt": "Qual destas coleções **não** guarda elementos repetidos?",
      "options": ["`HashSet`", "`ArrayList`", "Uma lista criada com `List.of`", "Um array `String[]`"], "answer": 0,
      "explanation": "`Set` (como `HashSet`) não aceita repetidos. Listas e arrays guardam quantas cópias você colocar."
    },
    {
      "id": "java.colecoes.q08", "type": "multiple", "difficulty": 2, "lesson": "conjuntos",
      "prompt": "O que este código imprime?\n\n```java\nSet<String> tags = new HashSet<>();\ntags.add(\"java\");\ntags.add(\"sql\");\nSystem.out.println(tags.add(\"java\"));\n```",
      "options": ["false", "true", "java", "Lança exceção"], "answer": 0,
      "explanation": "`add` devolve `false` quando o item já estava no conjunto, que continua com dois itens."
    },
    {
      "id": "java.colecoes.q09", "type": "multiple", "difficulty": 2, "lesson": "conjuntos",
      "prompt": "O que `System.out.println(new TreeSet<>(List.of(\"ana\", \"Bia\", \"Caio\")));` imprime?",
      "options": ["[Bia, Caio, ana]", "[ana, Bia, Caio]", "[Caio, Bia, ana]", "[ana, Caio, Bia]"], "answer": 0,
      "explanation": "O `TreeSet` usa a ordem natural, que compara os códigos dos caracteres: as maiúsculas vêm antes de todas as minúsculas. Por isso `ana` fica no fim."
    },
    {
      "id": "java.colecoes.q10", "type": "truefalse", "difficulty": 2, "lesson": "conjuntos",
      "prompt": "Um `LinkedHashSet` percorre os elementos na ordem em que eles foram inseridos.",
      "answer": true,
      "explanation": "`LinkedHashSet` mantém a ordem de inserção; `TreeSet` usa a ordem natural; `HashSet` não garante ordem nenhuma."
    },
    {
      "id": "java.colecoes.q11", "type": "multiple", "difficulty": 1, "lesson": "mapas",
      "prompt": "O que este código imprime?\n\n```java\nMap<String, Integer> m = new HashMap<>();\nm.put(\"a\", 1);\nm.put(\"a\", 2);\nSystem.out.println(m.get(\"a\") + \" \" + m.size());\n```",
      "options": ["2 1", "1 1", "1 2", "2 2"], "answer": 0,
      "explanation": "As chaves não se repetem: o segundo `put` troca o valor da chave `\"a\"`. O mapa continua com um par só, que agora vale 2."
    },
    {
      "id": "java.colecoes.q12", "type": "multiple", "difficulty": 1, "lesson": "mapas",
      "prompt": "Num `Map<String, Integer>`, o que `get` devolve para uma chave que não existe?",
      "options": ["`null`", "`0`", "Lança exceção", "Uma String vazia"], "answer": 0,
      "explanation": "`get` devolve `null` quando a chave não existe. Para receber um valor padrão, use `getOrDefault(chave, padrao)`."
    },
    {
      "id": "java.colecoes.q13", "type": "fill", "difficulty": 2, "lesson": "mapas",
      "prompt": "Complete a contagem de palavras para funcionar também na primeira vez que a palavra aparece:",
      "code": "contagem.put(p, contagem.___(p, 0) + 1);",
      "blanks": [["getOrDefault"]],
      "explanation": "`getOrDefault(p, 0)` devolve a contagem atual ou `0`, se a palavra ainda não está no mapa. Com `get`, a primeira vez daria `null + 1`, que lança `NullPointerException`."
    },
    {
      "id": "java.colecoes.q14", "type": "truefalse", "difficulty": 2, "lesson": "mapas",
      "prompt": "Num `TreeMap<String, Integer>`, as chaves são percorridas em ordem alfabética.",
      "answer": true,
      "explanation": "`TreeMap` mantém as chaves na ordem natural, que para textos é a alfabética (com maiúsculas antes das minúsculas)."
    },
    {
      "id": "java.colecoes.q15", "type": "multiple", "difficulty": 2, "lesson": "iteracao",
      "prompt": "O que acontece ao executar este trecho?\n\n```java\nList<String> nomes = new ArrayList<>(List.of(\"\", \"Ana\", \"\", \"Bia\"));\nfor (String n : nomes) {\n    if (n.isEmpty()) {\n        nomes.remove(n);\n    }\n}\n```",
      "options": ["Lança `ConcurrentModificationException`", "Remove os dois nomes vazios", "Erro de compilação", "Remove só o primeiro nome vazio e termina normalmente"], "answer": 0,
      "explanation": "Alterar a lista enquanto o for-each a percorre quebra o laço: logo depois da primeira remoção, o Java lança `ConcurrentModificationException`. Use um `Iterator` com `it.remove()` ou `removeIf`."
    },
    {
      "id": "java.colecoes.q16", "type": "order", "difficulty": 2, "lesson": "iteracao",
      "prompt": "Monte o trecho que remove da lista `nomes` **só** os nomes vazios, usando um `Iterator`:",
      "lines": ["Iterator<String> it = nomes.iterator();", "while (it.hasNext()) {", "    String n = it.next();", "    if (n.isEmpty()) {", "        it.remove();", "    }", "}"],
      "explanation": "O `Iterator` avança com `next()` e remove o item atual com `remove()`, sem quebrar o laço. O `if` garante que só os vazios saem."
    },
    {
      "id": "java.colecoes.q17", "type": "fill", "difficulty": 2, "lesson": "iteracao",
      "prompt": "Complete para remover da lista todos os nomes vazios (Java 8+):",
      "code": "nomes.___(n -> n.isEmpty());",
      "blanks": [["removeIf"]],
      "explanation": "`removeIf` remove todos os itens para os quais a condição é verdadeira, sem o risco de `ConcurrentModificationException`."
    },
    {
      "id": "java.colecoes.q18", "type": "fill", "difficulty": 2, "lesson": "ordenacao",
      "prompt": "`getIdade()` devolve um `int`. Complete para ordenar as pessoas da menor idade para a maior:",
      "code": "pessoas.sort(Comparator.___(Pessoa::getIdade));",
      "blanks": [["comparingInt", "comparing", "comparingLong", "comparingDouble"]],
      "explanation": "`comparingInt` é o mais indicado para um `int`, porque compara sem converter em objeto. `comparing` também funciona (converte para `Integer`), assim como `comparingLong` e `comparingDouble`, que aceitam o `int` alargado."
    },
    {
      "id": "java.colecoes.q19", "type": "multiple", "difficulty": 2, "lesson": "ordenacao",
      "prompt": "A classe `Pessoa` não implementa `Comparable`. O que acontece com `Collections.sort(pessoas)`, sendo `pessoas` uma `List<Pessoa>`?",
      "options": ["Erro de compilação", "Ordena pelo primeiro atributo da classe", "Ordena pela ordem em que os objetos foram criados", "Compila, mas lança exceção ao executar"], "answer": 0,
      "explanation": "`Collections.sort(lista)` só aceita listas de elementos `Comparable`. O `javac` acusa *no suitable method found for sort*. Use `pessoas.sort(Comparator.comparing(...))`."
    },
    {
      "id": "java.colecoes.q20", "type": "multiple", "difficulty": 1, "lesson": "ordenacao",
      "prompt": "O que este código imprime?\n\n```java\nList<Integer> n = new ArrayList<>(List.of(5, 2, 9, 1));\nCollections.sort(n);\nSystem.out.println(n);\n```",
      "options": ["[1, 2, 5, 9]", "[9, 5, 2, 1]", "[5, 2, 9, 1]", "[1, 5, 2, 9]"], "answer": 0,
      "explanation": "`Collections.sort` ordena a própria lista pela ordem natural: números em ordem crescente."
    },
    {
      "id": "java.colecoes.q21", "type": "truefalse", "difficulty": 2, "lesson": "ordenacao",
      "prompt": "`lista.sort(Comparator.comparingInt(Pessoa::getIdade).reversed())` ordena da maior idade para a menor.",
      "answer": true,
      "explanation": "`comparingInt` ordena da menor para a maior idade, e `.reversed()` inverte essa ordem."
    },
    {
      "id": "java.colecoes.q22", "type": "multiple", "difficulty": 2, "lesson": "ordenacao",
      "prompt": "Para dar uma **ordem natural** à sua própria classe, de modo que `Collections.sort(lista)` funcione sem argumentos extras, a classe deve implementar qual interface?",
      "options": ["`Comparable`", "`Comparator`", "`Iterable`", "`Sortable`"], "answer": 0,
      "explanation": "`Comparable` define a ordem natural dentro da própria classe, no método `compareTo`. `Comparator` é uma ordem externa, passada para o `sort`; `Sortable` não existe na biblioteca padrão."
    }
  ]
}
```

`content/java/04-colecoes/flashcards.json`:
```json
{
  "cards": [
    { "id": "java.colecoes.f01", "lesson": "listas", "front": "Qual a diferença entre `List` e `ArrayList`?", "back": "`List` é a interface (o contrato); `ArrayList` é a implementação mais usada. Declare a variável como `List` e crie o objeto com `new ArrayList<>()`." },
    { "id": "java.colecoes.f02", "lesson": "listas", "front": "Por que `List<int>` não compila?", "back": "Genéricos só aceitam objetos. Use a classe wrapper, `List<Integer>`; a conversão entre `int` e `Integer` é automática (autoboxing)." },
    { "id": "java.colecoes.f03", "lesson": "listas", "front": "Em `List<Integer>`, o que faz `remove(1)`?", "back": "Remove o item da posição 1. Para remover o valor 1, use `remove(Integer.valueOf(1))`." },
    { "id": "java.colecoes.f04", "lesson": "listas", "front": "O que `List.of(...)` cria?", "back": "Uma lista imutável (Java 9+): `add`, `remove` e `set` lançam `UnsupportedOperationException`. Ela também não aceita `null`." },
    { "id": "java.colecoes.f05", "lesson": "conjuntos", "front": "O que caracteriza um `Set`?", "back": "Não guarda repetidos. `add` devolve `false` quando o item já estava lá." },
    { "id": "java.colecoes.f06", "lesson": "conjuntos", "front": "Que ordem seguem `HashSet`, `LinkedHashSet` e `TreeSet`?", "back": "`HashSet`: nenhuma garantida. `LinkedHashSet`: a ordem de inserção. `TreeSet`: a ordem natural." },
    { "id": "java.colecoes.f07", "lesson": "mapas", "front": "O que acontece ao fazer `put` com uma chave que já existe?", "back": "O valor antigo é substituído; o mapa continua com um só par para aquela chave." },
    { "id": "java.colecoes.f08", "lesson": "mapas", "front": "Para que serve `getOrDefault`?", "back": "Devolve o valor da chave ou, se ela não existir, o valor padrão informado. Ótimo para contar ocorrências." },
    { "id": "java.colecoes.f09", "lesson": "mapas", "front": "Como percorrer as chaves e os valores de um mapa?", "back": "`for (Map.Entry<K, V> par : mapa.entrySet())`, usando `par.getKey()` e `par.getValue()`." },
    { "id": "java.colecoes.f10", "lesson": "iteracao", "front": "Como remover itens enquanto percorre uma lista?", "back": "Com um `Iterator` e `it.remove()`, ou com `lista.removeIf(...)`. Remover dentro do for-each costuma lançar `ConcurrentModificationException`." },
    { "id": "java.colecoes.f11", "lesson": "ordenacao", "front": "Qual a diferença entre `Comparable` e `Comparator`?", "back": "`Comparable` define a ordem natural dentro da própria classe (`compareTo`). `Comparator` é uma ordem externa, que você passa para o `sort`." },
    { "id": "java.colecoes.f12", "lesson": "ordenacao", "front": "Como ordenar pessoas por idade, da maior para a menor?", "back": "`pessoas.sort(Comparator.comparingInt(Pessoa::getIdade).reversed());`" }
  ]
}
```

- [ ] **Step 4: Rodar o validador**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Escrever os trechos de conferência**

Aula `listas`:

`verify/java/colecoes/aula-listas.java`:
```java
// verifica: q01, q06, f01 e a aula listas (add, size, get e as operações da tabela)
// saida:
// [Ana, Bia, Caio]
// 3
// Ana
// [pera, maçã, uva]
// [pera, maçã, kiwi]
// [pera, kiwi]
// true
// -1
// false
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>();
        nomes.add("Ana");
        nomes.add("Bia");
        nomes.add("Caio");
        System.out.println(nomes);
        int total = nomes.size();
        System.out.println(total);
        System.out.println(nomes.get(0));

        List<String> frutas = new ArrayList<>();
        frutas.add("maçã");
        frutas.add("uva");
        frutas.add(0, "pera");
        System.out.println(frutas);
        frutas.set(2, "kiwi");
        System.out.println(frutas);
        frutas.remove("maçã");
        System.out.println(frutas);
        System.out.println(frutas.contains("kiwi"));
        System.out.println(frutas.indexOf("uva"));
        System.out.println(frutas.isEmpty());
    }
}
```

`verify/java/colecoes/q03-list-int.java`:
```java
// verifica: java.colecoes.q03, f02 e a aula listas (genérico não aceita primitivo)
// espera: erro-de-compilacao
// erro-contem: unexpected type
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<int> notas = new ArrayList<>();
    }
}
```

`verify/java/colecoes/aula-autoboxing.java`:
```java
// verifica: f02 e a aula listas (int vira Integer e volta sozinho)
// saida:
// 7
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> notas = new ArrayList<>();
        notas.add(7);
        int primeira = notas.get(0);
        System.out.println(primeira);
    }
}
```

`verify/java/colecoes/aula-remove-indice-valor.java`:
```java
// verifica: f03 e a aula listas (remove(int) é posição; remove(Integer) é valor)
// saida:
// [10, 1]
// [10]
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = new ArrayList<>(List.of(10, 20, 1));
        numeros.remove(1);
        System.out.println(numeros);
        numeros.remove(Integer.valueOf(1));
        System.out.println(numeros);
    }
}
```

`verify/java/colecoes/q02-remove-indice.java`:
```java
// verifica: java.colecoes.q02 (remove(1) remove a posição 1)
// saida:
// [5, 1]
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = new ArrayList<>(List.of(5, 7, 1));
        numeros.remove(1);
        System.out.println(numeros);
    }
}
```

`verify/java/colecoes/q04-list-of.java`:
```java
// verifica: java.colecoes.q04 (as duas respostas aceitas compilam e criam a lista)
// saida:
// [azul, verde, roxo]
// [azul, verde, roxo]
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> cores = List.of("azul", "verde", "roxo");
        List<String> outras = java.util.List.of("azul", "verde", "roxo");
        System.out.println(cores);
        System.out.println(outras);
    }
}
```

`verify/java/colecoes/q05-list-of-imutavel.java`:
```java
// verifica: java.colecoes.q05, f04 e a aula listas (List.of não aceita add)
// espera: excecao UnsupportedOperationException
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> cores = List.of("azul", "verde");
        cores.add("roxo");
    }
}
```

`verify/java/colecoes/aula-list-of-null.java`:
```java
// verifica: f04 e a aula listas (List.of recusa null)
// espera: excecao NullPointerException
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> letras = List.of("a", null);
        System.out.println(letras);
    }
}
```

`verify/java/colecoes/aula-copia-mutavel.java`:
```java
// verifica: a aula listas (copiar List.of para um ArrayList permite alterar)
// saida:
// [azul, verde, roxo]
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> cores = new ArrayList<>(List.of("azul", "verde"));
        cores.add("roxo");
        System.out.println(cores);
    }
}
```

Aula `conjuntos`:

`verify/java/colecoes/aula-conjuntos.java`:
```java
// verifica: q07, q08, f05 e a aula conjuntos (Set não guarda repetidos; add devolve false)
// saida:
// false
// 2
// true
import java.util.HashSet;
import java.util.Set;

class Main {
    public static void main(String[] args) {
        Set<String> tags = new HashSet<>();
        tags.add("java");
        tags.add("sql");
        boolean entrou = tags.add("java");
        System.out.println(entrou);
        System.out.println(tags.size());
        System.out.println(tags.contains("sql"));
    }
}
```

`verify/java/colecoes/aula-ordem-sets.java`:
```java
// verifica: q10, f06 e a aula conjuntos (LinkedHashSet na ordem de inserção; TreeSet na ordem natural)
// saida:
// [uva, maçã, banana]
// [banana, maçã, uva]
import java.util.LinkedHashSet;
import java.util.List;
import java.util.TreeSet;

class Main {
    public static void main(String[] args) {
        List<String> entrada = List.of("uva", "maçã", "banana", "uva");
        System.out.println(new LinkedHashSet<>(entrada));
        System.out.println(new TreeSet<>(entrada));
    }
}
```

`verify/java/colecoes/q09-treeset-maiusculas.java`:
```java
// verifica: java.colecoes.q09 e a aula conjuntos (maiúsculas antes das minúsculas)
// saida:
// [Bia, Caio, ana]
import java.util.List;
import java.util.TreeSet;

class Main {
    public static void main(String[] args) {
        System.out.println(new TreeSet<>(List.of("ana", "Bia", "Caio")));
    }
}
```

`verify/java/colecoes/aula-remover-repetidos.java`:
```java
// verifica: a aula conjuntos (LinkedHashSet tira repetidos e mantém a ordem)
// saida:
// [3, 1, 2]
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

class Main {
    public static void main(String[] args) {
        List<Integer> comRepetidos = List.of(3, 1, 3, 2, 1);
        Set<Integer> unicos = new LinkedHashSet<>(comRepetidos);
        System.out.println(unicos);
    }
}
```

`verify/java/colecoes/aula-hashset-sem-equals.java`:
```java
// verifica: a aula conjuntos (sem equals e hashCode, objetos iguais contam como diferentes)
// saida:
// 2
// 1
import java.util.HashSet;
import java.util.Set;

class Main {
    public static void main(String[] args) {
        Set<Pessoa> pessoas = new HashSet<>();
        pessoas.add(new Pessoa("Ana"));
        pessoas.add(new Pessoa("Ana"));
        System.out.println(pessoas.size());

        Set<String> nomes = new HashSet<>();
        nomes.add(new String("Ana"));
        nomes.add(new String("Ana"));
        System.out.println(nomes.size());
    }
}

class Pessoa {
    String nome;

    Pessoa(String nome) {
        this.nome = nome;
    }
}
```

Aula `mapas`:

`verify/java/colecoes/aula-mapas.java`:
```java
// verifica: q12, f07 e a aula mapas (put substitui; get de chave ausente é null; containsKey e remove)
// saida:
// 7
// null
// 2
// true
// false
import java.util.HashMap;
import java.util.Map;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> estoque = new HashMap<>();
        estoque.put("caneta", 10);
        estoque.put("caderno", 5);
        estoque.put("caneta", 7);
        System.out.println(estoque.get("caneta"));
        System.out.println(estoque.get("borracha"));
        System.out.println(estoque.size());
        System.out.println(estoque.containsKey("caderno"));
        estoque.remove("caderno");
        System.out.println(estoque.containsKey("caderno"));
    }
}
```

`verify/java/colecoes/q11-put-repetido.java`:
```java
// verifica: java.colecoes.q11 (segundo put na mesma chave troca o valor)
// saida:
// 2 1
import java.util.HashMap;
import java.util.Map;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> m = new HashMap<>();
        m.put("a", 1);
        m.put("a", 2);
        System.out.println(m.get("a") + " " + m.size());
    }
}
```

`verify/java/colecoes/aula-contagem.java`:
```java
// verifica: q13, f08, f09 e a aula mapas (contagem com getOrDefault; percorrer com entrySet)
// saida:
// {lua=1, mar=1, sol=3}
// lua: 1
// mar: 1
// sol: 3
import java.util.Map;
import java.util.TreeMap;

class Main {
    public static void main(String[] args) {
        String[] palavras = {"sol", "lua", "sol", "mar", "sol"};
        Map<String, Integer> contagem = new TreeMap<>();
        for (String p : palavras) {
            contagem.put(p, contagem.getOrDefault(p, 0) + 1);
        }
        System.out.println(contagem);
        for (Map.Entry<String, Integer> par : contagem.entrySet()) {
            System.out.println(par.getKey() + ": " + par.getValue());
        }
    }
}
```

`verify/java/colecoes/aula-ordem-maps.java`:
```java
// verifica: q14 e a tabela da aula mapas (LinkedHashMap na ordem de inserção; TreeMap na ordem das chaves)
// saida:
// {banana=1, abacaxi=2, caju=3}
// {abacaxi=2, banana=1, caju=3}
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> inserido = new LinkedHashMap<>();
        inserido.put("banana", 1);
        inserido.put("abacaxi", 2);
        inserido.put("caju", 3);
        System.out.println(inserido);
        System.out.println(new TreeMap<>(inserido));
    }
}
```

`verify/java/colecoes/aula-map-of-imutavel.java`:
```java
// verifica: a dica da aula mapas (Map.of não pode ser alterado)
// espera: excecao UnsupportedOperationException
import java.util.Map;

class Main {
    public static void main(String[] args) {
        Map<String, Integer> m = Map.of("a", 1, "b", 2);
        m.put("c", 3);
    }
}
```

Aula `iteracao`:

`verify/java/colecoes/aula-iteracao.java`:
```java
// verifica: a aula iteracao (for-each e for com índice)
// saida:
// Ana
// Bia
// Caio
// 0: Ana
// 1: Bia
// 2: Caio
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Bia", "Caio");
        for (String nome : nomes) {
            System.out.println(nome);
        }
        for (int i = 0; i < nomes.size(); i++) {
            System.out.println(i + ": " + nomes.get(i));
        }
    }
}
```

`verify/java/colecoes/q15-cme.java`:
```java
// verifica: java.colecoes.q15, f10 e a aula iteracao (remover dentro do for-each)
// espera: excecao ConcurrentModificationException
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>(List.of("", "Ana", "", "Bia"));
        for (String n : nomes) {
            if (n.isEmpty()) {
                nomes.remove(n);
            }
        }
    }
}
```

`verify/java/colecoes/aula-cme-pula.java`:
```java
// verifica: a aula iteracao (quando não lança exceção, o for-each pula itens)
// saida:
// [Ana, ]
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>(List.of("Ana", "", ""));
        for (String n : nomes) {
            if (n.isEmpty()) {
                nomes.remove(n);
            }
        }
        System.out.println(nomes);
    }
}
```

`verify/java/colecoes/q16-iterator-remove.java`:
```java
// verifica: java.colecoes.q16, f10 e a aula iteracao (Iterator remove só os vazios)
// saida:
// [Ana, Bia]
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>(List.of("", "Ana", "", "Bia"));
        Iterator<String> it = nomes.iterator();
        while (it.hasNext()) {
            String n = it.next();
            if (n.isEmpty()) {
                it.remove();
            }
        }
        System.out.println(nomes);
    }
}
```

`verify/java/colecoes/q17-removeif.java`:
```java
// verifica: java.colecoes.q17 e a aula iteracao (removeIf)
// saida:
// [Ana, Bia]
import java.util.ArrayList;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = new ArrayList<>(List.of("", "Ana", "", "Bia"));
        nomes.removeIf(n -> n.isEmpty());
        System.out.println(nomes);
    }
}
```

Aula `ordenacao`:

`verify/java/colecoes/q20-sort-numeros.java`:
```java
// verifica: java.colecoes.q20 e a aula ordenacao (Collections.sort e Arrays.sort)
// saida:
// [1, 2, 5, 9]
// [1, 2, 5, 9]
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> n = new ArrayList<>(List.of(5, 2, 9, 1));
        Collections.sort(n);
        System.out.println(n);

        int[] array = {5, 2, 9, 1};
        Arrays.sort(array);
        System.out.println(Arrays.toString(array));
    }
}
```

`verify/java/colecoes/aula-sort-imutavel.java`:
```java
// verifica: a aula ordenacao (Collections.sort numa lista de List.of)
// espera: excecao UnsupportedOperationException
import java.util.Collections;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> n = List.of(5, 2, 9, 1);
        Collections.sort(n);
    }
}
```

`verify/java/colecoes/aula-comparator.java`:
```java
// verifica: q21, f12 e a aula ordenacao (comparing, comparingInt().reversed(), thenComparing e estabilidade)
// saida:
// [Ana (25), Bia (30), Caio (30)]
// [Bia (30), Caio (30), Ana (25)]
// [Ana (25), Bia (30), Caio (30)]
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Pessoa> pessoas = new ArrayList<>(List.of(
            new Pessoa("Caio", 30), new Pessoa("Ana", 25), new Pessoa("Bia", 30)));

        pessoas.sort(Comparator.comparing(Pessoa::getNome));
        System.out.println(pessoas);

        pessoas.sort(Comparator.comparingInt(Pessoa::getIdade).reversed());
        System.out.println(pessoas);

        pessoas.sort(Comparator.comparingInt(Pessoa::getIdade).thenComparing(Pessoa::getNome));
        System.out.println(pessoas);
    }
}

class Pessoa {
    private String nome;
    private int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    String getNome() { return nome; }

    int getIdade() { return idade; }

    @Override
    public String toString() { return nome + " (" + idade + ")"; }
}
```

`verify/java/colecoes/q18-comparators.java`:
```java
// verifica: java.colecoes.q18 (as quatro respostas aceitas compilam e ordenam pela idade)
// saida:
// [Ana (25), Caio (30), Bia (30)]
// [Ana (25), Caio (30), Bia (30)]
// [Ana (25), Caio (30), Bia (30)]
// [Ana (25), Caio (30), Bia (30)]
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

class Main {
    static List<Pessoa> pessoas() {
        return new ArrayList<>(List.of(new Pessoa("Caio", 30), new Pessoa("Ana", 25), new Pessoa("Bia", 30)));
    }

    public static void main(String[] args) {
        List<Pessoa> a = pessoas();
        a.sort(Comparator.comparingInt(Pessoa::getIdade));
        System.out.println(a);

        List<Pessoa> b = pessoas();
        b.sort(Comparator.comparing(Pessoa::getIdade));
        System.out.println(b);

        List<Pessoa> c = pessoas();
        c.sort(Comparator.comparingLong(Pessoa::getIdade));
        System.out.println(c);

        List<Pessoa> d = pessoas();
        d.sort(Comparator.comparingDouble(Pessoa::getIdade));
        System.out.println(d);
    }
}

class Pessoa {
    private String nome;
    private int idade;

    Pessoa(String nome, int idade) {
        this.nome = nome;
        this.idade = idade;
    }

    String getNome() { return nome; }

    int getIdade() { return idade; }

    @Override
    public String toString() { return nome + " (" + idade + ")"; }
}
```

`verify/java/colecoes/q19-sort-sem-comparable.java`:
```java
// verifica: java.colecoes.q19 e a aula ordenacao (Collections.sort exige Comparable)
// espera: erro-de-compilacao
// erro-contem: no suitable method found for sort
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Pessoa> pessoas = new ArrayList<>();
        Collections.sort(pessoas);
    }
}

class Pessoa {
    String nome;
}
```

`verify/java/colecoes/aula-comparable.java`:
```java
// verifica: q22, f11 e a aula ordenacao (Comparable define a ordem natural)
// saida:
// [caneta, caderno, mochila]
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Produto> produtos = new ArrayList<>(List.of(
            new Produto("caderno", 20.0), new Produto("caneta", 3.5), new Produto("mochila", 120.0)));
        Collections.sort(produtos);
        System.out.println(produtos);
    }
}

class Produto implements Comparable<Produto> {
    private String nome;
    private double preco;

    Produto(String nome, double preco) {
        this.nome = nome;
        this.preco = preco;
    }

    @Override
    public int compareTo(Produto outro) {
        return Double.compare(this.preco, outro.preco);
    }

    @Override
    public String toString() { return nome; }
}
```

- [ ] **Step 6: Conferir com o JDK 21**

Run (PowerShell): `$env:JAVA_HOME = "$env:USERPROFILE\tools\jdk-21.0.12.1+1"; node tools/verify-java.mjs`
Expected: todos passam (`118/118 trechos conferidos.`). Se algum falhar, descubra se o erro está no conteúdo ou no trecho, corrija e rode de novo. Nunca ajuste a saída esperada sem entender a diferença.

- [ ] **Step 7: Commit**

```bash
git add content verify
git commit -m "Adiciona módulo Java › Coleções" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Módulo Exceções

**Files:**
- Modify: `content/java/language.json` (novo módulo, **depois** de `colecoes`)
- Create: `content/java/05-excecoes/01-o-que-sao.md`, `02-try-catch-finally.md`, `03-checked-e-unchecked.md`, `04-excecoes-personalizadas.md`, `05-try-with-resources.md`, `questions.json`, `flashcards.json`
- Create: 31 trechos em `verify/java/excecoes/` (listados no Step 5)

**Interfaces:**
- Consumes: formato de conteúdo (spec seção 4); diretivas do conferidor (Task 1).
- Produces: módulo `java.excecoes`, com as aulas `o-que-sao`, `try-catch-finally`, `checked-e-unchecked`, `excecoes-personalizadas` e `try-with-resources`.

- [ ] **Step 1: Registrar o módulo (o validador passa a falhar)**

Em `content/java/language.json`, acrescente depois do módulo `colecoes`:

```json
    {
      "id": "excecoes",
      "dir": "05-excecoes",
      "title": "Exceções",
      "description": "Como o Java sinaliza erros, como tratá-los com try/catch/finally e como criar suas próprias exceções.",
      "lessons": [
        { "id": "o-que-sao", "file": "01-o-que-sao.md", "title": "O que são exceções", "minutes": 8 },
        { "id": "try-catch-finally", "file": "02-try-catch-finally.md", "title": "try, catch e finally", "minutes": 10 },
        { "id": "checked-e-unchecked", "file": "03-checked-e-unchecked.md", "title": "Checked, unchecked, throw e throws", "minutes": 9 },
        { "id": "excecoes-personalizadas", "file": "04-excecoes-personalizadas.md", "title": "Exceções personalizadas", "minutes": 8 },
        { "id": "try-with-resources", "file": "05-try-with-resources.md", "title": "try-with-resources", "minutes": 8 }
      ]
    }
```

Run: `npm test`
Expected: FAIL só em "conteúdo de todas as linguagens é válido" (os testes de tela seguem passando, por causa da fixture da Task 2), com `pasta 05-excecoes não existe`.

- [ ] **Step 2: Escrever as aulas**

`content/java/05-excecoes/01-o-que-sao.md`:
````markdown
# O que são exceções

Quando algo dá errado enquanto o programa roda (um número dividido por zero, um texto que não é número, um arquivo que não existe), o Java **lança uma exceção**: um objeto que descreve o problema. Se ninguém tratar a exceção, o programa para e mostra uma mensagem.

```java
class Main {
    public static void main(String[] args) {
        System.out.println(dividir(10, 0));
    }

    static int dividir(int a, int b) {
        return a / b;
    }
}
```

```text
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Main.dividir(Main.java:7)
    at Main.main(Main.java:3)
```

Esse texto é o **stack trace** (rastro da pilha de chamadas):

- A primeira linha diz **qual** exceção aconteceu e a **mensagem** dela (`/ by zero`).
- As linhas `at` dizem **onde**: o método, o arquivo e a linha, da chamada mais recente (no topo) para a mais antiga.

> [!TIP]
> Ao ver um stack trace, leia a primeira linha e depois procure a primeira linha `at` que aponta para o **seu** código. Quase sempre o problema está ali.

## A família das exceções

```text
Throwable
├── Error                      problemas graves da JVM
│   ├── OutOfMemoryError
│   └── StackOverflowError
└── Exception
    ├── IOException            e outras exceções "checked"
    └── RuntimeException       exceções "unchecked"
        ├── ArithmeticException
        ├── NullPointerException
        ├── IllegalArgumentException
        │   └── NumberFormatException
        └── IndexOutOfBoundsException
            └── ArrayIndexOutOfBoundsException
```

- **`Error`**: falhas graves do ambiente, como falta de memória (`OutOfMemoryError`) ou uma recursão sem fim (`StackOverflowError`). Em geral, o programa não tenta tratá-las.
- **`Exception`**: problemas que o programa pode prever e tratar.
- **`RuntimeException`**: em geral, erros de programação, como usar `null` ou um índice fora do array. A aula sobre checked e unchecked mostra por que essa divisão importa.

## Exceções que você já encontrou

| Exceção | Quando acontece |
|---|---|
| `ArithmeticException` | divisão inteira por zero |
| `NullPointerException` | usar uma referência `null` |
| `ArrayIndexOutOfBoundsException` | índice fora do array |
| `NumberFormatException` | converter um texto que não é número |
| `ClassCastException` | cast para o tipo errado |

> [!NOTE]
> Só a divisão **inteira** por zero lança exceção. Com `double`, `10.0 / 0` dá `Infinity`.
````

`content/java/05-excecoes/02-try-catch-finally.md`:
````markdown
# try, catch e finally

## Tratando uma exceção

Coloque o código que pode falhar num bloco `try` e diga, no `catch`, o que fazer se a exceção acontecer:

```java
String texto = "12a";
try {
    int numero = Integer.parseInt(texto);
    System.out.println("Número: " + numero);
} catch (NumberFormatException e) {
    System.out.println("Não é um número: " + e.getMessage());
}
System.out.println("O programa continua.");
// Não é um número: For input string: "12a"
// O programa continua.
```

Quando a exceção acontece, o resto do `try` é pulado e a execução vai para o `catch`. Depois dele, o programa segue normalmente. A variável `e` é a própria exceção, e `e.getMessage()` devolve a mensagem dela.

## Vários `catch`

```java
static void processar(String texto, int divisor) {
    try {
        int n = Integer.parseInt(texto);
        System.out.println(n / divisor);
    } catch (NumberFormatException e) {
        System.out.println("Texto inválido");
    } catch (ArithmeticException e) {
        System.out.println("Conta impossível");
    }
}

processar("12a", 1);   // Texto inválido
processar("12", 0);    // Conta impossível
processar("12", 4);    // 3
```

O Java testa os `catch` de cima para baixo e usa o **primeiro** que combina com a exceção. Por isso, os mais específicos vêm antes dos mais genéricos.

> [!CAUTION]
> Um `catch (Exception e)` antes de um `catch (ArithmeticException e)` não compila: *exception ArithmeticException has already been caught*. O primeiro já pegaria tudo, e o segundo nunca seria usado.

Desde o Java 7, um mesmo `catch` pode tratar vários tipos, separados por `|` (o *multi-catch*):

```java
try {
    System.out.println(Integer.parseInt(texto) / divisor);
} catch (NumberFormatException | ArithmeticException e) {
    System.out.println("Entrada inválida: " + e.getMessage());
}
```

## `finally`: executa sempre

```java
int zero = 0;
try {
    System.out.print("A");
    int x = 10 / zero;
    System.out.print("B");
} catch (ArithmeticException e) {
    System.out.print("C");
} finally {
    System.out.print("D");
}
// ACD
```

O `finally` roda com exceção ou sem, e até depois de um `return` dentro do `try`. É o lugar para liberar recursos, como fechar um arquivo.

```java
static int teste() {
    try {
        return 1;
    } finally {
        System.out.print("F");
    }
}

System.out.print(teste());   // F1
```

> [!WARNING]
> Não escreva `return` dentro do `finally`. Ele substitui o `return` do `try` e ainda faz sumir qualquer exceção que estivesse sendo lançada.
````

`content/java/05-excecoes/03-checked-e-unchecked.md`:
````markdown
# Checked, unchecked, throw e throws

## Lançando uma exceção com `throw`

Você também pode lançar exceções, por exemplo, para recusar um valor inválido:

```java
static void sacar(double valor) {
    if (valor <= 0) {
        throw new IllegalArgumentException("Valor de saque inválido: " + valor);
    }
    System.out.println("Sacando " + valor);
}
```

`throw` interrompe o método na hora, como um `return`, mas sinalizando um erro.

## Checked e unchecked

| Tipo | Quais são | O compilador obriga a tratar? |
|---|---|---|
| **Unchecked** | `RuntimeException` e subclasses, `Error` e subclasses | não |
| **Checked** | todas as outras, como `Exception` e `IOException` | sim |

Para uma exceção **checked**, o compilador exige uma de duas coisas:

1. **Tratar** com `try/catch`; ou
2. **Declarar** com `throws` na assinatura do método, passando a responsabilidade para quem chamar.

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

static String ler(Path caminho) throws IOException {   // declara
    return Files.readString(caminho);                    // Java 11+
}

public static void main(String[] args) {
    try {                                                // trata
        System.out.println(ler(Path.of("dados.txt")));
    } catch (IOException e) {
        System.out.println("Não consegui ler: " + e.getMessage());
    }
}
// se dados.txt não existir: Não consegui ler: dados.txt
```

Sem o `throws` em `ler`, o código não compila: *unreported exception IOException; must be caught or declared to be thrown*.

> [!TIP]
> Exceções checked servem para problemas que quem chama consegue prever e contornar, como um arquivo que não existe. As unchecked indicam erros de programação, como um argumento inválido ou um `null` onde não devia.

## `throw` e `throws` não são a mesma coisa

- `throw` **lança** uma exceção agora: `throw new IllegalArgumentException("...")`.
- `throws` **avisa**, na assinatura do método, que ele pode lançar: `String ler(Path caminho) throws IOException`.
````

`content/java/05-excecoes/04-excecoes-personalizadas.md`:
````markdown
# Exceções personalizadas

As exceções prontas nem sempre descrevem bem o problema do seu programa. Você pode criar as suas: basta estender uma classe de exceção.

```java
class SaldoInsuficienteException extends Exception {
    SaldoInsuficienteException(String mensagem) {
        super(mensagem);              // guarda a mensagem
    }
}

class Conta {
    private double saldo;

    Conta(double saldo) {
        this.saldo = saldo;
    }

    void sacar(double valor) throws SaldoInsuficienteException {
        if (valor > saldo) {
            throw new SaldoInsuficienteException("Saldo insuficiente: faltam " + (valor - saldo));
        }
        saldo -= valor;
    }
}
```

```java
Conta conta = new Conta(100);
try {
    conta.sacar(150);
} catch (SaldoInsuficienteException e) {
    System.out.println(e.getMessage());   // Saldo insuficiente: faltam 50.0
}
```

- Por convenção, o nome termina em `Exception`.
- `super(mensagem)` repassa a mensagem para a superclasse; depois, `getMessage()` a devolve.

## Checked ou unchecked?

| A classe estende | A exceção é |
|---|---|
| `Exception` | checked: quem chama precisa tratar ou declarar |
| `RuntimeException` | unchecked: tratar é opcional |

> [!IMPORTANT]
> Só objetos de classes que estendem `Throwable` (direta ou indiretamente) podem ser lançados. `throw "erro";` não compila: *incompatible types: String cannot be converted to Throwable*.

## Guardando a causa

Ao trocar uma exceção por outra, passe a original como **causa**, para não perder o rastro:

```java
class ConfigInvalidaException extends RuntimeException {
    ConfigInvalidaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}

try {
    Integer.parseInt("abc");
} catch (NumberFormatException e) {
    throw new ConfigInvalidaException("Porta inválida na configuração", e);
}
```

O stack trace mostra as duas: a nova e, mais abaixo, `Caused by: java.lang.NumberFormatException`.
````

`content/java/05-excecoes/05-try-with-resources.md`:
````markdown
# try-with-resources

Arquivos, conexões com banco de dados e o próprio `Scanner` são **recursos**: precisam ser fechados depois do uso. Fechar no `finally` funciona, mas é verboso e fácil de esquecer.

Desde o Java 7, o **try-with-resources** fecha sozinho tudo o que for declarado entre parênteses logo depois do `try`:

```java
try (Scanner sc = new Scanner(Path.of("dados.txt"))) {
    System.out.println(sc.nextLine());
} catch (IOException e) {
    System.out.println("Erro ao ler: " + e.getMessage());
}
// aqui o Scanner já foi fechado, com exceção ou sem
```

## Como funciona

Serve qualquer classe que implemente a interface `AutoCloseable` (ou `Closeable`, que a estende). O Java chama o método `close()` ao sair do bloco:

```java
class Recurso implements AutoCloseable {
    private final String nome;

    Recurso(String nome) {
        this.nome = nome;
        System.out.println("abrindo " + nome);
    }

    @Override
    public void close() {
        System.out.println("fechando " + nome);
    }
}
```

```java
try (Recurso a = new Recurso("A"); Recurso b = new Recurso("B")) {
    System.out.println("usando");
}
// abrindo A
// abrindo B
// usando
// fechando B
// fechando A
```

- Vários recursos são separados por `;` e fechados na **ordem inversa** da abertura.
- O `close()` é chamado mesmo se o bloco lançar uma exceção. Se houver `catch` ou `finally`, eles rodam **depois** do fechamento.

> [!TIP]
> Desde o Java 9, um recurso criado antes pode ir direto nos parênteses, desde que a variável nunca seja reatribuída: `Recurso r = new Recurso("R"); try (r) { ... }`.
````

- [ ] **Step 3: Escrever perguntas e cartas**

`content/java/05-excecoes/questions.json`:
```json
{
  "questions": [
    {
      "id": "java.excecoes.q01", "type": "multiple", "difficulty": 2, "lesson": "o-que-sao",
      "prompt": "Para que um objeto possa ser lançado com `throw`, a classe dele precisa estender (direta ou indiretamente) qual classe?",
      "options": ["`Throwable`", "`Exception`", "`RuntimeException`", "`Object`"], "answer": 0,
      "explanation": "Tudo o que é lançado é um `Throwable`. `Exception` e `RuntimeException` são subclasses dele, mas não são obrigatórias, porque um `Error` também pode ser lançado. Estender só `Object` não basta: `throw \"erro\";` dá *incompatible types: String cannot be converted to Throwable*."
    },
    {
      "id": "java.excecoes.q02", "type": "truefalse", "difficulty": 1, "lesson": "o-que-sao",
      "prompt": "`Error` representa problemas graves do ambiente, como falta de memória, que em geral o programa não tenta tratar.",
      "answer": true,
      "explanation": "Subclasses de `Error`, como `OutOfMemoryError` e `StackOverflowError`, indicam falhas da JVM ou do ambiente. O programa costuma tratar só as `Exception`."
    },
    {
      "id": "java.excecoes.q03", "type": "multiple", "difficulty": 1, "lesson": "o-que-sao",
      "prompt": "O que acontece ao executar este trecho?\n\n```java\nint zero = 0;\nSystem.out.println(10 / zero);\n```",
      "options": ["Lança `ArithmeticException`", "Lança `NumberFormatException`", "Lança `IllegalStateException`", "Imprime `Infinity`"], "answer": 0,
      "explanation": "Divisão **inteira** por zero lança `ArithmeticException: / by zero`. Só com `double` (por exemplo, `10.0 / 0`) o resultado seria `Infinity`."
    },
    {
      "id": "java.excecoes.q04", "type": "multiple", "difficulty": 2, "lesson": "try-catch-finally",
      "prompt": "O que este trecho imprime?\n\n```java\nint zero = 0;\ntry {\n    System.out.print(\"A\");\n    int x = 10 / zero;\n    System.out.print(\"B\");\n} catch (ArithmeticException e) {\n    System.out.print(\"C\");\n} finally {\n    System.out.print(\"D\");\n}\n```",
      "options": ["ACD", "ABCD", "AD", "ACBD"], "answer": 0,
      "explanation": "Imprime `A`; a divisão lança a exceção, então o resto do `try` (o `B`) é pulado. O `catch` imprime `C`, e o `finally`, que roda sempre, imprime `D`."
    },
    {
      "id": "java.excecoes.q05", "type": "truefalse", "difficulty": 1, "lesson": "try-catch-finally",
      "prompt": "O bloco `finally` é executado mesmo quando nenhuma exceção acontece no `try`.",
      "answer": true,
      "explanation": "O `finally` roda sempre: com exceção, sem exceção e até depois de um `return` dentro do `try`."
    },
    {
      "id": "java.excecoes.q06", "type": "multiple", "difficulty": 3, "lesson": "try-catch-finally",
      "prompt": "O que acontece ao compilar este trecho?\n\n```java\ntry {\n    System.out.println(10 / zero);\n} catch (Exception e) {\n    System.out.println(\"geral\");\n} catch (ArithmeticException e) {\n    System.out.println(\"divisão\");\n}\n```",
      "options": ["Erro de compilação: o segundo `catch` nunca seria alcançado", "Compila, e o segundo `catch` trata as `ArithmeticException`", "Compila, e o primeiro `catch` é ignorado", "Compila, mas lança exceção ao executar"], "answer": 0,
      "explanation": "`ArithmeticException` é uma `Exception`, então o primeiro `catch` já pegaria tudo. O `javac` acusa *exception ArithmeticException has already been caught*. O certo é colocar o `catch` mais específico primeiro."
    },
    {
      "id": "java.excecoes.q07", "type": "multiple", "difficulty": 3, "lesson": "try-catch-finally",
      "prompt": "O que `System.out.print(teste());` imprime?\n\n```java\nstatic int teste() {\n    try {\n        return 1;\n    } finally {\n        System.out.print(\"F\");\n    }\n}\n```",
      "options": ["F1", "1F", "1", "F"], "answer": 0,
      "explanation": "O `return 1` calcula o valor, mas antes de o método terminar o `finally` roda e imprime `F`. Só então o 1 chega ao `print` de fora."
    },
    {
      "id": "java.excecoes.q08", "type": "fill", "difficulty": 2, "lesson": "try-catch-finally",
      "prompt": "Complete para tratar as duas exceções no mesmo `catch` (Java 7+):",
      "code": "} catch (NumberFormatException ___ ArithmeticException e) {",
      "blanks": [["|"]],
      "explanation": "O multi-catch separa os tipos com `|`. Os tipos não podem ser parentes (um subclasse do outro)."
    },
    {
      "id": "java.excecoes.q09", "type": "multiple", "difficulty": 2, "lesson": "checked-e-unchecked",
      "prompt": "Qual destas exceções é **checked**, ou seja, o compilador obriga a tratar ou declarar?",
      "options": ["`IOException`", "`NullPointerException`", "`ArithmeticException`", "`IllegalArgumentException`"], "answer": 0,
      "explanation": "`IOException` estende `Exception` sem passar por `RuntimeException`, então é checked. As outras três são subclasses de `RuntimeException` (unchecked)."
    },
    {
      "id": "java.excecoes.q10", "type": "truefalse", "difficulty": 2, "lesson": "checked-e-unchecked",
      "prompt": "Um método que pode lançar uma `IllegalArgumentException` precisa declará-la com `throws`.",
      "answer": false,
      "explanation": "`IllegalArgumentException` é uma `RuntimeException`, portanto unchecked: declarar com `throws` é opcional. Só as exceções checked precisam ser tratadas ou declaradas."
    },
    {
      "id": "java.excecoes.q11", "type": "fill", "difficulty": 1, "lesson": "checked-e-unchecked",
      "prompt": "Complete para lançar a exceção quando o valor for negativo:",
      "code": "if (valor < 0) {\n    ___ new IllegalArgumentException(\"valor negativo\");\n}",
      "blanks": [["throw"]],
      "explanation": "`throw` lança a exceção. Não confunda com `throws`, que vai na assinatura do método para declarar o que ele pode lançar."
    },
    {
      "id": "java.excecoes.q12", "type": "multiple", "difficulty": 2, "lesson": "checked-e-unchecked",
      "prompt": "`Files.readString` declara `throws IOException`. O que acontece ao compilar este método?\n\n```java\nstatic String ler(Path caminho) {\n    return Files.readString(caminho);\n}\n```",
      "options": ["Erro: a `IOException` precisa ser tratada ou declarada com `throws`", "Compila; a exceção só é verificada ao executar", "Compila, desde que o arquivo exista", "Compila, mas com um aviso que pode ser ignorado"], "answer": 0,
      "explanation": "`IOException` é checked. O `javac` acusa *unreported exception IOException; must be caught or declared to be thrown*. Resolva com `throws IOException` na assinatura ou com um `try/catch`."
    },
    {
      "id": "java.excecoes.q13", "type": "multiple", "difficulty": 2, "lesson": "excecoes-personalizadas",
      "prompt": "Para criar uma exceção personalizada **unchecked**, a classe deve estender:",
      "options": ["`RuntimeException`", "`Exception`", "`Object`", "`Throwable`"], "answer": 0,
      "explanation": "Estender `RuntimeException` gera uma exceção unchecked. Estender `Exception` ou o próprio `Throwable` gera uma checked, e uma classe que só estende `Object` nem pode ser lançada. (`Error` também é unchecked, mas é reservado para falhas graves da JVM.)"
    },
    {
      "id": "java.excecoes.q14", "type": "order", "difficulty": 2, "lesson": "excecoes-personalizadas",
      "prompt": "Monte uma exceção checked chamada `SaldoInsuficienteException`, com um construtor que recebe a mensagem:",
      "lines": ["class SaldoInsuficienteException extends Exception {", "    SaldoInsuficienteException(String mensagem) {", "        super(mensagem);", "    }", "}"],
      "explanation": "A classe estende `Exception` (por isso é checked), e o construtor repassa a mensagem para a superclasse com `super(mensagem)`."
    },
    {
      "id": "java.excecoes.q15", "type": "truefalse", "difficulty": 1, "lesson": "excecoes-personalizadas",
      "prompt": "`e.getMessage()` devolve a mensagem que foi passada ao construtor da exceção.",
      "answer": true,
      "explanation": "O construtor da exceção repassa a mensagem com `super(mensagem)`, e `getMessage()` a devolve depois."
    },
    {
      "id": "java.excecoes.q16", "type": "multiple", "difficulty": 3, "lesson": "try-with-resources",
      "prompt": "`Recurso` implementa `AutoCloseable`, e o `close()` dele imprime o nome do recurso. O que este trecho imprime?\n\n```java\ntry (Recurso a = new Recurso(\"A\"); Recurso b = new Recurso(\"B\")) {\n    System.out.print(\"1\");\n}\n```",
      "options": ["1BA", "1AB", "AB1", "BA1"], "answer": 0,
      "explanation": "O bloco roda primeiro (`1`). Ao sair, os recursos são fechados na ordem inversa da abertura: primeiro `B`, depois `A`."
    },
    {
      "id": "java.excecoes.q17", "type": "truefalse", "difficulty": 2, "lesson": "try-with-resources",
      "prompt": "No try-with-resources, o recurso é fechado mesmo se uma exceção for lançada dentro do bloco.",
      "answer": true,
      "explanation": "O `close()` é chamado em qualquer caso. Se houver `catch` ou `finally`, eles rodam depois do fechamento."
    },
    {
      "id": "java.excecoes.q18", "type": "fill", "difficulty": 2, "lesson": "try-with-resources",
      "prompt": "Complete para que a classe `Conexao` possa ser usada num try-with-resources:",
      "code": "class Conexao implements ___ {",
      "blanks": [["AutoCloseable", "Closeable", "java.lang.AutoCloseable", "java.io.Closeable"]],
      "explanation": "O try-with-resources aceita qualquer `AutoCloseable`. `Closeable` (do pacote `java.io`) também serve, porque estende `AutoCloseable`."
    }
  ]
}
```

`content/java/05-excecoes/flashcards.json`:
```json
{
  "cards": [
    { "id": "java.excecoes.f01", "lesson": "o-que-sao", "front": "O que é uma exceção?", "back": "Um objeto que sinaliza um problema durante a execução. Se ninguém tratar, o programa para e mostra o stack trace." },
    { "id": "java.excecoes.f02", "lesson": "o-que-sao", "front": "Como é a hierarquia das exceções?", "back": "`Throwable` no topo; abaixo dele, `Error` (problemas graves da JVM) e `Exception`. `RuntimeException` é uma subclasse de `Exception`." },
    { "id": "java.excecoes.f03", "lesson": "o-que-sao", "front": "Como ler um stack trace?", "back": "A primeira linha diz a exceção e a mensagem. As linhas `at` mostram onde ela aconteceu, da chamada mais recente para a mais antiga." },
    { "id": "java.excecoes.f04", "lesson": "try-catch-finally", "front": "Para que serve o `finally`?", "back": "Para código que precisa rodar sempre, com exceção ou sem, mesmo depois de um `return`. É o lugar de liberar recursos." },
    { "id": "java.excecoes.f05", "lesson": "try-catch-finally", "front": "Em que ordem os `catch` devem ficar?", "back": "Do mais específico para o mais genérico. Um `catch (Exception e)` antes de `catch (ArithmeticException e)` nem compila." },
    { "id": "java.excecoes.f06", "lesson": "try-catch-finally", "front": "Como tratar dois tipos de exceção no mesmo `catch`?", "back": "Com o multi-catch (Java 7+): `catch (NumberFormatException | ArithmeticException e)`." },
    { "id": "java.excecoes.f07", "lesson": "checked-e-unchecked", "front": "Qual a diferença entre checked e unchecked?", "back": "Checked (como `IOException`): o compilador obriga a tratar ou declarar. Unchecked (`RuntimeException`, `Error` e as subclasses deles): não obriga." },
    { "id": "java.excecoes.f08", "lesson": "checked-e-unchecked", "front": "Qual a diferença entre `throw` e `throws`?", "back": "`throw` lança uma exceção agora. `throws` declara, na assinatura do método, que ele pode lançar aquela exceção." },
    { "id": "java.excecoes.f09", "lesson": "excecoes-personalizadas", "front": "Como criar uma exceção personalizada checked?", "back": "Estenda `Exception` e repasse a mensagem no construtor com `super(mensagem)`." },
    { "id": "java.excecoes.f10", "lesson": "excecoes-personalizadas", "front": "Como criar uma exceção personalizada unchecked?", "back": "Estenda `RuntimeException`." },
    { "id": "java.excecoes.f11", "lesson": "try-with-resources", "front": "O que o try-with-resources faz?", "back": "Fecha automaticamente (chama `close()`) os recursos declarados entre parênteses, mesmo se houver exceção (Java 7+)." },
    { "id": "java.excecoes.f12", "lesson": "try-with-resources", "front": "Em que ordem os recursos do try-with-resources são fechados?", "back": "Na ordem inversa da abertura: o último aberto é o primeiro fechado." }
  ]
}
```

- [ ] **Step 4: Rodar o validador**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Escrever os trechos de conferência**

Aula `o-que-sao`:

`verify/java/excecoes/aula-stack-trace.java`:
```java
// verifica: f01, f03 e a aula o-que-sao (exceção não tratada mostra o nome e a mensagem)
// espera: excecao ArithmeticException
// erro-contem: / by zero
class Main {
    public static void main(String[] args) {
        System.out.println(dividir(10, 0));
    }

    static int dividir(int a, int b) {
        return a / b;
    }
}
```

`verify/java/excecoes/aula-hierarquia.java`:
```java
// verifica: q02, f02 e a árvore da aula o-que-sao
// saida:
// true
// true
// true
// true
// true
// true
// true
import java.io.IOException;

class Main {
    public static void main(String[] args) {
        Throwable[] t = {
            new OutOfMemoryError(), new StackOverflowError(), new IOException(),
            new ArithmeticException(), new NumberFormatException(), new ArrayIndexOutOfBoundsException()
        };
        System.out.println(t[0] instanceof Error);
        System.out.println(t[1] instanceof Error);
        System.out.println(t[2] instanceof Exception && !(t[2] instanceof RuntimeException));
        System.out.println(t[3] instanceof RuntimeException);
        System.out.println(t[4] instanceof IllegalArgumentException);
        System.out.println(t[5] instanceof IndexOutOfBoundsException);
        System.out.println(new RuntimeException() instanceof Exception);
    }
}
```

`verify/java/excecoes/aula-double-infinity.java`:
```java
// verifica: a nota da aula o-que-sao e q03 (com double, dividir por zero dá Infinity)
// saida:
// Infinity
class Main {
    public static void main(String[] args) {
        System.out.println(10.0 / 0);
    }
}
```

`verify/java/excecoes/q03-divisao-zero.java`:
```java
// verifica: java.excecoes.q03 (divisão inteira por zero)
// espera: excecao ArithmeticException
// erro-contem: / by zero
class Main {
    public static void main(String[] args) {
        int zero = 0;
        System.out.println(10 / zero);
    }
}
```

Aula `try-catch-finally`:

`verify/java/excecoes/aula-try-catch.java`:
```java
// verifica: a aula try-catch-finally (o catch trata e o programa continua)
// saida:
// Não é um número: For input string: "12a"
// O programa continua.
class Main {
    public static void main(String[] args) {
        String texto = "12a";
        try {
            int numero = Integer.parseInt(texto);
            System.out.println("Número: " + numero);
        } catch (NumberFormatException e) {
            System.out.println("Não é um número: " + e.getMessage());
        }
        System.out.println("O programa continua.");
    }
}
```

`verify/java/excecoes/aula-varios-catch.java`:
```java
// verifica: f05 e a aula try-catch-finally (o primeiro catch que combina é usado)
// saida:
// Texto inválido
// Conta impossível
// 3
class Main {
    static void processar(String texto, int divisor) {
        try {
            int n = Integer.parseInt(texto);
            System.out.println(n / divisor);
        } catch (NumberFormatException e) {
            System.out.println("Texto inválido");
        } catch (ArithmeticException e) {
            System.out.println("Conta impossível");
        }
    }

    public static void main(String[] args) {
        processar("12a", 1);
        processar("12", 0);
        processar("12", 4);
    }
}
```

`verify/java/excecoes/q06-catch-ordem.java`:
```java
// verifica: java.excecoes.q06, f05 e a aula try-catch-finally (catch genérico antes do específico)
// espera: erro-de-compilacao
// erro-contem: exception ArithmeticException has already been caught
class Main {
    public static void main(String[] args) {
        int zero = 0;
        try {
            System.out.println(10 / zero);
        } catch (Exception e) {
            System.out.println("geral");
        } catch (ArithmeticException e) {
            System.out.println("divisão");
        }
    }
}
```

`verify/java/excecoes/q08-multi-catch.java`:
```java
// verifica: java.excecoes.q08, f06 e a aula try-catch-finally (multi-catch)
// saida:
// Entrada inválida: / by zero
// Entrada inválida: For input string: "x"
class Main {
    static void calcular(String texto, int divisor) {
        try {
            System.out.println(Integer.parseInt(texto) / divisor);
        } catch (NumberFormatException | ArithmeticException e) {
            System.out.println("Entrada inválida: " + e.getMessage());
        }
    }

    public static void main(String[] args) {
        calcular("10", 0);
        calcular("x", 2);
    }
}
```

`verify/java/excecoes/q08-multi-catch-parentes.java`:
```java
// verifica: a explicação de java.excecoes.q08 (no multi-catch, os tipos não podem ser parentes)
// espera: erro-de-compilacao
// erro-contem: Alternatives in a multi-catch statement cannot be related by subclassing
class Main {
    public static void main(String[] args) {
        try {
            System.out.println(Integer.parseInt("x"));
        } catch (NumberFormatException | IllegalArgumentException e) {
            System.out.println("inválido");
        }
    }
}
```

`verify/java/excecoes/q04-try-catch-finally.java`:
```java
// verifica: java.excecoes.q04 e a aula try-catch-finally (o resto do try é pulado; o finally roda)
// saida:
// ACD
class Main {
    public static void main(String[] args) {
        int zero = 0;
        try {
            System.out.print("A");
            int x = 10 / zero;
            System.out.print("B");
        } catch (ArithmeticException e) {
            System.out.print("C");
        } finally {
            System.out.print("D");
        }
    }
}
```

`verify/java/excecoes/q05-finally-sem-excecao.java`:
```java
// verifica: java.excecoes.q05 e f04 (o finally roda mesmo sem exceção)
// saida:
// AD
class Main {
    public static void main(String[] args) {
        try {
            System.out.print("A");
        } catch (RuntimeException e) {
            System.out.print("C");
        } finally {
            System.out.print("D");
        }
    }
}
```

`verify/java/excecoes/q07-finally-return.java`:
```java
// verifica: java.excecoes.q07, f04 e a aula try-catch-finally (o finally roda antes de o método devolver)
// saida:
// F1
class Main {
    static int teste() {
        try {
            return 1;
        } finally {
            System.out.print("F");
        }
    }

    public static void main(String[] args) {
        System.out.print(teste());
    }
}
```

`verify/java/excecoes/aula-finally-return-sobrescreve.java`:
```java
// verifica: o aviso da aula try-catch-finally (return no finally substitui o do try e some com a exceção)
// saida:
// 2
// 3
class Main {
    static int substitui() {
        try {
            return 1;
        } finally {
            return 2;
        }
    }

    static int engole() {
        try {
            throw new RuntimeException("sumiu");
        } finally {
            return 3;
        }
    }

    public static void main(String[] args) {
        System.out.println(substitui());
        System.out.println(engole());
    }
}
```

Aula `checked-e-unchecked`:

`verify/java/excecoes/aula-throw.java`:
```java
// verifica: q11, f08 e a aula checked-e-unchecked (throw interrompe o método)
// espera: excecao IllegalArgumentException
// erro-contem: Valor de saque inválido: -1.0
class Main {
    static void sacar(double valor) {
        if (valor <= 0) {
            throw new IllegalArgumentException("Valor de saque inválido: " + valor);
        }
        System.out.println("Sacando " + valor);
    }

    public static void main(String[] args) {
        sacar(50);
        sacar(-1);
    }
}
```

`verify/java/excecoes/aula-throws-ler.java`:
```java
// verifica: f08 e a aula checked-e-unchecked (throws declara e quem chama trata; com um arquivo que não existe)
// saida:
// Não consegui ler: arquivo-que-nao-existe.txt
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

class Main {
    static String ler(Path caminho) throws IOException {
        return Files.readString(caminho);
    }

    public static void main(String[] args) {
        try {
            System.out.println(ler(Path.of("arquivo-que-nao-existe.txt")));
        } catch (IOException e) {
            System.out.println("Não consegui ler: " + e.getMessage());
        }
    }
}
```

`verify/java/excecoes/q12-sem-throws.java`:
```java
// verifica: java.excecoes.q12, q09, f07 e a aula checked-e-unchecked (IOException precisa ser tratada ou declarada)
// espera: erro-de-compilacao
// erro-contem: unreported exception IOException; must be caught or declared to be thrown
import java.nio.file.Files;
import java.nio.file.Path;

class Main {
    static String ler(Path caminho) {
        return Files.readString(caminho);
    }

    public static void main(String[] args) {
        System.out.println(ler(Path.of("dados.txt")));
    }
}
```

`verify/java/excecoes/q10-runtime-sem-throws.java`:
```java
// verifica: java.excecoes.q10 e f07 (exceção unchecked não precisa de throws)
// saida:
// valor aceito
// valor negativo
class Main {
    static void validar(int valor) {
        if (valor < 0) {
            throw new IllegalArgumentException("valor negativo");
        }
        System.out.println("valor aceito");
    }

    public static void main(String[] args) {
        validar(5);
        try {
            validar(-1);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

Aula `excecoes-personalizadas`:

`verify/java/excecoes/aula-saldo-insuficiente.java`:
```java
// verifica: q15, f09 e a aula excecoes-personalizadas (exceção checked própria, com mensagem)
// saida:
// Saldo insuficiente: faltam 50.0
class Main {
    public static void main(String[] args) {
        Conta conta = new Conta(100);
        try {
            conta.sacar(150);
        } catch (SaldoInsuficienteException e) {
            System.out.println(e.getMessage());
        }
    }
}

class SaldoInsuficienteException extends Exception {
    SaldoInsuficienteException(String mensagem) {
        super(mensagem);
    }
}

class Conta {
    private double saldo;

    Conta(double saldo) {
        this.saldo = saldo;
    }

    void sacar(double valor) throws SaldoInsuficienteException {
        if (valor > saldo) {
            throw new SaldoInsuficienteException("Saldo insuficiente: faltam " + (valor - saldo));
        }
        saldo -= valor;
    }
}
```

`verify/java/excecoes/q14-excecao-personalizada.java`:
```java
// verifica: java.excecoes.q14 (a classe montada compila e repassa a mensagem)
// saida:
// Saldo insuficiente
class Main {
    public static void main(String[] args) {
        try {
            throw new SaldoInsuficienteException("Saldo insuficiente");
        } catch (SaldoInsuficienteException e) {
            System.out.println(e.getMessage());
        }
    }
}

class SaldoInsuficienteException extends Exception {
    SaldoInsuficienteException(String mensagem) {
        super(mensagem);
    }
}
```

`verify/java/excecoes/aula-personalizada-checked-sem-throws.java`:
```java
// verifica: f09 e a tabela da aula excecoes-personalizadas (estendendo Exception, a exceção é checked)
// espera: erro-de-compilacao
// erro-contem: unreported exception SaldoInsuficienteException; must be caught or declared to be thrown
class Main {
    static void sacar() {
        throw new SaldoInsuficienteException("Saldo insuficiente");
    }

    public static void main(String[] args) {
        sacar();
    }
}

class SaldoInsuficienteException extends Exception {
    SaldoInsuficienteException(String mensagem) {
        super(mensagem);
    }
}
```

`verify/java/excecoes/q13-personalizada-unchecked.java`:
```java
// verifica: java.excecoes.q13 e f10 (estendendo RuntimeException, não precisa de throws)
// saida:
// Estoque esgotado
class Main {
    static void retirar(int quantidade) {
        throw new EstoqueEsgotadoException("Estoque esgotado");
    }

    public static void main(String[] args) {
        try {
            retirar(1);
        } catch (EstoqueEsgotadoException e) {
            System.out.println(e.getMessage());
        }
    }
}

class EstoqueEsgotadoException extends RuntimeException {
    EstoqueEsgotadoException(String mensagem) {
        super(mensagem);
    }
}
```

`verify/java/excecoes/q13-throwable-checked.java`:
```java
// verifica: java.excecoes.q13 (estender Throwable direto também gera exceção checked)
// espera: erro-de-compilacao
// erro-contem: unreported exception ProblemaException; must be caught or declared to be thrown
class Main {
    public static void main(String[] args) {
        throw new ProblemaException();
    }
}

class ProblemaException extends Throwable {
}
```

`verify/java/excecoes/q13-objeto-nao-lanca.java`:
```java
// verifica: java.excecoes.q13 e q01 (classe que não estende Throwable não pode ser lançada)
// espera: erro-de-compilacao
// erro-contem: incompatible types: Problema cannot be converted to Throwable
class Main {
    public static void main(String[] args) {
        throw new Problema();
    }
}

class Problema {
}
```

`verify/java/excecoes/aula-throw-string.java`:
```java
// verifica: java.excecoes.q01 e o destaque da aula excecoes-personalizadas (String não pode ser lançada)
// espera: erro-de-compilacao
// erro-contem: incompatible types: String cannot be converted to Throwable
class Main {
    public static void main(String[] args) {
        throw "erro";
    }
}
```

`verify/java/excecoes/aula-causa.java`:
```java
// verifica: a aula excecoes-personalizadas (a causa aparece no stack trace)
// espera: excecao ConfigInvalidaException
// erro-contem: Caused by: java.lang.NumberFormatException
class Main {
    public static void main(String[] args) {
        try {
            Integer.parseInt("abc");
        } catch (NumberFormatException e) {
            throw new ConfigInvalidaException("Porta inválida na configuração", e);
        }
    }
}

class ConfigInvalidaException extends RuntimeException {
    ConfigInvalidaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}
```

Aula `try-with-resources`:

`verify/java/excecoes/aula-twr-scanner.java`:
```java
// verifica: a aula try-with-resources (Scanner de arquivo no try-with-resources; com um arquivo que não existe)
// saida:
// Erro ao ler: arquivo-que-nao-existe.txt
import java.io.IOException;
import java.nio.file.Path;
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        try (Scanner sc = new Scanner(Path.of("arquivo-que-nao-existe.txt"))) {
            System.out.println(sc.nextLine());
        } catch (IOException e) {
            System.out.println("Erro ao ler: " + e.getMessage());
        }
    }
}
```

`verify/java/excecoes/aula-twr-ordem.java`:
```java
// verifica: f11, f12 e a aula try-with-resources (close automático, na ordem inversa)
// saida:
// abrindo A
// abrindo B
// usando
// fechando B
// fechando A
class Main {
    public static void main(String[] args) {
        try (Recurso a = new Recurso("A"); Recurso b = new Recurso("B")) {
            System.out.println("usando");
        }
    }
}

class Recurso implements AutoCloseable {
    private final String nome;

    Recurso(String nome) {
        this.nome = nome;
        System.out.println("abrindo " + nome);
    }

    @Override
    public void close() {
        System.out.println("fechando " + nome);
    }
}
```

`verify/java/excecoes/aula-twr-excecao.java`:
```java
// verifica: q17 e a aula try-with-resources (fecha mesmo com exceção, antes do catch e do finally)
// saida:
// abrindo A
// fechando A
// tratando falhou
// finally
class Main {
    public static void main(String[] args) {
        try (Recurso a = new Recurso("A")) {
            throw new IllegalStateException("falhou");
        } catch (IllegalStateException e) {
            System.out.println("tratando " + e.getMessage());
        } finally {
            System.out.println("finally");
        }
    }
}

class Recurso implements AutoCloseable {
    private final String nome;

    Recurso(String nome) {
        this.nome = nome;
        System.out.println("abrindo " + nome);
    }

    @Override
    public void close() {
        System.out.println("fechando " + nome);
    }
}
```

`verify/java/excecoes/aula-twr-java9.java`:
```java
// verifica: a dica da aula try-with-resources (Java 9+: recurso criado antes, nunca reatribuído)
// saida:
// abrindo R
// usando R
// fechando R
class Main {
    public static void main(String[] args) {
        Recurso r = new Recurso("R");
        try (r) {
            System.out.println("usando R");
        }
    }
}

class Recurso implements AutoCloseable {
    private final String nome;

    Recurso(String nome) {
        this.nome = nome;
        System.out.println("abrindo " + nome);
    }

    @Override
    public void close() {
        System.out.println("fechando " + nome);
    }
}
```

`verify/java/excecoes/q16-twr-ordem.java`:
```java
// verifica: java.excecoes.q16 (o bloco roda e os recursos fecham na ordem inversa)
// saida:
// 1BA
class Main {
    public static void main(String[] args) {
        try (Recurso a = new Recurso("A"); Recurso b = new Recurso("B")) {
            System.out.print("1");
        }
    }
}

class Recurso implements AutoCloseable {
    private final String nome;

    Recurso(String nome) {
        this.nome = nome;
    }

    @Override
    public void close() {
        System.out.print(nome);
    }
}
```

`verify/java/excecoes/q18-autocloseable.java`:
```java
// verifica: java.excecoes.q18 (as quatro respostas aceitas funcionam no try-with-resources)
// saida:
// fechou 1
// fechou 2
// fechou 3
// fechou 4
import java.io.Closeable;

class Main {
    public static void main(String[] args) {
        try (Conexao1 c = new Conexao1()) {
        }
        try (Conexao2 c = new Conexao2()) {
        }
        try (Conexao3 c = new Conexao3()) {
        }
        try (Conexao4 c = new Conexao4()) {
        }
    }
}

class Conexao1 implements AutoCloseable {
    public void close() { System.out.println("fechou 1"); }
}

class Conexao2 implements Closeable {
    public void close() { System.out.println("fechou 2"); }
}

class Conexao3 implements java.lang.AutoCloseable {
    public void close() { System.out.println("fechou 3"); }
}

class Conexao4 implements java.io.Closeable {
    public void close() { System.out.println("fechou 4"); }
}
```

- [ ] **Step 6: Conferir com o JDK 21**

Run (PowerShell): `$env:JAVA_HOME = "$env:USERPROFILE\tools\jdk-21.0.12.1+1"; node tools/verify-java.mjs`
Expected: todos passam (`149/149 trechos conferidos.`). Se algum falhar, descubra se o erro está no conteúdo ou no trecho, corrija e rode de novo. Nunca ajuste a saída esperada sem entender a diferença.

- [ ] **Step 7: Commit**

```bash
git add content verify
git commit -m "Adiciona módulo Java › Exceções" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Módulo Strings e Entrada

**Files:**
- Modify: `content/java/language.json` (novo módulo, **depois** de `excecoes`)
- Create: `content/java/06-strings/01-string-imutavel.md`, `02-metodos-de-string.md`, `03-stringbuilder.md`, `04-entrada-com-scanner.md`, `questions.json`, `flashcards.json`
- Create: 30 trechos em `verify/java/strings/` (listados no Step 5)

**Interfaces:**
- Consumes: formato de conteúdo (spec seção 4); diretivas do conferidor (Task 1).
- Produces: módulo `java.strings`, com as aulas `string-imutavel`, `metodos-de-string`, `stringbuilder` e `entrada-com-scanner`.

- [ ] **Step 1: Registrar o módulo (o validador passa a falhar)**

Em `content/java/language.json`, acrescente depois do módulo `excecoes`:

```json
    {
      "id": "strings",
      "dir": "06-strings",
      "title": "Strings e Entrada",
      "description": "Trabalhar com texto: imutabilidade, comparação, métodos úteis, StringBuilder e leitura do teclado com Scanner.",
      "lessons": [
        { "id": "string-imutavel", "file": "01-string-imutavel.md", "title": "Strings são imutáveis", "minutes": 8 },
        { "id": "metodos-de-string", "file": "02-metodos-de-string.md", "title": "Métodos de String", "minutes": 11 },
        { "id": "stringbuilder", "file": "03-stringbuilder.md", "title": "StringBuilder", "minutes": 7 },
        { "id": "entrada-com-scanner", "file": "04-entrada-com-scanner.md", "title": "Lendo o teclado com Scanner", "minutes": 10 }
      ]
    }
```

Run: `npm test`
Expected: FAIL só em "conteúdo de todas as linguagens é válido" (os testes de tela seguem passando, por causa da fixture da Task 2), com `pasta 06-strings não existe`.

- [ ] **Step 2: Escrever as aulas**

`content/java/06-strings/01-string-imutavel.md`:
````markdown
# Strings são imutáveis

`String` é uma classe, e os objetos dela têm uma característica importante: **depois de criados, nunca mudam**.

```java
String s = "java";
s.toUpperCase();          // cria "JAVA", mas ninguém guardou
System.out.println(s);    // java

s = s.toUpperCase();      // agora sim: s passa a apontar para a String nova
System.out.println(s);    // JAVA
```

Todo método que parece "alterar" uma String (`toUpperCase`, `replace`, `trim`...) na verdade **devolve uma String nova**. A original continua igual.

## Comparando textos: `equals`, não `==`

```java
String a = "java";
String b = new String("java");

System.out.println(a == b);        // false: são objetos diferentes
System.out.println(a.equals(b));   // true: o conteúdo é igual
```

- `==` compara **referências**: se as duas variáveis apontam para o mesmo objeto.
- `equals` compara o **conteúdo**, caractere por caractere.

> [!WARNING]
> Às vezes o `==` parece funcionar: com dois textos escritos direto no código, `"java" == "java"` dá `true`, porque o Java reaproveita literais iguais num *pool* de Strings. Não conte com isso. Textos que vêm do teclado, de arquivos ou de contas são objetos novos. Compare sempre com `equals`.

## Outras comparações

```java
"Java".equalsIgnoreCase("JAVA")   // true: ignora maiúsculas e minúsculas
"abc".compareTo("abd")            // negativo: "abc" vem antes
"abc".compareTo("abc")            // 0: são iguais
```

> [!TIP]
> Se a variável puder ser `null`, escreva o texto fixo primeiro: `"sim".equals(resposta)` devolve `false` quando `resposta` é `null`, enquanto `resposta.equals("sim")` lançaria `NullPointerException`.
````

`content/java/06-strings/02-metodos-de-string.md`:
````markdown
# Métodos de String

As posições de uma String começam em **0**, como nos arrays:

```text
P  r  o  g  r  a  m  a  r
0  1  2  3  4  5  6  7  8
```

## Medir e acessar

| Método | Exemplo | Resultado |
|---|---|---|
| `length()` | `"Programar".length()` | `9` |
| `charAt(i)` | `"Programar".charAt(3)` | `'g'` |
| `isEmpty()` | `"".isEmpty()` | `true` |
| `isBlank()` (Java 11+) | `"   ".isBlank()` | `true` |

`isEmpty()` só é `true` para a String de tamanho zero; `"   ".isEmpty()` é `false`.

## Procurar

| Método | Exemplo | Resultado |
|---|---|---|
| `indexOf(x)` | `"banana".indexOf("na")` | `2` (a primeira ocorrência) |
| `lastIndexOf(x)` | `"banana".lastIndexOf("na")` | `4` |
| `indexOf(x)` | `"banana".indexOf("x")` | `-1` (não achou) |
| `contains(x)` | `"banana".contains("nan")` | `true` |
| `startsWith(x)` | `"banana".startsWith("ba")` | `true` |
| `endsWith(x)` | `"banana".endsWith("na")` | `true` |

## Recortar e transformar

| Método | Exemplo | Resultado |
|---|---|---|
| `substring(i, f)` | `"Programar".substring(0, 3)` | `"Pro"` (a posição `f` não entra) |
| `substring(i)` | `"Programar".substring(3)` | `"gramar"` |
| `toUpperCase()` | `"Oi".toUpperCase()` | `"OI"` |
| `toLowerCase()` | `"Oi".toLowerCase()` | `"oi"` |
| `trim()` | `"  Oi  ".trim()` | `"Oi"` |
| `strip()` (Java 11+) | `"  Oi  ".strip()` | `"Oi"` |
| `replace(a, b)` | `"banana".replace("a", "o")` | `"bonono"` |
| `repeat(n)` (Java 11+) | `"ab".repeat(3)` | `"ababab"` |

> [!NOTE]
> `trim()` e `strip()` tiram espaços, tabulações e quebras de linha das pontas. A diferença é que `strip()` também reconhece os espaços especiais do Unicode, como o *em space* (` `), que o `trim()` deixa passar.

## Dividir e juntar

```java
String[] partes = "Ana;Bia;Caio".split(";");
System.out.println(partes.length);    // 3
System.out.println(partes[1]);        // Bia

String junto = String.join(", ", partes);
System.out.println(junto);            // Ana, Bia, Caio
```

`String.join` também aceita uma lista: `String.join(", ", List.of("Ana", "Bia"))`.

> [!CAUTION]
> `split` recebe uma **expressão regular**, em que alguns caracteres têm significado especial. O ponto, por exemplo, quer dizer "qualquer caractere": `"a.b.c".split(".")` devolve um array **vazio**. Para dividir no ponto de verdade, escape-o: `"a.b.c".split("\\.")` devolve `[a, b, c]`.

## Montando textos com `format`

```java
String msg = String.format("%s tirou %.2f", "Ana", 8.456);
System.out.println(msg);
// num computador em português: Ana tirou 8,46
// num computador em inglês:    Ana tirou 8.46
```

- `%s` recebe um texto, `%d` um número inteiro, `%.2f` um decimal com 2 casas (arredondado) e `%n` uma quebra de linha.
- O separador decimal segue o idioma do sistema. Para fixá-lo, informe o idioma: `String.format(Locale.US, "%.2f", 8.456)` dá `8.46`.
- Desde o Java 15, também dá para escrever `"%s tirou %.2f".formatted("Ana", 8.456)`.
````

`content/java/06-strings/03-stringbuilder.md`:
````markdown
# StringBuilder

Como `String` é imutável, cada `+` cria uma String nova. Num laço, isso significa criar e jogar fora muitos objetos:

```java
String texto = "";
for (int i = 1; i <= 3; i++) {
    texto += i + " ";        // uma String nova a cada volta
}
```

O **`StringBuilder`** é um texto **mutável**: ele altera o próprio objeto.

```java
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 3; i++) {
    sb.append(i).append(" ");
}
String resultado = sb.toString().trim();
System.out.println(resultado);   // 1 2 3
```

## Métodos principais

| Método | O que faz |
|---|---|
| `append(x)` | acrescenta no fim (aceita textos, números, `char`...) |
| `insert(i, x)` | insere na posição `i` |
| `reverse()` | inverte o texto |
| `deleteCharAt(i)` | remove o caractere da posição `i` |
| `length()` | quantos caracteres há |
| `toString()` | gera a `String` final |

```java
StringBuilder sb = new StringBuilder("Java");
sb.append("!");          // Java!
sb.insert(0, "Oi, ");    // Oi, Java!
sb.reverse();            // !avaJ ,iO
System.out.println(sb);  // !avaJ ,iO
```

Os métodos devolvem o próprio `StringBuilder`, por isso dá para encadear chamadas: `sb.append("a").append("b")`.

> [!TIP]
> Para juntar poucos pedaços numa linha só, o `+` é mais legível e o compilador já cuida da eficiência. Reserve o `StringBuilder` para textos montados aos poucos, em laços.

> [!NOTE]
> `StringBuilder` não sobrescreve `equals`: dois builders com o mesmo texto não são "iguais". Para comparar, converta antes: `sb1.toString().equals(sb2.toString())`.
````

`content/java/06-strings/04-entrada-com-scanner.md`:
````markdown
# Lendo o teclado com Scanner

```java
import java.util.Scanner;

public class Cadastro {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Nome: ");
        String nome = sc.nextLine();

        System.out.print("Idade: ");
        int idade = sc.nextInt();

        System.out.println(nome + " tem " + idade + " anos.");
    }
}
```

`System.in` é a entrada padrão (o teclado, no terminal). O `Scanner` divide o que foi digitado em pedaços e converte cada um:

| Método | Lê |
|---|---|
| `nextLine()` | a linha inteira, com os espaços |
| `next()` | uma palavra (até o próximo espaço) |
| `nextInt()` | um `int` |
| `nextDouble()` | um `double` |
| `nextBoolean()` | `true` ou `false` |

## Armadilha 1: `nextInt()` seguido de `nextLine()`

```java
System.out.print("Idade: ");
int idade = sc.nextInt();        // a pessoa digita 25 e Enter
System.out.print("Cidade: ");
String cidade = sc.nextLine();   // vem VAZIA!
```

O `nextInt()` lê o `25`, mas deixa na entrada a quebra de linha do Enter. O `nextLine()` seguinte encontra essa quebra e devolve o que havia antes dela: uma String vazia. A solução é descartar a quebra com um `nextLine()` extra:

```java
int idade = sc.nextInt();
sc.nextLine();                   // descarta o Enter que sobrou
String cidade = sc.nextLine();   // agora lê a cidade
```

Outra saída é ler tudo com `nextLine()` e converter: `int idade = Integer.parseInt(sc.nextLine());`.

## Armadilha 2: o separador decimal

O `Scanner` segue o idioma do sistema. Num computador em português do Brasil, `nextDouble()` espera **vírgula** (`7,5`); se a pessoa digitar `7.5`, ele lança `InputMismatchException`.

Para aceitar o ponto em qualquer computador, defina o idioma do `Scanner`:

```java
import java.util.Locale;

Scanner sc = new Scanner(System.in);
sc.useLocale(Locale.US);         // agora nextDouble() espera 7.5
```

## Entrada inválida

Se a pessoa digitar `abc` quando o programa espera um número, `nextInt()` lança `InputMismatchException`. Para conferir antes:

```java
if (sc.hasNextInt()) {
    int n = sc.nextInt();
    System.out.println("Número: " + n);
} else {
    System.out.println("Isso não é um número.");
}
```

> [!TIP]
> Para testar sem digitar, o `Scanner` também lê de uma String: `new Scanner("25\nRecife\n")` se comporta como se alguém digitasse `25`, Enter, `Recife`, Enter.

> [!NOTE]
> Não feche um `Scanner` de `System.in` no meio do programa: `sc.close()` fecha também o `System.in`, e nada mais consegue ler o teclado depois. Em programas pequenos, deixe-o aberto.
````

- [ ] **Step 3: Escrever perguntas e cartas**

`content/java/06-strings/questions.json`:
```json
{
  "questions": [
    {
      "id": "java.strings.q01", "type": "multiple", "difficulty": 1, "lesson": "string-imutavel",
      "prompt": "Qual é a forma correta de comparar o **conteúdo** de duas Strings `a` e `b`?",
      "options": ["`a.equals(b)`", "`a == b`", "`a = b`", "`a.compare(b)`"], "answer": 0,
      "explanation": "`equals` compara o conteúdo. `==` compara se são o mesmo objeto, `=` é atribuição, e `String` não tem método `compare` (o método de ordem é `compareTo`)."
    },
    {
      "id": "java.strings.q02", "type": "multiple", "difficulty": 2, "lesson": "string-imutavel",
      "prompt": "O que este código imprime?\n\n```java\nString a = \"java\";\nString b = new String(\"java\");\nSystem.out.println(a == b);\nSystem.out.println(a.equals(b));\n```",
      "options": ["`false` e depois `true`", "`true` e depois `true`", "`true` e depois `false`", "`false` e depois `false`"], "answer": 0,
      "explanation": "`new String(...)` cria um objeto novo, então `a == b` é `false`. O conteúdo é o mesmo, então `equals` dá `true`."
    },
    {
      "id": "java.strings.q03", "type": "multiple", "difficulty": 2, "lesson": "string-imutavel",
      "prompt": "O que este código imprime?\n\n```java\nString s = \"java\";\ns.toUpperCase();\nSystem.out.println(s);\n```",
      "options": ["java", "JAVA", "Java", "Erro de compilação"], "answer": 0,
      "explanation": "Strings são imutáveis: `toUpperCase()` devolve uma String nova, que aqui foi descartada. Para guardar, seria `s = s.toUpperCase();`."
    },
    {
      "id": "java.strings.q04", "type": "truefalse", "difficulty": 1, "lesson": "string-imutavel",
      "prompt": "`\"Java\".equalsIgnoreCase(\"JAVA\")` devolve `true`.",
      "answer": true,
      "explanation": "`equalsIgnoreCase` compara o conteúdo sem diferenciar maiúsculas de minúsculas."
    },
    {
      "id": "java.strings.q05", "type": "multiple", "difficulty": 1, "lesson": "metodos-de-string",
      "prompt": "Qual é o resultado de `\"Programar\".substring(0, 3)`?",
      "options": ["Pro", "Prog", "rog", "ogr"], "answer": 0,
      "explanation": "`substring(inicio, fim)` vai da posição `inicio` até `fim - 1`: posições 0, 1 e 2, ou seja, `Pro`."
    },
    {
      "id": "java.strings.q06", "type": "multiple", "difficulty": 2, "lesson": "metodos-de-string",
      "prompt": "Qual é o resultado de `\"banana\".indexOf(\"na\")`?",
      "options": ["2", "4", "1", "-1"], "answer": 0,
      "explanation": "`indexOf` devolve a posição da **primeira** ocorrência: `b`(0) `a`(1) `n`(2). A segunda ocorrência, na posição 4, é o que `lastIndexOf` devolveria."
    },
    {
      "id": "java.strings.q07", "type": "fill", "difficulty": 1, "lesson": "metodos-de-string",
      "prompt": "Complete para guardar em `n` o número de caracteres de `nome`:",
      "code": "int n = nome.___();",
      "blanks": [["length"]],
      "explanation": "Em `String`, `length()` é um método, com parênteses. Em arrays, `length` é um atributo, sem parênteses."
    },
    {
      "id": "java.strings.q08", "type": "multiple", "difficulty": 3, "lesson": "metodos-de-string",
      "prompt": "Qual é o valor de `\"a.b.c\".split(\".\").length`?",
      "options": ["0", "3", "5", "1"], "answer": 0,
      "explanation": "`split` recebe uma expressão regular, e `.` significa \"qualquer caractere\". Todo caractere vira separador, sobram só pedaços vazios, e o `split` descarta os vazios do fim: o array fica com tamanho 0. Para dividir no ponto, use `split(\"\\\\.\")`, que dá 3."
    },
    {
      "id": "java.strings.q09", "type": "truefalse", "difficulty": 2, "lesson": "metodos-de-string",
      "prompt": "`\"   \".isBlank()` devolve `true` (Java 11+).",
      "answer": true,
      "explanation": "`isBlank()` é `true` para Strings vazias ou só com espaços. Já `\"   \".isEmpty()` é `false`, porque o tamanho é 3."
    },
    {
      "id": "java.strings.q10", "type": "multiple", "difficulty": 2, "lesson": "metodos-de-string",
      "prompt": "Qual é o resultado de `\" Oi \".trim().length()`?",
      "options": ["2", "4", "3", "0"], "answer": 0,
      "explanation": "`trim()` remove os espaços das duas pontas, sobrando `\"Oi\"`, que tem 2 caracteres."
    },
    {
      "id": "java.strings.q11", "type": "fill", "difficulty": 2, "lesson": "metodos-de-string",
      "prompt": "Complete para que `texto` fique `\"Ana, Bia, Caio\"`:",
      "code": "String texto = String.___(\", \", List.of(\"Ana\", \"Bia\", \"Caio\"));",
      "blanks": [["join"]],
      "explanation": "`String.join(separador, itens)` junta os itens com o separador entre eles. Aceita uma lista ou vários textos."
    },
    {
      "id": "java.strings.q12", "type": "multiple", "difficulty": 2, "lesson": "stringbuilder",
      "prompt": "Por que usar `StringBuilder` para montar um texto dentro de um laço?",
      "options": ["Porque ele altera o próprio objeto, sem criar uma String nova a cada concatenação", "Porque `String` não pode ser usada dentro de laços", "Porque o `+` entre Strings não compila dentro de laços", "Porque o `StringBuilder` remove espaços sozinho"], "answer": 0,
      "explanation": "Como `String` é imutável, cada `+` cria um objeto novo. O `StringBuilder` é mutável e vai acrescentando no mesmo objeto."
    },
    {
      "id": "java.strings.q13", "type": "order", "difficulty": 2, "lesson": "stringbuilder",
      "prompt": "Monte o trecho que imprime `1 2 3` usando um `StringBuilder`:",
      "lines": ["StringBuilder sb = new StringBuilder();", "for (int i = 1; i <= 3; i++) {", "    sb.append(i).append(\" \");", "}", "System.out.println(sb.toString().trim());"],
      "explanation": "Cria o builder, acrescenta cada número com um espaço dentro do laço e, depois do laço, imprime uma vez só, tirando o espaço do fim com `trim()`."
    },
    {
      "id": "java.strings.q14", "type": "multiple", "difficulty": 2, "lesson": "stringbuilder",
      "prompt": "O que `System.out.println(new StringBuilder(\"abc\").reverse().append(\"!\"));` imprime?",
      "options": ["cba!", "!cba", "abc!", "!abc"], "answer": 0,
      "explanation": "`reverse()` transforma `abc` em `cba`, e `append(\"!\")` acrescenta no fim: `cba!`."
    },
    {
      "id": "java.strings.q15", "type": "multiple", "difficulty": 3, "lesson": "entrada-com-scanner",
      "prompt": "A pessoa digita `25`, Enter, `Recife`, Enter. O que fica em `cidade`?\n\n```java\nScanner sc = new Scanner(System.in);\nint idade = sc.nextInt();\nString cidade = sc.nextLine();\n```",
      "options": ["Uma String vazia", "Recife", "25", "O programa lança exceção"], "answer": 0,
      "explanation": "O `nextInt()` lê o 25 e deixa a quebra de linha na entrada. O `nextLine()` seguinte devolve o que havia antes dessa quebra: nada. Descarte a quebra com um `sc.nextLine()` extra antes de ler a cidade."
    },
    {
      "id": "java.strings.q16", "type": "multiple", "difficulty": 3, "lesson": "entrada-com-scanner",
      "prompt": "Num computador configurado em português do Brasil, a pessoa digita `7.5` para `sc.nextDouble()`, sem nenhum `useLocale`. O que acontece?",
      "options": ["Lança `InputMismatchException`, porque o Scanner espera `7,5`", "Lê 7.5 normalmente", "Lê 75", "Lê 7 e ignora o resto"], "answer": 0,
      "explanation": "O `Scanner` usa o idioma do sistema, e em português do Brasil o separador decimal é a vírgula. Para aceitar `7.5`, use `sc.useLocale(Locale.US)`."
    },
    {
      "id": "java.strings.q17", "type": "fill", "difficulty": 2, "lesson": "entrada-com-scanner",
      "prompt": "Complete para que o Scanner leia números com ponto decimal (`7.5`) em qualquer computador:",
      "code": "sc.___(Locale.US);",
      "blanks": [["useLocale"]],
      "explanation": "`useLocale(Locale.US)` faz o Scanner seguir as regras do inglês dos Estados Unidos, em que o separador decimal é o ponto."
    },
    {
      "id": "java.strings.q18", "type": "truefalse", "difficulty": 1, "lesson": "entrada-com-scanner",
      "prompt": "`sc.nextLine()` lê a linha inteira, inclusive os espaços.",
      "answer": true,
      "explanation": "Com a entrada `Maria Silva`, `nextLine()` devolve `Maria Silva`. Já `next()` devolveria só `Maria`."
    }
  ]
}
```

`content/java/06-strings/flashcards.json`:
```json
{
  "cards": [
    { "id": "java.strings.f01", "lesson": "string-imutavel", "front": "O que significa dizer que `String` é imutável?", "back": "Um objeto `String` nunca muda. Métodos como `toUpperCase()` devolvem uma String nova; para guardá-la, reatribua: `s = s.toUpperCase();`." },
    { "id": "java.strings.f02", "lesson": "string-imutavel", "front": "`==` ou `equals` para comparar Strings?", "back": "`equals`, que compara o conteúdo. `==` compara se são o mesmo objeto e pode dar `false` para textos iguais." },
    { "id": "java.strings.f03", "lesson": "string-imutavel", "front": "Como comparar Strings ignorando maiúsculas e minúsculas?", "back": "Com `a.equalsIgnoreCase(b)`." },
    { "id": "java.strings.f04", "lesson": "metodos-de-string", "front": "O que `substring(inicio, fim)` devolve?", "back": "Os caracteres da posição `inicio` até `fim - 1`: o fim não entra. `\"Programar\".substring(0, 3)` é `\"Pro\"`." },
    { "id": "java.strings.f05", "lesson": "metodos-de-string", "front": "Por que `\"a.b.c\".split(\".\")` devolve um array vazio?", "back": "`split` recebe uma expressão regular, e `.` significa \"qualquer caractere\". Para dividir no ponto, use `split(\"\\\\.\")`." },
    { "id": "java.strings.f06", "lesson": "metodos-de-string", "front": "Qual a diferença entre `isEmpty()` e `isBlank()`?", "back": "`isEmpty()`: tamanho zero. `isBlank()` (Java 11+): vazia ou só com espaços." },
    { "id": "java.strings.f07", "lesson": "metodos-de-string", "front": "Como juntar vários textos com um separador?", "back": "Com `String.join(\", \", lista)`, que aceita uma lista ou vários textos." },
    { "id": "java.strings.f08", "lesson": "stringbuilder", "front": "Quando usar `StringBuilder`?", "back": "Para montar um texto aos poucos, principalmente em laços: ele altera o próprio objeto em vez de criar uma String nova a cada `+`." },
    { "id": "java.strings.f09", "lesson": "stringbuilder", "front": "Quais são os principais métodos do `StringBuilder`?", "back": "`append` (acrescenta no fim), `insert` (insere numa posição), `reverse` (inverte) e `toString` (gera a String)." },
    { "id": "java.strings.f10", "lesson": "entrada-com-scanner", "front": "Como criar um `Scanner` para ler o teclado?", "back": "`Scanner sc = new Scanner(System.in);`, com `import java.util.Scanner;` no topo do arquivo." },
    { "id": "java.strings.f11", "lesson": "entrada-com-scanner", "front": "Qual é a armadilha de `nextInt()` seguido de `nextLine()`?", "back": "O `nextInt()` deixa a quebra de linha na entrada, e o `nextLine()` seguinte devolve uma String vazia. Chame um `nextLine()` extra para descartar a quebra." },
    { "id": "java.strings.f12", "lesson": "entrada-com-scanner", "front": "Por que o Scanner recusa `7.5` em alguns computadores?", "back": "Ele segue o idioma do sistema: em português do Brasil, espera `7,5`. Para aceitar o ponto, use `sc.useLocale(Locale.US)`." }
  ]
}
```

- [ ] **Step 4: Rodar o validador**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Escrever os trechos de conferência**

> Grave os trechos com a ferramenta de escrever arquivos, não com heredoc do shell: o heredoc da ferramenta de shell já engoliu barras invertidas (`"\\."` virou `"\."`), e vários trechos deste módulo dependem delas.

Aula `string-imutavel`:

`verify/java/strings/aula-imutavel.java`:
```java
// verifica: q03, f01 e a aula string-imutavel (o método devolve uma String nova)
// saida:
// java
// JAVA
class Main {
    public static void main(String[] args) {
        String s = "java";
        s.toUpperCase();
        System.out.println(s);
        s = s.toUpperCase();
        System.out.println(s);
    }
}
```

`verify/java/strings/q02-equals.java`:
```java
// verifica: java.strings.q02, f02 e a aula string-imutavel (== compara referências; equals, conteúdo)
// saida:
// false
// true
class Main {
    public static void main(String[] args) {
        String a = "java";
        String b = new String("java");
        System.out.println(a == b);
        System.out.println(a.equals(b));
    }
}
```

`verify/java/strings/q01-compare-nao-existe.java`:
```java
// verifica: a explicação de java.strings.q01 (String não tem método compare)
// espera: erro-de-compilacao
// erro-contem: cannot find symbol
class Main {
    public static void main(String[] args) {
        String a = "java";
        String b = "java";
        System.out.println(a.compare(b));
    }
}
```

`verify/java/strings/aula-pool.java`:
```java
// verifica: o aviso da aula string-imutavel (literais iguais são reaproveitados; textos montados são novos)
// saida:
// true
// false
// true
class Main {
    public static void main(String[] args) {
        String a = "java";
        String b = "java";
        System.out.println(a == b);
        String parte = "ja";
        String c = parte + "va";
        System.out.println(a == c);
        System.out.println(a.equals(c));
    }
}
```

`verify/java/strings/aula-comparacoes.java`:
```java
// verifica: q04, f03 e a aula string-imutavel (equalsIgnoreCase e compareTo)
// saida:
// true
// true
// 0
class Main {
    public static void main(String[] args) {
        System.out.println("Java".equalsIgnoreCase("JAVA"));
        System.out.println("abc".compareTo("abd") < 0);
        System.out.println("abc".compareTo("abc"));
    }
}
```

`verify/java/strings/aula-equals-constante-primeiro.java`:
```java
// verifica: a dica da aula string-imutavel (texto fixo primeiro: false com null)
// saida:
// false
class Main {
    public static void main(String[] args) {
        String resposta = null;
        System.out.println("sim".equals(resposta));
    }
}
```

`verify/java/strings/aula-equals-null.java`:
```java
// verifica: a dica da aula string-imutavel (equals chamado numa variável null)
// espera: excecao NullPointerException
class Main {
    public static void main(String[] args) {
        String resposta = null;
        System.out.println(resposta.equals("sim"));
    }
}
```

Aula `metodos-de-string`:

`verify/java/strings/aula-metodos-medir.java`:
```java
// verifica: q07, q09, f06 e a tabela "Medir e acessar" da aula metodos-de-string
// saida:
// 9
// g
// true
// true
// false
class Main {
    public static void main(String[] args) {
        System.out.println("Programar".length());
        System.out.println("Programar".charAt(3));
        System.out.println("".isEmpty());
        System.out.println("   ".isBlank());
        System.out.println("   ".isEmpty());
    }
}
```

`verify/java/strings/aula-metodos-procurar.java`:
```java
// verifica: q06 e a tabela "Procurar" da aula metodos-de-string
// saida:
// 2
// 4
// -1
// true
// true
// true
class Main {
    public static void main(String[] args) {
        System.out.println("banana".indexOf("na"));
        System.out.println("banana".lastIndexOf("na"));
        System.out.println("banana".indexOf("x"));
        System.out.println("banana".contains("nan"));
        System.out.println("banana".startsWith("ba"));
        System.out.println("banana".endsWith("na"));
    }
}
```

`verify/java/strings/aula-metodos-transformar.java`:
```java
// verifica: q05, f04 e a tabela "Recortar e transformar" da aula metodos-de-string
// saida:
// Pro
// gramar
// OI
// oi
// [Oi]
// [Oi]
// bonono
// ababab
class Main {
    public static void main(String[] args) {
        System.out.println("Programar".substring(0, 3));
        System.out.println("Programar".substring(3));
        System.out.println("Oi".toUpperCase());
        System.out.println("Oi".toLowerCase());
        System.out.println("[" + "  Oi  ".trim() + "]");
        System.out.println("[" + "  Oi  ".strip() + "]");
        System.out.println("banana".replace("a", "o"));
        System.out.println("ab".repeat(3));
    }
}
```

`verify/java/strings/aula-trim-strip.java`:
```java
// verifica: a nota da aula metodos-de-string (trim não remove o em space; strip remove)
// saida:
// 4
// 2
class Main {
    public static void main(String[] args) {
        String texto = " Oi ";
        System.out.println(texto.trim().length());
        System.out.println(texto.strip().length());
    }
}
```

`verify/java/strings/aula-split-join.java`:
```java
// verifica: f07 e a aula metodos-de-string (split e String.join com array e com lista)
// saida:
// 3
// Bia
// Ana, Bia, Caio
// Ana, Bia
import java.util.List;

class Main {
    public static void main(String[] args) {
        String[] partes = "Ana;Bia;Caio".split(";");
        System.out.println(partes.length);
        System.out.println(partes[1]);
        String junto = String.join(", ", partes);
        System.out.println(junto);
        System.out.println(String.join(", ", List.of("Ana", "Bia")));
    }
}
```

`verify/java/strings/q08-split-ponto.java`:
```java
// verifica: java.strings.q08, f05 e o alerta da aula metodos-de-string (split recebe expressão regular)
// saida:
// 0
// 3
// [a, b, c]
import java.util.Arrays;

class Main {
    public static void main(String[] args) {
        System.out.println("a.b.c".split(".").length);
        System.out.println("a.b.c".split("\\.").length);
        System.out.println(Arrays.toString("a.b.c".split("\\.")));
    }
}
```

`verify/java/strings/aula-format.java`:
```java
// verifica: a aula metodos-de-string (format segue o idioma; Locale explícito; formatted no Java 15+; %d)
// saida:
// Ana tirou 8,46
// Ana tirou 8.46
// 8.46
// Ana tirou 8.46
// 3 itens
import java.util.Locale;

class Main {
    public static void main(String[] args) {
        System.out.println(String.format(Locale.forLanguageTag("pt-BR"), "%s tirou %.2f", "Ana", 8.456));
        System.out.println(String.format(Locale.US, "%s tirou %.2f", "Ana", 8.456));
        System.out.println(String.format(Locale.US, "%.2f", 8.456));
        Locale.setDefault(Locale.US);
        System.out.println("%s tirou %.2f".formatted("Ana", 8.456));
        System.out.println(String.format("%d itens", 3));
    }
}
```

`verify/java/strings/q10-trim.java`:
```java
// verifica: java.strings.q10 (trim remove os espaços das pontas)
// saida:
// 2
class Main {
    public static void main(String[] args) {
        System.out.println(" Oi ".trim().length());
    }
}
```

`verify/java/strings/q11-join-list.java`:
```java
// verifica: java.strings.q11 (String.join com uma lista)
// saida:
// Ana, Bia, Caio
import java.util.List;

class Main {
    public static void main(String[] args) {
        String texto = String.join(", ", List.of("Ana", "Bia", "Caio"));
        System.out.println(texto);
    }
}
```

Aula `stringbuilder`:

`verify/java/strings/aula-concatenacao-laco.java`:
```java
// verifica: a aula stringbuilder (o laço com += monta o texto, com espaço no fim)
// saida:
// [1 2 3 ]
class Main {
    public static void main(String[] args) {
        String texto = "";
        for (int i = 1; i <= 3; i++) {
            texto += i + " ";
        }
        System.out.println("[" + texto + "]");
    }
}
```

`verify/java/strings/q13-stringbuilder.java`:
```java
// verifica: java.strings.q13, q12, f08 e a aula stringbuilder (a ordem montada imprime 1 2 3)
// saida:
// 1 2 3
class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        for (int i = 1; i <= 3; i++) {
            sb.append(i).append(" ");
        }
        System.out.println(sb.toString().trim());
    }
}
```

`verify/java/strings/aula-sb-metodos.java`:
```java
// verifica: f09 e a tabela da aula stringbuilder (append, insert, reverse, deleteCharAt, length e encadeamento)
// saida:
// Java!
// Oi, Java!
// !avaJ ,iO
// avaJ ,iO
// 8
// avaJ ,iOab
class Main {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder("Java");
        sb.append("!");
        System.out.println(sb);
        sb.insert(0, "Oi, ");
        System.out.println(sb);
        sb.reverse();
        System.out.println(sb);
        sb.deleteCharAt(0);
        System.out.println(sb);
        System.out.println(sb.length());
        String s = sb.append("a").append("b").toString();
        System.out.println(s);
    }
}
```

`verify/java/strings/q14-sb-reverse.java`:
```java
// verifica: java.strings.q14 (reverse e depois append)
// saida:
// cba!
class Main {
    public static void main(String[] args) {
        System.out.println(new StringBuilder("abc").reverse().append("!"));
    }
}
```

`verify/java/strings/aula-sb-equals.java`:
```java
// verifica: a nota da aula stringbuilder (StringBuilder não sobrescreve equals)
// saida:
// false
// true
class Main {
    public static void main(String[] args) {
        StringBuilder sb1 = new StringBuilder("a");
        StringBuilder sb2 = new StringBuilder("a");
        System.out.println(sb1.equals(sb2));
        System.out.println(sb1.toString().equals(sb2.toString()));
    }
}
```

Aula `entrada-com-scanner` (a entrada vem de uma String, como se fosse digitada):

`verify/java/strings/aula-cadastro.java`:
```java
// verifica: f10 e a aula entrada-com-scanner (nextLine e nextInt; os rótulos aparecem sem o que foi "digitado")
// saida:
// Nome: Idade: Ana Silva tem 30 anos.
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("Ana Silva\n30\n");

        System.out.print("Nome: ");
        String nome = sc.nextLine();

        System.out.print("Idade: ");
        int idade = sc.nextInt();

        System.out.println(nome + " tem " + idade + " anos.");
    }
}
```

`verify/java/strings/q15-nextint-nextline.java`:
```java
// verifica: java.strings.q15, f11 e a aula entrada-com-scanner (nextLine depois de nextInt vem vazio)
// saida:
// 25
// []
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("25\nRecife\n");
        int idade = sc.nextInt();
        String cidade = sc.nextLine();
        System.out.println(idade);
        System.out.println("[" + cidade + "]");
    }
}
```

`verify/java/strings/aula-nextline-extra.java`:
```java
// verifica: f11 e a aula entrada-com-scanner (as duas soluções: nextLine extra e parseInt)
// saida:
// 25 Recife
// 25 Recife
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("25\nRecife\n");
        int idade = sc.nextInt();
        sc.nextLine();
        String cidade = sc.nextLine();
        System.out.println(idade + " " + cidade);

        Scanner sc2 = new Scanner("25\nRecife\n");
        int idade2 = Integer.parseInt(sc2.nextLine());
        String cidade2 = sc2.nextLine();
        System.out.println(idade2 + " " + cidade2);
    }
}
```

`verify/java/strings/q16-locale-ptbr.java`:
```java
// verifica: java.strings.q16, f12 e a aula entrada-com-scanner (em pt-BR, 7.5 não é um double válido)
// espera: excecao InputMismatchException
import java.util.Locale;
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("7.5");
        sc.useLocale(Locale.forLanguageTag("pt-BR"));
        System.out.println(sc.nextDouble());
    }
}
```

`verify/java/strings/aula-locale.java`:
```java
// verifica: q17, f12 e a aula entrada-com-scanner (pt-BR lê 7,5; Locale.US lê 7.5)
// saida:
// 7.5
// 7.5
import java.util.Locale;
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner br = new Scanner("7,5");
        br.useLocale(Locale.forLanguageTag("pt-BR"));
        System.out.println(br.nextDouble());

        Scanner us = new Scanner("7.5");
        us.useLocale(Locale.US);
        System.out.println(us.nextDouble());
    }
}
```

`verify/java/strings/aula-hasnextint.java`:
```java
// verifica: a aula entrada-com-scanner (hasNextInt confere antes de ler)
// saida:
// Isso não é um número.
// Número: 42
import java.util.Scanner;

class Main {
    static void ler(Scanner sc) {
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            System.out.println("Número: " + n);
        } else {
            System.out.println("Isso não é um número.");
        }
    }

    public static void main(String[] args) {
        ler(new Scanner("abc"));
        ler(new Scanner("42"));
    }
}
```

`verify/java/strings/aula-nextint-invalido.java`:
```java
// verifica: a aula entrada-com-scanner (nextInt com texto que não é número)
// espera: excecao InputMismatchException
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner("abc");
        System.out.println(sc.nextInt());
    }
}
```

`verify/java/strings/q18-next-nextline.java`:
```java
// verifica: java.strings.q18 e a tabela da aula entrada-com-scanner (nextLine lê a linha; next, uma palavra)
// saida:
// Maria Silva
// Maria
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        System.out.println(new Scanner("Maria Silva\n").nextLine());
        System.out.println(new Scanner("Maria Silva\n").next());
    }
}
```

`verify/java/strings/aula-scanner-close.java`:
```java
// verifica: a nota da aula entrada-com-scanner (fechar o Scanner fecha o System.in)
// saida:
// Stream closed
import java.io.IOException;
import java.util.Scanner;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        sc.close();
        try {
            System.in.read();
        } catch (IOException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

- [ ] **Step 6: Conferir com o JDK 21**

Run (PowerShell): `$env:JAVA_HOME = "$env:USERPROFILE\tools\jdk-21.0.12.1+1"; node tools/verify-java.mjs`
Expected: todos passam (`179/179 trechos conferidos.`). Se algum falhar, descubra se o erro está no conteúdo ou no trecho, corrija e rode de novo. Nunca ajuste a saída esperada sem entender a diferença.

- [ ] **Step 7: Commit**

```bash
git add content verify
git commit -m "Adiciona módulo Java › Strings e Entrada" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Módulo Java Moderno (8 a 21)

**Files:**
- Modify: `content/java/language.json` (novo módulo, **depois** de `strings`, no fim da lista)
- Create: `content/java/07-java-moderno/01-lambdas.md`, `02-streams.md`, `03-optional.md`, `04-var-e-text-blocks.md`, `05-records.md`, `06-switch-e-pattern-matching.md`, `questions.json`, `flashcards.json`
- Create: 51 trechos em `verify/java/java-moderno/` (listados no Step 5)

**Interfaces:**
- Consumes: formato de conteúdo (spec seção 4); diretivas do conferidor (Task 1).
- Produces: módulo `java.java-moderno`, com as aulas `lambdas`, `streams`, `optional`, `var-e-text-blocks`, `records` e `switch-e-pattern-matching`.

- [ ] **Step 1: Registrar o módulo (o validador passa a falhar)**

Em `content/java/language.json`, acrescente depois do módulo `strings`:

```json
    {
      "id": "java-moderno",
      "dir": "07-java-moderno",
      "title": "Java Moderno (8 a 21)",
      "description": "Recursos do Java 8 ao 21: lambdas, interfaces funcionais, streams, Optional, var, text blocks, records, switch moderno e pattern matching.",
      "lessons": [
        { "id": "lambdas", "file": "01-lambdas.md", "title": "Lambdas e interfaces funcionais", "minutes": 10 },
        { "id": "streams", "file": "02-streams.md", "title": "Streams", "minutes": 12 },
        { "id": "optional", "file": "03-optional.md", "title": "Optional", "minutes": 7 },
        { "id": "var-e-text-blocks", "file": "04-var-e-text-blocks.md", "title": "var e text blocks", "minutes": 7 },
        { "id": "records", "file": "05-records.md", "title": "Records", "minutes": 8 },
        { "id": "switch-e-pattern-matching", "file": "06-switch-e-pattern-matching.md", "title": "switch moderno e pattern matching", "minutes": 11 }
      ]
    }
```

Run: `npm test`
Expected: FAIL só em "conteúdo de todas as linguagens é válido" (os testes de tela seguem passando, por causa da fixture da Task 2), com `pasta 07-java-moderno não existe`.

- [ ] **Step 2: Escrever as aulas**

`content/java/07-java-moderno/01-lambdas.md`:
````markdown
# Lambdas e interfaces funcionais

## Comportamento como valor

No módulo Coleções você escreveu `nomes.removeIf(n -> n.isEmpty())`. O trecho `n -> n.isEmpty()` é uma **lambda** (Java 8+): uma função curta, sem nome, que você passa como argumento.

```text
(parametros) -> expressao
(parametros) -> { instrucoes }
```

```java
Function<Integer, Integer> dobro = x -> x * 2;
BiFunction<Integer, Integer, Integer> soma = (a, b) -> a + b;
Runnable ola = () -> System.out.println("Olá!");
Predicate<String> longo = s -> {
    int tamanho = s.length();
    return tamanho > 5;
};

System.out.println(dobro.apply(4));        // 8
System.out.println(soma.apply(2, 3));      // 5
ola.run();                                 // Olá!
System.out.println(longo.test("Java"));    // false
```

- Com um parâmetro só, os parênteses são opcionais: `x -> x * 2`.
- Sem parâmetros, use `()`.
- Com um bloco `{ }`, é preciso `return` quando a lambda devolve algo.

## Interfaces funcionais

Toda lambda implementa uma **interface funcional**: uma interface com **exatamente um método abstrato** (métodos `default` e `static` não contam). O pacote `java.util.function` traz as mais usadas:

| Interface | Recebe | Devolve | Método |
|---|---|---|---|
| `Predicate<T>` | um `T` | `boolean` | `test` |
| `Function<T, R>` | um `T` | um `R` | `apply` |
| `Consumer<T>` | um `T` | nada | `accept` |
| `Supplier<T>` | nada | um `T` | `get` |
| `BiFunction<T, U, R>` | um `T` e um `U` | um `R` | `apply` |

Interfaces mais antigas também são funcionais, como `Runnable` (`run`) e `Comparator` (`compare`). Você pode criar a sua; a anotação `@FunctionalInterface` pede ao compilador que confira se ela tem um só método abstrato:

```java
@FunctionalInterface
interface Operacao {
    int aplicar(int a, int b);
}

Operacao multiplicar = (a, b) -> a * b;
System.out.println(multiplicar.aplicar(3, 4));   // 12
```

Com dois métodos abstratos, o `javac` recusa a anotação: *Unexpected @FunctionalInterface annotation*.

## Referências de método

Quando a lambda só chama um método que já existe, dá para escrever mais curto, com `::`:

| Lambda | Referência de método |
|---|---|
| `s -> s.toUpperCase()` | `String::toUpperCase` |
| `x -> System.out.println(x)` | `System.out::println` |
| `s -> Integer.parseInt(s)` | `Integer::parseInt` |
| `() -> new ArrayList<>()` | `ArrayList::new` |

## Variáveis de fora da lambda

Uma lambda pode **ler** as variáveis locais do método em que foi escrita, desde que sejam `final` ou **efetivamente finais** (nunca reatribuídas):

```java
int limite = 3;
Predicate<String> curto = s -> s.length() <= limite;   // ok: limite nunca muda
System.out.println(curto.test("Ana"));                 // true

int total = 0;
List.of(1, 2, 3).forEach(n -> total += n);
// não compila: local variables referenced from a lambda expression must be final or effectively final
```

Para somar, use um stream (próxima aula): `int total = List.of(1, 2, 3).stream().mapToInt(n -> n).sum();`.
````

`content/java/07-java-moderno/02-streams.md`:
````markdown
# Streams

Um **stream** (Java 8+) processa uma sequência de dados em etapas, como uma linha de montagem. Em vez de escrever o laço, você descreve **o que** quer:

```java
List<Integer> numeros = List.of(5, 2, 8, 1, 9);

List<Integer> resultado = numeros.stream()   // origem
    .filter(n -> n > 3)                       // fica com os maiores que 3
    .map(n -> n * 10)                         // multiplica cada um por 10
    .sorted()                                 // ordena
    .toList();                                // operação terminal

System.out.println(resultado);   // [50, 80, 90]
```

Todo stream tem três partes:

1. **Origem:** `lista.stream()`, `Stream.of(...)` ou `Arrays.stream(array)`.
2. **Operações intermediárias:** cada uma transforma o stream e devolve outro stream.
3. **Uma operação terminal:** produz o resultado e encerra o stream.

> [!NOTE]
> `toList()` é do Java 16+. Em versões anteriores, use `.collect(Collectors.toList())`. A lista devolvida por `toList()` não pode ser alterada.

## Operações intermediárias

| Operação | O que faz |
|---|---|
| `filter(p)` | fica só com os elementos em que `p` dá `true` |
| `map(f)` | transforma cada elemento com `f` |
| `sorted()` ou `sorted(comparador)` | ordena |
| `distinct()` | tira os repetidos |
| `limit(n)` | fica com os `n` primeiros |
| `skip(n)` | pula os `n` primeiros |

## Operações terminais

| Operação | Resultado |
|---|---|
| `toList()` | uma lista |
| `count()` | quantos elementos há (um `long`) |
| `forEach(acao)` | executa a ação em cada elemento |
| `anyMatch(p)`, `allMatch(p)`, `noneMatch(p)` | `true` ou `false` |
| `findFirst()` | o primeiro elemento, dentro de um `Optional` |
| `collect(...)` | junta os elementos de outras formas (veja abaixo) |

## Números: `mapToInt`, `sum` e `average`

```java
int soma = numeros.stream().mapToInt(Integer::intValue).sum();          // 25
double media = numeros.stream().mapToInt(n -> n).average().orElse(0);  // 5.0
```

`mapToInt` gera um `IntStream`, que tem métodos numéricos como `sum()`, `average()`, `max()` e `min()`. Como um stream vazio não tem média, `average()` devolve um `OptionalDouble`, e o `orElse(0)` dá o valor para esse caso.

## `collect`: juntar e agrupar

```java
List<String> nomes = List.of("Ana", "Bia", "Caio", "Davi", "Eva");

String juntos = nomes.stream().collect(Collectors.joining(", "));
System.out.println(juntos);       // Ana, Bia, Caio, Davi, Eva

Map<Integer, List<String>> porTamanho = nomes.stream()
    .collect(Collectors.groupingBy(String::length));
System.out.println(porTamanho);   // {3=[Ana, Bia, Eva], 4=[Caio, Davi]}
```

`groupingBy` monta um mapa: a chave é o resultado da função (aqui, o tamanho do nome) e o valor é a lista dos elementos com aquela chave. O mapa é um `HashMap`, então a ordem das chaves não é garantida.

## Dois cuidados

> [!IMPORTANT]
> As operações intermediárias são **preguiçosas**: nada roda até aparecer uma operação terminal. Um stream sem operação terminal não faz nada.

> [!CAUTION]
> Um stream só pode ser usado **uma vez**. Depois da operação terminal, usá-lo de novo lança `IllegalStateException`: *stream has already been operated upon or closed*. Para percorrer de novo, crie outro com `lista.stream()`.
````

`content/java/07-java-moderno/03-optional.md`:
````markdown
# Optional

Muitos métodos podem não ter o que devolver: buscar um cliente que não existe, pegar o primeiro elemento de uma lista vazia. Devolver `null` é perigoso, porque quem chama pode esquecer de conferir e levar um `NullPointerException`. O **`Optional`** (Java 8+) é uma caixa que **pode** ter um valor, e o tipo deixa isso claro para quem chama.

```java
static Optional<String> buscarEmail(String nome) {
    if ("Ana".equals(nome)) {
        return Optional.of("ana@exemplo.com");
    }
    return Optional.empty();
}
```

## Criando

| Forma | Quando usar |
|---|---|
| `Optional.of(valor)` | o valor com certeza não é `null` (se for, lança `NullPointerException`) |
| `Optional.ofNullable(valor)` | o valor pode ser `null` (nesse caso, o `Optional` fica vazio) |
| `Optional.empty()` | não há valor |

## Usando

```java
Optional<String> email = buscarEmail("Ana");
Optional<String> nada = buscarEmail("Zé");

System.out.println(email.isPresent());                            // true
System.out.println(nada.isEmpty());                               // true (Java 11+)
System.out.println(nada.orElse("sem e-mail"));                    // sem e-mail
System.out.println(email.map(String::toUpperCase).orElse("?"));   // ANA@EXEMPLO.COM
email.ifPresent(e -> System.out.println("Enviando para " + e));   // Enviando para ana@exemplo.com
```

- `orElse(padrao)`: o valor, ou o padrão se estiver vazio.
- `orElseThrow()` (Java 10+): o valor, ou lança `NoSuchElementException` se estiver vazio.
- `map(f)`: transforma o valor, se houver; vazio continua vazio.
- `ifPresent(acao)`: executa a ação só se houver valor.

> [!WARNING]
> `get()` também devolve o valor, mas lança `NoSuchElementException` (*No value present*) se o `Optional` estiver vazio. Prefira `orElse` ou `orElseThrow`, que deixam claro o que acontece no caso vazio.

> [!TIP]
> Use `Optional` como **retorno** de métodos. Em atributos e parâmetros, ele costuma complicar mais do que ajudar.
````

`content/java/07-java-moderno/04-var-e-text-blocks.md`:
````markdown
# var e text blocks

## `var`: o compilador descobre o tipo (Java 10+)

```java
var nome = "Ana";                                  // String
var idade = 30;                                    // int
var notas = new ArrayList<Double>();               // ArrayList<Double>
var mapa = new HashMap<String, List<Integer>>();   // HashMap<String, List<Integer>>
```

O tipo continua **fixo**: `var` só poupa você de escrevê-lo. Depois de `var idade = 30;`, a linha `idade = "trinta";` não compila (*incompatible types: String cannot be converted to int*).

Regras:

- Só para **variáveis locais** (dentro de métodos), inclusive no `for`: `for (var i = 0; i < 3; i++)`. Atributos e parâmetros de método não aceitam `var`.
- A variável precisa de **valor inicial**: `var x;` não compila.
- O valor inicial não pode ser só `null`: `var x = null;` não compila, porque `null` não diz qual é o tipo.

> [!TIP]
> Use `var` quando o tipo fica óbvio pelo lado direito, como em `var lista = new ArrayList<String>();`. Se quem lê precisar adivinhar o tipo, escreva o tipo.

## Text blocks: textos de várias linhas (Java 15+)

```java
String json = """
    {
      "nome": "Ana",
      "idade": 30
    }
    """;
System.out.print(json);
```

Saída:

```text
{
  "nome": "Ana",
  "idade": 30
}
```

- O texto começa na linha **seguinte** às aspas de abertura `"""`.
- O recuo comum a todas as linhas (contando a linha das aspas de fechamento) é removido; o recuo **a mais** fica.
- Aspas comuns dentro do texto não precisam de `\"`.
- Como o `"""` de fechamento está numa linha própria, o texto termina com uma quebra de linha.
````

`content/java/07-java-moderno/05-records.md`:
````markdown
# Records

Muitas classes só carregam dados: um ponto, um produto, uma pessoa. Escrever construtor, getters, `equals`, `hashCode` e `toString` para cada uma dá trabalho. O **record** (Java 16+) gera tudo isso numa linha:

```java
record Ponto(int x, int y) {}
```

```java
Ponto p = new Ponto(3, 4);
System.out.println(p.x());                       // 3
System.out.println(p);                           // Ponto[x=3, y=4]
System.out.println(p.equals(new Ponto(3, 4)));   // true
```

O record gera:

- um construtor com todos os componentes, na ordem em que foram declarados;
- um método de acesso para cada componente, com o **mesmo nome**: `x()` e `y()` (não `getX()`);
- `equals` e `hashCode` que comparam os valores;
- um `toString` legível.

## Imutável

Os componentes viram atributos `private final`. Não há setters, e `p.x = 10` não compila (*x has private access in Ponto*). Para "mudar", crie outro: `new Ponto(10, p.y())`.

## Validando no construtor compacto

```java
record Idade(int valor) {
    Idade {                                   // construtor compacto: sem a lista de parâmetros
        if (valor < 0) {
            throw new IllegalArgumentException("idade negativa: " + valor);
        }
    }
}

new Idade(30);    // ok
new Idade(-1);    // lança IllegalArgumentException: idade negativa: -1
```

O construtor compacto roda antes de os valores serem guardados nos atributos. É o lugar certo para validar.

## Métodos e interfaces

Um record pode ter métodos (inclusive `static`) e implementar interfaces:

```java
record Retangulo(double largura, double altura) {
    double area() {
        return largura * altura;
    }
}

System.out.println(new Retangulo(2, 3).area());   // 6.0
```

> [!NOTE]
> Um record não pode estender outra classe (ele já estende `java.lang.Record`) nem declarar atributos de instância além dos componentes: um atributo `int z;` no corpo dá *field declaration must be static*.
````

`content/java/07-java-moderno/06-switch-e-pattern-matching.md`:
````markdown
# switch moderno e pattern matching

## `switch` como expressão (Java 14+)

No módulo Fundamentos você viu o `switch` com seta, que devolve um valor. Mais três detalhes:

```java
int dia = 3;
String tipo = switch (dia) {
    case 1, 7 -> "fim de semana";              // vários valores num case
    case 2, 3, 4, 5, 6 -> {
        String t = "dia útil";
        yield t;                                // devolve o valor de um bloco
    }
    default -> throw new IllegalArgumentException("dia inválido: " + dia);
};
System.out.println(tipo);   // dia útil
```

- `case 1, 7 ->` junta vários valores num só `case`.
- Dentro de um bloco `{ }`, quem devolve o valor é o `yield`. Um `return` ali não compila: *attempt to return out of a switch expression*.
- Um `switch` usado como expressão precisa cobrir **todos** os valores possíveis. Com `int`, isso exige um `default`; sem ele, o `javac` acusa *the switch expression does not cover all possible input values*.

## Pattern matching no `instanceof` (Java 16+)

Antes, testar o tipo e converter eram duas etapas:

```java
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.length());
}
```

Agora o teste já cria a variável:

```java
if (obj instanceof String s) {
    System.out.println(s.length());
}

if (obj instanceof String s && s.length() > 3) {   // s já vale depois do &&
    System.out.println(s.toUpperCase());
}
```

## Padrões no `switch` (Java 21)

O `switch` aceita qualquer objeto e escolhe o `case` pelo **tipo**. Com `when`, o `case` ganha uma condição extra:

```java
static String descrever(Object o) {
    return switch (o) {
        case null -> "nulo";
        case Integer i when i > 0 -> "inteiro positivo: " + i;
        case Integer i -> "inteiro: " + i;
        case String s -> "texto com " + s.length() + " letras";
        default -> "outra coisa";
    };
}

System.out.println(descrever(5));      // inteiro positivo: 5
System.out.println(descrever(-2));     // inteiro: -2
System.out.println(descrever("oi"));   // texto com 2 letras
System.out.println(descrever(3.5));    // outra coisa
System.out.println(descrever(null));   // nulo
```

- Os `case` são testados de cima para baixo. Um `case` mais genérico antes de um mais específico não compila: com `case CharSequence cs` antes de `case String s`, o `javac` acusa *this case label is dominated by a preceding case label*.
- Sem `case null`, um `switch` sobre `null` lança `NullPointerException`.

## `sealed`: o compilador conhece todos os casos

Uma interface (ou classe) `sealed` (Java 17+) lista quem pode implementá-la. Com isso, um `switch` de padrões sabe quando cobriu todos os casos e dispensa o `default`:

```java
sealed interface Forma permits Circulo, Quadrado {}
record Circulo(double raio) implements Forma {}
record Quadrado(double lado) implements Forma {}

static double area(Forma f) {
    return switch (f) {
        case Circulo c -> Math.PI * c.raio() * c.raio();
        case Quadrado q -> q.lado() * q.lado();
    };   // sem default: os dois case cobrem todas as formas
}
```

Se alguém acrescentar uma forma nova ao `permits` e esquecer de tratá-la, o `switch` deixa de compilar, em vez de falhar com o programa já rodando.

## Padrões de record (Java 21)

Um padrão pode "abrir" um record e pegar os componentes direto:

```java
record Ponto(int x, int y) {}

static String onde(Object o) {
    return switch (o) {
        case Ponto(int x, int y) when x == 0 && y == 0 -> "na origem";
        case Ponto(int x, int y) -> "em (" + x + ", " + y + ")";
        default -> "não é um ponto";
    };
}

System.out.println(onde(new Ponto(0, 0)));   // na origem
System.out.println(onde(new Ponto(2, 5)));   // em (2, 5)
```

O mesmo vale no `instanceof`: `if (o instanceof Ponto(int x, int y)) { ... }`.
````

- [ ] **Step 3: Escrever perguntas e cartas**

`content/java/07-java-moderno/questions.json`:
```json
{
  "questions": [
    {
      "id": "java.java-moderno.q01", "type": "multiple", "difficulty": 1, "lesson": "lambdas",
      "prompt": "Qual destas é uma lambda Java válida que recebe um número e devolve o dobro?",
      "options": ["`x -> x * 2`", "`x => x * 2`", "`x : x * 2`", "`lambda x: x * 2`"], "answer": 0,
      "explanation": "Em Java, a seta da lambda é `->`. A forma `=>` é de JavaScript e C#, e `lambda x:` é de Python."
    },
    {
      "id": "java.java-moderno.q02", "type": "truefalse", "difficulty": 2, "lesson": "lambdas",
      "prompt": "Uma interface funcional tem exatamente um método abstrato.",
      "answer": true,
      "explanation": "É isso que permite usar uma lambda no lugar dela: a lambda vira a implementação desse único método. Métodos `default` e `static` não contam."
    },
    {
      "id": "java.java-moderno.q03", "type": "multiple", "difficulty": 3, "lesson": "lambdas",
      "prompt": "O que acontece ao compilar este trecho?\n\n```java\nint total = 0;\nList.of(1, 2, 3).forEach(n -> total += n);\n```",
      "options": ["Erro de compilação: a lambda não pode alterar `total`", "Compila, e `total` termina valendo 6", "Compila, e `total` continua valendo 0", "Compila, mas lança exceção ao executar"], "answer": 0,
      "explanation": "Variáveis locais usadas numa lambda precisam ser `final` ou efetivamente finais. O `javac` acusa *local variables referenced from a lambda expression must be final or effectively final*. Para somar, use `stream().mapToInt(n -> n).sum()`."
    },
    {
      "id": "java.java-moderno.q04", "type": "fill", "difficulty": 2, "lesson": "lambdas",
      "prompt": "Complete com a referência de método equivalente a `s -> s.toUpperCase()`:",
      "code": "List<String> grandes = nomes.stream().map(String::___).toList();",
      "blanks": [["toUpperCase"]],
      "explanation": "`String::toUpperCase` chama `toUpperCase()` em cada elemento, como a lambda `s -> s.toUpperCase()`."
    },
    {
      "id": "java.java-moderno.q05", "type": "multiple", "difficulty": 1, "lesson": "lambdas",
      "prompt": "Qual interface funcional representa uma função que recebe um valor e devolve `true` ou `false`?",
      "options": ["`Predicate<T>`", "`Supplier<T>`", "`Consumer<T>`", "`Runnable`"], "answer": 0,
      "explanation": "`Predicate<T>` tem o método `boolean test(T t)`. `Supplier` não recebe nada e devolve um valor, `Consumer` recebe e não devolve nada, e `Runnable` não recebe nem devolve."
    },
    {
      "id": "java.java-moderno.q06", "type": "multiple", "difficulty": 2, "lesson": "streams",
      "prompt": "O que este código imprime?\n\n```java\nList<Integer> numeros = List.of(5, 2, 8, 1, 9);\nList<Integer> r = numeros.stream()\n    .filter(n -> n > 3)\n    .map(n -> n * 10)\n    .sorted()\n    .toList();\nSystem.out.println(r);\n```",
      "options": ["[50, 80, 90]", "[5, 8, 9]", "[90, 80, 50]", "[10, 20, 50, 80, 90]"], "answer": 0,
      "explanation": "`filter` fica com 5, 8 e 9; `map` multiplica cada um por 10; `sorted` ordena; `toList` gera a lista."
    },
    {
      "id": "java.java-moderno.q07", "type": "truefalse", "difficulty": 2, "lesson": "streams",
      "prompt": "Um mesmo stream pode ser usado duas vezes, por exemplo, chamando `count()` e depois `toList()` nele.",
      "answer": false,
      "explanation": "Depois da operação terminal, o stream está consumido. Usá-lo de novo lança `IllegalStateException: stream has already been operated upon or closed`. Crie outro com `lista.stream()`."
    },
    {
      "id": "java.java-moderno.q08", "type": "fill", "difficulty": 2, "lesson": "streams",
      "prompt": "Complete para somar os números de `numeros`, uma `List<Integer>`:",
      "code": "int soma = numeros.stream().mapToInt(Integer::intValue).___();",
      "blanks": [["sum"]],
      "explanation": "`mapToInt` gera um `IntStream`, que tem `sum()`. `count()` devolveria quantos elementos há, e não a soma."
    },
    {
      "id": "java.java-moderno.q09", "type": "multiple", "difficulty": 3, "lesson": "streams",
      "prompt": "O que este trecho imprime?\n\n```java\nStream.of(\"a\", \"b\", \"c\")\n    .peek(s -> System.out.print(s))\n    .filter(s -> !s.equals(\"b\"));\n```",
      "options": ["Nada", "abc", "ac", "Erro de compilação"], "answer": 0,
      "explanation": "Operações intermediárias, como `peek` e `filter`, são preguiçosas: só rodam quando aparece uma operação terminal (`toList`, `count`, `forEach`...). Sem ela, nada acontece."
    },
    {
      "id": "java.java-moderno.q10", "type": "multiple", "difficulty": 2, "lesson": "streams",
      "prompt": "O que `Stream.of(\"a\", \"b\", \"c\").collect(Collectors.joining(\", \"))` devolve?",
      "options": ["a, b, c", "[a, b, c]", "abc", "a, b, c, "], "answer": 0,
      "explanation": "`joining(\", \")` junta os textos e coloca o separador só **entre** eles."
    },
    {
      "id": "java.java-moderno.q11", "type": "order", "difficulty": 2, "lesson": "streams",
      "prompt": "Monte o pipeline que, **nesta ordem**: cria o stream de `numeros`, fica com os maiores que 3, multiplica cada um por 10, ordena, pega os 2 primeiros e gera a lista.",
      "lines": ["List<Integer> r = numeros.stream()", "    .filter(n -> n > 3)", "    .map(n -> n * 10)", "    .sorted()", "    .limit(2)", "    .toList();"],
      "explanation": "Cada etapa é uma operação intermediária encadeada com `.`; a última, `toList()`, é a terminal. Com `numeros = List.of(5, 2, 8, 1, 9)`, o resultado é `[50, 80]`."
    },
    {
      "id": "java.java-moderno.q12", "type": "multiple", "difficulty": 1, "lesson": "optional",
      "prompt": "O que este trecho imprime?\n\n```java\nOptional<String> vazio = Optional.empty();\nSystem.out.println(vazio.orElse(\"padrão\"));\n```",
      "options": ["padrão", "null", "Optional.empty", "Lança `NoSuchElementException`"], "answer": 0,
      "explanation": "`orElse` devolve o valor guardado ou, se o `Optional` estiver vazio, o padrão informado."
    },
    {
      "id": "java.java-moderno.q13", "type": "truefalse", "difficulty": 2, "lesson": "optional",
      "prompt": "`Optional.of(null)` cria um `Optional` vazio.",
      "answer": false,
      "explanation": "`Optional.of` exige um valor não nulo e lança `NullPointerException` com `null`. Para um valor que pode ser `null`, use `Optional.ofNullable`."
    },
    {
      "id": "java.java-moderno.q14", "type": "fill", "difficulty": 2, "lesson": "optional",
      "prompt": "Complete para criar um `Optional` a partir de um valor que **pode** ser `null`:",
      "code": "Optional<String> apelido = Optional.___(talvezNulo);",
      "blanks": [["ofNullable"]],
      "explanation": "`ofNullable` devolve um `Optional` vazio quando recebe `null`, e um `Optional` com o valor nos outros casos."
    },
    {
      "id": "java.java-moderno.q15", "type": "multiple", "difficulty": 2, "lesson": "var-e-text-blocks",
      "prompt": "Qual destas declarações **não** compila?",
      "options": ["`var x = null;`", "`var nomes = new ArrayList<String>();`", "`var total = 0;`", "`var texto = \"oi\";`"], "answer": 0,
      "explanation": "Com `var`, o tipo vem do valor inicial, e `null` não diz qual é o tipo: *cannot infer type for local variable x*."
    },
    {
      "id": "java.java-moderno.q16", "type": "truefalse", "difficulty": 1, "lesson": "var-e-text-blocks",
      "prompt": "`var` pode ser usado para declarar atributos de uma classe.",
      "answer": false,
      "explanation": "`var` só vale para variáveis locais (dentro de métodos, inclusive no `for`). Num atributo, o `javac` acusa *'var' is not allowed here*."
    },
    {
      "id": "java.java-moderno.q17", "type": "multiple", "difficulty": 2, "lesson": "var-e-text-blocks",
      "prompt": "Qual é a primeira linha do texto guardado em `json`?\n\n```java\nString json = \"\"\"\n    {\n      \"nome\": \"Ana\"\n    }\n    \"\"\";\n```",
      "options": ["`{`, sem espaços antes", "Uma linha vazia", "`{`, com quatro espaços antes", "`\"\"\"`"], "answer": 0,
      "explanation": "O texto começa na linha seguinte às aspas de abertura, e o recuo comum a todas as linhas (contando a linha das aspas de fechamento) é removido. Por isso a primeira linha é só `{`."
    },
    {
      "id": "java.java-moderno.q18", "type": "multiple", "difficulty": 1, "lesson": "records",
      "prompt": "Com `record Ponto(int x, int y) {}` e um `Ponto p`, como se lê o valor de `x` fora do record?",
      "options": ["`p.x()`", "`p.getX()`", "`p.x`", "`Ponto.x`"], "answer": 0,
      "explanation": "O record gera um método de acesso com o mesmo nome do componente: `x()`. Não existe `getX()`, e o atributo `x` é `private`, então `p.x` não compila fora do record."
    },
    {
      "id": "java.java-moderno.q19", "type": "truefalse", "difficulty": 2, "lesson": "records",
      "prompt": "Dois records criados com os mesmos valores são iguais para o `equals`.",
      "answer": true,
      "explanation": "O record gera `equals` e `hashCode` que comparam os valores dos componentes: `new Ponto(3, 4).equals(new Ponto(3, 4))` é `true`."
    },
    {
      "id": "java.java-moderno.q20", "type": "multiple", "difficulty": 3, "lesson": "records",
      "prompt": "O que acontece em `new Idade(-1);`?\n\n```java\nrecord Idade(int valor) {\n    Idade {\n        if (valor < 0) {\n            throw new IllegalArgumentException(\"idade negativa\");\n        }\n    }\n}\n```",
      "options": ["Lança `IllegalArgumentException`", "Cria o record com valor -1", "Cria o record com valor 0", "Erro de compilação"], "answer": 0,
      "explanation": "O construtor compacto roda a cada `new`, antes de os valores serem guardados. A validação lança a exceção, e o objeto nem chega a ser criado."
    },
    {
      "id": "java.java-moderno.q21", "type": "multiple", "difficulty": 2, "lesson": "switch-e-pattern-matching",
      "prompt": "O que este trecho imprime?\n\n```java\nObject obj = \"Java\";\nif (obj instanceof String s && s.length() > 3) {\n    System.out.println(s.toUpperCase());\n}\n```",
      "options": ["JAVA", "Java", "Nada é impresso", "Erro de compilação"], "answer": 0,
      "explanation": "`obj instanceof String s` testa o tipo e já cria a variável `s` (Java 16+). Ela pode ser usada depois do `&&`, que só é avaliado se o teste der certo."
    },
    {
      "id": "java.java-moderno.q22", "type": "fill", "difficulty": 2, "lesson": "switch-e-pattern-matching",
      "prompt": "Complete para devolver o valor do bloco dentro do `switch` (Java 14+):",
      "code": "String tipo = switch (dia) {\n    case 1, 7 -> \"fim de semana\";\n    default -> {\n        String t = \"dia útil\";\n        ___ t;\n    }\n};",
      "blanks": [["yield"]],
      "explanation": "Num bloco `{ }` dentro de um `switch` usado como expressão, quem devolve o valor é o `yield`. Um `return` ali não compila: *attempt to return out of a switch expression*."
    },
    {
      "id": "java.java-moderno.q23", "type": "multiple", "difficulty": 3, "lesson": "switch-e-pattern-matching",
      "prompt": "Este `switch` não tem `default`. O que acontece ao compilar?\n\n```java\nsealed interface Forma permits Circulo, Quadrado {}\nrecord Circulo(double raio) implements Forma {}\nrecord Quadrado(double lado) implements Forma {}\n\nstatic String nome(Forma f) {\n    return switch (f) {\n        case Circulo c -> \"círculo\";\n        case Quadrado q -> \"quadrado\";\n    };\n}\n```",
      "options": ["Compila: como `Forma` é `sealed`, os dois `case` cobrem todos os casos", "Não compila: todo `switch` que devolve valor precisa de `default`", "Compila, mas lança exceção quando `f` é um `Circulo`", "Não compila: o `switch` não aceita interfaces"], "answer": 0,
      "explanation": "Uma interface `sealed` lista todas as implementações possíveis. O compilador confere que `Circulo` e `Quadrado` cobrem todas, então o `default` é dispensável."
    },
    {
      "id": "java.java-moderno.q24", "type": "multiple", "difficulty": 3, "lesson": "switch-e-pattern-matching",
      "prompt": "O que acontece ao compilar este método?\n\n```java\nstatic String descrever(Object o) {\n    return switch (o) {\n        case CharSequence cs -> \"texto\";\n        case String s -> \"string\";\n        default -> \"outro\";\n    };\n}\n```",
      "options": ["Erro de compilação: o `case String` nunca seria alcançado", "Compila, e devolve \"string\" para qualquer `String`", "Compila, e devolve \"texto\" para qualquer `String`", "Compila, mas lança exceção ao executar"], "answer": 0,
      "explanation": "`String` é uma `CharSequence`, então o primeiro `case` já pegaria todas as Strings. O `javac` acusa *this case label is dominated by a preceding case label*. Coloque o `case` mais específico primeiro."
    },
    {
      "id": "java.java-moderno.q25", "type": "truefalse", "difficulty": 2, "lesson": "switch-e-pattern-matching",
      "prompt": "No Java 21, um `case` de `switch` pode ter uma condição extra com `when`, como em `case Integer i when i > 0 ->`.",
      "answer": true,
      "explanation": "A guarda `when` só deixa o `case` valer se a condição for verdadeira; senão, o `switch` continua tentando os `case` seguintes."
    }
  ]
}
```

`content/java/07-java-moderno/flashcards.json`:
```json
{
  "cards": [
    { "id": "java.java-moderno.f01", "lesson": "lambdas", "front": "O que é uma lambda?", "back": "Uma função curta, sem nome, que pode ser passada como valor: `(parâmetros) -> expressão` ou `(parâmetros) -> { instruções }`." },
    { "id": "java.java-moderno.f02", "lesson": "lambdas", "front": "O que é uma interface funcional?", "back": "Uma interface com exatamente um método abstrato, como `Predicate`, `Function`, `Consumer`, `Supplier` e `Comparator`. Toda lambda implementa uma." },
    { "id": "java.java-moderno.f03", "lesson": "lambdas", "front": "O que fazem `Predicate`, `Function`, `Consumer` e `Supplier`?", "back": "`Predicate<T>`: recebe T e devolve boolean. `Function<T, R>`: recebe T e devolve R. `Consumer<T>`: recebe T e não devolve nada. `Supplier<T>`: não recebe nada e devolve T." },
    { "id": "java.java-moderno.f04", "lesson": "lambdas", "front": "O que é uma referência de método?", "back": "Um atalho para uma lambda que só chama um método: `String::toUpperCase` equivale a `s -> s.toUpperCase()`, e `System.out::println` a `x -> System.out.println(x)`." },
    { "id": "java.java-moderno.f05", "lesson": "lambdas", "front": "Que variáveis locais uma lambda pode usar?", "back": "Só as `final` ou efetivamente finais, isto é, que nunca são reatribuídas." },
    { "id": "java.java-moderno.f06", "lesson": "streams", "front": "Quais são as partes de um stream?", "back": "Origem (`lista.stream()`), operações intermediárias (`filter`, `map`, `sorted`...) e uma operação terminal (`toList`, `count`, `forEach`, `collect`...)." },
    { "id": "java.java-moderno.f07", "lesson": "streams", "front": "Por que nada acontece num stream sem operação terminal?", "back": "As operações intermediárias são preguiçosas: só rodam quando uma operação terminal pede o resultado." },
    { "id": "java.java-moderno.f08", "lesson": "streams", "front": "Um stream pode ser usado duas vezes?", "back": "Não. Depois da operação terminal ele está consumido, e usá-lo de novo lança `IllegalStateException`." },
    { "id": "java.java-moderno.f09", "lesson": "optional", "front": "Para que serve o `Optional`?", "back": "Para representar um valor que pode estar ausente sem usar `null`. Use `orElse`, `orElseThrow`, `ifPresent` e `map` para lidar com ele." },
    { "id": "java.java-moderno.f10", "lesson": "optional", "front": "Qual a diferença entre `Optional.of` e `Optional.ofNullable`?", "back": "`of(x)` exige `x` não nulo e lança `NullPointerException` com `null`. `ofNullable(x)` aceita `null` e devolve um `Optional` vazio." },
    { "id": "java.java-moderno.f11", "lesson": "var-e-text-blocks", "front": "Onde `var` pode ser usado?", "back": "Em variáveis locais com valor inicial (Java 10+). Não vale para atributos, parâmetros de método nem `var x = null;`." },
    { "id": "java.java-moderno.f12", "lesson": "var-e-text-blocks", "front": "O que é um text block?", "back": "Um texto de várias linhas entre `\"\"\"` (Java 15+). O recuo comum é removido, e as aspas comuns não precisam de escape." },
    { "id": "java.java-moderno.f13", "lesson": "records", "front": "O que um `record` gera automaticamente?", "back": "Construtor, um método de acesso com o nome de cada componente (`p.x()`), `equals`, `hashCode` e `toString`. Os componentes são `private final` (Java 16+)." },
    { "id": "java.java-moderno.f14", "lesson": "switch-e-pattern-matching", "front": "O que faz `obj instanceof String s`?", "back": "Testa o tipo e, se der certo, já cria a variável `s` do tipo `String` (Java 16+), sem cast manual." },
    { "id": "java.java-moderno.f15", "lesson": "switch-e-pattern-matching", "front": "O que é uma interface `sealed`?", "back": "Uma interface que lista quem pode implementá-la (`permits`, Java 17+). Um `switch` que cobre todos os tipos permitidos não precisa de `default`." },
    { "id": "java.java-moderno.f16", "lesson": "switch-e-pattern-matching", "front": "Para que serve o `yield`?", "back": "Para devolver o valor de um bloco `{ }` dentro de um `switch` usado como expressão." }
  ]
}
```

- [ ] **Step 4: Rodar o validador**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Escrever os trechos de conferência**

Aula `lambdas`:

`verify/java/java-moderno/aula-lambdas.java`:
```java
// verifica: q01, f01 e a aula lambdas (um, dois e nenhum parâmetro; lambda com bloco)
// saida:
// 8
// 5
// Olá!
// false
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.function.Predicate;

class Main {
    public static void main(String[] args) {
        Function<Integer, Integer> dobro = x -> x * 2;
        BiFunction<Integer, Integer, Integer> soma = (a, b) -> a + b;
        Runnable ola = () -> System.out.println("Olá!");
        Predicate<String> longo = s -> {
            int tamanho = s.length();
            return tamanho > 5;
        };

        System.out.println(dobro.apply(4));
        System.out.println(soma.apply(2, 3));
        ola.run();
        System.out.println(longo.test("Java"));
    }
}
```

`verify/java/java-moderno/aula-interfaces-funcionais.java`:
```java
// verifica: q05, f03 e a tabela da aula lambdas (test, apply, accept e get)
// saida:
// true
// 3
// Oi, Ana
// 42
// 5
import java.util.function.BiFunction;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.function.Supplier;

class Main {
    public static void main(String[] args) {
        Predicate<String> vazio = s -> s.isEmpty();
        Function<String, Integer> tamanho = s -> s.length();
        Consumer<String> saudar = nome -> System.out.println("Oi, " + nome);
        Supplier<Integer> resposta = () -> 42;
        BiFunction<Integer, Integer, Integer> soma = (a, b) -> a + b;

        System.out.println(vazio.test(""));
        System.out.println(tamanho.apply("Ana"));
        saudar.accept("Ana");
        System.out.println(resposta.get());
        System.out.println(soma.apply(2, 3));
    }
}
```

`verify/java/java-moderno/aula-functional-interface.java`:
```java
// verifica: q02, f02 e a aula lambdas (interface própria; um método default não conta)
// saida:
// 12
// 25
class Main {
    public static void main(String[] args) {
        Operacao multiplicar = (a, b) -> a * b;
        System.out.println(multiplicar.aplicar(3, 4));
        System.out.println(multiplicar.dobro(5));
    }
}

@FunctionalInterface
interface Operacao {
    int aplicar(int a, int b);

    default int dobro(int a) {
        return aplicar(a, a);
    }
}
```

`verify/java/java-moderno/aula-functional-interface-erro.java`:
```java
// verifica: q02 e a aula lambdas (@FunctionalInterface com dois métodos abstratos)
// espera: erro-de-compilacao
// erro-contem: Unexpected @FunctionalInterface annotation
class Main {
    public static void main(String[] args) {
    }
}

@FunctionalInterface
interface Operacao {
    int aplicar(int a, int b);

    int desfazer(int a, int b);
}
```

`verify/java/java-moderno/aula-referencias-metodo.java`:
```java
// verifica: f04 e a tabela da aula lambdas (cada referência de método equivale à lambda)
// saida:
// OI OI
// linha 1
// linha 2
// 15
// true true
import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.function.Supplier;

class Main {
    public static void main(String[] args) {
        Function<String, String> f1 = s -> s.toUpperCase();
        Function<String, String> f2 = String::toUpperCase;
        System.out.println(f1.apply("oi") + " " + f2.apply("oi"));

        Consumer<String> c1 = x -> System.out.println(x);
        Consumer<String> c2 = System.out::println;
        c1.accept("linha 1");
        c2.accept("linha 2");

        Function<String, Integer> p1 = s -> Integer.parseInt(s);
        Function<String, Integer> p2 = Integer::parseInt;
        System.out.println(p1.apply("7") + p2.apply("8"));

        Supplier<List<String>> n1 = () -> new ArrayList<>();
        Supplier<List<String>> n2 = ArrayList::new;
        System.out.println(n1.get().isEmpty() + " " + n2.get().isEmpty());
    }
}
```

`verify/java/java-moderno/q03-efetivamente-final.java`:
```java
// verifica: java.java-moderno.q03, f05 e a aula lambdas (a lambda não altera variável local)
// espera: erro-de-compilacao
// erro-contem: local variables referenced from a lambda expression must be final or effectively final
import java.util.List;

class Main {
    public static void main(String[] args) {
        int total = 0;
        List.of(1, 2, 3).forEach(n -> total += n);
    }
}
```

`verify/java/java-moderno/aula-lambda-le-variavel.java`:
```java
// verifica: f05 e a aula lambdas (ler variável efetivamente final; somar com stream)
// saida:
// true
// 6
import java.util.List;
import java.util.function.Predicate;

class Main {
    public static void main(String[] args) {
        int limite = 3;
        Predicate<String> curto = s -> s.length() <= limite;
        System.out.println(curto.test("Ana"));

        int total = List.of(1, 2, 3).stream().mapToInt(n -> n).sum();
        System.out.println(total);
    }
}
```

`verify/java/java-moderno/q04-method-ref.java`:
```java
// verifica: java.java-moderno.q04 (String::toUpperCase no map)
// saida:
// [ANA, BIA]
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = List.of("ana", "bia");
        List<String> grandes = nomes.stream().map(String::toUpperCase).toList();
        System.out.println(grandes);
    }
}
```

Aula `streams`:

`verify/java/java-moderno/aula-stream-pipeline.java`:
```java
// verifica: q06, f06 e a aula streams (o pipeline com toList e com collect)
// saida:
// [50, 80, 90]
// [50, 80, 90]
import java.util.List;
import java.util.stream.Collectors;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(5, 2, 8, 1, 9);
        List<Integer> resultado = numeros.stream()
            .filter(n -> n > 3)
            .map(n -> n * 10)
            .sorted()
            .toList();
        System.out.println(resultado);

        List<Integer> antigo = numeros.stream()
            .filter(n -> n > 3)
            .map(n -> n * 10)
            .sorted()
            .collect(Collectors.toList());
        System.out.println(antigo);
    }
}
```

`verify/java/java-moderno/aula-tolist-imutavel.java`:
```java
// verifica: a nota da aula streams (a lista de toList não pode ser alterada)
// espera: excecao UnsupportedOperationException
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> r = List.of(1, 2).stream().toList();
        r.add(3);
    }
}
```

`verify/java/java-moderno/q11-pipeline-ordem.java`:
```java
// verifica: java.java-moderno.q11 (a ordem montada dá [50, 80])
// saida:
// [50, 80]
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(5, 2, 8, 1, 9);
        List<Integer> r = numeros.stream()
            .filter(n -> n > 3)
            .map(n -> n * 10)
            .sorted()
            .limit(2)
            .toList();
        System.out.println(r);
    }
}
```

`verify/java/java-moderno/aula-intermediarias.java`:
```java
// verifica: a tabela de operações intermediárias da aula streams
// saida:
// [4, 1, 3, 2]
// [4, 1]
// [2, 1]
// [4, 4, 3, 2, 1, 1]
import java.util.Comparator;
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(4, 1, 4, 3, 2, 1);
        System.out.println(numeros.stream().distinct().toList());
        System.out.println(numeros.stream().limit(2).toList());
        System.out.println(numeros.stream().skip(4).toList());
        System.out.println(numeros.stream().sorted(Comparator.reverseOrder()).toList());
    }
}
```

`verify/java/java-moderno/aula-terminais.java`:
```java
// verifica: a tabela de operações terminais da aula streams
// saida:
// 2
// true
// false
// true
// Optional[Ana]
// Ana Bia Caio
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Bia", "Caio");
        System.out.println(nomes.stream().filter(n -> n.length() == 3).count());
        System.out.println(nomes.stream().anyMatch(n -> n.startsWith("C")));
        System.out.println(nomes.stream().allMatch(n -> n.length() == 3));
        System.out.println(nomes.stream().noneMatch(n -> n.isEmpty()));
        System.out.println(nomes.stream().findFirst());
        nomes.stream().forEach(n -> System.out.print(n + " "));
    }
}
```

`verify/java/java-moderno/aula-soma-media.java`:
```java
// verifica: java.java-moderno.q08 e a aula streams (mapToInt, sum e average)
// saida:
// 25
// 5.0
import java.util.List;

class Main {
    public static void main(String[] args) {
        List<Integer> numeros = List.of(5, 2, 8, 1, 9);
        int soma = numeros.stream().mapToInt(Integer::intValue).sum();
        double media = numeros.stream().mapToInt(n -> n).average().orElse(0);
        System.out.println(soma);
        System.out.println(media);
    }
}
```

`verify/java/java-moderno/aula-collect.java`:
```java
// verifica: a aula streams (joining e groupingBy; o mapa é impresso em ordem com TreeMap)
// saida:
// Ana, Bia, Caio, Davi, Eva
// {3=[Ana, Bia, Eva], 4=[Caio, Davi]}
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

class Main {
    public static void main(String[] args) {
        List<String> nomes = List.of("Ana", "Bia", "Caio", "Davi", "Eva");
        String juntos = nomes.stream().collect(Collectors.joining(", "));
        System.out.println(juntos);
        Map<Integer, List<String>> porTamanho = nomes.stream()
            .collect(Collectors.groupingBy(String::length));
        System.out.println(new TreeMap<>(porTamanho));
    }
}
```

`verify/java/java-moderno/q10-joining.java`:
```java
// verifica: java.java-moderno.q10 (joining põe o separador só entre os itens)
// saida:
// a, b, c
import java.util.stream.Collectors;
import java.util.stream.Stream;

class Main {
    public static void main(String[] args) {
        System.out.println(Stream.of("a", "b", "c").collect(Collectors.joining(", ")));
    }
}
```

`verify/java/java-moderno/q09-preguicoso.java`:
```java
// verifica: java.java-moderno.q09, f07 e a aula streams (sem operação terminal, nada roda; só o "fim" aparece)
// saida:
// fim
import java.util.stream.Stream;

class Main {
    public static void main(String[] args) {
        Stream.of("a", "b", "c")
            .peek(s -> System.out.print(s))
            .filter(s -> !s.equals("b"));
        System.out.println("fim");
    }
}
```

`verify/java/java-moderno/q07-stream-reuso.java`:
```java
// verifica: java.java-moderno.q07, f08 e a aula streams (stream usado duas vezes)
// espera: excecao IllegalStateException
// erro-contem: stream has already been operated upon or closed
import java.util.List;
import java.util.stream.Stream;

class Main {
    public static void main(String[] args) {
        Stream<Integer> s = List.of(1, 2, 3).stream();
        System.out.println(s.count());
        System.out.println(s.toList());
    }
}
```

Aula `optional`:

`verify/java/java-moderno/aula-optional.java`:
```java
// verifica: f09 e a aula optional (isPresent, isEmpty, orElse, map e ifPresent)
// saida:
// true
// true
// sem e-mail
// ANA@EXEMPLO.COM
// Enviando para ana@exemplo.com
// true
import java.util.Optional;

class Main {
    static Optional<String> buscarEmail(String nome) {
        if ("Ana".equals(nome)) {
            return Optional.of("ana@exemplo.com");
        }
        return Optional.empty();
    }

    public static void main(String[] args) {
        Optional<String> email = buscarEmail("Ana");
        Optional<String> nada = buscarEmail("Zé");

        System.out.println(email.isPresent());
        System.out.println(nada.isEmpty());
        System.out.println(nada.orElse("sem e-mail"));
        System.out.println(email.map(String::toUpperCase).orElse("?"));
        email.ifPresent(e -> System.out.println("Enviando para " + e));
        nada.ifPresent(e -> System.out.println("não deveria aparecer"));
        System.out.println(nada.map(String::toUpperCase).isEmpty());
    }
}
```

`verify/java/java-moderno/q12-orelse.java`:
```java
// verifica: java.java-moderno.q12 (orElse num Optional vazio)
// saida:
// padrão
import java.util.Optional;

class Main {
    public static void main(String[] args) {
        Optional<String> vazio = Optional.empty();
        System.out.println(vazio.orElse("padrão"));
    }
}
```

`verify/java/java-moderno/q13-optional-of-null.java`:
```java
// verifica: java.java-moderno.q13, f10 e a tabela da aula optional (Optional.of recusa null)
// espera: excecao NullPointerException
import java.util.Optional;

class Main {
    public static void main(String[] args) {
        String nome = null;
        Optional<String> o = Optional.of(nome);
        System.out.println(o);
    }
}
```

`verify/java/java-moderno/q14-ofnullable.java`:
```java
// verifica: java.java-moderno.q14 e f10 (ofNullable aceita null e devolve vazio)
// saida:
// true
// Optional[Zé]
import java.util.Optional;

class Main {
    public static void main(String[] args) {
        String talvezNulo = null;
        Optional<String> apelido = Optional.ofNullable(talvezNulo);
        System.out.println(apelido.isEmpty());
        System.out.println(Optional.ofNullable("Zé"));
    }
}
```

`verify/java/java-moderno/aula-optional-get-vazio.java`:
```java
// verifica: o aviso da aula optional (get num Optional vazio)
// espera: excecao NoSuchElementException
// erro-contem: No value present
import java.util.Optional;

class Main {
    public static void main(String[] args) {
        Optional<String> vazio = Optional.empty();
        System.out.println(vazio.get());
    }
}
```

`verify/java/java-moderno/aula-orelsethrow.java`:
```java
// verifica: a aula optional (orElseThrow num Optional vazio)
// espera: excecao NoSuchElementException
import java.util.Optional;

class Main {
    public static void main(String[] args) {
        Optional<String> vazio = Optional.empty();
        System.out.println(vazio.orElseThrow());
    }
}
```

Aula `var-e-text-blocks`:

`verify/java/java-moderno/aula-var.java`:
```java
// verifica: f11 e a aula var-e-text-blocks (tipos inferidos e var no for)
// saida:
// 3
// 31
// ArrayList [9.5]
// {a=[1]}
// volta 0
// volta 1
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

class Main {
    public static void main(String[] args) {
        var nome = "Ana";
        var idade = 30;
        var notas = new ArrayList<Double>();
        var mapa = new HashMap<String, List<Integer>>();
        notas.add(9.5);
        mapa.put("a", List.of(1));
        System.out.println(nome.length());
        System.out.println(idade + 1);
        System.out.println(notas.getClass().getSimpleName() + " " + notas);
        System.out.println(mapa);
        for (var i = 0; i < 2; i++) {
            System.out.println("volta " + i);
        }
    }
}
```

`verify/java/java-moderno/aula-var-tipo-fixo.java`:
```java
// verifica: a aula var-e-text-blocks (o tipo inferido não muda)
// espera: erro-de-compilacao
// erro-contem: incompatible types: String cannot be converted to int
class Main {
    public static void main(String[] args) {
        var idade = 30;
        idade = "trinta";
    }
}
```

`verify/java/java-moderno/q15-var-null.java`:
```java
// verifica: java.java-moderno.q15, f11 e a aula var-e-text-blocks (var x = null não compila)
// espera: erro-de-compilacao
// erro-contem: variable initializer is 'null'
class Main {
    public static void main(String[] args) {
        var x = null;
    }
}
```

`verify/java/java-moderno/aula-var-sem-valor.java`:
```java
// verifica: f11 e a aula var-e-text-blocks (var sem valor inicial não compila)
// espera: erro-de-compilacao
// erro-contem: cannot use 'var' on variable without initializer
class Main {
    public static void main(String[] args) {
        var x;
        x = 1;
    }
}
```

`verify/java/java-moderno/q16-var-atributo.java`:
```java
// verifica: java.java-moderno.q16 e f11 (var não vale para atributos)
// espera: erro-de-compilacao
// erro-contem: 'var' is not allowed here
class Main {
    var contador = 0;

    public static void main(String[] args) {
    }
}
```

`verify/java/java-moderno/aula-var-parametro.java`:
```java
// verifica: f11 e a aula var-e-text-blocks (var não vale para parâmetros de método)
// espera: erro-de-compilacao
class Main {
    static void mostrar(var x) {
        System.out.println(x);
    }

    public static void main(String[] args) {
        mostrar(1);
    }
}
```

`verify/java/java-moderno/aula-text-block.java`:
```java
// verifica: f12 e a aula var-e-text-blocks (recuo removido, aspas sem escape, quebra de linha no fim)
// saida:
// {
//   "nome": "Ana",
//   "idade": 30
// }
// true true
class Main {
    public static void main(String[] args) {
        String json = """
            {
              "nome": "Ana",
              "idade": 30
            }
            """;
        System.out.print(json);
        System.out.println(json.startsWith("{") + " " + json.endsWith("\n"));
    }
}
```

`verify/java/java-moderno/q17-text-block.java`:
```java
// verifica: java.java-moderno.q17 (a primeira linha é só "{")
// saida:
// {
// 1
class Main {
    public static void main(String[] args) {
        String json = """
            {
              "nome": "Ana"
            }
            """;
        String primeira = json.lines().findFirst().orElse("?");
        System.out.println(primeira);
        System.out.println(primeira.length());
    }
}
```

Aula `records`:

`verify/java/java-moderno/aula-record.java`:
```java
// verifica: q19, f13 e a aula records (acesso, toString, equals, hashCode e "mudar" criando outro)
// saida:
// 3
// Ponto[x=3, y=4]
// true
// true
// Ponto[x=10, y=4]
class Main {
    public static void main(String[] args) {
        Ponto p = new Ponto(3, 4);
        System.out.println(p.x());
        System.out.println(p);
        System.out.println(p.equals(new Ponto(3, 4)));
        System.out.println(p.hashCode() == new Ponto(3, 4).hashCode());
        System.out.println(new Ponto(10, p.y()));
    }
}

record Ponto(int x, int y) {}
```

`verify/java/java-moderno/q18-record-campo-privado.java`:
```java
// verifica: java.java-moderno.q18 e a aula records (o atributo do record é privado)
// espera: erro-de-compilacao
// erro-contem: x has private access in Ponto
class Main {
    public static void main(String[] args) {
        Ponto p = new Ponto(3, 4);
        p.x = 10;
    }
}

record Ponto(int x, int y) {}
```

`verify/java/java-moderno/q18-record-sem-get.java`:
```java
// verifica: java.java-moderno.q18 e f13 (o record não gera getX)
// espera: erro-de-compilacao
// erro-contem: cannot find symbol
class Main {
    public static void main(String[] args) {
        Ponto p = new Ponto(3, 4);
        System.out.println(p.getX());
    }
}

record Ponto(int x, int y) {}
```

`verify/java/java-moderno/q20-record-compacto.java`:
```java
// verifica: java.java-moderno.q20 e a aula records (o construtor compacto valida)
// espera: excecao IllegalArgumentException
// erro-contem: idade negativa: -1
class Main {
    public static void main(String[] args) {
        System.out.println(new Idade(30));
        new Idade(-1);
    }
}

record Idade(int valor) {
    Idade {
        if (valor < 0) {
            throw new IllegalArgumentException("idade negativa: " + valor);
        }
    }
}
```

`verify/java/java-moderno/aula-record-metodo.java`:
```java
// verifica: a aula records (método, método static e interface num record)
// saida:
// 6.0
// 16.0
class Main {
    public static void main(String[] args) {
        System.out.println(new Retangulo(2, 3).area());
        ComArea q = Retangulo.quadrado(4);
        System.out.println(q.area());
    }
}

interface ComArea {
    double area();
}

record Retangulo(double largura, double altura) implements ComArea {
    static Retangulo quadrado(double lado) {
        return new Retangulo(lado, lado);
    }

    @Override
    public double area() {
        return largura * altura;
    }
}
```

`verify/java/java-moderno/aula-record-extends.java`:
```java
// verifica: a nota da aula records (record não estende classe)
// espera: erro-de-compilacao
class Main {
    public static void main(String[] args) {
    }
}

class Base {
}

record Ponto(int x, int y) extends Base {}
```

`verify/java/java-moderno/aula-record-atributo.java`:
```java
// verifica: a nota da aula records (record não declara atributo de instância extra)
// espera: erro-de-compilacao
// erro-contem: field declaration must be static
class Main {
    public static void main(String[] args) {
    }
}

record Ponto(int x, int y) {
    int z;
}
```

Aula `switch-e-pattern-matching`:

`verify/java/java-moderno/aula-switch-expressao.java`:
```java
// verifica: f16 e a aula switch-e-pattern-matching (vários valores num case, yield e default que lança)
// saida:
// dia útil
// fim de semana
// dia inválido: 9
class Main {
    static String tipo(int dia) {
        return switch (dia) {
            case 1, 7 -> "fim de semana";
            case 2, 3, 4, 5, 6 -> {
                String t = "dia útil";
                yield t;
            }
            default -> throw new IllegalArgumentException("dia inválido: " + dia);
        };
    }

    public static void main(String[] args) {
        System.out.println(tipo(3));
        System.out.println(tipo(7));
        try {
            tipo(9);
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

`verify/java/java-moderno/q22-yield.java`:
```java
// verifica: java.java-moderno.q22 (yield devolve o valor do bloco)
// saida:
// dia útil
class Main {
    public static void main(String[] args) {
        int dia = 3;
        String tipo = switch (dia) {
            case 1, 7 -> "fim de semana";
            default -> {
                String t = "dia útil";
                yield t;
            }
        };
        System.out.println(tipo);
    }
}
```

`verify/java/java-moderno/aula-switch-sem-default.java`:
```java
// verifica: a aula switch-e-pattern-matching (switch de int usado como expressão precisa de default)
// espera: erro-de-compilacao
// erro-contem: the switch expression does not cover all possible input values
class Main {
    static String tipo(int dia) {
        return switch (dia) {
            case 1, 7 -> "fim de semana";
            case 2, 3, 4, 5, 6 -> "dia útil";
        };
    }

    public static void main(String[] args) {
        System.out.println(tipo(1));
    }
}
```

`verify/java/java-moderno/aula-switch-return.java`:
```java
// verifica: q22 e a aula switch-e-pattern-matching (return dentro de switch usado como expressão)
// espera: erro-de-compilacao
// erro-contem: attempt to return out of a switch expression
class Main {
    static String tipo(int dia) {
        return switch (dia) {
            case 1, 7 -> "fim de semana";
            default -> {
                return "dia útil";
            }
        };
    }

    public static void main(String[] args) {
        System.out.println(tipo(1));
    }
}
```

`verify/java/java-moderno/aula-instanceof-pattern.java`:
```java
// verifica: f14 e a aula switch-e-pattern-matching (instanceof antigo e com padrão)
// saida:
// 4
// 4
// JAVA
class Main {
    public static void main(String[] args) {
        Object obj = "Java";
        if (obj instanceof String) {
            String s = (String) obj;
            System.out.println(s.length());
        }
        if (obj instanceof String s) {
            System.out.println(s.length());
        }
        if (obj instanceof String s && s.length() > 3) {
            System.out.println(s.toUpperCase());
        }
    }
}
```

`verify/java/java-moderno/q21-instanceof-pattern.java`:
```java
// verifica: java.java-moderno.q21 (a variável do padrão vale depois do &&)
// saida:
// JAVA
class Main {
    public static void main(String[] args) {
        Object obj = "Java";
        if (obj instanceof String s && s.length() > 3) {
            System.out.println(s.toUpperCase());
        }
    }
}
```

`verify/java/java-moderno/aula-switch-padroes.java`:
```java
// verifica: q25 e a aula switch-e-pattern-matching (case por tipo, when e case null)
// saida:
// inteiro positivo: 5
// inteiro: -2
// texto com 2 letras
// outra coisa
// nulo
class Main {
    static String descrever(Object o) {
        return switch (o) {
            case null -> "nulo";
            case Integer i when i > 0 -> "inteiro positivo: " + i;
            case Integer i -> "inteiro: " + i;
            case String s -> "texto com " + s.length() + " letras";
            default -> "outra coisa";
        };
    }

    public static void main(String[] args) {
        System.out.println(descrever(5));
        System.out.println(descrever(-2));
        System.out.println(descrever("oi"));
        System.out.println(descrever(3.5));
        System.out.println(descrever(null));
    }
}
```

`verify/java/java-moderno/q24-dominado.java`:
```java
// verifica: java.java-moderno.q24 e a aula switch-e-pattern-matching (case genérico antes do específico)
// espera: erro-de-compilacao
// erro-contem: this case label is dominated by a preceding case label
class Main {
    static String descrever(Object o) {
        return switch (o) {
            case CharSequence cs -> "texto";
            case String s -> "string";
            default -> "outro";
        };
    }

    public static void main(String[] args) {
        System.out.println(descrever("oi"));
    }
}
```

`verify/java/java-moderno/aula-switch-null.java`:
```java
// verifica: a aula switch-e-pattern-matching (switch sem case null recebendo null)
// espera: excecao NullPointerException
class Main {
    public static void main(String[] args) {
        Object o = null;
        String r = switch (o) {
            case String s -> "texto";
            default -> "outro";
        };
        System.out.println(r);
    }
}
```

`verify/java/java-moderno/aula-sealed.java`:
```java
// verifica: java.java-moderno.q23, f15 e a aula switch-e-pattern-matching (sealed dispensa o default)
// saida:
// 4.0
// 3.141592653589793
// círculo
// quadrado
class Main {
    static double area(Forma f) {
        return switch (f) {
            case Circulo c -> Math.PI * c.raio() * c.raio();
            case Quadrado q -> q.lado() * q.lado();
        };
    }

    static String nome(Forma f) {
        return switch (f) {
            case Circulo c -> "círculo";
            case Quadrado q -> "quadrado";
        };
    }

    public static void main(String[] args) {
        System.out.println(area(new Quadrado(2)));
        System.out.println(area(new Circulo(1)));
        System.out.println(nome(new Circulo(1)));
        System.out.println(nome(new Quadrado(2)));
    }
}

sealed interface Forma permits Circulo, Quadrado {}

record Circulo(double raio) implements Forma {}

record Quadrado(double lado) implements Forma {}
```

`verify/java/java-moderno/aula-sealed-sem-caso.java`:
```java
// verifica: a aula switch-e-pattern-matching (forma nova no permits sem case não compila)
// espera: erro-de-compilacao
// erro-contem: the switch expression does not cover all possible input values
class Main {
    static String nome(Forma f) {
        return switch (f) {
            case Circulo c -> "círculo";
            case Quadrado q -> "quadrado";
        };
    }

    public static void main(String[] args) {
        System.out.println(nome(new Circulo(1)));
    }
}

sealed interface Forma permits Circulo, Quadrado, Triangulo {}

record Circulo(double raio) implements Forma {}

record Quadrado(double lado) implements Forma {}

record Triangulo(double base, double altura) implements Forma {}
```

`verify/java/java-moderno/aula-record-pattern.java`:
```java
// verifica: a aula switch-e-pattern-matching (padrões de record no switch e no instanceof)
// saida:
// na origem
// em (2, 5)
// não é um ponto
// 7
class Main {
    static String onde(Object o) {
        return switch (o) {
            case Ponto(int x, int y) when x == 0 && y == 0 -> "na origem";
            case Ponto(int x, int y) -> "em (" + x + ", " + y + ")";
            default -> "não é um ponto";
        };
    }

    public static void main(String[] args) {
        System.out.println(onde(new Ponto(0, 0)));
        System.out.println(onde(new Ponto(2, 5)));
        System.out.println(onde("x"));
        Object o = new Ponto(3, 4);
        if (o instanceof Ponto(int x, int y)) {
            System.out.println(x + y);
        }
    }
}

record Ponto(int x, int y) {}
```

- [ ] **Step 6: Conferir com o JDK 21**

Run (PowerShell): `$env:JAVA_HOME = "$env:USERPROFILE\tools\jdk-21.0.12.1+1"; node tools/verify-java.mjs`
Expected: todos passam (`230/230 trechos conferidos.`). Se algum falhar, descubra se o erro está no conteúdo ou no trecho, corrija e rode de novo. Nunca ajuste a saída esperada sem entender a diferença.

- [ ] **Step 7: Commit**

```bash
git add content verify
git commit -m "Adiciona módulo Java › Java Moderno (8 a 21)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Fechamento: aulas sem pergunta, teste de fumaça, regressões e documentação

**Files:**
- Modify: `tests/content.test.js`, `tests/content-regressions.test.js`, `content/java/referencia.md`, `docs/verificacao-manual.md`, `README.md`
- Create: `tests/data/content-real.test.js`

**Interfaces:**
- Consumes: `installFetchFromDisk({ overlay: false })` (Task 2); `loadLanguages`, `loadModuleBank` e `loadLesson` de `js/data/content.js` (Fase 1A); os sete módulos das Tasks 3 a 8.
- Produces: `lessonsWithoutQuestions(lessonIds, questions)`, exportada por `tests/content.test.js`, que devolve os ids de aula sem nenhuma pergunta. O validador passa a recusar módulo com aula sem pergunta.

- [ ] **Step 1: Teste da regra nova do validador (falhando)**

Em `tests/content.test.js`, logo depois do teste `'o validador encontra problemas de propósito'`, acrescente:

```js
test('o validador aponta aulas sem nenhuma pergunta', () => {
  assert.deepEqual(lessonsWithoutQuestions(['a', 'b', 'c'], [{ lesson: 'a' }, { lesson: 'c' }, { lesson: 'a' }]), ['b']);
  assert.deepEqual(lessonsWithoutQuestions(['a'], [{ lesson: 'a' }]), []);
});
```

Run: `node --test tests/content.test.js`
Expected: FAIL com `ReferenceError: lessonsWithoutQuestions is not defined`.

- [ ] **Step 2: Implementar e ligar a regra no validador**

Em `tests/content.test.js`, depois da função `validateCard`, acrescente:

```js
export function lessonsWithoutQuestions(lessonIds, questions) {
  const used = new Set(questions.map((q) => q.lesson));
  return lessonIds.filter((id) => !used.has(id));
}
```

E, em `validateLanguage`, logo depois da linha que confere `cards.length < MIN_CARDS`, acrescente:

```js
    for (const id of lessonsWithoutQuestions([...lessons], questions)) errors.push(`${qFile}: a aula ${id} não tem nenhuma pergunta`);
```

Run: `node --test tests/content.test.js`
Expected: PASS (todas as aulas dos sete módulos já têm perguntas).

- [ ] **Step 3: Teste de fumaça com o conteúdo real**

Crie `tests/data/content-real.test.js`:

```js
// Teste de fumaça com o conteúdo de verdade (sem a fixture da Task 2): a ordem dos módulos
// e o carregamento de todas as aulas e bancos, do jeito que o site faz.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { installFetchFromDisk } from '../helpers/fetch-from-disk.js';
import { loadLanguages, loadModuleBank, loadLesson } from '../../js/data/content.js';

installFetchFromDisk({ overlay: false });

const java = async () => (await loadLanguages()).find((l) => l.id === 'java');

test('Java tem os sete módulos da especificação, na ordem', async () => {
  assert.deepEqual((await java()).modules.map((m) => m.id), ['introducao', 'fundamentos', 'poo', 'colecoes', 'excecoes', 'strings', 'java-moderno']);
});

test('toda aula carrega e começa por um título; todo banco carrega com as chaves do módulo', async () => {
  const lang = await java();
  for (const module of lang.modules) {
    for (const lesson of module.lessons) {
      assert.match(await loadLesson(lang, module, lesson), /^# \S/, `${module.id}/${lesson.id}`);
    }
    const bank = await loadModuleBank(lang, module);
    assert.ok(bank.questions.length >= 12, module.id);
    assert.ok(bank.questions.every((q) => q.module === module.key && q.id.startsWith(`${module.key}.q`)), module.id);
    assert.ok(bank.cards.every((c) => c.module === module.key && c.id.startsWith(`${module.key}.f`)), module.id);
  }
});
```

Run: `node --test tests/data/content-real.test.js`
Expected: PASS. Este teste trava o resultado das Tasks 3 a 8, por isso passa de primeira. Para ver que ele pega o erro: troque de lugar, em `content/java/language.json`, os módulos `poo` e `colecoes`, rode de novo (Expected: FAIL em "Java tem os sete módulos da especificação, na ordem") e desfaça a troca com `git checkout content/java/language.json`.

- [ ] **Step 4: Regressões de conteúdo (uma falhando)**

Em `tests/content-regressions.test.js`, depois da linha `const json = ...`, acrescente:

```js
const question = (dir, id) => json(`${dir}/questions.json`).questions.find((q) => q.id === id);
```

E, no fim do arquivo:

```js
test('a carta de interfaces cita métodos abstratos e os métodos private do Java 9+', () => {
  const f12 = json('03-poo/flashcards.json').cards.find((c) => c.id === 'java.poo.f12');
  assert.match(f12.back, /abstratos/);
  assert.match(f12.back, /`private` \(Java 9\+\)/);
});

test('exceção unchecked personalizada: Error fica fora das alternativas (seria uma segunda resposta certa)', () => {
  const q13 = question('05-excecoes', 'java.excecoes.q13');
  assert.equal(q13.options[q13.answer], '`RuntimeException`');
  assert.ok(!q13.options.some((o) => o.includes('Error')));
});

test('lacunas aceitam todas as respostas que compilam', () => {
  assert.deepEqual([...question('04-colecoes', 'java.colecoes.q18').blanks[0]].sort(), ['comparing', 'comparingDouble', 'comparingInt', 'comparingLong']);
  assert.deepEqual([...question('05-excecoes', 'java.excecoes.q18').blanks[0]].sort(), ['AutoCloseable', 'Closeable', 'java.io.Closeable', 'java.lang.AutoCloseable']);
  assert.ok(question('04-colecoes', 'java.colecoes.q04').blanks[0].includes('java.util.List.of'));
});

test('regras de construtor que mudaram depois do Java 21 são ditas como "no Java 21"', () => {
  assert.match(question('03-poo', 'java.poo.q07').prompt, /^No Java 21/);
  assert.match(question('03-poo', 'java.poo.q18').prompt, /^No Java 21/);
  assert.match(read('03-poo/02-construtores.md'), /No Java 21, `this\(\.\.\.\)` precisa ser a \*\*primeira instrução\*\*/);
});

test('a referência rápida trata Error como unchecked, como o módulo Exceções', () => {
  assert.match(read('referencia.md'), /\*\*Unchecked:\*\* `RuntimeException`, `Error` e as subclasses deles/);
});
```

Run: `node --test tests/content-regressions.test.js`
Expected: FAIL só em "a referência rápida trata Error como unchecked" (a referência da 1A diz "subclasses de `RuntimeException`"). As outras passam, porque travam o conteúdo das Tasks 4 a 6. Para ver uma delas pegar o erro: apague `"comparingLong"` de `java.colecoes.q18` em `content/java/04-colecoes/questions.json`, rode (Expected: FAIL em "lacunas aceitam todas as respostas que compilam") e desfaça com `git checkout content/java/04-colecoes/questions.json`.

- [ ] **Step 5: Atualizar a referência rápida**

Substitua o conteúdo de `content/java/referencia.md` por:

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
- **Unchecked:** `RuntimeException`, `Error` e as subclasses deles. O tratamento é opcional.
- **Checked:** todas as outras, como `Exception` e `IOException`. O compilador exige tratar (`try`/`catch`) ou declarar (`throws`).
- `throw` lança uma exceção; `throws` declara na assinatura do método que ela pode ser lançada.
- `finally` executa com ou sem exceção.
- O try-with-resources (Java 7+) fecha sozinho, na ordem inversa, os recursos `AutoCloseable` declarados entre parênteses.

## Coleções: quando usar

| Coleção | Use quando |
|---|---|
| `ArrayList` | lista de uso geral; acesso rápido por índice |
| `LinkedList` | muitas inserções e remoções nas pontas |
| `HashSet` | valores únicos, sem ordem garantida |
| `LinkedHashSet` | valores únicos, na ordem de inserção |
| `TreeSet` | valores únicos, em ordem crescente |
| `HashMap` | pares chave → valor, sem ordem garantida |
| `LinkedHashMap` | pares chave → valor, na ordem de inserção |
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
- Em `List<Integer>`, `remove(1)` remove a **posição** 1; para remover o valor, use `remove(Integer.valueOf(1))`.
- Remover itens de uma lista dentro do for-each quebra o laço: use `Iterator.remove()` ou `removeIf`.
- `nextInt()` seguido de `nextLine()` devolve uma linha vazia: descarte a quebra de linha com um `nextLine()` extra.
- `split` recebe expressão regular: `"a.b.c".split(".")` dá um array vazio; use `split("\\.")`.
````

Run: `node --test tests/content-regressions.test.js`
Expected: PASS.

- [ ] **Step 6: Documentação**

Em `docs/verificacao-manual.md`:
- troque a linha `- [ ] As 6 aulas de Fundamentos aparecem com tabelas, código colorido, botão "copiar" e quadros de destaque coloridos.` por estas duas:

```markdown
- [ ] A página de Java lista os 7 módulos, nesta ordem: Introdução, Fundamentos, Orientação a Objetos, Coleções, Exceções, Strings e Entrada, Java Moderno (8 a 21).
- [ ] As aulas dos 7 módulos aparecem com tabelas, código colorido, botão "copiar" e quadros de destaque coloridos (confira pelo menos uma aula de cada módulo).
```

- troque `- [ ] \`node tools/verify-java.mjs\` com o JDK 21: 32/32.` por `- [ ] \`node tools/verify-java.mjs\` com o JDK 21: 230/230.`

Em `README.md`, no fim do parágrafo da seção "Testes" que a Task 2 escreveu (o que termina em "pelo validador (`tests/content.test.js`)."), troque o ponto final por:

```markdown
 e por um teste de fumaça que carrega todos os módulos de verdade (`tests/data/content-real.test.js`).
```

- [ ] **Step 7: Rodar tudo e fazer o commit**

Run: `npm test`
Expected: PASS.

Run (PowerShell): `$env:JAVA_HOME = "$env:USERPROFILE\tools\jdk-21.0.12.1+1"; node tools/verify-java.mjs`
Expected: `230/230 trechos conferidos.`

```bash
git add tests content/java/referencia.md docs/verificacao-manual.md README.md
git commit -m "Valida aulas sem pergunta, testa o conteúdo real e atualiza a referência" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```
