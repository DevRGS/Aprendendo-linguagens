# Byte, Intensiva e as próximas cinco trilhas

Proposta de produto e currículo para a Central de Linguagens. A base é a branch com a trilha Python do commit `a7bd94c`. As quantidades, os nomes e a ordem de lançamento abaixo são decisões propostas para planejar a produção.

## 1. O que o aluno encontra ao voltar

Lia terminou a primeira aula de Python ontem. Hoje, ao abrir a Central, vê a próxima aula e sua duração, os últimos sete dias de estudo e as cartas que pode revisar. Byte caminha pela lateral do cartão e para ao lado de **Continuar estudando**. Lia abre o quiz de estudo. Ao acertar uma questão sobre dados ausentes, lê a explicação junto da expressão satisfeita do personagem. Ao atingir sua meta do dia, vê o dia marcado no calendário. Se o mesmo acerto acontecer numa prova, a correção e a comemoração aparecem no resultado.

A Central já mantém XP por data local, sequência de estudo, recorde, revisão espaçada e progresso por aula. Ações de estudo incluem concluir uma aula nova, responder a uma questão e avaliar um flashcard na sessão de revisão de cartas pendentes. A consulta livre de cartões serve para estudar à vontade e hoje não registra uma avaliação. Até um dia de estudo com zero XP pode estar registrado. O perfil permite metas de 20, 50 ou 100 XP. Há conquistas para sequências de estudo de 7, 30 e 100 dias e um contador agregado de metas alcançadas. A proposta aproveita essas regras e acrescenta um registro de qual meta valeu para cada dia da Intensiva.

### Início e mapa das trilhas

| Região | Conteúdo e ação |
|---|---|
| Primeiro cartão | Para o primeiro acesso, **Escolher uma trilha**. Para quem já estudou, mostrar trilha, módulo, aula e duração. Retomar a última aula aberta se estiver pendente. Se estiver concluída, sugerir a próxima pendente pela ordem do manifesto, começando pelas seguintes e voltando às anteriores se preciso. Com todas lidas, sugerir a prática de um módulo pendente, depois a prova e, por fim, o certificado. |
| Semana | Sete datas em ordem, terminando hoje. Mostrar o estado por símbolo e texto acessível. O resumo informa quantos dias consecutivos de meta o aluno tem e quanto XP falta hoje. |
| Revisão | Exibir a contagem real de cartas devidas e abrir a revisão existente. Em tela estreita, empilhar os três blocos na ordem acima. |
| Trilha aberta | Usar uma linha vertical com um ponto por módulo, título, contagem de aulas e prática. Abrir inicialmente o módulo recomendado. Os rótulos “Em andamento” e “Concluído” acompanham os ícones. Todas as aulas continuam acessíveis diretamente por URL. |
| Projetos práticos | Depois das primeiras entregas, reunir projetos que já tenham materiais publicados. Cada cartão responde “O que vou construir?”, “O que preciso saber?” e “Onde começo?”. A primeira coleção pode usar a API JavaScript e o projeto de viagens de Python. |

Exemplo de início no celular, para Lia no terceiro dia com a meta em andamento. Os dias da semana devem carregar também a data no rótulo acessível.

```text
Continuar estudando
Python › Primeiros programas
Nomes e tipos · 23 min                 [Continuar]
                                    Byte aponta ↗

Sua Intensiva                     2 dias seguidos
qui   sex   sáb   dom   seg   ter   qua
 ·     ·     ·     ·     ✓     ✓     ◐
Hoje · 30 de 50 XP                Faltam 20 XP

3 cartas para revisar                    [Revisar]
```

## 2. Byte, o mascote da Central

**Desenho.** Um pequeno robô de bancada com corpo de terminal arredondado, visor escuro, dois pés curtos e uma antena que lembra um cursor. A carcaça usa o laranja da Central. Olhos e postura expressam a reação mesmo em uma imagem monocromática. A equipe de arte entrega poses originais em fundo transparente, com os pés na mesma linha de base para a animação andar sem saltos. Testar a silhueta em 32 px antes de produzir os demais quadros.

