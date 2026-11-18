# GET e POST: consultar e criar tarefas

Agora ligamos HTTP ao repositório. Uma rota deve receber uma entrada, chamar a regra/operação necessária e montar uma resposta coerente. Ela não precisa misturar consultas SQL, manipulação de DOM e texto de formulário no mesmo bloco.

No projeto final, a autenticação já preenche req.session antes dessas rotas. Para acompanhar agora, abra a interface e cadastre uma conta de estudo. Você verá como essa autenticação funciona no módulo próprio; nenhum id de usuário vem do navegador para escolher o dono.

GET /api/tarefas valida limit/offset e retorna itens, total, limit, offset. GET /api/tarefas/:id valida o id e retorna uma tarefa da conta ou 404. Listar não deve criar dados como efeito colateral. A API desabilita cache das respostas de conta com Cache-Control:no-store.

POST recebe JSON com titulo. O parser e o validador rodam antes da escrita. O banco fornece o id criado; a rota devolve a representação pública com concluida=false, status 201 e Location. Não devolva toda linha de usuário para compor essa resposta: hash e salt não pertencem ao cliente.

No painel Network da página do projeto, observe o POST ao adicionar e o GET que atualiza a lista. São duas requisições distintas. Uma falha da atualização visual depois de um POST bem-sucedido não significa que a gravação foi desfeita.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Rota real de src/app.mjs. app, store, csrf e taskBody já estão configurados no arquivo completo; não execute este fragmento isoladamente.

```javascript
app.post('/api/tarefas', csrf, (req, res) => {
  const body = taskBody(req.body);
  const task = store.createTask(req.session.id, body.titulo);
  res.status(201).location(`/api/tarefas/${task.id}`).json(task);
});
```

## Prática guiada

Entre na interface, adicione uma tarefa e inspecione resposta 201, Location e JSON. Use os comandos do README para consultar o id retornado.

<details>
<summary>Conferir resultado e solução</summary>

A representação contém id, titulo e concluida. A API atribui o dono pela sessão. O corpo não precisa nem pode enviar usuario_id.

</details>

## Fontes

- [Express 5 — API](https://expressjs.com/en/5x/api/)
- [MDN — métodos HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
