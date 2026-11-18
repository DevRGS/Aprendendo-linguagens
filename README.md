# Central de Linguagens

Central gratuita e didática para aprender programação: aulas curtas, quizzes com perguntas aleatórias, flashcards com repetição espaçada, perfil com progresso, conquistas e certificado. Tudo roda no navegador; o progresso fica salvo no aparelho de cada pessoa, com backup manual e automático.

Inspirada no trabalho de Gustavo Guanabara de abrir portas para quem está começando. Sem fins comerciais.

Além de Java e SQL, há uma trilha **Terminal Linux**, com 24 aulas, 90 perguntas, 60 flashcards e referência rápida. As práticas são feitas no terminal da pessoa, com arquivos de laboratório separados. Para quem usa Windows, a segunda aula ensina a baixar e instalar Ubuntu pelo WSL, reiniciar, configurar a conta Linux e conferir a instalação, com fontes da Microsoft. Quem já usa Linux pode seguir no próprio terminal.

A trilha **JavaScript** tem 56 aulas, 210 perguntas, 140 flashcards e referência rápida. Os oito módulos iniciais ensinam fundamentos, funções, arrays/objetos, DOM/eventos, assíncrono, classes/módulos e um projeto local. Os seis módulos seguintes ensinam Node, HTTP/Express, SQLite, CRUD, integração frontend/API, autenticação, sessões, autorização e testes. O aluno começa no navegador sem Node; a etapa backend inclui instalação e um [projeto completo para baixar](content/javascript/projetos/api-estudos.zip), com código, etapas menores, lockfile, README e testes. A API é executada localmente pelo aluno; a central continua estática.

A trilha de Python oferece cadernos para o JupyterLite no navegador e arquivos para rodar com Python 3.14 no terminal. O [kit completo](content/python/kits/python-completo.zip) tem as 64 aulas, as soluções e o projeto final com dados sintéticos.

## Rodar no seu computador

```bash
npm install
npm run dev
```

Abra **http://127.0.0.1:8000/** e mantenha o terminal aberto. Ctrl+C encerra o servidor. `npm test` executa verificações; ele não abre nem inicia o site.

Também é possível servir a central sem Node, usando `python3 -m http.server 8000 --bind 127.0.0.1` (ou `python` no lugar de `python3`, conforme sua instalação). Abrir o `index.html` com dois cliques não funciona: o navegador bloqueia o carregamento do conteúdo fora de um servidor.

O projeto de API das aulas tem seu próprio `npm start`, dentro de `content/javascript/projetos/api-estudos/`, e usa a porta 3000. O `npm run dev` da raiz abre a central de aprendizagem.

## Testes

Use Node 22.13 ou posterior para executar a suíte, que também verifica o SQLite nativo do projeto de backend. O site estático não exige Node para estudar os módulos iniciais.

```bash
npm install   # só na primeira vez: instala as ferramentas de desenvolvimento
npm test
```

Toda função do site tem teste automático: as regras (`tests/core`), a camada de dados (`tests/data`), as telas e componentes (`tests/ui`, com o navegador simulado pelo jsdom) e o validador de conteúdo (`tests/content.test.js`). O teste `tests/meta/exports-covered.test.js` falha se alguém criar uma função exportada sem teste.

Os testes de telas e da camada de dados leem um catálogo e um manifesto de Java congelados, em `tests/fixtures/content/` (só Java › Fundamentos), para não quebrarem quando o curso cresce. As telas de SQL usam um mini-curso próprio, em `tests/fixtures/sql-ui/`. O conteúdo real é conferido pelo validador (`tests/content.test.js`) e por um teste de fumaça que carrega todos os módulos de verdade (`tests/data/content-real.test.js`).

Os exercícios de SQL rodam no sql.js, o mesmo SQLite do site, instalado como dependência de teste. O `npm test` roda cada resposta de referência, cada forma aceita e cada forma recusada (`tests/content-sql.test.js`) e confere os resultados citados nas aulas, guardados em `verify/sql/` (`tests/sql-snippets.test.js`). O formato desses trechos está no começo de `tools/verify-sql-format.mjs`.

O site publicado não tem etapa de build nem depende de Express no navegador. As dependências npm são usadas nos testes, nas ferramentas e no servidor local de desenvolvimento.

No GNU/Linux, o `npm test` também executa os cenários de `verify/linux/` com Bash e ferramentas GNU. Eles usam diretórios temporários, sem rede nem privilégios administrativos, e conferem as saídas dos exemplos da trilha. `cases.json` associa cada script às aulas e guarda a saída esperada; os scripts são selecionados explicitamente, sem executar blocos extraídos do Markdown. Em outros sistemas, esse teste informa que exige Linux e é pulado; o CI Ubuntu o executa. A instalação do WSL é documentada, não executada pelos testes.

Os exemplos JavaScript em `verify/javascript/` são conferidos por `tests/javascript-snippets.test.js`: arquivos `.mjs` em processos Node isolados e HTMLs próprios em jsdom, com cliques, envios de formulário e verificação do DOM. O manifesto `cases.json` associa cada cenário às aulas e às saídas/efeitos esperados. As falhas de fetch usam um servidor de teste em loopback, sem dependência de APIs externas; o projeto é conferido com texto que parece HTML, entrada vazia, recarga, formato inválido e gravação negada. Os testes não executam código enviado por alunos nem blocos extraídos indiscriminadamente do Markdown.

