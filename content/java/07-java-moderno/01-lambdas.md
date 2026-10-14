# Lambdas e interfaces funcionais

## Comportamento como valor

No módulo Coleções você escreveu `nomes.removeIf(n -> n.isEmpty())`. O trecho `n -> n.isEmpty()` é uma **lambda** (Java 8+): uma função curta, sem nome, que você passa como argumento.

```text
(parametros) -> expressao
(parametros) -> { instrucoes }
```

```java
Function<Integer, Integer> dobro = x -> x * 2;
BiFunction<Integer, Integer, Integer> soma = (a, b) -> a + b;
Runnable ola = () -> System.out.println("Olá!");
Predicate<String> longo = s -> {
    int tamanho = s.length();
    return tamanho > 5;
};

System.out.println(dobro.apply(4));        // 8
System.out.println(soma.apply(2, 3));      // 5
ola.run();                                 // Olá!
System.out.println(longo.test("Java"));    // false
```

- Com um parâmetro só, os parênteses são opcionais: `x -> x * 2`.
- Sem parâmetros, use `()`.
- Com um bloco `{ }`, é preciso `return` quando a lambda devolve algo.

## Interfaces funcionais

Toda lambda implementa uma **interface funcional**: uma interface com **exatamente um método abstrato** (métodos `default` e `static` não contam). O pacote `java.util.function` traz as mais usadas:

| Interface | Recebe | Devolve | Método |
|---|---|---|---|
| `Predicate<T>` | um `T` | `boolean` | `test` |
| `Function<T, R>` | um `T` | um `R` | `apply` |
| `Consumer<T>` | um `T` | nada | `accept` |
| `Supplier<T>` | nada | um `T` | `get` |
| `BiFunction<T, U, R>` | um `T` e um `U` | um `R` | `apply` |

Interfaces mais antigas também são funcionais, como `Runnable` (`run`) e `Comparator` (`compare`). Você pode criar a sua; a anotação `@FunctionalInterface` pede ao compilador que confira se ela tem um só método abstrato:

```java
@FunctionalInterface
interface Operacao {
    int aplicar(int a, int b);
}

Operacao multiplicar = (a, b) -> a * b;
System.out.println(multiplicar.aplicar(3, 4));   // 12
```

Com dois métodos abstratos, o `javac` recusa a anotação: *Unexpected @FunctionalInterface annotation*.

## Referências de método

Quando a lambda só chama um método que já existe, dá para escrever mais curto, com `::`:

| Lambda | Referência de método |
|---|---|
| `s -> s.toUpperCase()` | `String::toUpperCase` |
| `x -> System.out.println(x)` | `System.out::println` |
| `s -> Integer.parseInt(s)` | `Integer::parseInt` |
| `() -> new ArrayList<>()` | `ArrayList::new` |

## Variáveis de fora da lambda

Uma lambda pode **ler** as variáveis locais do método em que foi escrita, desde que sejam `final` ou **efetivamente finais** (nunca reatribuídas):

```java
int limite = 3;
Predicate<String> curto = s -> s.length() <= limite;   // ok: limite nunca muda
System.out.println(curto.test("Ana"));                 // true

int total = 0;
List.of(1, 2, 3).forEach(n -> total += n);
// não compila: local variables referenced from a lambda expression must be final or effectively final
```

Para somar, use um stream (próxima aula): `int total = List.of(1, 2, 3).stream().mapToInt(n -> n).sum();`.
