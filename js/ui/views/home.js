import { h, mount, bar, pct, plural, formatDay } from '../dom.js';
import { displayStreak } from '../../core/gamification.js';
import { diffDays } from '../../core/dates.js';
import { resumoIntensiva } from '../../core/intensiva.js';
import { isDue } from '../../core/srs.js';
import { languageProgress } from '../../core/progress.js';
import { findLesson } from '../components/common.js';
import { weakPointsSection } from '../components/weak-points.js';
import { byteCompanion } from '../components/byte.js';
import { nextStudyStep } from '../components/study-path.js';

const dayStates = {
  empty: ['·', 'Sem atividade registrada'],
  studied: ['◐', 'Estudou · meta não atingida'],
  goal: ['✓', 'Meta atingida'],
  unknown: ['◇', 'Estudou · meta histórica desconhecida'],
};
const weekDay = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' });
const dayCount = (n) => `${n} ${plural(n, 'dia', 'dias')}`;

function weekCard(state, today) {
  const { days, goal, current, best } = resumoIntensiva(state, today);
  const xp = state.xp.byDay[today] ?? 0;
  const streak = displayStreak(state.streak, today);
  return h('section', { class: 'panel week' },
    h('div', { class: 'week-heading' }, h('h2', { text: 'Sua Intensiva' }),
      h('span', { class: 'week-count', text: `${dayCount(current)} de meta` })),
    h('ol', { class: 'week-days', 'aria-label': 'Últimos sete dias de estudo' }, days.map((day) => {
      const [icon, description] = dayStates[day.status];
      const label = day.date === today && day.status === 'studied' ? 'Estudou · meta em andamento' : description;
      const stamp = `${formatDay(day.date)} · ${label} · ${day.xp} XP${day.goal ? ` de ${day.goal}` : ''}`;
      return h('li', { class: `day day-${day.status}`, title: stamp, 'aria-current': day.date === today ? 'date' : null },
        h('span', { 'aria-hidden': 'true', text: weekDay.format(new Date(`${day.date}T12:00:00`)).replace('.', '') }),
        h('strong', { 'aria-hidden': 'true', text: icon }), h('span', { class: 'sr-only', text: stamp }));
    })),
    h('div', { class: 'week-progress' }, h('span', {}, 'Hoje · ', h('strong', { class: 'stat-value', text: `${xp}/${goal} XP` })),
      h('span', { class: 'small', text: days.at(-1).status === 'goal' ? 'Meta atingida' : xp < goal ? `Faltam ${goal - xp} XP` : 'Faça uma atividade para registrar a meta' })),
    bar(xp / goal, { label: 'Meta do dia' }),
    h('p', { class: 'small muted week-streak' },
      days.at(-1).status !== 'goal' ? 'Hoje em andamento · ' : '',
      `Melhor Intensiva: ${dayCount(best)}. Sequência de estudo: `,
      h('strong', { class: 'stat-value', text: `🔥 ${dayCount(streak)}` }), `. Recorde: ${dayCount(state.streak.best)}.`));
}

export async function renderHome(container, app) {
  const state = app.store.get();
  const { today } = app.ctx();
  const due = Object.values(state.cards).filter((c) => isDue(c, today)).length;
  const last = findLesson(app, state.lastLesson);
  const language = last?.language ?? app.languages.find((l) => Object.keys(state.lessons).some((k) => k.startsWith(`${l.id}.`)));
  const step = language && nextStudyStep(state, language);
  const weak = await weakPointsSection(app, state);
  const catalogTitle = h('h2', { text: 'Trilhas de aprendizagem', tabindex: '-1' });
  const choose = () => {
    catalogTitle.focus();
    catalogTitle.scrollIntoView?.({ block: 'center' });
  };
  const paused = state.streak.lastDay && diffDays(state.streak.lastDay, today) >= 2;
  const reviewHref = '#/flashcards?modo=pendentes';
  const welcomeBack = step || paused || app.hasSeenHome;
  app.hasSeenHome = true;
  let returnAction = null;
  if (paused) {
    returnAction = due || language
      ? h('a', { class: 'link byte-speech', href: due ? reviewHref : `#/${language.id}`,
        text: due ? 'Vamos começar com uma revisão?' : 'Vamos retomar sua trilha?' })
      : h('button', { type: 'button', class: 'link-btn byte-speech', onClick: choose, text: 'Vamos escolher uma trilha?' });
  }
  mount(container,
    h('h1', { class: 'home-greeting', text: `${state.profile.avatar} Olá, ${state.profile.name}!` }),
    h('section', { class: 'panel resume' },
      h('div', { class: 'resume-content' },
        h('p', { class: 'eyebrow', text: step ? `${language.name}${step.detail ? ` › ${step.detail}` : ''}` : 'Seu primeiro passo' }),
        h('h2', { text: step?.title ?? 'O que você quer aprender?' }),
        step?.minutes ? h('p', { class: 'muted small', text: `${step.minutes} min de leitura` }) : null,
        step ? h('a', { class: 'btn btn-primary continue', href: step.href, 'aria-label': `${step.action}: ${step.title}`, text: step.action })
          : h('button', { class: 'btn btn-primary', type: 'button', onClick: choose, text: 'Escolher uma trilha' })),
      byteCompanion(state.profile, { pose: welcomeBack ? 'walk' : 'wave', action: returnAction,
        speech: step ? 'Pronto para continuar?' : 'Por onde você quer começar?' })),
    h('div', { class: 'study-dashboard' },
      weekCard(state, today),
      h('section', { class: 'panel review-today' }, h('h2', { text: 'Revisão do dia' }),
        h('strong', { class: 'stat-value', text: `🧠 ${due} ${plural(due, 'carta', 'cartas')}` }),
        h('a', { class: 'link', href: due ? reviewHref : '#/flashcards', text: due ? 'Revisar pendentes →' : 'Abrir flashcards →' }))),
    catalogTitle,
    h('div', { class: 'grid langs' }, app.languages.map((l) => {
      const p = languageProgress(state, l);
      return h('a', { class: 'panel lang-card', href: `#/${l.id}`, style: { '--accent': l.color } },
        h('span', { class: 'lang-icon', text: l.icon }),
        h('strong', { text: l.name }),
        h('span', { class: 'muted small', text: `${p.lessonsDone}/${p.lessonsTotal} aulas · ${pct(p.percent)}` }),
        bar(p.percent, { label: `Progresso em ${l.name}` }));
    })),
    h('a', { class: 'btn', href: '#/projetos', text: 'Explorar projetos práticos →' }),
    weak);
}
