// Executa os trechos de verify/java com o JDK 21+ e compara com o cabeçalho de cada arquivo.
// Uso: node tools/verify-java.mjs  (usa JAVA_HOME se definido; senão, o "java" do PATH)
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseExpectation, parseJavaMajor, judge, listJavaFiles } from './verify-format.mjs';

const ROOT = fileURLToPath(new URL('../verify/java/', import.meta.url));
const java = process.env.JAVA_HOME ? join(process.env.JAVA_HOME, 'bin', 'java') : 'java';

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
    const r = spawnSync(java, ['-Dstdout.encoding=UTF-8', '-Dstderr.encoding=UTF-8', file], { encoding: 'utf8', timeout: 60000 });
    problem = judge(exp, { code: r.status, stdout: r.stdout, stderr: r.stderr });
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
