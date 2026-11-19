# Distribuir cartões em grade

Grid oferece linhas e colunas compartilhadas. O contêiner define as colunas e o navegador distribui os cartões na ordem do documento. Uma unidade fr representa uma fração do espaço disponível para distribuir entre as trilhas flexíveis.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/15` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

Use os três artigos filhos da div.colecao fornecida. Substitua as regras em estilo.css.

## E1 · Preveja e experimente

```css
.colecao {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}
article { border: 1px solid navy; padding: 0.5rem; }
```

**Confira.** Os dois primeiros cartões dividem a primeira linha. O terceiro inicia a segunda. O inspetor de grades permite desenhar os limites das colunas.

## E2 · Investigue uma variação

Troque repeat(2, ...) por repeat(3, ...) em uma janela larga.

**Solução comentada.** Todos os três artigos passam a ocupar a primeira linha; o espaço das colunas é redistribuído.

## E3 · Aplique em outra situação

Faça o primeiro cartão ocupar a linha toda e deixe os demais seguirem o fluxo.

**Solução comentada.** Retorne para duas colunas e acrescente `.colecao > :first-child { grid-column: 1 / -1; }`. O primeiro vai da primeira até a última linha de grade no eixo das colunas.

[Preparação e fontes oficiais](#/html-css/referencia)
