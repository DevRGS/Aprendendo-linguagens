# Trocar o repositório preservando o contrato

Uma interface especifica métodos e formas de retorno. O caso de uso de criação pode receber uma implementação em memória no exercício e o repositório SQLite na API. A lógica de validação permanece compartilhada. A solução da API usa armazenamento síncrono neste contrato.

## Preparação

[Baixar o laboratório completo](content/typescript/projetos/projeto.zip)

Na pasta **solucao** do ZIP, execute `npm ci` uma vez. Para esta aula, substitua todo o arquivo `tipos/laboratorio.ts` pelo exemplo. Salve, execute `npm run build` e depois `node dist/laboratorio.js`.

## 1. Demonstração

```typescript
import { criarTarefa, type Repositorio, type Tarefa } from './tarefas.js';
const itens = new Map<number, Tarefa>();
const repo: Repositorio = {
  createTask(dono, titulo) { const t = { id: itens.size + 1, titulo, concluida: false }; itens.set(dono, t); return t; },
  task(dono, id) { const t = itens.get(dono); return t?.id === id ? t : null; }
};
console.log(criarTarefa(repo, 1, { titulo: '  SQL ' }).ok);
```

A saída é true. Este dublê guarda apenas a última tarefa de cada usuário e serve para a demonstração com uma tarefa por conta.

## 2. Investigue uma variação

Procure com repo.task(2, 1) após criar para o usuário 1.

<details>
<summary>Conferir a variação</summary>

O retorno é null. A busca começa pelo dono informado.

</details>

## 3. Resolva em outro caso

Ligue a mesma função ao repositório do kit. Confira que o GET obtém a tarefa criada por POST depois de reiniciar a API.

<details>
<summary>Conferir a solução e o resultado</summary>

Em solucao/src/app.mjs, siga repo: store e dono: req => req.session.id até criarTarefa em tipos/rotas.ts. Rode npm start, cadastre conta, crie a tarefa, reinicie e abra a lista. O adaptador usa o arquivo SQLite.

</details>

## Fonte

[Documentação oficial sobre o assunto desta aula](https://www.typescriptlang.org/docs/handbook/2/objects.html)
