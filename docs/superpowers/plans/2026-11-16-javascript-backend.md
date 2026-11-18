# JavaScript Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Acrescentar 24 aulas de backend/CRUD/autenticação e um projeto Node/Express/SQLite executável e baixável.

**Architecture:** Aulas no catálogo atual; API do aluno isolada em content/javascript/projetos/api-estudos. Testar o mesmo projeto fornecido no ZIP com HTTP real e SQLite temporário.

**Tech Stack:** Node22.13+, Express5.3.0, node:sqlite, crypto.scrypt, JS/Markdown/JSON, node:test e fflate para ZIP.

**Spec:** `docs/superpowers/specs/2026-11-16-javascript-backend-design.md`

## Global Constraints

- Preservar IDs/conteúdo anterior; totais14módulos/56aulas/210perguntas/140cartas.
- Seis módulos novos: node, banco, api, integracao, autenticacao, backend-projeto.
- API local/mesma origem; nenhuma execução Node no site publicado.
- SQLite no servidor, SQL parametrizado e filtro por proprietário em todo CRUD.
- Login com scrypt, sessão expirada/revogável, cookie e CSRF reais, sem tokens em localStorage.
- Projeto, fontes e ZIP coerentes; sem dados/senhas/ambiente real no pacote.

## Review Focus

- Aluno consegue instalar/rodar o projeto a partir do ZIP e identificar terminal versus console.
- Erros de rede/HTTP/JSON/storage e respostas204/401 não quebram o frontend nem perdem entrada sem aviso.
- IDs alheios, parâmetrosSQL, campos extras e sessões expiradas não permitem acesso indevido.
- Exemplos e comandos copiados são completos ou têm preparação/arquivo indicado claramente.
- ZIP, lockfile, testes e explicações correspondem à implementação efetivamente entregue.

### Task 1: Contratos e testes RED

**Files:** tests/backend-project.test.js; tests/data/content-javascript.test.js; tests/ui/javascript-real.test.js.
**Interfaces:** createApplication({databasePath,origin,secureCookies,clock,authLimit}) → {app,close}; Express app não inicia listener ao importar.

- [x] Escrever teste que exige projeto e API real, cadastro/login/CSRF/CRUD/persistência/isolamento/erros e projetoZIP.
- [x] Observar RED por arquivos ausentes. Atualizar expectativas do conteúdo para nova extensão, preservando32aulas iniciais.

### Task 2: Projeto Node/SQLite e frontend

**Files:** content/javascript/projetos/api-estudos/{package.json,package-lock.json,.env.example,.gitignore,README.md,src/*.mjs,public/*,etapas/*,test/*}; package/lock da central.
**Interfaces:** Task1 factory; servidor injeta configuração e encerra banco/listener em sinais; frontend usa contratoHTTP da spec.

- [x] Instalar devDependencies Express/fflate com versões fixas; implementar banco, validação, segurança, app e servidor.
- [x] Implementar cliente da mesma origem e testes locais do pacote; inicializações HTTP só nos entrypoints diretos.
- [x] Conferir testes da API e cliente até GREEN.

### Task 3: Conteúdo detalhado

**Files:** content/javascript/{09-node,...,14-backend-projeto}, language.json, referencia.md; verify/javascript/backend-*.mjs.
**Interfaces:** APIs e arquivos reais da Task2; manifestos/bancos existentes.

- [x] Redigir24aulas detalhadas e contextualizadas,90perguntas e60cartas com fontes primárias.
- [x] Incluir etapas iniciais executáveis, comandosWindows/Linux e soluções verificadas. Ensinar instalação/versões/avisos/limites.
- [x] Rodar validador, carregamento e renderização de todas as aulas, associação às cartas e prova.

### Task 4: Empacotamento e conclusão

**Files:** tools/package-api-estudos.mjs; content/javascript/projetos/api-estudos.zip; tests/backend-package.test.js; README/roteiro/spec/plano.
**Interfaces:** ZIP deve conter exclusivamente os arquivos-fonte permitidos do projeto e manter os bytes iguais.

- [x] Empacotar com zipSync, conferir com unzipSync e testar o projeto do próprioZIP em diretório temporário.
- [x] Rodar npm test completo e diffcheck; obter revisão independente de conteúdo/segurança/funcionamento e corrigir achados.
- [x] Chrome: navegar módulos/aula/referência mobile; executar cadastro/login e CRUD real, recarga/logout, textoHTMLliteral, teclado.
- [x] Registrar resultados/limites sem publicar serviços ou pedir nova aprovação de processo.


## Resultado verificado — 18/11/2026

Todas as tarefas concluídas. A suíte final passou em 620/620 casos, sem skips; a API passou em 8/8 casos também no Node 26.13.1. O ZIP foi instalado com npm ci e seus oito testes passaram em diretório novo. npm audit informou zero vulnerabilidades. Chrome real verificou a central em 390 px e cadastro/CRUD/recarga/logout, foco e texto HTML literal do projeto. Revisão independente concluída e achados corrigidos com testes RED/GREEN. Registro detalhado em docs/verificacao-manual.md.
