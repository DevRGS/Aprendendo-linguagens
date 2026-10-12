# try, catch e finally

## Tratando uma exceção

Coloque o código que pode falhar num bloco `try` e diga, no `catch`, o que fazer se a exceção acontecer:

```java
String texto = "12a";
try {
    int numero = Integer.parseInt(texto);
    System.out.println("Número: " + numero);
} catch (NumberFormatException e) {
    System.out.println("Não é um número: " + e.getMessage());
}
System.out.println("O programa continua.");
// Não é um número: For input string: "12a"
// O programa continua.
```

Quando a exceção acontece, o resto do `try` é pulado e a execução vai para o `catch`. Depois dele, o programa segue normalmente. A variável `e` é a própria exceção, e `e.getMessage()` devolve a mensagem dela.

## Vários `catch`

```java
static void processar(String texto, int divisor) {
    try {
        int n = Integer.parseInt(texto);
        System.out.println(n / divisor);
    } catch (NumberFormatException e) {
        System.out.println("Texto inválido");
    } catch (ArithmeticException e) {
        System.out.println("Conta impossível");
    }
}

processar("12a", 1);   // Texto inválido
processar("12", 0);    // Conta impossível
processar("12", 4);    // 3
```

O Java testa os `catch` de cima para baixo e usa o **primeiro** que combina com a exceção. Por isso, os mais específicos vêm antes dos mais genéricos.

> [!CAUTION]
> Um `catch (Exception e)` antes de um `catch (ArithmeticException e)` não compila: *exception ArithmeticException has already been caught*. O primeiro já pegaria tudo, e o segundo nunca seria usado.

Desde o Java 7, um mesmo `catch` pode tratar vários tipos, separados por `|` (o *multi-catch*):

```java
try {
    System.out.println(Integer.parseInt(texto) / divisor);
} catch (NumberFormatException | ArithmeticException e) {
    System.out.println("Entrada inválida: " + e.getMessage());
}
```

## `finally`: executa sempre

```java
int zero = 0;
try {
    System.out.print("A");
    int x = 10 / zero;
    System.out.print("B");
} catch (ArithmeticException e) {
    System.out.print("C");
} finally {
    System.out.print("D");
}
// ACD
```

O `finally` roda com exceção ou sem, e até depois de um `return` dentro do `try`. É o lugar para liberar recursos, como fechar um arquivo.

```java
static int teste() {
    try {
        return 1;
    } finally {
        System.out.print("F");
    }
}

System.out.print(teste());   // F1
```

> [!WARNING]
> Não escreva `return` dentro do `finally`. Ele substitui o `return` do `try` e ainda faz sumir qualquer exceção que estivesse sendo lançada.
