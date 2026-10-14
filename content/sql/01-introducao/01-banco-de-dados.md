# O que é um banco de dados

Quase todo sistema guarda informações: os alunos de uma escola, os produtos de uma loja, as mensagens de um aplicativo. Um **banco de dados** guarda essas informações de um jeito organizado, para que seja fácil encontrá-las, mudá-las e manter tudo consistente.

## Tabelas, linhas e colunas

Nos bancos **relacionais**, os mais usados, os dados ficam em **tabelas**, parecidas com planilhas:

| id | nome | idade | cidade |
|---|---|---|---|
| 1 | Ana | 17 | Recife |
| 2 | Bruno | 16 | Natal |
| 3 | Carla | 18 | Recife |

- Cada **coluna** é um tipo de informação: `nome`, `idade`, `cidade`.
- Cada **linha** é um registro: aqui, um aluno.
- Toda coluna tem um **tipo**: `idade` guarda números inteiros; `nome` e `cidade`, textos.

## A chave primária

A coluna `id` tem um papel especial: ela é a **chave primária**. Cada linha tem um valor diferente nela, então o `id` identifica um aluno sem confusão, mesmo que existam dois alunos com o mesmo nome.

> [!NOTE]
> Um banco costuma ter várias tabelas ligadas entre si, como `alunos`, `turmas` e `notas`. É daí que vem o nome "relacional". O módulo de junções mostra como juntar tabelas numa consulta.

## As tabelas deste curso

Os exercícios usam dois bancos pequenos:

- **escola**, com a tabela `alunos`: `id`, `nome`, `idade`, `cidade`, `turma`, `nota` e `email`.
- **loja**, com a tabela `produtos`: `id`, `nome`, `categoria`, `preco` e `estoque`.

Em cada exercício, o bloco **"Tabelas deste exercício"** mostra as tabelas completas. Abra e dê uma olhada antes de escrever a consulta.
