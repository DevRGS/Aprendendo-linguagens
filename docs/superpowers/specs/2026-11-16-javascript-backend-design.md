# JavaScript: APIs, banco de dados e CRUD

- Data: 2026-11-16.
- Autorização: usuário pediu acrescentar a etapa explicada (Node, API REST, CRUD SQL, validação, autenticação e frontend), com bastante detalhe.
- Preservar as 32 aulas, 120 perguntas e 80 cartas já entregues, sem trocar IDs.

## Objetivo e abordagem

Ensinar a construir e executar uma API real e conectar uma interface JavaScript a um banco SQL. O aluno deve conseguir instalar o ambiente, entender HTTP, escrever consultas parametrizadas, implementar CRUD, validar entradas, autenticar contas, restringir acesso e testar o fluxo completo.

Usar **Node.js com Express 5.3.0 e SQLite via node:sqlite**. SQLite aproveita o dialeto da trilha SQL e permite iniciar com um arquivo, sem serviço de banco separado. PostgreSQL é apresentado como próximo caminho, com diferenças de conexão/deploy, sem prometer que basta trocar o nome do driver.

Outra abordagem considerada: PostgreSQL desde o início, com serviço, credenciais e instalação adicionais; não é necessária para aprender o fluxo solicitado. Um motor de backend dentro do site exigiria isolamento e infraestrutura distintos; a prática continua local, no formato já autorizado.

## Escopo curricular

Acrescentar seis módulos com quatro aulas cada, 15 perguntas e 10 cartas por módulo. Totais novos: **24 aulas, 90 perguntas, 60 cartas**. Trilha completa: **14 módulos, 56 aulas, 210 perguntas e 140 cartas**.

| Módulo / id | Quatro aulas |
|---|---|
| Node e HTTP / `node` | Instalar Node/npm e criar projeto; HTTP e primeiro servidor; Express, rotas e middleware; REST, contratos, status e teste manual |
| Banco SQL / `banco` | SQLite e conexão no servidor; esquema/restrições; consultas parametrizadas e repositório; persistência, paginação, transações e backup |
| API CRUD / `api` | Listar/buscar/criar; atualizar/remover; validar e tratar erros; testes HTTP de integração |
| Frontend e API / `integracao` | Mesma origem e cliente fetch; formulário/lista assíncronos; carregamento/falha/concorrência; executar o fluxo CRUD completo |
| Autenticação / `autenticacao` | Contas e hash de senha; sessões/cookies/logout; autorização por proprietário; CSRF, CORS e limites de abuso |
| Projeto backend / `backend-projeto` | Organização/configuração; projeto completo para baixar; testes e persistência; implantação/HTTPS/limites e evolução |

Cada aula terá preparação explícita, objetivos, explicação detalhada, código contextualizado, execução, resultado esperado, erros comuns, exercício com solução e fontes. Fragmentos que dependem de código anterior indicam exatamente arquivo/etapa e fornecem o projeto completo. Não apresentar pseudocódigo como arquivo executável.

## Ambiente e versões

- Instalar Node LTS pelo site oficial, verificar `node --version` e `npm --version`, explicar terminal Windows/Linux, PATH e reabertura do terminal.
- Piso do exemplo: Node **22.13.0**; verificar também em LTS atual se viável. CI existente usa Node 22. Ambiente inicial: 22.23.4. `node:sqlite` é experimental na linha 22; explicar o aviso e consultar a documentação da versão usada.
- Usar ESM (`type: module`/`.mjs`) e Express **5.3.0** fixado, incluindo lockfile no projeto baixável. `npm ci`, `npm start` e `npm test` documentados.
- Banco e credenciais pertencem ao servidor. GitHub Pages entrega somente aulas e arquivos para download, não executa Node nem hospeda o SQLite do aluno.

## Projeto executável

Fonte em `content/javascript/projetos/api-estudos/`; ZIP em `content/javascript/projetos/api-estudos.zip`, acessível por link relativo que funcione no GitHub Pages. Incluir README detalhado, package/lock, `.env.example`, `.gitignore`, etapas iniciais executáveis, `src/`, `public/` e testes locais.

Tema: lista de estudos por usuário. API e frontend na mesma origem, com Express servindo somente `public/`, nunca a raiz que contém banco/configuração.

### Contrato HTTP

