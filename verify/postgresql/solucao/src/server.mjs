import { existsSync } from 'node:fs';
import { createApplication } from './app.mjs';

if (existsSync('.env')) process.loadEnvFile('.env');
const port = Number(process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT deve ser um inteiro entre 1 e 65535.');
const origin = process.env.APP_ORIGIN ?? `http://127.0.0.1:${port}`;
process.umask(0o077);
const project = createApplication({
  origin,
  secureCookies: process.env.NODE_ENV === 'production',
});
const server = project.app.listen(port, '127.0.0.1', () => console.log(`Abra ${origin}`));
server.on('error', (error) => { project.close(); console.error(`Não foi possível iniciar: ${error.message}`); process.exitCode = 1; });
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  server.close(() => { project.close(); process.exitCode = 0; });
  server.closeIdleConnections();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
