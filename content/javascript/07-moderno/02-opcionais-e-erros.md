# Valores opcionais e erros explícitos

`?.` interrompe uma cadeia quando o valor à esquerda é null ou undefined, devolvendo undefined em vez de tentar acessar a propriedade. Ele não torna válidos todos os usos: um nome de variável nunca declarado continua podendo lançar ReferenceError, e chamar um valor não função continua sendo um erro quando ele não é nullish.

`??` fornece um padrão só para null/undefined. Ao contrário de `||`, preserva 0, false e string vazia. Escolha conforme o contrato dos dados, em vez de trocar os operadores mecanicamente.

`throw new Error("mensagem")` expressa uma falha. `try/catch` trata exceções ocorridas no fluxo executado dentro do try; não captura magicamente uma rejeição futura que você não aguardou nem encadeou.

Um erro de dados pode merecer mensagem ao usuário, enquanto um seletor incorreto no seu código precisa de correção. Evite engolir toda exceção sem contexto, pois isso esconde a causa.

## Execute e observe

```javascript
{
const perfil = { pontos: 0 };
console.log(perfil.endereco?.cidade ?? "Não informada");
console.log(perfil.pontos ?? 10);
console.log(perfil.pontos || 10);
try {
  throw new Error("Entrada inválida");
} catch (erro) {
  console.log(erro.message);
}
}
```

Saída das chamadas de `console.log`:

```text
Não informada
0
10
Entrada inválida
```

## Sua vez

Troque pontos por null e compare os dois operadores. Depois use false para ver a diferença reaparecer.

<details>
<summary>Ver uma solução comentada</summary>

Com null, ambos usam 10. Com false, ?? preserva false e || usa 10. A escolha depende de quais valores representam ausência na aplicação.

</details>

## Fontes

- [MDN — encadeamento opcional](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
- [MDN — coalescência nula](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
- [MDN — controle de fluxo e erros](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
