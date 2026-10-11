// Responde a pergunta que está na tela pela interface (cliques, digitação, setas),
// do jeito que uma pessoa faria. byId: Map de id → pergunta original.
import { orderLine } from '../../js/core/grading.js';

export function answerCurrent(el, byId, { correct = true } = {}) {
  const root = el.querySelector('.question');
  const q = byId.get(root.dataset.qid);
  if (q.type === 'multiple') {
    const target = correct ? q.answer : (q.answer + 1) % q.options.length;
    root.querySelector(`.opt[data-orig="${target}"]`).click();
  } else if (q.type === 'truefalse') {
    root.querySelector(`.opt[data-value="${correct ? q.answer : !q.answer}"]`).click();
  } else if (q.type === 'fill') {
    root.querySelectorAll('input.blank').forEach((input, i) => { input.value = correct ? q.blanks[i][0] : 'errado'; });
    root.querySelector('form').dispatchEvent(new window.Event('submit', { cancelable: true }));
  } else if (q.type === 'order') {
    if (correct) {
      const target = q.lines.map(orderLine);
      for (let i = 0; i < target.length; i++) {
        const current = [...root.querySelectorAll('.order-line code')].map((c) => c.textContent);
        let j = current.indexOf(target[i], i);
        while (j > i) {
          root.querySelectorAll('.order-item')[j].querySelector('[aria-label="Mover para cima"]').click();
          j -= 1;
        }
      }
    }
    [...root.querySelectorAll('button')].find((b) => b.textContent === 'Confirmar ordem').click();
  }
  return q;
}

export const nextButton = (el) => [...el.querySelectorAll('.quiz-nav button')].find((b) => !b.hidden);
