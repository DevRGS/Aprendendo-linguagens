# Referência de PostgreSQL

[Baixar o laboratório completo](content/postgresql/projetos/projeto.zip)

## Ambiente

Use PostgreSQL 17 e seu cliente psql. O laboratório de SQL usa o esquema caderno. As tabelas do CRUD ficam em central_api. O roteiro detalhado de instalação, conexão e reinício acompanha o ZIP.

- `\conninfo` exibe a conexão.
- `\dt caderno.*` lista as tabelas de exercícios.
- `\d caderno.leituras` mostra colunas e restrições.
- `\i sql/reiniciar.sql` restaura a carga do caderno na base dedicada.
- `\q` encerra o cliente.

## Banco e esquema

Abra psql e experimente tabelas, tipos, chaves e restrições em uma base dedicada.

- **Abrir uma sessão no banco do laboratório.** Esses metacomandos são processados pelo cliente psql.

- **Criar uma tabela temporária de rascunho.** CREATE TEMP TABLE cria uma relação temporária.

- **Escolher tipos para duração e estado.** A coluna feita aceita os valores lógicos do banco.

- **Verificar chaves e regras de domínio.** A referência exige linha correspondente na tabela de alunos.

[Leitura oficial do módulo](https://www.postgresql.org/docs/17/tutorial-table.html)

## Consultas do projeto

Produza relatórios com alunos, leituras e páginas de ordem estável.

- **Relacionar alunos e leituras.** A ausência de leitura produz nulos nas colunas da direita.

- **Contar leituras de cada aluno.** Isso permite obter zero para quem não tem leitura.

- **Filtrar grupos depois da agregação.** HAVING consegue consultar o agregado calculado.

- **Ordenar resultados e desempatar a página.** O segundo critério resolve o empate na duração.

[Leitura oficial do módulo](https://www.postgresql.org/docs/17/queries-table-expressions.html)

## Escrita consistente

Insira, atualize, confirme e desfaça gravações relacionadas.

- **Inserir e receber os valores gerados.** RETURNING está ligado às linhas afetadas pela instrução.

- **Alterar somente a leitura pretendida.** A conjunção exige que as duas condições sejam satisfeitas na mesma linha.

- **Confirmar duas escritas como unidade.** A confirmação conclui a transação e torna as mudanças persistentes.

- **Comprovar o rollback após uma falha.** A primeira escrita pertencia à mesma transação que a falha.

[Leitura oficial do módulo](https://www.postgresql.org/docs/17/tutorial-transactions.html)

## Evolução e desempenho

Ensaie uma migração, gere uma amostra e compare planos de uma mesma consulta.

- **Adicionar uma coluna com migração.** ALTER TABLE descreve mudanças no esquema.

- **Popular dados fictícios de forma repetível.** generate_series produz as linhas de origem para o INSERT SELECT.

- **Interpretar o plano de uma consulta.** EXPLAIN ANALYZE executa e acrescenta dados observados.

- **Experimentar um índice na mesma consulta.** Variar filtro e índice juntos dificulta explicar diferenças.

[Leitura oficial do módulo](https://www.postgresql.org/docs/17/using-explain.html)

## API integrada

Conecte o CRUD ao PostgreSQL e teste atomicidade e autorização entre contas.

- **Conectar a API ao PostgreSQL local.** O servidor precisa da conexão e mantém credenciais fora do cliente.

- **Passar valores separados da consulta.** O driver envia os parâmetros separadamente do texto do comando.

- **Confirmar a autorização entre duas contas.** A combinação liga o recurso solicitado à identidade autenticada.

- **Reproduzir o CRUD e a escrita atômica.** O contrato público orienta os testes enquanto o banco e seu cliente mudam.

[Leitura oficial do módulo](https://node-postgres.com/features/transactions)
