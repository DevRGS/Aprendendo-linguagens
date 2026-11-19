# Testar a navegação

Um teste de tarefa observa uma pessoa alcançar um objetivo. Neste catálogo, o objetivo é encontrar uma trilha, abrir o detalhe e voltar usando somente o teclado. Anote o elemento focado a cada passo.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/18` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

A página inicial fornecida tem dois links, na ordem Web e Dados. Comece no início da página. No macOS, confirme que o teclado pode alcançar todos os controles.

## E1 · Preveja e experimente

```html
<nav aria-label="Trilhas">
  <a href="trilhas/web.html">Abrir Web</a>
  <a href="trilhas/dados.html">Abrir Dados</a>
</nav>
```

Confira esse trecho no corpo. Recarregue, pressione Tab até Abrir Dados e então Enter.

**Confira.** O documento de destino tem h1 Trilha de dados. Avance até Voltar ao catálogo, pressione Enter e confira o título da inicial.

## E2 · Investigue uma variação

Na inicial, foque Abrir Dados e use Shift+Tab. Para onde o foco volta?

**Solução comentada.** O foco retorna ao link Abrir Web, anterior na sequência. Observe o contorno nos dois controles.

## E3 · Aplique em outra situação

Descreva um caso de teste para um colega repetir em 390 px.

**Solução comentada.** Exemplo: partir da inicial, alcançar Abrir Web com Tab, abrir com Enter, ler Trilha web, alcançar Voltar ao catálogo e voltar. Registre também se o indicador de foco foi visível em todas as paradas.

[Preparação e fontes oficiais](#/html-css/referencia)
