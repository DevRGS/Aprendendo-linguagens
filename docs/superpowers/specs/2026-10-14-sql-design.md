# Central de Linguagens — Especificação de Design: SQL com exercícios executáveis

- **Data:** 2026-10-14
- **Status:** aprovado em conversa, aguardando revisão desta especificação escrita
- **Base:** `docs/superpowers/specs/2026-10-11-central-linguagens-design.md` (a "especificação da Fase 1"). Tudo o que esta especificação não muda continua valendo como está lá: formato do conteúdo, quiz, flashcards, perfil, backup, acessibilidade e conferência do conteúdo.

---

## 1. Propósito

Acrescentar **SQL** como segunda linguagem da Central, com o que a Fase 1 deixou para depois: **exercícios em que a pessoa escreve código e o site executa**. A inspiração é o [SQL Teaching](https://www.sqlteaching.com/) ([rhc2104/sqlteaching](https://github.com/rhc2104/sqlteaching), licença MIT): a pessoa lê o que precisa fazer, digita a consulta, executa e vê o resultado. O que conta é **o resultado**, alcançado por qualquer caminho que funcione de verdade.

Esta especificação cobre, para o SQL, a Fase 2 (execução de código) e a Fase 3 (conteúdo de uma linguagem nova) da especificação da Fase 1.

### O que a pessoa consegue fazer
1. Estudar SQL em módulos e aulas curtas, como o Java.
2. No fim de cada aula, resolver **desafios**: escrever consultas, executá-las num banco de verdade dentro do navegador e comparar com o resultado esperado, quantas vezes quiser.
3. Encontrar **perguntas de escrever SQL** na prática, no quiz e na prova, ao lado das de múltipla escolha, verdadeiro ou falso, lacuna e ordenar, com XP e correção automática.
4. Ganhar flashcards, conquistas e certificado de SQL do mesmo jeito que no Java.

### Critérios de sucesso
- SQL aparece como linguagem no site publicado, com os seis módulos da seção 9.
- Desafios e perguntas `sql` rodam no navegador com o sql.js, sem servidor.
- Uma consulta diferente da de referência, mas que dá o mesmo resultado nos dados visíveis **e** nos ocultos, é aceita. Uma consulta que só acerta por coincidência nos dados visíveis é recusada, com uma explicação.
- Toda resposta de referência, toda forma aceita, toda forma recusada e todo resultado citado nas aulas é conferido automaticamente no `npm test`, com o mesmo sql.js que roda no site.
- O Java e os testes existentes continuam funcionando sem mudança de comportamento.

---

## 2. Decisões tomadas

| Assunto | Decisão |
|---|---|
| Conteúdo | Currículo próprio no formato da Central (módulos, aulas, perguntas e flashcards), com a ordem de assuntos do SQL Teaching como base da parte de consultas, mais o que ele não tem (criar tabelas, `INSERT`, `UPDATE`, `DELETE`, chaves, índices). Texto e dados nossos, em português. |
| Onde ficam os exercícios | Nos dois lugares: **desafios** no fim das aulas (praticar à vontade, sem XP) e **perguntas `sql`** nos bancos de perguntas (prática, quiz e prova, com XP). |
| Correção | Pelo resultado, com **teste escondido**: a consulta também precisa acertar numa segunda versão dos dados, que a pessoa não vê. |
| Motor | **sql.js 1.14.2** (SQLite em WebAssembly, MIT), carregado do jsdelivr (o mesmo CDN do marked e do highlight.js, que serve cópia exata do pacote do npm) só quando a página tem um exercício. Nos testes, a mesma versão vem do npm. |
| Editor | Caixa de texto simples (`textarea`) com fonte de código. Sem editor com cores nem autocompletar. |
| Dialeto | O do SQLite 3.49.1, que vem no sql.js 1.14.2 (conferido com `sqlite_version()`). Quando algo muda em MySQL ou PostgreSQL, a aula avisa. |
| Divisão | Uma especificação e duas etapas: **SQL-A** (plataforma de exercícios e módulos 1 e 2) e **SQL-B** (módulos 3 a 6). Cada etapa tem seu plano e vai ao ar sozinha. |

---

## 3. Arquitetura

### 3.1 Arquivos novos e alterados
```
js/
  config.js                    + SQLJS_VERSION, SQLJS_URL (script) e SQLJS_WASM_URL
  core/
    sql-grading.js             NOVO: comparação de resultados e veredito (puro; motor injetado)
    grading.js                 o tipo "sql" é desviado para a correção assíncrona
  data/
    content.js                 + carregar challenges.json e os conjuntos de tabelas
    sql-engine.js              NOVO: carrega o sql.js sob demanda e executa SQL num banco novo
  ui/
    components/
      sql-exercise.js          NOVO: enunciado, tabelas, caixa, Executar, resultado
      question.js              + visão do tipo "sql" (usa sql-exercise)
      quiz-runner.js           + correção assíncrona e revisão de perguntas "sql"
    views/
      lesson.js                + bloco "Experimente" com os desafios da aula
      quiz-builder.js          + tipo "Escrever SQL" no filtro
content/
  catalog.json                 + { "id": "sql", "dir": "sql" }
  sql/
    language.json              + "engine": "sqlite"
    referencia.md
    datasets/<id>/schema.sql, data.sql, hidden-data.sql
    01-introducao/ ... 06-.../ (aulas, questions.json, flashcards.json, challenges.json)
verify/sql/<modulo>/*.sql      trechos citados nas aulas, conferidos no npm test
tests/                         testes novos das seções 8.1 a 8.5
```

### 3.2 Regras de dependência
Valem as da especificação da Fase 1 (seção 3.3). `core/sql-grading.js` não conhece o sql.js nem o DOM: recebe uma função `run(datasetSql, sql)` que devolve os resultados. Assim, os testes passam o sql.js do npm e o site passa o do jsdelivr.

---

## 4. Formato do conteúdo de SQL

### 4.1 `language.json`
Igual ao do Java (seção 4.2 da Fase 1), mais o campo **`engine`**. Só uma linguagem com `"engine": "sqlite"` pode ter perguntas `sql` e desafios.
```json
{ "id": "sql", "name": "SQL", "color": "#336791", "icon": "🗄️", "highlight": "sql",
  "reference": "referencia.md", "engine": "sqlite", "modules": [ ... ] }
```

### 4.2 Conjuntos de tabelas (`content/sql/datasets/<id>/`)
Cada conjunto é uma pasta com três arquivos de SQL:

| Arquivo | Conteúdo |
|---|---|
| `schema.sql` | os `CREATE TABLE` (com chaves e restrições) |
| `data.sql` | os `INSERT` das linhas que a pessoa vê |
| `hidden-data.sql` | os `INSERT` de outra versão das linhas, usada só no teste escondido |

- O banco visível é `schema.sql` + `data.sql`; o oculto, `schema.sql` + `hidden-data.sql`.
- Os dois precisam ter linhas em toda tabela e ser **diferentes** entre si.
- As tabelas visíveis são pequenas, para caber na tela: até cerca de 15 linhas cada.
- O `id` do conjunto (nome da pasta) segue `^[a-z0-9-]+$`.
- Temas brasileiros, por exemplo: `escola` (alunos, turmas, notas), `loja` (clientes, produtos, pedidos) e `campeonato` (times, jogos).

Os dados ocultos ficam no repositório público e qualquer pessoa pode lê-los. Eles não são segredo: servem para pegar a consulta que acerta por coincidência, não para impedir trapaça deliberada.

### 4.3 Pergunta `sql` (`questions.json`)
Campos comuns (seção 4.4 da Fase 1), com `type: "sql"`, mais:

| Campo | Obrigatório | Descrição |
|---|---|---|
| `dataset` | sim | id de um conjunto de tabelas existente |
| `answer` | sim | a consulta de referência; o resultado esperado é calculado rodando-a |
| `ordered` | não (padrão `false`) | a ordem das linhas importa (o enunciado pede ordenação) |
| `columnNames` | não (padrão `false`) | os nomes das colunas importam (o enunciado pede um nome, como nas aulas de `AS`) |
| `check` | não | consulta rodada **depois** da consulta da pessoa e da de referência; é o resultado dela que se compara (exercícios de `INSERT`, `UPDATE`, `DELETE` e `CREATE`) |
| `accepted` | não | outras consultas que precisam ser aprovadas (conferidas no `npm test`) |
| `rejected` | sim, pelo menos uma | consultas erradas que precisam ser recusadas (conferidas no `npm test`); quando fizer sentido, pelo menos uma acerta por coincidência nos dados visíveis |

```json
{
  "id": "sql.consultas.q07", "type": "sql", "difficulty": 2, "lesson": "where",
  "dataset": "escola",
  "prompt": "Liste o nome dos alunos com nota maior que 8.",
  "answer": "SELECT nome FROM alunos WHERE nota > 8;",
  "accepted": ["SELECT nome FROM alunos WHERE 8 < nota;"],
  "rejected": ["SELECT nome FROM alunos WHERE id IN (2, 5);"],
  "explanation": "`WHERE nota > 8` mantém só as linhas em que a nota passa de 8."
}
```

### 4.4 Desafios (`challenges.json`, um por módulo)
```json
{ "challenges": [ ... ] }
```
Mesmos campos da pergunta `sql`, exceto `type` e `difficulty`. O `id` segue `<lang>.<modulo>.d<NN>`, e a `explanation` aparece junto com "Ver uma resposta". Os desafios aparecem no fim da aula indicada em `lesson`, na ordem do arquivo. Não entram no sorteio de perguntas, não dão XP e não são salvos.

### 4.5 Quantidades mínimas (verificadas pelo validador)
Valem as da seção 4.7 da Fase 1 (12 perguntas, 3 tipos e 8 cartas por módulo) e a regra da Fase 1B (toda aula tem pelo menos uma pergunta). Numa linguagem com `engine`, também:
- pelo menos **1 desafio por aula**;
- pelo menos **3 perguntas `sql`** por módulo.

Numa linguagem sem `engine`, perguntas `sql` e `challenges.json` são recusados.

---

## 5. Execução no navegador

### 5.1 Motor (`js/data/sql-engine.js`)
- Carrega o `sql-wasm.js` do jsdelivr (`https://cdn.jsdelivr.net/npm/sql.js@1.14.2/dist/`), com uma tag `<script>`, porque o pacote não traz módulo ES, na primeira vez que um exercício precisa dele, com o `.wasm` da mesma versão (`locateFile`). Uma única carga por página; falhas não ficam guardadas, e a próxima tentativa tenta de novo.
- Cada execução cria um **banco novo** a partir do texto do conjunto (esquema + dados), roda o SQL instrução por instrução com `db.iterateStatements` e fecha o banco. Nada passa de uma execução para a outra.
- O resultado é uma lista `[{ columns, values }]` com **toda instrução que tem colunas, mesmo sem linhas**. O `db.exec` não serve: ele omite as consultas que não devolvem nenhuma linha (conferido no sql.js 1.14.2), e aí uma consulta certa com resultado vazio pareceria "sem resultado".
- Os arquivos dos conjuntos são lidos como o resto do conteúdo (fetch com cache em memória).
- Para os testes, o carregador aceita uma fábrica de sql.js injetada.

### 5.2 Componente de exercício (`js/ui/components/sql-exercise.js`)
- **Enunciado** em Markdown.
- **"Tabelas deste exercício"**, um bloco que se abre e se fecha. Mostra cada tabela do banco visível com colunas e linhas, lidas do próprio banco (`sqlite_master` e `SELECT *`). Os dados ocultos nunca aparecem.
- **Caixa de texto** com rótulo, fonte de código, `spellcheck`, `autocorrect` e `autocapitalize` desligados. Tab insere dois espaços; Ctrl+Enter (ou Cmd+Enter) executa. Esc sai da caixa, para quem navega pelo teclado não ficar preso.
- **Executar** roda a consulta e mostra o resultado:
  - a tabela devolvida, até 100 linhas, com o aviso "e mais N linhas";
  - "A consulta não devolveu nenhuma linha", quando não volta nada;
  - para erros, a mensagem do SQLite mais uma dica em português (seção 6.3).
- A área de resultado é anunciada a leitores de tela (`aria-live="polite"`).
- Tudo o que vem do banco ou da pessoa entra na página como texto, nunca como HTML (seção 3.6 da Fase 1).

### 5.3 Nas aulas
- Depois do texto da aula e antes de "Concluir aula", um bloco **"Experimente"** com os desafios da aula.
- Cada **Executar** também corrige e mostra ✅ "Resultado certo!" ou ❌ com o motivo (seção 6.2).
- O **resultado esperado** fica sempre visível ao lado do resultado obtido.
- **"Ver uma resposta"** aparece depois da primeira execução e mostra a consulta de referência com a explicação.
- Concluir a aula **não** depende dos desafios.

### 5.4 Nas perguntas (prática, quiz e prova)
- O tipo `sql` usa o mesmo componente. **Executar** pode ser usado quantas vezes a pessoa quiser e só mostra o resultado, sem dizer se está certo.
- **Responder** fica ativo quando a caixa não está vazia. Ele envia a consulta atual, roda a correção completa (seção 6) e registra a resposta como as outras (seção 5.3 da Fase 1: XP 5 × dificuldade, estatísticas, "Meus erros").
- **No modo estudo:** aparecem o veredito com o motivo, o resultado esperado, a explicação e uma resposta certa.
- **No simulado:** aparece só "Resposta registrada".
- **Na revisão do resultado:** "Sua consulta" e "Uma resposta certa" aparecem como blocos de código.
- A correção é assíncrona: o quiz espera o resultado antes de mostrar a resposta e liberar "Próxima".

### 5.5 Quiz personalizado
O filtro de tipos ganha **"Escrever SQL"**, que só aparece quando o escopo escolhido tem perguntas `sql`.

### 5.6 Quando o motor não carrega
- **Na aula,** o bloco "Experimente" mostra: "Não foi possível carregar o banco de dados. Confira sua conexão e recarregue a página." O resto da aula funciona.
- **Na prática, no quiz e na prova,** quando o sorteio inclui perguntas `sql`, o site carrega o motor **antes** de começar. Se falhar, as perguntas `sql` saem do sorteio e um aviso explica. Na prova, que tem tamanho fixo, as vagas vão para perguntas de outros tipos do mesmo escopo.

### 5.7 Limites aceitos
- A consulta roda na própria aba. Uma consulta recursiva sem fim (`WITH RECURSIVE`) trava a página até a pessoa recarregar. O curso não ensina `WITH RECURSIVE`, e rodar numa thread separada só por esse caso complicaria o motor.
- Só a última instrução que devolve linhas é comparada (seção 6.1). A pessoa pode escrever várias instruções; as anteriores servem de preparação.

---

## 6. Correção (`js/core/sql-grading.js`)

### 6.1 Algoritmo
Para a consulta da pessoa (`P`) e a de referência (`R`), num banco:
1. Roda `P` num banco novo. Se der erro: veredito **erro**, com a mensagem.
2. O resultado de `P` é o da **última instrução que tem colunas** (um `SELECT`, mesmo que não devolva linhas). Se o exercício tem `check`, o resultado é o de `check` rodado no mesmo banco, logo depois de `P`.
3. Sem resultado (nenhuma instrução tem colunas e não há `check`, como um `INSERT` sozinho): veredito **sem resultado**, com a mensagem "Sua consulta não devolveu uma tabela. Termine com um SELECT."
4. Faz o mesmo com `R`, num banco novo.
5. Compara os dois resultados (seção 6.2).

Primeiro no banco visível. Se bater, repete no oculto. Se no oculto não bater, o veredito é **coincidência**.

### 6.2 Comparação e motivos
Na ordem, e o primeiro que falhar vira o motivo:
1. **Quantidade de colunas:** "Sua consulta devolveu 3 colunas; o esperado são 2."
2. **Nomes das colunas** (só com `columnNames`; sem diferenciar maiúsculas e ignorando espaços nas pontas): "As colunas devem se chamar: nome, media."
3. **Quantidade de linhas:** "Sua consulta devolveu 4 linhas; o esperado são 3."
4. **Conteúdo:** "Algumas linhas não são as esperadas."
   - Sem `ordered`: compara como conjuntos com repetição (ordena as linhas por uma forma canônica e compara).
   - Com `ordered`: compara linha a linha. Se as linhas são as mesmas e só a ordem difere: "As linhas estão certas, mas a ordem não: o enunciado pede ordenação."
5. **Coincidência** (deu certo no visível e errado no oculto): "Seu resultado bate nestas tabelas, mas a consulta não funcionaria com outros dados. Confira o filtro."

Valores:
- **Números** são iguais se `|a − b| ≤ 1e-9 · max(1, |a|, |b|)`, então `5` e `5.0` são iguais.
- **Textos** são comparados exatamente.
- **`NULL`** só é igual a `NULL`.
- Número e texto nunca são iguais (`7` ≠ `'7'`).

### 6.3 Dicas para erros comuns
A mensagem original do SQLite é sempre mostrada, seguida da dica:

| Mensagem do SQLite (início) | Dica |
|---|---|
| `no such table: X` | A tabela X não existe. Confira o nome em "Tabelas deste exercício". |
| `no such column: X` | A coluna X não existe nessas tabelas. Confira o nome e de qual tabela ela é. |
| `near "X": syntax error` | Erro de sintaxe perto de X. Confira vírgulas, aspas e a ordem das cláusulas. |
| `incomplete input` | A consulta terminou antes da hora. Falta fechar parênteses ou aspas? |
| `ambiguous column name: X` | A coluna X existe em mais de uma tabela. Diga de qual: `tabela.X`. |
| outras | (só a mensagem original) |

---

## 7. Progresso e dados salvos

O formato do estado (versão 1, seção 8.2 da Fase 1) **não muda**. Perguntas `sql` usam os registros que já existem por pergunta, e os desafios não são salvos. Perfil, XP, conquistas, sequência de dias, histórico, backup e certificado tratam o SQL como qualquer linguagem.

---

## 8. Conferência do conteúdo e testes

Tudo roda no `npm test`, localmente e no GitHub antes de publicar, sem nenhum programa além do Node.

### 8.1 Versão do motor
- `sql.js` **1.14.2** entra em `devDependencies` com a versão exata.
- Um teste garante que a versão em `js/config.js` (`SQLJS_VERSION`) é a mesma do `package.json`, e que as URLs do jsdelivr usam essa versão.

### 8.2 Validador de conteúdo (`tests/content.test.js`)
Além das regras atuais:
- O tipo `sql` é aceito só em linguagem com `engine: "sqlite"`. O tipo `code` continua recusado.
- Pergunta `sql` e desafio:
  - `dataset` existente;
  - `answer` não vazio;
  - `ordered` e `columnNames` booleanos, quando presentes;
  - `check` texto, quando presente;
  - `accepted` como lista de textos;
  - `rejected` com pelo menos um texto.
- Desafios: `id` no formato `<lang>.<modulo>.dNN`, únicos; `lesson` existente.
- Conjuntos de tabelas: os três arquivos existem.
- Mínimos da seção 4.5.

### 8.3 Execução do conteúdo (`tests/content-sql.test.js`)
Com o sql.js do npm, para cada pergunta `sql` e cada desafio:
- `answer` roda sem erro nos dois bancos e devolve **pelo menos uma linha** no visível (ou, com `check`, o `check` devolve);
- cada `accepted` é aprovada pela correção da seção 6;
- cada `rejected` é recusada.

Para cada conjunto de tabelas: os dois bancos montam sem erro, toda tabela tem linhas nos dois, e `data.sql` é diferente de `hidden-data.sql`.

### 8.4 Trechos citados nas aulas (`verify/sql/<modulo>/*.sql`)
Mesma regra do Java: toda consulta com resultado mostrado na aula, e toda afirmação de "isto dá erro", tem um trecho conferido. Cabeçalho:
```sql
-- verifica: a aula where e sql.consultas.q03
-- banco: escola
-- saida:
-- nome | nota
-- Ana  | 9.5
SELECT nome, nota FROM alunos WHERE nota > 9;
```
- **`-- banco:`** indica o conjunto visível onde rodar. Alternativas: `-- banco: vazio`, para um banco sem tabelas, ou `-- banco: dados-ocultos:escola`, para o banco oculto.
- **`-- saida:`** é a última diretiva. As linhas seguintes formam a tabela esperada: a primeira linha traz os nomes das colunas, os valores vão separados por `|`, os espaços em volta são ignorados e `NULL` é escrito como `NULL`.
- **`-- espera: erro texto`** substitui a saída: espera um erro cuja mensagem contém o texto.
- Um teste (`tests/sql-snippets.test.js`) roda todos os trechos.

### 8.5 Testes da plataforma
- **`core/sql-grading`:** cada passo e cada motivo da seção 6, com o sql.js real (números, textos, `NULL`, ordem, nomes, repetições, várias instruções, `check`, coincidência).
- **`data/sql-engine`:** carga sob demanda única, nova tentativa depois de falha, banco novo a cada execução.
- **Componente e telas (jsdom, com o sql.js do npm injetado):**
  - Tab e Ctrl+Enter;
  - limite de 100 linhas;
  - dica de erro;
  - tabelas visíveis sem os dados ocultos;
  - desafio na aula com "Ver uma resposta";
  - pergunta `sql` no modo estudo e no simulado;
  - revisão do resultado;
  - filtro "Escrever SQL";
  - motor indisponível na aula, no quiz e na prova.
- **Java:** os testes atuais continuam passando sem mudança de expectativas. Os de tela seguem usando o manifesto de Java congelado da Fase 1B.

---

## 9. Conteúdo de SQL

| # | Módulo (`id`) | Assuntos |
|---|---|---|
| 1 | Introdução (`introducao`) | O que é um banco de dados; tabelas, linhas e colunas; o que é SQL; o SQLite; como usar os exercícios do site |
| 2 | Consultas básicas (`consultas`) | `SELECT`, colunas, `WHERE` com comparações, `AND`/`OR`/`NOT`, `IN`, `BETWEEN`, `LIKE`, `DISTINCT`, `ORDER BY`, `LIMIT`, `NULL` e `IS NULL`, apelidos de coluna (`AS`) |
| 3 | Funções e agrupamento (`agrupamento`) | `COUNT`, `SUM`, `AVG`, `MAX`/`MIN`, `GROUP BY`, `HAVING`, funções de texto (`UPPER`, `LOWER`, `LENGTH`, `SUBSTR`, `TRIM`, `REPLACE`, `\|\|`), datas (`date`, `strftime`), `ROUND`, `CASE`, `COALESCE` |
| 4 | Junções (`juncoes`) | Por que os dados ficam em várias tabelas; `INNER JOIN`; apelidos de tabela; várias junções; `LEFT JOIN`; self join |
| 5 | Subconsultas e conjuntos (`subconsultas`) | Subconsultas no `WHERE` e no `FROM`; `EXISTS`; `UNION` e `UNION ALL`; `WITH` (não recursivo) |
| 6 | Criando e alterando dados (`dados`) | `CREATE TABLE`, tipos no SQLite, chave primária e estrangeira, `NOT NULL`/`UNIQUE`/`DEFAULT`/`CHECK`, `INSERT`, `UPDATE`, `DELETE` (e o perigo de esquecer o `WHERE`), transações (`BEGIN`/`COMMIT`/`ROLLBACK`), índices |

- **SQL-A** entrega os módulos 1 e 2; **SQL-B**, os módulos 3 a 6. A referência rápida (`referencia.md`) nasce na SQL-A e cresce na SQL-B.
- Valem as regras de conteúdo da Fase 1 e da Fase 1B:
  - texto em português do Brasil, com linguagem neutra em gênero;
  - uma única resposta defensável na múltipla escolha;
  - a lacuna aceita toda resposta que alguém do curso daria (em SQL, com `caseInsensitive: true` quando a resposta for palavra-chave);
  - ordenar com uma única ordem válida;
  - cada afirmação sobre código conferida.
- **Dialeto:** o comportamento ensinado é o do SQLite. Quando MySQL ou PostgreSQL fazem diferente de um jeito que confunde iniciantes (por exemplo, `||` para juntar texto, tipos flexíveis do SQLite, `LIMIT`), a aula avisa num quadro de destaque.

---

## 10. Créditos e licenças

- **SQL Teaching** (Ronald Cheng, MIT): inspiração da interação e da ordem dos assuntos. Nenhum texto, dado ou código é copiado. O crédito aparece no README e no fim da referência rápida de SQL.
- **sql.js** (MIT) e **SQLite** (domínio público): citados no README, na seção de bibliotecas.

---

## 11. Fora do escopo
- Salvar quais desafios a pessoa resolveu.
- Editor com cores, autocompletar ou numeração de linhas.
- Executar em thread separada com tempo limite.
- Outros bancos (MySQL, PostgreSQL) e o ensino de `WITH RECURSIVE`, gatilhos (triggers) e funções de janela (window functions).
- Exercícios executáveis para Java, JavaScript, Go ou PHP, que continuam com especificações próprias.
