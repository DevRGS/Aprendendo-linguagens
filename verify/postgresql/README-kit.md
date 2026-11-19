# Transferir o CRUD de estudos para PostgreSQL

Use PostgreSQL 17 com psql, Node 22.13 ou posterior da linha 22 e npm. Em Windows, o instalador oferece servidor, ferramentas de linha de comando e SQL Shell. Em Linux ou macOS, selecione a distribuição em https://www.postgresql.org/download/ e instale o servidor e psql. Inicie o serviço conforme o instalador. O servidor local precisa aceitar conexão TCP na porta 5432. Para um servidor em outra porta, altere o endereço.

Abra psql como o administrador criado na instalação, ou use SQL Shell no Windows. No Ubuntu com os pacotes da distribuição, use `sudo -u postgres psql`. Em um servidor próprio com senha, use `psql -h 127.0.0.1 -U postgres -d postgres`. Prepare uma única vez:

```sql
CREATE ROLE estudos LOGIN;
\password estudos
CREATE DATABASE central_lab OWNER estudos;
```

Digite uma senha local exclusiva quando solicitado. No terminal, dentro de solucao, execute `psql -h 127.0.0.1 -U estudos -d central_lab`. No prompt psql execute `\i sql/reiniciar.sql`. Isso recria exclusivamente o esquema caderno e seus três alunos fictícios. Ao reconectar, execute `SET search_path TO caderno;` antes das consultas de aula. Saia com `\q`.

## Projeto a entregar

1. Extraia o ZIP. Em inicial, rode npm ci e npm test para obter o contrato da API SQLite. Faça uma cópia da pasta inicial para trabalhar.
2. Em solucao, duplique .env.example com o nome .env e substitua SENHA_LOCAL pela senha do usuário estudos. Na URL, codifique caracteres reservados da senha percentualmente, ou escolha uma senha longa de laboratório usando letras e números. O psql pede a senha diretamente. A variável DATABASE_URL aponta exclusivamente para central_lab.
3. Execute npm ci, npm run migrar e npm test. A migração prepara central_api. Os testes usam esquemas temporários separados e removem somente os esquemas que criam. Execute npm start, abra http://127.0.0.1:3000/ e crie duas contas fictícias. Pare com Ctrl+C.
4. Para fazer a migração em sua cópia, leve o package.json, lockfile, .env.example, migrar.mjs e sql/001-inicial.sql da solução. Implemente src/database.mjs usando pg.Pool. Mantenha os nomes e formatos retornados pelo repositório. Para um UPDATE parcial, preserve o valor anterior quando o campo faltar. Em src/app.mjs, aguarde cada operação com await e mapeie a violação de unicidade 23505 para 409. No servidor, passe a conexão configurada no ambiente. Compare com a solução; ela inclui comentários na troca atômica de sessão.
5. Reaproveite os testes HTTP da API, mudando a preparação e a limpeza para um esquema temporário como em solucao/test/api.test.mjs. Os testes específicos de arquivos e migração SQLite pertencem à base inicial. Compare antes e depois o contrato de criação, leitura, PATCH, DELETE, paginação, sessão e acesso de outra conta.
6. Variação inédita: em um teste isolado salve uma sessão, tente rotacioná-la para outra cujo usuário não existe e recupere a original. A segunda escrita precisa falhar com 23503 e a primeira sessão precisa continuar legível. Execute a versão de referência em test/atomicidade.test.mjs.

Na sequência de desempenho, EXPLAIN ANALYZE executa a consulta. As aulas o aplicam a SELECT. Os custos e tempos variam com os dados e com o servidor.
