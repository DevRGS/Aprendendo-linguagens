import type { Request, RequestHandler, Express } from 'express';
import { criarTarefa, lerTarefa, type Repositorio } from './tarefas.js';

type Rotas = {
  repo: Repositorio;
  dono(req: Request): number;
  inteiro(valor: unknown): number;
  erro(status: number, codigo: string, mensagem: string): Error;
  csrf: RequestHandler;
};

// A aplicação já registrou o middleware de sessão para /api/tarefas.
export function registrarTarefas(app: Express, { repo, dono, inteiro, erro, csrf }: Rotas) {
  app.get('/api/tarefas/:id', (req, res) => {
    const tarefa = lerTarefa(repo, dono(req), inteiro(req.params.id));
    if (!tarefa) throw erro(404, 'NAO_ENCONTRADO', 'Recurso não encontrado.');
    res.json(tarefa);
  });
  app.post('/api/tarefas', csrf, (req: Request<{}, unknown, unknown>, res) => {
    const resultado = criarTarefa(repo, dono(req), req.body);
    if (!resultado.ok) throw erro(400, 'VALIDACAO', resultado.erro);
    const tarefa = resultado.valor;
    res.status(201).location(`/api/tarefas/${tarefa.id}`).json(tarefa);
  });
}
