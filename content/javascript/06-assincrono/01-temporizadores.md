# Temporizadores e ordem de execução

JavaScript executa cada trecho síncrono até terminar. Um temporizador agenda uma callback para depois: `setTimeout(funcao, atraso)` não pausa a função atual. O atraso é um mínimo aproximado; ocupação da thread e regras do ambiente podem atrasar a execução.

Depois do trecho síncrono atual, callbacks de promises (microtarefas) são processadas antes da próxima tarefa de temporizador. O exemplo ilustra essa ordem; não promete um número exato de milissegundos.

Um trabalho pesado síncrono continua bloqueando a página. Colocá-lo dentro de uma promise ou usar a palavra async não o transforma automaticamente em trabalho em outra thread. Para paralelismo existem recursos como workers, fora do escopo desta introdução.

`setTimeout` devolve um identificador que pode ser passado a clearTimeout para cancelar o agendamento pendente. Evite polling desnecessário quando um evento fornece a resposta de que você precisa.

## Execute e observe

```javascript
{
console.log("início");
setTimeout(() => console.log("temporizador"), 0);
Promise.resolve().then(() => console.log("microtarefa"));
console.log("fim");
}
```

Saída das chamadas de `console.log`:

```text
início
fim
microtarefa
temporizador
```

## Sua vez

Preveja o resultado sem a linha de Promise.resolve. Um atraso zero coloca o temporizador antes de fim?

<details>
<summary>Ver uma solução comentada</summary>

Não. A parte síncrona ainda imprime início e fim primeiro; o temporizador executa depois. O zero não é uma ordem para interromper a execução atual.

</details>

## Fontes

- [MDN — setTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
- [MDN — Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
