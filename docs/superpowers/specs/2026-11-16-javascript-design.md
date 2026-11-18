# JavaScript — trilha de aprendizagem

- Data: 2026-11-16.
- Estado: implementado e verificado.
- Pedido: após aprovar a entrega de Linux, o usuário pediu fazer agora a trilha JavaScript.
- Continuidade: mesmo formato já escolhido (aulas, perguntas, flashcards e prática no ambiente do aluno). A seleção curricular abaixo é decisão de implementação.

## Objetivo e abordagem

Ensinar JavaScript desde o início, em português, para criar pequenas páginas interativas com o navegador. Reaproveitar catálogo, progresso, práticas, quiz, prova, flashcards e certificado. A prática acontece no console e em arquivos locais do aluno; não acrescentar editor/motor de execução ao site.

Abordagens consideradas: conteúdo integrado à plataforma existente (escolhida pela continuidade da solicitação) ou editor de código no site (exigiria outro motor, isolamento e correção). Não criar framework, dependências do site, contas ou alteração do estado salvo.

## Entrega

Identificador `javascript`, diretório `content/javascript`, nome `JavaScript`, destaque `javascript`, cor amarela e ícone coerente com a identidade atual. Sem `engine`. Oito módulos com quatro aulas, 15 perguntas e 10 cartas cada: **32 aulas, 120 perguntas, 80 cartas**.

| Módulo / id | Aulas |
|---|---|
| Primeiros passos / `introducao` | JavaScript e Web; console e editor; primeira página; servidor local para arquivos e módulos |
| Fundamentos / `fundamentos` | Variáveis e tipos; números/textos/conversão; operadores/comparações; condicionais |
| Funções e repetição / `funcoes` | Laços; parâmetros/retorno; callbacks/arrow; escopo/closures |
| Arrays e objetos / `dados` | Arrays; map/filter/reduce e ordenação; objetos/referências; JSON |
| DOM e eventos / `dom` | Selecionar/alterar; criar elementos; eventos; formulários |
| Programação assíncrona / `assincrono` | Temporizadores/event loop; promises; async/await e falhas; fetch |
| JavaScript moderno / `moderno` | Desestruturação/spread; opcionais/nullish/erros; classes/this; módulos |
| Prática e projeto / `pratica` | localStorage; funções testáveis; depuração; projeto final |

## Conteúdo

- Textos e exemplos originais, apoiados em MDN e ECMAScript 2026, sem depender de propostas experimentais.
- Cada aula tem objetivo/contexto, exemplo completo ou preparação explícita, explicação de resultado, prática/solução e fontes.
- Distinguir recursos da linguagem (ECMAScript) de APIs do navegador (DOM/fetch/storage) e Node. Node não é pré-requisito do aluno.
- Ensinar abertura do console no Chrome/Firefox, editor de texto simples, salvar UTF-8 e extensões reais. Avisar sobre redeclaração no console; blocos de exemplos isolam declarações quando útil. Não instruir desativar proteções do DevTools.
- Primeiros HTMLs podem abrir como arquivo quando usam scripts clássicos; módulos e requisições locais usam HTTP. Servidor: Python 3, com orientação oficial para instalação quando ausente, verificação do comando, `py -m http.server 8000 --bind 127.0.0.1` no Windows ou `python3 -m http.server 8000 --bind 127.0.0.1` no Linux/macOS, URL localhost e parada com Ctrl+C. WSL é opcional para esta trilha.
- APIs de terceiros não são necessárias: fetch usa dados controlados ou arquivo JSON do próprio laboratório. Explicar `response.ok`, status HTTP, rejeição de rede, CORS e tratamento de JSON inválido. Não sugerir `no-cors` como solução para ler respostas bloqueadas.
- DOM usa textContent para entrada do aluno, botões com type explícito, campos com label e feedback textual. Projeto final não usa innerHTML para renderizar dados digitados.
- Explicar const versus mutação, igualdade estrita/coerção, NaN, typeof null, retorno ausente, cópia rasa, sort numérico, callbacks de eventos, promises que não bloqueiam a thread, classes/protótipos e limites de localStorage.
- Práticas independentes: preparação e todos os arquivos de que a aula depende aparecem nela ou em material indicado explicitamente. Projeto final oferece um HTML completo e funcional, com armazenamento validado e falhas tratadas.
- Aulas/classes/storage são introdutórias. Frameworks, TypeScript, backend Node, ferramentas de build e automação de pacotes ficam fora desta entrega.

