# Buscando partes do texto com LIKE

O `=` compara o texto inteiro. Para buscar **partes** de um texto, use `LIKE` com os curingas:

| Curinga | Significa |
|---|---|
| `%` | qualquer quantidade de caracteres, inclusive nenhum |
| `_` | exatamente um caractere |

Produtos cujo nome começa com "Ca":

```sql
SELECT nome FROM produtos WHERE nome LIKE 'Ca%';
```

| nome |
|---|
| Caderno |
| Caneta azul |
| Carregador |

Mais exemplos:

| Condição | Encontra | Na loja |
|---|---|---|
| `nome LIKE '%a'` | termina com "a" | Mochila, Garrafa térmica |
| `nome LIKE '%de%'` | tem "de" em qualquer lugar | Caderno, Fone de ouvido |
| `nome LIKE '_____'` | tem exatamente 5 caracteres | Lápis |

`NOT LIKE` faz o contrário: fica com os textos que **não** combinam com o padrão.

> [!NOTE]
> No SQLite, o `LIKE` não diferencia maiúsculas de minúsculas nas letras sem acento: `LIKE 'ca%'` também encontra `Caderno`. Nas letras acentuadas, diferencia: `'Ábaco' LIKE 'á%'` é falso. No PostgreSQL, o `LIKE` sempre diferencia (para ignorar, existe o `ILIKE`); no MySQL, depende da configuração do banco.
