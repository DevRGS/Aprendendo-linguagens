# O que são exceções

Quando algo dá errado enquanto o programa roda (um número dividido por zero, um texto que não é número, um arquivo que não existe), o Java **lança uma exceção**: um objeto que descreve o problema. Se ninguém tratar a exceção, o programa para e mostra uma mensagem.

```java
class Main {
    public static void main(String[] args) {
        System.out.println(dividir(10, 0));
    }

    static int dividir(int a, int b) {
        return a / b;
    }
}
```

```text
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Main.dividir(Main.java:7)
    at Main.main(Main.java:3)
```

Esse texto é o **stack trace** (rastro da pilha de chamadas):

- A primeira linha diz **qual** exceção aconteceu e a **mensagem** dela (`/ by zero`).
- As linhas `at` dizem **onde**: o método, o arquivo e a linha, da chamada mais recente (no topo) para a mais antiga.

> [!TIP]
> Ao ver um stack trace, leia a primeira linha e depois procure a primeira linha `at` que aponta para o **seu** código. Quase sempre o problema está ali.

## A família das exceções

```text
Throwable
├── Error                      problemas graves da JVM
│   ├── OutOfMemoryError
│   └── StackOverflowError
└── Exception
    ├── IOException            e outras exceções "checked"
    └── RuntimeException       exceções "unchecked"
        ├── ArithmeticException
        ├── NullPointerException
        ├── IllegalArgumentException
        │   └── NumberFormatException
        └── IndexOutOfBoundsException
            └── ArrayIndexOutOfBoundsException
```

- **`Error`**: falhas graves do ambiente, como falta de memória (`OutOfMemoryError`) ou uma recursão sem fim (`StackOverflowError`). Em geral, o programa não tenta tratá-las.
- **`Exception`**: problemas que o programa pode prever e tratar.
- **`RuntimeException`**: em geral, erros de programação, como usar `null` ou um índice fora do array. A aula sobre checked e unchecked mostra por que essa divisão importa.

## Exceções que você já encontrou

| Exceção | Quando acontece |
|---|---|
| `ArithmeticException` | divisão inteira por zero |
| `NullPointerException` | usar uma referência `null` |
| `ArrayIndexOutOfBoundsException` | índice fora do array |
| `NumberFormatException` | converter um texto que não é número |
| `ClassCastException` | cast para o tipo errado |

> [!NOTE]
> Só a divisão **inteira** por zero lança exceção. Com `double`, `10.0 / 0` dá `Infinity`.
