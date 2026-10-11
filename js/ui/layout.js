import { h, mount } from './dom.js';
import { APP_NAME } from '../config.js';
import { levelInfo, displayStreak } from '../core/gamification.js';
import { isDue } from '../core/srs.js';
import { toDayKey } from '../core/dates.js';

const NAV = [
  { route: 'home', href: '#/', icon: '🏠', label: 'Início' },
  { route: 'quiz', href: '#/quiz', icon: '🎯', label: 'Quiz' },
  { route: 'flashcards', href: '#/flashcards', icon: '🧠', label: 'Flashcards', badge: true },
  { route: 'perfil', href: '#/perfil', icon: '👤', label: 'Perfil' },
  { route: 'config', href: '#/config', icon: '⚙️', label: 'Config' },
];

function goalRing(value, goal) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const p = Math.min(1, goal ? value / goal : 0);
  const svg = `<svg viewBox="0 0 36 36" width="34" height="34"><circle cx="18" cy="18" r="${r}" class="ring-bg"/>`
    + `<circle cx="18" cy="18" r="${r}" class="ring-fg" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${(c * (1 - p)).toFixed(2)}" transform="rotate(-90 18 18)"/></svg>`;
  return h('div', { class: 'goal', title: `Meta do dia: ${value}/${goal} XP` },
    h('span', { 'aria-hidden': 'true', html: svg }),
    h('span', {}, h('strong', { text: String(value) }), `/${goal} XP`));
}

export function createLayout(app) {
  const topbar = document.getElementById('topbar');
  const sidebar = document.getElementById('sidebar');
  const tabbar = document.getElementById('tabbar');
  const bannerBox = document.getElementById('banners');
  const toastBox = document.getElementById('toasts');
  const live = document.getElementById('sr-live');
  const banners = new Map();

  const navLinks = (routeName, due) => NAV.map((item) => h('a', {
    href: item.href,
    class: `nav-link${item.route === routeName ? ' active' : ''}`,
    'aria-current': item.route === routeName ? 'page' : null,
  },
  h('span', { class: 'nav-icon', 'aria-hidden': 'true', text: item.icon }),
  h('span', { class: 'nav-label', text: item.label }),
  item.badge && due ? h('span', { class: 'nav-badge', 'aria-label': `${due} cartas pendentes`, text: String(due) }) : null));

  function render(state, routeName) {
    const today = toDayKey(new Date());
    const { profile } = state;
    const due = Object.values(state.cards).filter((c) => isDue(c, today)).length;
    const info = levelInfo(state.xp.total);
    mount(topbar,
      h('a', { class: 'brand', href: '#/' },
        h('span', { class: 'brand-icon', 'aria-hidden': 'true', text: '</>' }),
        h('span', { class: 'brand-name', text: APP_NAME })),
      profile ? h('div', { class: 'topbar-stats' },
        goalRing(state.xp.byDay[today] ?? 0, profile.dailyGoal),
        h('span', { class: 'pill', title: 'Sequência de dias' }, '🔥 ', h('strong', { text: String(displayStreak(state.streak, today)) })),
        h('span', { class: 'pill pill-level', title: `${info.title} · ${state.xp.total} XP` }, '⭐ Nv ', h('strong', { text: String(info.level) })),
        h('a', { class: 'avatar', href: '#/perfil', 'aria-label': `Perfil de ${profile.name}`, text: profile.avatar })) : null);
    if (!profile) {
      sidebar.replaceChildren();
      tabbar.replaceChildren();
      return;
    }
    mount(sidebar,
      navLinks(routeName, due),
      h('p', { class: 'nav-section', text: 'Linguagens' }),
      app.languages.map((l) => h('a', { href: `#/${l.id}`, class: 'nav-link' },
        h('span', { class: 'nav-icon', 'aria-hidden': 'true', text: l.icon }),
        h('span', { class: 'nav-label', text: l.name }))));
    mount(tabbar, navLinks(routeName, due));
  }

  function renderBanners() {
    mount(bannerBox, [...banners.values()].map((b) => h('div', { class: `banner banner-${b.tone ?? 'info'}`, role: 'status' },
      h('span', { text: b.text }),
      h('span', { class: 'banner-actions' }, (b.actions ?? []).map((a) => h('button', { type: 'button', class: 'btn btn-sm', onClick: a.onClick, text: a.label }))))));
  }

  function setBanner(id, banner) {
    const current = banners.get(id);
    if (current && current.text === banner.text && current.tone === banner.tone) return;
    banners.set(id, banner);
    renderBanners();
  }

  function clearBanner(id) {
    if (banners.delete(id)) renderBanners();
  }

  function toast(text, { tone = 'info', timeout = 4000 } = {}) {
    const el = h('div', { class: `toast toast-${tone}`, text });
    toastBox.append(el);
    setTimeout(() => {
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 300);
    }, timeout);
  }

  function announce(text) {
    live.textContent = '';
    setTimeout(() => { live.textContent = text; }, 50);
  }

  return { render, setBanner, clearBanner, toast, announce };
}
