# JSON: dados em formato de texto

**JSON** é um formato textual de dados, não uma função e não um objeto JavaScript vivo. `JSON.stringify` transforma dados compatíveis em texto; `JSON.parse` interpreta texto JSON e produz um valor JavaScript.

No texto JSON, nomes de propriedades e strings usam aspas duplas. Comentários, funções, undefined e vírgulas finais não fazem parte do formato. `JSON.parse` lança SyntaxError para texto inválido.

Converter para JSON não preserva todo recurso de um objeto: métodos são omitidos, datas não voltam automaticamente como Date e referências cíclicas causam erro em stringify. Não use stringify/parse como promessa de clonagem universal.

Mesmo JSON sintaticamente válido pode ter o formato errado para a aplicação. Depois de parse, confira se recebeu array, se cada campo tem o tipo esperado e se valores fazem sentido. Isso será usado no armazenamento do projeto final.

No exemplo, `try` delimita a tentativa de leitura; se ela lançar, `catch` recebe o erro e permite mostrar seu nome. Você verá esse tratamento em mais detalhes nos módulos de assíncrono e JavaScript moderno.

## Execute e observe

```javascript
{
const original = { nome: "Ana", ativa: true };
const texto = JSON.stringify(original);
console.log(texto);
const lido = JSON.parse(texto);
console.log(lido.nome);
console.log(typeof texto);
try {
  JSON.parse("{invalido}");
} catch (erro) {
  console.log(erro.name);
}
}
```

Saída das chamadas de `console.log`:

```text
{"nome":"Ana","ativa":true}
Ana
string
SyntaxError
```

## Sua vez

Transforme `["ler", "praticar"]` em texto JSON e leia de volta. Confira o resultado com Array.isArray.

<details>
<summary>Ver uma solução comentada</summary>

`const texto = JSON.stringify(["ler", "praticar"]); const lista = JSON.parse(texto); console.log(Array.isArray(lista));` imprime true. Apenas typeof lista seria "object".

</details>

## Fontes

- [MDN — JSON](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)
