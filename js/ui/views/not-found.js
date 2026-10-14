import { h, mount } from '../dom.js';

export function renderNotFound(container) {
  mount(container, h('section', { class: 'panel center' },
    h('h1', { text: 'Página não encontrada' }),
    h('p', { class: 'muted', text: 'O endereço que você abriu não existe.' }),
    h('a', { class: 'btn', href: '#/', text: 'Voltar ao início' })));
}
