# Adicionar uma coluna com migração

Uma migração descreve como transformar um esquema existente. Comece com as três leituras da carga inicial. Adicionar uma coluna com valor padrão torna o campo imediatamente consultável nas linhas anteriores. Use uma transação desfeita para ensaiar a mudança.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
BEGIN;
ALTER TABLE caderno.leituras ADD COLUMN prioridade integer NOT NULL DEFAULT 1;
SELECT prioridade,count(*) FROM caderno.leituras GROUP BY prioridade;
ROLLBACK;
```

O grupo de prioridade 1 contém três linhas; ao desfazer, a coluna de ensaio desaparece.

## 2. Investigue uma variação

Mude o padrão para 2 no comando de criação e repita.

<details>
<summary>Conferir a variação</summary>

Em uma transação nova, as três linhas aparecem com prioridade 2.

</details>

## 3. Resolva em outro caso

Acrescente uma restrição para prioridade entre 1 e 3. Prove que uma atualização para 9 é recusada.

<details>
<summary>Conferir a solução e o resultado</summary>

Após ADD COLUMN use ALTER TABLE caderno.leituras ADD CHECK (prioridade BETWEEN 1 AND 3); depois UPDATE caderno.leituras SET prioridade=9 WHERE id=1;. O erro é 23514. Execute ROLLBACK.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/sql-altertable.html)
