// Ponto de entrada do site: toda a lógica fica em app.js (testada em tests/ui/app*.test.js).
import { boot } from './app.js';

document.querySelector('.skip-link')?.addEventListener('click', () => document.getElementById('main').focus());
boot();