| Situação | Movimento e fala | Quando termina |
|---|---|---|
| Primeiro acesso | Byte acena uma vez junto de “Escolher uma trilha”. “Por onde você quer começar?” | A fala cede lugar ao cartão ao iniciar a navegação. |
| Volta ao início | Caminha uma vez por uma faixa interna do cartão, por até três segundos, e para. Quando houver aula para retomar, aponta para a ação. | Uma caminhada por visita ao início. O personagem em repouso pode ser recolhido. |
| Leitura de aula | Fica recolhido junto ao conteúdo. Quem o abrir pode consultar a próxima ação disponível, como praticar o módulo. | Volta ao estado compacto ao recolher ou ao trocar de tela. |
| Acerto em estudo | Sorri brevemente ao lado da explicação já presente. Exemplo de fala editorial para uma questão sobre ausentes: “Você preservou o zero. Ele é uma medida válida.” | A reação termina antes da próxima questão. A explicação fica disponível para leitura. |
| Erro em estudo | Inclina a cabeça e aponta para a revisão vinculada à questão. “Vamos rever esse passo?” | O aluno escolhe revisar ou avançar. |
| Meta diária e sétimo dia | Acende o visor e marca a data. No sétimo dia consecutivo, uma única celebração diz “Sete dias atingindo sua meta!”. | Se a mesma resposta gerar mais de um evento, mostrar a celebração do sétimo dia e conservar o feedback da questão no seu lugar. |
| Retorno após pausa | A partir de dois dias de diferença entre hoje e a última data de estudo, recebe a pessoa com a ação real de menor atrito. Exemplo, se houver cartas devidas: “Vamos começar com uma revisão?” | O toque leva à revisão. Se não houver cartas, a ação leva à trilha. |

**Voz e origem das falas.** Usar frases curtas em português e reconhecer a ação observada. O feedback técnico vem da explicação revisada da própria pergunta. O balão pode ter uma linha de incentivo, e a explicação completa fica uma única vez na área de resposta. A primeira versão usa poucas falas escritas e uma expressão por estado. Se uma questão tiver fala específica, o revisor confere a correspondência entre fala, enunciado e gabarito. Um erro de carregamento ou de correção mostra a ação para tentar de novo.

**Controle do aluno.** Em Configurações, oferecer “Byte animado”, “Byte parado” e “Ocultar Byte”. Respeitar a preferência de movimento reduzido do sistema já na primeira visita. O modo parado mantém o feedback textual. No celular, reservar espaço no fluxo da página abaixo do cartão ou da resposta. Nenhuma pose intercepta o botão Avançar, a edição de código ou a seleção de texto. Navegação por teclado mantém o foco no controle escolhido. O desenho decorativo fica fora da árvore de acessibilidade e o anúncio de resposta já existente continua único. A faixa do calendário usa dia, estado e valor em texto acessível. [Orientações de acessibilidade para movimento](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html)

**Entrega visual mínima.** Primeiro aprovar uma prancha com repouso, caminhada, acerto e incentivo após erro, em desktop e a 390 px. Depois produzir a acenada e a celebração da Intensiva. A animação deve parar quando a aba fica oculta. Se a arte falhar ao carregar, os textos, botões e marcações continuam utilizáveis.

## 3. Como funciona a Intensiva de 7 dias

A sequência de estudo responde “Em quantos dias seguidos estudei?”. A Intensiva responde “Em quantos dias seguidos alcancei minha meta?”. Um dia pode contribuir para ambas. A Intensiva começa automaticamente no primeiro dia com meta cumprida e usa o calendário local da pessoa.

