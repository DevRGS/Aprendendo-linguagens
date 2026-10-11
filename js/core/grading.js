export const BLANK = '___';

export function countBlanks(code) {
  return code.split(BLANK).length - 1;
}

export function normalizeAnswer(text, caseInsensitive = false) {
  const t = String(text ?? '').trim().replace(/\s+/g, ' ');
  return caseInsensitive ? t.toLowerCase() : t;
}

export const orderLine = (line) => String(line).trim();

export function isBlankCorrect(question, index, value) {
  const ci = question.caseInsensitive === true;
  const given = normalizeAnswer(value, ci);
  return question.blanks[index].some((accepted) => normalizeAnswer(accepted, ci) === given);
}

export function gradeQuestion(question, response) {
  switch (question.type) {
    case 'multiple':
    case 'truefalse':
      return response === question.answer;
    case 'fill':
      return Array.isArray(response)
        && response.length === question.blanks.length
        && response.every((value, i) => isBlankCorrect(question, i, value));
    case 'order': {
      const expected = question.lines.map(orderLine);
      return Array.isArray(response)
        && response.length === expected.length
        && response.every((line, i) => orderLine(line) === expected[i]);
    }
    default:
      throw new Error(`Tipo de pergunta desconhecido: ${question.type}`);
  }
}
