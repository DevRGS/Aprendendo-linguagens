# Central de Linguagens — Especificação de Design (Fase 1)

- **Data:** 2026-10-11
- **Status:** aprovado em conversa, aguardando revisão desta especificação escrita
- **Nome do produto:** "Central de Linguagens" é um nome provisório. Ele aparece em um único lugar no código (`js/config.js`) e pode ser trocado a qualquer momento.

---

## 1. Propósito

Uma central gratuita e didática para ensinar várias linguagens de programação (Java, JavaScript, SQL, Go, PHP e outras no futuro), inspirada no trabalho de Gustavo Guanabara de abrir portas para quem está começando. O material **não tem fins comerciais**.

O público inclui **iniciantes que começam do zero**: a linguagem é acessível e a progressão, gradual. Quem já programa também consegue usar a central, pulando conteúdo e ativando flashcards diretamente.

### O que a pessoa consegue fazer
1. Estudar cada linguagem em **módulos** divididos em **aulas curtas**.
2. Ter um **perfil** com progresso, estatísticas, sequência de dias, meta diária, XP, níveis, conquistas, histórico e certificado.
3. Revisar sempre com **flashcards** e repetição espaçada.
4. Testar o conhecimento com **perguntas aleatórias**, escolhendo o escopo: um tema de uma linguagem, uma linguagem inteira ou várias linguagens.
5. Não perder o progresso, graças ao **backup** manual e automático.

### Critérios de sucesso da Fase 1
- A plataforma completa funciona publicada no GitHub Pages, com o Java como primeira linguagem.
- O conteúdo de Java foi migrado do arquivo atual, dividido em aulas curtas, **conferido** e ampliado com os quatro tipos de pergunta.
- Todos os testes de regras e o validador de conteúdo passam, e a publicação só acontece se passarem.
- O progresso sobrevive a fechar o navegador, pode ser exportado e importado, e no Chrome/Edge de computador é gravado automaticamente num arquivo escolhido pela pessoa.

---

## 2. Decisões tomadas

| Tema | Decisão |
|---|---|
| Quem usa / onde fica o progresso | Cada pessoa no próprio navegador. Sem login, sem servidor, um perfil por navegador. |
| Distribuição | Site estático no **GitHub Pages**. |
| Tecnologia | **JavaScript puro** em módulos ES, sem etapa de build e sem framework. |
| Tipos de pergunta | Múltipla escolha, verdadeiro ou falso, lacuna e ordenar linhas (Fase 1). Código executável fica para a **Fase 2**. |
| Perfil | Estatísticas, constância (sequência + meta), gamificação (XP, níveis, conquistas), histórico e certificado. |
| Backup | **Camada 2** (arquivo automático no Chrome/Edge de computador) e **camada 3** (exportar e importar, com lembrete). A camada 1 (armazenamento persistente + PWA) ficou **de fora** por escolha. |
| Java pesado demais na Fase 2 | Se a execução de Java no navegador se mostrar inviável, o Java fica só com teoria, exercícios e flashcards. |
| Idioma e visual | Português do Brasil, com o tema escuro atual. Cada linguagem tem sua cor de destaque. |

### Fases do projeto
1. **Fase 1 (esta especificação):** a plataforma completa e o Java migrado e conferido.
2. **Fase 2:** exercícios com código executado no navegador, cada linguagem como uma integração separada. JavaScript (nativo) e SQL (sql.js/SQLite em WebAssembly) primeiro; depois PHP (php-wasm) e Go (Yaegi em WebAssembly); por último Java (CheerpJ rodando o `javac`), precedido de um teste de viabilidade. A correção compara a saída impressa pelo programa com a saída esperada. Terá uma especificação própria.
3. **Fases 3 em diante:** conteúdo de cada linguagem nova (JavaScript, SQL, Go, PHP...), uma por ciclo e sempre no formato definido aqui.

### Fora do escopo da Fase 1
Execução de código, conteúdo das outras linguagens, contas e sincronização, tema claro, salvar quiz interrompido, juntar dois backups e migrar o progresso salvo pelo `java-crash-course.html` antigo. Esse progresso não é migrado porque fica preso a outro endereço e porque as cartas antigas eram identificadas pela posição na lista.

---

## 3. Arquitetura

### 3.1 Hierarquia do conteúdo
**Linguagem → Módulo (o "tema") → Aulas curtas.** O progresso é registrado **por aula**. As perguntas e os flashcards pertencem ao módulo e apontam para a aula de origem.

