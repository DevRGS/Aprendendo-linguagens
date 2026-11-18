import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

export function createHttpExample() {
  return createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    if (req.method === 'GET' && req.url === '/api/saude') {
      res.writeHead(200); res.end(JSON.stringify({ ok: true }));
    } else {
      res.writeHead(404); res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createHttpExample().listen(3000, '127.0.0.1', () => console.log('Abra http://127.0.0.1:3000/api/saude'));
}
