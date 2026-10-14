# Filtrando linhas com WHERE

`WHERE` escolhe **quais linhas** entram no resultado: só as que satisfazem a condição.

```sql
SELECT nome, nota FROM alunos WHERE nota > 9;
```

| nome | nota |
|---|---|
| Ana | 9.5 |
| Isadora | 10 |

## Comparações

| Operador | Significa |
|---|---|
| `=` | igual |
| `<>` ou `!=` | diferente |
| `>` e `<` | maior e menor |
| `>=` e `<=` | maior ou igual e menor ou igual |

## Texto vai entre aspas simples

```sql
SELECT nome FROM alunos WHERE cidade = 'Recife';
```

| nome |
|---|
| Ana |
| Carla |
| Gabriela |

- Números vão sem aspas: `WHERE idade = 17`.
- Textos vão entre **aspas simples**: `'Recife'`.

> [!WARNING]
> No padrão do SQL, aspas **duplas** servem para nomes de colunas e tabelas, não para textos. O SQLite aceita `"Recife"` como texto por compatibilidade, mas o PostgreSQL não: lá, `"Recife"` seria o nome de uma coluna. Use sempre aspas simples para textos.

> [!IMPORTANT]
> No SQLite, o `=` entre textos diferencia maiúsculas de minúsculas: `WHERE cidade = 'recife'` não encontra nenhuma linha, porque a cidade está gravada como `Recife`. O PostgreSQL faz igual; no MySQL, com a configuração mais comum, essa comparação não diferencia.
