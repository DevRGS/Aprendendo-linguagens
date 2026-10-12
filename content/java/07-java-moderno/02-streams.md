# Streams

Um **stream** (Java 8+) processa uma sequência de dados em etapas, como uma linha de montagem. Em vez de escrever o laço, você descreve **o que** quer:

```java
List<Integer> numeros = List.of(5, 2, 8, 1, 9);

List<Integer> resultado = numeros.stream()   // origem
    .filter(n -> n > 3)                       // fica com os maiores que 3
    .map(n -> n * 10)                         // multiplica cada um por 10
    .sorted()                                 // ordena
    .toList();                                // operação terminal

System.out.println(resultado);   // [50, 80, 90]
```

Todo stream tem três partes:

1. **Origem:** `lista.stream()`, `Stream.of(...)` ou `Arrays.stream(array)`.
2. **Operações intermediárias:** cada uma transforma o stream e devolve outro stream.
3. **Uma operação terminal:** produz o resultado e encerra o stream.

> [!NOTE]
> `toList()` é do Java 16+. Em versões anteriores, use `.collect(Collectors.toList())`. A lista devolvida por `toList()` não pode ser alterada.

## Operações intermediárias

| Operação | O que faz |
|---|---|
| `filter(p)` | fica só com os elementos em que `p` dá `true` |
| `map(f)` | transforma cada elemento com `f` |
| `sorted()` ou `sorted(comparador)` | ordena |
| `distinct()` | tira os repetidos |
| `limit(n)` | fica com os `n` primeiros |
| `skip(n)` | pula os `n` primeiros |

## Operações terminais

| Operação | Resultado |
|---|---|
| `toList()` | uma lista |
| `count()` | quantos elementos há (um `long`) |
| `forEach(acao)` | executa a ação em cada elemento |
| `anyMatch(p)`, `allMatch(p)`, `noneMatch(p)` | `true` ou `false` |
| `findFirst()` | o primeiro elemento, dentro de um `Optional` |
| `collect(...)` | junta os elementos de outras formas (veja abaixo) |

## Números: `mapToInt`, `sum` e `average`

```java
int soma = numeros.stream().mapToInt(Integer::intValue).sum();          // 25
double media = numeros.stream().mapToInt(n -> n).average().orElse(0);  // 5.0
```

`mapToInt` gera um `IntStream`, que tem métodos numéricos como `sum()`, `average()`, `max()` e `min()`. Como um stream vazio não tem média, `average()` devolve um `OptionalDouble`, e o `orElse(0)` dá o valor para esse caso.

## `collect`: juntar e agrupar

```java
List<String> nomes = List.of("Ana", "Bia", "Caio", "Davi", "Eva");

String juntos = nomes.stream().collect(Collectors.joining(", "));
System.out.println(juntos);       // Ana, Bia, Caio, Davi, Eva

Map<Integer, List<String>> porTamanho = nomes.stream()
    .collect(Collectors.groupingBy(String::length));
System.out.println(porTamanho);   // {3=[Ana, Bia, Eva], 4=[Caio, Davi]}
```

`groupingBy` monta um mapa: a chave é o resultado da função (aqui, o tamanho do nome) e o valor é a lista dos elementos com aquela chave. O mapa é um `HashMap`, então a ordem das chaves não é garantida.

## Dois cuidados

> [!IMPORTANT]
> As operações intermediárias são **preguiçosas**: nada roda até aparecer uma operação terminal. Um stream sem operação terminal não faz nada.

> [!CAUTION]
> Um stream só pode ser usado **uma vez**. Depois da operação terminal, usá-lo de novo lança `IllegalStateException`: *stream has already been operated upon or closed*. Para percorrer de novo, crie outro com `lista.stream()`.
