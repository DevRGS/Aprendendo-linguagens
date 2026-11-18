# Terminal Linux — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Entregar uma trilha de comandos Linux com preparação WSL/Ubuntu, aulas, perguntas, flashcards e exemplos conferidos.

**Architecture:** Acrescentar conteúdo ao catálogo existente, sem motor de execução nem alterações de estado. As práticas são locais e os cenários de conferência rodam apenas nos testes em Bash/Linux.

**Tech Stack:** Markdown, JSON, JavaScript ES modules, node:test, Bash e ferramentas GNU.

**Spec:** `docs/superpowers/specs/2026-11-16-terminal-linux-design.md`

## Global Constraints

- Português do Brasil; GNU/Linux com Bash como ambiente de referência.
- Identificador `linux`, nome `Terminal Linux`, highlight `bash`, sem engine.
- Seis módulos, 24 aulas, 15 perguntas e 10 cartas por módulo.
- Pelo menos três tipos por módulo; toda aula coberta por pergunta e carta.
- WSL: fonte Microsoft, PowerShell separado de Bash, reinício, usuário/senha e confirmação.
- Sem novas dependências do site, mudanças do estado ou execução automática de Markdown.
- Exemplos automáticos explícitos, sem rede, privilégios ou arquivos externos ao laboratório temporário.

## Review Focus

- Aluno no PowerShell deve saber quando mudar para Ubuntu; WSL existente não exige reinstalação.
- Aulas acessadas diretamente precisam da própria preparação dos arquivos.
- Lacunas/ordenações devem admitir respostas equivalentes ou uma única ordem defensável.
- Locale, caminhos, PID, memória e mensagens de erro não podem produzir falsos resultados.
- Conteúdo real deve funcionar com a renderização e o progresso existentes, não só com fixtures.

## Arquivos

- `content/catalog.json`: registrar Linux.
- `content/linux/language.json`, `referencia.md` e seis diretórios de módulos: material da trilha.
- `tests/data/content-linux.test.js`: integração com carregador/correção/sorteio reais.
- `tests/ui/linux-real.test.js`: renderização real, instalação, conclusão/liberação de cartas e referência.
- `verify/linux/*.sh` e `tests/linux-snippets.test.js`: cenários com resultado esperado explícito.
- README, roteiro manual e esta documentação: uso, fontes e evidências.

### Task 1: Contrato de conteúdo e cadastro

**Files:** Create `tests/data/content-linux.test.js`; Create `content/linux/language.json`; Modify `content/catalog.json`.

**Interfaces:** Consumes `loadLanguages()`, `loadLesson(language,module,lesson)`, `loadModuleBank(language,module)`, `loadReference(language)`; Produces manifesto Linux com módulos `primeiros-passos`, `arquivos`, `texto`, `shell`, `sistema`, `rotinas`.

- [x] Escrever integração que encontra Linux no catálogo e carrega 24 aulas, 90 perguntas e 60 cartas; cada aula tem título, pergunta e carta; prova sorteia 40 itens sem repetição e usa os quatro tipos aceitos.
- [x] Rodar `node --test tests/data/content-linux.test.js`; esperar falha por trilha ausente.
- [x] Registrar manifesto e catálogo; preencher os artefatos nas tarefas 2 e 3 antes de declarar esta tarefa concluída.

### Task 2: Aulas e referência

**Files:** Create `content/linux/*/*.md`, `content/linux/referencia.md`.

**Interfaces:** Consumes manifesto da tarefa 1; Produces textos Markdown, links internos por hash, exemplos locais reproduzíveis e fontes por aula.

- [x] Redigir quatro aulas de cada módulo; na introdução incluir WSL como segunda aula e reunir anatomia de comando e ajuda na terceira.
- [x] Redigir referência rápida com opções, limites, práticas e fontes.
- [x] Conferir a instalação com Microsoft Learn e os comandos com manuais primários.

### Task 3: Perguntas, cartas e integração visual

**Files:** Create `content/linux/*/questions.json`, `content/linux/*/flashcards.json`, `tests/ui/linux-real.test.js`.

**Interfaces:** Consumes aulas; Produces bancos no formato existente e provas das telas com conteúdo real.

- [x] Redigir 15 perguntas e 10 cartas por módulo, com alternativas defensáveis e dependências reais nas ordenações.
- [x] Escrever teste que renderiza a trilha real, a aula WSL e uma aula Bash, conclui WSL e confere cartas/XP; esperar falha enquanto faltar conteúdo.
- [x] Completar bancos e conferir `node --test tests/content.test.js tests/data/content-linux.test.js tests/ui/linux-real.test.js`.
- [x] Conferir respostas de referência com `gradeQuestion()` e a prova com `selectQuestions()` no teste de integração.

### Task 4: Conferência executável e entrega

**Files:** Create `verify/linux/*.sh`, `tests/linux-snippets.test.js`; Modify `README.md`, `docs/verificacao-manual.md`.

**Interfaces:** Consumes exemplos das aulas/perguntas; Produces cenários explícitos com cabeçalho de identificação e saída esperada, executados por `spawnSync` com timeout/cwd temporário/env controlado.

- [x] Criar teste que exige cenários vinculados às aulas práticas, executa cada script e compara stdout/status aos valores de cabeçalho. Rodar e observar falha com diretório de cenários ausente.
- [x] Criar cenários de navegação, nomes com espaços/curingas, leitura/busca, redirecionamentos/erros/pipelines, aspas/status, permissões/processos próprios e scripts/tar. Usar somente arquivos temporários e comparar dados estáveis.
- [x] Registrar evidências e limites; atualizar README e roteiro manual sem marcar verificações visuais não executadas.
- [x] Rodar `npm test` e `git diff --check`; obter revisão independente do conteúdo/integração e corrigir problemas relevantes.

## Execução

Executar nesta sessão em sequência. A autorização do usuário para a primeira abordagem e a inclusão do WSL já cobre a implementação; não solicitar outra aprovação de processo. Manter alterações visíveis no diretório compartilhado, em branch própria; sem publicação ou push.
