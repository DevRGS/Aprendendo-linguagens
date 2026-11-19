# Ler e corrigir um diagnóstico

A mensagem de incompatibilidade identifica o tipo recebido e o esperado. Reproduza primeiro a versão válida. Depois introduza um único erro intencional, execute npm run check e leia o caminho, a linha e as duas partes do diagnóstico.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
let meta: number = 20;
meta = 40;
console.log(meta);
```

O resultado é 40. A atribuição permanece numérica.

## 2. Investigue uma variação

Provoque um erro substituindo 40 por '40' com aspas. Rode o check e interprete a mensagem.

<details>
<summary>Conferir a variação</summary>

O compilador aponta que string não pode ser atribuída a number (TS2322). Retire as aspas para corrigir.

</details>

## 3. Resolva em outro caso

Converta uma entrada textual '15' em número e rejeite 'quinze' antes de gravar meta.

<details>
<summary>Conferir a solução e o resultado</summary>

Use const n = Number('15'); if (Number.isFinite(n)) meta = n; Troque o texto por 'quinze'; o teste falha e meta mantém seu valor.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/tsconfig/noEmitOnError.html)