O projeto de API em `content/javascript/projetos/api-estudos/` é o mesmo entregue no ZIP. Os testes de backend fazem HTTP real com SQLite temporário, cadastro/login, CRUD, isolamento de usuários, CSRF/origem, logout, expiração, erros e persistência. Express é uma ferramenta de desenvolvimento da central e uma dependência do projeto executável; não passa a ser uma dependência do site no navegador. Fflate é usado para empacotar/conferir o download. Para regenerar o ZIP depois de alterar fontes: `node tools/package-api-estudos.mjs`. Os testes conferem correspondência dos arquivos e executam o projeto extraído sem acesso ao registro npm.

Os exemplos de Python têm fonte em `verify/python/curriculo/`. Com Python 3.14 e as dependências de `verify/python/requirements.txt` instaladas, execute `python tools/python-course.py run` para conferir as saídas. Os comandos `python tools/python-course.py build` e `python tools/python-course.py check` regeneram e conferem as aulas, os cadernos e os kits.

## Conferir os códigos Java

Todo trecho Java citado nas aulas e perguntas (saídas, erros de compilação, exceções) tem uma cópia executável em `verify/java/`. Para conferir, é preciso o JDK 21:

```powershell
$env:JAVA_HOME = "C:\caminho\para\jdk-21"
node tools/verify-java.mjs
```

Cada trecho começa com um cabeçalho de comentários:

```java
// verifica: o que este trecho prova (ids de perguntas, cartas ou aulas)
// modo: javac                 (opcional: compila de verdade; o nome do arquivo importa)
// classe: Ola                 (obrigatório no modo javac quando o trecho executa)
// erro-contem: texto          (opcional: trecho que a mensagem de erro precisa ter)
// espera: erro-de-compilacao  (ou: // espera: excecao NomeDaExcecao)
// saida:                      (alternativa ao "espera"; sempre a última diretiva)
// linha 1 esperada
// linha 2 esperada
```

No modo padrão (`java Arquivo.java`), o Java executa a **primeira** classe do arquivo, então `class Main` vem primeiro.

## Como o conteúdo é organizado

```
content/
  catalog.json                 lista de linguagens
  achievements.json            textos das conquistas
  <linguagem>/
    language.json              nome, cor, ícone e módulos (com as aulas de cada um)
    referencia.md              referência rápida
    datasets/<id>/             só em linguagens com banco (SQL): schema.sql, data.sql e hidden-data.sql
    <NN-modulo>/
      <NN-aula>.md             aulas em Markdown (alertas: > [!TIP], > [!WARNING]...)
      questions.json           perguntas: multiple, truefalse, fill, order (e sql, em linguagens com banco)
      flashcards.json          cartas: front, back, lesson
      challenges.json          desafios "Experimente" do fim das aulas (só em linguagens com banco)
```

O formato completo está em `docs/superpowers/specs/2026-10-11-central-linguagens-design.md`, seção 4, e o que muda para o SQL, em `docs/superpowers/specs/2026-10-14-sql-design.md`, seção 4. O validador recusa conteúdo fora do padrão.

## Publicar

No GitHub: **Settings → Pages → Source: GitHub Actions**. A cada `push` na `main`, o workflow instala as ferramentas de teste, roda os testes e as verificações de Java e Python e só publica se tudo passar.

## Créditos

- [SQL Teaching](https://www.sqlteaching.com/), de Ronald Cheng (licença MIT): inspiração para os exercícios de SQL e para a ordem dos assuntos.
- [sql.js](https://github.com/sql-js/sql.js) (licença MIT) e [SQLite](https://sqlite.org/) (domínio público): o banco de dados que roda no navegador.
- [marked](https://marked.js.org/) (licença MIT) e [highlight.js](https://highlightjs.org/) (licença BSD-3-Clause): o Markdown e as cores do código.
- Terminal Linux: [Microsoft Learn/WSL](https://learn.microsoft.com/pt-br/windows/wsl/install), [Ubuntu](https://ubuntu.com/desktop/docs/en/26.04/tutorial/the-linux-command-line-for-beginners/), [GNU Bash](https://www.gnu.org/software/bash/manual/bash.html), [Coreutils](https://www.gnu.org/software/coreutils/manual/html_node/index.html), [Grep](https://www.gnu.org/software/grep/manual/grep.html), [Findutils](https://www.gnu.org/software/findutils/manual/html_mono/find.html), [tar](https://www.gnu.org/software/tar/manual/tar.html), [Debian Manpages](https://manpages.debian.org/) e [Sudo](https://www.sudo.ws/docs/man/sudo.man/). Textos e exemplos próprios; fontes específicas no fim de cada aula e na referência rápida.
- JavaScript: [MDN Web Docs](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide), [ECMAScript 2026](https://tc39.es/ecma262/2026/) e documentação oficial do [Python/http.server](https://docs.python.org/3/library/http.server.html) para o ambiente de estudo. Textos, dados e exemplos próprios, com fontes por aula.
- Backend JavaScript: [Node](https://nodejs.org/api/), [Express](https://expressjs.com/en/5x/api/), [SQLite](https://www.sqlite.org/lang.html) e guias da [OWASP](https://cheatsheetseries.owasp.org/). O projeto usa Express (MIT); a ferramenta de ZIP usa [fflate](https://github.com/101arrowz/fflate) (MIT).
