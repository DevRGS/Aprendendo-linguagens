# Criar elementos, atributos e classes

`document.createElement("li")` cria um elemento ainda fora da página. Preencha seu texto/propriedades e use `append` para inseri-lo no nó pai. `remove` retira um elemento da árvore.

`classList.add`, `remove` e `toggle` alteram classes CSS sem reconstruir uma string inteira de className. A classe só muda a aparência se houver uma regra CSS correspondente. `setAttribute` define um atributo; para propriedades como value e checked de campos, normalmente use a propriedade do elemento para o estado atual.

Não monte HTML concatenando entrada de usuário. Criar nós e atribuir textContent mantém o texto como dado. Para listas grandes há técnicas adicionais, mas primeiro torne a atualização correta e legível.

O exemplo cria todos os nós necessários. Você não precisa criar uma lista na aula anterior; o HTML inicial já fornece o contêiner.

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
<style>.destaque { font-weight: bold; }</style>
<ul id="temas"></ul>
<script>
const item = document.createElement("li");
item.textContent = "Estudar DOM";
item.classList.add("destaque");
item.setAttribute("data-tema", "dom");
document.querySelector("#temas").append(item);
</script>
</body>
</html>
```

## Sua vez

Crie um segundo li com texto `Praticar eventos` e adicione à mesma lista.

<details>
<summary>Ver uma solução comentada</summary>

Use outro createElement, atribua textContent e chame append na lista. Reusar o mesmo nó em append apenas o move; não duplica o elemento.

</details>

## Fontes

- [MDN — createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
- [MDN — Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
