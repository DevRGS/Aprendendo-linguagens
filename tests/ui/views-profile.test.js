import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from '../helpers/dom.js';
import { makeTestApp, profileState, route, container, texts } from '../helpers/app.js';
import { renderProfile } from '../../js/ui/views/profile.js';
import { renderCertificate, certificateCode } from '../../js/ui/views/certificate.js';
import { toDayKey } from '../../js/core/dates.js';
import { formatDay } from '../../js/ui/dom.js';

setupDom();
const today = toDayKey(new Date());
const allLessons = ['variaveis-e-tipos', 'conversoes', 'operadores', 'condicionais', 'lacos', 'arrays'];
const lessonsDone = () => Object.fromEntries(allLessons.map((id) => [`java.fundamentos.${id}`, { doneAt: '2026-10-01' }]));

test('perfil: cabeçalho, números, linguagem, conquistas e histórico vazio', async () => {
  const state = profileState({
    xp: { total: 150, byDay: { [today]: 30 } },
    streak: { current: 1, best: 4, lastDay: today },
    counters: { answered: 4, cardReviews: 2, mistakesFixed: 0, goalDays: 1, quizzes: 0 },
    questions: { 'java.fundamentos.q01': { seen: 4, correct: 3 } },
    cards: { 'java.fundamentos.f01': { box: 5, due: '2999-01-01' } },
    achievements: { 'primeiros-passos': '2026-10-01' },
  });
  const app = await makeTestApp({ state });
  const el = container();
  await renderProfile(el, app, route('perfil'));
  assert.equal(el.querySelector('h1').textContent, 'Rafa');
  assert.match(el.textContent, /Nível 2 · Iniciante · 150 XP no total/);
  assert.match(el.textContent, /50\/200 XP para o nível 3/);
  assert.deepEqual(texts(el, '.stat-value'), ['🔥 1 dia', '50 XP', '4', '2']);
  assert.match(el.textContent, /Recorde: 4 dias/);
  assert.match(el.textContent, /Cumprida em 1 dia/);
  assert.match(el.textContent, /75% de acerto/);
  const lang = el.querySelector('.lang-card');
  assert.match(lang.textContent, /0\/6 aulas · 0\/1 módulos/);
  assert.match(lang.textContent, /75% de acerto em 4 respostas/);
  assert.match(lang.textContent, /1 carta dominada/);
  const achievements = el.querySelectorAll('.achievement');
  assert.equal(achievements.length, 21);
  assert.equal(el.querySelectorAll('.achievement.unlocked').length, 1);
  assert.match(el.querySelector('.achievement.unlocked').textContent, /Concluiu a primeira aula\.Desbloqueada em 01\/10\/2026/);
  assert.match(el.querySelector('.achievement.locked').textContent, /\(bloqueada\)/);
  assert.match(el.textContent, /Seus quizzes, práticas e provas aparecem aqui\./);
});

test('perfil: calendário de 12 semanas com o dia de hoje colorido pela meta', async () => {
  const app = await makeTestApp({ state: profileState({ xp: { total: 60, byDay: { [today]: 60 } } }) });
  const el = container();
  await renderProfile(el, app, route('perfil'));
  const cells = el.querySelectorAll('.heatmap .hm-cell');
  assert.equal(cells.length, 84);
  assert.equal(cells[83].className, 'hm-cell hm-4');
  assert.equal(cells[83].getAttribute('title'), `${formatDay(today)}: 60 XP`);
  assert.equal(cells[0].className, 'hm-cell hm-0');
  assert.match(cells[0].getAttribute('title'), /sem estudo/);
  assert.match(el.querySelector('.heatmap').getAttribute('aria-label'), /: 1 dia com estudo\./);
  assert.equal(el.querySelectorAll('.hm-legend .hm-cell').length, 5);
});

