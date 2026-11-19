# Alterar somente a leitura pretendida

Um UPDATE seleciona linhas pelo predicado WHERE. Quando o registro pertence a um aluno, filtre por dono e identificador na própria instrução. Com RETURNING você consegue ver quais linhas foram realmente alteradas.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
BEGIN;
UPDATE caderno.leituras SET feita=true WHERE aluno_id=1 AND id=2
RETURNING id,tema,feita;
ROLLBACK;
```

O retorno mostra id 2, SQL, true. Depois do rollback o registro volta ao estado false.

## 2. Investigue uma variação

Repita com aluno_id=2 e id=2. Quantas linhas são atualizadas?

<details>
<summary>Conferir a variação</summary>

Zero. A leitura 2 pertence ao aluno 1.

</details>

## 3. Resolva em outro caso

Aumente em cinco minutos a leitura 1 do aluno 1 e mostre a nova duração. Desfaça depois.

<details>
<summary>Conferir a solução e o resultado</summary>

BEGIN; UPDATE caderno.leituras SET minutos=minutos+5 WHERE aluno_id=1 AND id=1 RETURNING minutos; ROLLBACK;. A saída é 15.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/sql-update.html)
