# Optional

Muitos métodos podem não ter o que devolver: buscar um cliente que não existe, pegar o primeiro elemento de uma lista vazia. Devolver `null` é perigoso, porque quem chama pode esquecer de conferir e levar um `NullPointerException`. O **`Optional`** (Java 8+) é uma caixa que **pode** ter um valor, e o tipo deixa isso claro para quem chama.

```java
static Optional<String> buscarEmail(String nome) {
    if ("Ana".equals(nome)) {
        return Optional.of("ana@exemplo.com");
    }
    return Optional.empty();
}
```

## Criando

| Forma | Quando usar |
|---|---|
| `Optional.of(valor)` | o valor com certeza não é `null` (se for, lança `NullPointerException`) |
| `Optional.ofNullable(valor)` | o valor pode ser `null` (nesse caso, o `Optional` fica vazio) |
| `Optional.empty()` | não há valor |

## Usando

```java
Optional<String> email = buscarEmail("Ana");
Optional<String> nada = buscarEmail("Zé");

System.out.println(email.isPresent());                            // true
System.out.println(nada.isEmpty());                               // true (Java 11+)
System.out.println(nada.orElse("sem e-mail"));                    // sem e-mail
System.out.println(email.map(String::toUpperCase).orElse("?"));   // ANA@EXEMPLO.COM
email.ifPresent(e -> System.out.println("Enviando para " + e));   // Enviando para ana@exemplo.com
```

- `orElse(padrao)`: o valor, ou o padrão se estiver vazio.
- `orElseThrow()` (Java 10+): o valor, ou lança `NoSuchElementException` se estiver vazio.
- `map(f)`: transforma o valor, se houver; vazio continua vazio.
- `ifPresent(acao)`: executa a ação só se houver valor.

> [!WARNING]
> `get()` também devolve o valor, mas lança `NoSuchElementException` (*No value present*) se o `Optional` estiver vazio. Prefira `orElse` ou `orElseThrow`, que deixam claro o que acontece no caso vazio.

> [!TIP]
> Use `Optional` como **retorno** de métodos. Em atributos e parâmetros, ele costuma complicar mais do que ajudar.
