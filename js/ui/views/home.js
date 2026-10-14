import { h, mount, bar, pct, plural } from '../dom.js';
import { displayStreak } from '../../core/gamification.js';
import { isDue } from '../../core/srs.js';
import { languageProgress } from '../../core/progress.js';
import { findLesson, statCard } from '../components/common.js';
import { weakPointsSection } from '../components/weak-points.js';

export async function renderHome(container, app) {
  const state = app.store.get();
  const { today } = app.ctx();
  const goal = state.profile.dailyGoal;
  const xpToday = state.xp.byDay[today] ?? 0;
  const streak = displayStreak(state.streak, today);
  const due = Object.values(state.cards).filter((c) => isDue(c, today)).length;
  const last = state.lastLesson ? findLesson(app, state.lastLesson) : null;
  const weak = await weakPointsSection(app, state);
  mount(container,
    h('section', { class: 'hero' },
      h('h1', {}, `${state.profile.avatar} Olá, ${state.profile.name}!`),
      h('p', { class: 'muted', text: 'Um pouquinho por dia já faz diferença. Bora?' })),
    h('div', { class: 'grid stats' },
      statCard('Meta do dia', `${xpToday}/${goal} XP`, bar(xpToday / goal, { label: 'Meta do dia' })),
      statCard('Sequência', `🔥 ${streak} ${plural(streak, 'dia', 'dias')}`, `Recorde: ${state.streak.best} ${plural(state.streak.best, 'dia', 'dias')}`),
      statCard('Revisão do dia', `🧠 ${due} ${plural(due, 'carta', 'cartas')}`,
        h('a', { class: 'link', href: '#/flashcards', text: due ? 'Revisar agora →' : 'Abrir flashcards →' }))),
    last ? h('a', { class: 'panel continue', href: `#/${last.language.id}/${last.module.id}/${last.lesson.id}` },
      h('span', { class: 'eyebrow', text: 'Continuar de onde parou' }),
      h('strong', { text: `${last.language.icon} ${last.language.name} › ${last.module.title} › ${last.lesson.title}` })) : null,
    h('h2', { text: 'Linguagens' }),
    h('div', { class: 'grid langs' }, app.languages.map((l) => {
      const p = languageProgress(state, l);
      return h('a', { class: 'panel lang-card', href: `#/${l.id}`, style: { '--accent': l.color } },
        h('span', { class: 'lang-icon', text: l.icon }),
        h('strong', { text: l.name }),
        h('span', { class: 'muted small', text: `${p.lessonsDone}/${p.lessonsTotal} aulas · ${pct(p.percent)}` }),
        bar(p.percent, { label: `Progresso em ${l.name}` }));
    })),
    weak);
}
