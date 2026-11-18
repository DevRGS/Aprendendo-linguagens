# async, await e tratamento de erros

Uma função `async` sempre devolve uma promise. `await` espera o resultado de uma promise **suspendendo essa função**, sem bloquear toda a thread enquanto a operação está pendente. Se a promise rejeita, await lança o motivo naquele ponto e um try/catch pode tratá-lo.

Use `finally` para ações que precisam ocorrer ao terminar o bloco, com sucesso ou falha. No exemplo, a falha é criada de propósito depois da leitura para mostrar o fluxo. A mensagem exata de erros do ambiente pode variar; evite depender dela para lógica de aplicação.

Dois awaits sequenciais iniciam a segunda operação quando você a chama. Para operações independentes, Promise.all pode acompanhar várias promises já iniciadas; ela rejeita se uma rejeitar e não cancela automaticamente as outras.

Aqui chamamos uma função async normal, de modo que o exemplo funciona no console ou em script clássico. Await no nível superior só é permitido em contextos específicos, como módulos; não o coloque em qualquer script supondo que seja válido.

## Execute e observe

```javascript
{
async function listarTemas() {
  return ["JS", "DOM"];
}
async function iniciar() {
  try {
    const temas = await listarTemas();
    console.log(temas.length);
    throw new Error("Falha simulada");
  } catch (erro) {
    console.log(erro.message);
  } finally {
    console.log("Finalizado");
  }
}
iniciar();
}
```

Saída das chamadas de `console.log`:

```text
2
Falha simulada
Finalizado
```

## Sua vez

Remova o throw para simular sucesso. A mensagem de finally ainda aparece?

<details>
<summary>Ver uma solução comentada</summary>

Sim. A saída fica 2 e Finalizado. Sem a exceção simulada, o catch não é executado.

</details>

## Fontes

- [MDN — async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN — Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN — controle de fluxo e erros](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
