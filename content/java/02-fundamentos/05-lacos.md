# Laços de repetição

## for

```java
for (int i = 1; i <= 3; i++) {
    System.out.println("Volta " + i);
}
```

O `for` tem três partes: **início** (`int i = 1`), **condição** (`i <= 3`, testada antes de cada volta) e **passo** (`i++`, executado ao fim de cada volta).

## while

Testa a condição **antes** de cada volta. Se ela começar falsa, o corpo nunca roda:

```java
int contador = 0;
while (contador < 3) {
    contador++;
}
```

## do-while

Testa a condição **depois** de cada volta, então o corpo roda **pelo menos uma vez**:

```java
int n = 10;
do {
    System.out.println("Rodou uma vez"); // imprime mesmo com n >= 5
} while (n < 5);
```

## for-each (for aprimorado)

Percorre todos os elementos de um array ou de uma coleção, sem índice:

```java
int[] notas = {7, 9, 10};
for (int nota : notas) {
    System.out.println(nota);
}
```

## break e continue

- `break` **encerra** o laço imediatamente.
- `continue` **pula** o resto da volta atual e vai para a próxima.

```java
for (int i = 0; i < 5; i++) {
    if (i == 1) continue; // pula o 1
    if (i == 3) break;    // para no 3
    System.out.print(i);
}
// imprime 02
```

> [!WARNING]
> Cuidado com o **laço infinito**: se a condição nunca ficar falsa (por exemplo, esquecer o `contador++` no `while`), o programa nunca sai do laço.
