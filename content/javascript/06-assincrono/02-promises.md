# Promises e encadeamento

Uma promise representa um resultado futuro: começa pendente e pode ficar **fulfilled** (realizada com valor) ou **rejected** (rejeitada com motivo). Depois de resolvida para um estado final, ela não muda para o outro.

`then` registra tratamento de sucesso e devolve **outra promise**. Retornar um valor alimenta a próxima etapa; retornar uma promise faz a cadeia acompanhar seu resultado. Se uma callback lança um erro, a promise devolvida é rejeitada.

`catch` trata rejeições da cadeia. `finally` é usado para limpeza que independe do sucesso, como retirar um indicador de carregamento; não é o lugar principal para transformar o valor recebido. Um tratamento que devolve um valor pode recuperar a cadeia.

Esquecer return dentro de uma callback com chaves pode fazer a próxima etapa receber undefined antes do resultado pretendido. Registre tratamento de erro; não deixe rejeições sem observar.

## Execute e observe

```javascript
{
const resultado = Promise.resolve(4);
resultado
  .then(numero => numero * 2)
  .then(numero => console.log(numero))
  .catch(() => console.log("Falha"));
console.log("Registrado");
}
```

Saída das chamadas de `console.log`:

```text
Registrado
8
```

## Sua vez

Troque a callback da primeira etapa por uma que lance `new Error("teste")` e observe o catch.

<details>
<summary>Ver uma solução comentada</summary>

Use `.then(() => { throw new Error("teste"); })`. A próxima etapa de sucesso é pulada e o catch imprime Falha. Lançar não é o mesmo que retornar um objeto Error como um valor normal.

</details>

## Fontes

- [MDN — Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
