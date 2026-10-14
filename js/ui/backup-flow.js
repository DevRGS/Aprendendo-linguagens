import { exportBackup, readBackupFile } from '../data/backup.js';
import { replaceState, updateBackupMeta } from '../core/actions.js';
import { migrate } from '../core/state.js';
import { levelForXp } from '../core/gamification.js';
import { APP_NAME, PRE_IMPORT_KEY } from '../config.js';
import { formatDateTime, plural } from './dom.js';

export const BACKUP_ERRORS = {
  json: 'O arquivo não é um JSON válido ou está danificado.',
  app: `Este arquivo não é um backup da ${APP_NAME}.`,
  newer: 'Este backup veio de uma versão mais nova do site. Recarregue a página e tente de novo.',
  invalid: 'O backup está incompleto ou danificado.',
};

export async function exportNow(app) {
  try {
    const result = await exportBackup(app.store.get());
    if (result === 'cancelled') return false;
    app.dispatch(updateBackupMeta, { lastExportAt: new Date().toISOString() });
    app.layout.toast(result === 'shared' ? 'Backup compartilhado.' : 'Backup baixado. Guarde o arquivo em um lugar seguro.', { tone: 'success' });
    return true;
  } catch (err) {
    app.layout.toast(`Não foi possível exportar: ${err.message}`, { tone: 'danger' });
    return false;
  }
}

export async function importFromFile(app, file) {
  const result = await readBackupFile(file);
  if (!result.ok) {
    alert(BACKUP_ERRORS[result.reason]);
    return false;
  }
  const s = result.state;
  const lessons = Object.keys(s.lessons).length;
  const lines = [
    `Perfil: ${s.profile?.name ?? '(sem nome)'}`,
    `Nível ${levelForXp(s.xp.total)} · ${lessons} ${plural(lessons, 'aula concluída', 'aulas concluídas')}`,
    result.exportedAt ? `Exportado em ${formatDateTime(result.exportedAt)}` : null,
  ].filter(Boolean);
  if (!confirm(`Importar este backup?\n\n${lines.join('\n')}\n\nO progresso atual será substituído. Você poderá desfazer em Configurações.`)) return false;
  const saved = app.storage.setItem(PRE_IMPORT_KEY, JSON.stringify(app.store.get()));
  if (!saved && !confirm('Não foi possível guardar uma cópia para desfazer a importação. Continuar mesmo assim?')) return false;
  app.dispatch(replaceState, { state: s });
  app.storage.flush();
  if (app.isAutoBackupPaused?.()) await app.resumeAutoBackup();
  return true;
}

export const canUndoImport = (app) => Boolean(app.storage.getItem(PRE_IMPORT_KEY));

export function undoImport(app) {
  const raw = app.storage.getItem(PRE_IMPORT_KEY);
  if (!raw) return false;
  let result;
  try {
    result = migrate(JSON.parse(raw));
  } catch {
    result = { ok: false };
  }
  if (!result.ok) {
    alert('A cópia anterior está danificada e não pode ser restaurada.');
    return false;
  }
  app.dispatch(replaceState, { state: result.state });
  app.storage.removeItem(PRE_IMPORT_KEY);
  app.storage.flush();
  return true;
}
