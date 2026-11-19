# Descrever imagens

Uma alternativa textual transmite a informação da imagem no contexto. Uma imagem puramente decorativa pode ter alt vazio. Um src válido continua necessário para quem a vê.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/04` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

O arquivo mapa.svg desenha três etapas de uma rota de estudo. Insira o exemplo no corpo. O nome da imagem não explica a sequência.

## E1 · Preveja e experimente

```html
<h1>Roteiro de estudos</h1>
<img src="mapa.svg" alt="Percurso: HTML, depois CSS, depois projeto.">
```

**Confira.** A imagem aparece. A árvore de acessibilidade apresenta o conteúdo de alt como nome da imagem.

## E2 · Investigue uma variação

Troque src temporariamente para ausente.svg. Examine o nome acessível e corrija o caminho.

**Solução comentada.** O arquivo para de carregar. O texto alternativo ainda contém a ordem das etapas. Restaure mapa.svg para recuperar o desenho.

## E3 · Aplique em outra situação

Acrescente o mesmo desenho após um parágrafo que já explica toda a sequência, agora só como repetição decorativa.

**Solução comentada.** Use `<p>HTML, depois CSS, depois projeto.</p><img src="mapa.svg" alt="">`. O segundo desenho pode ser ignorado por leitores de tela.

[Preparação e fontes oficiais](#/html-css/referencia)
