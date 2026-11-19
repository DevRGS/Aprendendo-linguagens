# Organizar caminhos

Um site de projeto costuma viver abaixo de um prefixo, como /catalogo/. Um caminho começado por barra aponta para a raiz da origem e pode sair desse prefixo. Resolva imagens, folhas e links em relação ao arquivo que os usa.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/17` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

Na pasta da aula, examine index.html, trilhas/web.html, estilo.css e mapa.svg. Edite o corpo da página de detalhe e confira a folha ligada em seu cabeçalho.

## E1 · Preveja e experimente

```html
<main>
  <h1>Trilha web</h1>
  <img src="../mapa.svg" alt="Percurso: HTML, CSS e projeto.">
  <a href="../index.html">Voltar ao catálogo</a>
</main>
```

**Confira.** Partindo de trilhas/web.html, os dois caminhos sobem para a pasta do catálogo. O detalhe recebe seu estilo de ../estilo.css.

## E2 · Investigue uma variação

Faça uma cópia de toda a pasta da aula com outro nome e percorra as duas páginas.

**Solução comentada.** Como cada caminho fica relativo à estrutura interna preservada, links, imagem e estilo continuam funcionando.

## E3 · Aplique em outra situação

Crie uma pasta recursos na raiz da aula, mova mapa.svg para lá e ajuste a imagem do detalhe.

**Solução comentada.** Use src="../recursos/mapa.svg" no detalhe. Se a inicial também usar o desenho, seu caminho será recursos/mapa.svg.

[Preparação e fontes oficiais](#/html-css/referencia)
