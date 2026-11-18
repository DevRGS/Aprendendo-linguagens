# Formulário, listagem e edição assíncronos

O evento submit lê o campo, valida o texto e chama a API. A tela só deve tratar uma gravação como confirmada depois de receber a resposta apropriada. A listagem é construída com createElement/textContent, preservando títulos como texto literal.

Para atualizar conclusão, a checkbox manda um PATCH com um booleano real. Se o pedido falha, o cliente restaura o valor visual anterior, pois o estado do servidor não foi confirmado. Editar o título usa um input separado; em erro, o texto digitado continua disponível para correção.

O botão Excluir manda DELETE e, em sucesso, atualiza a lista. Se excluiu o único item de uma página posterior, o cliente volta uma página para não deixar uma tela vazia enganosa. O total e os controles de navegação vêm do contrato da resposta.

Formulários têm label, botões têm type e mensagens usam região de status. O teclado deve conseguir enviar e ativar controles. Ainda vale observar foco durante atualizações: reconstruir uma lista pode remover o elemento que estava focado.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Fluxo do submit de public/app.js dentro de run(async...). api e loadTasks são definidos no cliente completo. O servidor repete a validação para proteger o contrato.

```javascript
const titulo = document.querySelector('#titulo').value.trim();
if (!titulo || titulo.length > 120) throw new Error('Título inválido.');
await api.request('/api/tarefas', { method: 'POST', body: { titulo } });
await loadTasks();
```

## Prática guiada

Crie duas tarefas, edite uma, marque/desmarque e exclua a outra. Em Network, associe cada ação ao método enviado.

<details>
<summary>Conferir resultado e solução</summary>

Criação usa POST, edição e conclusão usam PATCH, exclusão usa DELETE e atualização da listagem usa GET. A interface não abre o SQLite diretamente.

</details>

## Fontes

- [MDN — fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Express 5 — API](https://expressjs.com/en/5x/api/)
