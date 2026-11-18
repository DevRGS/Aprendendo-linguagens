# Separar arquivos com import e export

Módulos permitem expor funções com export e consumi-las com import. Cada módulo tem seu próprio escopo e executa em modo estrito. Importações estáticas ficam no nível superior, não dentro de if ou de uma função.

No navegador, abra os exemplos por **HTTP**, usando o servidor da introdução. Caminhos relativos começam com `./` ou `../`, e a extensão faz parte do caminho. Não suponha que o navegador resolve automaticamente pacotes npm ou acrescenta `.js`.

Crie estes **três arquivos na mesma pasta**. `calculos.mjs` exporta a função, `app.mjs` a importa e `index.html` carrega o ponto de entrada. A extensão `.mjs` identifica um módulo JavaScript; o servidor precisa enviá-lo com tipo MIME JavaScript.

Arquivo `calculos.mjs`:

```javascript
export function somar(a, b) {
  return a + b;
}
```

Arquivo `index.html`:

```html
<!doctype html>
<html lang="pt-BR">
<meta charset="utf-8">
<title>Teste de módulos</title>
<p>Abra o console para ver o resultado.</p>
<script type="module" src="app.mjs"></script>
</html>
```

Arquivo `app.mjs` (não envolva este arquivo em um bloco adicional, pois import deve ficar no topo):

## Execute e observe

Salve o bloco a seguir como app.mjs, junto dos dois arquivos descritos acima. Abra index.html pelo endereço HTTP e veja o console.

```javascript
import { somar } from "./calculos.mjs";
console.log(somar(2, 3));
```

Saída das chamadas de `console.log`:

```text
5
```

## Sua vez

Exporte também uma função dobrar em calculos.mjs, importe pelo nome e imprima dobrar(4).

<details>
<summary>Ver uma solução comentada</summary>

Acrescente `export function dobrar(n) { return n * 2; }`, importe com `{ somar, dobrar }` e chame `console.log(dobrar(4));`, que imprime 8.

</details>

## Fontes

- [MDN — módulos](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN — preparar servidor local](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/set_up_a_local_testing_server)
