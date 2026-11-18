# Autorização: quem pode acessar cada tarefa

**Autenticar** responde quem está fazendo o pedido. **Autorizar** decide se essa identidade pode realizar a operação naquele recurso. Esconder um botão na tela não impede que alguém monte a requisição manualmente.

O middleware authenticated resolve o cookie para uma sessão válida e põe a identidade controlada pelo servidor em req.session. Cada operação do repositório recebe esse id. Não leia o dono de usuario_id no corpo do POST/PATCH e não confie em um campo oculto.

O filtro por proprietário deve existir em **ler, listar, atualizar e excluir**. Proteger só a listagem não basta: uma pessoa poderia trocar o id na URL de edição. Por isso as consultas usam WHERE usuario_id=? AND id=?; as alterações também mantêm o filtro na escrita.

Um id alheio e um inexistente respondem 404. Isso evita confirmar desnecessariamente que um recurso de outra conta existe. A escolha entre 403 e 404 é de contrato; o importante é manter a política consistente sem retornar dados proibidos.

Os testes criam duas contas e tentam todas as operações cruzadas. Essa classe de falha é comum quando se implementa CRUD antes de pensar em propriedade. Compare também o banco: o id de uma tarefa é global, mas isso não torna o registro público.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Fluxo da leitura protegida, em src/app.mjs. task filtra proprietário/id em src/database.mjs. A identidade não foi enviada pelo corpo da requisição.

```javascript
const task = store.task(req.session.id, integer(req.params.id));
if (!task) throw new ApiError(404, 'NAO_ENCONTRADO', 'Recurso não encontrado.');
res.json(task);
```

## Prática guiada

Use dois navegadores/perfis ou as duas sessões de terminal do README. Crie na contaA, copie o id e tente GET/PATCH/DELETE na contaB.

<details>
<summary>Conferir resultado e solução</summary>

Todas as tentativas da outra conta recebem 404 e a tarefa original permanece. Tentar enviar usuario_id junto de um corpo de escrita também deve resultar em 400.

</details>

## Fontes

- [OWASP — sessões](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [SQLite — linguagem SQL](https://www.sqlite.org/lang.html)
- [Express — práticas de segurança](https://expressjs.com/en/advanced/best-practice-security/)
