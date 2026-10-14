import { h } from '../dom.js';
import { AVATARS, GOAL_OPTIONS } from '../../config.js';

export function profileFields(profile = null) {
  let avatar = profile?.avatar ?? AVATARS[0];
  let goal = profile?.dailyGoal ?? 50;
  const nameInput = h('input', { id: 'pf-name', type: 'text', maxlength: 60, autocomplete: 'nickname', required: true });
  nameInput.value = profile?.name ?? '';
  const error = h('p', { class: 'field-error', 'aria-live': 'polite' });
  const avatarGroup = h('div', { class: 'avatar-grid', role: 'radiogroup', 'aria-label': 'Avatar' });
  const goalGroup = h('div', { class: 'goal-options', role: 'radiogroup', 'aria-label': 'Meta diária' });

  function drawAvatars(focus = false) {
    avatarGroup.replaceChildren(...AVATARS.map((a) => h('button', {
      type: 'button', class: `avatar-opt${a === avatar ? ' selected' : ''}`, role: 'radio', 'aria-checked': String(a === avatar), 'aria-label': `Avatar ${a}`,
      onClick: () => { avatar = a; drawAvatars(true); },
    }, a)));
    if (focus) avatarGroup.querySelector('.selected')?.focus();
  }

  function drawGoals(focus = false) {
    goalGroup.replaceChildren(...GOAL_OPTIONS.map((g) => h('button', {
      type: 'button', class: `goal-opt${g.xp === goal ? ' selected' : ''}`, role: 'radio', 'aria-checked': String(g.xp === goal),
      onClick: () => { goal = g.xp; drawGoals(true); },
    }, h('strong', { text: g.label }), h('small', { text: g.hint }))));
    if (focus) goalGroup.querySelector('.selected')?.focus();
  }

  drawAvatars();
  drawGoals();
  const el = h('div', { class: 'profile-fields' },
    h('label', { for: 'pf-name', class: 'field-label', text: 'Seu nome (aparece no certificado)' }), nameInput, error,
    h('p', { class: 'field-label', text: 'Escolha um avatar' }), avatarGroup,
    h('p', { class: 'field-label', text: 'Meta diária' }), goalGroup);

  return {
    el,
    read() {
      const name = nameInput.value.trim();
      if (!name) {
        error.textContent = 'Digite seu nome.';
        nameInput.focus();
        return null;
      }
      error.textContent = '';
      return { name, avatar, dailyGoal: goal };
    },
  };
}
