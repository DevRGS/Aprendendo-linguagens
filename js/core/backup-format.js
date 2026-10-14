import { CURRENT_SCHEMA, migrate } from './state.js';
import { diffDays, toDayKey } from './dates.js';

export const APP_ID = 'central-linguagens';
export const REMINDER_DAYS = 7;

export function makeEnvelope(state, now = new Date()) {
  return { app: APP_ID, schema: state.schema, exportedAt: now.toISOString(), data: state };
}

export function parseEnvelope(text) {
  let obj;
  try {
    obj = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'json' };
  }
  if (!obj || typeof obj !== 'object' || obj.app !== APP_ID) return { ok: false, reason: 'app' };
  if (typeof obj.schema === 'number' && obj.schema > CURRENT_SCHEMA) return { ok: false, reason: 'newer' };
  const result = migrate(obj.data);
  if (!result.ok) return { ok: false, reason: result.reason === 'newer' ? 'newer' : 'invalid' };
  return { ok: true, state: result.state, exportedAt: obj.exportedAt ?? null };
}

export function slugify(name) {
  const s = String(name ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'perfil';
}

export function backupFileName(name, dayKey) {
  return `progresso-${slugify(name)}-${dayKey}.json`;
}

export function hasProgress(state) {
  return Object.keys(state.lessons).length > 0 || state.counters.answered > 0 || state.xp.total > 0;
}

export function needsBackupReminder({ state, today, dismissedUntil = null, autoHealthy = false }) {
  if (autoHealthy || !state.profile || !hasProgress(state)) return false;
  if (dismissedUntil && today < dismissedUntil) return false;
  const ref = state.backup.lastExportAt || state.profile.createdAt;
  if (!ref) return true;
  return diffDays(toDayKey(new Date(ref)), today) >= REMINDER_DAYS;
}
