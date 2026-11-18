# Conectar Node.js ao SQLite

O banco fica no **servidor**, enquanto o navegador faz pedidos à API. No laboratório, SQLite usa um arquivo local; não exige um processo de banco separado. `new DatabaseSync(':memory:')` cria um banco temporário; um caminho de arquivo permite manter os dados depois de fechar a conexão.

O módulo node:sqlite acompanha versões compatíveis do Node, mas é experimental na linha 22 usada nos testes iniciais. Não precisa instalar um pacote npm chamado sqlite para executar estes exemplos. Atualizações de runtime podem trazer diferenças; consulte o manual da mesma versão.

## Conexão e encerramento

A etapa **npm run etapa:banco** cria uma tabela em memória, insere e consulta. O try/finally garante fechamento mesmo quando a demonstração falha. No projeto final, openDatabase recebe o caminho e o processo mantém a conexão enquanto atende ao laboratório; o encerramento do servidor fecha o banco.

DatabaseSync oferece operações síncronas: cada consulta ocupa a execução do processo até terminar. Isso é fácil de observar num curso e apropriado para consultas pequenas. Uma consulta pesada pode bloquear outros pedidos; não confunda await em outro lugar com tornar essa consulta assíncrona.

A central já possui uma [trilha SQL](#/sql). Você pode revisá-la para aprender tabelas e SELECT antes de escrever o repositório; os exemplos abaixo usam o dialeto SQLite.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Arquivo completo etapas/03-banco.mjs; execute npm run etapa:banco. Nada é gravado no banco de suas contas, pois esta etapa usa memória.

```javascript
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync(':memory:');
try {
  db.exec('CREATE TABLE tarefas (id INTEGER PRIMARY KEY, titulo TEXT NOT NULL) STRICT');
  db.prepare('INSERT INTO tarefas(titulo) VALUES (?)').run('Estudar SQL');
  console.log(JSON.stringify(db.prepare('SELECT id, titulo FROM tarefas ORDER BY id').all()));
} finally { db.close(); }
```

## Prática guiada

Execute a etapa duas vezes e explique por que não acumula duas tarefas. Depois localize DATABASE_PATH em server.mjs do projeto final.

<details>
<summary>Conferir resultado e solução</summary>

Cada execução abre um novo banco em memória e o fecha no fim. O projeto final usa data/estudos.sqlite por padrão e por isso mantém dados entre execuções.

</details>

## Fontes

- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
- [SQLite — linguagem SQL](https://www.sqlite.org/lang.html)
