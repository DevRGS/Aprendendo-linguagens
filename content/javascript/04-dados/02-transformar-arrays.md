# map, filter, reduce e sort

`map` cria um array com os resultados da callback; `filter` cria um array com os elementos que passam no teste. Nenhum desses métodos muda automaticamente os valores do array original, embora uma callback possa ter efeitos se você a escrever assim.

`reduce` combina valores em um acumulador. Forneça um valor inicial apropriado: `reduce((total, n) => total + n, 0)` também funciona para array vazio. Sem valor inicial, reduzir um array vazio lança TypeError.

`sort` altera o próprio array. Sem comparador, ordena segundo a representação textual, e não numericamente. Para números crescentes, use `(a, b) => a - b`. Para preservar o original, copie antes, como `numeros.slice().sort(...)`.

Uma callback com bloco precisa retornar o valor: `n => { n * 2; }` produz undefined para cada item, pois falta return. Dê nomes claros ao acumulador e aos elementos.

## Execute e observe

```javascript
{
const numeros = [2, 10, 3];
console.log(JSON.stringify(numeros.map(n => n * 2)));
console.log(JSON.stringify(numeros.filter(n => n >= 3)));
console.log(numeros.reduce((total, n) => total + n, 0));
console.log(JSON.stringify(numeros.slice().sort((a, b) => a - b)));
console.log(JSON.stringify(numeros));
}
```

Saída das chamadas de `console.log`:

```text
[4,20,6]
[10,3]
15
[2,3,10]
[2,10,3]
```

## Sua vez

Use reduce com valor inicial 0 no array vazio. Depois compare a ordenação de `[2, 10, 3]` com e sem comparador.

<details>
<summary>Ver uma solução comentada</summary>

O total do array vazio é 0. A ordenação padrão de `[2, 10, 3]` é `[10, 2, 3]`; a numérica é `[2, 3, 10]`.

</details>

## Fontes

- [MDN — coleções indexadas](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Indexed_collections)
- [MDN — Array.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
