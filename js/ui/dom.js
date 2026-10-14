function append(el, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function h(tag, props = {}, ...children) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === 'class') el.className = value;
    else if (key === 'text') el.textContent = value;
    else if (key === 'html') el.innerHTML = value; // só para conteúdo confiável (content/ ou SVG gerado aqui)
    else if (key === 'style' && typeof value === 'object') {
      for (const [prop, v] of Object.entries(value)) el.style.setProperty(prop, v);
    } else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2).toLowerCase(), value);
    else if (value === true) el.setAttribute(key, '');
    else el.setAttribute(key, String(value));
  }
  append(el, children);
  return el;
}

export function mount(container, ...children) {
  container.replaceChildren();
  append(container, children);
}

export function bar(value, { tone = null, label = null } = {}) {
  const v = Math.max(0, Math.min(1, value || 0));
  return h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(v * 100), 'aria-label': label },
    h('div', { class: `bar-fill${tone ? ` tone-${tone}` : ''}`, style: { width: `${v * 100}%` } }));
}

export const pct = (v) => `${Math.round((v || 0) * 100)}%`;
export const toneFor = (rate) => (rate >= 0.8 ? 'success' : rate >= 0.6 ? 'warning' : 'danger');
export const plural = (n, one, many) => (n === 1 ? one : many);

export function formatDay(dayKey) {
  const [y, m, d] = dayKey.split('-');
  return `${d}/${m}/${y}`;
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function formatDuration(totalSec) {
  const s = Math.max(0, Math.round(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m ? `${m} min ${String(r).padStart(2, '0')} s` : `${r} s`;
}
