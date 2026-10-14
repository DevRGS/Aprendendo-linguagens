import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setupDom } from '../helpers/dom.js';
import { initTestMarkdown } from '../helpers/markdown.js';
import { createQuestionView, describeResponse, describeAnswer } from '../../js/ui/components/question.js';

setupDom();
await initTestMarkdown();

const multiple = { id: 'java.m.q01', type: 'multiple', prompt: 'Quanto é `7 / 2`?', options: ['3.5', '3', '4'], answer: 1, optionOrder: [2, 0, 1] };
const tf = { id: 'java.m.q02', type: 'truefalse', prompt: 'String é primitivo?', answer: false };
const fill = { id: 'java.m.q03', type: 'fill', prompt: 'Complete', code: 'int x = Integer.___("4") + ___;', blanks: [['parseInt', 'valueOf'], ['1']] };
const order = { id: 'java.m.q04', type: 'order', prompt: 'Ordene', lines: ['for (;;) {', '    x++;', '}'], shuffledLines: ['}', 'x++;', 'for (;;) {'] };

function view(q) {
  const submitted = [];
  const v = createQuestionView(q, { lang: 'java', onSubmit: (r) => submitted.push(r) });
  document.body.append(v.el);
  return { ...v, submitted };
}

test('múltipla escolha: opções na ordem embaralhada, devolve o índice original e marca certo/errado', () => {
  const v = view(multiple);
  assert.equal(v.el.dataset.qid, 'java.m.q01');
  assert.equal(v.el.querySelector('.q-type').textContent, 'Múltipla escolha');
  assert.equal(v.el.querySelector('.md code').textContent, '7 / 2');
  const opts = [...v.el.querySelectorAll('.opt')];
  assert.deepEqual(opts.map((o) => o.textContent), ['A4', 'B3.5', 'C3']);
  v.focus();
  assert.equal(document.activeElement, opts[0]);
  opts[1].click();
  assert.deepEqual(v.submitted, [0]);
  assert.ok(opts.every((o) => o.disabled));
  v.reveal({ response: 0, correct: false, showCorrect: true });
  assert.deepEqual(opts.map((o) => o.className), ['opt', 'opt chosen err', 'opt ok']);
  v.el.remove();
});

test('múltipla escolha em simulado só marca a escolha', () => {
  const v = view(multiple);
  v.reveal({ response: 1, correct: true, showCorrect: false });
  assert.deepEqual([...v.el.querySelectorAll('.opt')].map((o) => o.className), ['opt', 'opt', 'opt chosen']);
  v.el.remove();
});

test('verdadeiro ou falso', () => {
  const v = view(tf);
  const [yes, no] = v.el.querySelectorAll('.opt');
  assert.deepEqual([yes.textContent, no.textContent], ['Verdadeiro', 'Falso']);
  v.focus();
  assert.equal(document.activeElement, yes);
  yes.click();
  assert.deepEqual(v.submitted, [true]);
  assert.ok(yes.disabled && no.disabled);
  v.reveal({ response: true, correct: false, showCorrect: true });
  assert.deepEqual([yes.className, no.className], ['opt chosen err', 'opt ok']);
  v.el.remove();
});

test('lacuna: uma caixa por ___, não envia vazio e mostra a resposta esperada no erro', () => {
  const v = view(fill);
  const inputs = [...v.el.querySelectorAll('input.blank')];
  assert.equal(inputs.length, 2);
  assert.equal(v.el.querySelector('.fill-code').textContent, 'int x = Integer.("4") + ;');
  const form = v.el.querySelector('form');
  inputs[0].value = 'valueOf';
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  assert.equal(v.submitted.length, 0);
  assert.equal(document.activeElement, inputs[1]);
  inputs[1].value = '2';
  form.dispatchEvent(new window.Event('submit', { cancelable: true }));
  assert.deepEqual(v.submitted, [['valueOf', '2']]);
  assert.ok(inputs.every((i) => i.readOnly));
  v.reveal({ response: ['valueOf', '2'], correct: false, showCorrect: true });
  assert.deepEqual(inputs.map((i) => i.className), ['blank ok', 'blank err']);
  assert.equal(v.el.querySelector('.fill-answer').textContent, 'Resposta esperada: parseInt · 1');
  v.el.remove();
});

