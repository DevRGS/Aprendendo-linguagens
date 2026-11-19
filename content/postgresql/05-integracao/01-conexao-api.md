# Conectar a API ao PostgreSQL local

A API usa pg.Pool no servidor. No kit solucao, copie .env.example para .env e configure DATABASE_URL com a base central_lab, usuário estudos e a senha de laboratório. Siga o README para criar a base. A migração cria o esquema central_api que atende às rotas.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Use PostgreSQL 17, a carga do esquema caderno e Node 22.13+ da série 22. Configure o arquivo .env na pasta solucao conforme o README do ZIP.

## 1. Demonstração

```bash
npm ci
npm run migrar
npm test
```

O comando de migração informa Esquema central_api pronto. Os testes HTTP e o de atomicidade usam esquemas temporários na mesma base dedicada.

## 2. Investigue uma variação

Rode a migração novamente e confira se uma conta de laboratório cadastrada antes ainda pode entrar.

<details>
<summary>Conferir a variação</summary>

As tabelas iniciais usam CREATE TABLE IF NOT EXISTS e os índices usam IF NOT EXISTS. A migração repetida conserva registros desta versão. Faça login de novo no cliente.

</details>

## 3. Resolva em outro caso

Diferencie os dados consultados na trilha dos dados da aplicação usando psql.

<details>
<summary>Conferir a solução e o resultado</summary>

Use \dt caderno.* e \dt central_api.*. O primeiro esquema contém alunos e leituras; o segundo contém usuarios, tarefas e sessoes.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://node-postgres.com/features/connecting)