### 3.2 Estrutura de pastas
```
index.html                 casca única do app
.nojekyll                  impede o GitHub Pages de processar os arquivos
package.json               {"type":"module"}, sem dependências; script "test": "node --test"
css/
  tokens.css               cores, fontes, espaçamentos (cor de destaque por linguagem)
  base.css
  components.css
js/
  config.js                nome do produto, chaves de armazenamento, constantes
  main.js                  inicialização
  router.js                rotas por hash
  core/                    REGRAS PURAS: sem DOM, sem fetch, sem localStorage; testáveis no Node
    dates.js               "dia local" (YYYY-MM-DD), diferença entre dias
    srs.js                 repetição espaçada (Leitner)
    grading.js             correção dos 4 tipos de pergunta
    quiz.js                sorteio de perguntas por escopo
    progress.js            aula/módulo/linguagem concluídos
    stats.js               acertos, pontos fracos, atividade
    gamification.js        XP, níveis, sequência, meta, conquistas
    state.js               estado inicial, validação, migrate()
    backup-format.js       envelope do arquivo de backup e sua validação
  data/
    content.js             carrega catalog/language/aulas/perguntas/cartas (fetch + cache em memória)
    storage.js             leitura e gravação no localStorage (debounce, flush, evento storage)
    backup.js              exportar, importar, desfazer importação, arquivo automático (File System Access + IndexedDB)
  ui/
    store.js               estado em memória + assinatura de mudanças
    markdown.js            marked + highlight.js + alertas estilo GitHub + botão copiar
    views/                 uma tela por arquivo
    components/            peças reaproveitáveis
content/
  catalog.json             lista de linguagens
  achievements.json        textos das conquistas (nome, descrição, dica, ícone)
  java/
    language.json
    referencia.md          referência rápida (o antigo cheat sheet)
    01-introducao/
      01-o-que-e-java.md
      ...
      questions.json
      flashcards.json
    02-fundamentos/ ...
tests/
  core/*.test.js           testes das regras
  content.test.js          validador de conteúdo
.github/workflows/pages.yml  testes e, se passarem, publicação no Pages
docs/superpowers/specs/    este documento
```

### 3.3 Regras de dependência
- `core/` não importa nada de `data/` nem de `ui/`. As funções recebem tudo por parâmetro (estado, conteúdo, data de "hoje", fonte de aleatoriedade) e devolvem resultados novos. Assim podem ser testadas no Node sem navegador.
- `data/` conversa com o navegador (fetch, localStorage, IndexedDB, File System Access) e não contém regras de negócio.
- `ui/` monta a tela, chama `core/` para decidir e `data/` para carregar ou salvar.

### 3.4 Navegação
Rotas por hash, porque o GitHub Pages não faz o redirecionamento que um app de página única exigiria:

| Rota | Tela |
|---|---|
| `#/` | Início: anel da meta do dia, sequência, "continuar de onde parou", cartas pendentes, linguagens com progresso, pontos fracos |
| `#/:lang` | Linguagem: módulos e aulas com progresso, prática de cada módulo, prova, certificado, "Ativar todas as cartas deste módulo" |
| `#/:lang/:modulo/:aula` | Aula: conteúdo, anterior/próxima, "Concluir aula" |
| `#/:lang/:modulo/pratica` | Prática do módulo |
| `#/:lang/referencia` | Referência rápida da linguagem |
| `#/:lang/prova` | Prova da linguagem |
| `#/:lang/certificado` | Certificado (página pensada para impressão) |
| `#/quiz` | Montar e fazer um quiz personalizado; o resultado aparece na mesma tela |
| `#/flashcards` | Painel e sessão de flashcards |
| `#/perfil` | Estatísticas, calendário de atividade, conquistas, histórico |
| `#/config` | Nome, avatar, meta, backup, zerar progresso |
| qualquer outra | "Página não encontrada", com link para o início |

Layout: no computador, cabeçalho (anel da meta, sequência, nível e avatar) e menu lateral (Início, Linguagens, Quiz, Flashcards com o número de pendentes, Perfil, Config). No celular, uma barra de abas fixa embaixo.

### 3.5 Bibliotecas externas
Carregadas de CDN com **versão fixa**, sem dependências instaladas:
- **marked 12.0.2**: Markdown para HTML.
- **highlight.js 11.9.0**: destaque de código de Java, JavaScript, SQL, Go e PHP.

Antes de fixar, o plano de implementação confere se essas versões estão disponíveis na CDN escolhida.

### 3.6 Segurança da exibição
O conteúdo em `content/` é do próprio projeto e é exibido como HTML (gerado a partir do Markdown). **Dados da pessoa ou vindos de um arquivo importado** (nome, por exemplo) são sempre inseridos como texto (`textContent`), nunca como HTML. Isso impede que um arquivo de backup adulterado injete código na página.

---

## 4. Formato do conteúdo

### 4.1 `content/catalog.json`
```json
{ "languages": [ { "id": "java", "dir": "java" } ] }
```

