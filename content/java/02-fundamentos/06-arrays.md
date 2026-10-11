# Arrays

Um **array** guarda vários valores do **mesmo tipo**, com **tamanho fixo** definido na criação.

```java
int[] numeros = new int[5];             // [0, 0, 0, 0, 0]
String[] nomes = {"Ana", "Bia", "Caio"};
```

## Índices começam em 0

```java
String[] nomes = {"Ana", "Bia", "Caio"};
System.out.println(nomes[0]);                // Ana (primeiro)
System.out.println(nomes[nomes.length - 1]); // Caio (último)
System.out.println(nomes.length);            // 3
```

> [!IMPORTANT]
> Em array, `length` é um **atributo** e se escreve **sem parênteses**. Em `String`, `length()` é um **método**, com parênteses.

> [!CAUTION]
> Num array de tamanho 5, os índices válidos vão de **0 a 4**. Acessar `numeros[5]` lança `ArrayIndexOutOfBoundsException` enquanto o programa roda.

## Valores padrão

Um array criado com `new` já vem preenchido: `0` para números, `false` para `boolean`, o caractere nulo (`'\u0000'`) para `char` e `null` para objetos, como `String`.

## Arrays de duas dimensões

```java
int[][] matriz = {
    {1, 2},
    {3, 4}
};
System.out.println(matriz[1][0]); // 3 (linha 1, coluna 0)
```

## A classe utilitária `Arrays`

```java
import java.util.Arrays;

int[] valores = {3, 1, 2};
Arrays.sort(valores);                         // ordena: [1, 2, 3]
System.out.println(Arrays.toString(valores)); // [1, 2, 3]
int[] copia = Arrays.copyOf(valores, 2);      // [1, 2]
Arrays.fill(valores, 7);                      // [7, 7, 7]
```

> [!TIP]
> `System.out.println(valores)` **não** mostra os elementos: imprime algo como `[I@1b6d3586` (o tipo e um código de identificação). Para ver o conteúdo, use `Arrays.toString(valores)`.
