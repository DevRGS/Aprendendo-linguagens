# Operadores e igualdade

`+`, `-`, `*`, `/` e `**` fazem operações aritméticas; `%` calcula o resto (seu sinal acompanha o dividendo). Multiplicação tem precedência maior que soma; parênteses deixam a intenção clara.

`===` compara sem converter tipos; `!==` é a desigualdade estrita. `==`/`!=` seguem regras de coerção e podem surpreender, como em `0 == false`. Para as decisões desta trilha, prefira a igualdade estrita e converta a entrada explicitamente quando necessário.

`&&`, `||` e `!` são operadores lógicos com avaliação de curto-circuito. `&&`/`||` **retornam operandos**, não obrigatoriamente booleanos. `!` converte para booleano e inverte. Valores como `false`, 0, string vazia, null, undefined e NaN são falsy; arrays e objetos vazios são truthy.

Comparar objetos com `===` verifica identidade da referência, não igualdade de conteúdo. Dois objetos escritos separadamente não se tornam iguais só porque suas propriedades são parecidas.

## Execute e observe

```javascript
{
console.log(2 + 3 * 4);
console.log("5" === 5);
console.log("5" == 5);
console.log(Boolean([]));
console.log("" || "padrão");
}
```

Saída das chamadas de `console.log`:

```text
14
false
true
true
padrão
```

## Sua vez

Compare `0 === false` e `0 == false`. Explique por que escolher uma comparação muda o resultado.

<details>
<summary>Ver uma solução comentada</summary>

A comparação estrita resulta em false; a comparação abstrata faz coerções e resulta em true. Não é uma mudança no valor de 0: é uma regra diferente de comparação.

</details>

## Fontes

- [MDN — expressões e operadores](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators)
