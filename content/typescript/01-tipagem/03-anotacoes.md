# Declarar parâmetros e retorno

Em uma função exportada, as anotações explicam o contrato para quem chama. Um parâmetro recebe tipo depois de dois-pontos. A anotação após os parênteses descreve o retorno e permite verificar se todos os caminhos esperados entregam um valor compatível.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
function etiqueta(titulo: string, minutos: number): string {
  return titulo + ' (' + minutos + ' min)';
}
console.log(etiqueta('Git', 15));
```

A saída é Git (15 min). A chamada combina uma string e um número na ordem declarada.

## 2. Investigue uma variação

Mantenha a assinatura e mude o título e a duração para SQL e 30.

<details>
<summary>Conferir a variação</summary>

etiqueta('SQL', 30) retorna SQL (30 min).

</details>

## 3. Resolva em outro caso

Crie uma função dobra que receba um número e devolva o dobro. Teste com 3.

<details>
<summary>Conferir a solução e o resultado</summary>

function dobra(n: number): number { return n * 2; } seguida de console.log(dobra(3)) imprime 6.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/functions.html)
