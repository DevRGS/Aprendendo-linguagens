import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveObjectURL } from 'node:buffer';
import { setupDom, tick } from '../helpers/dom.js';
import { createInitialState } from '../../js/core/state.js';
import { makeEnvelope, APP_ID } from '../../js/core/backup-format.js';
import { toDayKey } from '../../js/core/dates.js';
import { exportBackup, readBackupFile, createAutoBackup } from '../../js/data/backup.js';

setupDom();
const state = () => ({ ...createInitialState(), profile: { name: 'Rafa Gonçalves', avatar: '🦊', dailyGoal: 50, createdAt: '2026-10-01T12:00:00.000Z' } });
const studied = (extra = {}) => ({ ...state(), lessons: { 'java.fundamentos.arrays': { doneAt: '2026-10-01' } }, ...extra });

const clicked = [];
window.HTMLAnchorElement.prototype.click = function click() {
  clicked.push({ download: this.download, href: this.href });
};

function touchDevice(on) {
  window.matchMedia = () => ({ matches: on });
}

test('no computador, exportBackup baixa o arquivo com o envelope e o nome certo', async () => {
  touchDevice(false);
  const result = await exportBackup(state());
  assert.equal(result, 'downloaded');
  const last = clicked.at(-1);
  assert.equal(last.download, `progresso-rafa-goncalves-${toDayKey(new Date())}.json`);
  const envelope = JSON.parse(await resolveObjectURL(last.href).text());
  assert.equal(envelope.app, APP_ID);
  assert.equal(envelope.data.profile.name, 'Rafa Gonçalves');
  assert.equal(document.querySelector('a[download]'), null);
});

test('no celular com compartilhamento, exportBackup compartilha o arquivo', async () => {
  touchDevice(true);
  const shared = [];
  navigator.canShare = () => true;
  navigator.share = async (data) => { shared.push(data); };
  assert.equal(await exportBackup(state()), 'shared');
  assert.equal(shared[0].files[0].name.startsWith('progresso-rafa-goncalves-'), true);
});

test('compartilhamento cancelado não baixa nada; outro erro cai no download', async () => {
  touchDevice(true);
  const before = clicked.length;
  navigator.share = async () => { throw Object.assign(new Error('cancelado'), { name: 'AbortError' }); };
  assert.equal(await exportBackup(state()), 'cancelled');
  assert.equal(clicked.length, before);
  navigator.share = async () => { throw new Error('falhou'); };
  assert.equal(await exportBackup(state()), 'downloaded');
  assert.equal(clicked.length, before + 1);
  touchDevice(false);
});

test('readBackupFile valida o arquivo escolhido', async () => {
  const good = new File([JSON.stringify(makeEnvelope(state()))], 'b.json');
  const r = await readBackupFile(good);
  assert.equal(r.ok, true);
  assert.equal(r.state.profile.name, 'Rafa Gonçalves');
  assert.deepEqual(await readBackupFile(new File(['oi'], 'x.json')), { ok: false, reason: 'json' });
});

function fakeFileSystem({ permission = 'granted', failWrite = false } = {}) {
  const written = [];
  const handle = {
    queryPermission: async () => permission,
    requestPermission: async () => { permission = 'granted'; return permission; },
    createWritable: async () => {
      if (failWrite) throw new Error('disco cheio');
      return { write: async (blob) => written.push(await blob.text()), close: async () => {} };
    },
  };
  return { handle, written };
}

function memoryStore() {
  const map = new Map();
  return { map, get: async (k) => map.get(k), set: async (k, v) => { map.set(k, v); }, delete: async (k) => { map.delete(k); } };
}

test('sem File System Access, o backup automático fica "unsupported"', async () => {
  delete window.showSaveFilePicker;
  const auto = createAutoBackup({ onWrite() {}, onError() {}, store: memoryStore() });
  assert.equal(auto.supported, false);
  assert.equal(await auto.init(), 'unsupported');
});

test('ativar escolhe o arquivo, guarda o atalho e grava na hora', async () => {
  const fs = fakeFileSystem();
  window.showSaveFilePicker = async () => fs.handle;
  const store = memoryStore();
  const writes = [];
  const auto = createAutoBackup({ onWrite: (at) => writes.push(at), onError() {}, store });
  assert.equal(await auto.init(), 'off');
  assert.equal(await auto.enable(studied()), 'on');
  assert.equal(store.map.size, 1);
  assert.equal(fs.written.length, 1);
  assert.equal(JSON.parse(fs.written[0]).app, APP_ID);
  assert.equal(writes.length, 1);
});

test('schedule agrupa mudanças próximas numa gravação só', async () => {
  const fs = fakeFileSystem();
  window.showSaveFilePicker = async () => fs.handle;
  const auto = createAutoBackup({ onWrite() {}, onError() {}, store: memoryStore(), debounceMs: 20 });
  await auto.enable(studied());
  auto.schedule(studied({ lastLesson: 'a' }));
  auto.schedule(studied({ lastLesson: 'b' }));
  await tick(60);
  assert.equal(fs.written.length, 2);
  assert.equal(JSON.parse(fs.written[1]).data.lastLesson, 'b');
});

test('ao abrir de novo: permissão concedida fica "on"; pendente pede reconexão', async () => {
  const store = memoryStore();
  const granted = fakeFileSystem({ permission: 'granted' });
  store.map.set('auto-backup-file', granted.handle);
  window.showSaveFilePicker = async () => granted.handle;
  assert.equal(await createAutoBackup({ onWrite() {}, onError() {}, store }).init(), 'on');

  const prompt = fakeFileSystem({ permission: 'prompt' });
  store.map.set('auto-backup-file', prompt.handle);
  const auto = createAutoBackup({ onWrite() {}, onError() {}, store });
  assert.equal(await auto.init(), 'needs-permission');
  auto.schedule(studied());
  await tick(10);
  assert.equal(prompt.written.length, 0);
  assert.equal(await auto.reconnect(studied()), 'on');
  assert.equal(prompt.written.length, 1);
});

test('falha ao gravar chega por onError', async () => {
  const fs = fakeFileSystem({ failWrite: true });
  window.showSaveFilePicker = async () => fs.handle;
  const errors = [];
  const auto = createAutoBackup({ onWrite() {}, onError: (m) => errors.push(m), store: memoryStore() });
  await auto.enable(studied());
  assert.deepEqual(errors, ['disco cheio']);
});

test('desativar apaga o atalho e para de gravar', async () => {
  const fs = fakeFileSystem();
  window.showSaveFilePicker = async () => fs.handle;
  const store = memoryStore();
  const auto = createAutoBackup({ onWrite() {}, onError() {}, store, debounceMs: 5 });
  await auto.enable(studied());
  assert.equal(await auto.disable(), 'off');
  assert.equal(store.map.size, 0);
  auto.schedule(studied());
  await tick(20);
  assert.equal(fs.written.length, 1);
});

test('nunca grava um estado sem progresso, nem ao ativar, reconectar ou agendar', async () => {
  const fs = fakeFileSystem({ permission: 'prompt' });
  window.showSaveFilePicker = async () => fs.handle;
  const store = memoryStore();
  store.map.set('auto-backup-file', fs.handle);
  const auto = createAutoBackup({ onWrite() {}, onError() {}, store, debounceMs: 5 });
  assert.equal(await auto.init(), 'needs-permission');
  assert.equal(await auto.reconnect(state()), 'on');
  auto.schedule(state());
  await tick(20);
  assert.equal(await auto.enable(state()), 'on');
  assert.equal(fs.written.length, 0);
  auto.schedule(studied());
  await tick(20);
  assert.equal(fs.written.length, 1);
});
