# Terminal Linux — proposta de trilha

- Data: 2026-11-16.
- Estado: implementado e verificado, incluindo instalação do WSL para usuários de Windows.
- Base: leitura do README, especificações da plataforma e de SQL, catálogo, manifestos, carregador de conteúdo, rotas, telas de aula/trilha/certificado, regras de progresso/correção e testes de conteúdo.

## Objetivo

Adicionar uma trilha em português do Brasil para aprender os comandos do terminal Linux desde o começo. A pessoa deve entender o que cada comando faz, interpretar resultados, consultar a documentação e combinar ferramentas para tarefas comuns.

O pedido é acrescentar outro caminho de aprendizagem ao projeto existente e pesquisar fontes reais. O usuário escolheu praticar no próprio terminal e pediu instruções para baixar e instalar o WSL quando necessário. A organização curricular abaixo é a proposta apresentada e aceita junto dessa escolha.

## Como o projeto funciona hoje

- Site estático em JavaScript com módulos ES, sem framework nem build, publicado pelo GitHub Pages.
- `content/catalog.json` registra as trilhas; cada `language.json` define apresentação, módulos, aulas e referência rápida.
- Aulas em Markdown; perguntas e flashcards em JSON carregados por `js/data/content.js`.
- As telas e regras usam os identificadores das trilhas, de modo que progresso, XP, repetição espaçada, quiz, prova e certificado podem atender ao Linux pelo mesmo formato.
- Apenas SQL tem motor de execução (`engine: sqlite`). O validador não aceita um motor de shell ou um tipo de pergunta de execução de comandos.
- Cada módulo exige ao menos 12 perguntas, três tipos e oito cartas; toda aula precisa aparecer em uma pergunta. A prova usa até 40 perguntas.
- Os testes de interface usam fixtures; o validador percorre o catálogo real. O teste de carregamento de conteúdo real atual tem cenários específicos de Java e SQL.

## Abordagens consideradas

1. **Conteúdo no formato existente e prática no terminal Linux da pessoa — recomendada.** Reaproveita a plataforma, ensina comandos reais e mantém o site estático. Exercícios locais têm instruções e uma solução comentada, com conferência pelo aluno; não recebem correção automática nem XP por execução.
2. **Simulador no navegador.** Permitiria praticar na própria página, inclusive no celular, mas exigiria definir comandos suportados, sistema de arquivos fictício, avaliação e persistência. Um simulador não reproduz integralmente Bash/Linux e precisa identificar seus limites.

Esta especificação detalha a primeira abordagem, escolhida pelo usuário.

## Escopo proposto

Nome de exibição: **Terminal Linux**. Identificador e diretório: `linux`. Destaque de sintaxe: `bash`. Sem campo `engine`.

O ambiente de referência é **GNU/Linux com Bash**. Explicar logo na primeira aula que terminal, shell e sistema operacional têm papéis diferentes. Os exemplos não devem prometer comportamento idêntico no PowerShell, em outros shells ou nas ferramentas BSD do macOS. Não é necessário reinstalar o sistema para acompanhar quem já tem Linux.

São seis módulos com quatro aulas cada: **24 aulas**, **90 perguntas** (15 por módulo) e **60 flashcards** (10 por módulo). A duração de cada aula será estimada durante a redação, conforme o conteúdo real.

| Módulo / id | Quatro aulas propostas | Fontes principais |
|---|---|---|
| Primeiros passos / `primeiros-passos` | Terminal, Bash e prompt; instalar e abrir Ubuntu pelo WSL no Windows; comando, opções, argumentos e ajuda; atalhos, histórico e primeira prática | Microsoft Learn; Ubuntu; Bash |
| Navegação e arquivos / `arquivos` | `pwd`, `ls`, `cd` e caminhos; criar e copiar com `mkdir`, `touch`, `cp`; mover e remover com `mv`, `rm`, `rmdir`; espaços, aspas, arquivos ocultos e curingas | Ubuntu; Coreutils; Bash |
| Leitura e busca / `texto` | `cat`, `less`, `head`, `tail`; busca textual com `grep`; localização com `find`; tratamento com `wc`, `sort`, `uniq`, `cut` | Coreutils; Grep; Findutils; manuais Debian |
| Combinando comandos / `shell` | Entrada, saída, erros e redirecionamento; pipelines e `tee`; variáveis, `printf` e aspas; status de saída, `&&` e `\|\|` | Bash; Coreutils |
| Permissões e processos / `sistema` | `whoami`, `id`, `ls -l` e permissões; `chmod` e privilégios com `sudo`; `ps`, `top`, `jobs`, `fg`, `bg`, interrupção e `kill`; espaço e memória com `df`, `du`, `free` | Coreutils; Bash; Ubuntu; manuais Debian |
| Rotinas com Bash / `rotinas` | Criar, listar e extrair arquivos com `tar`; primeiro script e shebang; argumentos, `read` e condições simples; repetição com `for` e um exercício final com arquivos de estudo | Bash; GNU tar |

