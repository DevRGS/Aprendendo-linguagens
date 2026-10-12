# Roteiro de verificação manual

Os testes automáticos cobrem as regras, os dados e o comportamento das telas (com o navegador simulado). Este roteiro cobre o que só um navegador de verdade mostra: aparência, celular, impressão, permissões e o backup em arquivo.

Use um servidor local (`python -m http.server 8000`) e o Chrome. Marque cada item.

## Primeira visita e navegação
- [ ] Sem dados salvos, aparece a tela de boas-vindas; sem nome, aparece "Digite seu nome."
- [ ] Um nome com HTML, como `<img src=x onerror=alert(1)>`, aparece como texto puro no topo, no perfil e no certificado (nenhum alerta abre).
- [ ] Menu lateral no computador; barra de abas embaixo na largura de celular (DevTools, 390 px), sem rolagem horizontal.
- [ ] Toda a navegação funciona só com o teclado (Tab, Enter, Espaço, setas na ordenação); o foco é sempre visível.
- [ ] `#/qualquer-coisa` mostra "Página não encontrada".

## Aulas, prática, quiz e prova
- [ ] As 6 aulas de Fundamentos aparecem com tabelas, código colorido, botão "copiar" e quadros de destaque coloridos.
- [ ] Concluir uma aula dá XP, libera as cartas da aula e atualiza o anel da meta e a sequência.
- [ ] A prática do módulo mostra os 4 tipos de pergunta ao longo de algumas tentativas; sair no meio pede confirmação.
- [ ] Em "Ordenar linhas", arrastar com o mouse funciona no computador.
- [ ] O quiz personalizado respeita escopo, dificuldade, tipo e quantidade; "0 perguntas" desativa o botão.
- [ ] A prova roda em modo simulado com cronômetro; 70% ou mais mostra "Você passou na prova!".
- [ ] Com o sistema configurado para reduzir movimento, a carta vira sem animação.

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
- [ ] `node tools/verify-java.mjs` com o JDK 21: 32/32.
