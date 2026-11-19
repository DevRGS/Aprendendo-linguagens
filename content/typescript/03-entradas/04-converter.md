# Converter uma entrada ao domínio

Depois de validar o tipo, normalize os dados que o domínio aceita. Transforme o texto uma vez e devolva o valor normalizado. Na API, erros de validação viram resposta 400; a camada de persistência só recebe entradas válidas.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
function normalizar(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length >= 1 && t.length <= 120 && !t.includes('\u0000') ? t : null;
}
console.log(normalizar('  Git '), normalizar(' '));
```

A saída é Git null. O limite usa length como no contrato original da API em JavaScript.

## 2. Investigue uma variação

Teste 'x'.repeat(120) e 'x'.repeat(121).

<details>
<summary>Conferir a variação</summary>

O primeiro valor é aceito com comprimento 120; o segundo resulta em null.

</details>

## 3. Resolva em outro caso

Converta um valor desconhecido em Entrada com titulo, devolvendo null na falha. Preserve o texto aparado.

<details>
<summary>Conferir a solução e o resultado</summary>

Chame const titulo = normalizar(v); retorne titulo === null ? null : { titulo };. Para ' Ler ' recebe-se { titulo:'Ler' }.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
