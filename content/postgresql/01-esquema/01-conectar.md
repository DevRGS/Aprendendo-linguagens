# Abrir uma sessão no banco do laboratório

O PostgreSQL guarda os dados no processo servidor. psql é um cliente. Instale PostgreSQL 17 e prepare usuário estudos e base central_lab pelo README do kit. Na pasta solucao, abra psql -h 127.0.0.1 -U estudos -d central_lab. Dentro de psql rode o exemplo. A carga recria somente o esquema didático caderno na base dedicada.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
\i sql/reiniciar.sql
SELECT current_database(), current_user;
SELECT count(*) FROM caderno.alunos;
```

Espere central_lab, estudos e a contagem 3. A primeira execução cria Ana, Bia e Caio.

## 2. Investigue uma variação

Saia com \q, conecte de novo e consulte as leituras usando o nome completo da tabela.

<details>
<summary>Conferir a variação</summary>

SELECT count(*) FROM caderno.leituras; retorna 3. A sessão anterior terminou e os dados continuam no servidor.

</details>

## 3. Resolva em outro caso

Comprove o esquema usado ao escrever o nome curto alunos.

<details>
<summary>Conferir a solução e o resultado</summary>

Execute SET search_path TO caderno; seguido de SELECT current_schema(), count(*) FROM alunos; o resultado é caderno e 3.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/app-psql.html)
