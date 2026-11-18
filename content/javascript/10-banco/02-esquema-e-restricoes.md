# Esquema, tipos, chaves e restrições

Uma tabela precisa expressar o que pode ser armazenado. O projeto tem usuarios (identidade e hash), sessoes (referência ao usuário, token e expiração) e tarefas (dono, título e conclusão). O id identifica a linha; usuario_id liga cada tarefa ao proprietário. Na tabela final de tarefas, AUTOINCREMENT impede reutilizar um id já emitido depois de excluir a linha: um endereço antigo deve continuar representando um recurso ausente, sem passar a alterar uma tarefa recém-criada.

NOT NULL impede ausência SQL, UNIQUE impede nome duplicado e CHECK restringe valores. Concluída é guardada como 0/1 porque SQLite não tem um tipo booleano independente da mesma forma que JavaScript. O repositório converte para true/false ao montar o JSON.

As tabelas são STRICT e as chaves estrangeiras estão habilitadas com PRAGMA foreign_keys=ON. Não presuma que declarar uma FK sem considerar a configuração da conexão garante o comportamento esperado. ON DELETE CASCADE especifica a remoção das linhas dependentes se uma conta for removida; esta API não oferece rota pública de excluir conta.

Validação de entrada e restrições do banco se complementam. Uma mensagem amigável da API deve explicar o contrato, e o banco continua defendendo a integridade. O frontend sozinho não é uma barreira: um cliente pode chamar a API sem usar seu formulário.

## Material e preparação

[Baixe o projeto API de estudos](content/javascript/projetos/api-estudos.zip) e extraia a pasta. Os caminhos desta etapa partem de `api-estudos/`, onde fica package.json. O README do pacote contém instalação, comandos Windows/Bash e todo o contrato HTTP. A API roda no seu computador; o site da trilha apenas mostra o material.

## Código em contexto

Este bloco é SQL, mostrado aqui para leitura da estrutura final em src/database.mjs (a migração 2 cria tarefas_v2 e depois renomeia a tabela). Ele depende da tabela usuarios criada pela migração do projeto; não é JavaScript executável isolado.

```sql
CREATE TABLE tarefas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL CHECK(length(trim(titulo)) BETWEEN 1 AND 120),
  concluida INTEGER NOT NULL DEFAULT 0 CHECK(concluida IN (0, 1))
) STRICT;
```

## Prática guiada

Abra database.mjs e encontre a criação das três tabelas e dos índices. Identifique quais regras tratam título vazio, nome repetido e usuário inexistente.

<details>
<summary>Conferir resultado e solução</summary>

CHECK do título trata o comprimento após trim; UNIQUE do usuário impede duplicação; FK relaciona dono existente. A API também valida seus campos antes de executar SQL.

</details>

## Fontes

- [Node 22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html)
- [SQLite — linguagem SQL](https://www.sqlite.org/lang.html)
