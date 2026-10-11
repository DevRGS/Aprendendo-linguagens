// Monta um "app" de verdade (createApp) para testar telas e fluxos, com conteúdo lido do disco,
// Markdown local, armazenamento do jsdom e backup automático em memória.
import { installFetchFromDisk } from './fetch-from-disk.js';
import { initTestMarkdown } from './markdown.js';
import { loadLanguages, loadAchievementTexts } from '../../js/data/content.js';
import { createApp } from '../../js/app.js';
import { createInitialState } from '../../js/core/state.js';
import { STORAGE_KEY } from '../../js/config.js';

export function memoryStore() {
  const map = new Map();
  return { map, get: async (k) => map.get(k), set: async (k, v) => { map.set(k, v); }, delete: async (k) => { map.delete(k); } };
}

export function profileState(extra = {}) {
  return {
    ...createInitialState(),
    profile: { name: 'Rafa', avatar: '🦊', dailyGoal: 50, createdAt: new Date(2026, 9, 1, 12).toISOString() },
    ...extra,
  };
}

// Chame setupDom() no arquivo de teste antes.
export async function makeTestApp({ state = null, raw = null } = {}) {
  installFetchFromDisk();
  await initTestMarkdown();
  const [languages, achievementTexts] = await Promise.all([loadLanguages(), loadAchievementTexts()]);
  localStorage.clear();
  if (raw !== null) localStorage.setItem(STORAGE_KEY, raw);
  else if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const app = createApp({
    languages,
    achievementTexts,
    storageOptions: { debounceMs: 0 },
    autoBackupOptions: { store: memoryStore(), debounceMs: 0 },
  });
  app.refreshes = 0;
  app.refresh = () => { app.refreshes += 1; };
  return app;
}

export const route = (name, params = {}, query = {}) => ({ name, params, query });
export const container = () => document.createElement('div');
export const texts = (el, selector) => [...el.querySelectorAll(selector)].map((n) => n.textContent.trim());
