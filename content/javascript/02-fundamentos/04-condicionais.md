# Decisões com if e switch

`if (condicao)` executa um bloco quando a condição é truthy. `else` cobre o outro caminho. `else if` testa outra condição quando a anterior foi falsa. Use chaves para tornar os blocos claros e evitar que uma linha pareça pertencer ao ramo errado.

Compare a entrada antes de decidir: `idade >= 18` é uma condição; `idade = 18` é uma atribuição e não deve substituí-la por engano. O operador ternário `condicao ? valorA : valorB` é útil para escolher um valor curto; evite cadeias difíceis de ler.

`switch` compara o valor com os casos usando igualdade estrita. `break` encerra o caso; sem ele, a execução pode continuar pelo caso seguinte. `default` cobre valores sem caso correspondente.

O exemplo classifica uma nota. As regras da aplicação precisam dizer quais faixas são válidas; a linguagem apenas executa as condições que você escreveu.

## Execute e observe

```javascript
{
const nota = 8;
if (nota >= 7) {
  console.log("Aprovado");
} else {
  console.log("Revisar");
}
const mensagem = nota >= 7 ? "Continuar" : "Tentar de novo";
console.log(mensagem);
}
```

Saída das chamadas de `console.log`:

```text
Aprovado
Continuar
```

## Sua vez

Mude a nota para 6 e preveja as duas mensagens antes de executar.

<details>
<summary>Ver uma solução comentada</summary>

As mensagens passam a `Revisar` e `Tentar de novo`, pois 6 não satisfaz `nota >= 7`.

</details>

## Fontes

- [MDN — controle de fluxo e erros](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [MDN — expressões e operadores](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators)
