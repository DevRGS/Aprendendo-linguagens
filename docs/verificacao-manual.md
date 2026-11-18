# Roteiro de verificação manual

Os testes automáticos cobrem as regras, os dados e o comportamento das telas (com o navegador simulado). Este roteiro cobre o que só um navegador de verdade mostra: aparência, celular, impressão, permissões e o backup em arquivo.

Na entrega de Terminal Linux (16/11/2026), foram conferidos no Chrome a trilha em 1280 px, a aula de WSL e a referência em 390 px (sem transbordamento horizontal), além da conclusão de WSL com três cartas e 20 XP. A instalação real do WSL em Windows continua pendente. Os itens abaixo permanecem como roteiro completo para cada nova validação.

Na entrega de JavaScript (16/11/2026), o Chrome confirmou oito módulos em 1280 px, aula/referência/projeto em 390 px, conclusão com duas cartas e 20 XP, importação de módulo local e fluxo do projeto (texto literal, persistência/recarga, remoção, Enter/Space e texto longo sem transbordamento). A instalação de Python em Windows/macOS não foi executada; falhas controladas de HTTP/rede/JSON/storage são cobertas pelos testes.

Use um servidor local (`python -m http.server 8000`) e o Chrome. Marque cada item.

## Primeira visita e navegação
- [ ] Sem dados salvos, aparece a tela de boas-vindas; sem nome, aparece "Digite seu nome."
- [ ] Um nome com HTML, como `<img src=x onerror=alert(1)>`, aparece como texto puro no topo, no perfil e no certificado (nenhum alerta abre).
- [ ] Menu lateral no computador; barra de abas embaixo na largura de celular (DevTools, 390 px), sem rolagem horizontal.
- [ ] Toda a navegação funciona só com o teclado (Tab, Enter, Espaço, setas na ordenação); o foco é sempre visível.
- [ ] `#/qualquer-coisa` mostra "Página não encontrada".

## Aulas, prática, quiz e prova
- [ ] A página de Java lista os 7 módulos, nesta ordem: Introdução, Fundamentos, Orientação a Objetos, Coleções, Exceções, Strings e Entrada, Java Moderno (8 a 21).
- [ ] As aulas dos 7 módulos aparecem com tabelas, código colorido, botão "copiar" e quadros de destaque coloridos (confira pelo menos uma aula de cada módulo).
- [ ] Concluir uma aula dá XP, libera as cartas da aula e atualiza o anel da meta e a sequência.
- [ ] A prática do módulo mostra os 4 tipos de pergunta ao longo de algumas tentativas; sair no meio pede confirmação.
- [ ] Em "Ordenar linhas", arrastar com o mouse funciona no computador.
- [ ] O quiz personalizado respeita escopo, dificuldade, tipo e quantidade; "0 perguntas" desativa o botão.
- [ ] A prova roda em modo simulado com cronômetro; 70% ou mais mostra "Você passou na prova!".
- [ ] Com o sistema configurado para reduzir movimento, a carta vira sem animação.

## SQL
- [ ] A página de SQL lista os módulos Introdução e Consultas básicas, e toda aula termina com o bloco "Experimente".
- [ ] Num desafio: "Tabelas deste exercício" abre e mostra a tabela inteira; Executar (e Ctrl+Enter) mostra o resultado, o veredito e o resultado esperado; "Ver uma resposta" aparece depois da primeira execução.
- [ ] `SELECT nme FROM alunos` mostra a mensagem do SQLite e a dica em português.
- [ ] Na caixa de texto, Tab insere dois espaços; Esc e depois Tab saem da caixa.
- [ ] A prática de um módulo de SQL mistura "Escreva a consulta" com os outros tipos; no modo estudo, depois de responder, aparecem o resultado esperado e uma resposta certa.
- [ ] Banco de dados fora do ar: no DevTools, bloqueie `*sql-wasm*` (Network → botão direito numa requisição → Block request URL, ou a aba Network request blocking) e recarregue. A aula avisa que o banco de dados não carregou, e a prática começa sem as perguntas de escrever SQL, com um aviso. (O modo Offline do DevTools não serve: sem rede, nem o conteúdo do site carrega.)
- [ ] Ainda na mesma página, desbloqueie `*sql-wasm*` e abra outra aula de SQL: o desafio volta a funcionar, sem recarregar.
- [ ] Com `*sql-wasm*` bloqueado, a prova de SQL continua com 40 perguntas (só de outros tipos), e "Começar a prova" mostra "Preparando o banco de dados…" enquanto tenta carregar.
- [ ] No celular (390 px), a caixa de texto cabe na tela e as tabelas rolam para o lado, sem rolar a página inteira.

