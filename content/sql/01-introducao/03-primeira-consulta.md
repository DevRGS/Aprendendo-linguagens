# Sua primeira consulta

## SELECT e FROM

A consulta mais simples tem duas partes:

```sql
SELECT nome, cidade
FROM alunos;
```

- `SELECT` diz **quais colunas** você quer, separadas por vírgula, na ordem em que devem aparecer.
- `FROM` diz **de qual tabela**.
- O `;` marca o fim da instrução. Numa consulta sozinha, o SQLite aceita sem ele, mas é bom costume colocar.

As primeiras linhas do resultado:

| nome | cidade |
|---|---|
| Ana | Recife |
| Bruno | Natal |
| Carla | Recife |

Para pegar **todas** as colunas, use `*`:

```sql
SELECT * FROM alunos;
```

> [!TIP]
> A consulta pode ocupar várias linhas e ter espaços à vontade. `SELECT nome, cidade FROM alunos;`, numa linha só, dá o mesmo resultado.

## Comentários

O que vem depois de `--`, até o fim da linha, é comentário e não é executado. Para comentar várias linhas, use `/*` e `*/`.

```sql
-- isto é um comentário
SELECT nome   -- este também
FROM alunos;

/* comentário de
   várias linhas */
```

## Como funcionam os exercícios

1. Leia o enunciado e abra **"Tabelas deste exercício"** para ver os dados.
2. Escreva a consulta na caixa e clique em **Executar** (ou aperte **Ctrl+Enter**).
3. Compare o **seu resultado** com o **resultado esperado**. Nos desafios das aulas, você pode tentar quantas vezes quiser; depois da primeira tentativa, aparece "Ver uma resposta".

O que conta é o **resultado**: qualquer consulta que chegue nele está certa. Mas a correção também roda a sua consulta com **outros dados**, que você não vê. Assim, uma consulta que só acertou por coincidência (por exemplo, escolhendo as linhas pelo `id` em vez de pela regra pedida) é recusada, com uma explicação.

> [!NOTE]
> Na caixa de texto, a tecla Tab insere dois espaços. Para sair da caixa usando o teclado, aperte Esc e depois Tab.