Não entram nesta entrega instalação de Linux nativo/dual boot, administração de servidores, serviços/systemd, configuração de rede, gerenciadores de pacotes, SSH ou scripts avançados. A instalação de WSL/Ubuntu no Windows está incluída. O uso de `sudo` é explicado com contexto, sem depender de alterações administrativas para completar as práticas de Linux.

### Preparação no Windows com WSL

A segunda aula ensina: requisitos do comando moderno (Windows 11 ou Windows 10 versão 2004/build 19041 ou posterior), conferir versão com `winver`, abrir PowerShell como administrador, baixar/instalar WSL e Ubuntu com `wsl --install -d Ubuntu`, reiniciar, abrir Ubuntu, criar usuário e senha Linux (a senha não aparece enquanto se digita) e confirmar a instalação no PowerShell com `wsl --list --verbose`. Mostrar como reabrir com `wsl -d Ubuntu`, executar `pwd` no Ubuntu e voltar ao Windows com `exit`.

Distinguir visualmente blocos `powershell` dos blocos `bash`; explicar que comandos de gerenciamento do WSL nesta aula rodam no Windows. Para WSL já instalado sem Ubuntu, o comando com `-d Ubuntu` instala a distribuição. Para instalação parada em 0,0%, apresentar a alternativa oficial `--web-download`. Para falha de virtualização, orientar a consulta ao guia da Microsoft e instruções do fabricante, sem inventar passos de firmware universais. Quem já tem Linux ou Ubuntu no WSL pode pular a instalação e fazer a conferência. Esta aula tem perguntas e cartas próprias.

## Estrutura e experiência

```text
Início → Terminal Linux → módulo → aula → prática do módulo
                        → referência rápida
                        → prova → certificado

content/linux/
  language.json
  referencia.md
  01-primeiros-passos/ ... 06-rotinas/
    01-....md ... 04-....md
    questions.json
    flashcards.json
```

- Registrar `linux` no catálogo mantendo os identificadores de Java e SQL.
- Usar o layout atual e as rotas genéricas, por exemplo `#/linux` e `#/linux/arquivos/pratica`.
- Cada aula apresenta objetivo, explicação, exemplos comentados, resultado esperado ou como interpretá-lo, erro comum, prática local e fontes.
- Os blocos copiáveis contêm comandos sem o prompt `$` e separam as saídas dos comandos.
- Cada prática declara a pasta e os arquivos iniciais de que depende. Quando depender de uma prática anterior, inclui preparação alternativa para quem chegou diretamente à aula.
- A pasta de laboratório deve ser nova, criada com `mktemp -d` dentro da pasta pessoal. A aula explica como reconhecer seu caminho. Nomes e operações ficam restritos aos arquivos criados pelo laboratório.
- Explicar sobrescrita (`>`), remoção sem lixeira (`rm`), aspas e permissões antes das práticas que dependem desses conceitos. Usar alvos explícitos nos exemplos de remoção.
- Explicar que `touch` também atualiza datas, `uniq` agrupa repetições adjacentes e a permissão `x` tem significado diferente em diretórios. Não confundir `cd` interno do shell com programa externo.
- Resultados dependentes da máquina (usuário, caminho, PID, memória, disco, horários e mensagens de erro) serão identificados como variáveis. Não exigir correspondência literal com um exemplo.
- Fontes ficam no fim das aulas e reunidas na referência rápida; README recebe apresentação da trilha e créditos.
- Sem novos componentes visuais, migração do estado salvo ou mudanças das regras de certificação.

## Perguntas e revisão

- Usar os quatro tipos existentes: múltipla escolha, verdadeiro/falso, lacuna e ordenação.
- Cada módulo terá 15 perguntas, cobrirá ao menos três tipos e terá uma pergunta por aula, no mínimo.
- Os 10 flashcards de cada módulo devem cobrir as quatro aulas e revisar conceitos, opções e consequências, não apenas decorar nomes.
- Identificadores estáveis: `linux.<modulo>.qNN` e `linux.<modulo>.fNN`.
- Múltipla escolha tem uma única resposta defensável. Lacunas devem delimitar a resposta solicitada e aceitar variações equivalentes relevantes. Não ativar `caseInsensitive` globalmente: comandos e opções podem distinguir maiúsculas.
- Ordenações devem ter dependências reais e uma única sequência válida; comandos independentes não servem para esse tipo.
- Prática, prova, pontos fracos e flashcards usam as regras atuais. Exercícios locais no texto não são tratados como código avaliado pelo site.

## Pesquisa e fontes primárias

Fontes pesquisadas em 16/11/2026. Os textos serão originais, em português, apoiados nos manuais; não será feita cópia ou tradução integral das páginas.

