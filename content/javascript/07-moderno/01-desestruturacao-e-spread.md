# Desestruturação e cópia rasa

Desestruturação extrai valores: `const { nome } = pessoa` e `const [primeiro] = lista`. Você pode dar um padrão para ausência/undefined, como `{ pontos = 0 }`; esse padrão não substitui null.

Spread expande elementos ou propriedades: `[...lista]` cria outro array e `{ ...pessoa }` cria outro objeto com as propriedades próprias enumeráveis correspondentes. Se escrever propriedades depois, elas substituem as de mesmo nome que vieram antes.

Essas cópias são **rasas**. Objetos internos continuam compartilhados, a menos que você também copie o nível que pretende alterar. Spread não garante clonar protótipos, propriedades não enumeráveis ou qualquer grafo de dados.

Rest usa os mesmos três pontos em outro papel: reúne argumentos/elementos restantes. O contexto decide se você está expandindo dados ou coletando o restante.

## Execute e observe

```javascript
{
const pessoa = { nome: "Ana", endereco: { cidade: "Recife" } };
const { nome } = pessoa;
const copia = { ...pessoa, nome: "Bia" };
copia.endereco.cidade = "Olinda";
console.log(nome);
console.log(pessoa.nome);
console.log(pessoa.endereco.cidade);
console.log(copia.nome);
}
```

Saída das chamadas de `console.log`:

```text
Ana
Ana
Olinda
Bia
```

## Sua vez

Crie uma cópia que também copie endereco antes de mudar cidade, preservando a cidade do objeto original.

<details>
<summary>Ver uma solução comentada</summary>

Use `{ ...pessoa, endereco: { ...pessoa.endereco, cidade: "Natal" } }`. Isso copia os dois níveis usados neste exemplo, não promete uma clonagem profunda genérica.

</details>

## Fontes

- [MDN — spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [MDN — trabalhando com objetos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)
