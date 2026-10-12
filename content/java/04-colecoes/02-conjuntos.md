# Conjuntos

Um **conjunto** (`Set`) não guarda repetidos. É a coleção certa para perguntas como "esse e-mail já foi cadastrado?".

```java
Set<String> tags = new HashSet<>();
tags.add("java");
tags.add("sql");
boolean entrou = tags.add("java");         // false: já existia
System.out.println(tags.size());           // 2
System.out.println(tags.contains("sql"));  // true
```

`add` devolve `true` se o item entrou e `false` se ele já estava lá.

## Três implementações, três ordens

| Implementação | Ordem ao percorrer |
|---|---|
| `HashSet` | nenhuma ordem garantida (a mais rápida) |
| `LinkedHashSet` | a ordem de inserção |
| `TreeSet` | a ordem natural (números crescentes, textos em ordem alfabética) |

```java
List<String> entrada = List.of("uva", "maçã", "banana", "uva");

System.out.println(new LinkedHashSet<>(entrada));  // [uva, maçã, banana]
System.out.println(new TreeSet<>(entrada));        // [banana, maçã, uva]
```

> [!WARNING]
> Não conte com a ordem de um `HashSet`: ela depende dos itens e pode mudar entre versões do Java. Se a ordem importa, use `LinkedHashSet` ou `TreeSet`.

> [!NOTE]
> A ordem natural de textos compara os códigos dos caracteres, e todas as letras **maiúsculas vêm antes** das minúsculas. Por isso, um `TreeSet` com `"ana"`, `"Bia"` e `"Caio"` fica `[Bia, Caio, ana]`.

## Tirando os repetidos de uma lista

```java
List<Integer> comRepetidos = List.of(3, 1, 3, 2, 1);
Set<Integer> unicos = new LinkedHashSet<>(comRepetidos);
System.out.println(unicos);   // [3, 1, 2]
```

## Objetos das suas classes: `equals` e `hashCode`

O `HashSet` decide se dois objetos são "o mesmo" com os métodos `equals` e `hashCode`. `String`, `Integer` e as outras classes da biblioteca já os definem. Numa classe sua que não sobrescreve esses dois métodos, dois objetos com os mesmos dados contam como **diferentes**, e o conjunto guarda os dois. Os *records*, do módulo Java Moderno, já vêm com `equals` e `hashCode` prontos.
