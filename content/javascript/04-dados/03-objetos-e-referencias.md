# Objetos e referências compartilhadas

Um objeto reúne propriedades: `const pessoa = { nome: "Ana", pontos: 2 }`. Acesse por ponto (`pessoa.nome`) ou por colchetes (`pessoa[chave]`) quando o nome da propriedade vem de uma variável.

Atribuir um objeto a outro nome copia a referência, não cria uma árvore de dados independente. `const outra = pessoa` faz os dois nomes apontarem para o mesmo objeto. Objetos escritos separadamente têm identidades diferentes, mesmo com propriedades iguais.

Você pode alterar propriedades de um objeto guardado em const. Congelar o objeto, validar um formato e proteger propriedades são decisões adicionais; a palavra const não faz isso sozinha.

`Object.keys` retorna nomes das propriedades próprias enumeráveis de string. Ele não significa necessariamente todas as informações existentes sobre um objeto. Nesta etapa usamos registros simples, sem herança personalizada.

## Execute e observe

```javascript
{
const pessoa = { nome: "Ana", pontos: 2 };
const outra = pessoa;
outra.pontos += 1;
const chave = "nome";
console.log(pessoa.pontos);
console.log(pessoa[chave]);
console.log(pessoa === outra);
console.log(pessoa === { nome: "Ana", pontos: 3 });
}
```

Saída das chamadas de `console.log`:

```text
3
Ana
true
false
```

## Sua vez

Mude outra.nome para Bia e confira pessoa.nome. Você criou uma pessoa independente?

<details>
<summary>Ver uma solução comentada</summary>

Não: ambos os nomes apontam para o mesmo objeto. pessoa.nome também vira Bia. A aula de spread explica a cópia rasa e seus limites.

</details>

## Fontes

- [MDN — trabalhando com objetos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects)
- [ECMAScript 2026](https://tc39.es/ecma262/2026/)
