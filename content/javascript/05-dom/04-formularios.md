# Formulários e validação de entrada

Um formulário pode ser enviado pelo botão ou pela tecla Enter. Ouça **submit no form**, em vez de depender só do click de um botão. `event.preventDefault()` impede a navegação padrão para você tratar os dados nessa página.

Associe label e input com for/id. `input.value` é texto, mesmo em muitos campos usados para números. Leia, faça trim quando apropriado e confira vazio antes de converter. As regras de HTML (`required`, tipo e limites) ajudam no navegador; validar novamente no código protege os caminhos que não passam pela interação normal.

Essa validação é local e não substitui validação no servidor em aplicações que enviam dados para um backend. Aqui o exemplo apenas exibe uma saudação, sem enviar requisições.

`textContent` exibe o nome como texto, inclusive quando contém sinais de marcação. Uma mensagem com aria-live permite anunciar o resultado sem obrigar o usuário a procurar uma mudança visual.

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
<form id="formulario">
<label for="nome">Seu nome</label>
<input id="nome" name="nome" required maxlength="60">
<button type="submit">Saudar</button>
</form>
<p id="resultado" aria-live="polite"></p>
<script>
const formulario = document.querySelector("#formulario");
formulario.addEventListener("submit", evento => {
  evento.preventDefault();
  const nome = document.querySelector("#nome").value.trim();
  const resultado = document.querySelector("#resultado");
  if (!nome) {
    resultado.textContent = "Digite seu nome.";
    return;
  }
  resultado.textContent = `Olá, ${nome}!`;
});
</script>
</body>
</html>
```

## Sua vez

Teste um nome com espaços nas pontas e uma entrada só de espaços. Observe como a regra muda depois do trim.

<details>
<summary>Ver uma solução comentada</summary>

Um nome válido é exibido sem os espaços externos. Uma entrada só de espaços resulta em `Digite seu nome.` quando o handler é executado; o HTML também pode impedir envios vazios na interação normal.

</details>

## Fontes

- [MDN — evento submit](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event)
- [MDN — Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
