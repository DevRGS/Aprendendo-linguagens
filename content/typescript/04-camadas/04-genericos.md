# Reaproveitar um resultado com genéricos

Um parâmetro de tipo conserva a forma do resultado e deixa o valor de sucesso variar. O ramo de erro pode ser compartilhado entre funções que produzem dados distintos. A etiqueta ok continua sendo o ponto para escolher o ramo antes do acesso.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`.

## 1. Demonstração

```typescript
import type { Resultado } from './tarefas.js';
function sucesso<T>(valor: T): Resultado<T> { return { ok: true, valor }; }
const item = sucesso(7);
if (item.ok) console.log(item.valor + 1);
```

A saída é 8. O argumento 7 permite inferir que o resultado de sucesso guarda um número.

## 2. Investigue uma variação

Use sucesso('SQL') e imprima o valor em minúsculas após testar ok.

<details>
<summary>Conferir a variação</summary>

Use if (item.ok) console.log(item.valor.toLowerCase());. A saída é sql.

</details>

## 3. Resolva em outro caso

Escreva uma função que receba `Resultado<number>` e devolva o dobro no sucesso ou zero na falha.

<details>
<summary>Conferir a solução e o resultado</summary>

function dobro(r: `Resultado<number>`) { return r.ok ? r.valor * 2 : 0; } Com {ok:false, erro:'Ausente'} o retorno é 0.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/generics.html)