## Perguntas e cartas

Usar os quatro tipos atuais. Toda aula tem pergunta e carta; ao menos três tipos por módulo. Múltipla escolha tem uma só alternativa defensável; lacunas solicitam tokens delimitados e aceitam equivalências ensinadas; ordenação exige dependência real e sequência única. Identificadores `javascript.<modulo>.qNN` e `.fNN`, sem migração dos IDs existentes.

## Verificação

- Integração com catálogo real, todos os bancos/aulas/referência, prova de 40 perguntas e conclusão/liberação de cartas.
- Exemplos explícitos em `verify/javascript/`, associados às aulas por `cases.json`. Rodar arquivos `.mjs` isolados em Node para semântica e assíncrono controlado; HTML/DOM com jsdom e interações reais. Expected independente e explícito (saída e efeitos DOM). Não executar Markdown indiscriminadamente nem usar rede externa nos testes.
- Conferir lacunas relevantes com gradeQuestion. O projeto final deve ser exercitado com entrada vazia, texto com HTML, alternância/remoção, recarga, dados salvos inválidos e armazenamento indisponível.
- Executar `npm test`; preservar testes e alterações da trilha Linux. Conferir navegação/renderização no Chrome em computador e celular e exemplos DOM/projeto em navegador real.
- Atualizar README e roteiro manual com evidências reais, sem marcar instalações ou fluxos não executados.

## Fontes

- [MDN — Guia JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide).
- [ECMAScript 2026](https://tc39.es/ecma262/2026/).
- [MDN — DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction), [eventos](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener), [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [módulos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
- [MDN — servidor local](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server) e [Python — downloads](https://www.python.org/downloads/).

## Processo

Implementação em sequência nesta sessão, preservando todas as mudanças existentes e o diretório compartilhado. Revisão independente da especificação e da entrega. Sem publicação, merge ou push solicitados.

## Evidências da entrega

- Oito módulos, 32 aulas, 120 perguntas e 80 cartas no catálogo real; referência e fontes por aula.
- `npm test`: **604 testes passaram**, sem falhas ou testes pulados. Inclui as verificações anteriores de Linux, Java e SQL.
- 33 cenários explícitos JavaScript/HTML, com cobertura das 32 aulas e testes locais de rede/HTTP/JSON. O projeto é conferido com espaços vazios, HTML literal, marcação/remoção, recarga, dados inválidos e gravação negada.
- Revisão independente leu 32 aulas, 120 perguntas e 80 cartas e conferiu a correspondência dos exemplos com os blocos das aulas. Três problemas de código/formatação foram corrigidos com testes de regressão RED→GREEN: template literal em solução, pipes em tabela e import com inicial maiúscula.
- Chrome: trilha em 1280 px, aula e referência em 390 px; conclusão liberou duas cartas e 20 XP. Projeto final restaurou a tarefa marcada após recarga e exibiu HTML digitado literalmente. Enter enviou o formulário e Espaço alternou a checkbox.
- Uma tarefa de 120 caracteres sem espaços revelou transbordamento; o HTML e a aula receberam quebra de texto/controles responsivos. Nova conferência: largura da página e conteúdo em 390 px, sem transbordamento.
- Importação de módulo local executada no Chrome; soma de 2 e 3 produziu 5.
- `git diff --check` e conferência de whitespace dos arquivos novos sem problemas.
- Instalação real de Python em Windows/macOS não foi executada. As instruções apontam a documentação oficial; CORS de servidores externos e políticas de todos os navegadores não são cobertos pelos testes locais.
