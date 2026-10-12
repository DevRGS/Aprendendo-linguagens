// Monta a aplicação: estado, armazenamento, backup automático, avisos e rotas.
// main.js só chama boot(); aqui fica tudo o que dá para testar.
import { createInitialState } from './core/state.js';
import { toDayKey, addDays } from './core/dates.js';
import { needsBackupReminder, hasProgress } from './core/backup-format.js';
import { levelInfo } from './core/gamification.js';
import { updateBackupMeta, pruneOrphans } from './core/actions.js';
import { createStore } from './ui/store.js';
import { createStorage } from './data/storage.js';
import { createAutoBackup } from './data/backup.js';
import { loadLanguages, loadAchievementTexts, loadBanks } from './data/content.js';
import { initMarkdown } from './ui/markdown.js';
import { createLayout } from './ui/layout.js';
import { h, mount } from './ui/dom.js';
import { errorPanel } from './ui/components/common.js';
import { exportNow } from './ui/backup-flow.js';
import { VIEWS } from './ui/views/index.js';
import { renderOnboarding } from './ui/views/onboarding.js';
import { startRouter, navigate, refresh, setLeaveGuard, hasLeaveGuard } from './router.js';
import { APP_NAME, REMINDER_DISMISS_KEY, REMINDER_SNOOZE_DAYS, AUTO_BACKUP_PAUSE_KEY } from './config.js';

const loading = () => h('p', { class: 'loading', text: 'Carregando…' });

export function createApp({ languages, achievementTexts, storageOptions = {}, autoBackupOptions = {} }) {
  const app = { languages, achievementTexts, getLanguage: (id) => languages.find((l) => l.id === id), currentRoute: null };
  const layout = createLayout(app);
  const noStorage = () => layout.setBanner('storage', {
    tone: 'danger',
    text: 'Seu progresso não está sendo salvo neste navegador. Exporte um backup antes de fechar a página.',
  });

  let store = null;
  const storage = createStorage({
    ...storageOptions,
    onExternalChange: (state) => {
      store.set(state, { external: true });
      if (!hasLeaveGuard()) app.refresh();
    },
    onSaveError: noStorage,
  });
  const loaded = storage.load();
  store = createStore(loaded.status === 'ok' ? loaded.state : createInitialState());

  if (loaded.status === 'unavailable') noStorage();
  // Com dados danificados ou de versão mais nova, o backup automático fica pausado (também nas próximas visitas)
  // até a pessoa importar um backup ou retomar de propósito: o arquivo em disco pode ser justamente a cópia boa.
  if (loaded.status === 'corrupt' || loaded.status === 'newer') storage.setItem(AUTO_BACKUP_PAUSE_KEY, '1');
  if (loaded.status === 'corrupt') {
    storage.keepCorrupt(loaded.raw);
    layout.setBanner('corrupt', {
      tone: 'warning',
      text: 'Seu progresso salvo estava danificado. Guardamos uma cópia e começamos do zero. Se você tiver um backup, importe-o em Configurações.',
      actions: [{ label: 'Abrir Configurações', onClick: () => navigate('#/config') }],
    });
  }
  if (loaded.status === 'newer') {
    storage.disable();
    layout.setBanner('newer', {
      tone: 'danger',
      text: 'Seu progresso foi salvo por uma versão mais nova do site. Recarregue a página para atualizar. Até lá, nada será salvo.',
    });
  }

  const ctx = () => {
    const now = new Date();
    return { now, today: toDayKey(now), languages };
  };
  const achievementName = (id) => achievementTexts.find((a) => a.id === id)?.name ?? id;

  function announce(events) {
    if (events.moduleCompleted) layout.toast('🎉 Módulo concluído! +50 XP', { tone: 'success' });
    if (events.examPassed) layout.toast('🏆 Você passou na prova! +200 XP', { tone: 'success' });
    if (events.levelUp) layout.toast(`⬆️ Nível ${events.levelUp}: ${levelInfo(store.get().xp.total).title}!`, { tone: 'success' });
    for (const id of events.achievements) layout.toast(`🏅 Conquista desbloqueada: ${achievementName(id)}`, { tone: 'success', timeout: 6000 });
  }

  function dispatch(action, payload = {}, meta = {}) {
    const { state, events } = action(store.get(), payload, ctx());
    if (state !== store.get()) store.set(state, meta);
    announce(events);
    return events;
  }

  const autoBackup = createAutoBackup({
    ...autoBackupOptions,
    onWrite: (at) => dispatch(updateBackupMeta, { lastAutoWriteAt: at, autoFileError: null }, { backupMeta: true }),
    onError: (message) => dispatch(updateBackupMeta, { autoFileError: message }, { backupMeta: true }),
  });

  const isAutoBackupPaused = () => Boolean(storage.getItem(AUTO_BACKUP_PAUSE_KEY));

  async function resumeAutoBackup() {
    storage.removeItem(AUTO_BACKUP_PAUSE_KEY);
    await autoBackup.init().catch(() => {});
    updateBanners(store.get());
  }

  function updateBanners(state) {
    if (isAutoBackupPaused()) {
      layout.setBanner('paused', {
        tone: 'warning',
        text: 'O backup automático está pausado porque o progresso salvo neste navegador não pôde ser lido. O arquivo de backup não será alterado até você importar um backup ou retomar em Configurações.',
        actions: [{ label: 'Abrir Configurações', onClick: () => navigate('#/config') }],
      });
    } else {
      layout.clearBanner('paused');
    }
    const status = autoBackup.status();
    if (status === 'needs-permission') {
      layout.setBanner('reconnect', {
        text: 'O backup automático precisa da sua permissão para continuar gravando.',
        actions: [{
          label: 'Reconectar backup automático',
          onClick: async () => {
            await autoBackup.reconnect(store.get());
            updateBanners(store.get());
          },
        }],
      });
    } else {
      layout.clearBanner('reconnect');
    }
    const today = toDayKey(new Date());
    const remind = needsBackupReminder({
      state,
      today,
      dismissedUntil: storage.getItem(REMINDER_DISMISS_KEY),
      autoHealthy: status === 'on' && !state.backup.autoFileError,
    });
    if (remind) {
      layout.setBanner('reminder', {
        text: 'Já faz um tempo desde o seu último backup. Que tal exportar o progresso agora?',
        actions: [
          { label: 'Exportar agora', onClick: () => exportNow(app) },
          {
            label: 'Depois',
            onClick: () => {
              storage.setItem(REMINDER_DISMISS_KEY, addDays(today, REMINDER_SNOOZE_DAYS));
              layout.clearBanner('reminder');
            },
          },
        ],
      });
    } else {
      layout.clearBanner('reminder');
    }
  }

  Object.assign(app, {
    store, storage, layout, autoBackup, dispatch, ctx, navigate, refresh, setLeaveGuard, updateBanners,
    isAutoBackupPaused, resumeAutoBackup,
    loadStatus: loaded.status,
    go: (hash) => (location.hash === hash ? app.refresh() : navigate(hash)),
  });

  store.subscribe((state, meta) => {
    if (!meta.external) storage.save(state);
    // Um estado sem progresso (recém-zerado ou recomeçado após dados danificados) nunca sobrescreve o arquivo de backup.
    if (!meta.external && !meta.backupMeta && hasProgress(state) && !isAutoBackupPaused()) autoBackup.schedule(state);
    layout.render(state, app.currentRoute?.name);
    updateBanners(state);
  });

  return app;
}

