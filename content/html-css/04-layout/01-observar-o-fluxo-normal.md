# Observar o fluxo normal

Sem uma técnica especial de layout, elementos de bloco como os artigos aparecem um após o outro na direção de bloco. Texto e elementos em linha compartilham o espaço de uma linha enquanto couberem.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/13` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

O catálogo contém três artigos, cada um com título e resumo. A classe colecao envolve os três. Edite estilo.css.

## E1 · Preveja e experimente

```css
article { border: 1px solid #384455; padding: 0.5rem; }
article + article { margin-top: 1rem; }
```

**Confira.** Os três artigos formam uma coluna. O seletor com + coloca separação acima dos artigos imediatamente precedidos por outro artigo.

## E2 · Investigue uma variação

Duplique o resumo do segundo cartão até ocupar três linhas. Observe o terceiro cartão.

**Solução comentada.** Salve e recarregue. O segundo artigo cresce e empurra o terceiro para baixo. Nenhuma altura fixa é necessária.

## E3 · Aplique em outra situação

Acrescente um quarto artigo após o terceiro e confira se também recebe espaçamento.

**Solução comentada.** Insira `<article><h2>Projeto</h2><p>Página final.</p></article>` dentro de colecao. A regra de irmãos aplica a margem ao novo artigo.

[Preparação e fontes oficiais](#/html-css/referencia)
