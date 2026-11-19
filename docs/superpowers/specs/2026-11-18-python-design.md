# Trilha Python — do primeiro programa à preparação de dados para machine learning

**Especificação para implementação futura · 18 de novembro de 2026 · execução prevista com GPT-6.2 Sol, esforço alto.** Este documento define o currículo, os materiais, o comportamento esperado e os critérios de aceite. Os caminhos de Python citados são entregáveis futuros. O ponto de integração é a Central de Linguagens no GitHub Pages.

## 1. Resultado de aprendizagem e extensão

O público começa sem experiência em programação. Na primeira aula, deve conseguir exibir uma frase, alterar o programa e interpretar um erro. Ao final, recebe arquivos tabulares inéditos, escreve e testa transformações em Python, produz uma matriz de atributos e um vetor alvo, descreve o que poderia causar vazamento de dados e entrega o trabalho de forma reproduzível. Para cada escolha, deve conseguir explicar o efeito com um exemplo pequeno.

Proposta de **16 módulos de 4 aulas**, **192 exercícios guiados** (três por aula), **256 questões de avaliação** (quatro por aula) e **128 flashcards** (dois por aula). O tempo inclui a prática. Prever aproximadamente 20–30 minutos por aula fundamental, 30–45 nas intermediárias e 45–60 nas de dados e projeto. Calibrar o valor inteiro de `minutes` no piloto. Numerar os exercícios no caderno e no roteiro para que o aluno possa salvar onde parou. A central registra a conclusão da aula inteira.

| Etapa | Módulos em ordem | Evidência que o aluno produz |
|---|---|---|
| Primeiros programas | 01–04 | Lê e valida entradas simples, percorre coleções e resume registros em memória. |
| Programas organizados | 05–08 | Divide o problema em funções e módulos, trabalha com arquivos e representa registros com contratos explícitos. |
| Python avançado para dados | 09–12 | Controla iteração, recursos e testes, distingue custos de tempo/memória e opera matrizes por eixo. |
| Análise e preparação para ML | 13–16 | Audita tabelas, interpreta estatísticas, separa conjuntos e prepara um projeto reproduzível. |

Cada módulo pressupõe os anteriores. Os marcos em 04, 08, 12 e 16 funcionam como diagnósticos com opção de revisão. Os links diretos continuam acessíveis para quem já conhece o assunto. O curso futuro de ML poderá partir de particionamento, formas de X e y e avaliação de uma referência simples para introduzir treinamento, estimadores, otimização e validação cruzada.

## 2. Experiência nos dois ambientes

**Decisão de projeto proposta:** a central hospeda as aulas, os exemplos e os downloads estáticos. O botão ou link **Praticar no navegador** leva a um JupyterLite com kernel Python/Pyodide em outra origem. **Baixar para o terminal** oferece os mesmos exemplos em arquivos. Isso aproveita o site existente e permite executar código real e visualizar gráficos sem conta. Um serviço remoto de execução exigiria hospedagem e tratamento do código recebido. Um editor próprio com Pyodide embutido exigiria construir e manter controles de execução, arquivos e renderização. A proposta usa os controles já disponíveis no JupyterLab. O aluno escolhe um percurso e consegue concluir a trilha inteira nele. Quem testa o material verifica os dois. O progresso da central continua ligado à conclusão das aulas, práticas e prova.

**Navegador, desde a primeira aula.** Oferecer o caderno inicial daquela aula (.ipynb) e o endereço verificado do laboratório em nova aba. Ensinar a baixar o caderno, usar Upload Files (seta para cima) ou arrastá-lo ao painel de arquivos, abri-lo, selecionar o kernel Python com Pyodide, esperar ficar pronto e executar uma célula com Shift+Enter. Mostrar onde aparecem a saída e o pedido de entrada, como editar, reiniciar o kernel e executar desde o início, e como baixar o trabalho antes de fechar. A aula precisa funcionar também se aberta diretamente por URL. Na primeira, oferecer ainda um bloco de uma linha para colar em caderno vazio. Os arquivos do navegador precisam ser exportados para chegar ao disco do aluno. Uma sessão nova recebe os dados de partida pela célula de preparação.

