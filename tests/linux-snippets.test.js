// Somente cenários explícitos do projeto: nunca executar blocos extraídos do Markdown.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = new URL('../verify/linux/', import.meta.url);
const manifest = new URL('cases.json', root);

test('cenários Bash do curso executam com os resultados e efeitos documentados', { skip: process.platform !== 'linux' && 'requer GNU/Linux com Bash' }, () => {
  assert.ok(existsSync(manifest), 'faltam os cenários explícitos de Linux');
  const cases = JSON.parse(readFileSync(manifest, 'utf8'));
  assert.ok(cases.length >= 18, 'cobrir as aulas práticas, incluindo aspas, erros e status');
  const covered = new Set();
  for (const item of cases) {
    assert.match(item.file, /^[a-z0-9-]+\.sh$/);
    const dir = mkdtempSync(join(tmpdir(), 'central-linux-'));
    try {
      const result = spawnSync('bash', ['--noprofile', '--norc', fileURLToPath(new URL(item.file, root))], {
        cwd: dir,
        env: { PATH: '/usr/bin:/bin', LC_ALL: 'C', HOME: dir, TMPDIR: dir },
        encoding: 'utf8', timeout: 5000, maxBuffer: 128 * 1024,
      });
      assert.ifError(result.error);
      assert.equal(result.status, item.status ?? 0, `${item.file}: ${result.stderr}`);
      assert.equal(result.stdout, item.stdout, item.file);
      assert.equal(result.stderr, '', `${item.file}: erro inesperado`);
      if (item.files || item.absent || item.modes) {
        const labs = readdirSync(dir).filter((name) => name.startsWith('terminal-linux.'));
        assert.equal(labs.length, 1, `${item.file}: um laboratório por cenário`);
        const lab = join(dir, labs[0]);
        for (const [path, content] of Object.entries(item.files ?? {})) {
          assert.equal(readFileSync(join(lab, path), 'utf8'), content, `${item.file}: ${path}`);
        }
        for (const path of item.absent ?? []) assert.equal(existsSync(join(lab, path)), false, `${item.file}: ${path} removido`);
        for (const [path, mode] of Object.entries(item.modes ?? {})) {
          assert.equal((statSync(join(lab, path)).mode & 0o777).toString(8), mode, `${item.file}: permissões de ${path}`);
        }
      }
      item.lessons.forEach((id) => covered.add(id));
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  const lang = JSON.parse(readFileSync(new URL('../content/linux/language.json', import.meta.url), 'utf8'));
  for (const module of lang.modules) {
    for (const lesson of module.lessons) {
      // Instalação é documentação Windows, conferida contra Microsoft Learn e renderizada no teste de tela.
      if (lesson.id === 'instalacao-wsl') continue;
      assert.ok(covered.has(`${module.id}/${lesson.id}`), `${lesson.id}: falta cenário`);
    }
  }
});

test('conferência inclui a cópia recursiva da solução e os efeitos do projeto', () => {
  assert.ok(existsSync(manifest));
  const cases = JSON.parse(readFileSync(manifest, 'utf8'));
  const copy = cases.find((item) => item.file === 'arquivos-criar-e-copiar.sh');
  const project = cases.find((item) => item.file === 'rotinas-repeticao-e-projeto.sh');
  assert.equal(copy?.files?.['reserva/notas/plano.txt'], 'Revisar comandos\n');
  assert.equal(project?.files?.['reserva/minhas notas.txt'], 'ler\npraticar\n');
  assert.equal(project?.files?.['reserva/resumo.txt'], 'revisar\n');
});
