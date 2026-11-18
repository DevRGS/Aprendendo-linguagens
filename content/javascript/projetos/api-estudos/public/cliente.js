export function createApiClient({ fetchImpl = fetch } = {}) {
  let csrf = null;
  return {
    setCsrf(value) { csrf = value; },
    async request(path, { method = 'GET', body } = {}) {
      let response;
      try {
        response = await fetchImpl(path, {
          method, credentials: 'same-origin', cache: 'no-store',
          headers: {
            ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
            ...(!['GET', 'HEAD'].includes(method) && csrf ? { 'X-CSRF-Token': csrf } : {}),
          },
          body: body === undefined ? undefined : JSON.stringify(body),
        });
      } catch {
        throw new Error('Falha de rede. Confira a conexão e o servidor antes de reenviar a operação.');
      }
      if (response.status === 204) return null;
      let data;
      try { data = await response.json(); }
      catch { throw new Error('Resposta sem JSON válido. Confira o endereço da API e o servidor.'); }
      if (!response.ok) {
        const error = new Error(data?.erro?.mensagem ?? `Falha HTTP ${response.status}.`);
        error.status = response.status;
        throw error;
      }
      return data;
    },
  };
}
