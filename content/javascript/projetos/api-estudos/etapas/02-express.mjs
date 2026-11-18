import express from 'express';
import { pathToFileURL } from 'node:url';

export function createExpressExample() {
  const app = express();
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/saude', (req, res) => res.json({ ok: true }));
  app.get('/api/ola/:nome', (req, res) => res.json({ mensagem: `Olá, ${req.params.nome}!` }));
  app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));
  return app;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createExpressExample().listen(3000, '127.0.0.1', () => console.log('Abra http://127.0.0.1:3000/api/ola/Ana'));
}
