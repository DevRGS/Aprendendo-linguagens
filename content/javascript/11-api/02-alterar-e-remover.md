# PATCH e DELETE: mudar e remover

PATCH aceita um subconjunto permitido de campos: titulo e/ou concluida. A API rejeita corpo vazio, nomes extras, título inválido e textos como "false" no lugar do booleano false. Uma atualização parcial não deve apagar um campo que não veio no pedido.

O repositório busca o registro pelo par usuário/id, combina os campos válidos com os valores atuais e grava. O uso de ?? preserva false como valor intencional de concluida; usar || aqui poderia trocar false pelo valor anterior e impedir desmarcar.

DELETE executa uma remoção com o mesmo filtro de dono. changes informa se encontrou alguma linha. Sucesso retorna 204 sem JSON; ausência ou id de outra conta retorna 404. O frontend e o teste precisam tratar essa resposta vazia antes de tentar parse.

Esses handlers são síncronos sobre uma conexão SQLite do laboratório. Eles não oferecem controle otimista de versão entre abas. Se dois clientes alteram o mesmo campo, a última escrita pode prevalecer; sistemas que precisam detectar esse conflito podem adotar versão/ETag e um contrato específico.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Fluxo do handler PATCH em src/app.mjs, depois de validar id e value. A exclusão usa store.deleteTask e res.status(204).end(); veja as rotas completas.

```javascript
const updated = store.updateTask(req.session.id, id, value);
if (!updated) throw new ApiError(404, 'NAO_ENCONTRADO', 'Recurso não encontrado.');
res.json(updated);
```

## Prática guiada

Crie uma tarefa, marque e depois desmarque. Altere só o título sem mandar concluida. Exclua e tente GET no mesmo id.

<details>
<summary>Conferir resultado e solução</summary>

Desmarcar persiste false; atualizar só o título preserva a conclusão atual. DELETE retorna 204, e a consulta posterior retorna 404. O cliente não tenta ler JSON de 204.

</details>

## Fontes

- [MDN — métodos HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
- [MDN — status HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
