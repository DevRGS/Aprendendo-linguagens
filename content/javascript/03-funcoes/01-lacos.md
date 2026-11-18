# Repetição com for e while

`for` reúne início, condição e atualização: `for (let i = 0; i < 3; i += 1)`. A condição é conferida antes de cada iteração. `while` também testa antes; `do...while` executa o corpo ao menos uma vez e testa depois.

Garanta que a condição possa deixar de ser verdadeira. Um laço infinito ocupa a execução e pode travar a aba. `break` encerra o laço; `continue` pula para a próxima iteração.

`for...of` percorre os valores de um iterável, como um array. Não confunda com `for...in`, que percorre nomes de propriedades enumeráveis e não é a escolha padrão para valores de arrays. Você estudará arrays em seguida.

Uma variável acumuladora começa com um valor apropriado, como 0 para soma. Atualize-a a cada passo e confira onde imprime: dentro do laço você vê estados parciais; depois dele, o total final.

## Execute e observe

```javascript
{
let total = 0;
for (let numero = 1; numero <= 3; numero += 1) {
  total += numero;
}
console.log(total);
for (const tema of ["ler", "praticar"]) {
  console.log(tema);
}
}
```

Saída das chamadas de `console.log`:

```text
6
ler
praticar
```

## Sua vez

Mude o primeiro laço para somar de 1 a 5.

<details>
<summary>Ver uma solução comentada</summary>

Mude a condição para `numero <= 5`; o resultado é 15. Não é preciso alterar o valor inicial de total.

</details>

## Fontes

- [MDN — laços e iteração](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration)
