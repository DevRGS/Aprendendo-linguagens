# Modelar sucesso e falha

Uma união permite que o resultado assuma uma dentre várias formas. Use uma propriedade literal comum como discriminante. O compilador relaciona a etiqueta ao restante dos campos e ajuda a tratar os caminhos sem inventar valores para a falha.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
type Busca = { ok: true; titulo: string } | { ok: false; motivo: string };
function mensagem(r: Busca) {
  return r.ok ? r.titulo : r.motivo;
}
console.log(mensagem({ ok: false, motivo: 'Ausente' }));
```

A saída é Ausente. O ramo de sucesso tem titulo; o ramo de falha tem motivo.

## 2. Investigue uma variação

Passe uma busca bem-sucedida com o título Ler.

<details>
<summary>Conferir a variação</summary>

mensagem({ ok: true, titulo: 'Ler' }) resulta em Ler.

</details>

## 3. Resolva em outro caso

Modele uma operação de remoção que devolve {ok:true,id:7} ou {ok:false,motivo:'Ausente'}. Mostre o id apenas no sucesso.

<details>
<summary>Conferir a solução e o resultado</summary>

Use `type Remocao = {ok:true; id:number} | {ok:false; motivo:string};` Em if (r.ok), r.id está disponível.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html)