export function createRouteHandler(app, main, views = VIEWS) {
  let renderToken = 0;
  let cleanup = null;
  return async function onRoute(route) {
    app.currentRoute = route;
    const token = ++renderToken;
    cleanup?.();
    cleanup = null;
    mount(main, loading());
    const target = h('div', { class: 'view' });
    try {
      app.layout.render(app.store.get(), route.name);
      const view = app.store.get().profile ? (views[route.name] ?? views.notFound) : renderOnboarding;
      const result = await view(target, app, route);
      if (token !== renderToken) {
        if (typeof result === 'function') result();
        return;
      }
      cleanup = typeof result === 'function' ? result : null;
      mount(main, target);
    } catch (err) {
      console.error(err);
      if (token === renderToken) mount(main, errorPanel('Não foi possível abrir esta página. Tente de novo; se o problema continuar, confira sua conexão.', () => onRoute(route)));
    }
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  };
}

export function start(languages, achievementTexts, options = {}) {
  const app = createApp({ languages, achievementTexts, ...options });
  const onRoute = createRouteHandler(app, document.getElementById('main'));
  const oops = () => app.layout.toast('Algo deu errado. Seu progresso salvo não foi afetado.', { tone: 'danger' });
  window.addEventListener('error', oops);
  window.addEventListener('unhandledrejection', oops);
  app.updateBanners(app.store.get());
  if (!app.isAutoBackupPaused()) app.autoBackup.init().catch(() => {}).finally(() => app.updateBanners(app.store.get()));
  startRouter(onRoute);
  // Só com o conteúdo inteiro carregado dá para saber o que sumiu; se algo falhar, não se apaga nada.
  loadBanks(languages)
    .then((bank) => app.dispatch(pruneOrphans, {
      cardIds: new Set(bank.cards.map((c) => c.id)),
      questionIds: new Set(bank.questions.map((q) => q.id)),
    }))
    .catch(() => {});
  return app;
}

export async function boot(options = {}) {
  const main = document.getElementById('main');
  document.title = APP_NAME;
  mount(main, loading());
  let languages;
  let achievementTexts;
  try {
    [languages, achievementTexts] = await Promise.all([loadLanguages(), loadAchievementTexts(), initMarkdown()]);
  } catch (err) {
    console.error(err);
    mount(main, errorPanel('Não foi possível carregar a Central. Confira sua conexão com a internet.', () => boot(options)));
    return null;
  }
  return start(languages, achievementTexts, options);
}
