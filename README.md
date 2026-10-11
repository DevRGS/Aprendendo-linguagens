# Central de Linguagens

Central gratuita e didática para aprender programação: aulas curtas, quizzes com perguntas aleatórias, flashcards com repetição espaçada, perfil com progresso, conquistas e certificado. Tudo roda no navegador; o progresso fica salvo no aparelho de cada pessoa, com backup manual e automático.

Inspirada no trabalho de Gustavo Guanabara de abrir portas para quem está começando. Sem fins comerciais.

## Rodar no seu computador

```bash
python -m http.server 8000
```

Abra `http://localhost:8000/`. Abrir o `index.html` com dois cliques não funciona: o navegador bloqueia o carregamento do conteúdo fora de um servidor.

## Testes

```bash
npm install   # só na primeira vez: instala as ferramentas de teste
npm test
```

Toda função do site tem teste automático: as regras (`tests/core`), a camada de dados (`tests/data`), as telas e componentes (`tests/ui`, com o navegador simulado pelo jsdom) e o validador de conteúdo (`tests/content.test.js`). O teste `tests/meta/exports-covered.test.js` falha se alguém criar uma função exportada sem teste.

O site em si não tem dependências nem etapa de build: o `npm install` só serve para os testes.

## Conferir os códigos Java

Todo trecho Java citado nas aulas e perguntas (saídas, erros de compilação, exceções) tem uma cópia executável em `verify/java/`. Para conferir, é preciso o JDK 21:

```powershell
$env:JAVA_HOME = "C:\caminho\para\jdk-21"
node tools/verify-java.mjs
```

## Como o conteúdo é organizado

```
content/
  catalog.json                 lista de linguagens
  achievements.json            textos das conquistas
  <linguagem>/
    language.json              nome, cor, ícone e módulos (com as aulas de cada um)
    referencia.md              referência rápida
    <NN-modulo>/
      <NN-aula>.md             aulas em Markdown (alertas: > [!TIP], > [!WARNING]...)
      questions.json           perguntas: multiple, truefalse, fill, order
      flashcards.json          cartas: front, back, lesson
```

O formato completo está em `docs/superpowers/specs/2026-10-11-central-linguagens-design.md`, seção 4. O validador recusa conteúdo fora do padrão.

## Publicar

No GitHub: **Settings → Pages → Source: GitHub Actions**. A cada `push` na `main`, o workflow instala as ferramentas de teste, roda os testes e a conferência Java e só publica se tudo passar.
