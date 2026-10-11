import { h } from '../dom.js';
import { hasStudiedModule } from '../../core/progress.js';

export function createScopeTree(app, { state, selected = null } = {}) {
  const allKeys = app.languages.flatMap((l) => l.modules.map((m) => m.key));
  const chosen = new Set(selected ?? allKeys);
  const listeners = [];
  const moduleBoxes = new Map();
  const langBoxes = new Map();

  function sync() {
    for (const [key, box] of moduleBoxes) box.checked = chosen.has(key);
    for (const l of app.languages) {
      const keys = l.modules.map((m) => m.key);
      const count = keys.filter((k) => chosen.has(k)).length;
      const box = langBoxes.get(l.id);
      box.checked = count === keys.length;
      box.indeterminate = count > 0 && count < keys.length;
    }
  }

  function changed() {
    sync();
    for (const fn of listeners) fn([...chosen]);
  }

  function setTo(keys) {
    chosen.clear();
    keys.forEach((k) => chosen.add(k));
    changed();
  }

  const studied = () => app.languages.flatMap((l) => l.modules.filter((m) => hasStudiedModule(state, l, m)).map((m) => m.key));
  const chip = (label, onClick) => h('button', { type: 'button', class: 'chip', onClick, text: label });

  const el = h('div', { class: 'scope-tree' },
    h('div', { class: 'chips' },
      chip('Tudo', () => setTo(allKeys)),
      chip('Só o que já estudei', () => setTo(studied())),
      app.languages.map((l) => chip(`${l.name} inteiro`, () => setTo(l.modules.map((m) => m.key))))),
    app.languages.map((l) => {
      const keys = l.modules.map((m) => m.key);
      const langBox = h('input', { type: 'checkbox' });
      langBoxes.set(l.id, langBox);
      langBox.addEventListener('change', () => {
        keys.forEach((k) => (langBox.checked ? chosen.add(k) : chosen.delete(k)));
        changed();
      });
      return h('div', { class: 'scope-lang' },
        h('label', { class: 'check strong' }, langBox, ` ${l.icon} ${l.name}`),
        h('div', { class: 'scope-mods' }, l.modules.map((m) => {
          const box = h('input', { type: 'checkbox' });
          moduleBoxes.set(m.key, box);
          box.addEventListener('change', () => {
            if (box.checked) chosen.add(m.key);
            else chosen.delete(m.key);
            changed();
          });
          return h('label', { class: 'check' }, box, ` ${m.title}`);
        })));
    }));
  sync();
  return { el, getSelected: () => [...chosen], onChange: (fn) => listeners.push(fn) };
}

export function describeScope(app, keys) {
  const set = new Set(keys);
  const parts = [];
  let everything = true;
  for (const l of app.languages) {
    const mods = l.modules.filter((m) => set.has(m.key));
    if (mods.length !== l.modules.length) everything = false;
    if (!mods.length) continue;
    parts.push(mods.length === l.modules.length ? `${l.name} inteiro` : `${l.name} › ${mods.map((m) => m.title).join(', ')}`);
  }
  if (everything && app.languages.length > 1) return 'Tudo';
  return parts.join(' + ') || '—';
}
