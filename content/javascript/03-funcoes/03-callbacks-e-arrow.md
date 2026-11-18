# Arrow functions e callbacks

Funções podem ser guardadas em variáveis e passadas a outras funções. Uma função passada para ser chamada por outra parte do código é uma **callback**. Ela não é necessariamente assíncrona: uma função pode chamar a callback imediatamente.

Uma arrow function curta pode retornar uma expressão: `numero => numero * 2`. Com corpo de bloco, escreva return: `numero => { return numero * 2; }`. Para retornar um objeto literal numa expressão, envolva-o em parênteses: `nome => ({ nome })`.

Passar `dobrar` fornece a função; passar `dobrar(3)` executa e fornece seu resultado. Essa diferença aparece nos eventos de botão: registre a função para que o navegador a chame depois.

Arrows não têm this próprio; capturam o this do contexto externo. Por isso não são uma troca universal por métodos de objeto, tema retomado na aula de classes.

## Execute e observe

```javascript
{
const dobrar = numero => numero * 2;
function aplicar(valor, operacao) {
  return operacao(valor);
}
console.log(aplicar(4, dobrar));
const triplicar = numero => {
  return numero * 3;
};
console.log(triplicar(3));
}
```

Saída das chamadas de `console.log`:

```text
8
9
```

## Sua vez

Passe a aplicar uma arrow que soma 5 ao valor 4.

<details>
<summary>Ver uma solução comentada</summary>

`console.log(aplicar(4, valor => valor + 5));` imprime 9. A callback é chamada por aplicar, durante a mesma execução, sem temporizador.

</details>

## Fontes

- [MDN — funções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions)
- [MDN — arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
