# Migrar a API de estudos para TypeScript

Use Node 22 a partir de 22.13, npm e um terminal. As versões de referência são Node 22.23.4, TypeScript 5.9.3 e tipos de Node 22.15.30. Extraia o ZIP em uma pasta nova.

- `inicial/` contém a API JavaScript completa com SQLite, sessão e testes. Entre nela, execute `npm ci` e `npm test`. Copie a pasta para `trabalho/` antes de editar.
- `solucao/` contém o mesmo projeto com os casos de uso GET por id e POST de tarefas em TypeScript. Entre nela, execute `npm ci`, `npm run check`, `npm run build`, `npm test` e `npm start`. Abra http://127.0.0.1:3000/ e crie uma conta fictícia. Pare com Ctrl+C. `npm start` e `npm test` também compilam pelo ciclo de vida do npm.
- Para os exemplos curtos, trabalhe em `solucao/`. Substitua o conteúdo de `tipos/laboratorio.ts` pelo exemplo completo da aula. Execute `npm run build` e em seguida `node dist/laboratorio.js`. Uma janela separada do Playground oficial em modo Strict também serve para os exemplos sem importação local.

## Migração independente

1. Em trabalho, rode os testes prévios e anote os códigos de POST e GET, a chave Location e o acesso de outra conta.
2. Traga package.json, package-lock.json e tsconfig.json da solução para trabalho. Execute npm ci. Crie tipos/tarefas.ts. Modele Entrada, Tarefa, Resultado e Repositorio. Converta o corpo desconhecido em Entrada validando os campos, o texto aparado, o limite de 120 e NUL.
3. Escreva criarTarefa e lerTarefa. Atribua o usuário no servidor. Em tipos/rotas.ts, escreva os handlers GET por id e POST. Em src/app.mjs registre esses handlers passando o repositório e as dependências da autenticação existente. Preserve middleware CSRF, erros, cabeçalho Location e normalização de IDs.
4. Compare cada arquivo com a solução comentada e execute check, build e test. Rode start e releia uma tarefa após reiniciar o processo. O banco local conserva as tarefas.
5. Variação inédita: acrescente um teste rejeitando um array e outro rejeitando o campo concluida na criação. Inclua um controle positivo com espaços no título. Consulte test/variacao.test.mjs na solução e rode npm test. Os testes HTTP originais já cobrem JSON quebrado.

O teste de backend usa bancos temporários. As rotas PATCH, DELETE, o servidor, a autenticação e o cliente continuam disponíveis para experimentar o contrato completo.
