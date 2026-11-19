# Alinhar com Flexbox

Flexbox organiza filhos de um contêiner ao longo de um eixo principal. Em uma navegação horizontal, gap separa os itens e flex-wrap permite formar outra linha quando faltar espaço.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/14` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

O kit traz uma nav.menu com três links. Mude as regras da folha para trabalhar na navegação.

## E1 · Preveja e experimente

```css
.menu {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}
```

**Confira.** Os três links tornam-se itens flexíveis. Em largura suficiente ficam na mesma linha, separados pelo espaço declarado. Reduza a largura até quebrar a linha.

## E2 · Investigue uma variação

Acrescente flex-direction: column e observe a direção de leitura visual.

**Solução comentada.** Os itens passam a seguir o eixo principal vertical. A ordem dos links no documento continua igual.

## E3 · Aplique em outra situação

Volte à linha horizontal e faça sobrar espaço depois dos links, mantendo o grupo encostado no início.

**Solução comentada.** Use flex-direction: row e justify-content: flex-start. Confira por teclado se a sequência acompanha a ordem do HTML.

[Preparação e fontes oficiais](#/html-css/referencia)