1. Na primeira atividade elegível do dia, registrar a meta vigente e a data. Usar esse valor para a barra de meta e para a Intensiva durante o restante do dia. Se a pessoa editar a meta antes da primeira atividade, usar o novo valor naquele dia. Depois da primeira atividade, explicar que a alteração vale a partir do próximo dia de estudo.
2. Quando o total de XP do dia alcançar esse valor, marcar a data uma única vez. Contabilizar também XP ganho na conclusão de módulo ou prova pela mesma ação. Repetir questão, recarregar a página ou importar o mesmo backup conserva o resultado.
3. Contar dias de calendário consecutivos com marca. Hoje ainda em aberto mantém a sequência de ontem visível, com a indicação “Hoje em andamento”. Ao encerrar um dia abaixo da meta, a próxima meta atingida inicia outra sequência. A primeira marca de sete dias libera uma conquista com ID próprio, proposto como `intensiva-7`. A conquista `meta-7` continua reconhecendo sete metas acumuladas. Ao continuar, mostrar 8, 9 e assim por diante. Preservar o melhor resultado.
4. Para perfis antigos, usar as datas disponíveis para mostrar atividade passada. O XP e o contador agregado atuais não identificam a meta histórica de cada dia. Exibir “Estudou · meta histórica desconhecida” quando couber e começar a Intensiva com registros comprovados. Se a atualização chegar após uma atividade no dia corrente, iniciar o registro na próxima atividade desse dia com a meta então vigente e todo o XP já creditado hoje. Se o XP anterior à atualização já atingia o alvo, a nova Intensiva pode marcar a data. Se o dia da atualização já tiver estudo no formato antigo, conservar o contador legado naquele dia, pois falta saber se a meta antiga já foi creditada. O primeiro dia inteiro no novo formato volta a incrementar o contador no primeiro cruzamento comprovado.
5. Salvar preferência do mascote, datas, metas e recorde junto do progresso. Testar exportação e importação dos dois formatos, inicialização com campos ausentes e o uso de datas locais na virada de mês e ano. Guardar também a última data qualificada, o comprimento da sequência corrente e o recorde. Testar 401 dias consecutivos para cobrir a expiração do detalhe diário sem truncar a sequência.

**Exemplo de aceite.** Com meta de 50 XP, Lia ganha 20 na segunda e 50 na terça. Ambas aparecem como estudo. Só terça abre a Intensiva. Se alcançar 50 todos os dias até a segunda seguinte, verá sete dias e uma celebração. Se na quarta ela já começou a estudar com meta 50 e depois escolher 100, a quarta continua valendo 50 e o próximo dia começa com 100.

**Integração a conferir.** Atribuir a marca junto às ações de estudo e crédito de XP em `js/core/actions.js`. Tornar a meta usada pelo calendário, pela barra, pelo contador de metas e pelo feedback consistente mesmo após mudança de preferência. Calcular o estado por dia com as rotinas de data da Central. Adaptar a normalização em `js/core/state.js` e os testes de backup. A interface consulta o resultado da ação concluída. Em simulado e prova, adiar também o sinal de meta, a expressão de Byte e as mudanças visíveis de XP, avisos de nível e conquistas que possam entregar o acerto antes do resultado. As ações continuam registrando o progresso. Verificar o cabeçalho e os anúncios globais tanto quanto a área da pergunta. Nas telas de estudo, integrar a reação ao feedback que `quiz-runner.js` já apresenta.

## 4. Currículo proposto

Cada linha das tabelas abaixo é **um módulo com quatro aulas em ordem de leitura**. Cada aula tem uma demonstração, uma variação para investigar e uma tarefa de transferência com saída ou critério observável. Como orçamento editorial, prever quatro questões e dois flashcards por aula. Assim, cada trilha de cinco módulos oferece 20 aulas, 60 atividades, 80 questões e 40 cartas. Produzir e revisar por módulo. A Central já suporta prática de 5 perguntas e prova de 40. O projeto final inclui material inicial, solução comentada, uma variação inédita e um roteiro de reprodução.

A sequência de **lançamento** proposta é Git e GitHub, Machine Learning, HTML e CSS, TypeScript e PostgreSQL. Git dá apoio a qualquer projeto. ML aproveita agora a base de Python. A sequência de **estudo** depende do objetivo. Quem está começando no desenvolvimento web pode entrar em HTML e CSS desde o início; quem deseja trabalhar com dados começa por Python e segue para ML.