### 4.2 `content/<lang>/language.json`
```json
{
  "id": "java",
  "name": "Java",
  "color": "#f89820",
  "icon": "☕",
  "highlight": "java",
  "reference": "referencia.md",
  "modules": [
    {
      "id": "fundamentos",
      "dir": "02-fundamentos",
      "title": "Fundamentos",
      "description": "Tipos, variáveis, operadores, controle de fluxo, loops e arrays.",
      "lessons": [
        { "id": "tipos", "file": "02-tipos.md", "title": "Tipos primitivos", "minutes": 8 }
      ]
    }
  ]
}
```
O identificador completo de uma aula é `<lang>.<modulo>.<aula>`, por exemplo `java.fundamentos.tipos`.

### 4.3 Aulas (Markdown)
- Markdown comum, com blocos de código na linguagem do arquivo `language.json` (`highlight`).
- Alertas no estilo GitHub, exibidos com as cores atuais do site: `> [!NOTE]` (azul), `> [!TIP]` (verde), `> [!IMPORTANT]` (roxo), `> [!WARNING]` (laranja), `> [!CAUTION]` (vermelho).
- Todo bloco de código ganha um botão "copiar".

### 4.4 `questions.json` (um por módulo)
```json
{ "questions": [ ... ] }
```
Campos comuns a todos os tipos:

| Campo | Obrigatório | Descrição |
|---|---|---|
| `id` | sim | `<lang>.<modulo>.q<NN>`, único em todo o site |
| `type` | sim | `multiple`, `truefalse`, `fill` ou `order` (o `code` é reservado para a Fase 2 e recusado na Fase 1) |
| `difficulty` | sim | 1 (fácil), 2 (médio) ou 3 (difícil) |
| `lesson` | sim | id local de uma aula existente do mesmo módulo |
| `prompt` | sim | enunciado em Markdown |
| `explanation` | sim | explicação em Markdown, mostrada depois da resposta |

Campos de cada tipo:

**`multiple`**: `options` (de 3 a 5 textos em Markdown) e `answer` (índice da única correta). As opções são embaralhadas a cada exibição. Opções que só fazem sentido na ordem original são **proibidas**; o validador rejeita textos que casem com `/todas as (anteriores|alternativas)|nenhuma das (anteriores|alternativas)/i`.

**`truefalse`**: `answer` (`true` ou `false`).

**`fill`**: `code` (texto com uma ou mais lacunas `___`) e `blanks` (uma lista por lacuna, com as respostas aceitas). Por exemplo, `[["of"]]` ou `[["String[] args", "String... args"]]`. Opcional: `caseInsensitive: true`, útil em SQL, onde as palavras-chave não diferenciam maiúsculas. A correção remove espaços nas pontas e troca sequências de espaços por um só; por padrão **diferencia maiúsculas de minúsculas**. A quantidade de `___` precisa ser igual ao tamanho de `blanks`.

**`order`**: `lines` (no mínimo 3, já na ordem correta no arquivo). Na tela, as linhas aparecem **sem o recuo inicial**, para que a indentação não entregue a resposta, e embaralhadas, numa ordem sempre diferente da correta. A correção compara o **texto** de cada linha (sem recuo), não a posição original; linhas idênticas são intercambiáveis. Ao mostrar a resposta, as linhas aparecem com o recuo original. A interação é tocar numa linha e usar ↑/↓, com suporte a teclado. No computador, também é possível arrastar.

Exemplos:
```json
{ "id": "java.fundamentos.q01", "type": "multiple", "difficulty": 1, "lesson": "operadores",
  "prompt": "Qual é a saída de `System.out.println(7 / 2);`?",
  "options": ["3.5", "3", "4", "Erro de compilação"], "answer": 1,
  "explanation": "Divisão entre dois `int` descarta a parte decimal: 7 / 2 = 3." }

{ "id": "java.fundamentos.q02", "type": "truefalse", "difficulty": 1, "lesson": "tipos",
  "prompt": "`String` é um tipo primitivo em Java.", "answer": false,
  "explanation": "`String` é uma classe. Os primitivos são 8: `byte`, `short`, `int`, `long`, `float`, `double`, `char` e `boolean`." }

{ "id": "java.colecoes.q05", "type": "fill", "difficulty": 2, "lesson": "listas",
  "prompt": "Complete para criar uma lista imutável com os elementos \"a\" e \"b\":",
  "code": "List<String> l = List.___(\"a\", \"b\");", "blanks": [["of"]],
  "explanation": "`List.of()` (Java 9+) cria uma lista que não aceita modificações." }

{ "id": "java.introducao.q09", "type": "order", "difficulty": 1, "lesson": "primeiro-programa",
  "prompt": "Coloque as linhas na ordem correta:",
  "lines": ["public class Ola {", "    public static void main(String[] args) {",
            "        System.out.println(\"Olá!\");", "    }", "}"],
  "explanation": "A classe envolve o método `main`, que envolve a instrução." }
```

### 4.5 `flashcards.json` (um por módulo)
```json
{ "cards": [
  { "id": "java.fundamentos.f03", "lesson": "operadores",
    "front": "Qual a diferença entre `i++` e `++i`?",
    "back": "`i++` usa o valor atual e depois incrementa; `++i` incrementa antes de usar." }
] }
```
`id` no formato `<lang>.<modulo>.f<NN>`. `front` e `back` aceitam Markdown.