## Terminal Linux
- [ ] O cartão Terminal Linux aparece no início e abre os seis módulos, com 24 aulas, prática, referência, prova e certificado.
- [ ] A aula de instalação diferencia PowerShell/administrador de Ubuntu/Bash, inclui requisitos, download, reinício, conta Linux, senha invisível e conferência; os links Microsoft abrem as fontes corretas.
- [ ] Em Windows compatível, conferir manualmente o fluxo de WSL/Ubuntu em uma máquina de teste. Os testes do projeto não instalam nem reinicializam Windows.
- [ ] Quem já tem Ubuntu/WSL ou Linux nativo encontra orientação para seguir sem reinstalação.
- [ ] Blocos Bash e PowerShell têm destaque e botão copiar; a cópia não inclui prompt. Soluções recolhíveis abrem pelo teclado.
- [ ] Executar uma prática diretamente pela URL: a preparação cria todos os arquivos necessários sem depender de aula anterior.
- [ ] Concluir uma aula atualiza progresso/XP e libera suas cartas; a prova tem 40 perguntas e o quiz permite filtrar Linux.
- [ ] No celular (390 px), tabelas e blocos de código cabem/rolam sem alargar a página; a referência e os links internos abrem.

## JavaScript
- [ ] O cartão JavaScript abre 14 módulos e 56 aulas (oito módulos iniciais e seis de backend), com referência, prática, prova e certificado.
- [ ] A introdução explica console/editor, arquivos reais e servidor HTTP para módulos/fetch, sem exigir Node ou WSL.
- [ ] Código HTML aparece como texto copiável, inclusive nos flashcards que ensinam script type="module"; as tags não são inseridas como elementos da interface.
- [ ] Concluir uma aula libera suas cartas/XP e o quiz permite escolher somente JavaScript; a prova tem 40 perguntas.
- [ ] Abrir exemplos HTML em pasta própria e conferir botões/formulários no navegador, com teclado e Enter.
- [ ] Abrir o exemplo de módulos por HTTP e conferir import/export e saída do console.
- [ ] No projeto final: adicionar, marcar, remover e recarregar; texto com tags aparece literalmente e espaços vazios não viram tarefas.
- [ ] Conferir o aviso do projeto quando há JSON/formato inválido ou armazenamento bloqueado; a lista deve continuar utilizável em memória.
- [ ] Na largura de celular (390 px), aula, tabelas, referência e projeto não causam transbordamento horizontal da página.

## JavaScript backend
- [ ] O ZIP abre e contém fontes/README/lockfile/testes; não contém node_modules, .env real nem banco de dados.
- [ ] Em pasta nova: npm ci, npm test e npm start; abrir a origem do Node, não o servidor Python anterior.
- [ ] Cadastro/login: criar conta de estudo, observar cookie HttpOnly e usar a interface sem ler o token em JavaScript.
- [ ] Adicionar título com HTML literal, editar, marcar/desmarcar, paginar e excluir; respostas e estados aparecem corretamente.
- [ ] Recarregar a página e reiniciar o Node mantêm os dados do arquivo e respeitam a validade da sessão.
- [ ] Logout revoga acesso; sessão expirada pede novo login. Conta diferente não lê/edita/exclui tarefa alheia.
- [ ] Confirmar ausência de transbordamento em 390 px, envio pelo teclado e foco após ações.
- [ ] Conferir falha de rede com servidor parado, entradas inválidas e resposta204 semJSON; não deve haver reenvio automático dePOST.
- [ ] Instruções de instalação em Windows/macOS e cenários de HTTPS/proxy devem ser validados nesses ambientes; testes locais não os simulam integralmente.

