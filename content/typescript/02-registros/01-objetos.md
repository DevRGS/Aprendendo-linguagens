# Descrever a forma de uma tarefa

Um alias nomeia uma estrutura. Ao receber uma Tarefa, a função pode consultar os campos obrigatórios e seus tipos. Use os nomes do recurso da API de estudos para que o modelo e o JSON representem o mesmo conceito.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
type Tarefa = { id: number; titulo: string; concluida: boolean };
const item: Tarefa = { id: 7, titulo: 'Ler', concluida: false };
console.log(item.id, item.titulo);
```

A saída é 7 Ler. A propriedade concluida guarda um estado lógico.

## 2. Investigue uma variação

Marque item como concluído e imprima o valor.

<details>
<summary>Conferir a variação</summary>

Depois da criação, use item.concluida = true; console.log(item.concluida); a saída adicional é true.

</details>

## 3. Resolva em outro caso

Escreva uma função que devolva o título de qualquer Tarefa recebida.

<details>
<summary>Conferir a solução e o resultado</summary>

function rotulo(t: Tarefa): string { return t.titulo; } Com o item do exemplo devolve Ler.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/objects.html)
