# SQL e o SQLite

**SQL** (*Structured Query Language*, ou linguagem de consulta estruturada) é a linguagem usada para conversar com bancos de dados relacionais. Com ela você consulta, insere, altera e apaga dados, e também cria as tabelas.

## Uma linguagem declarativa

Em SQL, você diz **o que** quer, e o banco decide **como** buscar:

```sql
SELECT nome FROM alunos;
```

Essa consulta pede "o nome de todos os alunos". Você não escreve o laço que percorre a tabela: o banco faz isso por você.

## Os principais comandos

| Comando | Para quê |
|---|---|
| `SELECT` | consultar (ler) dados |
| `INSERT` | inserir linhas |
| `UPDATE` | alterar linhas |
| `DELETE` | apagar linhas |
| `CREATE TABLE` | criar uma tabela |

O `SELECT` é o comando mais usado, e é por ele que este curso começa.

## O SQLite

Existem vários **sistemas de banco de dados**: MySQL, PostgreSQL, SQL Server, Oracle, SQLite... Todos entendem SQL, com pequenas diferenças entre si, os **dialetos**.

Este curso usa o **SQLite**, que guarda o banco inteiro num único arquivo e não precisa de um servidor. Ele está em celulares, navegadores e muitos aplicativos. Aqui no site, o SQLite roda **dentro do seu navegador**: as suas consultas não são enviadas para nenhum servidor.

> [!TIP]
> O que você aprende aqui vale para os outros bancos. Quando algo for diferente no MySQL ou no PostgreSQL, a aula avisa num quadro como este.

## Maiúsculas e minúsculas

As **palavras-chave** do SQL não diferenciam maiúsculas de minúsculas: `SELECT`, `select` e `Select` são o mesmo comando. É costume escrevê-las em maiúsculas, para separar dos nomes das tabelas e colunas.

```sql
select nome from alunos;   -- dá o mesmo resultado que SELECT nome FROM alunos;
```
