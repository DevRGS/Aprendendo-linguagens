import { h, mount, bar, pct, plural, formatDay, formatDateTime, formatDuration, toneFor } from '../dom.js';
import { levelInfo, displayStreak } from '../../core/gamification.js';
import { languageProgress } from '../../core/progress.js';
import { languageAccuracy, masteredCount, activityGrid, activityLevel, totals } from '../../core/stats.js';
import { weakPointsSection } from '../components/weak-points.js';
import { statCard } from '../components/common.js';

const KIND_LABEL = { practice: 'Prática', quiz: 'Quiz', exam: 'Prova', review: 'Revisão de erros' };

function heatmap(state, today) {
  const goal = state.profile.dailyGoal;
  const cells = activityGrid(state.xp.byDay, today, 12);
  const studied = cells.filter((c) => c.xp !== null).length;
  const describe = (c) => `${formatDay(c.day)}: ${c.xp === null ? 'sem estudo' : `${c.xp} XP`}`;
  return h('section', { class: 'panel' },
    h('div', { class: 'heatmap', role: 'img', 'aria-label': `Calendário de atividade das últimas 12 semanas: ${studied} ${plural(studied, 'dia', 'dias')} com estudo.` },
      cells.map((c) => h('span', { class: `hm-cell hm-${activityLevel(c.xp, goal)}`, title: describe(c) }))),
    h('div', { class: 'hm-legend muted small' },
      'Menos ', [0, 1, 2, 3, 4].map((n) => h('span', { class: `hm-cell hm-${n}` })), ' Mais'));
}

function languageCards(app, state) {
  return h('div', { class: 'grid langs' }, app.languages.map((l) => {
    const p = languageProgress(state, l);
    const acc = languageAccuracy(state, l.id);
    const mastered = masteredCount(state, `${l.id}.`);
    return h('div', { class: 'panel lang-card', style: { '--accent': l.color } },
      h('span', { class: 'lang-icon', text: l.icon }),
      h('strong', { text: l.name }),
      bar(p.percent, { label: `Progresso em ${l.name}` }),
      h('span', { class: 'small', text: `${p.lessonsDone}/${p.lessonsTotal} aulas · ${p.modulesDone}/${p.modulesTotal} módulos` }),
      h('span', { class: 'small muted', text: acc.rate === null ? 'Sem respostas ainda' : `${pct(acc.rate)} de acerto em ${acc.seen} respostas` }),
      h('span', { class: 'small muted', text: `${mastered} ${plural(mastered, 'carta dominada', 'cartas dominadas')}` }));
  }));
}

function achievementsGrid(app, state) {
  return h('div', { class: 'grid achievements' }, app.achievementTexts.map((a) => {
    const at = state.achievements[a.id];
    return h('div', { class: `achievement ${at ? 'unlocked' : 'locked'}` },
      h('span', { class: 'ach-icon', 'aria-hidden': 'true', text: a.icon }),
      h('div', {},
        h('strong', { text: a.name }),
        at ? null : h('span', { class: 'sr-only', text: '(bloqueada)' }),
        h('p', { class: 'small', text: at ? a.description : a.hint }),
        at ? h('p', { class: 'small muted', text: `Desbloqueada em ${formatDay(at)}` }) : null));
  }));
}

function historyList(state) {
  if (!state.history.length) return h('p', { class: 'muted', text: 'Seus quizzes, práticas e provas aparecem aqui.' });
  return h('ul', { class: 'history' }, state.history.map((e) => h('li', { class: 'panel history-item' },
    h('div', {},
      h('strong', { text: `${KIND_LABEL[e.kind] ?? e.kind}${e.kind === 'quiz' && e.mode === 'simulado' ? ' (simulado)' : ''}` }),
      h('p', { class: 'small muted', text: `${formatDateTime(e.at)} · ${e.scopeLabel || '—'} · ${formatDuration(e.durationSec)}` })),
    h('span', { class: `badge ${toneFor(e.total ? e.correct / e.total : 0)}`, text: `${e.correct}/${e.total}` }),
    e.wrongIds.length ? h('a', { class: 'btn btn-sm btn-ghost', href: `#/quiz?refazer=${encodeURIComponent(e.id)}`, text: 'Refazer erradas' }) : null)));
}

export async function renderProfile(container, app) {
  const state = app.store.get();
  const { today } = app.ctx();
  const info = levelInfo(state.xp.total);
  const t = totals(state);
  const streak = displayStreak(state.streak, today);
  const weak = await weakPointsSection(app, state);
  mount(container,
    h('section', { class: 'panel profile-head' },
      h('div', { class: 'avatar-big', 'aria-hidden': 'true', text: state.profile.avatar }),
      h('div', {},
        h('h1', { text: state.profile.name }),
        h('p', { class: 'muted', text: `Nível ${info.level} · ${info.title} · ${state.xp.total} XP no total` }),
        bar(info.progress, { label: 'Progresso para o próximo nível' }),
        h('p', { class: 'small muted', text: `${info.current}/${info.needed} XP para o nível ${info.level + 1}` }))),
    h('div', { class: 'grid stats' },
      statCard('Sequência', `🔥 ${streak} ${plural(streak, 'dia', 'dias')}`, `Recorde: ${state.streak.best} ${plural(state.streak.best, 'dia', 'dias')}`),
      statCard('Meta diária', `${state.profile.dailyGoal} XP`, `Cumprida em ${state.counters.goalDays} ${plural(state.counters.goalDays, 'dia', 'dias')}`),
      statCard('Perguntas', String(t.answered), t.accuracy === null ? 'Sem respostas ainda' : `${pct(t.accuracy)} de acerto`),
      statCard('Cartas revisadas', String(t.cardReviews), `${t.daysStudied} ${plural(t.daysStudied, 'dia', 'dias')} de estudo`)),
    h('h2', { text: 'Por linguagem' }),
    languageCards(app, state),
    weak,
    h('h2', { text: 'Atividade nas últimas 12 semanas' }),
    heatmap(state, today),
    h('h2', { text: 'Conquistas' }),
    achievementsGrid(app, state),
    h('h2', { text: 'Histórico' }),
    historyList(state));
}
