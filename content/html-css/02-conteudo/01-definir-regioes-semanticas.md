# Definir regiões semânticas

Regiões como navegação e conteúdo principal ajudam a localizar partes recorrentes da página. Uma estrutura semântica também torna possível oferecer um atalho de teclado direto para o conteúdo.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/05` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

No corpo, monte um cabeçalho, uma navegação e a região principal. O valor de href com # procura um id no documento.

## E1 · Preveja e experimente

```html
<a href="#conteudo">Ir ao conteúdo</a>
<header><p>Central de estudos</p></header>
<nav aria-label="Trilhas"><a href="trilhas/web.html">Web</a></nav>
<main id="conteudo" tabindex="-1"><h1>Catálogo</h1></main>
<footer>Laboratório local</footer>
```

**Confira.** O atalho inicial conduz à região com id conteudo. Nav e main têm funções reconhecíveis na árvore de acessibilidade. tabindex="-1" permite ao destino receber foco sem criar outra parada comum de Tab.

## E2 · Investigue uma variação

Mude o id para principal mantendo o link antigo e investigue o destino.

**Solução comentada.** O identificador já não coincide. Ajuste o atalho para `href="#principal"` e confirme com Tab e Enter.

## E3 · Aplique em outra situação

Acrescente uma segunda navegação no rodapé que leve ao conteúdo e permita distingui-la da navegação Trilhas.

**Solução comentada.** Em footer, use `<nav aria-label="Rodapé"><a href="#principal">Voltar ao conteúdo</a></nav>`. As navegações têm nomes diferentes.

[Preparação e fontes oficiais](#/html-css/referencia)
