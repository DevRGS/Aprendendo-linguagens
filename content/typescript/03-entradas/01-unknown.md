# Receber dados desconhecidos

Dados de fora do programa podem ter forma diferente da declarada pelo cliente. Atribua o resultado do parse a unknown para obrigar quem lê a verificar sua estrutura. JSON válido sintaticamente também pode representar null, números ou arrays.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
const corpo: unknown = JSON.parse('"  Ler  "');
if (typeof corpo === 'string') console.log(corpo.trim());
else console.log('Tipo inesperado');
```

A saída é Ler. O teste protege a chamada de trim.

## 2. Investigue uma variação

Mude o conteúdo passado ao parse para o texto JSON 7.

<details>
<summary>Conferir a variação</summary>

Use JSON.parse('7'); o programa imprime Tipo inesperado.

</details>

## 3. Resolva em outro caso

Receba JSON de texto ou booleano. Imprima sim para true e outro para valores dos demais tipos.

<details>
<summary>Conferir a solução e o resultado</summary>

const x: unknown = JSON.parse('true'); console.log(x === true ? 'sim' : 'outro'); Com 'null' na chamada a saída vira outro.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/functions.html)
