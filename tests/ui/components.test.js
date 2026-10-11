import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from '../helpers/dom.js';
import { makeTestApp, profileState, texts } from '../helpers/app.js';
import { errorPanel, statCard, findModule, findLesson } from '../../js/ui/components/common.js';
import { profileFields } from '../../js/ui/components/profile-fields.js';
import { weakPointsSection } from '../../js/ui/components/weak-points.js';
import { h } from '../../js/ui/dom.js';

setupDom();

test('errorPanel mostra a mensagem e o botão "Tentar de novo" quando há retry', () => {
  let retries = 0;
  const panel = errorPanel('Falhou', () => { retries += 1; });
  assert.equal(panel.getAttribute('role'), 'alert');
  assert.equal(panel.querySelector('p').textContent, 'Falhou');
  panel.querySelector('button').click();
  assert.equal(retries, 1);
  assert.equal(errorPanel('Sem retry').querySelector('button'), null);
});

test('statCard aceita texto ou elemento como complemento', () => {
  const a = statCard('Meta', '10 XP', 'hoje');
  assert.deepEqual(texts(a, 'span, strong'), ['Meta', '10 XP', 'hoje']);
  const b = statCard('Meta', '10 XP', h('a', { text: 'ver' }));
  assert.equal(b.querySelector('a').textContent, 'ver');
  assert.equal(statCard('Meta', '1').children.length, 2);
});

test('findModule e findLesson localizam pelo id e devolvem null se não existir', async () => {
  const app = await makeTestApp();
  assert.equal(findModule(app, 'java.fundamentos').module.title, 'Fundamentos');
  assert.equal(findModule(app, 'java.nada'), null);
  assert.equal(findModule(app, 'cobol.x'), null);
  const found = findLesson(app, 'java.fundamentos.arrays');
  assert.equal(found.lesson.title, 'Arrays');
  assert.equal(found.language.id, 'java');
  assert.equal(findLesson(app, 'java.fundamentos.nada'), null);
});

test('profileFields exige nome e devolve avatar e meta escolhidos', () => {
  const fields = profileFields();
  document.body.append(fields.el);
  assert.equal(fields.read(), null);
  assert.equal(fields.el.querySelector('.field-error').textContent, 'Digite seu nome.');
  fields.el.querySelector('#pf-name').value = '  Ana  ';
  fields.el.querySelectorAll('.avatar-opt')[3].click();
  fields.el.querySelectorAll('.goal-opt')[2].click();
  assert.deepEqual(fields.read(), { name: 'Ana', avatar: '🦊', dailyGoal: 100 });
  assert.equal(fields.el.querySelector('.field-error').textContent, '');
  assert.equal(fields.el.querySelector('.avatar-opt.selected').getAttribute('aria-checked'), 'true');
  fields.el.remove();
});

test('profileFields começa com os dados do perfil atual', () => {
  const fields = profileFields({ name: 'Rafa', avatar: '🚀', dailyGoal: 20 });
  assert.equal(fields.el.querySelector('#pf-name').value, 'Rafa');
  assert.equal(fields.el.querySelector('.avatar-opt.selected').textContent, '🚀');
  assert.match(fields.el.querySelector('.goal-opt.selected').textContent, /Leve/);
});

test('pontos fracos: sem respostas suficientes mostra orientação', async () => {
  const app = await makeTestApp();
  const section = await weakPointsSection(app, profileState());
  assert.match(section.textContent, /Responda pelo menos 5 perguntas/);
});

test('pontos fracos: lista o módulo com links para a aula com mais erros e para o quiz focado', async () => {
  const app = await makeTestApp();
  const state = profileState({
    questions: {
      'java.fundamentos.q14': { seen: 4, correct: 0 },
      'java.fundamentos.q01': { seen: 2, correct: 2 },
    },
  });
  const section = await weakPointsSection(app, state);
  const item = section.querySelector('.weak-list li');
  assert.match(item.textContent, /Java › Fundamentos/);
  assert.match(item.textContent, /33% de acerto/);
  const links = [...item.querySelectorAll('a')].map((a) => a.getAttribute('href'));
  assert.deepEqual(links, ['#/java/fundamentos/arrays', '#/quiz?modulo=java.fundamentos&foco=1']);
});
