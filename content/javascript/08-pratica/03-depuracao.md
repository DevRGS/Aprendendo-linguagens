# Depurar lendo dados e erros

Quando um programa falha, reproduza o problema e leia a primeira mensagem do console. Confira arquivo e linha; uma linha anterior pode ter deixado de fechar parênteses ou aspas. Erros de sintaxe impedem analisar o script, enquanto erros de execução surgem ao executar um caminho válido sintaticamente.

Use console.log para observar valores e typeof quando uma conversão estiver em dúvida. Um breakpoint no painel Sources/Debugger pausa a execução para inspecionar variáveis. A instrução debugger também pode pedir uma pausa quando as ferramentas estão abertas.

Separe a origem dos problemas: variável não definida pode gerar ReferenceError; acesso de propriedade em null/undefined pode gerar TypeError; JSON inválido pode gerar SyntaxError. Mensagens exatas variam por ambiente, mas o nome do erro e o caminho que o produziu ajudam.

Depois de achar a causa, crie uma verificação que reproduza a entrada e evite a regressão. Não acrescente try/catch só para esconder um erro do seu código. No exemplo, o problema era concatenar uma entrada textual com um número; a correção torna a conversão explícita.

## Execute e observe

```javascript
{
const entrada = "8";
console.log(entrada + 2);
console.log(typeof entrada);
const numero = Number(entrada);
if (!Number.isFinite(numero)) throw new Error("Número inválido");
console.log(numero + 2);
}
```

Saída das chamadas de `console.log`:

```text
82
string
10
```

## Sua vez

Troque a entrada por "oito". Que verificação impede seguir com a conta como se a conversão tivesse funcionado?

<details>
<summary>Ver uma solução comentada</summary>

Number("oito") produz NaN, e Number.isFinite devolve false. O código lança o erro Número inválido. Em um formulário, transforme esse erro numa mensagem de validação apropriada.

</details>

## Fontes

- [MDN — depurar JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Debugging_JavaScript)
- [MDN — Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
- [MDN — controle de fluxo e erros](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
