# Descrever uma operação assíncrona

Uma função async entrega uma Promise. Declare o tipo do valor resolvido entre os sinais de menor e maior. No módulo ESM, await pode aparecer no nível superior e devolve o valor resolvido para o fluxo atual. Uma promessa rejeitada requer tratamento de erro.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`.

## 1. Demonstração

```typescript
async function buscar(id: number): Promise<string> {
  return 'Tarefa ' + id;
}
const titulo = await buscar(7);
console.log(titulo);
```

A saída é Tarefa 7. Em tipos/laboratorio.ts a configuração do pacote trata o arquivo como módulo.

## 2. Investigue uma variação

Faça buscar devolver um número e explicite o novo retorno.

<details>
<summary>Conferir a variação</summary>

Use `Promise<number>` e return id * 2;. Para o argumento 7 a chamada com await entrega 14.

</details>

## 3. Resolva em outro caso

Para id menor que 1, lance um Error e demonstre a rejeição com try/catch.

<details>
<summary>Conferir a solução e o resultado</summary>

Insira if (id < 1) throw new Error('id inválido'); em buscar. Envolva await buscar(0) em try e no catch use console.log('recusado'); o terminal mostra recusado.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/functions.html)
