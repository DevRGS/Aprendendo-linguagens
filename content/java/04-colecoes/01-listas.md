# Listas

Arrays têm tamanho fixo. Quando você não sabe quantos itens virão (os nomes de uma turma, os produtos de um carrinho), use uma **coleção**. A mais usada é a lista.

```java
import java.util.ArrayList;
import java.util.List;

List<String> nomes = new ArrayList<>();
nomes.add("Ana");
nomes.add("Bia");
nomes.add("Caio");
System.out.println(nomes);          // [Ana, Bia, Caio]
System.out.println(nomes.size());   // 3
System.out.println(nomes.get(0));   // Ana
```

- `List` é a interface (o contrato) e `ArrayList` é a implementação mais comum. Declarar a variável como `List` permite trocar a implementação depois sem mexer no resto do código.
- O tipo entre `< >` é o **genérico**: `List<String>` só aceita `String`. O `<>` vazio à direita (o "diamante", Java 7+) repete o tipo da esquerda.
- As coleções ficam no pacote `java.util`. Nos próximos exemplos, considere `import java.util.*;` no topo do arquivo, que importa tudo desse pacote.

## Operações comuns

| Método | O que faz |
|---|---|
| `add(x)` | acrescenta no fim |
| `add(i, x)` | insere na posição `i`, empurrando os outros |
| `get(i)` | devolve o item da posição `i` |
| `set(i, x)` | troca o item da posição `i` |
| `remove(i)` ou `remove(x)` | remove pela posição ou pelo valor |
| `size()` | quantos itens há |
| `contains(x)` | `true` se o item está na lista |
| `indexOf(x)` | a posição da primeira ocorrência, ou `-1` |
| `isEmpty()` | `true` se a lista está vazia |

```java
List<String> frutas = new ArrayList<>();
frutas.add("maçã");
frutas.add("uva");
frutas.add(0, "pera");                        // [pera, maçã, uva]
frutas.set(2, "kiwi");                        // [pera, maçã, kiwi]
frutas.remove("maçã");                        // [pera, kiwi]
System.out.println(frutas.contains("kiwi"));  // true
System.out.println(frutas.indexOf("uva"));    // -1
```

## Listas de números: as classes *wrapper*

Genéricos só aceitam objetos, então `List<int>` não compila (*unexpected type*). Use a classe *wrapper* correspondente: `Integer` para `int`, `Double` para `double`, `Character` para `char` e `Boolean` para `boolean`. A conversão entre `int` e `Integer` é automática (*autoboxing*).

```java
List<Integer> notas = new ArrayList<>();
notas.add(7);                  // o int 7 vira Integer sozinho
int primeira = notas.get(0);   // e volta a ser int
```

> [!CAUTION]
> Em `List<Integer>`, `remove(1)` remove o item da **posição** 1, e não o número 1. Para remover pelo valor, use `remove(Integer.valueOf(1))`.

```java
List<Integer> numeros = new ArrayList<>(List.of(10, 20, 1));
numeros.remove(1);                    // remove a posição 1: [10, 1]
numeros.remove(Integer.valueOf(1));   // remove o valor 1: [10]
```

## Listas que não mudam: `List.of` (Java 9+)

```java
List<String> cores = List.of("azul", "verde");
cores.add("roxo");   // lança UnsupportedOperationException
```

`List.of` cria uma lista **imutável**: `add`, `remove` e `set` lançam `UnsupportedOperationException`. Ela também recusa `null`: `List.of("a", null)` lança `NullPointerException`. Para uma lista que já começa com itens e pode mudar, copie: `new ArrayList<>(List.of("azul", "verde"))`.
