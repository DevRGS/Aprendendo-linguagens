# Apelidos de coluna com AS

`AS` dá um **apelido** a uma coluna do resultado. É útil para colunas calculadas e para deixar o resultado mais claro:

```sql
SELECT nome AS aluno, idade + 1 AS idade_ano_que_vem FROM alunos;
```

As primeiras linhas do resultado:

| aluno | idade_ano_que_vem |
|---|---|
| Ana | 18 |
| Bruno | 17 |
| Carla | 19 |

- O apelido muda só o **resultado**; na tabela, a coluna continua se chamando `nome`.
- O `AS` é opcional: `SELECT nome aluno FROM alunos` também funciona. Com `AS`, fica mais fácil de ler.
- Apelido com espaço precisa de aspas: `SELECT nome AS "Nome do aluno" FROM alunos`. Sem as aspas, dá erro de sintaxe. Prefira as **aspas duplas**, que são o padrão do SQL para nomes: o SQLite também aceita aspas simples num apelido, mas nem todo banco aceita.

> [!NOTE]
> Aqui as aspas duplas estão no papel certo: elas marcam um **nome** (de coluna), e não um texto.

## Usando o apelido no ORDER BY

O apelido pode ser usado para ordenar:

```sql
SELECT nome, nota * 10 AS pontos FROM alunos ORDER BY pontos DESC LIMIT 3;
```

| nome | pontos |
|---|---|
| Isadora | 100 |
| Ana | 95 |
| Elisa | 90 |
