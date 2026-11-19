# Usar a validação nativa

O navegador conhece regras simples de preenchimento e formato. A validação ao tentar enviar o formulário conduz o foco ao primeiro campo inválido. Neste laboratório só há navegação local para uma página de confirmação.

## Prepare a prática

<a href="content/html-css/projetos/projeto.zip" download>Baixar material da trilha e projeto</a>

Extraia o kit e abra a pasta `aulas/08` no editor de texto. Abra `index.html` no navegador. Salve o arquivo editado em UTF-8 e recarregue a página após cada mudança. Faça E1, E2 e E3 na mesma cópia.

O destino obrigado.html acompanha o material. O campo abaixo não tem atributo name, portanto seu conteúdo não compõe os parâmetros da navegação. Use dados fictícios.

## E1 · Preveja e experimente

```html
<h1>Conferência de contato</h1>
<form action="obrigado.html" method="get">
  <label for="email">E-mail fictício (obrigatório)</label>
  <input id="email" type="email" required>
  <button>Conferir</button>
</form>
```

**Confira.** Ative Conferir com o campo vazio. O navegador mantém a página, foca o controle e exibe sua mensagem localizada. Com teste@example.org, a página de confirmação abre.

## E2 · Investigue uma variação

Envie a palavra contato. O que muda em relação ao valor vazio?

**Solução comentada.** O controle está preenchido mas falha na regra do tipo email. Substitua por contato@example.org e repita.

## E3 · Aplique em outra situação

Acrescente um segundo campo opcional e garanta que ele também não envia dados no laboratório.

**Solução comentada.** Antes do botão, use `<label for="nota">Nota opcional</label><input id="nota">`. Sem required ele aceita vazio; sem name o valor não entra na consulta.

[Preparação e fontes oficiais](#/html-css/referencia)
