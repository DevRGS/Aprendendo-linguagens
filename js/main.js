// Ponto de entrada do site: toda a lógica fica em app.js (testada em tests/ui/app*.test.js).
import { boot } from './app.js';

document.querySelector('.skip-link')?.addEventListener('click', () => document.getElementById('main').focus());
function syncVisibility() {
  document.documentElement.classList.toggle('tab-hidden', document.hidden);
}
document.addEventListener('visibilitychange', syncVisibility);
syncVisibility();
boot();
