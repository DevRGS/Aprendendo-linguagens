import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from '../helpers/dom.js';
import { createScopeTree, describeScope } from '../../js/ui/components/scope-tree.js';
import { createInitialState } from '../../js/core/state.js';

setupDom();
const mod = (lang, id, title) => ({ id, key: `${lang}.${id}`, title, lessons: [{ id: 'l1' }] });
const app = {
  languages: [
    { id: 'java', name: 'Java', icon: '☕', modules: [mod('java', 'a', 'A'), mod('java', 'b', 'B')] },
    { id: 'sql', name: 'SQL', icon: '🗄️', modules: [mod('sql', 'x', 'X')] },
  ],
};
const state = { ...createInitialState(), lessons: { 'java.b.l1': { doneAt: '2026-10-01' } } };
const toggle = (box, checked) => { box.checked = checked; box.dispatchEvent(new window.Event('change')); };

test('começa com tudo marcado e avisa cada mudança', () => {
  const tree = createScopeTree(app, { state });
  const changes = [];
  tree.onChange((keys) => changes.push(keys));
  assert.deepEqual(tree.getSelected(), ['java.a', 'java.b', 'sql.x']);
  const boxes = tree.el.querySelectorAll('input[type="checkbox"]');
  assert.equal(boxes.length, 5);
  assert.ok([...boxes].every((b) => b.checked));
  toggle(tree.el.querySelectorAll('.scope-mods input')[0], false);
  assert.deepEqual(tree.getSelected(), ['java.b', 'sql.x']);
  const javaBox = tree.el.querySelector('.scope-lang input');
  assert.equal(javaBox.checked, false);
  assert.equal(javaBox.indeterminate, true);
  assert.deepEqual(changes, [['java.b', 'sql.x']]);
});

test('a caixa da linguagem marca e desmarca todos os módulos dela', () => {
  const tree = createScopeTree(app, { state });
  const javaBox = tree.el.querySelector('.scope-lang input');
  toggle(javaBox, false);
  assert.deepEqual(tree.getSelected(), ['sql.x']);
  toggle(javaBox, true);
  assert.deepEqual(tree.getSelected().sort(), ['java.a', 'java.b', 'sql.x']);
});

test('atalhos: Tudo, Só o que já estudei e linguagem inteira', () => {
  const tree = createScopeTree(app, { state, selected: ['sql.x'] });
  const chip = (label) => [...tree.el.querySelectorAll('.chip')].find((c) => c.textContent === label);
  assert.deepEqual([...tree.el.querySelectorAll('.chip')].map((c) => c.textContent), ['Tudo', 'Só o que já estudei', 'Java inteiro', 'SQL inteiro']);
  chip('Só o que já estudei').click();
  assert.deepEqual(tree.getSelected(), ['java.b']);
  chip('Java inteiro').click();
  assert.deepEqual(tree.getSelected(), ['java.a', 'java.b']);
  chip('Tudo').click();
  assert.deepEqual(tree.getSelected(), ['java.a', 'java.b', 'sql.x']);
});

test('describeScope resume a escolha em texto', () => {
  assert.equal(describeScope(app, ['java.a', 'java.b', 'sql.x']), 'Tudo');
  assert.equal(describeScope(app, ['java.a', 'java.b']), 'Java inteiro');
  assert.equal(describeScope(app, ['java.a', 'sql.x']), 'Java › A + SQL inteiro');
  assert.equal(describeScope(app, []), '—');
  const single = { languages: [app.languages[0]] };
  assert.equal(describeScope(single, ['java.a', 'java.b']), 'Java inteiro');
});