### 4.6 `content/achievements.json`
Textos das conquistas (`id`, `name`, `description`, `hint`, `icon`). As **regras** de cada conquista ficam em `core/gamification.js`, identificadas pelo mesmo `id`.

### 4.7 Quantidade mínima por módulo (verificada pelo validador)
- Pelo menos **12 perguntas**, cobrindo pelo menos **3 dos 4 tipos**.
- Pelo menos **8 flashcards**.

---

## 5. Quiz, prática e provas

### 5.1 Modos
| Modo | Escopo | Quantidade | Correção | Efeito |
|---|---|---|---|---|
| **Prática do módulo** | o módulo | 5 (ou todas, se houver menos) | depois de cada resposta | a melhor nota fica salva em `modules[id].bestPractice`; entra no histórico |
| **Quiz personalizado** | escolhido pela pessoa | 10, 20, 30 ou 50 (limitado ao disponível, com aviso) | *Estudo* (a cada resposta) ou *Simulado* (no final, com cronômetro opcional que mostra o tempo decorrido) | entra no histórico |
| **Prova da linguagem** | todos os módulos da linguagem | 40 (ou o disponível) | Simulado, mostrando o tempo decorrido, sem limite de tempo | aprovação com ≥ 70%; a melhor nota fica em `exams[lang]`; entra no histórico. Pode ser feita a qualquer momento |

Opções do quiz personalizado:
- **Escopo:** árvore de caixinhas linguagem → módulos, com os atalhos "<Linguagem> inteira", "Tudo" e "Só o que já estudei" (módulos com pelo menos uma aula concluída).
- **Filtros:** dificuldade (1, 2, 3) e tipos de pergunta, todos marcados por padrão.
- **Modo:** Estudo ou Simulado.
- **"Focar nos meus pontos fracos"**, desligado por padrão.

### 5.2 Algoritmo de sorteio (`core/quiz.js`)
Assinatura: `selectQuestions({ pool, scope, count, filters, questionStats, lastQuizIds, focusWeak, today, rng })`.
1. **Filtrar** o banco por escopo, dificuldade e tipo.
2. **Dividir a quantidade entre as linguagens** do escopo que ainda têm perguntas depois do filtro, por igual. Depois, **dentro de cada linguagem, dividir entre os módulos** escolhidos, também por igual. Sobras da divisão são distribuídas por sorteio. Se um módulo tiver menos perguntas que a sua cota, o que faltar passa para os módulos que têm sobra, primeiro da mesma linguagem e depois das outras.
3. **Sortear dentro de cada módulo, sem repetição e com pesos.** Valores iniciais, ajustáveis:
   - nunca vista: peso 3
   - última resposta errada: peso 3 (5 com "focar nos pontos fracos")
   - última resposta certa: peso 1 (0,5 se foi há menos de 3 dias)
   - presente no quiz anterior: peso multiplicado por 0,2
4. **Embaralhar** a ordem das perguntas e as opções.

`rng` é uma função que devolve um número em [0, 1). Nos testes, é uma sequência fixa.

### 5.3 Efeitos de cada resposta
- `questions[id]` é atualizado: `seen`, `correct`, `lastDay`, `lastOk`.
- **Erro:** a pergunta entra em `mistakes`, se ainda não estiver lá.
- **Acerto de uma pergunta que está em `mistakes`:** a pergunta sai da lista e `counters.mistakesFixed` aumenta.
- **XP:** veja a seção 7.3.

### 5.4 Tela de resultado
Nota, porcentagem e tempo; barras de desempenho por linguagem e por módulo; revisão das erradas (resposta da pessoa, resposta certa, explicação e o link "revise esta aula"); botões **"Refazer só as erradas"** e **"Treinar erros nos flashcards"**.

### 5.5 Quiz interrompido
Um quiz interrompido não é salvo. Ao sair de um quiz em andamento, o site pede confirmação ("o progresso deste quiz será perdido").

---

## 6. Flashcards e repetição espaçada

### 6.1 Leitner com 7 níveis (`core/srs.js`)
| Nível | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Intervalo (dias) | 0 | 1 | 3 | 7 | 14 | 30 | 60 |

- **Errei (1):** a carta vai para o nível 0, vence hoje e **reaparece no fim da sessão**, até 2 vezes por sessão.
- **Difícil (2):** o nível não muda e a carta vence em `hoje + max(1, floor(intervalo[nível] / 2))`.
- **Fácil (3):** o nível sobe um (até no máximo 6) e a carta vence em `hoje + intervalo[novo nível]`.
- **Dominada:** nível ≥ 5.
- Estado de cada carta: `{ box, due, reviews, lapses }`, em que `lapses` conta quantas vezes a pessoa marcou "Errei".

