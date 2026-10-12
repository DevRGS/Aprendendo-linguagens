import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container, texts } from '../helpers/app.js';
import { renderSettings } from '../../js/ui/views/settings.js';
import { makeEnvelope } from '../../js/core/backup-format.js';
import { PRE_IMPORT_KEY, AUTO_BACKUP_PAUSE_KEY } from '../../js/config.js';

setupDom();
window.HTMLAnchorElement.prototype.click = function click() {};
const button = (el, text) => [...el.querySelectorAll('button')].find((b) => b.textContent === text);
const toasts = () => texts(document, '#toasts .toast');

async function open(state = profileState(), autoStatus = 'unsupported') {
  const app = await makeTestApp({ state });
  app.autoBackup.status = () => autoStatus;
  const el = container();
  document.body.append(el);
  renderSettings(el, app, route('config'));
  return { app, el };
}

test('editar o perfil salva nome, avatar e meta', async () => {
  const { app, el } = await open();
  assert.equal(el.querySelector('h1').textContent, '⚙️ Configurações');
  assert.equal(el.querySelector('#pf-name').value, 'Rafa');
  el.querySelector('#pf-name').value = '';
  button(el, 'Salvar perfil').click();
  assert.equal(app.store.get().profile.name, 'Rafa');
  el.querySelector('#pf-name').value = 'Rafael';
  el.querySelectorAll('.goal-opt')[2].click();
  button(el, 'Salvar perfil').click();
  assert.equal(app.store.get().profile.name, 'Rafael');
  assert.equal(app.store.get().profile.dailyGoal, 100);
  assert.ok(toasts().includes('Perfil atualizado.'));
  el.remove();
});

test('backup manual: exportar registra a data e atualiza a tela', async () => {
  const { app, el } = await open();
  assert.match(el.textContent, /Você ainda não exportou nenhum backup\./);
  button(el, 'Exportar progresso').click();
  await tick(20);
  assert.ok(app.store.get().backup.lastExportAt);
  assert.equal(app.refreshes, 1);
  el.remove();
  const again = await open(profileState({ backup: { lastExportAt: '2026-10-10T12:00:00.000Z', autoFileEnabled: false, lastAutoWriteAt: null, autoFileError: null } }));
  assert.match(again.el.textContent, /Último backup exportado em .*10\/10\/2026/);
  again.el.remove();
});

test('backup manual: importar e desfazer', async () => {
  const { app, el } = await open();
  window.confirm = () => true;
  assert.equal(button(el, 'Desfazer importação'), undefined);
  const input = el.querySelector('input[type="file"]');
  const other = { ...profileState(), profile: { ...profileState().profile, name: 'Bia' } };
  Object.defineProperty(input, 'files', { value: [new File([JSON.stringify(makeEnvelope(other))], 'b.json')], configurable: true });
  input.dispatchEvent(new window.Event('change'));
  await tick(20);
  assert.equal(app.store.get().profile.name, 'Bia');
  assert.ok(toasts().includes('Progresso importado.'));
  assert.equal(app.refreshes, 1);
  el.remove();

  const after = container();
  document.body.append(after);
  renderSettings(after, app, route('config'));
  button(after, 'Desfazer importação').click();
  assert.equal(app.store.get().profile.name, 'Rafa');
  assert.ok(toasts().includes('Importação desfeita.'));
  after.remove();
});

test('backup automático: navegador sem suporte explica onde funciona', async () => {
  const { el } = await open(profileState(), 'unsupported');
  assert.match(el.textContent, /Disponível no Chrome e no Edge para computador/);
  el.remove();
});

test('backup automático: ativar, cancelar a janela e erro', async () => {
  const { app, el } = await open(profileState(), 'off');
  let calls = 0;
  app.autoBackup.enable = async () => { calls += 1; };
  button(el, 'Ativar backup automático').click();
  await tick(20);
  assert.equal(calls, 1);
  assert.equal(app.store.get().backup.autoFileEnabled, true);
  assert.ok(app.store.get().achievements['seguro-morreu-de-velho']);
  assert.equal(app.refreshes, 1);

  app.autoBackup.enable = async () => { throw Object.assign(new Error('cancelado'), { name: 'AbortError' }); };
  const before = toasts().length;
  button(el, 'Ativar backup automático').click();
  await tick(20);
  assert.equal(toasts().length, before);

  app.autoBackup.enable = async () => { throw new Error('sem permissão'); };
  button(el, 'Ativar backup automático').click();
  await tick(20);
  assert.ok(toasts().includes('Não foi possível configurar o backup automático: sem permissão'));
  el.remove();
});

test('backup automático: aguardando permissão oferece reconectar e desativar', async () => {
  const { app, el } = await open(profileState(), 'needs-permission');
  let reconnected = 0;
  app.autoBackup.reconnect = async () => { reconnected += 1; };
  button(el, 'Reconectar backup automático').click();
  await tick(20);
  assert.equal(reconnected, 1);
  let disabled = 0;
  app.autoBackup.disable = async () => { disabled += 1; };
  button(el, 'Desativar').click();
  await tick(20);
  assert.equal(disabled, 1);
  assert.equal(app.store.get().backup.autoFileEnabled, false);
  el.remove();
});

test('backup automático ativo mostra a última gravação e a falha, se houver', async () => {
  const backup = { lastExportAt: null, autoFileEnabled: true, lastAutoWriteAt: '2026-10-11T14:32:00.000Z', autoFileError: 'disco cheio' };
  const { el } = await open(profileState({ backup }), 'on');
  assert.match(el.textContent, /✅ Ativo\. Último backup automático: .*11\/10\/2026/);
  assert.match(el.textContent, /A última gravação falhou: disco cheio\./);
  assert.ok(button(el, 'Desativar'));
  el.remove();
});

test('zerar progresso: oferece exportar antes e só apaga com confirmação', async () => {
  const { app, el } = await open();
  localStorage.setItem(PRE_IMPORT_KEY, '{}');
  const asked = [];
  window.confirm = (msg) => { asked.push(msg); return false; };
  button(el, 'Zerar progresso').click();
  await tick(20);
  assert.equal(asked.length, 2);
  assert.equal(app.store.get().profile.name, 'Rafa');

  window.confirm = () => true;
  button(el, 'Zerar progresso').click();
  await tick(20);
  assert.equal(app.store.get().profile, null);
  assert.equal(localStorage.getItem(PRE_IMPORT_KEY), null);
  assert.equal(location.hash, '#/');
  assert.match(el.textContent, /nenhum dado sai do seu aparelho\. A Central de Linguagens não usa rastreamento/);
  el.remove();
});

test('backup automático pausado: explica e só retoma com confirmação', async () => {
  localStorage.setItem(AUTO_BACKUP_PAUSE_KEY, '1');
  const { app, el } = await open(profileState(), 'off');
  localStorage.setItem(AUTO_BACKUP_PAUSE_KEY, '1');
  el.replaceChildren();
  renderSettings(el, app, route('config'));
  assert.match(el.textContent, /O backup automático está pausado/);
  assert.equal(button(el, 'Ativar backup automático'), undefined);
  let resumed = 0;
  app.resumeAutoBackup = async () => { resumed += 1; };
  window.confirm = () => false;
  button(el, 'Retomar backup automático').click();
  await tick(20);
  assert.equal(resumed, 0);
  window.confirm = () => true;
  button(el, 'Retomar backup automático').click();
  await tick(20);
  assert.equal(resumed, 1);
  localStorage.removeItem(AUTO_BACKUP_PAUSE_KEY);
  el.remove();
});
