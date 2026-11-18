export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function requireObject(value, allowed) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)
    || Object.keys(value).some((key) => !allowed.includes(key))) {
    throw new ApiError(400, 'VALIDACAO', 'Envie um objeto com os campos permitidos.');
  }
}

export function taskBody(body, partial = false) {
  requireObject(body, partial ? ['titulo', 'concluida'] : ['titulo']);
  if (!Object.keys(body).length) throw new ApiError(400, 'VALIDACAO', 'Informe pelo menos um campo.');
  const value = {};
  if (!partial || Object.hasOwn(body, 'titulo')) {
    if (typeof body.titulo !== 'string' || !body.titulo.trim() || body.titulo.trim().length > 120) {
      throw new ApiError(400, 'VALIDACAO', 'O título deve ter de 1 a 120 caracteres.');
    }
    if (body.titulo.includes('\u0000')) throw new ApiError(400, 'VALIDACAO', 'O título não pode conter o caractere NUL.');
    value.titulo = body.titulo.trim();
  }
  if (Object.hasOwn(body, 'concluida')) {
    if (typeof body.concluida !== 'boolean') throw new ApiError(400, 'VALIDACAO', 'Concluída deve ser true ou false.');
    value.concluida = body.concluida;
  }
  return value;
}

export function credentials(body) {
  requireObject(body, ['usuario', 'senha']);
  if (typeof body.usuario !== 'string' || !/^[a-z][a-z0-9_-]{2,29}$/i.test(body.usuario)) {
    throw new ApiError(400, 'VALIDACAO', 'Use um usuário de 3 a 30 caracteres: letras, números, _ ou -, começando por letra.');
  }
  if (typeof body.senha !== 'string' || body.senha.length < 12 || body.senha.length > 128) {
    throw new ApiError(400, 'VALIDACAO', 'Use uma senha de 12 a 128 caracteres.');
  }
  return { usuario: body.usuario.toLowerCase(), senha: body.senha };
}

export function integer(value, { min = 1, max = Number.MAX_SAFE_INTEGER, fallback } = {}) {
  if (value === undefined && fallback !== undefined) return fallback;
  if (typeof value !== 'string' || !/^(0|[1-9]\d*)$/.test(value)) throw new ApiError(400, 'VALIDACAO', 'Parâmetro numérico inválido.');
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < min || number > max) throw new ApiError(400, 'VALIDACAO', 'Parâmetro fora dos limites.');
  return number;
}
