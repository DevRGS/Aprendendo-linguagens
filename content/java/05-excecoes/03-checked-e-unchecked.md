# Checked, unchecked, throw e throws

## Lançando uma exceção com `throw`

Você também pode lançar exceções, por exemplo, para recusar um valor inválido:

```java
static void sacar(double valor) {
    if (valor <= 0) {
        throw new IllegalArgumentException("Valor de saque inválido: " + valor);
    }
    System.out.println("Sacando " + valor);
}
```

`throw` interrompe o método na hora, como um `return`, mas sinalizando um erro.

## Checked e unchecked

| Tipo | Quais são | O compilador obriga a tratar? |
|---|---|---|
| **Unchecked** | `RuntimeException` e subclasses, `Error` e subclasses | não |
| **Checked** | todas as outras, como `Exception` e `IOException` | sim |

Para uma exceção **checked**, o compilador exige uma de duas coisas:

1. **Tratar** com `try/catch`; ou
2. **Declarar** com `throws` na assinatura do método, passando a responsabilidade para quem chamar.

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

static String ler(Path caminho) throws IOException {   // declara
    return Files.readString(caminho);                    // Java 11+
}

public static void main(String[] args) {
    try {                                                // trata
        System.out.println(ler(Path.of("dados.txt")));
    } catch (IOException e) {
        System.out.println("Não consegui ler: " + e.getMessage());
    }
}
// se dados.txt não existir: Não consegui ler: dados.txt
```

Sem o `throws` em `ler`, o código não compila: *unreported exception IOException; must be caught or declared to be thrown*.

> [!TIP]
> Exceções checked servem para problemas que quem chama consegue prever e contornar, como um arquivo que não existe. As unchecked indicam erros de programação, como um argumento inválido ou um `null` onde não devia.

## `throw` e `throws` não são a mesma coisa

- `throw` **lança** uma exceção agora: `throw new IllegalArgumentException("...")`.
- `throws` **avisa**, na assinatura do método, que ele pode lançar: `String ler(Path caminho) throws IOException`.