| Fonte | Uso |
|---|---|
| [Microsoft Learn — Instalar o WSL](https://learn.microsoft.com/pt-br/windows/wsl/install) | Requisitos, download, instalação, reinício e alternativa `--web-download` |
| [Microsoft Learn — Configurar ambiente WSL](https://learn.microsoft.com/pt-br/windows/wsl/setup/environment) | Primeiro acesso, conta Linux, senha sem eco e arquivos na pasta pessoal |
| [Microsoft Learn — Comandos WSL](https://learn.microsoft.com/pt-br/windows/wsl/basic-commands) | Listar distribuições e abrir Ubuntu a partir do Windows |
| [Microsoft Learn — Solução de problemas WSL](https://learn.microsoft.com/pt-br/windows/wsl/troubleshooting) | Falhas de instalação e virtualização |
| [Canonical — The Linux command line for beginners](https://ubuntu.com/desktop/docs/en/26.04/tutorial/the-linux-command-line-for-beginners/) | Sequência introdutória, terminal, navegação, arquivos e privilégios |
| [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html) | Sintaxe do shell, comandos internos, aspas, expansões, variáveis, redirecionamento, pipelines, status, processos e scripts |
| [GNU Coreutils](https://www.gnu.org/software/coreutils/manual/html_node/index.html) | Semântica e opções das ferramentas de arquivos, texto, identidade, permissões e disco |
| [GNU Grep](https://www.gnu.org/software/grep/manual/grep.html) | Busca textual, busca literal, opções e interpretação dos resultados |
| [GNU Findutils](https://www.gnu.org/software/findutils/manual/html_mono/find.html) | Busca de arquivos, `-type`, `-name` e padrões entre aspas |
| [GNU tar](https://www.gnu.org/software/tar/manual/tar.html) | Criação, listagem, extração e compressão de arquivos |
| [Debian Manpages — procps](https://manpages.debian.org/trixie/procps/index.html) | `ps`, `top` e `free`; consultar o manual de cada comando ao redigir |
| [Debian Manpages — less](https://manpages.debian.org/trixie/less/less.1.en.html) | Paginação e comandos de navegação; conferir na redação |

Parte das páginas GNU falhou ao abrir diretamente na ferramenta de pesquisa; os documentos e seções foram encontrados na busca. Na redação, conferir as seções efetivamente utilizadas e os exemplos executáveis. Não tratar uma falha de consulta como conteúdo verificado.

## Verificação da entrega

1. Executar os testes existentes com `npm ci` e `npm test`, incluindo o validador do catálogo real.
2. Acrescentar teste de integração da trilha real: carregar manifesto, aulas, referência e bancos; conferir associação às aulas, ausência de motor e banco suficiente para prova de 40 questões com sorteio.
3. Acrescentar cenários de verificação de comandos em `verify/linux/` e teste próprio que os execute em Bash sem arquivos de inicialização, usando diretórios temporários e ambiente controlado. Conferir saídas e efeitos nos arquivos; não comparar PIDs ou informações dinâmicas literalmente.
4. Os cenários executados automaticamente serão escritos e selecionados explicitamente pelo projeto. Não extrair e executar indiscriminadamente blocos Markdown. Nenhum teste usa privilégios, rede ou diretórios reais do aluno. A execução se limita ao Linux; em outro sistema o teste informa a condição não atendida, e o CI Ubuntu deve executá-lo.
5. Cada exemplo com saída determinística, cada erro afirmado e cada resposta prática relevante precisa corresponder a um cenário conferido; os cabeçalhos dos cenários identificam as aulas/perguntas correspondentes.
6. Atualizar o roteiro manual para verificar cartão no início, navegação, Markdown/bash, cópia, conclusão, flashcards, quiz, prova, certificado e apresentação no celular. Registrar o que foi realmente executado.

## Decisões deixadas à implementação

Escolher cor/ícone coerentes com o tema atual, nomes finais dos arquivos, duração das aulas e detalhes internos dos testes. Não adicionar dependências do site nem alterar a plataforma para representar Linux como uma linguagem de programação: a trilha pode usar a infraestrutura atual com seu nome próprio.

## Evidências de implementação

- Seis módulos, 24 aulas, 90 perguntas e 60 flashcards no catálogo real; a referência reúne comandos e fontes.
- `npm test`: 591 testes passaram, sem falhas ou testes pulados, incluindo os 23 cenários Bash e a integração de telas/conteúdo reais.
- Os cenários usam `verify/linux/cases.json` para relacionar scripts às aulas, saídas e, quando relevante, conteúdo dos arquivos, ausências e permissões. Soluções de cópia recursiva, aspas, acréscimo e permissões também são executadas.
- Revisão independente leu aulas e bancos; as variantes equivalentes de lacunas identificadas foram aceitas e verificadas com a correção real.
- Chrome: trilha em 1280 px; instalação WSL e referência em 390 px, sem transbordamento horizontal da página. Concluir WSL liberou três cartas e 20 XP.
- `git diff --check` e conferência de whitespace dos arquivos novos sem problemas.
- A instalação efetiva do WSL e a reinicialização não foram executadas: o ambiente desta implementação é Linux. As instruções foram conferidas contra Microsoft Learn; o roteiro conserva a validação de instalação em Windows como pendente.
- Duas esperas fixas dos testes existentes (inicialização e ativação de cartas) foram substituídas por espera da condição real após falharem sob concorrência. O JavaScript da plataforma permanece sem alterações.
