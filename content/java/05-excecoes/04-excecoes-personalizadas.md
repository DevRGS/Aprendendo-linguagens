# Exceções personalizadas

As exceções prontas nem sempre descrevem bem o problema do seu programa. Você pode criar as suas: basta estender uma classe de exceção.

```java
class SaldoInsuficienteException extends Exception {
    SaldoInsuficienteException(String mensagem) {
        super(mensagem);              // guarda a mensagem
    }
}

class Conta {
    private double saldo;

    Conta(double saldo) {
        this.saldo = saldo;
    }

    void sacar(double valor) throws SaldoInsuficienteException {
        if (valor > saldo) {
            throw new SaldoInsuficienteException("Saldo insuficiente: faltam " + (valor - saldo));
        }
        saldo -= valor;
    }
}
```

```java
Conta conta = new Conta(100);
try {
    conta.sacar(150);
} catch (SaldoInsuficienteException e) {
    System.out.println(e.getMessage());   // Saldo insuficiente: faltam 50.0
}
```

- Por convenção, o nome termina em `Exception`.
- `super(mensagem)` repassa a mensagem para a superclasse; depois, `getMessage()` a devolve.

## Checked ou unchecked?

| A classe estende | A exceção é |
|---|---|
| `Exception` | checked: quem chama precisa tratar ou declarar |
| `RuntimeException` | unchecked: tratar é opcional |

> [!IMPORTANT]
> Só objetos de classes que estendem `Throwable` (direta ou indiretamente) podem ser lançados. `throw "erro";` não compila: *incompatible types: String cannot be converted to Throwable*.

## Guardando a causa

Ao trocar uma exceção por outra, passe a original como **causa**, para não perder o rastro:

```java
class ConfigInvalidaException extends RuntimeException {
    ConfigInvalidaException(String mensagem, Throwable causa) {
        super(mensagem, causa);
    }
}

try {
    Integer.parseInt("abc");
} catch (NumberFormatException e) {
    throw new ConfigInvalidaException("Porta inválida na configuração", e);
}
```

O stack trace mostra as duas: a nova e, mais abaixo, `Caused by: java.lang.NumberFormatException`.
