# JavaScript, navegador e Web

JavaScript é uma linguagem de programação. No navegador, ela permite responder a cliques, calcular valores e atualizar páginas. **HTML** organiza o conteúdo; **CSS** controla a apresentação; **JavaScript** descreve comportamentos. Java e JavaScript são linguagens diferentes.

A especificação **ECMAScript** define a linguagem. O ambiente oferece recursos adicionais: `document` e eventos vêm do navegador; acesso a arquivos pelo módulo `node:fs` pertence ao Node.js. Um exemplo de DOM não funciona automaticamente no Node só porque ambos executam JavaScript.

Você não precisa instalar Node para começar esta trilha. Use um navegador atualizado e, quando criar arquivos, um editor que salve texto simples. Os exemplos foram escolhidos entre recursos amplamente disponíveis, sem propostas experimentais.

`console.log` escreve uma mensagem no console de desenvolvimento. Textos ficam entre aspas; números não precisam delas. O exemplo usa uma conta e uma mensagem, sem alterar a página.

## Execute e observe

```javascript
{
console.log("Olá, JavaScript!");
console.log(2 + 3);
}
```

Saída das chamadas de `console.log`:

```text
Olá, JavaScript!
5
```

## Sua vez

No console, troque a mensagem pelo seu nome e calcule 10 + 5. A próxima aula explica como abrir o console.

<details>
<summary>Ver uma solução comentada</summary>

`console.log("Meu nome é Ana");` imprime o texto. `console.log(10 + 5);` imprime `15`. JavaScript distingue maiúsculas e minúsculas.

</details>

## Fontes

- [MDN — introdução ao JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Introduction)
- [ECMAScript 2026](https://tc39.es/ecma262/2026/)
