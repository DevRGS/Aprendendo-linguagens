import { makeEnvelope, parseEnvelope, backupFileName, hasProgress } from '../core/backup-format.js';
import { toDayKey } from '../core/dates.js';
import { idbGet, idbSet, idbDelete } from './idb.js';
import { APP_NAME, AUTO_BACKUP_DEBOUNCE_MS, AUTO_BACKUP_FILE_NAME } from '../config.js';

const HANDLE_KEY = 'auto-backup-file';
const IDB_STORE_API = { get: idbGet, set: idbSet, delete: idbDelete };

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

// store e debounceMs existem para os testes; no site valem o IndexedDB e o intervalo de config.js.
export function createAutoBackup({ onWrite, onError, store = IDB_STORE_API, debounceMs = AUTO_BACKUP_DEBOUNCE_MS }) {
  const supported = typeof window.showSaveFilePicker === 'function';
  let handle = null;
  let granted = false;
  let timer = null;

  // Um estado sem progresso nunca substitui o arquivo: ele pode ser justamente a cópia boa.
  async function write(state) {
    if (!handle || !granted || !hasProgress(state)) return;
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
        handle = (await store.get(HANDLE_KEY)) ?? null;
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
      await store.set(HANDLE_KEY, handle);
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
      await store.delete(HANDLE_KEY);
      return this.status();
    },
    schedule(state) {
      if (!handle || !granted) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        write(state);
      }, debounceMs);
    },
  };
}
