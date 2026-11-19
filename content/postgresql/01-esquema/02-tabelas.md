# Criar uma tabela temporária de rascunho

Uma tabela define quais colunas cada linha possui. Use uma tabela TEMP para experimentar na sessão atual. BEGIN e ROLLBACK permitem repetir o exemplo sem deixar a tabela nem a linha gravada. O esquema permanente do laboratório continua disponível.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
BEGIN;
CREATE TEMP TABLE rascunho (id integer PRIMARY KEY, tema text NOT NULL);
INSERT INTO rascunho VALUES (1,'Git');
SELECT id, tema FROM rascunho;
ROLLBACK;
```

O SELECT mostra 1 e Git. Como a própria criação aconteceu na transação desfeita, o rascunho deixa de existir.

## 2. Investigue uma variação

Acrescente outra linha com id 2 e tema SQL antes do SELECT. Ordene por id.

<details>
<summary>Conferir a variação</summary>

INSERT INTO rascunho VALUES (2,'SQL'); e SELECT id,tema FROM rascunho ORDER BY id; mostram Git seguido de SQL.

</details>

## 3. Resolva em outro caso

Modele uma tabela temporária para metas com nome obrigatório e minutos inteiros. Insira uma linha e leia antes do rollback.

<details>
<summary>Conferir a solução e o resultado</summary>

Dentro de BEGIN use CREATE TEMP TABLE metas(nome text NOT NULL,minutos integer); INSERT INTO metas VALUES ('Ler',20); SELECT * FROM metas; ROLLBACK;. A linha lida contém Ler e 20.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/sql-createtable.html)