- `GET /api/saude` → 200.
- `POST /api/usuarios` com usuário/senha válidos → 201; conta repetida → 409.
- `POST /api/sessao` → 200 e cookie de sessão novo; credenciais inválidas → 401 com mensagem genérica.
- `GET /api/sessao` → usuário público e token CSRF; sem sessão/expirada → 401.
- `DELETE /api/sessao` → 204, revoga sessão e limpa cookie.
- `GET /api/tarefas` → 200 com itens/total/limit/offset, limites numéricos validados e ordenação estável.
- `GET /api/tarefas/:id` → 200 ou 404.
- `POST /api/tarefas` com título → 201 e Location.
- `PATCH /api/tarefas/:id` com título e/ou concluída → 200.
- `DELETE /api/tarefas/:id` → 204 sem corpo.
- Erros JSON padronizados `{erro:{codigo,mensagem}}`: 400 validação/JSON, 401 sessão, 403 origem/CSRF, 404 ausência, 409 conflito, 413 tamanho, 415 tipo de conteúdo, 429 limite, 500 falha interna sem stack/SQL ao cliente.

### Banco e segurança efetivamente implementados

- SQLite persistente com tabelas de usuários, sessões e tarefas, restrições, chaves estrangeiras e SQL parametrizado. Todo acesso de tarefas inclui proprietário autenticado; ID de outro usuário resulta em 404.
- Senhas com salt aleatório e scrypt assíncrono. Parâmetros fixos baseados na alternativa OWASP: N=32768, r=8, p=3, derivação64bytes, maxmem64MiB. Comparação com timingSafeEqual; sem senha/hash no JSON/log.
- Token de sessão aleatório32bytes, hashSHA256 guardado no banco, expiração8h e rotação no login. Token CSRF de sessão independente. Cookies HttpOnly/SameSite=Strict/Path=/ e Secure quando configurado HTTPS; logout remove o token no banco.
- Mutações exigem Origin configurada e, depois do login, cabeçalho X-CSRF-Token. Cadastro/login exigem JSON e origem válida. Não habilitar CORS curinga com credenciais.
- Corpo JSON limitado16KiB, validação estrita de campos/IDs/tipos, título1–120 caracteres, proteção contra atribuição de proprietário pelo cliente e limitação local de autenticação. Limite de hashes simultâneos para conter custo de CPU/memória.
- Frontend usa textContent, credenciais same-origin, tratamento de204/401, mensagens de validação, controles desabilitados durante pedidos e preservação de entrada quando há falha.
- API vinculada a127.0.0.1 por padrão; configuração explícita de origem/porta/banco. Não publicar nem colocar dados reais. Explicar limites de single-process/SQLite síncrono, proteção de proxy/TLS, gestão de segredos e revisão necessária para produção.

## Testes e material para estudo

- Testes HTTP reais em loopback, banco temporário, sem contas externas. CRUD, reinicialização/persistência, paginação, validação, SQL injection como dado literal, isolamento entre usuários, login/logout/expiração, cookie/CSRF/origem, rate limit, tamanho e tipo de corpo.
- Testes do cliente com respostas controladas e fluxo completo no Chrome (cadastro/login, CRUD, recarga e logout).
- Etapas iniciais e exemplos adicionais executáveis, sem iniciar listeners permanentes ao importar para testes.
- Conferir ZIP contra a fonte, excluindo dados locais, node_modules, `.env` e arquivos de banco. Express e fflate entram apenas nas dependências de teste/ferramentas da central; o site permanece estático.
- Ajustar testes que fixavam quantidades da trilha para preservar base de32aulas e conferir a extensão14módulos. Ampliar cobertura de exemplos sem exigir Node para alunos dos módulos iniciais.
- Atualizar referência, README e roteiro; testes completos e revisão independente antes da conclusão.

## Fontes primárias

[Node — downloads](https://nodejs.org/en/download), [Node22 — SQLite](https://nodejs.org/download/release/v22.23.0/docs/api/sqlite.html), [Node — HTTP](https://nodejs.org/api/http.html), [Node — crypto](https://nodejs.org/api/crypto.html), [Express5](https://expressjs.com/en/5x/api/), [Express — erros](https://expressjs.com/en/guide/error-handling/), [SQLite](https://www.sqlite.org/lang.html), [MDN — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods), [MDN — fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [OWASP — senhas](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [sessões](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) e [CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

## Decisões de implementação

Continuar na pasta/branch já usada, preservando todo trabalho anterior. Implementar diretamente e revisar ao final; a autorização do usuário cobre a ampliação detalhada proposta. Nenhum push, merge ou deploy é parte desta entrega.
