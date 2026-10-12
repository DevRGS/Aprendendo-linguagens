import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom, tick } from '../helpers/dom.js';
import { makeTestApp, profileState, route, texts } from '../helpers/app.js';
import { createRouteHandler } from '../../js/app.js';
import { completeLesson } from '../../js/core/actions.js';
import { STORAGE_KEY, CORRUPT_KEY_PREFIX, REMINDER_DISMISS_KEY, AUTO_BACKUP_PAUSE_KEY } from '../../js/config.js';
import { CURRENT_SCHEMA } from '../../js/core/state.js';
import { toDayKey, addDays } from '../../js/core/dates.js';

setupDom();
const banners = () => texts(document.getElementById('banners'), '.banner > span:first-child');
const clearBanners = () => document.getElementById('banners').replaceChildren();

test('dados salvos são carregados e cada mudança volta a ser salva', async () => {
  const app = await makeTestApp({ state: profileState({ lastLesson: 'java.fundamentos.arrays' }) });
  assert.equal(app.store.get().lastLesson, 'java.fundamentos.arrays');
  const java = app.getLanguage('java');
  app.dispatch(completeLesson, { language: java, moduleId: 'fundamentos', lessonId: 'arrays', cards: [] });
  await tick(10);
  assert.ok(JSON.parse(localStorage.getItem(STORAGE_KEY)).lessons['java.fundamentos.arrays']);
});

test('dispatch anuncia XP de módulo, conquistas e níveis em avisos', async () => {
  const app = await makeTestApp({ state: profileState() });
  const java = app.getLanguage('java');
  const events = app.dispatch(completeLesson, { language: java, moduleId: 'fundamentos', lessonId: 'arrays', cards: [] });
  assert.equal(events.xpGained, 20);
  const msgs = texts(document, '#toasts .toast');
  assert.ok(msgs.includes('🏅 Conquista desbloqueada: Primeiros passos'));
});

test('ctx informa hoje no calendário local e as linguagens', async () => {
  const app = await makeTestApp();
  const ctx = app.ctx();
  assert.equal(ctx.today, toDayKey(new Date()));
  assert.equal(ctx.languages[0].id, 'java');
});

test('dados danificados: guarda uma cópia, avisa e começa do zero', async () => {
  clearBanners();
  const app = await makeTestApp({ raw: '{ quebrado' });
  assert.equal(app.store.get().profile, null);
  assert.equal(app.loadStatus, 'corrupt');
  assert.ok(Object.keys(localStorage).some((k) => k.startsWith(CORRUPT_KEY_PREFIX)));
  assert.ok(banners().some((b) => b.startsWith('Seu progresso salvo estava danificado')));
});

test('dados de versão mais nova: avisa e não grava nada', async () => {
  clearBanners();
  const raw = JSON.stringify({ ...profileState(), schema: CURRENT_SCHEMA + 1 });
  const app = await makeTestApp({ raw });
  assert.equal(app.loadStatus, 'newer');
  assert.ok(banners().some((b) => b.startsWith('Seu progresso foi salvo por uma versão mais nova')));
  app.dispatch(completeLesson, { language: app.getLanguage('java'), moduleId: 'fundamentos', lessonId: 'arrays', cards: [] });
  app.storage.flush();
  assert.equal(localStorage.getItem(STORAGE_KEY), raw);
});

test('backup automático só grava estado com progresso', async () => {
  const app = await makeTestApp({ state: profileState() });
  const scheduled = [];
  app.autoBackup.schedule = (s) => scheduled.push(s);
  app.store.set({ ...app.store.get(), lastLesson: 'x' });
  assert.equal(scheduled.length, 0);
  app.dispatch(completeLesson, { language: app.getLanguage('java'), moduleId: 'fundamentos', lessonId: 'arrays', cards: [] });
  assert.equal(scheduled.length, 1);
  app.store.set(app.store.get(), { backupMeta: true });
  app.store.set(app.store.get(), { external: true });
  assert.equal(scheduled.length, 1);
});

test('lembrete de backup aparece depois de 7 dias e "Depois" adia por 3 dias', async () => {
  clearBanners();
  const state = profileState({ xp: { total: 10, byDay: {} } });
  state.profile.createdAt = new Date(2020, 0, 1).toISOString();
  const app = await makeTestApp({ state });
  app.updateBanners(app.store.get());
  assert.ok(banners().some((b) => b.startsWith('Já faz um tempo desde o seu último backup')));
  const later = [...document.querySelectorAll('#banners button')].find((b) => b.textContent === 'Depois');
  later.click();
  assert.equal(localStorage.getItem(REMINDER_DISMISS_KEY), addDays(toDayKey(new Date()), 3));
  app.updateBanners(app.store.get());
  assert.ok(!banners().some((b) => b.startsWith('Já faz um tempo')));
});