### Git e GitHub — entregar uma mudança revisável

**Entrada e ambiente.** Saber abrir uma pasta no terminal é suficiente. Começar em uma pasta descartável e configurar a identidade para o repositório do exercício. Para praticar colaboração sem conta, fornecer um remoto local e duas cópias representando colaboradores. Para a etapa de pull request, usar um repositório de estudo no GitHub e uma conta do aluno. No percurso individual de revisão, fornecer um comentário de exemplo para o aluno analisar e incorporar. Quando houver um colega, ele revisa o diff no GitHub. A conclusão individual dispensa aprovação formal de outra pessoa.

| Módulo | Quatro aulas em sequência | Evidência do aluno |
|---|---|---|
| 1. Primeiro histórico | Identificar o repositório → inspecionar status → selecionar alterações → criar e inspecionar um commit | Criar dois commits com mensagens que expliquem mudanças diferentes. |
| 2. Entender diferenças | Diretório de trabalho e índice → comparar mudanças preparadas → consultar histórico → ignorar arquivos gerados | Preparar só uma alteração entre duas e prever o conteúdo do próximo commit. |
| 3. Trabalhar em paralelo | Criar branch → alternar entre versões → integrar mudanças → resolver conflito de texto | Integrar duas edições da mesma linha preservando a intenção de ambos os autores. |
| 4. Colaborar | Clonar remoto de estudo → buscar referências → enviar uma branch → abrir e revisar um pull request | Ler o diff, justificar a mudança e incorporar uma observação da revisão. |
| 5. Recuperar e entregar | Reverter um commit publicado → conferir o resultado → marcar uma versão → reproduzir a partir de clone limpo | Entregar histórico, revisão e instruções suficientes para outra pessoa reproduzir. |

