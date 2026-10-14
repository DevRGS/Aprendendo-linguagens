# NULL: quando falta o valor

`NULL` significa **sem valor**: a informação não existe ou não foi preenchida. Na tabela `alunos`, alguns alunos não têm e-mail cadastrado:

```sql
SELECT nome, email FROM alunos;
```

As primeiras linhas do resultado:

| nome | email |
|---|---|
| Ana | ana@escola.br |
| Bruno | NULL |
| Carla | carla@escola.br |

`NULL` não é zero nem texto vazio: é a ausência de valor.

## IS NULL e IS NOT NULL

```sql
SELECT nome FROM alunos WHERE email IS NULL;
```

| nome |
|---|
| Bruno |
| Elisa |
| Heitor |

`WHERE email IS NOT NULL` traz os outros sete.

> [!CAUTION]
> `WHERE email = NULL` **não funciona**. Comparar qualquer coisa com `NULL` dá "desconhecido", que nunca é verdadeiro. A consulta roda sem erro, mas não devolve nenhuma linha. Use sempre `IS NULL`.

## NULL na ordenação

No SQLite, o `ORDER BY` coloca os `NULL` **primeiro** na ordem crescente e por último na decrescente. Para escolher, use `NULLS FIRST` ou `NULLS LAST`:

```sql
SELECT nome, email FROM alunos ORDER BY email NULLS LAST;
```

| nome | email |
|---|---|
| Ana | ana@escola.br |
| Carla | carla@escola.br |
| Diego | diego@escola.br |
| Fábio | fabio@escola.br |
| Gabriela | gabi@escola.br |
| Isadora | isa@escola.br |
| João | joao@escola.br |
| Bruno | NULL |
| Elisa | NULL |
| Heitor | NULL |

> [!NOTE]
> O PostgreSQL faz o contrário: na ordem crescente, os `NULL` vão por último. O PostgreSQL e o SQLite aceitam `NULLS FIRST` e `NULLS LAST`; o MySQL, não.
