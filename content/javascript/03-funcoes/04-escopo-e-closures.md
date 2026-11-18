# Escopo e closures

Escopo determina onde um nome pode ser usado. `let` e `const` têm escopo de bloco. Uma função também cria um contexto para parâmetros e nomes locais. Um nome interno pode esconder um nome externo sem modificar o valor externo.

Uma **closure** é uma função junto do acesso ao ambiente léxico em que foi criada. Esse acesso pode continuar depois de a função externa terminar. Ela observa as variáveis capturadas, não apenas uma fotografia congelada de seus valores.

No exemplo, cada chamada de criarContador cria uma variável quantidade própria. A função devolvida continua acessando essa variável. Guardar duas funções obtidas de duas chamadas produz dois contadores independentes.

Use isso para encapsular um estado pequeno, mas evite esconder dependências desnecessárias. Uma função que recebe todos os dados de que precisa geralmente é mais fácil de testar.

## Execute e observe

```javascript
{
function criarContador() {
  let quantidade = 0;
  return () => {
    quantidade += 1;
    return quantidade;
  };
}
const primeiro = criarContador();
const segundo = criarContador();
console.log(primeiro());
console.log(primeiro());
console.log(segundo());
}
```

Saída das chamadas de `console.log`:

```text
1
2
1
```

## Sua vez

Chame segundo novamente. Ele acompanha o primeiro ou mantém sua própria contagem?

<details>
<summary>Ver uma solução comentada</summary>

A próxima chamada de segundo devolve 2. Cada invocação de criarContador criou um ambiente separado, embora ambas usem a mesma definição de função.

</details>

## Fontes

- [MDN — closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures)
- [MDN — sintaxe e tipos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Grammar_and_types)