### 6.2 Liberação das cartas
Uma carta passa a existir para a pessoa (nível 0, vencendo hoje) quando **a aula dela é concluída** ou quando a pessoa usa **"Ativar todas as cartas deste módulo"** (`modules[id].cardsActivated = true`).

### 6.3 Modos
- **Revisão do dia:** cartas vencidas de todas as linguagens. O número aparece no menu.
- **Filtro:** a mesma árvore de escopo do quiz.
- **Estudo livre:** todas as cartas liberadas do escopo, em ordem aleatória. **Não altera o agendamento e não dá XP.**
- **Meus erros:** refaz a pergunta original, no tipo dela. Se acertar, a pergunta sai de `mistakes`; se errar, continua.

### 6.4 Interação
Tocar na carta ou apertar Espaço vira a carta. As teclas 1, 2 e 3 escolhem Errei, Difícil e Fácil. No fim, um resumo da sessão. Com a preferência "reduzir movimento" do sistema, a animação de virar é desligada.

---

## 7. Perfil, progresso e gamificação

### 7.1 Primeira visita
A pessoa informa o **nome** (obrigatório, até 60 caracteres), escolhe um **avatar** (um emoji de uma lista fixa) e a **meta diária**. Tudo pode ser editado em `#/config`.

### 7.2 Regras de progresso (`core/progress.js`)
- **Aula concluída:** a pessoa clica em "Concluir aula". Isso grava `lessons[id].doneAt` e libera as cartas da aula.
- **Módulo concluído:** todas as aulas concluídas **e** `bestPractice ≥ 0,6`.
- **Linguagem concluída:** todos os módulos concluídos **e** `exams[lang].best ≥ 0,7`. Isso libera o certificado.
- **Porcentagem da linguagem:** aulas concluídas ÷ total de aulas.

### 7.3 XP (`core/gamification.js`)
| Ação | XP | Limite |
|---|---|---|
| Concluir uma aula | 20 | uma vez por aula |
| Acertar uma pergunta | 5 × dificuldade (5, 10 ou 15) | uma vez por pergunta por dia (`questions[id].xpDay`) |
| Revisar uma carta vencida (Revisão do dia ou filtro) | 2 | uma vez por carta por dia; reaparições na mesma sessão não contam |
| Concluir um módulo | 50 | uma vez por módulo |
| Ser aprovado na prova | 200 | só na primeira aprovação |

O XP total fica em `xp.total` e o XP de cada dia em `xp.byDay`, que guarda os últimos 400 dias.

### 7.4 Níveis
- Para passar do nível N ao N+1 são necessários **100 × N** de XP. O total acumulado para chegar ao nível L é **50 × L × (L − 1)**: nível 2 com 100, nível 5 com 1.000, nível 10 com 4.500.
- Títulos: **Iniciante** (1–4), **Aprendiz** (5–9), **Praticante** (10–14), **Especialista** (15–19), **Referência** (20+).

### 7.5 Constância
- **Sequência:** só conta dia com **estudo de verdade** (concluir aula, responder pergunta ou revisar carta). Se `lastDay` for ontem, soma 1; se for hoje, não muda; se for outro dia, volta a 1. `best` guarda o recorde.
- **Meta diária:** Leve (20 XP), Normal (50 XP) ou Intenso (100 XP). O anel no cabeçalho mostra `xp.byDay[hoje] / meta`.
- **Dia local:** todas as datas usam o calendário local da pessoa (`YYYY-MM-DD`), nunca UTC.

### 7.6 Estatísticas (`core/stats.js`)
- **Por linguagem:** porcentagem de aulas, módulos concluídos, acerto (soma de `correct` ÷ soma de `seen` das perguntas da linguagem) e cartas dominadas.
- **Pontos fracos:** os 3 módulos com menor acerto, entre os que têm pelo menos 5 respostas, com os botões "Revisar aula" (a aula com mais erros) e "Quiz focado" (quiz personalizado já configurado para o módulo, com foco nos pontos fracos).
- **Calendário de atividade:** as últimas 12 semanas, com a intensidade da cor proporcional ao XP do dia.
- **Totais:** perguntas respondidas, acerto geral, cartas revisadas e dias estudados.

### 7.7 Conquistas
As regras ficam em `core/gamification.js` e são avaliadas depois de cada ação. Os textos ficam em `content/achievements.json`.

