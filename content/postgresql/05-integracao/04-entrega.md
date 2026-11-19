# Reproduzir o CRUD e a escrita atômica

Comece em uma extração limpa. Execute npm ci e npm test em inicial para observar o contrato SQLite. Em solucao prepare a conexão nova conforme o README e aplique a migração. Use central_lab_test quando desejar uma segunda base dedicada criada para o usuário estudos. O roteiro do projeto descreve como implementar o adaptador na sua cópia.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Use PostgreSQL 17, a carga do esquema caderno e Node 22.13+ da série 22. Configure o arquivo .env na pasta solucao conforme o README do ZIP.

## 1. Demonstração

```bash
npm ci
npm run migrar
npm test
npm start
```

Com a base provisionada e .env correto, a aplicação atende em http://127.0.0.1:3000/. Cadastre contas fictícias, crie, leia, altere e exclua uma tarefa. Compare os códigos e corpos com os testes originais. Ctrl+C encerra o processo.

## 2. Investigue uma variação

Execute o teste de falha da segunda escrita separadamente em solucao. Qual estado precisa sobreviver?

<details>
<summary>Conferir a variação</summary>

Use node --test test/atomicidade.test.mjs. A troca inválida falha com 23503, a sessão anterior continua visível e a nova continua ausente.

</details>

## 3. Resolva em outro caso

Entregue o adaptador PostgreSQL, a migração e um teste adicional para variação de rollback, junto com os resultados do contrato de duas contas.

<details>
<summary>Conferir a solução e o resultado</summary>

Na sua cópia, repita a troca de sessão usando um token novo que já pertença a outra sessão existente. Espere 23505 e confira que as duas sessões originais sobrevivem. Anote os passos, a versão do servidor e os resultados ao rodar a partir de base dedicada nova.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://node-postgres.com/features/transactions)
