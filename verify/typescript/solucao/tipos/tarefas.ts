export type Entrada = { titulo: string };
export type Tarefa = Entrada & { id: number; concluida: boolean };
export type Resultado<T> = { ok: true; valor: T } | { ok: false; erro: string };

// Uma implementação em memória e a de SQLite podem satisfazer este contrato.
export interface Repositorio {
  task(usuarioId: number, id: number): Tarefa | null;
  createTask(usuarioId: number, titulo: string): Tarefa;
}

export function converter(valor: unknown): Resultado<Entrada> {
  if (typeof valor !== 'object' || valor === null || Array.isArray(valor)
      || !('titulo' in valor) || Object.keys(valor).some(chave => chave !== 'titulo')
      || typeof valor.titulo !== 'string') {
    return { ok: false, erro: 'Envie um objeto com o campo titulo em texto.' };
  }
  const titulo = valor.titulo.trim();
  if (titulo.length === 0 || titulo.length > 120 || titulo.includes('\u0000')) {
    return { ok: false, erro: 'Use um título de 1 a 120 caracteres, sem NUL.' };
  }
  return { ok: true, valor: { titulo } };
}

export function criarTarefa(repo: Repositorio, usuarioId: number, body: unknown): Resultado<Tarefa> {
  const entrada = converter(body);
  if (!entrada.ok) return entrada;
  return { ok: true, valor: repo.createTask(usuarioId, entrada.valor.titulo) };
}

export function lerTarefa(repo: Repositorio, usuarioId: number, id: number): Tarefa | null {
  return repo.task(usuarioId, id);
}
