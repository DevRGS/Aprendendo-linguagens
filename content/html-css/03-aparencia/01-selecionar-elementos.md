# Selecionar elementos

Uma regra CSS combina um seletor com declarações de apresentação. O seletor de tipo encontra todas as ocorrências de um elemento; o de classe permite destacar somente um grupo definido por quem escreveu o documento.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/09` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

O corpo contém dois parágrafos. Só o primeiro tem class="aviso". Edite estilo.css, que já está ligado ao index.html pelo elemento link.

## E1 · Preveja e experimente

```css
p { color: navy; }
.aviso { font-weight: bold; }
```

**Confira.** Ambos aparecem em azul-marinho. Só o primeiro aparece em negrito. Inspecione as regras que correspondem a cada parágrafo.

## E2 · Investigue uma variação

Remova o ponto de .aviso e observe o efeito.

**Solução comentada.** O seletor aviso passaria a procurar elementos com esse nome e não encontra os parágrafos. Reponha o ponto para selecionar pela classe.

## E3 · Aplique em outra situação

Faça apenas o segundo parágrafo receber sublinhado usando uma classe nova.

**Solução comentada.** No HTML acrescente class="revisao" ao segundo p e no CSS escreva `.revisao { text-decoration: underline; }`. O primeiro permanece em negrito.

[Preparação e fontes oficiais](#/html-css/referencia)
