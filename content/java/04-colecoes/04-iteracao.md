# Percorrendo coleções

## for-each

O jeito mais comum. Funciona com listas, conjuntos e com o `entrySet()` dos mapas:

```java
List<String> nomes = List.of("Ana", "Bia", "Caio");
for (String nome : nomes) {
    System.out.println(nome);
}
```

## for com índice

Útil em listas, quando você precisa da posição:

```java
for (int i = 0; i < nomes.size(); i++) {
    System.out.println(i + ": " + nomes.get(i));
}
// 0: Ana
// 1: Bia
// 2: Caio
```

## Não remova dentro do for-each

```java
List<String> nomes = new ArrayList<>(List.of("", "Ana", "", "Bia"));
for (String n : nomes) {
    if (n.isEmpty()) {
        nomes.remove(n);     // lança ConcurrentModificationException
    }
}
```

> [!CAUTION]
> Alterar uma lista enquanto o for-each a percorre é um erro. Na maioria dos casos, o Java lança `ConcurrentModificationException`. Nos outros, o laço termina antes da hora e pula itens sem avisar: começando com `["Ana", "", ""]`, sobra `[Ana, ]`.

## Removendo do jeito certo

Com um `Iterator`, que sabe remover o item atual com segurança:

```java
Iterator<String> it = nomes.iterator();
while (it.hasNext()) {
    String n = it.next();
    if (n.isEmpty()) {
        it.remove();
    }
}
System.out.println(nomes);   // [Ana, Bia]
```

Ou, mais curto (Java 8+), com `removeIf`:

```java
nomes.removeIf(n -> n.isEmpty());
```

O trecho `n -> n.isEmpty()` é uma **lambda**: uma pequena função que diz "remova cada `n` para o qual `n.isEmpty()` for verdadeiro". O módulo Java Moderno explica as lambdas em detalhe.
