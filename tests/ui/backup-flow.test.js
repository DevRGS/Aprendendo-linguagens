import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { makeTestApp, profileState } from '../helpers/app.js';
import { BACKUP_ERRORS, exportNow, importFromFile, canUndoImport, undoImport } from '../../js/ui/backup-flow.js';
import { makeEnvelope } from '../../js/core/backup-format.js';
import { PRE_IMPORT_KEY } from '../../js/config.js';

setupDom();
window.HTMLAnchorElement.prototype.click = function click() {};
const toasts = () => [...document.querySelectorAll('#toasts .toast')].map((t) => t.textContent);
const fileOf = (obj) => new File([typeof obj === 'string' ? obj : JSON.stringify(obj)], 'b.json');

test('exportNow baixa, registra a data do backup e avisa', async () => {
  const app = await makeTestApp({ state: profileState() });
  assert.equal(await exportNow(app), true);
  assert.ok(app.store.get().backup.lastExportAt);
  assert.ok(toasts().some((t) => t.startsWith('Backup baixado')));
  assert.ok(app.store.get().achievements['seguro-morreu-de-velho']);
});

test('exportNow cancelado não registra nada; erro vira aviso', async () => {
  const app = await makeTestApp({ state: profileState() });
  window.matchMedia = () => ({ matches: true });
  navigator.canShare = () => true;
  navigator.share = async () => { throw Object.assign(new Error('x'), { name: 'AbortError' }); };
  assert.equal(await exportNow(app), false);
  assert.equal(app.store.get().backup.lastExportAt, null);
  window.matchMedia = () => ({ matches: false });
  const original = URL.createObjectURL;
  URL.createObjectURL = () => { throw new Error('sem memória'); };
  try {
    assert.equal(await exportNow(app), false);
  } finally {
    URL.createObjectURL = original;
  }
  assert.ok(toasts().some((t) => t === 'Não foi possível exportar: sem memória'));
});

test('importar arquivo inválido mostra o motivo e não muda nada', async () => {
  const app = await makeTestApp({ state: profileState() });
  const alerts = [];
  window.alert = (msg) => alerts.push(msg);
  assert.equal(await importFromFile(app, fileOf({ app: 'outro' })), false);
  assert.equal(await importFromFile(app, fileOf('{ quebrado')), false);
  assert.deepEqual(alerts, [BACKUP_ERRORS.app, BACKUP_ERRORS.json]);
  assert.equal(app.store.get().profile.name, 'Rafa');
});

test('importar mostra o resumo; cancelar não muda nada; confirmar substitui e permite desfazer', async () => {
  const app = await makeTestApp({ state: profileState() });
  const backup = { ...profileState(), profile: { ...profileState().profile, name: 'Bia' }, lessons: { 'java.fundamentos.arrays': { doneAt: '2026-10-01' } } };
  const asked = [];
  window.confirm = (msg) => { asked.push(msg); return false; };
  assert.equal(await importFromFile(app, fileOf(makeEnvelope(backup))), false);
  assert.match(asked[0], /Perfil: Bia/);
  assert.match(asked[0], /Nível 1 · 1 aula concluída/);
  assert.equal(app.store.get().profile.name, 'Rafa');
  assert.equal(canUndoImport(app), false);

  window.confirm = () => true;
  assert.equal(await importFromFile(app, fileOf(makeEnvelope(backup))), true);
  assert.equal(app.store.get().profile.name, 'Bia');
  assert.equal(canUndoImport(app), true);

  assert.equal(undoImport(app), true);
  assert.equal(app.store.get().profile.name, 'Rafa');
  assert.equal(canUndoImport(app), false);
  assert.equal(undoImport(app), false);
});

test('sem espaço para a cópia de segurança, pergunta antes de importar', async () => {
  const app = await makeTestApp({ state: profileState() });
  const asked = [];
  window.confirm = (msg) => { asked.push(msg); return asked.length === 1; };
  app.storage.setItem = () => false;
  assert.equal(await importFromFile(app, fileOf(makeEnvelope(profileState()))), false);
  assert.match(asked[1], /Não foi possível guardar uma cópia/);
  window.confirm = () => true;
});

test('desfazer com cópia danificada avisa e mantém o estado', async () => {
  const app = await makeTestApp({ state: profileState() });
  const alerts = [];
  window.alert = (msg) => alerts.push(msg);
  localStorage.setItem(PRE_IMPORT_KEY, '{ quebrado');
  assert.equal(undoImport(app), false);
  assert.match(alerts[0], /danificada/);
  await tick();
});