| id | Nome | Condição |
|---|---|---|
| `primeiros-passos` | Primeiros passos | concluir a 1ª aula |
| `modulo-na-conta` | Módulo na conta | concluir o 1º módulo |
| `formatura` | Formatura | concluir uma linguagem |
| `gabaritou` | Gabaritou | 100% num quiz ou prova com ≥ 10 perguntas |
| `centena` | Centena | 100 perguntas respondidas |
| `mil-respostas` | Mil respostas | 1.000 perguntas respondidas |
| `sequencia-7` | Uma semana firme | sequência de 7 dias |
| `sequencia-30` | Um mês firme | sequência de 30 dias |
| `sequencia-100` | Cem dias | sequência de 100 dias |
| `meta-7` | Meta cumprida | bater a meta diária em 7 dias, seguidos ou não |
| `poliglota` | Poliglota | concluir aulas em 3 linguagens diferentes |
| `na-ponta-da-lingua` | Na ponta da língua | 1ª carta dominada |
| `memoria-de-elefante` | Memória de elefante | 100 cartas dominadas |
| `revisor` | Revisor | 500 revisões de cartas |
| `persistente` | Persistente | corrigir 20 perguntas de "Meus erros" |
| `simulado-de-respeito` | Simulado de respeito | ≥ 80% num Simulado com ≥ 20 perguntas |
| `coruja` | Coruja | estudar entre 0h00 e 4h59 |
| `madrugador` | Madrugador | estudar entre 5h00 e 6h59 |
| `seguro-morreu-de-velho` | Seguro morreu de velho | primeiro backup exportado ou backup automático ativado |
| `subindo-de-nivel` | Subindo de nível | chegar ao nível 5 |
| `dois-digitos` | Dois dígitos | chegar ao nível 10 |

As conquistas bloqueadas aparecem em cinza, com a dica de como conseguir. Ao desbloquear uma, aparece um aviso na tela.

### 7.8 Histórico
Cada quiz, prática e prova grava `{ id, at, mode, scope, total, correct, durationSec, wrongIds }`. O histórico guarda os **200 mais recentes**. Clicar num item mostra o resumo e permite "Refazer só as erradas". As perguntas são remontadas a partir do conteúdo atual; as que não existem mais são ignoradas.

### 7.9 Certificado
- Disponível quando a linguagem está concluída.
- Mostra: nome da pessoa, linguagem, data de conclusão, lista de módulos, nota da prova, **carga horária aproximada** (soma dos minutos das aulas, arredondada para cima em horas) e um **código** `CL-<LANG>-<8 hex>`, os 8 primeiros hexadecimais do SHA-256 de `nome|lang|dataDeConclusão`.
- A **data de conclusão** é a data em que a última condição foi cumprida: a mais recente entre `exams[lang].passedAt` e os `completedAt` dos módulos.
- Rodapé fixo: *"Certificado de estudo livre, emitido localmente."*
- Tem estilo próprio para impressão (`@media print`), e o botão "Imprimir / salvar PDF" chama `window.print()`.

---

## 8. Dados salvos e backup

### 8.1 Armazenamento
- **Estado:** no `localStorage`, na chave `central-linguagens:state`, em JSON.
- **Atalho do arquivo de backup automático:** no IndexedDB (banco `central-linguagens`, store `handles`), porque o navegador não permite guardar esse atalho em JSON.

### 8.2 Formato do estado (versão 1)
```js
{
  schema: 1,
  profile:   { name, avatar, dailyGoal, createdAt },
  lessons:   { "<lang>.<mod>.<aula>": { doneAt } },
  modules:   { "<lang>.<mod>": { bestPractice, cardsActivated, completedAt } },
  exams:     { "<lang>": { best, passedAt } },
  questions: { "<id>": { seen, correct, lastDay, lastOk, xpDay } },
  cards:     { "<id>": { box, due, reviews, lapses, xpDay } },
  mistakes:  ["<id da pergunta>", ...],
  counters:  { answered, cardReviews, mistakesFixed, goalDays },
  xp:        { total, byDay: { "YYYY-MM-DD": n } },
  streak:    { current, best, lastDay },
  achievements: { "<id>": "YYYY-MM-DD" },
  history:   [ ... ],
  lastLesson: "<lang>.<mod>.<aula>",
  lastQuizIds: ["<id>", ...],
  backup:    { lastExportAt, autoFileEnabled, lastAutoWriteAt, autoFileError }
}
```
- Todas as datas de dia usam `YYYY-MM-DD` local. Momentos exatos (`createdAt`, `lastExportAt`, `lastAutoWriteAt`, `history[].at`) usam ISO 8601.
- Identificadores que não existem mais no conteúdo são ignorados na leitura. Não causam erro.

### 8.3 Versões e migração
`core/state.js` exporta `CURRENT_SCHEMA` e `migrate(raw)`, que aplica as migrações em ordem (1→2→3...). Cada migração tem teste. Um estado com `schema` maior que `CURRENT_SCHEMA` (vindo de uma versão mais nova do site) é recusado com uma mensagem clara.

### 8.4 Gravação e robustez
- **Gravação:** 300 ms depois da última mudança, e imediata em `pagehide` e `visibilitychange` (quando a página fica oculta).
- **Corrompido:** se o JSON salvo for ilegível ou inválido, o texto original é copiado para `central-linguagens:corrupt:<ISO>`, o site começa com um estado novo e mostra um aviso oferecendo importar um backup. **Nada é apagado.**
- **Duas abas:** o evento `storage` recarrega o estado na outra aba e redesenha a tela. Ações seguintes são aplicadas sobre o estado recarregado.
- **Sem armazenamento** (janela anônima restrita, cota cheia): uma faixa fixa avisa *"Seu progresso não está sendo salvo"*, e o site funciona só na memória.

