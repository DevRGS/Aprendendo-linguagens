# Guardar dados com localStorage

`localStorage` guarda pares de chave e **string** por origem do site. Dados normalmente sobrevivem à recarga e ao fechamento da aba, mas podem ser apagados pela pessoa, pelo navegador ou por políticas. Não é banco remoto, sincronização entre aparelhos ou garantia de backup.

Use uma chave específica da sua aplicação. Para estruturas, escreva com JSON.stringify e leia com JSON.parse. Uma chave ausente retorna null; dados presentes ainda precisam de validação. O comportamento em file:// não é definido de forma uniforme: prefira o servidor HTTP.

O acesso pode falhar por bloqueio, política ou limite de espaço. Envolva leitura e escrita em try/catch e avise se a pessoa só está trabalhando na memória. Não guarde senhas, tokens ou dados sensíveis nesse armazenamento do exercício.

O exemplo usa uma chave própria e só remove essa chave no final. Não use localStorage.clear em uma origem que contém outros estudos: ele apagaria todas as chaves daquela origem.

## Página completa para praticar

Salve como index.html em sua pasta de exercícios e abra pelo servidor HTTP. O exemplo não depende de arquivos de outra aula.

```html
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Prática de JavaScript</title>
</head>
<body>
<p id="resultado" aria-live="polite"></p>
<script>
const chave = "trilha-js:exemplo";
const resultado = document.querySelector("#resultado");
try {
  localStorage.setItem(chave, JSON.stringify({ tema: "DOM" }));
  const lido = JSON.parse(localStorage.getItem(chave));
  resultado.textContent = lido.tema;
  localStorage.removeItem(chave);
} catch {
  resultado.textContent = "Armazenamento indisponível.";
}
</script>
</body>
</html>
```

## Sua vez

Remova apenas a chamada removeItem, recarregue e veja a chave nas ferramentas de desenvolvedor (área de armazenamento). Depois apague somente a chave do exercício.

<details>
<summary>Ver uma solução comentada</summary>

Use `localStorage.removeItem("trilha-js:exemplo")` para remover só esse exemplo. O projeto final usará outra chave, para não misturar dados.

</details>

## Fontes

- [MDN — localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN — JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
