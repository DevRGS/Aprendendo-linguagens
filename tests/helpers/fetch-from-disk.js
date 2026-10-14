// Substitui fetch() nos testes: 'content/...' é lido do disco, a partir da raiz do projeto.
// Com overlay (o padrão), um arquivo que existe em tests/fixtures/ tem prioridade. Assim o manifesto
// de Java fica congelado em Fundamentos, e os testes de tela não quebram quando o curso ganha módulos.
import { readFile } from 'node:fs/promises';

const ROOT = new URL('../../', import.meta.url);
const FIXTURES = new URL('../fixtures/', import.meta.url);

async function readFirst(urls) {
  for (const url of urls) {
    try {
      return await readFile(url);
    } catch {
      // não existe aqui: tenta o próximo
    }
  }
  return null;
}

export function installFetchFromDisk({ fail = () => false, overlay = true } = {}) {
  const calls = [];
  globalThis.fetch = async (path, init) => {
    calls.push({ path: String(path), init });
    if (fail(String(path))) return new Response('erro simulado', { status: 500 });
    const real = new URL(String(path), ROOT);
    const body = await readFirst(overlay ? [new URL(String(path), FIXTURES), real] : [real]);
    return body === null ? new Response('não encontrado', { status: 404 }) : new Response(body, { status: 200 });
  };
  return calls;
}
