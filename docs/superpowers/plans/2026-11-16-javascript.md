# JavaScript Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Entregar uma trilha JavaScript com 32 aulas, 120 perguntas, 80 cartas e prática no navegador.

**Architecture:** Conteúdo Markdown/JSON no catálogo, sem motor novo. Exemplos de linguagem em módulos Node e exemplos de DOM em HTML, testados com ferramentas já instaladas.

**Tech Stack:** JavaScript ES modules, Markdown, JSON, node:test, jsdom, navegador Chrome.

**Spec:** `docs/superpowers/specs/2026-11-16-javascript-design.md`

## Global Constraints

- Português do Brasil; `javascript`, sem engine; oito módulos, quatro aulas por módulo.
- 15 perguntas e 10 cartas por módulo, cobrindo as quatro aulas e ao menos três tipos.
- Sem novas dependências do site e sem mudança de estado/rotas/plataforma.
- Navegador basta para começar; servidor local documentado para módulos/fetch.
- Exemplos de testes explícitos e isolados, sem rede externa; fontes primárias por aula.
- Preservar alterações da entrega Linux ainda não commitadas.

## Review Focus

- Console repetido não deve falhar por redeclarações; distinguir navegador/Node/terminal.
- HTMLs devem fornecer todos os elementos e arquivos consultados.
- Lacunas devem aceitar tokens equivalentes ensinados e ordens devem ser únicas.
- Rede falha, HTTP 404, JSON inválido e storage inválido/negado devem ter explicação e tratamento.
- Projeto com texto que parece HTML deve exibir texto literal, preservar acesso por teclado e funcionar após recarga.

## Arquivos

- `content/javascript/language.json`, `referencia.md`, oito pastas com aulas e bancos.
- `content/catalog.json`: nova entrada, mantendo as três atuais.
- `tests/data/content-javascript.test.js`, `tests/ui/javascript-real.test.js`: integração real e correção de exemplos de lacunas.
- `verify/javascript/cases.json`, exemplos `.mjs`/`.html` e dependências explícitas; `tests/javascript-snippets.test.js`: execução/DOM e erros previstos.
- README, roteiro e documentação: conteúdo, fontes, verificações.

### Task 1: Contrato e manifesto

**Interfaces:** consumir loadLanguages/loadLesson/loadModuleBank/loadReference/loadChallenges; produzir manifesto com IDs `introducao`, `fundamentos`, `funcoes`, `dados`, `dom`, `assincrono`, `moderno`, `pratica`.

- [x] Escrever testes que encontram a nova trilha no catálogo, carregam todas as aulas/bancos e sorteiam 40 questões sem repetição.
- [x] Executar `node --test tests/data/content-javascript.test.js`; esperar falha de trilha ausente.
- [x] Criar manifesto, registrar catálogo e completar conteúdo nas tarefas seguintes até deixar a integração verde.

### Task 2: Aulas e exemplos executáveis

**Interfaces:** produzir Markdown com fontes e exemplos explicitamente relacionados a cenários por IDs locais do manifesto.

- [x] Criar teste de cenários que exige o manifesto de exemplos e executa cada arquivo com stdout/DOM esperados; observar RED com exemplos ausentes.
- [x] Redigir aulas, preparação de navegador/servidor e referência; salvar exemplos em verify/javascript.
- [x] Implementar execução de `.mjs` em processo isolado e testes DOM com jsdom, sem requests de terceiros. Testar resultados e efeitos/interações do projeto.
- [x] Executar `node --test tests/javascript-snippets.test.js`; esperar todos os exemplos conferidos, com cobertura das 32 aulas.

### Task 3: Bancos e integração de telas

**Interfaces:** bancos questions/cards existentes; telas renderLanguage/renderLesson/renderReference e ações de conclusão.

- [x] Redigir 120 perguntas e 80 cartas; exercitar tokens equivalentes com gradeQuestion sem ignorar caixa globalmente.
- [x] Criar teste real de telas, percorrer aulas e concluir uma para conferir XP/cartas. Conferir HTML e JavaScript copiáveis.
- [x] Rodar validador e testes novos; esperar todos verdes.

### Task 4: Revisão e entrega

**Interfaces:** documentação e evidências finais, sem alteração da plataforma.

- [x] Atualizar README e roteiro manual; conferir fontes atuais relevantes.
- [x] Executar `npm test` e `git diff --check`, incluindo arquivos novos.
- [x] Revisão independente de conteúdo, exemplos e perguntas; reproduzir/corrigir achados relevantes e rodar a suíte após correções.
- [x] Conferir no Chrome a trilha, aula e referência em 1280/390 px, além do projeto final com entrada de texto, persistência e recarga.
- [x] Registrar resultados e concluir sem pedir nova aprovação de processo.
