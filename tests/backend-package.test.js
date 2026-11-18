import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { unzipSync } from 'fflate';

const source = fileURLToPath(new URL('../content/javascript/projetos/api-estudos/', import.meta.url));
const archive = new URL('../content/javascript/projetos/api-estudos.zip', import.meta.url);
const files = (dir, prefix = '') => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const name = prefix + entry.name;
  if (['node_modules', 'data', '.env'].includes(entry.name)) return [];
  return entry.isDirectory() ? files(join(dir, entry.name), `${name}/`) : [name];
});

test('o aluno recebe um ZIP baixável do projeto completo de API', () => {
  assert.ok(existsSync(archive), 'falta o ZIP do projeto');
  const zip = unzipSync(readFileSync(archive));
  const names = Object.keys(zip);
  assert.ok(names.every((name) => name.startsWith('api-estudos/') && !name.includes('..')));
  assert.ok(names.every((name) => !/(?:^|\/)(?:node_modules|data|\.env)(?:\/|$)|\.sqlite(?:-|$)/.test(name)));
  assert.deepEqual(names.map((name) => name.slice('api-estudos/'.length)).sort(), files(source).sort());
  for (const [name, bytes] of Object.entries(zip)) {
    assert.deepEqual(Buffer.from(bytes), readFileSync(join(source, name.slice('api-estudos/'.length))), `${name}: ZIP desatualizado`);
  }
});

test('o projeto extraído do ZIP executa seus testes locais com a dependência fixada', () => {
  assert.ok(existsSync(archive));
  const dir = mkdtempSync(join(tmpdir(), 'trilha-api-zip-'));
  try {
    const zip = unzipSync(readFileSync(archive));
    for (const [name, bytes] of Object.entries(zip)) {
      assert.ok(!name.includes('..'));
      const path = join(dir, name); mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, bytes);
    }
    const project = join(dir, 'api-estudos');
    const manifest = JSON.parse(readFileSync(join(project, 'package.json'), 'utf8'));
    const installed = JSON.parse(readFileSync(new URL('../node_modules/express/package.json', import.meta.url), 'utf8'));
    assert.equal(manifest.dependencies.express, installed.version);
    // Reutiliza a dependência já instalada pelo npm ci da central: testes não acessam o registro npm.
    symlinkSync(fileURLToPath(new URL('../node_modules', import.meta.url)), join(project, 'node_modules'), 'junction');
    const childEnv = { ...process.env };
    delete childEnv.NODE_TEST_CONTEXT; // O runner filho precisa iniciar sua própria sessão de testes.
    const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/api.test.mjs'], { cwd: project, env: childEnv, encoding: 'utf8', timeout: 30000, maxBuffer: 512 * 1024 });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /# fail 0/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
