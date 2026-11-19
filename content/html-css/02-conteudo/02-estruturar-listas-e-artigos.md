# Estruturar listas e artigos

Uma lista descreve um conjunto; um artigo representa conteúdo que faz sentido isoladamente. Um catálogo pode conter uma lista de artigos, e cada cartão pode ter título e destino claros.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/06` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

Substitua o corpo por uma lista com um cartão e confira sua estrutura no inspetor.

## E1 · Preveja e experimente

```html
<main>
  <h1>Catálogo</h1>
  <ul>
    <li><article><h2>Web</h2><p>Crie páginas.</p>
      <a href="trilhas/web.html">Abrir Web</a>
    </article></li>
  </ul>
</main>
```

**Confira.** A lista contém um item. O artigo agrupa título, objetivo e link para a trilha. Seu nome de link informa o destino mesmo fora do parágrafo.

## E2 · Investigue uma variação

Duplique o item e faça o segundo descrever a etapa Projeto.

**Solução comentada.** Use outro li com article, h2 Projeto e um parágrafo próprio. Se ainda não existir um destino para Projeto, deixe o cartão sem link.

## E3 · Aplique em outra situação

Descreva a ordem de estudo abaixo dos cartões em uma lista que comunique sequência.

**Solução comentada.** Antes de fechar main, escreva `<ol><li>Documento</li><li>Layout</li><li>Publicação</li></ol>`. A numeração acompanha a ordem dos itens.

[Preparação e fontes oficiais](#/html-css/referencia)
