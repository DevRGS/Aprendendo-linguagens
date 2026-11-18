# Eventos e funções de resposta

`elemento.addEventListener("click", funcao)` registra uma função para responder ao evento. Passe a função; escrever `funcao()` a executa agora e passa seu retorno. A função recebe um objeto de evento com informações sobre o que aconteceu.

`event.target` é o alvo original do evento; `event.currentTarget` é o elemento cujo listener está sendo executado. Um clique em um span dentro do botão pode ter o span como target e o botão como currentTarget. Muitos eventos propagam pela árvore (bubbling).

Use botões reais com type explícito para ações. Eles já funcionam com teclado; um div clicável exige trabalho adicional para oferecer o mesmo comportamento. `preventDefault` cancela a ação padrão quando o evento permite; ele não é a mesma coisa que interromper propagação.

O exemplo atualiza uma variável e depois a interface. Registrar o evento não dispara o clique, e atualizar a variável não altera o texto automaticamente: a função escreve o novo valor no DOM.

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
<button id="somar" type="button">Somar</button>
<p id="contador" aria-live="polite">0</p>
<script>
let total = 0;
const botao = document.querySelector("#somar");
botao.addEventListener("click", () => {
  total += 1;
  document.querySelector("#contador").textContent = String(total);
});
</script>
</body>
</html>
```

## Sua vez

Acrescente um botão para zerar o contador. Ele precisa mudar tanto o estado quanto o texto.

<details>
<summary>Ver uma solução comentada</summary>

Crie um botão type="button", registre click, atribua `total = 0` e atualize textContent para `"0"`. Não registre a chamada de uma função já executada.

</details>

## Fontes

- [MDN — addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN — Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