test('lacuna em simulado não revela nada', () => {
  const v = view(fill);
  v.focus();
  assert.equal(document.activeElement, v.el.querySelector('input.blank'));
  v.reveal({ response: ['x', 'y'], correct: false, showCorrect: false });
  assert.equal(v.el.querySelector('.fill-answer'), null);
  assert.equal(v.el.querySelector('input.blank').className, 'blank');
  v.el.remove();
});

test('ordenar: botões ↑↓, setas do teclado, seleção e arrastar mudam a ordem', () => {
  const v = view(order);
  const lines = () => [...v.el.querySelectorAll('.order-line code')].map((c) => c.textContent);
  assert.deepEqual(lines(), ['}', 'x++;', 'for (;;) {']);
  assert.equal(v.el.querySelector('[aria-label="Mover para cima"]').disabled, true);
  v.el.querySelectorAll('.order-item')[2].querySelector('[aria-label="Mover para cima"]').click();
  assert.deepEqual(lines(), ['}', 'for (;;) {', 'x++;']);
  assert.equal(v.el.querySelectorAll('.order-item')[1].className, 'order-item selected');
  v.el.querySelectorAll('.order-line')[0].dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  assert.deepEqual(lines(), ['for (;;) {', '}', 'x++;']);
  v.el.querySelectorAll('.order-line')[0].click();
  assert.equal(v.el.querySelectorAll('.order-line')[0].getAttribute('aria-pressed'), 'true');
  const data = {};
  const dataTransfer = { setData: (k, val) => { data[k] = val; }, getData: (k) => data[k] };
  const fire = (target, type) => { const ev = new window.Event(type, { bubbles: true, cancelable: true }); ev.dataTransfer = dataTransfer; target.dispatchEvent(ev); };
  fire(v.el.querySelectorAll('.order-item')[2], 'dragstart');
  fire(v.el.querySelectorAll('.order-item')[1], 'drop');
  assert.deepEqual(lines(), ['for (;;) {', 'x++;', '}']);
  [...v.el.querySelectorAll('button')].find((b) => b.textContent === 'Confirmar ordem').click();
  assert.deepEqual(v.submitted, [['for (;;) {', 'x++;', '}']]);
  assert.ok([...v.el.querySelectorAll('.order-line')].every((b) => b.disabled));
  v.el.remove();
});

test('ordenar errado mostra a ordem correta com o recuo original', () => {
  const v = view(order);
  [...v.el.querySelectorAll('button')].find((b) => b.textContent === 'Confirmar ordem').click();
  v.reveal({ response: order.shuffledLines, correct: false, showCorrect: true });
  assert.equal(v.el.querySelector('.order-answer code').textContent, 'for (;;) {\n    x++;\n}\n');
  v.focus();
  v.el.remove();
});

test('describeResponse e describeAnswer descrevem cada tipo', () => {
  assert.equal(describeResponse(multiple, 2).textContent, '4');
  assert.equal(describeResponse(tf, true).textContent, 'Verdadeiro');
  assert.equal(describeResponse(fill, ['a', 'b']).textContent, 'a · b');
  assert.equal(describeResponse(order, ['b', 'a']).textContent, 'b\na');
  assert.equal(describeResponse(multiple, undefined).textContent, 'sem resposta');
  assert.equal(describeAnswer(multiple).textContent, '3');
  assert.equal(describeAnswer(tf).textContent, 'Falso');
  assert.equal(describeAnswer(fill).textContent, 'parseInt · 1');
  assert.match(describeAnswer(order, 'java').textContent, /for \(;;\) \{\n {4}x\+\+;\n\}/);
});
