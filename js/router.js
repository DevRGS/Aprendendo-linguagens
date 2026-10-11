export const RESERVED_ROUTES = new Set(['quiz', 'flashcards', 'perfil', 'config']);

export function parseRoute(hash) {
  const raw = String(hash ?? '').replace(/^#/, '');
  const [pathPart, queryPart = ''] = raw.split('?');
  const query = Object.fromEntries(new URLSearchParams(queryPart));
  const route = (name, params = {}) => ({ name, params, query });
  let parts;
  try {
    parts = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  } catch {
    return route('notFound');
  }
  if (parts.length === 0) return route('home');
  if (RESERVED_ROUTES.has(parts[0])) return parts.length === 1 ? route(parts[0]) : route('notFound');
  const [lang, a, b] = parts;
  if (parts.length === 1) return route('language', { lang });
  if (parts.length === 2) {
    if (a === 'referencia') return route('reference', { lang });
    if (a === 'prova') return route('exam', { lang });
    if (a === 'certificado') return route('certificate', { lang });
    return route('notFound');
  }
  if (parts.length === 3) {
    if (b === 'pratica') return route('practice', { lang, module: a });
    return route('lesson', { lang, module: a, lesson: b });
  }
  return route('notFound');
}

let onRouteHandler = null;
let guard = null;
let currentHash = null;
let ignoreNext = false;

export function setLeaveGuard(fn) {
  guard = fn;
}

export const hasLeaveGuard = () => Boolean(guard);

function handleHashChange() {
  if (ignoreNext) {
    ignoreNext = false;
    return;
  }
  if (guard && currentHash !== null && location.hash !== currentHash && !guard()) {
    ignoreNext = true;
    location.hash = currentHash;
    return;
  }
  guard = null;
  currentHash = location.hash;
  onRouteHandler(parseRoute(location.hash));
}

export function startRouter(onRoute) {
  onRouteHandler = onRoute;
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
}

export function navigate(hash) {
  location.hash = hash;
}

export function refresh() {
  guard = null;
  if (onRouteHandler) onRouteHandler(parseRoute(location.hash));
}