test('backup automático aguardando permissão mostra o aviso de reconectar', async () => {
  clearBanners();
  const app = await makeTestApp({ state: profileState() });
  app.autoBackup.status = () => 'needs-permission';
  app.updateBanners(app.store.get());
  assert.ok(banners().some((b) => b.startsWith('O backup automático precisa da sua permissão')));
  app.autoBackup.status = () => 'on';
  app.updateBanners(app.store.get());
  assert.ok(!banners().some((b) => b.startsWith('O backup automático precisa')));
});

test('rotas: sem perfil abre a primeira visita; com perfil abre a tela pedida; rota desconhecida vira "não encontrada"', async () => {
  const main = document.getElementById('main');
  const app = await makeTestApp();
  const onRoute = createRouteHandler(app, main, {
    home: async (el) => { el.textContent = 'tela inicial'; },
    notFound: (el) => { el.textContent = 'não encontrada'; },
  });
  await onRoute(route('home'));
  assert.match(main.textContent, /Boas-vindas/);
  app.store.set(profileState());
  await onRoute(route('home'));
  assert.equal(main.textContent, 'tela inicial');
  await onRoute(route('inexistente'));
  assert.equal(main.textContent, 'não encontrada');
});

test('rotas: erro ao montar a tela mostra aviso com "Tentar de novo"', async () => {
  const main = document.getElementById('main');
  const app = await makeTestApp({ state: profileState() });
  let attempts = 0;
  const onRoute = createRouteHandler(app, main, {
    home: async () => { attempts += 1; if (attempts === 1) throw new Error('rede'); },
    notFound: () => {},
  });
  const original = console.error;
  console.error = () => {};
  try {
    await onRoute(route('home'));
  } finally {
    console.error = original;
  }
  assert.match(main.textContent, /Não foi possível carregar esta página/);
  main.querySelector('button').click();
  await tick(10);
  assert.equal(attempts, 2);
});

test('rotas: a limpeza da tela anterior roda ao trocar de tela, e respostas atrasadas são descartadas', async () => {
  const main = document.getElementById('main');
  const app = await makeTestApp({ state: profileState() });
  let cleaned = 0;
  let releaseSlow;
  const onRoute = createRouteHandler(app, main, {
    home: async (el) => { el.textContent = 'home'; return () => { cleaned += 1; }; },
    quiz: (el) => new Promise((resolve) => { releaseSlow = () => { el.textContent = 'lento'; resolve(() => { cleaned += 10; }); }; }),
    notFound: (el) => { el.textContent = 'nf'; },
  });
  await onRoute(route('home'));
  const slow = onRoute(route('quiz'));
  assert.equal(cleaned, 1);
  await onRoute(route('home'));
  releaseSlow();
  await slow;
  assert.equal(main.textContent, 'home');
  assert.equal(cleaned, 11);
});

test('dados danificados pausam o backup automático também nas próximas visitas', async () => {
  clearBanners();
  const app = await makeTestApp({ raw: '{ quebrado' });
  assert.equal(localStorage.getItem(AUTO_BACKUP_PAUSE_KEY), '1');
  assert.equal(app.isAutoBackupPaused(), true);
  const scheduled = [];
  app.autoBackup.schedule = (s) => scheduled.push(s);
  app.store.set(profileState());
  app.dispatch(completeLesson, { language: app.getLanguage('java'), moduleId: 'fundamentos', lessonId: 'arrays', cards: [] });
  assert.equal(scheduled.length, 0);
  app.updateBanners(app.store.get());
  assert.ok(banners().some((b) => b.startsWith('O backup automático está pausado')));
});

test('retomar o backup automático tira a pausa e volta a agendar', async () => {
  clearBanners();
  const app = await makeTestApp({ state: profileState() });
  localStorage.setItem(AUTO_BACKUP_PAUSE_KEY, '1');
  let inits = 0;
  app.autoBackup.init = async () => { inits += 1; return 'off'; };
  const scheduled = [];
  app.autoBackup.schedule = (s) => scheduled.push(s);
  await app.resumeAutoBackup();
  assert.equal(app.isAutoBackupPaused(), false);
  assert.equal(inits, 1);
  assert.ok(!banners().some((b) => b.startsWith('O backup automático está pausado')));
  app.dispatch(completeLesson, { language: app.getLanguage('java'), moduleId: 'fundamentos', lessonId: 'arrays', cards: [] });
  assert.equal(scheduled.length, 1);
});
