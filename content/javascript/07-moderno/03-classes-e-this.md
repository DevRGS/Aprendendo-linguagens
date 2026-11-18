# Classes, instâncias e this

Uma classe descreve como criar instâncias e compartilhar métodos. `new Contador()` cria uma instância e executa o constructor. A sintaxe de classes se apoia no modelo de protótipos do JavaScript; não cria um sistema de objetos independente dele.

Em um método normal chamado como `objeto.metodo()`, this costuma ser o objeto receptor. **A forma de chamar importa**. Separar o método e chamá-lo sem receptor pode perder esse this; os corpos de classes executam em modo estrito. Para um evento, você pode preservar o objeto com uma wrapper `() => objeto.metodo()` ou usar bind.

Arrow functions não recebem this próprio; capturam o contexto externo. Por isso escrever todo método como arrow em um objeto literal não garante que this seja o próprio objeto.

Use classes quando o modelo de instâncias ajudar. Objetos simples e funções continuam adequados para muitas tarefas; não é obrigatório transformar todo exercício em classe.

## Execute e observe

```javascript
{
class Contador {
  constructor() {
    this.valor = 0;
  }
  incrementar() {
    this.valor += 1;
    return this.valor;
  }
}
const contador = new Contador();
console.log(contador.incrementar());
const outro = new Contador();
console.log(outro.valor);
const executar = () => contador.incrementar();
console.log(executar());
}
```

Saída das chamadas de `console.log`:

```text
1
0
2
```

## Sua vez

Crie um terceiro contador e incremente-o duas vezes. O primeiro contador precisa mudar?

<details>
<summary>Ver uma solução comentada</summary>

Não. Cada constructor inicializou valor em uma instância diferente. Métodos compartilhados usam this para acessar a instância receptora da chamada.

</details>

## Fontes

- [MDN — classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN — arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