test('perfil: histórico com rótulos, nota colorida e "Refazer erradas" só quando houve erro', async () => {
  const history = [
    { id: 'q2', at: '2026-10-10T10:00:00.000Z', kind: 'quiz', mode: 'simulado', scopeLabel: 'Java inteiro', total: 10, correct: 9, durationSec: 75, wrongIds: ['java.fundamentos.q01'] },
    { id: 'q1', at: '2026-10-09T10:00:00.000Z', kind: 'practice', mode: 'estudo', scopeLabel: 'Java › Fundamentos', total: 5, correct: 5, durationSec: 30, wrongIds: [] },
  ];
  const app = await makeTestApp({ state: profileState({ history }) });
  const el = container();
  await renderProfile(el, app, route('perfil'));
  const items = el.querySelectorAll('.history-item');
  assert.equal(items.length, 2);
  assert.equal(items[0].querySelector('strong').textContent, 'Quiz (simulado)');
  assert.match(items[0].textContent, /Java inteiro · 1 min 15 s/);
  assert.equal(items[0].querySelector('.badge').className, 'badge success');
  assert.equal(items[0].querySelector('a').getAttribute('href'), '#/quiz?refazer=q2');
  assert.equal(items[1].querySelector('strong').textContent, 'Prática');
  assert.equal(items[1].querySelector('a'), null);
});

test('perfil: nome com HTML aparece como texto', async () => {
  const state = profileState();
  state.profile.name = '<b>Rafa</b>';
  const app = await makeTestApp({ state });
  const el = container();
  await renderProfile(el, app, route('perfil'));
  assert.equal(el.querySelector('h1 b'), null);
  assert.equal(el.querySelector('h1').textContent, '<b>Rafa</b>');
});

test('certificado bloqueado explica o que falta', async () => {
  const app = await makeTestApp({ state: profileState({ lessons: { 'java.fundamentos.arrays': { doneAt: '2026-10-01' } }, exams: { java: { best: 0.5 } } }) });
  const el = container();
  await renderCertificate(el, app, route('certificate', { lang: 'java' }));
  assert.equal(el.querySelector('h1').textContent, '🔒 Certificado de Java');
  assert.deepEqual(texts(el, 'li'), [
    'Fundamentos: 1/6 aulas e pelo menos 60% na prática',
    'A prova de Java, com 70% ou mais (sua melhor nota: 50%)',
  ]);
  await renderCertificate(el, app, route('certificate', { lang: 'cobol' }));
  assert.equal(el.querySelector('h1').textContent, 'Página não encontrada');
});

test('certificado liberado mostra nome, carga horária, data, módulos, nota e código', async () => {
  const state = profileState({
    lessons: lessonsDone(),
    modules: { 'java.fundamentos': { bestPractice: 1, completedAt: '2026-10-02' } },
    exams: { java: { best: 0.85, passedAt: '2026-10-05' } },
  });
  const app = await makeTestApp({ state });
  const el = container();
  let printed = 0;
  window.print = () => { printed += 1; };
  await renderCertificate(el, app, route('certificate', { lang: 'java' }));
  const cert = el.querySelector('.certificate');
  assert.equal(cert.querySelector('.cert-name').textContent, 'Rafa');
  assert.match(cert.textContent, /concluiu os estudos de ☕ Java, com carga horária aproximada de 1 hora, em 05\/10\/2026\./);
  assert.deepEqual(texts(cert, '.cert-modules li'), ['Fundamentos']);
  assert.match(cert.textContent, /Nota na prova final: 85%/);
  assert.match(cert.querySelector('.cert-code').textContent, /^Código: CL-JAVA-[0-9A-F]{8}$/);
  assert.equal(cert.querySelector('.cert-foot').textContent, 'Certificado de estudo livre, emitido localmente.');
  el.querySelector('.cert-actions button').click();
  assert.equal(printed, 1);
});

test('certificateCode é estável para os mesmos dados e muda com o nome', async () => {
  const a = await certificateCode('Rafa', 'java', '2026-10-05');
  assert.equal(a, await certificateCode('Rafa', 'java', '2026-10-05'));
  assert.notEqual(a, await certificateCode('Bia', 'java', '2026-10-05'));
  assert.match(a, /^CL-JAVA-[0-9A-F]{8}$/);
});