### 8.5 Camada 3: exportar e importar (todos os navegadores)
- **Arquivo:** `progresso-<nome-em-slug>-<YYYY-MM-DD>.json`, no envelope
  ```json
  { "app": "central-linguagens", "schema": 1, "exportedAt": "<ISO>", "data": { ...estado... } }
  ```
- **Exportar:** se `navigator.canShare({ files })` for verdadeiro (celular), abre o menu de compartilhamento; caso contrário, baixa o arquivo. Atualiza `backup.lastExportAt`.
- **Importar:**
  1. Lê o arquivo e valida o envelope (`app` correto, `schema` ≤ atual, estrutura válida depois do `migrate`).
  2. Mostra um resumo: nome, nível, aulas concluídas e data de exportação.
  3. Pede confirmação e **substitui** o estado atual.
  4. Antes de substituir, copia o estado atual para `central-linguagens:pre-import`. Em `#/config`, **"Desfazer importação"** restaura essa cópia; a cópia é descartada na importação seguinte ou ao zerar o progresso.
- **Lembrete:** se houver algum progresso, se tiverem passado 7 dias desde `lastExportAt` (ou desde `createdAt`, se nunca exportou) e se o backup automático não estiver ativo e saudável, aparece uma faixa discreta com o botão "Exportar agora". A faixa pode ser dispensada por 3 dias.

### 8.6 Camada 2: arquivo automático (Chrome e Edge no computador)
- **Detecção:** só aparece se `window.showSaveFilePicker` existir. Em outros navegadores, a opção fica desativada, com a explicação "disponível no Chrome e no Edge para computador".
- **Ativar:** `showSaveFilePicker` (nome sugerido: `central-linguagens-backup.json`). O atalho retornado é guardado no IndexedDB e o envelope é gravado na hora.
- **Gravação automática:** 5 s depois da última mudança, com o mesmo envelope da exportação. Atualiza `lastAutoWriteAt`.
- **Permissão:** ao abrir o site, se `queryPermission({mode:'readwrite'})` não for `granted`, aparece a faixa **"Reconectar backup automático"**; o clique chama `requestPermission`.
- **Falhas:** um erro de gravação vai para `autoFileError`, e o indicador em `#/config` mostra o erro e sugere exportar manualmente.
- **Indicador:** *"Último backup automático: hoje, 14:32"*.
- **Desativar:** apaga o atalho do IndexedDB. O arquivo continua no disco.

### 8.7 Zerar progresso
Em `#/config`, depois de uma confirmação que sugere exportar antes. Volta ao estado inicial e leva à primeira visita.

### 8.8 Privacidade
Nenhum dado sai do aparelho. Não há estatísticas de uso nem rastreamento.

---

## 9. Tratamento de erros

| Situação | Comportamento |
|---|---|
| Falha ao carregar conteúdo (sem internet, 404) | A tela mostra uma mensagem e o botão "Tentar de novo"; o resto do site continua funcionando |
| Rota inexistente | "Página não encontrada", com link para o início |
| Estado corrompido | Seção 8.4 |
| Sem armazenamento | Seção 8.4 |
| Backup importado inválido | Mensagem explicando o motivo (outro app, versão mais nova, arquivo danificado); o estado atual continua intacto |
| Erro inesperado | `window.onerror` e `unhandledrejection` mostram um aviso "Algo deu errado"; o estado já salvo não é afetado |

---

## 10. Acessibilidade
- Todos os elementos clicáveis são `<button>` ou `<a>` de verdade, com foco visível.
- Navegação completa pelo teclado, incluindo ordenar linhas e flashcards.
- A correção das respostas é anunciada numa região `aria-live`.
- Contraste adequado no tema escuro.
- `prefers-reduced-motion` desliga as animações.

---

## 11. Testes e publicação

### 11.1 Testes das regras (`tests/core/`)
Rodam com `node --test` (Node 18 ou superior; a máquina atual tem o 22). Cobrem pelo menos:
- `dates`: dia local, virada do dia e diferença entre dias.
- `srs`: as três avaliações em cada nível, limites (nível 0 e nível 6) e cálculo do vencimento.
- `grading`: os quatro tipos, incluindo lacuna com respostas alternativas, espaços e `caseInsensitive`, e ordenar com linhas idênticas e recuo.
- `quiz`: filtros, divisão entre linguagens e módulos, redistribuição quando falta pergunta, pesos com `rng` fixo, ausência de repetição e o caso de banco menor que a quantidade pedida.
- `progress`: aula, módulo e linguagem concluídos.
- `gamification`: tabela de XP, limites diários, níveis e títulos, sequência (ontem, hoje, dia pulado), meta e cada conquista.
- `stats`: acerto, pontos fracos (mínimo de 5 respostas) e calendário.
- `state`: estado inicial, validação, `migrate` e recusa de schema mais novo.
- `backup-format`: envelope válido, envelope de outro app e envelope danificado.

