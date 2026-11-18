# Consultas parametrizadas e repositório

Nunca construa SQL concatenando o texto digitado. Em `prepare('... WHERE id = ?')`, o SQL e o valor são enviados separadamente. Isso mantém dados como dados, inclusive aspas. Validação de formato continua necessária, mas não substitui parâmetros.

O repositório reúne operações do banco e devolve estruturas que a rota entende. Em SQLite/Node, get lê uma linha, all lê várias e run executa uma escrita com informações como changes e lastInsertRowid. O número de linhas alteradas ajuda a decidir se uma exclusão encontrou o alvo.

No projeto, **todas as consultas de tarefas incluem o usuário da sessão**. Consultar só por id deixaria uma conta alcançar dados de outra. O proprietário não vem do corpo JSON nem de uma caixa oculta do formulário; ele foi identificado pelo servidor.

Os placeholders servem para valores, não para nomes de tabela/coluna arbitrários. Se oferecer ordenação escolhida pelo cliente, use uma lista de opções de SQL conhecidas, não interpole diretamente qualquer string. Este projeto fixa a ordenação por id decrescente.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Trechos de src/database.mjs: db é a conexão aberta e userId/id/titulo são argumentos validados. Veja os métodos task/createTask no arquivo completo para executar no projeto.

```javascript
const row = db.prepare(
  'SELECT id, titulo, concluida FROM tarefas WHERE usuario_id = ? AND id = ?'
).get(userId, id);
const created = db.prepare(
  'INSERT INTO tarefas(usuario_id, titulo) VALUES (?, ?)'
).run(userId, titulo);
```

## Prática guiada

Cadastre duas contas. Crie uma tarefa com aspas no título e tente ler seu id na outra conta. Depois consulte o título original.

<details>
<summary>Conferir resultado e solução</summary>

O texto com aspas é preservado literalmente; a outra conta recebe 404. Os testes incluem uma string que parece SQL para provar que ela não vira comando.

</details>

## Fontes

- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
- [SQLite — linguagem SQL](https://www.sqlite.org/lang.html)
