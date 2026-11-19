# Refinar um tipo antes de usá-lo

O fluxo de controle refina uma variável quando uma verificação elimina possibilidades. Com uma entrada numérica ou textual, teste typeof antes de chamar um método exclusivo de string. O próprio JavaScript executa a verificação quando o programa roda.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
function chave(v: string | number): string {
  if (typeof v === 'string') return v.trim();
  return String(v);
}
console.log(chave('  A  '), chave(7));
```

A saída é A 7. No segundo ramo restou number.

## 2. Investigue uma variação

Retorne o número com duas casas decimais na ramificação numérica.

<details>
<summary>Conferir a variação</summary>

Mude o último return para return v.toFixed(2); a mesma chamada imprime A 7.00.

</details>

## 3. Resolva em outro caso

Escreva uma função para string ou null que devolva 'vazio' quando receber null e texto aparado nos demais casos.

<details>
<summary>Conferir a solução e o resultado</summary>

`function ler(v: string | null) { return v === null ? 'vazio' : v.trim(); }` Com null e ' x ' o resultado é vazio e x.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
