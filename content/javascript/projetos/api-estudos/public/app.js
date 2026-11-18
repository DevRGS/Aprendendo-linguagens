import { createApiClient } from './cliente.js';

const api = createApiClient();
const $ = (selector) => document.querySelector(selector);
const limit = 20;
let offset = 0;
let total = 0;
let busy = false;
let user = null;
let nextFocus = null;

function controls() {
  document.querySelectorAll('[data-lock]').forEach((element) => { element.disabled = busy; });
  $('#anterior').disabled = busy || offset === 0;
  $('#proximo').disabled = busy || offset + limit >= total;
}
function message(text) { $('#aviso').textContent = text; }
function focusOn(selector) { nextFocus = () => $(selector); }
function setSession(data) {
  const nextUser = data?.usuario ?? null;
  if (user?.id !== nextUser?.id) $('#titulo').value = '';
  user = nextUser;
  api.setCsrf(data?.csrf ?? null);
  $('#acesso').hidden = Boolean(user);
  $('#painel').hidden = !user;
  $('#pessoa').textContent = user ? `Conta: ${user.usuario}` : '';
  if (!user) { $('#lista').replaceChildren(); offset = 0; total = 0; focusOn('#usuario'); }
}
async function run(action) {
  if (busy) return;
  const previousFocus = document.activeElement;
  busy = true;
  controls();
  try { await action(); }
  catch (error) {
    if (error.status === 401) setSession(null);
    message(error.message);
  } finally {
    busy = false;
    controls();
    const target = nextFocus?.() ?? previousFocus;
    nextFocus = null;
    if (target?.isConnected && !target.closest('[hidden]')) target.focus();
  }
}
function locked(element) { element.setAttribute('data-lock', ''); return element; }

async function loadTasks() {
  const data = await api.request(`/api/tarefas?limit=${limit}&offset=${offset}`);
  total = data.total;
  $('#lista').replaceChildren();
  for (const task of data.itens) {
    const item = document.createElement('li');
    const label = document.createElement('label');
    const check = locked(document.createElement('input'));
    check.type = 'checkbox';
    check.checked = task.concluida;
    const title = document.createElement('span');
    title.textContent = task.titulo;
    label.append(check, title);
    check.addEventListener('change', () => run(async () => {
      try {
        const updated = await api.request(`/api/tarefas/${task.id}`, { method: 'PATCH', body: { concluida: check.checked } });
        task.concluida = updated.concluida;
        message('Situação atualizada.');
      } catch (error) { check.checked = task.concluida; throw error; }
    }));
    const editor = locked(document.createElement('input'));
    editor.value = task.titulo;
    editor.maxLength = 120;
    editor.setAttribute('aria-label', `Editar título de ${task.titulo}`);
    const save = locked(document.createElement('button'));
    save.type = 'button'; save.textContent = 'Salvar título';
    save.addEventListener('click', () => run(async () => {
      const titulo = editor.value.trim();
      if (!titulo || titulo.length > 120) throw new Error('O título deve ter de 1 a 120 caracteres.');
      await api.request(`/api/tarefas/${task.id}`, { method: 'PATCH', body: { titulo } });
      await loadTasks(); message('Título salvo.'); focusOn('#titulo');
    }));
    const remove = locked(document.createElement('button'));
    remove.type = 'button'; remove.textContent = 'Excluir';
    remove.setAttribute('aria-label', `Excluir ${task.titulo}`);
    remove.addEventListener('click', () => run(async () => {
      await api.request(`/api/tarefas/${task.id}`, { method: 'DELETE' });
      if (offset > 0 && data.itens.length === 1) offset = Math.max(0, offset - limit);
      await loadTasks(); message('Tarefa excluída.'); focusOn('#titulo');
    }));
    const actions = document.createElement('div'); actions.className = 'actions'; actions.append(save, remove);
    item.append(label, editor, actions); $('#lista').append(item);
  }
  $('#pagina').textContent = total ? `${offset + 1}–${offset + data.itens.length} de ${total}` : 'Nenhuma tarefa nesta conta.';
  controls();
}
async function access(register) {
  const body = { usuario: $('#usuario').value, senha: $('#senha').value };
  try {
    if (register) await api.request('/api/usuarios', { method: 'POST', body });
    const session = await api.request('/api/sessao', { method: 'POST', body });
    setSession(session); offset = 0; await loadTasks(); message('Sessão iniciada.'); focusOn('#titulo');
  } finally { $('#senha').value = ''; }
}
function startAccess(register) {
  if ($('#form-acesso').reportValidity()) run(() => access(register));
}
$('#form-acesso').addEventListener('submit', (event) => { event.preventDefault(); startAccess(false); });
$('#cadastrar').addEventListener('click', () => startAccess(true));
$('#sair').addEventListener('click', () => run(async () => {
  await api.request('/api/sessao', { method: 'DELETE' }); setSession(null); message('Você saiu da conta.');
}));
$('#nova').addEventListener('submit', (event) => {
  event.preventDefault();
  run(async () => {
    const titulo = $('#titulo').value.trim();
    if (!titulo || titulo.length > 120) throw new Error('O título deve ter de 1 a 120 caracteres.');
    await api.request('/api/tarefas', { method: 'POST', body: { titulo } });
    $('#titulo').value = ''; offset = 0; await loadTasks(); message('Tarefa adicionada.'); focusOn('#titulo');
  });
});
async function navigate(next) {
  const previous = offset; offset = next;
  try { await loadTasks(); } catch (error) { offset = previous; throw error; }
}
$('#anterior').addEventListener('click', () => run(() => navigate(Math.max(0, offset - limit))));
$('#proximo').addEventListener('click', () => run(() => navigate(offset + limit)));
run(async () => {
  try { setSession(await api.request('/api/sessao')); await loadTasks(); message('Sessão restaurada.'); }
  catch (error) { if (error.status !== 401) throw error; setSession(null); message('Entre ou crie uma conta de estudo.'); }
});
