# Referência rápida de SQL

Resumo para consultar durante os estudos. Os detalhes estão nas aulas. O dialeto é o do SQLite.

## A forma de uma consulta

```sql
SELECT colunas
FROM tabela
WHERE condição
ORDER BY coluna DESC
LIMIT 10 OFFSET 20;
```

As cláusulas aparecem sempre nesta ordem. Só `SELECT` e `FROM` são obrigatórias numa consulta a uma tabela.

## Condições

| Escrita | Significa |
|---|---|
| `=` | igual |
| `<>` ou `!=` | diferente |
| `>`, `<`, `>=`, `<=` | maior, menor, maior ou igual, menor ou igual |
| `AND`, `OR`, `NOT` | e, ou, não (o `AND` vale antes do `OR`) |
| `IN ('a', 'b')` | está na lista |
| `BETWEEN 7 AND 9` | está na faixa, com as pontas |
| `LIKE 'Ca%'` | combina com o padrão (`%`: qualquer quantidade de caracteres; `_`: um caractere) |
| `IS NULL`, `IS NOT NULL` | não tem valor, tem valor |

## No resultado

| Escrita | Faz |
|---|---|
| `SELECT *` | todas as colunas |
| `SELECT DISTINCT` | tira as linhas repetidas |
| `idade + 1` | conta feita em cada linha, só no resultado |
| `nome AS aluno` | apelido da coluna (com espaço, use aspas duplas) |
| `ORDER BY nota DESC` | ordena; `ASC` (o padrão) é crescente |
| `LIMIT 3 OFFSET 3` | pula 3 linhas e pega as 3 seguintes |

## Pegadinhas clássicas

- Textos vão entre **aspas simples**: `'Recife'`. Aspas duplas são para nomes de colunas.
- No SQLite, o `=` diferencia maiúsculas de minúsculas; o `LIKE` não, nas letras sem acento.
- `7 / 2` dá `3`: divisão entre inteiros. Use `7 / 2.0` para `3.5`.
- `AND` vale antes do `OR`. Na dúvida, use parênteses.
- `= NULL` nunca é verdadeiro. Use `IS NULL`.
- Sem `ORDER BY`, a ordem do resultado não é garantida, e `LIMIT` pega linhas quaisquer.

## Créditos

A ordem dos assuntos e a ideia de praticar escrevendo consultas vêm do [SQL Teaching](https://www.sqlteaching.com/), de Ronald Cheng, publicado com a licença MIT. O SQLite roda no navegador graças ao [sql.js](https://github.com/sql-js/sql.js) (licença MIT); o SQLite é de domínio público.
