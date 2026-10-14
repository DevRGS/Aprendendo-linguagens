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
