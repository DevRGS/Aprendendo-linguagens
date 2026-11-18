# Selecionar elementos e alterar texto

O **DOM** representa o documento como uma árvore de nós. `document.querySelector("#titulo")` encontra o primeiro elemento que combina com o seletor CSS; se não houver, devolve null. `querySelectorAll` devolve uma NodeList estática, que pode ser percorrida com for...of.

Use `textContent` para inserir texto. O conteúdo não é interpretado como HTML: uma frase contendo `<b>` aparece literalmente. `innerHTML`, por outro lado, interpreta marcação e não deve receber texto digitado por alguém sem tratamento apropriado.

Um elemento só pode ser encontrado depois de ser criado/analisado. Nesta página o script está no fim do body. Ao usar arquivos separados, `defer` em script clássico externo ou módulos evita executar a seleção antes do HTML estar analisado.

Ler uma propriedade de null causa erro. Quando um elemento é opcional, teste sua existência; quando deveria ser obrigatório, confira seletor e HTML, em vez de esconder um erro de estrutura.

## Página completa para praticar

Salve como `index.html` em uma pasta nova de estudo. Abra a página no navegador (pelo servidor local quando indicado). O exemplo fornece todos os elementos usados.

```html
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Prática de JavaScript</title>
</head>
<body>
<h1 id="titulo">Antes</h1>
<p class="nota">Primeira</p>
<p class="nota">Segunda</p>
<script>
const titulo = document.querySelector("#titulo");
titulo.textContent = "JavaScript no DOM";
for (const nota of document.querySelectorAll(".nota")) {
  nota.textContent = "Revisada";
}
</script>
</body>
</html>
```

## Sua vez

Troque o título por um texto contendo `<strong>Olá</strong>`. Ele deve virar uma tag ou aparecer literalmente?

<details>
<summary>Ver uma solução comentada</summary>

Com textContent, os sinais e o nome da tag aparecem como texto. Isso é útil para mostrar dados sem tratá-los como marcação executável.

</details>

## Fontes

- [MDN — Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
