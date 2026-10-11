import { h, mount } from '../dom.js';
import { APP_NAME } from '../../config.js';
import { setProfile } from '../../core/actions.js';
import { profileFields } from '../components/profile-fields.js';
import { importFromFile } from '../backup-flow.js';

export function renderOnboarding(container, app) {
  const fields = profileFields();
  const fileInput = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    fileInput.value = '';
    if (file && (await importFromFile(app, file))) app.refresh();
  });
  const form = h('form', { class: 'panel onboarding' },
    h('h1', { text: `Boas-vindas à ${APP_NAME}! 👋` }),
    h('p', { class: 'muted', text: 'Aulas curtas, quizzes e flashcards para aprender programação. É gratuito, e o seu progresso fica salvo neste navegador.' }),
    fields.el,
    h('div', { class: 'actions' }, h('button', { type: 'submit', class: 'btn btn-primary', text: 'Começar a estudar' })),
    h('p', { class: 'small muted' }, 'Já estudou aqui em outro aparelho? ',
      h('button', { type: 'button', class: 'link-btn', onClick: () => fileInput.click(), text: 'Importe seu backup' }), '.'),
    fileInput);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = fields.read();
    if (!data) return;
    app.dispatch(setProfile, data);
    app.refresh();
  });
  mount(container, form);
}
