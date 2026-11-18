// Conferência de assincrono/fetch: dados locais, status HTTP, corpo inválido e falha de transporte.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { carregarJSON } from './carregar-json.mjs';

const server = createServer((request, response) => {
  if (request.url === '/rede') {
    request.socket.destroy();
    return;
  }
  if (request.url === '/ausente') {
    response.writeHead(404);
    response.end('Ausente');
    return;
  }
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end(request.url === '/invalido' ? '{' : '{"curso":"JavaScript"}');
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
try {
  assert.deepEqual(await carregarJSON(`${base}/ok`), { curso: 'JavaScript' });
  await assert.rejects(carregarJSON(`${base}/ausente`), { message: 'HTTP 404' });
  await assert.rejects(carregarJSON(`${base}/invalido`), { name: 'SyntaxError' });
  await assert.rejects(carregarJSON(`${base}/rede`), { name: 'TypeError' });
  console.log('Rede, HTTP e JSON conferidos.');
} finally {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
