# Sua primeira página com JavaScript

Crie uma pasta nova, salve o exemplo abaixo como **index.html** e abra no navegador. Ele usa um script clássico dentro do próprio HTML; para esse primeiro caso, abrir o arquivo diretamente costuma ser suficiente.

O `h1` contém o título. O botão tem um `id`, que permite encontrá-lo. `document.querySelector` busca o elemento; `addEventListener` registra uma função que só será chamada ao clicar. Você estudará seleção e eventos nos módulos seguintes.

O script está **depois dos elementos**, para que eles já existam quando forem consultados. Ao separar o JavaScript em `app.js`, uma alternativa é colocar no head `<script src="app.js" defer></script>`: o arquivo externo clássico é executado depois de o HTML ser analisado, antes de DOMContentLoaded. O atributo `defer` não tem esse efeito em script clássico inline.

Recarregue a página depois de salvar alterações. Se o botão não funcionar, veja o console e confira o nome do arquivo e o `id` usado. O código desta aula é um exemplo completo, não precisa de arquivos de outra aula.

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
<h1 id="mensagem">Pronto para começar</h1>
<button id="saudar" type="button">Saudar</button>
<script>
const botao = document.querySelector("#saudar");
botao.addEventListener("click", () => {
  document.querySelector("#mensagem").textContent = "Olá, JavaScript!";
});
</script>
</body>
</html>
```

## Sua vez

Mude a mensagem mostrada após o clique e o texto do botão. Salve e recarregue.

<details>
<summary>Ver uma solução comentada</summary>

Altere o texto passado a `textContent` e o conteúdo entre as tags do botão. A função é passada ao evento; não a execute antecipadamente.

</details>

## Fontes

- [MDN — introdução ao JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Introduction)
- [MDN — Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN — addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
