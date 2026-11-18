# Funções pequenas e testes de comportamento

Uma função **pura** depende dos argumentos e não altera dados externos. Isso ajuda a testar: você fornece entradas e compara o resultado esperado. Nem toda parte de um aplicativo pode ser pura, mas você pode separar regras de negócio de DOM, rede e armazenamento.

Escolha casos que revelem erros reais: uma lista vazia, zero, valores no limite ou entrada inválida conforme o contrato. Não calcule o resultado esperado chamando a mesma função que está testando, pois um erro poderia aparecer nos dois lados.

O exemplo define um total de centavos inteiros para uma lista controlada de produtos. Depois cria uma verificação simples que lança uma exceção se houver diferença. Em projetos reais, um framework/runner organiza os resultados; aqui a comparação explícita basta para aprender a ideia.

Limite o contrato: esta função supõe preços e quantidades numéricos válidos. Se quiser aceitar dados de formulário, valide e converta antes, ou acrescente validação e casos correspondentes.

## Execute e observe

```javascript
{
function totalCentavos(itens) {
  return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
}
function conferir(atual, esperado) {
  if (atual !== esperado) throw new Error("Resultado incorreto");
}
conferir(totalCentavos([]), 0);
conferir(totalCentavos([{ preco: 250, quantidade: 2 }]), 500);
console.log("Dois casos passaram.");
}
```

Saída das chamadas de `console.log`:

```text
Dois casos passaram.
```

## Sua vez

Acrescente um teste com dois produtos: 100 centavos vezes 3 e 250 centavos vezes 2.

<details>
<summary>Ver uma solução comentada</summary>

O resultado esperado, calculado independentemente, é 800. Teste `conferir(totalCentavos([{ preco: 100, quantidade: 3 }, { preco: 250, quantidade: 2 }]), 800);`.

</details>

## Fontes

- [MDN — funções](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Functions)
- [MDN — coleções indexadas](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Indexed_collections)
- [MDN — controle de fluxo e erros](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