**Desafio de conclusão.** Melhorar o guia de um projeto didático. O avaliador refaz o clone, confere que a versão marcada contém a correção e pede ao aluno que explique a diferença entre o arquivo editado e o que foi registrado no commit. Comparar conteúdo e relações do histórico, pois os hashes variam. [Pro Git em português](https://git-scm.com/book/pt-br/v2) · [Pull requests no GitHub](https://docs.github.com/pt/pull-requests)

### Machine Learning com Python — comparar um modelo com uma referência

**Entrada e ambiente.** Exigir que o aluno consiga produzir X e y alinhados, separar partições e explicar vazamento. Oferecer diagnóstico com uma viagem cujo faturamento é conhecido depois da chegada. Planejar scripts em ambiente virtual e notebooks. Antes de prometer execução integral no navegador, provar que os estimadores e dependências selecionados funcionam no kernel da trilha com dados locais pequenos.

| Módulo | Quatro aulas em sequência | Evidência do aluno |
|---|---|---|
| 1. Formular e medir | Definir previsão e unidade → separar observações → reproduzir referência constante → interpretar MAE | Nas viagens de Python, prever 10 minutos para todos produz MAE de validação de 3,5 minutos. Distinguir a previsão de sua métrica. |
| 2. Regressão | Separar atributos e alvo → ajustar regressão linear → gerar previsões → inspecionar resíduos | Comparar modelo e referência sobre as mesmas linhas e explicar um erro grande. |
| 3. Fluxo reproduzível | Tratar ausentes → compor transformação e modelo → validar em janelas temporais → escolher parâmetros | Mostrar que alterar um valor reservado para avaliação final preserva os parâmetros aprendidos. |
| 4. Classificação | Preparar rótulo binário e partições em outro conjunto → ajustar um classificador simples no treino e prever classes na validação → interpretar a matriz de confusão → comparar precisão e revocação | Identificar um falso negativo e justificar qual erro importa para a decisão proposta. |
| 5. Projeto de viagens | Receber um novo lote → congelar procedimento → avaliar em período posterior → comunicar limites | Entregar script ou notebook reproduzível, métricas em minutos, um gráfico e justificativa da escolha. |

**Desafio de conclusão.** Usar as dez viagens conhecidas para conferir o procedimento. Fornecer também uma série sintética maior, documentada e com período final reservado, para que o aluno possa comparar alternativas em validação e avaliar a escolha uma vez ao final. O modelo pode perder para a referência e obter nota máxima se a avaliação estiver correta. A rubrica cobra disponibilidade dos atributos, ajuste em treino, partições disjuntas e conclusão sustentada pelos resultados. [Práticas recomendadas e vazamento no scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html) · [Avaliação de modelos](https://scikit-learn.org/stable/modules/model_evaluation.html)

### HTML e CSS — construir uma página que outra pessoa consegue usar

**Entrada e ambiente.** Sem pré-requisito de programação. Um editor, arquivos locais e um navegador bastam para começar. O projeto é um catálogo de estudos com navegação por teclado. A integração com JavaScript da Central é uma continuação opcional.

| Módulo | Quatro aulas em sequência | Evidência do aluno |
|---|---|---|
| 1. Um documento navegável | Criar index.html → hierarquia de títulos → links e caminhos relativos → imagens e alternativas textuais | Abrir duas páginas, navegar entre elas e explicar o destino de cada link. |
| 2. Conteúdo e formulários | Regiões semânticas da página → listas e artigos → rótulos de campos → controles nativos e validação | Percorrer o formulário por teclado e identificar o campo anunciado ao focá-lo. |
| 3. Aparência | Seletores → cascata e herança → modelo de caixa → cor, tipografia e foco | Diagnosticar uma regra sobrescrita com as ferramentas de desenvolvedor. |
| 4. Layout | Fluxo normal → alinhamento com Flexbox → grade de cartões → adaptação à largura | Usar a página em tela estreita e larga, ampliando o texto e preservando leitura e foco. |
| 5. Publicação | Organizar caminhos → testar navegação → publicar arquivos estáticos → revisar a página publicada | Entregar endereço ou pacote local, com imagens e links funcionais sob um subdiretório. |

**Desafio de conclusão.** Outra pessoa precisa encontrar uma trilha e abrir sua página usando apenas o teclado. Em 390 px, todo botão permanece alcançável. Um campo obrigatório tem rótulo e uma mensagem compreensível. Explicar o destino dos dados quando o formulário for apenas demonstrativo. [Currículo de desenvolvimento web da MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core)

### TypeScript — migrar uma parte da API JavaScript

**Entrada e ambiente.** Pressupor funções, objetos, módulos e promises de JavaScript. Começar com exemplos curtos, depois baixar uma cópia da API de estudos. Fixar versões compatíveis de Node, compilador e tipos. Documentar instalação, verificação de tipos, compilação, inicialização e testes do kit.

| Módulo | Quatro aulas em sequência | Evidência do aluno |
|---|---|---|
| 1. Começar a tipar | Executar o projeto-base → inferência → anotações → interpretar um diagnóstico | Corrigir um tipo incompatível e explicar o erro antes de compilar. |
| 2. Modelar registros | Tipos de objetos → campos opcionais → uniões → refinar o tipo após uma verificação (narrowing) | Tratar sucesso e erro cobrindo os formatos previstos. |
| 3. Dados externos | Receber dados como `unknown` → validar estrutura → distinguir entrada e registro salvo → converter para o domínio | Rejeitar uma carga JSON inválida em tempo de execução e aceitar uma válida. |
| 4. Contratos entre camadas | Módulos e configuração → funções assíncronas → interfaces de repositório → genéricos para resultados | Trocar a implementação em memória pela do kit preservando o contrato. |
| 5. Migração da API | Registrar o comportamento atual → migrar uma rota verticalmente → executar testes de contrato → documentar execução | Preservar os códigos HTTP, a autorização e o formato das respostas do recurso migrado. |

**Desafio de conclusão.** Migrar criação e leitura de um recurso da API já ensinada. O aluno recebe testes prévios e acrescenta um caso de corpo malformado. O aceite exige compilação estrita, respostas HTTP corretas e validação real da entrada. [Narrowing no Handbook do TypeScript](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

### PostgreSQL — levar o CRUD a um banco servidor

**Entrada e ambiente.** Retomar consultas da trilha SQL e CRUD da trilha JavaScript. Usar um servidor PostgreSQL local e uma base exclusiva de laboratório. Fornecer versão de referência, instruções de conexão com psql, dados fictícios, scripts de criação e reinício da base de treino. Os exemplos que dependem do dialeto rodam no PostgreSQL.

| Módulo | Quatro aulas em sequência | Evidência do aluno |
|---|---|---|
| 1. Banco e esquema | Conectar → criar tabelas → escolher tipos → aplicar restrições | Explicar por que o banco recusa uma chave estrangeira inexistente. |
| 2. Consultas do projeto | Fazer junções → agregar → filtrar grupos → ordenar e paginar | Produzir relatório com dados conhecidos e ordem estável em caso de empate. |
| 3. Escrita consistente | Inserir com retorno → atualizar → agrupar operações em transação → desfazer em caso de falha | Simular falha na segunda gravação e comprovar que a primeira também foi desfeita. |
| 4. Evolução e desempenho | Criar migração → popular dados → ler plano de consulta → experimentar índice | Comparar planos na mesma consulta e discutir o efeito da quantidade de dados. |
| 5. API integrada | Configurar conexão local → parametrizar consultas → testar isolamento dos registros por usuário → reproduzir em base nova | Rodar migrações e testes de integração a partir dos arquivos entregues. |

**Desafio de conclusão.** Substituir a persistência SQLite do CRUD de estudos por PostgreSQL em uma cópia do projeto. Validar uma escrita atômica, a leitura autorizada e o reaproveitamento dos testes HTTP. O exercício de desempenho avalia a interpretação do plano; o otimizador pode escolher varredura sequencial para tabelas pequenas. [Tutorial oficial do PostgreSQL](https://www.postgresql.org/docs/current/tutorial.html)

## 5. Ordem de entrega e revisão

| Entrega | O que fica utilizável | Critério para avançar |
|---|---|---|
| 1. Byte e a semana | Início, controle de movimento, feedback de estudo, retorno após pausa e Intensiva. | Simular perfil novo e antigo, meta alterada, zero XP, dias 6/7/8, simulado, restauração de backup e tela estreita. Recarregar em cada cenário sem duplicar marca ou celebração. |
| 2. Git e GitHub | Trilha completa e primeiro projeto novo. | Reproduzir o exercício de conflito em duas cópias limpas e revisar o fluxo de pull request numa conta de estudo. |
| 3. ML e mapa de trilhas | Continuação do projeto de Python e mapa navegável também para as trilhas existentes. | Executar o projeto com dados inéditos, conferir a métrica de referência e testar o mapa com progresso anterior e navegação por teclado. |
| 4. HTML e CSS e página de projetos | Nova porta de entrada para iniciantes e coleção navegável de projetos existentes. | Testar foco, textos alternativos, largura estreita e caminhos após publicação em subdiretório. |
| 5. TypeScript | Migração reproduzível de um recurso do backend. | Compilar, iniciar do zero e passar testes de contrato com entradas válidas e inválidas. |
| 6. PostgreSQL | CRUD com migrações e transações reais. | Criar uma base limpa e confirmar integridade antes e depois de uma falha de transação. |

Em cada trilha, começar por uma aula representativa e seu projeto mínimo. O autor escreve em português os pré-requisitos, o roteiro, o resultado esperado e uma variação que exponha um erro comum. O revisor didático executa o material copiável, confere o gabarito e registra o parecer. Na integração, validar manifesto, bancos, flashcards, prova e links no prefixo do Pages. O aceite do piloto de uma trilha permite ajustar a extensão das aulas antes de produzir as demais.