**Terminal, desde a primeira aula.** Orientar instalação do CPython pelo [site oficial](https://www.python.org/downloads/), conferência de versão e abertura de um terminal novo, sem exigir WSL. Mostrar a diferença entre prompt do shell, REPL e arquivo salvo pelo editor em UTF-8. Identificar explicitamente blocos PowerShell e Bash. No Windows, primeiro verificar `py --version` (se apenas `python --version` localizar o Python compatível, usar esse comando). No Linux/macOS usar `python3 --version`. Com o terminal na pasta extraída do exemplo, executar `py exemplo.py` ou `python3 exemplo.py`. Ensinar a repetir após salvar e a localizar a pasta se surgir erro de arquivo inexistente. Exemplo básico deve funcionar antes da instalação de bibliotecas de terceiros.

**Versões e preparação avançada.** Adotar Python 3.14.x como alvo inicial comum, sujeito à homologação do kernel disponível. Na primeira fatia de implementação, registrar `sys.version`, kernel, versão do JupyterLite, sistema, NumPy, pandas e Matplotlib realmente executados e versões de pacotes com wheels compatíveis para o terminal. Congelar dependências validadas em arquivo de requisitos do kit. A aula de ambiente explica o significado de cada comando. Fornecer desde o início uma ficha de preparação rápida para quem entrar diretamente em dados. A partir da raiz do kit:

| Ação | Windows PowerShell | Linux/macOS Bash |
|---|---|---|
| Criar ambiente | `py -3.14 -m venv .venv` | `python3.14 -m venv .venv` |
| Instalar pacotes | `.\.venv\Scripts\python.exe -m pip install -r requirements.txt` | `.venv/bin/python -m pip install -r requirements.txt` |
| Conferir intérprete | `.\.venv\Scripts\python.exe -c "import sys; print(sys.executable)"` | `.venv/bin/python -c "import sys; print(sys.executable)"` |

Para módulos com bibliotecas externas, cada ZIP inclui `requirements.txt` na raiz. O aluno instala e executa com o mesmo intérprete, sempre a partir dessa raiz. No kit de NumPy, por exemplo:

| Ação | Windows PowerShell | Linux/macOS Bash |
|---|---|---|
| Rodar a primeira aula do kit | `.\.venv\Scripts\python.exe aulas/arrays/exemplo.py` | `.venv/bin/python aulas/arrays/exemplo.py` |
| Conferir as soluções do kit | `.\.venv\Scripts\python.exe -m unittest discover -s testes` | `.venv/bin/python -m unittest discover -s testes` |

Cada README fornece o caminho real de sua aula. No terminal, localizar fixtures a partir do arquivo de exemplo (`Path(__file__).resolve().parent`), independentemente da pasta de onde foi iniciado. No caderno a célula inicial fornece a pasta de dados explicitamente.

Se o aluno só tiver `python` ou `python3`, verificar a versão antes de usá-lo na criação do ambiente. Os comandos acima dispensam ativação. Incluir roteiro de diagnóstico para falta de `venv` na distribuição Linux, pacote ausente, executável errado e diretório diferente. Comandos de instalação ficam em blocos de terminal. No caderno, mostrar os pacotes disponíveis pelo kernel e importar apenas os necessários naquela etapa.

**Equivalência de resultados.** Cada célula executável tem contrapartida no roteiro do terminal. Usar `print` para saídas comparadas nos dois, sem depender da exibição automática da última expressão. Atividades com `input()` incluem uma pequena transcrição com as respostas digitadas e uma variante com valores predefinidos para execução em lote. Exercícios sobre argumentos, ambiente virtual e testes de disco têm uma experiência equivalente no navegador: fornecer lista de argumentos à função, inspecionar o intérprete do kernel e escrever/ler arquivos virtuais. Comandos de instalação e caminhos do SO são demonstrações específicas do terminal. Gráficos mostram a mesma figura no caderno e por PNG no terminal, inclusive sem tela gráfica.

**Disponibilidade.** O [laboratório público de referência](https://jupyterlite.github.io/demo/lab/index.html) é uma distribuição externa sujeita a mudanças. Usá-lo como destino da versão inicial somente após validar todas as dependências, arquivos, entrada, gráficos e execução completa em sessão nova. Se não atender, entregar uma distribuição JupyterLite estática controlada em origem dedicada, com o kernel e as wheels homologadas, antes de anunciar suporte. A central expõe o link alternativo para download, o tamanho dos kits e instruções de recuperação quando houver falha de rede/kernel. Evitar execução automática ao abrir a aula. Ensinar a interromper pelo controle do ambiente quando disponível e reiniciar a sessão se estiver travada. Não exigir privilégios administrativos, dados pessoais ou segredos nas atividades.

## 3. Contrato editorial de uma aula

1. Abrir com uma tarefa observável e uma previsão curta. Apresentar os pré-requisitos e links para retomar a ideia anterior.
2. Explicar em português o primeiro conceito com um exemplo mínimo. Mostrar o valor antes e depois de cada operação decisiva e distinguir código, entrada e saída. Introduzir o nome técnico no momento em que ele é usado.
3. Mostrar preparação específica dos dois ambientes, arquivos e dados de entrada. Entregar um ponto de partida independente da aula anterior. Para a versão navegador, a célula inicial materializa fixtures pequenas em um diretório exclusivo de estudo. Ao repetir a preparação, preservar as edições do aluno e oferecer a reposição dos arquivos de exemplo em uma nova pasta. Nos projetos com vários arquivos, fornecer os módulos auxiliares nesse diretório, torná-lo importável e explicar quando reiniciar o kernel para reler um módulo editado. No terminal usar uma pasta nova para a atividade.
4. Seguir **E1 → E2 → E3** na matriz abaixo. E1 é demonstração guiada com previsão e execução. E2 troca uma condição ou investiga um erro, com pista opcional. E3 pede resolver um problema de transferência antes de abrir a solução. Cada solução recolhível deve explicar a escolha, mostrar a saída esperada e apresentar ao menos um caso de borda relevante.
5. Fechar com uma pergunta de interpretação, indicar o próximo passo e ligar as fontes primárias específicas ao tópico. Nos exemplos de erro, mostrar o código como intencionalmente incorreto, a classe da exceção, a causa e a correção. O texto exato do traceback varia com o ambiente e a versão. Para permitir “Reiniciar e executar tudo”, mostrar o código incorreto em Markdown e propor executá-lo numa célula descartável separada, ou capturar só a exceção esperada na versão resolvida. Para SyntaxError, compilar o exemplo como texto dentro do teste. No terminal, manter cada demonstração de erro sintático em arquivo separado do roteiro principal.

Na matriz, os nomes entre crases na primeira coluna são os IDs de aula. A ordem das linhas define os arquivos `01-<id>.md` a `04-<id>.md`. A coluna de explicação determina a sequência conceitual, da esquerda para a direita. As setas nos exercícios indicam resultados que devem ser verificáveis. Cada aula fornece seus próprios dados, definições e imports, inclusive para quem chegar por link direto. Na primeira aparição de uma construção, explicar apenas o necessário para o aluno executá-la. Por exemplo, ao apresentar pathlib no módulo 06, explicar que a instrução de importação torna o nome Path disponível. A organização em módulos próprios vem no 07.

## 4. Matriz curricular, em ordem de estudo

### 01 · Primeiros programas (`inicio`)

| Aula | Explicar nesta ordem | E1 · acompanhar | E2 · variar ou depurar | E3 · resolver |
|---|---|---|---|---|
| `primeira-execucao` | Instrução, execução, saída, diferença entre editor e terminal. | Executar `print("Olá, mundo!")` → uma linha. | Trocar a mensagem e prever o efeito das aspas. | Imprimir nome fictício e objetivo em duas linhas no ambiente escolhido. |
| `nomes-e-tipos` | Literal, atribuição, leitura de expressão, tipos int/float/str/bool. | Atribuir 4 a `aulas`, somar 2 e imprimir 6. | Comparar `"4" * 2` com `4 * 2` → texto 44 e inteiro 8. | Montar uma ficha com título, duração e indicador de conclusão. Identificar o tipo de cada campo. |
| `contas-e-formatacao` | Operações, precedência, divisão real, quociente e resto, f-string. | Transformar 135 minutos em 2 horas e 15 minutos. | Prever diferença entre `2 + 3 * 4` e `(2 + 3) * 4`. | Com 3 itens de 2,50, exibir `Total: 7.50`; distinguir formatação da representação interna. |
| `entrada-e-erros` | input devolve texto, conversão explícita, última linha do traceback. | Digitar 12, converter e somar 1 → 13. | Comparar `prin("oi")` (nome inexistente) e string sem aspas finais (erro de sintaxe). | Ler dois inteiros, mostrar soma e explicar o que ocorre com entrada `doze`. Tratamento automático virá no módulo 06. |

### 02 · Decisões e repetições (`fluxo`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `comparacoes` | Comparar valores, igualdade, operadores lógicos, limites inclusivos. | Avaliar `0 <= nota <= 10` com 0, 10 e 11. | Prever resultado com `and`, `or` e parênteses. | Formular a regra “tem cadastro e idade de pelo menos 16” e demonstrar três casos. |
| `condicoes` | Blocos indentados, if/elif/else, ordem das condições. | Classificar nota 7 como aprovada pela regra ≥7. | Corrigir faixas sobrepostas que ocultam a recuperação (5 até abaixo de 7). | Para −1, 5, 7 e 11, produzir inválida, recuperação, aprovada e inválida. |
| `for-e-acumuladores` | Iteração, range com fim exclusivo, acumulador e rastreamento. | Somar 1 até 4 → estados 1, 3, 6, 10. | Explicar por que `range(1,4)` omite 4. | Somar pares de 2 até 10 → 30. |
| `while-e-parada` | Estado inicial, condição, atualização, sentinela e break. | Contar de 3 a 1, parar em 0. | Corrigir no papel uma atualização ausente antes de executar. | Ler 3, 2 e 0; contar duas entradas e totalizar 5, excluindo a sentinela. |

### 03 · Texto, sequências e mutabilidade (`sequencias`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `texto-e-fatias` | Índice baseado em zero, fatia semiaberta, texto imutável, métodos. | Normalizar `" Ana "` com strip e lower → `ana`. | Comparar fatia de texto vazio e acesso ao índice 0. | Retirar espaços e separar `"azul,verde"` em duas palavras. |
| `listas` | Construção, índice, append, alteração e remoção. | Em [4,6], acrescentar 8 → [4,6,8]. | Comparar atribuição compartilhada a cópia rasa de lista plana. | Alterar só a cópia e provar pelo conteúdo das duas listas. |
| `percorrer-e-filtrar` | Iterar elementos e índices, enumerate, condição, lista resultado. | Filtrar temperaturas positivas em [−1,2,0,4] → [2,4]. | Mostrar diferença entre posição e valor ao usar enumerate. | Obter os índices dos valores ausentes em [3,None,0,None] → [1,3], preservando zero. |
| `compreensoes` | Laço equivalente, transformação, filtro, legibilidade. | Dobrar [1,2,3] → [2,4,6] em laço e compreensão. | Em [1,2,3], comparar filtrar pares antes de dobrar → [4] com dobrar todos e depois filtrar pares → [2,4,6]. No segundo caso usar duas etapas válidas. | Gerar quadrados dos pares de 0 a 5 → [0,4,16], incluindo teste para sequência vazia. |

### 04 · Registros e agregações (`registros`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `tuplas-e-desempacotamento` | Registro de tamanho fixo, tupla, atribuição múltipla, zip. | Extrair id e valor de ("a",3). | Detectar quando duas sequências têm comprimentos diferentes e zip comum trunca. | Combinar três nomes e três medidas; mostrar política explícita para tamanho incompatível. |
| `dicionarios` | Chave, valor, acesso obrigatório, get, atualização e items. | Registrar `{"a":2}` e atualizar a para 3. | Distinguir chave ausente de valor zero. | Contar ["azul","azul","verde"] → azul 2, verde 1. |
| `conjuntos` | Unicidade, pertinência, interseção e diferença, ordem. | De [2,2,4] obter dois IDs únicos. | Comparar caracteres de set("ab") com um conjunto cujo elemento é "ab". | Detectar IDs comuns a dois lotes e apresentar a lista ordenada. |
| `resumo-de-lote` | Decompor problema, rastrear registros, verificar invariantes. | Somar minutos por tema em três registros (A,2), (B,3), (A,4). | Acrescentar duração zero e distinguir quantidade da soma. | Entregar resumo determinístico A=6, B=3, total=9 e explicar como tratou lote vazio. |

### 05 · Funções e contratos (`funcoes`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `parametros-e-retorno` | Definição, argumentos, parâmetros, retorno e chamada. | Fazer `dobro(3)` devolver 6 e usar o retorno em uma conta. | Investigar uma função que imprime e devolve None. | Separar `minutos(h,m)` da impressão; (2,15) → 135. |
| `escopo-e-padroes` | Nome local, parâmetros nomeados, valor padrão, estado compartilhado. | Aplicar desconto de 10% a 100. | Repetir duas chamadas de uma função com lista padrão mutável e reparar com sentinela None. | Criar rotulador de texto com prefixo opcional sem alterar os argumentos de origem. |
| `contratos-e-tipos` | Pré/pós-condições, docstring, anotações, limites. | Anotar `media(valores: list[float]) -> float` para lista não vazia. | Ver que anotação sozinha não valida valores na execução. | Especificar e implementar `media_ou_none` para [2,4] e [], documentando 3.0 e None. |
| `composicao` | Separar leitura, transformação e apresentação; função como argumento. | Encadear limpar nome e gerar etiqueta. | Ordenar registros por duração com função `key`. | Resumir um lote por composição e mostrar duas entradas que testam as responsabilidades em separado. |

### 06 · Arquivos e erros (`arquivos`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `caminhos-e-texto` | Diretório de trabalho, pathlib, UTF-8, modos e with. | Escrever e reler “ação” em arquivo novo da atividade. | Mostrar diferença entre caminho relativo e nome absoluto do laboratório. | Contar linhas não vazias de um arquivo com 3 linhas, uma vazia → 2. |
| `csv` | Cabeçalho, delimitador, DictReader, conversões e newline. | Ler id,minutos de duas linhas com 3 e 7 e somar 10. | Ler campo entre aspas contendo vírgula; explicar a falha de split simples. | Escrever CSV filtrado com cabeçalho e reabri-lo para conferir conteúdo e tipos convertidos. |
| `json` | Estruturas de Python versus JSON, dump/load, Unicode e null. | Fazer ida e volta de um dicionário com lista e None. | Comparar texto JSON com objeto carregado e detectar chave ausente. | Gravar e reler resumo com total 10 e quantidade 2 sem depender da ordem das chaves. |
| `excecoes` | Separar erro de arquivo e de conteúdo, try/except específico, raise e contexto. | Tratar ValueError ao ler "dez". | Distinguir arquivo ausente de linha inválida e informar linha sem ocultar a causa. | Ler "3", "erro", "0" pela política pular-e-contar → dois válidos, um rejeitado, soma 3. |

### 07 · Organização e reprodução (`projetos`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `modulos-e-imports` | Módulo, namespace, import e pasta atual. | Criar medidas.py e importar minutos(1,5) → 65. | Identificar por que chamar o próprio arquivo de csv.py pode ocultar a biblioteca padrão. | Organizar duas funções e importá-las em um segundo arquivo sem imprimir no import. |
| `ambiente-e-pacotes` | Intérprete, ambiente, pip do intérprete, versões e dependências. | Localizar sys.executable e sys.version; no terminal criar .venv. | Comparar a versão de NumPy informada por numpy.__version__ com importlib.metadata.version("numpy") usando o kit de dependências instalado ou o kernel preparado. | Produzir ficha de reprodução com versões e procedimento de instalação/abertura em sessão limpa. |
| `entrada-do-programa` | Separar main de import, argumentos, valores padrão, argparse. | Receber limite 5 por lista de argumentos no caderno e por CLI no terminal. | Comparar a ajuda e um argumento numérico inválido com o caso válido. No caderno passar lista explícita a parse_args, capturar SystemExit nos exemplos de ajuda/erro e manter o ponto de entrada CLI em arquivo separado. | Mesmo relatório para `main(["--limite","2"])` e o script chamado com `--limite 2`. |
| `pipeline-de-arquivos` | Contratos entre módulos, caminho configurável e reexecução. | Encadear ler CSV, transformar e gravar JSON em pasta da atividade. | Executar duas vezes e comparar os objetos resultantes. | Entregar três arquivos pequenos e um roteiro que produz total 10 em diretório novo. |

### 08 · Objetos e modelagem (`objetos`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `instancias` | Classe, instância, self, inicialização, método e estado por instância. | Criar dois contadores e incrementar apenas um. | Investigar lista mutável compartilhada no corpo da classe. | Modelar um acumulador que receba 2 e 5 e exponha total 7. |
| `dataclasses` | Campos, tipos, inicialização gerada, igualdade e default_factory. | Representar Medida(id, valor) e comparar registros iguais. | Dar uma lista independente a cada instância. | Converter dois registros CSV em objetos, validando valor e mantendo id como texto. |
| `composicao-e-polimorfismo` | Contrato de método, composição e substituição de estratégias. | Aplicar duas estratégias com mesmo método transformar. | Trocar a normalização pela identidade e prever efeito. | Montar processador que recebe estratégia por argumento e testar com duas implementações. |
| `modelo-ou-funcao` | Escolher função para transformação e objeto para estado; dependências explícitas. | Reescrever um resumo sem estado como função pura. | Identificar qual estado deve ficar por lote ao processar dois lotes. | Entregar relatório de medidas com testes de exemplo e justificar uma decisão de modelagem. |

### 09 · Iteração e recursos (`protocolos`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `iteradores` | Iterável, iterador, iter, next, esgotamento e StopIteration. | Consumir [2,5] uma vez em duas chamadas. | Comparar o segundo percurso de uma lista com o do mesmo iterador. | Obter primeiro registro válido com fallback documentado para vazio. |
| `geradores` | yield, suspensão, consumo sob demanda e memória. | Gerar quadrados de 0,1,2. | Observar quantos itens foram produzidos ao solicitar apenas o primeiro. | Percorrer arquivo linha a linha e somar registros válidos sem manter uma lista de todas as linhas. |
| `decoradores` | Função de ordem superior, closure, wrapper, @ e functools.wraps. | Envolver uma função e registrar uma chamada. | Reparar wrapper que perde o retorno ou os argumentos nomeados. | Contar duas chamadas e preservar retorno e nome da função decorada. |
| `gerentes-de-contexto` | Ciclo de recurso, with, try/finally e contextmanager. | Verificar que o arquivo está fechado depois do bloco. | Levantar ValueError dentro do contexto e observar a limpeza. | Criar contexto que registre início e fim e preserve a exceção original. |

### 10 · Qualidade e eficiência (`qualidade`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `testes-unitarios` | Entrada, ação, resultado esperado independente e unittest. | Testar função de minutos com (1,5) → 65. | Fazer uma implementação errada ser detectada por teste de borda. | Criar três testes de conversão, incluindo erro esperado com assertRaises. No caderno usar suíte explícita e runner. |
| `depuracao` | Rastrear causa, reproduzir caso mínimo, inspecionar valores e traceback. | Localizar KeyError num registro sem id. | Distinguir chave ausente de erro na conversão numérica. | Corrigir perda de zero num filtro de faltantes e manter teste de regressão. |
| `custo-de-operacoes` | Número de operações, busca linear, índice com conjunto, tempo e memória. | Contar comparações em busca sequencial de último item e de ausente. | Comparar pertinência repetida em lista e set, incluindo construção. | Justificar índice para muitas consultas; confirmar mesma resposta, sem exigir tempos absolutos. |
| `reprodutibilidade` | Ordem, gerador pseudoaleatório local, semente, ambiente e proveniência. | Usar duas instâncias de random.Random com mesma semente e sequência de chamadas. | Mostrar que uma chamada extra pode mudar a sequência restante. | Produzir resumo repetível com IDs ordenados, parâmetros, versão e contagens. |

### 11 · Matemática e estatística em Python (`matematica`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `vetores` | Observação, coordenada, dimensão, soma e produto escalar. | [1,2] · [3,4] → 11, mostrando os dois produtos. | Detectar tamanhos incompatíveis antes de usar zip. | Calcular soma ponderada com pesos [0.25,0.75] e valores [4,8] → 7. |
| `centro-e-dispersao` | Média, mediana, amplitude, desvio populacional e amostral. | Para [2,4,6], média=mediana=4, amplitude=4. | Introduzir extremo 100 e explicar mudança da média e da mediana. | Calcular stdev amostral de [2,4,6] → 2; explicar exigência de pelo menos dois valores. |
| `frequencia-e-probabilidade` | Contagem, proporção, espaço amostral e condição. | Em [A,A,B,B], frequência relativa de A → 0.5. | Dentro do grupo A com 1 acerto em 2, distinguir proporção condicional e conjunta. | Simular sorteios com semente, comparar frequência observada e probabilidade teórica e interpretar variação. |
| `precisao-e-escalas` | Representação binária, tolerância, unidade e centralização. | Comparar 0.1+0.2 com 0.3 usando isclose. | Centrar [2,4,6] pela média → [−2,0,2]. | Escalar pela amplitude com regra explícita para coluna constante; testar tolerância para ponto flutuante. |

### 12 · Computação com NumPy (`numpy`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `arrays` | ndarray, dtype, ndim, shape, linha e coluna. | Criar [[1,2],[3,4],[5,6]], informar shape (3,2). | Comparar primeira coluna extraída como (3,) e como (3,1). | Selecionar uma amostra mantendo duas dimensões e explicar a consequência. |
| `indexacao-e-mascaras` | Fatias, máscaras, views e cópias. | Filtrar [2,−1,5] com valores positivos → [2,5]. | Modificar fatia básica e observar a origem; repetir com copy. | Filtrar linhas por condição em uma coluna e preservar alinhamento dos respectivos IDs. |
| `eixos-e-broadcasting` | Operação elemento a elemento, agregação por eixo e alinhamento final das formas. | Média por coluna em [[1,2],[3,4]] → [2,3]. | Subtrair as médias por broadcasting → [[−1,−1],[1,1]]. | Demonstrar e corrigir incompatibilidade entre (3,2) e (3,) quando a intenção é centrar linhas. |
| `produto-matricial` | Distinguir * e @, compatibilidade de dimensões e interpretação de cada saída. | [[1,2],[3,4]] @ [2,1] → [4,10]. | Antecipar forma de (3,2) @ (2,1). | Reproduzir com laços uma pontuação por linha e comparar com np.allclose. |

### 13 · Tabelas com pandas (`pandas`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `ler-e-inspecionar` | Series, DataFrame, read_csv, shape, dtypes e amostra. | Ler mini-CSV com ids 001 e 002 como strings. | Observar perda de zeros se o id for inferido como inteiro. | Entregar inventário de linhas, colunas, tipos e unidades a partir do arquivo fornecido. |
| `selecionar-e-transformar` | loc por rótulo, iloc por posição, máscara e coluna derivada. | Filtrar viagens com distância ≥5 km. | Trocar índice por rótulos não consecutivos e explicar loc versus iloc. | Calcular minutos por km com política para distância zero e sem modificar o original. |
| `agregar` | Agrupamento, contagem de linhas, contagem não nula e agregações. | Agrupar A:2, A:4, B:3 → médias A=3, B=3. | Inserir valor ausente e comparar size e count. | Entregar tabela por grupo com denominadores explícitos e ordenação por chave. |
| `juntar-tabelas` | Chave, cardinalidade, left/inner merge e integridade. | Enriquecer viagens pela chave estacao, conservando o id da viagem. | Duplicar chave de estação; exigir falha com validate="many_to_one". | Preservar linhas de viagens e relatar chave sem par com indicator=True. |

### 14 · Auditoria e exploração (`exploracao`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `qualidade-dos-dados` | Esquema, tipos, intervalo válido, ausente, duplicata e unidade. | Identificar vazio, zero e duas linhas idênticas. | Distinguir repetição exata de conflito sob o mesmo id. | Produzir relatório de qualidade por regra e listar IDs afetados, sem ocultar linhas por exclusão silenciosa. |
| `distribuicoes` | Ordenar, quantis, figura e eixos de Matplotlib, histograma e assimetria. | Para [0,2,4,6,8], obter quartis 2,4,6 por interpolação linear; construir juntos fig/ax, histograma com eixos rotulados e salvar o PNG. | Alterar intervalos do histograma e explicar o que a aparência muda. | Entregar mediana, amplitude interquartil e histograma com eixos e unidades. |
| `relacoes` | Dispersão, correlação linear, exceções e interpretação. | Para x=[1,2,3], y=[2,4,6], obter r≈1. | Examinar coluna constante e discutir correlação indefinida. | Comparar dois gráficos e explicar por que correlação sozinha não prova causalidade. |
| `relatorio-visual` | Pergunta investigável, escolha de gráfico, legenda, texto alternativo e limites. | Retomar a figura com eixos de Matplotlib, adicionar unidades e salvar PNG. | Corrigir rótulo de unidade e gráfico que confunde contagem com proporção. | Entregar gráfico mais tabela numérica e duas frases sustentadas por números. Usar dados sintéticos de prática; no projeto, escolhas exploratórias usam apenas treino. |

### 15 · Preparação para machine learning (`preparacao-ml`)

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `observacao-atributo-alvo` | Pergunta de previsão, instante de decisão, unidade observacional, X e y. | Para prever duração antes da partida, separar distância planejada (X) e duração real (y). | Identificar id e horário de chegada real como colunas impróprias para X. | Escrever o contrato por coluna e conferir shapes (n,p) e (n,), alinhados pelos mesmos IDs. |
| `particoes` | Finalidade de treino, validação e teste; divisão aleatória, temporal e por grupo. | Ordenar 10 observações no tempo e separar primeiras 6, próximas 2, últimas 2. | Mostrar como repetição do mesmo evento nos dois lados infla a avaliação. | Escolher uma estratégia para observações futuras, provar disjunção e registrar fronteiras e ordem. |
| `ajustar-e-aplicar` | Ajuste aprende parâmetros do treino; aplicação reutiliza-os; faltantes e escala. | Treino [2,4,ausente,6] fornece mediana 4. | Preencher ausente em validação [100,ausente] com 4 e mostrar como usar a mediana local mudaria o resultado. | Implementar duas funções separadas, salvar parâmetros, tratar coluna constante e verificar que mudanças só no teste preservam os parâmetros. |
| `referencia-e-erro` | Referência constante, erro por observação, erro absoluto médio e unidade. | Usar mediana do alvo de treino [6,10,14] → previsão constante 10. | Para alvos [8,15] obter erros absolutos [2,5], MAE 3.5. | Escolher e documentar a referência usando treino, avaliá-la em validação e reservar teste para a avaliação final. |

### 16 · Projeto de conclusão (`projeto`)

Usar o conjunto e o contrato da seção 5. Cada aula inclui um ponto de partida restaurável e um gabarito do marco anterior. O projeto pode ser feito do começo ao fim como uma sequência ou retomado por módulo.

| Aula | Explicar nesta ordem | E1 | E2 | E3 |
|---|---|---|---|---|
| `auditar` | Requisito, dicionário de dados, integridade e rastreabilidade. | Ler os arquivos brutos e conferir contagem. | Encontrar duplicata e ausente sem confundi-los com zeros legítimos. | Produzir auditoria que justifique cada exclusão e permita reconstruir o conjunto limpo. |
| `preparar` | Regras fixas de qualidade, partições, ajuste de parâmetros e transformação. | Construir partições por data e confirmar IDs. | Somente no treino, simular uma previsão que copia minutos faturados → erro zero artificial, pois coincidem com o alvo. Explicar por que essa informação só existe após a chegada e excluí-la de X. | Exportar X, y, IDs e parâmetros com ordem, formas e valores de controle abaixo. |
| `interpretar` | Explorar treino, gerar referência, calcular MAE e interpretar limitações. | Resumir distribuição do alvo no treino. | Calcular à mão MAE de validação e conferir no código. | Congelar escolhas, avaliar teste uma vez e escrever relatório com gráfico e unidade. |
| `reproduzir` | Execução limpa, invariantes, alterações controladas e entrega a outro aluno. | Reiniciar kernel ou criar pasta limpa e reproduzir tudo com instruções. | Injetar um conflito de ID e comprovar erro explícito. | Entregar kit completo, executar a verificação de vazamento e explicar oralmente como um modelo futuro consumiria os artefatos. |

## 5. Contrato do projeto final e gabarito numérico

**Pergunta:** antes da partida, como preparar dados que poderão ajudar a estimar a duração de uma viagem? O aluno recebe um conjunto fictício, pequeno o bastante para conferir à mão. Nenhuma coleta externa. Um registro representa uma viagem. O sufixo do ID não informa a ordem de previsão, que vem da data. Neste conjunto há uma viagem válida por dia, e seu resultado já é conhecido antes do dia seguinte.

Fixture de referência em UTF-8, vírgula como separador, ponto decimal, célula vazia como ausente. `km_planejados` e `paradas_planejadas` são conhecidos antes da partida. `minutos_reais` é o alvo. `minutos_faturados` é calculado após a chegada e serve para discutir vazamento. A ordem das linhas brutas inclui uma duplicata no fim. Os arquivos completos têm cabeçalho.

```csv
id,data,estacao,km_planejados,paradas_planejadas,minutos_reais,minutos_faturados
V01,2026-01-01,A,2,0,6,6
V02,2026-01-02,B,4,1,8,8
V03,2026-01-03,A,,1,10,10
V04,2026-01-04,B,6,2,10,10
V05,2026-01-05,A,4,2,12,12
V06,2026-01-06,B,8,3,14,14
V07,2026-01-07,A,100,1,8,8
V08,2026-01-08,C,,0,15,15
V09,2026-01-09,B,5,2,18,18
V10,2026-01-10,A,9,3,22,22
V11,2026-01-11,A,-1,1,7,7
V04,2026-01-04,B,6,2,10,10
```

O segundo arquivo, `estacoes.csv`, tem colunas `estacao,nome` e linhas `A,Centro` e `B,Norte`. A chave C sem cadastro é deliberada. Nomes de estação enriquecem a auditoria. Os atributos preditivos finais são numéricos e têm ordem fixa.

1. **Auditar e limpar por regras declaradas.** Conservar o arquivo original. Ler IDs como texto e datas ISO como datas. Remover uma cópia de V04. Se duas linhas com mesmo ID divergirem, parar e apontar o conflito. Rejeitar V11 por distância negativa. Zero paradas é válido. Não remover V07 por parecer atípico. Validar alvo presente e não negativo. Resultado: 12 linhas brutas, 10 válidas, uma duplicata excedente, uma rejeitada. Há dois valores ausentes de km nas linhas válidas. Após left join, dez viagens e uma estação sem cadastro (V08).
2. **Separar antes de estimar parâmetros.** Ordenar por data e id. Treino V01–V06, validação V07–V08 e teste V09–V10. As três listas de IDs são disjuntas. Definir a previsão no instante anterior à partida e registrar a exclusão de alvo, faturamento, id, data e estação de X. Manter id/data separadamente para rastreio.
3. **Ajustar somente no treino.** A mediana dos km observados [2,4,6,4,8] é 4. Após preencher o ausente, mínimo=2 e máximo=8. Transformar km por `(km - minimo) / (maximo - minimo)`, sem recorte. Se todos os km de treino faltarem, rejeitar o ajuste com mensagem explicativa. Para treino de amplitude zero, definir a coluna escalada como zero ao aplicar e registrar a convenção. Manter contagem de paradas sem escala. A validação ou o teste podem produzir valores fora de [0,1]. Comparar numericamente com tolerância absoluta de 1e−6.
4. **Exportar e conferir.** Colunas de X na ordem `km_escalados,paradas_planejadas`. Formas de X por partição (6,2), (2,2), (2,2). y por partição (6,), (2,), (2,). V01 → [0,0], V03 → [1/3,1], V07 → [98/6,1], V08 → [1/3,0], V09 → [0.5,2], V10 → [7/6,3]. Cada arquivo de partição mantém o ID como chave auxiliar para reunir atributos e alvo sem embaralhar.
5. **Medir a referência.** Mediana de y no treino = 10 minutos. Uma previsão constante de 10 resulta em MAE de validação 3.5 e MAE de teste 10.0 minutos. Calcular a métrica a partir dos vetores. A amostra pequena limita qualquer generalização. Se o grupo comparar uma alternativa como a média, a escolha deve usar validação antes de abrir os alvos de teste. A resposta de referência obrigatória permanece a mediana. O CSV é público e pequeno. Na leitura, verificar mecanicamente a presença e o domínio dos alvos de teste, alinhá-los pelos IDs e gravá-los na partição reservada. Gerar os gráficos exploratórios e ajustar parâmetros com o treino. Usar validação para comparar alternativas. Interpretar os alvos de teste e calcular seu MAE somente depois de congelar as escolhas.
6. **Entregar.** Incluir README com ambiente, versões, origem sintética e execução; fontes ou notebook; `auditoria.json`; `parametros.json`; `treino.csv`, `validacao.csv` e `teste.csv` com id, os dois atributos e alvo; `relatorio.md` com métrica, gráfico, tabela e interpretação; testes. O navegador oferece download dos resultados e do notebook editável. No terminal, gerar saídas dentro de uma pasta de trabalho própria. Testar também dados desconhecidos: reordenar entrada, mudar somente km de teste, substituir alvo de teste e inserir id conflitante. Verificar parâmetros de treino idênticos nos três primeiros casos, alinhamento por id e erro explícito no último. Fazer ainda um controle específico da ordem temporal: trocar apenas as datas de V06 e V07 entre si. A última viagem do treino passa a ser V07; a validação passa a conter V06 e V08. No novo treino os km observados têm mediana 4 e máximo 100, e o alvo tem mediana 9. Este controle detecta soluções que ordenam pelo id e parecem corretas na amostra original.

**Rubrica do projeto, para autoavaliação ou revisão docente.** 20 pontos por critério: (a) auditoria com contagens, unidades e decisões rastreáveis, (b) separação temporal e disponibilidade das variáveis, (c) transformação com parâmetros persistidos e saídas verificadas, (d) métrica com referência, tabela, gráfico e limites, (e) reprodução em ambiente novo com casos de borda. Por critério, 20 = evidência completa, 10 = parcial, 0 = ausente ou contraditória. Pronto para ML a partir de 80/100, exigindo 20 em (b) e (c). Exemplo: um relatório impecável com mediana calculada antes da divisão precisa refazer a preparação. A rubrica é devolutiva pedagógica e a central continua calculando seu certificado pelas regras existentes.

## 6. Amostra de aula já especificada em detalhe

**Primeira execução, partindo do zero.** Começar com a pergunta “O que deverá aparecer se pedirmos ao Python para mostrar exatamente estas palavras?”. Apresentar editor, botão de executar e região de saída com rótulos textuais. Mostrar o bloco abaixo sem prompt. Ler a linha da esquerda para a direita: nome da função, abertura, argumento de texto, fechamento. Explicar por que as aspas delimitam o texto e não saem na tela.

```python
print("Olá, mundo!")
```

No caderno, rodar a célula com Shift+Enter. No terminal, salvar como `exemplo.py` e executar com o intérprete indicado na seção 2. Em ambos, uma linha com `Olá, mundo!`. Em E2, trocar apenas o conteúdo entre aspas por `Estou aprendendo`. Pedir a previsão, executar, comparar. Em E3, fornecer dois nomes fictícios de campos (“Nome: Lia” e “Meta: ler dados”), pedir duas linhas e aceitar tanto duas chamadas quanto outra solução que produza exatamente as mesmas linhas. O gabarito comentado usa duas chamadas, uma para cada informação. Uma pista aponta para a única linha do exemplo inicial e pergunta o que acontece quando ela é repetida com outro argumento.

**Diagnóstico em camadas.** Em uma caixa marcada como exemplo de erro, `prin("ola mundo)` não pode ser analisado por causa da string aberta. Fechar a string em `prin("ola mundo")` permite a análise e, numa sessão nova, revela `NameError` pelo nome incorreto. Por fim, `print("ola mundo")` produz `ola mundo`. O aluno identifica primeiro o erro encontrado pelo intérprete. O revisor confere os três trechos no material que aparece na tela. O gabarito não transforma o texto integral da mensagem de uma versão do Python em requisito.

**Exemplo intermediário, centrar linhas no NumPy.** Em E1 usar a matriz de duas linhas da aula `eixos-e-broadcasting` e pedir que o aluno marque quais números entram na média de cada coluna. Em E2 subtrair essas médias e conferir que cada coluna tem média zero. Em E3 fornecer `[[1,3],[4,8],[2,2]]` e pedir uma transformação em que **cada linha** passe a ter média zero. Antes de executar, o aluno prevê a forma da matriz (3,2) e do vetor de médias (3,). A tentativa de subtraí-los diretamente gera `ValueError` porque as últimas dimensões 2 e 3 são incompatíveis. A primeira pista pergunta qual dimensão deve ser preservada. O gabarito usa `a = np.array(dados, dtype=float)`, calcula `a.mean(axis=1, keepdims=True)` com forma (3,1) e subtrai o resultado de `a`. Saída esperada: linhas [−1,1], [−2,2], [0,0]. Aceitar também uma transformação equivalente que produza esses valores, preserve a forma e funcione com uma única linha.

**Exemplo do fim do curso.** Antes de apresentar números, desenhar no papel três caixas com os IDs de treino, validação e teste. Pedir ao aluno que calcule a mediana de km usando apenas a primeira caixa. Em seguida, fazê-lo preencher V08, revelar os valores da segunda caixa e prever se V07 pode resultar em número acima de 1. Por último, alterar um km de teste, refazer a execução e comparar `parametros.json`. A resposta precisa explicar por que os parâmetros permanecem idênticos mesmo quando uma linha de saída muda. Esse exercício avalia o entendimento do fluxo, além do cálculo.

## 7. Avaliações, prática e retenção

- Preservar a ordem E1/E2/E3 dentro da aula. A prática do módulo e o quiz personalizado usam sorteio do projeto. A prova da trilha seleciona 40 questões distribuídas pelos módulos. A conclusão segue as regras de `js/core/progress.js`: todas as aulas do módulo e melhor prática ≥60% (5 questões); certificado após todos os módulos e melhor prova ≥70%.
- Cada módulo entrega `questions.json` com 16 questões e `flashcards.json` com oito cartas. Por aula, quatro questões: prever uma saída ou estado; diagnosticar uma falha; completar ou interpretar um contrato; transferir a ideia para novos dados. Uma carta recupera um conceito e a outra pede efeito, caso-limite ou exemplo. Distribuir dificuldades 1–3; garantir pelo menos três tipos válidos por módulo. Para módulos de dados, pedir também interpretações de forma, denominador, unidade ou partição. Não exigir decorar o resultado do CSV final.
- Usar os tipos existentes `multiple`, `truefalse`, `fill` e `order`. Formular múltipla escolha com 3–5 alternativas plausíveis e uma única resposta correta, antes do embaralhamento. O corretor de lacunas compacta espaços internos e remove espaços externos. Usar lacunas de um token, com diferenciação de maiúsculas/minúsculas para identificadores Python. Testar espaços significativos em strings ou blocos pela execução ou por alternativas completas. Em `order`, o corretor remove espaços das extremidades das linhas. Aplicar somente a sequências de dependência inequívoca; avaliar indentação ou equivalência de programas por prática executável ou escolha entre blocos completos.
- Não criar pergunta de tipo `code` nem rotular Python como engine SQLite. A camada de perguntas da central não corrige código Python arbitrário. As práticas dos kits têm entradas e efeitos observáveis, testes de exemplo, pistas progressivas e solução explicada. A pessoa continua podendo concluir a leitura no navegador após praticar no próprio terminal.
- Mapa de recuperação: falhou no marco 04 → revisar laços, filtros e dicionários; no 08 → retorno, CSV, import e estado; no 12 → geradores, testes, vetores e eixos; no 16 → chaves, ausentes, partições e ajuste de parâmetros. Dar links diretos e uma entrada nova para a segunda tentativa. Reservar dados inéditos e cálculos curtos para verificar transferência.

## 8. Entregáveis e encaixe no repositório

| Entregável futuro | Convenção e responsabilidade |
|---|---|
| Catálogo e manifesto | Registrar `{"id":"python","dir":"python"}` em `content/catalog.json`. `content/python/language.json` segue o manifesto JavaScript: id, name, icon, color com contraste, highlight para Python, reference e modules. Sem campo engine. Cada módulo inclui id, dir, title, description, lessons. Cada aula inclui id, file, title e minutes. Manter IDs das quatro trilhas existentes. |
| Aulas e revisão rápida | Pastas `content/python/01-inicio/` até `16-projeto/`, sufixo igual ao ID do módulo. Em cada uma, quatro Markdown, banco e cartas com vínculos estáveis. Exemplo de chave `python.inicio.primeira-execucao`; primeira questão `python.inicio.q01`, primeira carta `python.inicio.f01`. Em questions.json usar a lista `questions`; em flashcards.json usar `cards`. Em cada item o campo `lesson` leva o ID curto da aula (por exemplo, `primeira-execucao`). A referência `referencia.md` indexa sintaxe, erros frequentes, ambientes, operações por eixo, ausentes, partições e links de retorno. |
| Materiais de prática | `content/python/praticas/<modulo>/<aula>.ipynb` e kit por módulo em `content/python/kits/<modulo>.zip`. O kit contém README, aulas em subpastas, exemplos, exercícios, dados iniciais e soluções separadas. Oferecer um kit integral com requisitos, fixtures e projeto. Publicar apenas arquivos didáticos selecionados, sem .venv, caches ou saídas pessoais. Usar links relativos à raiz estática do projeto que funcionem também sob o prefixo do Pages. |
| Fonte dos exemplos | Manter uma fonte canônica dos exemplos, entradas, dados e critérios, por exemplo em `verify/python/<modulo>/<aula>/` com `cases.json` e scripts. Gerar blocos/células e pacote ou conferir igualdade literal da fonte com código copiável no Markdown e no notebook. Classificar exemplos como completos, parciais contextualizados ou erro intencional. A suíte só executa artefatos próprios identificados explicitamente. |
| Testes e publicação | Validar o manifesto e os bancos pelo validador atual. Conferir o carregamento das 64 aulas, integração com quiz/flashcards/prova/certificado e presença dos downloads no artefato Pages. Adicionar ao workflow futuro um job com a versão homologada de CPython e as dependências fixadas. `npm test` continua cobrindo a aplicação. A publicação da parte Python depende também das novas verificações. |

A interface mínima reaproveita links e detalhes recolhíveis nas aulas Markdown. O Markdown é inserido na página da central. Usar, por exemplo, `content/python/praticas/inicio/primeira-execucao.ipynb` relativo ao index da central; disponibilizar o caderno com link de download explícito para que o clique não apenas mostre o JSON. O ZIP de módulo precisa funcionar a partir de qualquer aula desse módulo. Em cada aula, mostrar claramente os nomes dos dois percursos, os arquivos necessários, o resultado que o aluno deverá observar e como voltar à central. Quem usa teclado deve conseguir selecionar os ambientes, copiar o código e abrir a solução. Em 390 px, código e tabelas rolam internamente. Figuras têm unidades, descrição textual e tabela equivalente, e o significado não depende apenas de cores.

## 9. Verificação e roteiro para GPT-6.2 Sol (esforço alto)

**Primeiro validar o percurso mais arriscado.** Antes de escrever dezenas de aulas, montar uma fatia vertical com primeiro print, entrada digitada, CSV multiarquivo, import local, teste com unittest, gráfico e preparação de dados. Rodar no CPython de referência e em uma sessão limpa de JupyterLite no navegador real; um teste de notebook executado apenas em CPython não comprova compatibilidade com Pyodide. Confirmar a disponibilidade de dependências e como reiniciar, carregar e baixar arquivos. Registrar resultado, versões e ambiente; corrigir a distribuição ou o roteiro antes de ampliar.

| Ordem futura | Construção | Critério para seguir |
|---|---|---|
| 1 · Contratos e piloto | Manifesto de demonstração, fontes de exemplos, notebooks, ZIP, casos de teste e execução nos dois percursos. | Um iniciante parte do link de aula ou de uma pasta limpa e chega à saída correta com documentação suficiente. |
| 2 · Etapa fundamental | Produzir 01–04 em sequência. Revisar cada módulo e conferir o primeiro marco sem cola. | Soluções produzem saídas ensinadas; questões aceitam formas válidas e nunca confundem texto, número ou zero ausente. |
| 3 · Programação intermediária | 05–08, arquivos isolados, projetos multiarquivo e equivalentes do terminal no caderno. | Rodar duas vezes com mesma entrada e comparar o resultado. Importar módulos sem iniciar I/O interativo incidental. |
| 4 · Python avançado e matemática | 09–12, incluindo testes, casos-limite e comparação das soluções com e sem biblioteca. | Demonstrar esgotamento, limpeza após exceção, dimensão, tolerância e eixos. |
| 5 · Dados e projeto | 13–16, dataset, rubrica, solução de referência, exemplo alterado e material de recuperação. | Reproduzir as contagens, formas, parâmetros e MAEs da seção 5 nos dois percursos. |
| 6 · Integração final | Concluir referência, links, revisão da interface, documentação do catálogo e verificação de publicação. | Todas as aulas, questões e cartas acessíveis e progressão anterior preservada. Registrar parecer por módulo e resolver incorreções antes de integrar a trilha. |

**Matriz mínima de aceite:**

- Por aula: abrir diretamente; preparar em ambiente limpo; executar E1, E2 e E3 na ordem com as entradas documentadas; repetir com a variação ou caso de borda; conferir se a solução recolhível responde ao enunciado. Distinguir execuções de referência automatizadas de percursos manuais realmente realizados. Não contar observação de erro intencional como falha do conjunto.
- Por módulo: conferir 4 aulas, 12 atividades, 16 questões, 8 cartas, IDs e links. Comparar arquivos do ZIP com as fontes e conferir notebooks sem estado residual nem saídas precalculadas que escondam falhas. Provar que o aluno pode retomar sem carregar variáveis de outra aula. Exercícios sem solução preenchida precisam de transição clara para o gabarito.
- Automação: executar exemplos aprovados via processo Python com entrada/saída capturadas, UTF-8, diretório temporário, tempo limite e dados locais. Para exceções comparar classe e condição. Para floats usar tolerância; para tabelas comparar valores, tipos e ordem apenas quando parte do contrato; para gráficos inspecionar dados, títulos, eixos e existência do PNG legível. Em notebooks, validar formato e executar o percurso resolvido desde o início. Gravar versões e combinar este resultado com verificações reais do kernel no navegador.
- Integração: testar aluno novo e perfil com progresso existente. Abrir a trilha e aula por hash, concluir, conferir XP/cartas, repetir prática e abrir prova de 40 questões. Simular laboratório indisponível, retorno ao site e acesso ao kit local. Validar downloads do prefixo `/Aprendendo-linguagens/`, navegação por teclado e telas pequenas. Fazer smoke test de aula fundamental e de dados em Chromium e Firefox, e executar o kit no Windows, no Linux e no macOS, com o procedimento correspondente a cada sistema, antes de declarar suporte a esses ambientes.
- Revisão didática: acionar `revisor_didatico` conforme o protocolo de revisão em `AGENTS.md` na raiz do projeto com diff, objetivo, ambientes e versões. O parecer cobre explicações, código realmente mostrado, soluções, alternativas e portabilidade. Registrar evidências, limitações e nova conferência dos pontos corrigidos. A aprovação da especificação orienta a execução futura; os resultados dos testes do produto devem ser coletados na implementação.

## 10. Referências primárias para autores e revisores

| Uso na trilha | Referências |
|---|---|
| Módulos 01–06 e 08–10, sintaxe e biblioteca padrão | [Tutorial oficial em português](https://docs.python.org/pt-br/3.14/tutorial/), [funções embutidas](https://docs.python.org/3.14/library/functions.html), [CSV](https://docs.python.org/3.14/library/csv.html), [dataclasses](https://docs.python.org/3.14/library/dataclasses.html), [unittest](https://docs.python.org/3.14/library/unittest.html) |
| Instalação, ambiente e reprodução | [Downloads do Python](https://www.python.org/downloads/), [guia de ambientes virtuais da PyPA](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/), [venv](https://docs.python.org/3.14/library/venv.html) |
| Prática no navegador | [arquivos do caderno e do kernel no JupyterLite](https://jupyterlite.readthedocs.io/en/stable/howto/content/python.html), [upload e download no JupyterLab](https://jupyterlab.readthedocs.io/en/stable/user/files.html), [pacotes em Pyodide](https://pyodide.org/en/stable/usage/loading-packages.html), [limites do runtime WebAssembly](https://pyodide.org/en/stable/usage/wasm-constraints.html) |
| Matemática e análise | [statistics](https://docs.python.org/3.14/library/statistics.html), [fundamentos NumPy](https://numpy.org/doc/stable/user/absolute_beginners.html), [tutoriais pandas](https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html), [guia Matplotlib](https://matplotlib.org/stable/users/explain/quick_start.html) |
| Fundamentos para ML | [Armadilhas e vazamento de dados, scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html), [avaliação e métricas](https://scikit-learn.org/stable/modules/model_evaluation.html) |

As fontes orientam a redação de exemplos próprios em português. Ao implementar, associar cada aula aos trechos relevantes da documentação e à versão homologada. Manter CPython, kernel do navegador e dependências identificáveis no material publicado.
