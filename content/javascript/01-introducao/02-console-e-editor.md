# Prepare o console e o editor

No Chrome ou Firefox, abra o menu do navegador, procure as **ferramentas de desenvolvedor** e selecione **Console**. Em muitos computadores, F12 abre as ferramentas; os atalhos podem variar. O console é diferente da barra de endereços e do terminal Linux/PowerShell.

Digite um comando curto do curso e pressione Enter. Ao criar exemplos maiores, escreva num editor de código ou de texto simples; salve em UTF-8 e confira a extensão real. `index.html.txt` não é o mesmo arquivo que `index.html`. Um editor de documentos com formatação não serve para salvar código-fonte.

## Ler o que aparece

O console pode mostrar o valor de uma expressão além do texto impresso. Após `console.log`, alguns consoles exibem `undefined`, o retorno da própria chamada; isso não é uma segunda mensagem do programa.

Erros também aparecem ali, com linha e arquivo. Leia a primeira mensagem antes de tentar corrigir tudo. Não cole código que você não entende em páginas com seus dados. Se o navegador bloquear colagem, digite os exemplos curtos ou trabalhe no próprio arquivo; não é necessário desativar a proteção.

Os exemplos de linguagem usam um bloco `{ ... }` para limitar as declarações. Assim você pode executá-los novamente sem reutilizar as mesmas variáveis no escopo global do console. As chaves do bloco não são texto para imprimir.

## Execute e observe

```javascript
{
const assunto = "JavaScript";
console.log(assunto);
console.log(typeof 42);
}
```

Saída das chamadas de `console.log`:

```text
JavaScript
number
```

## Sua vez

Execute o bloco duas vezes. Depois mude a mensagem e observe que o nome da variável diferencia maiúsculas.

<details>
<summary>Ver uma solução comentada</summary>

Cada bloco cria seu próprio escopo para `const`. Sem essa separação, algumas formas de redeclarar o mesmo nome no console podem causar erro.

</details>

## Fontes

- [MDN — console](https://developer.mozilla.org/en-US/docs/Web/API/console)
- [MDN — sintaxe e tipos](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Grammar_and_types)
