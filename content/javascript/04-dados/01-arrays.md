# Arrays, índices e mutação

Um array guarda uma sequência de valores. Os índices começam em 0 e `length` informa o comprimento. Consultar uma posição inexistente costuma devolver undefined, mas isso não é uma validação de que o dado está correto.

`push` acrescenta no fim; `pop` retira e devolve o último valor. `includes` verifica presença; `indexOf` localiza um índice ou devolve -1. `slice` produz uma cópia de parte do array; `splice` altera o array, removendo/inserindo elementos.

`const` mantém a associação do nome, não torna o array imutável. `const temas = []` pode receber `temas.push("JS")`; não pode ser reatribuído com `temas = outroArray`.

Evite `delete array[0]` para remover e deslocar posições: ele deixa um buraco, sem encurtar o array. Prefira operações que expressem a intenção, como splice ou filter.

## Execute e observe

```javascript
{
const temas = ["HTML", "JavaScript"];
temas.push("DOM");
console.log(temas[0]);
console.log(temas.length);
console.log(temas.pop());
console.log(JSON.stringify(temas));
}
```

Saída das chamadas de `console.log`:

```text
HTML
3
DOM
["HTML","JavaScript"]
```

## Sua vez

Copie o array com slice, acrescente um item na cópia e compare os comprimentos.

<details>
<summary>Ver uma solução comentada</summary>

`const copia = temas.slice(); copia.push("CSS");` deixa a cópia com 3 itens e o original com 2. Elementos que fossem objetos ainda seriam compartilhados numa cópia rasa.

</details>

## Fontes

- [MDN — coleções indexadas](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Indexed_collections)
