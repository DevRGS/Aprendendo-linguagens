# Descobrir tipos pela inicialização

Quando você inicializa uma variável, o compilador usa o valor para inferir um tipo. Com let, um número inicial indica uma variável numérica que pode receber outros números. O tipo de uma expressão também explica por que somar texto e número pode concatenar.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
let minutos = 10;
minutos += 5;
console.log(minutos);
```

A saída é 15. Passe o cursor sobre minutos no editor ou no Playground para ver number.

## 2. Investigue uma variação

Troque 5 por 0.5. A mudança exige anotar minutos?

<details>
<summary>Conferir a variação</summary>

Não. Os dois valores pertencem a number. O resultado é 10.5.

</details>

## 3. Resolva em outro caso

Preveja o efeito de iniciar minutos como '10' e manter += 5. Depois execute.

<details>
<summary>Conferir a solução e o resultado</summary>

A saída é 105. O operador concatena a string e a representação de 5. Use número desde a origem para obter soma.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/type-inference.html)
