import express from 'express';
import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

export function createDevServer() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.static(root, { dotfiles: 'deny' }));
  return createServer(app);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 8000);
  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    console.error('PORT deve ser um número inteiro entre 0 e 65535.');
    process.exitCode = 1;
  } else {
    const server = createDevServer();
    server.on('error', (error) => {
      console.error(error.code === 'EADDRINUSE'
        ? `A porta ${port} está ocupada. Encerre o outro servidor ou escolha outra porta com PORT.`
        : `Não foi possível iniciar a central: ${error.message}`);
      process.exitCode = 1;
    });
    server.listen(port, '127.0.0.1', () => {
      console.log(`Central de Linguagens: http://127.0.0.1:${server.address().port}/`);
      console.log('Mantenha este terminal aberto. Para encerrar, pressione Ctrl+C.');
    });
  }
}
