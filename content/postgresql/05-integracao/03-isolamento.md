# Confirmar a autorização entre duas contas

Filtrar leituras por dono no SQL complementa a sessão autenticada. O id do usuário vem do servidor. Abra solucao/test/api.test.mjs, localize o teste de usuários e acompanhe o mesmo caminho de tarefa com as sessões de Ana e Bia. O cliente HTTP fala com a aplicação real.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Use PostgreSQL 17, a carga do esquema caderno e Node 22.13+ da série 22. Configure o arquivo .env na pasta solucao conforme o README do ZIP.

## 1. Demonstração

```bash
npm test
```

O teste cria tarefa de Ana, faz GET como Bia e recebe 404. PATCH e DELETE da outra conta também recebem 404 e a lista de Bia permanece vazia.

## 2. Investigue uma variação

Observe as duas proteções distintas de escrita. O que acontece com PATCH da dona sem CSRF e PATCH de Bia com CSRF próprio?

<details>
<summary>Conferir a variação</summary>

A dona sem CSRF recebe 403. Bia com CSRF válido passa essa etapa mas o filtro de dono não acha a tarefa e a resposta é 404.

</details>

## 3. Resolva em outro caso

Acrescente uma leitura de Ana após as tentativas de Bia. Verifique se o título original e o estado se mantêm.

<details>
<summary>Conferir a solução e o resultado</summary>

No mesmo teste use lab.request(path, ana), confira status 200 e data.titulo igual a Privada; data.concluida deve continuar false. Repita npm test.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/queries-table-expressions.html)
