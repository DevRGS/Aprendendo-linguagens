# Parâmetros e retorno de funções

Uma função reúne um comportamento e pode receber dados por **parâmetros**. Os valores passados na chamada são **argumentos**. `return` devolve o resultado e encerra aquela execução da função.

Imprimir e retornar são coisas diferentes. `console.log` ajuda a observar; quem chama uma função só recebe o que ela retorna. Sem `return` explícito, ou com `return;`, o resultado é undefined.

Parâmetros podem ter padrão, como `taxa = 0`. Ele é usado quando o argumento é omitido ou undefined, mas não quando é null. Validação de valores continua sendo responsabilidade do código.

Na sintaxe `function nome(...)`, a declaração é disponibilizada no escopo antes de sua linha ser executada. Isso não vale da mesma forma para uma variável const que só receberá uma função depois; não use uma inicialização antes de ela acontecer.

## Execute e observe

```javascript
{
function calcularTotal(preco, quantidade = 1) {
  return preco * quantidade;
}
console.log(calcularTotal(10, 3));
console.log(calcularTotal(10));
}
```

Saída das chamadas de `console.log`:

```text
30
10
```

## Sua vez

Crie `dobrar(numero)` e use o resultado para somar 1 fora da função.

<details>
<summary>Ver uma solução comentada</summary>

`function dobrar(numero) { return numero * 2; }` permite `console.log(dobrar(4) + 1);`, que imprime 9. Apenas imprimir dentro de dobrar não devolveria o valor necessário.

</details>

## Fontes

- [MDN — funções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions)
