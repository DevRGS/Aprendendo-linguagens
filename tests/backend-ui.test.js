import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { setupDom, waitFor } from './helpers/dom.js';

const project = new URL('../content/javascript/projetos/api-estudos/', import.meta.url);

async function page() {
  const dom = setupDom({ body: readFileSync(new URL('public/index.html', project), 'utf8') });
  const previousFetch = globalThis.fetch;
  const requests = [];
  let tasks = [];
  // A fronteira HTTP é controlada aqui; a aplicação e o cliente fetch são os arquivos entregues.
  globalThis.fetch = async (path, options) => {
    requests.push({ path, options });
    if (path === '/api/sessao' && options.method === 'DELETE') return new Response(null, { status: 204 });
    if (path === '/api/sessao' && options.method === 'GET') {
      return Response.json({ usuario: { id: 1, usuario: 'aluna' }, csrf: 'a'.repeat(64) });
    }
    if (path === '/api/tarefas' && options.method === 'POST') {
      tasks = [{ id: 1, titulo: JSON.parse(options.body).titulo, concluida: false }];
      return Response.json(tasks[0], { status: 201 });
    }
    if (path.startsWith('/api/tarefas?')) return Response.json({ itens: tasks, total: tasks.length });
    return Response.json({ erro: { mensagem: 'Pedido inesperado' } }, { status: 400 });
  };
  await import(new URL(`public/app.js?test=${Date.now()}-${Math.random()}`, project));
  await waitFor(() => document.querySelector('#aviso').textContent === 'Sessão restaurada.');
  return { requests, close() { globalThis.fetch = previousFetch; dom.window.close(); } };
}

test('frontend devolve o foco ao campo de título após criar a tarefa', async () => {
  const ui = await page();
  try {
    const title = document.querySelector('#titulo');
    title.value = '<img src=x onerror=alert(1)>';
    document.querySelector('#nova').dispatchEvent(new Event('submit', { cancelable: true }));
    await waitFor(() => document.querySelector('#aviso').textContent === 'Tarefa adicionada.');
    assert.equal(title.disabled, false);
    assert.equal(document.activeElement, title);
    assert.equal(document.querySelector('#lista span').textContent, '<img src=x onerror=alert(1)>');
    assert.equal(document.querySelector('#lista img'), null);
  } finally { ui.close(); }
});

test('cadastro inválido mantém validação do formulário antes de bloquear os campos', async () => {
  const ui = await page();
  try {
    document.querySelector('#acesso').hidden = false;
    document.querySelector('#usuario').value = '';
    const before = ui.requests.length;
    document.querySelector('#cadastrar').click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert.equal(ui.requests.length, before, 'um formulário inválido não deve enviar cadastro');
    assert.equal(document.querySelector('#usuario').disabled, false);
  } finally { ui.close(); }
});

test('sair da conta limpa o rascunho para não mostrá-lo à próxima identidade', async () => {
  const ui = await page();
  try {
    document.querySelector('#titulo').value = 'Rascunho privado da primeira conta';
    document.querySelector('#sair').click();
    await waitFor(() => document.querySelector('#aviso').textContent === 'Você saiu da conta.');
    assert.equal(document.querySelector('#titulo').value, '');
    assert.equal(document.activeElement, document.querySelector('#usuario'));
  } finally { ui.close(); }
});

test('padrão HTML de usuário é válido no modo v dos navegadores e aceita hífen literal', () => {
  const dom = setupDom({ body: readFileSync(new URL('public/index.html', project), 'utf8') });
  try {
    const pattern = new RegExp(`^(?:${document.querySelector('#usuario').pattern})$`, 'v');
    assert.ok(pattern.test('ana-2'));
    assert.ok(pattern.test('ana_2'));
    assert.equal(pattern.test('2ana'), false);
    assert.equal(pattern.test('ana!'), false);
  } finally { dom.window.close(); }
});
