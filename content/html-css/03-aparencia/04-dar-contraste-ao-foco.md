# Dar contraste ao foco

O texto precisa continuar legível e o elemento focado precisa ser localizável para quem usa teclado. Um anel com contorno e afastamento muda a aparência do foco sem deslocar os vizinhos.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/12` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

A página traz fundo branco, um link e um botão. Substitua estilo.css e percorra os controles com Tab.

## E1 · Preveja e experimente

```css
body { color: #172435; background: white; font: 1rem/1.5 system-ui, sans-serif; }
a { color: #15386b; text-decoration: underline; }
:focus-visible { outline: 3px solid #8c3200; outline-offset: 3px; }
```

**Confira.** O link continua distinguível pelo sublinhado. O foco de teclado aparece como contorno separado da borda. A altura de linha acompanha o tamanho da fonte.

## E2 · Investigue uma variação

Aumente o tamanho padrão do texto no navegador ou o zoom. O que acontece com o texto?

**Solução comentada.** O tamanho relativo em rem acompanha a raiz. O zoom amplia a página. Confira se o botão continua legível, focável e visível.

## E3 · Aplique em outra situação

Estenda o indicador para um segundo link e verifique a navegação nos dois sentidos.

**Solução comentada.** Acrescente `<a href="trilhas/web.html">Detalhes de Web</a>`. Tab avança e Shift+Tab retorna. A regra de foco também alcança o novo link.

[Preparação e fontes oficiais](#/html-css/referencia)
