# Registrar o comportamento antes de migrar

Entre em inicial e rode os testes antes de editar. Eles criam contas fictícias, autenticam, enviam uma tarefa e comparam status, JSON, cabeçalhos e autorização. Em uma migração vertical, esses efeitos observáveis servem de contrato entre o cliente e o servidor.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Use o terminal na pasta **inicial** para a linha de base ou **solucao** para a versão migrada. Para implementar sua própria versão, siga o roteiro de migração do README do ZIP.

## 1. Demonstração

```bash
npm ci
npm test
```

A suíte original passa. Em test/api.test.mjs procure o teste de CRUD. Ele confere 201 na criação, Location com o id e GET por id com o título criado.

## 2. Investigue uma variação

No teste de acesso entre contas, localize a leitura da conta Bia sobre a tarefa de Ana. Qual é o status?

<details>
<summary>Conferir a variação</summary>

A asserção usa 404. Esse comportamento também esconde se o id de outra conta existe.

</details>

## 3. Resolva em outro caso

Faça uma tabela de contrato para criar, reler e excluir uma tarefa própria e para uma leitura sem login.

<details>
<summary>Conferir a solução e o resultado</summary>

POST autenticado com CSRF retorna 201, GET autorizado retorna 200, DELETE autorizado com CSRF retorna 204 sem corpo e GET sem sessão retorna 401.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://nodejs.org/docs/latest-v22.x/api/test.html)
