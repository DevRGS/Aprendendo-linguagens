# Números, textos e conversões

`number` representa números em ponto flutuante, inclusive inteiros usuais. Há limites de precisão: contas decimais como `0.1 + 0.2` podem não resultar exatamente no decimal esperado. Para valores monetários em exemplos simples, trabalhar com centavos inteiros evita parte desses problemas; aplicações reais precisam de regras de arredondamento claras.

`"10"` é texto; `10` é número. Use **conversão explícita**: `Number("10")` produz 10 e `String(10)` produz `"10"`. Uma entrada inválida como `Number("dez")` resulta em `NaN`; `Number.isNaN` testa esse valor. `NaN === NaN` é falso.

`Number("")` e `Number("   ")` resultam em 0. Se está lendo um campo obrigatório, confira primeiro o texto vazio. `parseInt("12px", 10)` aceita um prefixo inteiro; não é o mesmo contrato de validar a string inteira com Number.

Strings têm métodos: `trim()` remove espaços das pontas; `toUpperCase()` muda a caixa e retorna outro texto. Template literals usam crases e `${expressao}`. O operador `+` pode somar números ou concatenar texto, conforme os valores.

## Execute e observe

```javascript
{
const texto = "12";
console.log(Number(texto) + 3);
console.log(texto + 3);
console.log(Number.isNaN(Number("dez")));
console.log(`Olá, ${" Ana ".trim()}!`);
}
```

Saída das chamadas de `console.log`:

```text
15
123
true
Olá, Ana!
```

## Sua vez

Converta o texto `"8"` para número, some 2 e depois imprima uma frase com o resultado.

<details>
<summary>Ver uma solução comentada</summary>

```javascript
const total = Number("8") + 2;
console.log(`Total: ${total}`);
```

A saída é `Total: 10`. Confira entradas vazias antes de converter dados de formulário.

</details>

## Fontes

- [MDN — Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)
- [MDN — String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
