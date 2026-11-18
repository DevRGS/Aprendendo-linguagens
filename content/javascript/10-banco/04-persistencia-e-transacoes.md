# Persistência, paginação, transações e backup

O arquivo SQLite guarda dados entre reinicializações. Teste criando uma tarefa, encerrando com Ctrl+C e iniciando novamente; recarregar só o navegador não prova que o servidor reabriu o banco. O caminho depende da pasta de execução/configuração, então mantenha a instrução de entrar em api-estudos antes de npm start.

Listagens usam LIMIT e OFFSET validados. O índice por usuário/id ajuda a filtrar e ordenar. Sem ORDER BY estável, a aplicação não deve prometer páginas na mesma sequência. Mesmo com a ordenação, inserções/exclusões entre pedidos podem deslocar resultados da paginação por offset.

Uma **transação** agrupa escritas que precisam acontecer juntas. O projeto a usa na migração e na rotação da sessão: BEGIN IMMEDIATE, escritas, COMMIT; se algo falha, ROLLBACK. Não mantenha uma transação síncrona aberta enquanto espera a pessoa responder ou uma requisição remota terminar.

O esquema atual usa user_version=2. A migração 1 cria as tabelas; a 2 preserva contas, sessões e tarefas ao introduzir AUTOINCREMENT na identidade das tarefas. Os testes abrem um banco antigo e verificam a atualização sem apagar dados. Mudanças futuras precisam de migrações testadas; criar tudo com IF NOT EXISTS não atualiza automaticamente o formato de uma tabela antiga.

Para backup simples do laboratório, pare o servidor e copie a pasta data para um local protegido. Com WAL ativo podem existir arquivos -wal/-shm: copiar apenas o principal durante uso não é garantia de cópia consistente. Para sistemas ativos use uma solução de backup SQLite apropriada e teste a restauração, não só a cópia.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Trecho de tasks em src/database.mjs. userId vem da sessão; limit/offset já foram validados pela rota. Este trecho precisa da conexão e do esquema do projeto.

```javascript
const itens = db.prepare(
  'SELECT id, titulo, concluida FROM tarefas WHERE usuario_id = ? ORDER BY id DESC LIMIT ? OFFSET ?'
).all(userId, limit, offset);
```

## Prática guiada

Crie três tarefas, consulte limit=1 com offsets 0 e 1 e reinicie o processo. Faça um backup com o servidor parado sem apagar seu banco original.

<details>
<summary>Conferir resultado e solução</summary>

Cada página contém um item e total informa a contagem da conta. O reinício mantém dados; um backup restaurado deve reproduzir essas linhas e o esquema esperado.

</details>

## Fontes

- [SQLite — transações](https://www.sqlite.org/lang_transaction.html)
- [SQLite — backup](https://www.sqlite.org/backup.html)
- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
