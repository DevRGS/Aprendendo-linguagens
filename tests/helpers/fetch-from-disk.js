// Substitui fetch() nos testes: 'content/...' é lido do disco, a partir da raiz do projeto.
import { readFile } from 'node:fs/promises';

const ROOT = new URL('../../', import.meta.url);

export function installFetchFromDisk({ fail = () => false } = {}) {
  const calls = [];
  globalThis.fetch = async (path, init) => {
    calls.push({ path: String(path), init });
    if (fail(String(path))) return new Response('erro simulado', { status: 500 });
    try {
      return new Response(await readFile(new URL(String(path), ROOT)), { status: 200 });
    } catch {
      return new Response('não encontrado', { status: 404 });
    }
  };
  return calls;
}