## Flashcards
- [ ] A carta vira com animação 3D; Revisão do dia, estudo livre e "Meus erros" funcionam; atalhos 1/2/3 e Espaço.
- [ ] O número de pendentes no menu bate com o da tela de flashcards.

## Perfil e certificado
- [ ] Calendário de atividade, conquistas, histórico e "Refazer erradas" aparecem bem no computador e no celular.
- [ ] O certificado só aparece com tudo concluído; "Imprimir ou salvar PDF" mostra só o certificado, em paisagem.

## Dados e backup
- [ ] Recarregar a página mantém todo o progresso.
- [ ] Duas abas: concluir uma aula numa aba e voltar à outra mostra o progresso atualizado.
- [ ] DevTools → Application → Local Storage: trocar o valor de `central-linguagens:state` por `{quebrado` e recarregar mostra o aviso de dados danificados, cria a chave `central-linguagens:corrupt:...` e começa do zero.
- [ ] Trocar o `schema` salvo para `99` e recarregar mostra o aviso de versão mais nova, e nada é sobrescrito.
- [ ] Com o backup automático ativo, corromper o Local Storage e recarregar **não** regrava o arquivo de backup (a data de modificação do arquivo não muda, mesmo depois de concluir uma aula). Zerar o progresso também não grava um estado vazio no arquivo.
- [ ] Exportar baixa o arquivo `progresso-<nome>-<data>.json`; importar mostra o resumo e "Desfazer importação" restaura o anterior.
- [ ] Backup automático: ativar escolhe o arquivo, ele é regravado uns 5 s depois de cada mudança, "Reconectar" funciona depois de recarregar e "Desativar" para de gravar.
- [ ] No celular (ou com toque emulado), "Exportar" abre o menu de compartilhamento.
- [ ] Numa janela anônima do Firefox, o site funciona; se o armazenamento falhar, aparece a faixa "Seu progresso não está sendo salvo".
- [ ] Lembrete: com progresso e sem backup há 7 dias (simule mudando `lastExportAt` e `createdAt` no Local Storage), a faixa aparece; "Depois" some por 3 dias.

## Conteúdo
- [ ] `node tools/verify-java.mjs` com o JDK 21: 234/234.


## Execução da extensão de backend — 18/11/2026

Conferido no GNU/Linux com Node 22.23.4 e Chrome headless real por CDP:

- `npm test`: 620 testes aprovados, nenhuma falha ou teste pulado. Inclui renderização das 56 aulas, conteúdo, cliente, HTTP real, SQLite, migração de esquema 1 para 2 e conferência do ZIP contra os fontes.
- ZIP extraído em diretório novo: `npm ci` e `npm test` concluídos; os oito testes do pacote passaram sem depender do node_modules da central.
- Node 26.13.1: oito testes da API aprovados. `npm audit`: zero vulnerabilidades informadas.
- Chrome: os 14 módulos abrem; aula de sessão e referência sem transbordamento em 390 px. Projeto local: cadastro, criação por Enter, título HTML literal, marcação por Espaço, edição com 120 caracteres, recarga com sessão/tarefa persistidas, exclusão, logout com resposta 401 na rota protegida e limpeza do rascunho.
- Foco conferido após login, criação, marcação, exclusão e logout. Imagens da conferência em `/tmp/javascript-backend-aula-desktop.png`, `/tmp/javascript-backend-aula-mobile.png` e `/tmp/javascript-backend-crud-mobile.png` (arquivos temporários da sessão).

A revisão independente foi concluída e seus achados corrigidos com regressões: ids reutilizados, rascunho entre contas, validação nativa/foco, padrão HTML, NUL em títulos e grafias equivalentes das lacunas.

Instaladores Windows/macOS, reinicialização/instalação de WSL, tecnologias assistivas e implantação HTTPS/proxy não foram executados nessa conferência. Os itens acima registram somente os fluxos realmente verificados; a lista geral permanece como roteiro para outros ambientes.
