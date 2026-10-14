# Escolhendo colunas e fazendo contas

## Só as colunas que interessam

```sql
SELECT nome, turma FROM alunos;
```

As colunas aparecem na ordem em que você as escreve. Trocar a ordem no `SELECT` troca a ordem no resultado:

```sql
SELECT turma, nome FROM alunos;
```

| turma | nome |
|---|---|
| 2A | Ana |
| 1B | Bruno |

## Contas no SELECT

O `SELECT` também calcula. A conta é feita linha a linha, só no resultado: **a tabela não muda**.

```sql
SELECT nome, idade, idade + 1 FROM alunos;
```

As primeiras linhas do resultado:

| nome | idade | idade + 1 |
|---|---|---|
| Ana | 17 | 18 |
| Bruno | 16 | 17 |
| Carla | 18 | 19 |

Os operadores são `+`, `-`, `*` e `/`. O nome da coluna calculada é a própria conta (`idade + 1`); a última aula do módulo mostra como dar um nome melhor com `AS`.

> [!CAUTION]
> Divisão entre dois inteiros descarta a parte decimal: `SELECT 7 / 2;` dá `3`. Para obter `3.5`, use um número com ponto: `7 / 2.0`. O PostgreSQL faz igual ao SQLite; no MySQL, `7 / 2` já dá `3.5000`.

## Valores fixos

Um valor escrito direto no `SELECT` se repete em todas as linhas:

```sql
SELECT nome, 'aluno' FROM alunos;
```

As primeiras linhas do resultado:

| nome | 'aluno' |
|---|---|
| Ana | aluno |
| Bruno | aluno |
