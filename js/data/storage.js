import { migrate } from '../core/state.js';
import { STORAGE_KEY, CORRUPT_KEY_PREFIX, SAVE_DEBOUNCE_MS } from '../config.js';

export function createStorage({ onExternalChange, onSaveError, debounceMs = SAVE_DEBOUNCE_MS } = {}) {
  let available = true;
  try {
    const probe = `${STORAGE_KEY}:probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
  } catch {
    available = false;
  }
  let pending = null;
  let timer = null;

  function writeNow() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (!pending || !available) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
      pending = null;
    } catch (err) {
      available = false;
      onSaveError?.(err);
    }
  }

  if (available) {
    window.addEventListener('pagehide', writeNow);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') writeNow();
    });
    window.addEventListener('storage', (event) => {
      if (event.key !== STORAGE_KEY || event.newValue === null) return;
      try {
        const result = migrate(JSON.parse(event.newValue));
        if (result.ok) onExternalChange?.(result.state);
      } catch {
        // outra aba gravou algo ilegível: ignoramos e seguimos com o estado atual
      }
    });
  }

  return {
    get available() { return available; },
    load() {
      if (!available) return { status: 'unavailable' };
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return { status: 'empty' };
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        return { status: 'corrupt', raw };
      }
      const result = migrate(parsed);
      if (result.ok) return { status: 'ok', state: result.state };
      return result.reason === 'newer' ? { status: 'newer', raw } : { status: 'corrupt', raw };
    },
    save(state) {
      pending = state;
      if (timer) clearTimeout(timer);
      timer = setTimeout(writeNow, debounceMs);
    },
    flush: writeNow,
    disable() {
      available = false;
      pending = null;
    },
    keepCorrupt(raw) {
      const key = `${CORRUPT_KEY_PREFIX}${new Date().toISOString()}`;
      try { localStorage.setItem(key, raw); } catch { /* sem espaço: não há o que fazer */ }
      return key;
    },
    getItem(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    setItem(key, value) {
      try { localStorage.setItem(key, value); return true; } catch { return false; }
    },
    removeItem(key) {
      try { localStorage.removeItem(key); } catch { /* ignora */ }
    },
  };
}