### 11.2 Validador de conteúdo (`tests/content.test.js`)
Para cada linguagem do catálogo, confere:
- Os arquivos e as pastas referenciados existem; os ids de módulos e aulas são únicos.
- Os ids de perguntas e cartas são únicos no site todo e têm o prefixo `<lang>.<modulo>.` coerente com a pasta.
- Os campos obrigatórios existem e o `type` é válido (`code` é recusado na Fase 1).
- `difficulty` vale 1, 2 ou 3, e `lesson` aponta para uma aula do módulo.
- Em `multiple`: de 3 a 5 opções, `answer` dentro da faixa, opções sem repetição e nenhuma opção proibida.
- Em `fill`: o número de `___` é igual ao tamanho de `blanks`, e nenhuma lista de respostas está vazia.
- Em `order`: pelo menos 3 linhas.
- As quantidades mínimas da seção 4.7 são cumpridas.
- Todo id de conquista usado nas regras tem texto em `achievements.json`.

### 11.3 Interface
É verificada manualmente no navegador, com um servidor local (`python -m http.server` ou `npx serve`), seguindo um roteiro definido no plano de implementação. O roteiro passa por todas as rotas, o celular (modo responsivo do DevTools), o teclado, exportar, importar e desfazer, o backup automático no Chrome, o estado corrompido e a ausência de armazenamento.

### 11.4 Publicação
- `.github/workflows/pages.yml`: em cada push na `main`, roda `node --test` e, **só se tudo passar**, publica o site com `actions/upload-pages-artifact` e `actions/deploy-pages`. No GitHub, a fonte do Pages é configurada como **"GitHub Actions"**.
- Todos os caminhos são relativos, para funcionar em `<usuario>.github.io/<repo>/`.

---

## 12. Conferência do conteúdo

Vale para o Java nesta fase e para cada linguagem nova.

1. **Fonte oficial:** toda afirmação é conferida na documentação oficial (para Java: dev.java, a documentação da API e a especificação da linguagem da Oracle).
2. **Execução real:** todo código usado em "qual é a saída?", ou apresentado como "isto compila" ou "isto lança tal exceção", é **executado** com a ferramenta real antes de entrar no conteúdo. Para Java, isso exige o **JDK 21** instalado; a máquina atual tem só o Java 8, sem `javac`, e a instalação faz parte do plano. JavaScript é conferido com o Node 22. SQL, nas fases seguintes, pode ser conferido com o SQLite que vem no Python 3.13.
3. **Checklist de cada pergunta:**
   - existe **exatamente uma** resposta defensável;
   - as erradas são plausíveis, mas certamente erradas;
   - a explicação está correta e diz o porquê;
   - recursos de versões recentes estão marcados (por exemplo, "Java 16+");
   - nada depende de detalhe que muda entre JVMs ou sistemas operacionais.
4. **Versão de referência do Java: 21 (LTS).**
5. **Problemas já encontrados no conteúdo atual,** a corrigir na migração:
   - "Como criar uma lista imutável em Java 9+?" tem duas respostas defensáveis (`List.of()` e `Collections.unmodifiableList()`).
   - O flashcard de interface diz "só constantes + métodos default/static" e omite os métodos abstratos (o principal de uma interface) e os métodos `private` (Java 9+).
   - A tabela de tipos diz que `boolean` tem "1 bit", mas a especificação da JVM não define esse tamanho.
   - O mesmo pente-fino será aplicado a todas as perguntas, cartas e aulas migradas.

### 12.1 Módulos de Java na Fase 1
1. **Introdução** (novo, para quem começa do zero): o que é Java, JDK, JRE e JVM, instalação e o primeiro programa.
2. **Fundamentos:** estrutura, tipos, conversões, operadores, controle de fluxo, laços e arrays.
3. **Orientação a Objetos:** classes e objetos, construtores, modificadores de acesso, herança e polimorfismo, classes abstratas e interfaces, `final` e `static`.
4. **Coleções:** List, Set, Map, iteração e ordenação.
5. **Exceções:** hierarquia, try/catch/finally, checked e unchecked, throw e throws, exceções personalizadas, try-with-resources.
6. **Strings e Entrada:** imutabilidade, métodos de String, StringBuilder, Scanner.
7. **Java Moderno (8 a 21):** lambdas, interfaces funcionais, streams, Optional, `var`, records, switch expressions, text blocks e pattern matching.

A lista exata de aulas de cada módulo fica no plano de implementação. Cada módulo cumpre os mínimos da seção 4.7 e a referência rápida (`referencia.md`) é migrada do cheat sheet atual.
