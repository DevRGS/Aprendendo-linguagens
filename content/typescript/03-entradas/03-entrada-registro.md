# Separar a entrada do registro salvo

O cliente escolhe o título; o serviço de persistência atribui id e valor inicial de conclusão. Separar tipos documenta a responsabilidade de cada etapa e torna mais difícil aceitar uma chave de propriedade do cliente no ponto de gravação.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`. Os exemplos sem importação local também podem ser experimentados no [Playground TypeScript em modo estrito](https://www.typescriptlang.org/play?strict=true).

## 1. Demonstração

```typescript
type Entrada = { titulo: string };
type Registro = Entrada & { id: number; concluida: boolean };
function salvar(e: Entrada, id: number): Registro {
  return { id, titulo: e.titulo, concluida: false };
}
console.log(salvar({ titulo: 'Git' }, 3).id);
```

A saída é 3. A demonstração recebe um id didático; a API real obtém esse id do banco.

## 2. Investigue uma variação

Mostre também o estado da tarefa recém-criada.

<details>
<summary>Conferir a variação</summary>

console.log(salvar({ titulo: 'Git' }, 3).concluida) imprime false.

</details>

## 3. Resolva em outro caso

Projete a resposta pública com id e titulo, deixando o estado de fora.

<details>
<summary>Conferir a solução e o resultado</summary>

function resumo(r: Registro) { return { id: r.id, titulo: r.titulo }; } Com o registro da demo resulta em { id:3, titulo:'Git' }.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/objects.html)
