# Variáveis, const e tipos

Use `const` quando o nome não será reatribuído e `let` quando precisar trocar seu valor. Declare com um nome que indique a intenção. JavaScript possui tipagem dinâmica: o tipo pertence ao valor e uma variável com `let` pode receber valores de tipos diferentes.

Tipos primitivos incluem `number`, `string`, `boolean`, `undefined`, `null`, `bigint` e `symbol`. Objetos incluem arrays e funções. `typeof` ajuda a observar tipos, mas tem exceções históricas: `typeof null` resulta em `"object"`; isso não torna null um objeto que você pode acessar.

Uma variável declarada com `let` sem valor começa como `undefined`. `null` costuma representar uma ausência escolhida explicitamente. Não confunda os dois com texto `"null"` ou `"undefined"`.

> [!IMPORTANT]
> `const` impede reatribuir o nome, mas não congela o conteúdo de um objeto/array. Você verá essa diferença no módulo de dados. `var` existe em código antigo, mas tem regras de escopo diferentes; os exemplos novos usam let/const.

## Execute e observe

```javascript
{
let pontos = 5;
pontos = pontos + 2;
const curso = "JavaScript";
let pendente;
console.log(pontos);
console.log(typeof curso);
console.log(pendente);
console.log(typeof null);
}
```

Saída das chamadas de `console.log`:

```text
7
string
undefined
object
```

## Sua vez

Declare `let tentativas = 1`, aumente para 2 e imprima. Troque por `const` e explique por que a reatribuição falharia.

<details>
<summary>Ver uma solução comentada</summary>

`let` permite reatribuição. `const` exige um valor inicial e não permite trocar a associação do nome depois. O erro de reatribuição é um TypeError.

</details>

## Fontes

- [MDN — sintaxe e tipos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Grammar_and_types)
