import { h, mount, formatDateTime } from '../dom.js';
import { APP_NAME, PRE_IMPORT_KEY } from '../../config.js';
import { setProfile, updateBackupMeta, resetProgress } from '../../core/actions.js';
import { exportNow, importFromFile, canUndoImport, undoImport } from '../backup-flow.js';
import { profileFields } from '../components/profile-fields.js';

function autoBackupSection(app) {
  const { autoBackup } = app;
  const { backup } = app.store.get();
  const status = autoBackup.status();
  const rerender = () => {
    app.updateBanners(app.store.get());
    app.refresh();
  };
  const run = (fn) => async () => {
    try {
      await fn();
    } catch (err) {
      if (err?.name !== 'AbortError') app.layout.toast(`Não foi possível configurar o backup automático: ${err.message}`, { tone: 'danger' });
    }
    rerender();
  };
  const disableBtn = () => h('button', {
    type: 'button', class: 'btn btn-ghost', text: 'Desativar',
    onClick: run(async () => {
      await autoBackup.disable();
      app.dispatch(updateBackupMeta, { autoFileEnabled: false, autoFileError: null });
    }),
  });

  let body;
  if (app.isAutoBackupPaused?.()) {
    body = [
      h('p', { class: 'field-error', text: 'O backup automático está pausado porque o progresso salvo neste navegador não pôde ser lido. O arquivo de backup não será alterado enquanto a pausa durar.' }),
      h('p', { class: 'muted', text: 'Se o arquivo de backup tem o seu progresso bom, importe-o acima: a pausa termina sozinha. Se preferir continuar do progresso atual, retome o backup automático.' }),
      h('button', {
        type: 'button', class: 'btn', text: 'Retomar backup automático',
        onClick: run(async () => {
          if (!confirm('Retomar vai permitir que o arquivo de backup automático seja substituído pelo progresso atual. Se o arquivo tem um progresso melhor, importe-o antes. Retomar mesmo assim?')) return;
          await app.resumeAutoBackup();
        }),
      }),
    ];
  } else if (status === 'unsupported') {
    body = [h('p', { class: 'muted', text: 'Disponível no Chrome e no Edge para computador. Neste navegador, use o backup manual acima.' })];
  } else if (status === 'off') {
    body = [
      h('p', { class: 'muted', text: 'Escolha um arquivo no seu computador. O progresso será gravado nele automaticamente, poucos segundos depois de cada mudança.' }),
      h('button', {
        type: 'button', class: 'btn btn-primary', text: 'Ativar backup automático',
        onClick: run(async () => {
          await autoBackup.enable(app.store.get());
          app.dispatch(updateBackupMeta, { autoFileEnabled: true, autoFileError: null });
        }),
      }),
    ];
  } else if (status === 'needs-permission') {
    body = [
      h('p', { class: 'muted', text: 'O navegador pediu sua autorização de novo para gravar no arquivo de backup.' }),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn btn-primary', onClick: run(() => autoBackup.reconnect(app.store.get())), text: 'Reconectar backup automático' }),
        disableBtn()),
    ];
  } else {
    body = [
      h('p', { text: backup.lastAutoWriteAt ? `✅ Ativo. Último backup automático: ${formatDateTime(backup.lastAutoWriteAt)}.` : '✅ Ativo.' }),
      backup.autoFileError ? h('p', { class: 'field-error', text: `A última gravação falhou: ${backup.autoFileError}. Por segurança, exporte um backup manual.` }) : null,
      disableBtn(),
    ];
  }
  return h('section', { class: 'panel' }, h('h2', { text: 'Backup automático em arquivo' }), body);
}

async function reset(app) {
  if (confirm('Quer exportar um backup antes de zerar? (Recomendado)')) await exportNow(app);
  if (!confirm('Tem certeza? Todo o progresso deste navegador será apagado.')) return;
  app.dispatch(resetProgress);
  app.storage.removeItem(PRE_IMPORT_KEY);
  app.storage.flush();
  app.go('#/');
}

export function renderSettings(container, app) {
  const state = app.store.get();
  const fields = profileFields(state.profile);
  const saveProfile = () => {
    const data = fields.read();
    if (!data) return;
    app.dispatch(setProfile, data);
    app.layout.toast('Perfil atualizado.', { tone: 'success' });
  };
  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    fileInput.value = '';
    if (file && (await importFromFile(app, file))) {
      app.layout.toast('Progresso importado.', { tone: 'success' });
      app.refresh();
    }
  });
  const undo = () => {
    if (undoImport(app)) {
      app.layout.toast('Importação desfeita.', { tone: 'success' });
      app.refresh();
    }
  };
  mount(container,
    h('h1', { text: '⚙️ Configurações' }),
    h('section', { class: 'panel' },
      h('h2', { text: 'Perfil' }),
      fields.el,
      h('div', { class: 'actions' }, h('button', { type: 'button', class: 'btn btn-primary', onClick: saveProfile, text: 'Salvar perfil' }))),
    h('section', { class: 'panel' },
      h('h2', { text: 'Backup manual' }),
      h('p', { class: 'muted', text: state.backup.lastExportAt ? `Último backup exportado em ${formatDateTime(state.backup.lastExportAt)}.` : 'Você ainda não exportou nenhum backup.' }),
      h('div', { class: 'actions' },
        h('button', { type: 'button', class: 'btn btn-primary', onClick: async () => { await exportNow(app); app.refresh(); }, text: 'Exportar progresso' }),
        h('button', { type: 'button', class: 'btn', onClick: () => fileInput.click(), text: 'Importar progresso' }),
        canUndoImport(app) ? h('button', { type: 'button', class: 'btn btn-ghost', onClick: undo, text: 'Desfazer importação' }) : null),
      fileInput),
    autoBackupSection(app),
    h('section', { class: 'panel danger-zone' },
      h('h2', { text: 'Zerar progresso' }),
      h('p', { class: 'muted', text: 'Apaga perfil, progresso, cartas, conquistas e histórico deste navegador.' }),
      h('button', { type: 'button', class: 'btn btn-danger', onClick: () => reset(app), text: 'Zerar progresso' })),
    h('p', { class: 'small muted', text: `Privacidade: nenhum dado sai do seu aparelho. A ${APP_NAME} não usa rastreamento nem estatísticas de uso.` }));
}
