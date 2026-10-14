# Sem repetir, ordenando e limitando

## DISTINCT: sem repetições

```sql
SELECT DISTINCT cidade FROM alunos;
```

| cidade |
|---|
| Recife |
| Natal |
| Fortaleza |
| Salvador |

Com várias colunas, o `DISTINCT` olha a **combinação**: `SELECT DISTINCT cidade, turma` só tira as linhas em que a cidade **e** a turma se repetem juntas.

## ORDER BY: ordenando

```sql
SELECT nome, nota FROM alunos ORDER BY nota DESC;
```

| nome | nota |
|---|---|
| Isadora | 10 |
| Ana | 9.5 |
| Elisa | 9 |
| Gabriela | 8.5 |
| Carla | 8 |
| Diego | 7.5 |
| João | 7 |
| Bruno | 6 |
| Fábio | 5.5 |
| Heitor | 4 |

- `ASC` (o padrão) ordena de forma crescente; `DESC`, decrescente.
- Dá para ordenar por várias colunas: `ORDER BY cidade, nome` ordena pela cidade e, dentro de cada cidade, pelo nome.
- Sem `ORDER BY`, **a ordem do resultado não é garantida**: o banco devolve as linhas na ordem que for mais conveniente para ele.

```sql
SELECT cidade, nome FROM alunos ORDER BY cidade, nome;
```

| cidade | nome |
|---|---|
| Fortaleza | Diego |
| Fortaleza | Heitor |
| Natal | Bruno |
| Natal | Elisa |
| Natal | João |
| Recife | Ana |
| Recife | Carla |
| Recife | Gabriela |
| Salvador | Fábio |
| Salvador | Isadora |

## LIMIT: só as primeiras linhas

Os 3 produtos mais baratos:

```sql
SELECT nome, preco FROM produtos ORDER BY preco LIMIT 3;
```

| nome | preco |
|---|---|
| Lápis | 1.2 |
| Caneta azul | 2.5 |
| Caderno | 18.9 |

`LIMIT 3 OFFSET 3` pula os 3 primeiros e pega os 3 seguintes, o que é útil para mostrar resultados em páginas. Aqui, seriam Estojo, Carregador e Garrafa térmica.

> [!TIP]
> `LIMIT` sem `ORDER BY` pega linhas quaisquer. Para "os 3 mais baratos", ordene antes.

> [!NOTE]
> `LIMIT` funciona no SQLite, no MySQL e no PostgreSQL. O SQL Server usa `SELECT TOP 3 ...`, e a forma do padrão SQL, aceita pelo PostgreSQL e pelo Oracle, é `FETCH FIRST 3 ROWS ONLY`. O SQLite não aceita essas duas.
