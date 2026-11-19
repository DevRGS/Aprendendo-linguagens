# Adaptar à largura

Começar por uma coluna preserva a leitura em telas estreitas. Uma consulta de mídia pode introduzir outra coluna quando a largura comportar textos e controles. O ponto de mudança deve responder ao conteúdo que precisa caber.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/16` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

A página tem viewport configurada, três cartões e links. Na simulação de aparelho confira 390 px e depois 1000 px.

## E1 · Preveja e experimente

```css
.colecao { display: grid; gap: 1rem; grid-template-columns: 1fr; }
article { min-width: 0; overflow-wrap: anywhere; }
@media (min-width: 48rem) {
  .colecao { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
```

**Confira.** Com o tamanho padrão inicial de fonte de 16 px, 390 px mostra uma coluna e 1000 px mostra duas. O navegador reavalia a consulta quando a largura muda.

## E2 · Investigue uma variação

Insira uma palavra sem espaços no resumo e teste em 390 px.

**Solução comentada.** Use uma palavra com 80 letras. overflow-wrap: anywhere permite que o texto quebre dentro do cartão.

## E3 · Aplique em outra situação

Aumente o zoom para 200% e percorra os links com Tab. Anote qual cartão está focado e se há rolagem lateral.

**Solução comentada.** A grade pode voltar a uma coluna. O foco deve continuar alcançável. Havendo estouro, inspecione a largura do filho que excede o cartão e procure larguras fixas.

[Preparação e fontes oficiais](#/html-css/referencia)
