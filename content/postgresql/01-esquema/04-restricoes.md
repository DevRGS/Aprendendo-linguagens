# Verificar chaves e regras de domínio

Uma chave estrangeira relaciona o aluno de cada leitura a uma linha real de alunos. CHECK exige minutos positivos. Use uma transação com uma falha intencional no console psql interativo; ROLLBACK permite voltar a consultar depois do erro.

## Preparação

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

Na pasta **solucao**, conecte-se com `psql -h 127.0.0.1 -U estudos -d central_lab`. No psql interativo, use `\i sql/reiniciar.sql` para começar com a carga de três alunos e três leituras. O script recria o esquema caderno desta base dedicada.

## 1. Demonstração

```sql
BEGIN;
INSERT INTO caderno.leituras(aluno_id,tema,minutos) VALUES (999,'Teste',10);
ROLLBACK;
SELECT count(*) FROM caderno.leituras;
```

A inserção gera violação de chave estrangeira (23503). Depois de ROLLBACK, a contagem continua 3. Se estiver executando um script com ON_ERROR_STOP, execute ROLLBACK manualmente antes de continuar.

## 2. Investigue uma variação

Use aluno 1, mas duração zero na mesma experiência. Qual regra acusa o erro?

<details>
<summary>Conferir a variação</summary>

A chave estrangeira passa; a condição minutos > 0 falha (23514). Depois do erro use ROLLBACK.

</details>

## 3. Resolva em outro caso

Insira uma leitura válida para o aluno 3 numa transação. Observe feita e desfaça.

<details>
<summary>Conferir a solução e o resultado</summary>

BEGIN; INSERT INTO caderno.leituras(aluno_id,tema,minutos) VALUES (3,'CSS',5) RETURNING feita; ROLLBACK;. O valor padrão é false.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.postgresql.org/docs/17/ddl-constraints.html)
