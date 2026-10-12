// Lógica pura do conferidor de trechos Java (testada em tests/tools/verify-format.test.js).
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

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

// "java -version" escreve 'java version "1.8.0_401"' (antigo) ou 'openjdk version "21.0.5"' (novo).
export function parseJavaMajor(versionOutput) {
  const m = /version "(\d+)(?:\.(\d+))?/.exec(versionOutput ?? '');
  if (!m) return 0;
  return m[1] === '1' ? Number(m[2]) : Number(m[1]);
}

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

export function listJavaFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return listJavaFiles(p);
    return name.endsWith('.java') ? [p] : [];
  });
}
