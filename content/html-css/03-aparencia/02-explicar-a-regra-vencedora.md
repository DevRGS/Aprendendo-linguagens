# Explicar a regra vencedora

Quando duas declarações de mesma origem e camada competem pela mesma propriedade, a especificidade ajuda a decidir. Se também empatarem em especificidade, vence a última nessa folha. Algumas propriedades, como cor do texto, ainda podem ser herdadas de um ancestral.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/10` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

A página contém main com um título e um p de classe aviso. Substitua estilo.css pelas três regras.

## E1 · Preveja e experimente

```css
main { color: navy; }
.aviso { color: darkred; }
p { color: green; }
```

**Confira.** O título herda a cor de main. O parágrafo fica vermelho-escuro. No inspetor, a declaração green aparece sobrescrita pela classe mais específica.

## E2 · Investigue uma variação

Acrescente outra regra .aviso ao fim com color: purple. Por que a página muda?

**Solução comentada.** As regras de classe têm especificidade igual. Na mesma origem e camada, a posterior vence. O painel Computado passa a indicar roxo.

## E3 · Aplique em outra situação

Faça o parágrafo herdar explicitamente a cor de main e confira o valor final.

**Solução comentada.** Troque o valor da última declaração da classe por inherit. O texto acompanha navy do ancestral. Mudar a cor de main também muda o parágrafo.

[Preparação e fontes oficiais](#/html-css/referencia)
