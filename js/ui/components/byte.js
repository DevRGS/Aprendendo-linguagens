import { h } from '../dom.js';

const part = (name, ...children) => h('span', { class: `byte-${name}` }, children);
export const byteMode = (profile) => profile?.settings?.byte ?? 'animated';

// As poses compartilham a mesma silhueta. As articulações e a expressão mudam por CSS.
export function byteFigure(profile, pose = 'idle') {
  if (byteMode(profile) === 'off') return null;
  return h('span', { class: `byte byte--${pose} byte--${byteMode(profile)}`, 'aria-hidden': 'true' },
    part('figure',
      part('leg left'), part('leg right'),
      part('case', part('antenna'), part('arm left'), part('arm right'),
        part('visor', part('eye left'), part('eye right'), part('mouth')), part('vent'))));
}

export function byteCompanion(profile, { pose, speech, action }) {
  if (byteMode(profile) === 'off') return null;
  return h('details', { class: 'byte-companion', open: true, 'aria-label': 'Byte, seu companheiro de estudos' },
    h('summary', { text: 'Byte' }),
    h('div', { class: 'byte-lane' }, byteFigure(profile, pose)),
    action || h('p', { class: 'byte-speech', text: speech }));
}

export function byteLessonHint(profile, href) {
  if (byteMode(profile) === 'off') return null;
  return h('details', { class: 'lesson-hint' },
    h('summary', {}, byteFigure(profile), 'Estudar com Byte'),
    h('a', { href, class: 'link', text: 'Praticar as questões deste módulo →' }));
}
